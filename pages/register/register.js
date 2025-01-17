var app = getApp();
import newRequest from "../../utils/request"
const info = require("../../utils/info")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    app_name: 'Triple Uni',
    school_label: app.globalData.school_label,
    school_label_lower: 'uni',
    primary_color: info.primary_color_on_light,
    user_itsc: '',
    email: '',
    auth_sent: false,
    agree: false,
    // suffixes: info.email_suffixes,
    // suffix_idx: 0,
    email_suffix: '',
    vcode_vcode: '',
    vcode_key: '',
    is_sending: false,
    is_posting: false,
    from_miniapp: false,
    mode: 'email',
    user_portal_password: '',
    theme: wx.getSystemInfoSync().theme,
    contact_email: info.contact_email,
    terms_url: info.terms_url
  },

  // /user/register/wechat/email
  sendVcode: function () {
    var that = this
    if (that.data.auth_sent) {
      app.showModal({
        title: '请勿重复操作',
        showCancel: false,
        content: '验证码已发送，有一定几率在垃圾邮件箱噢',

      });
      return;
    }
    if (that.data.email.match(/^\s*$/)) {
      app.showModal({
        title: '警告',
        showCancel: false,
        content: '邮箱不能为空',
      });
      return;
    }
    wx.showLoading({
      title: '发送中',
    });

    that.setData({
      is_sending: true
    })

    newRequest("/user/register/wechatuni/email", {
        user_email: that.data.email
      }, () => {}, false, false)
      .then((res) => {
        that.setData({
          is_sending: false
        })
        if (res.code == 200) {
          that.setData({
            auth_sent: true,
            vcode_key: res.vcode_key,
            school_label: res.user_school_label,
            email_suffix: res.user_email_suffix,
            user_itsc: res.user_itsc
          })
          app.showModal({
            title: '验证码已发送',
            showCancel: false,
            content: '验证码已发送,请留意垃圾邮件箱!',

          });
        } else if (res.code == 401) {
          // wx.setClipboardData({
          //   data: 'https://tripleuni.com/',
          //   success: function () {
          //     app.showModal({
          //       title: '请使用Web版「Triple Uni」登录',
          //       showCancel: false,
          //       content:'出于对后续开发及运营方面的综合考量，我们正计划从小程序版向web版逐渐过渡，因此目前对'+ that.data.app_name +'新注册用户暂不开放小程序版本，您可以通过 https://tripleuni.com/ 访问' + that.data.app_name+ '。\n网址复制至剪切板',
          //     });
          //   }, 
          //   fail: function () {
          //     app.showModal({
          //       title: '请使用Web版「Triple Uni」登录',
          //       showCancel: false,
          //       content:'出于对后续开发及运营方面的综合考量，我们正计划从小程序版向web版逐渐过渡，因此目前对'+ that.data.app_name +'新注册用户暂不开放小程序版本，您可以通过 https://tripleuni.com/ 访问'+ that.data.app_name + '。',
          //     });
          //   }
          // })
        } else {
          app.showModal({
            title: '提示',
            content: res.msg,
            showCancel: false,
          })
        }
      })
  },


  // /user/register/wechat/verify
  register: function () {
    var that = this
    if (that.data.mode == "email") {
      if (!that.data.auth_sent) {
        app.showModal({
          title: '提示',
          showCancel: false,
          content: '请先获取验证码',

        });
        return;
      }
      if (that.data.email.match(/^\s*$/)) {
        app.showModal({
          title: '警告',
          showCancel: false,
          content: '邮箱不能为空',

        });
        return;
      }
      if (that.data.vcode_vcode.match(/^\s*$/)) {
        app.showModal({
          title: '警告',
          showCancel: false,
          content: '验证码不能为空',

        });
        return;
      }
      if (!that.data.agree) {
        app.showModal({
          title: '提示',
          showCancel: false,
          content: '请先同意「用户服务协议」与「隐私政策」',

        });
        return;
      }
      wx.showLoading({
        title: '提交中',
      })
      that.setData({
        is_posting: true
      })
      wx.login({
        success(res) {
          if (res.code) {
            newRequest("/user/register/wechatuni/verify", {
              user_itsc: that.data.user_itsc,
              user_email_suffix: that.data.email_suffix,
              vcode_vcode: that.data.vcode_vcode,
              vcode_key: that.data.vcode_key,
              code: res.code,
              user_school_label: that.data.school_label,
              system_info: JSON.stringify(wx.getSystemInfoSync())
            }, () => {}, false, false).then((res2) => {
              if (res2.code == 200) {
                wx.setStorageSync('token', res2.token)
                wx.setStorageSync('user_school_label', that.data.school_label)
                wx.setStorageSync('block_splash', true)
                if (that.data.relaunch_path) {
                  wx.restartMiniProgram({
                    path: that.data.relaunch_path,
                  })
                } else {
                  wx.restartMiniProgram({
                    path: '/pages/home/home',
                  })
                }
                // app.globalData.show_privacy = false
                // app.globalData.token_checked = true 
                // app.globalData.privacy_checked = true
                // wx.reLaunch({
                //   url: '/pages/home/home',
                // })
                // wx.closeSocket()
                // app.launchWebSoccket()
              } else if (res2.code == 401) {
                app.showModal({
                  title: '注册失败',
                  content: '验证码错误,请检查',
                  showCancel: false,

                })
                that.setData({
                  is_posting: false,
                })
              } else if (res2.code == 402) {
                app.showModal({
                  title: '注册失败',
                  content: '社团账号请使用账号密码登录',
                  showCancel: false,

                })
                that.setData({
                  auth_sent: false,
                  is_posting: false
                })
              } else if (res2.code == 404) {
                app.showModal({
                  title: '注册失败',
                  content: '该邮箱已注册',
                  showCancel: false,

                })
                that.setData({
                  auth_sent: false,
                  is_posting: false
                })
              } else {
                app.showModal({
                  title: '提示',
                  content: res2.msg,
                  showCancel: false,

                })
                that.setData({
                  auth_sent: false,
                  is_posting: false
                })
              }
            })
          } else {
            wx.showToast({
              title: '登录失败，请稍后再试',
              icon: "none",
              duration: 1000
            })
            that.setData({
              'vcode_vcode': ''
            })
          }

        }
      })
    } else {
      if (that.data.email == "") {
        app.showModal({
          title: '警告',
          showCancel: false,
          content: '邮箱不能为空',

        });
        return;
      }
      if (that.data.user_portal_password.match(/^\s*$/)) {
        app.showModal({
          title: '警告',
          showCancel: false,
          content: 'PIN不能为空',

        });
        return;
      }
      if (!that.data.agree) {
        app.showModal({
          title: '提示',
          showCancel: false,
          content: '请先同意「用户服务协议」与「隐私政策」',

        });
        return;
      }
      wx.showLoading({
        title: '提交中',
      })
      that.setData({
        is_posting: true
      })

      newRequest("/user/register/wechatuni/org", {
          user_itsc: that.data.email,
          org_password: that.data.user_portal_password,
        }, () => {}, false, false)
        .then(res2 => {
          if (res2.code == 200) {
            wx.setStorageSync('token', res2.token)
            wx.setStorageSync('user_school_label', res2.user_school_label)
            wx.setStorageSync('block_splash', true)
            if (that.data.relaunch_path) {
              wx.restartMiniProgram({
                path: that.data.relaunch_path,
              })
            } else {
              wx.restartMiniProgram({
                path: '/pages/home/home',
              })
            }
            // wx.reLaunch({
            //   url: '/pages/home/home',
            // })
            // wx.closeSocket()
            // app.launchWebSoccket()
          } else {
            app.showModal({
              title: '提示',
              content: res2.msg,
              showCancel: false,

            })
            that.setData({
              auth_sent: false,
              is_posting: false
            })
          }
        })


    }


  },

  agreeChange: function (e) {
    this.setData({
      agree: !this.data.agree
    })
  },

  // bindPickerChange: function(e) {
  //   console.log('picker发送选择改变，携带值为', e)
  //   this.setData({
  //     index: e.detail.value
  //   })
  // },

  handleSuffixChange(e) {
    const idx = e.detail.value;
    this.setData({
      suffix_idx: idx
    });
  },

  uidInput: function (e) {
    this.setData({
      email: e.detail.value
    })
  },
  vcodeInput: function (e) {
    this.setData({
      vcode_vcode: e.detail.value
    })
  },

  passwordInput: function (e) {
    this.setData({
      user_portal_password: e.detail.value
    })
  },

  changeMode: function (e) {
    this.setData({
      mode: e.currentTarget.dataset.mode
    })
  },


  changeSuffix: function () {
    var that = this
    wx.showActionSheet({
      alertText: "选择邮箱后缀",
      itemList: that.data.suffixes,
      success(res) {
        that.setData({
          suffix_idx: res.tapIndex
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    // console.log(decodeURIComponent(options.launch_path))
    wx.hideHomeButton()

    if (app.globalData.from_miniapp) {
      this.setData({
        from_miniapp: true
      })
    }
    wx.onThemeChange((result) => {
      this.setData({
        theme: result.theme
      })
    })

    if (options.launch_path) {
      this.setData({
        relaunch_path: decodeURIComponent(options.launch_path)
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: info.slogan,
      imageUrl: info.share_cover,
    };
  },
});