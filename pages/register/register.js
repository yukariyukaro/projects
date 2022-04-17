var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    user_itsc:'',
    authSent: false,
    agree: false,
    suffixes: ['@hku.hk', '@connect.hku.hk'],
    suffix_idx: 0,
    secondaryColor: app.globalData.theme.secondary,
    vcode_vcode:'',
    vcode_key:'',
    isSending:false,
    isPosting:false
  },
  sendVcode:function(){
    var that = this
    if (that.data.authSent) {
      app.showModal({
        title: '请勿重复操作',
        showCancel: false,
        content: '验证码已发送，有一定几率在垃圾邮件箱噢',
      });
      return;
    }
    if (that.data.user_itsc.match(/^\s*$/)) {
      app.showModal({
        title: '警告',
        showCancel: false,
        content: 'UID不能为空',
      });
      return;
    }
    wx.showLoading({
      title: '发送中',
    });
    that.setData({
      isSending:true
    })
    wx.request({
      url: 'https://pupu.boatonland.com/v1/user/sendVcode.php', 
      method: 'POST',
      data: {
        user_itsc:that.data.user_itsc,
        user_email_suffix:that.data.suffixes[that.data.suffix_idx],
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        that.setData({
          isSending:false
        })
        if(res.data.code == 200){
            that.setData({
              authSent:true,
              vcode_key:res.data.vcode_key,
            })
            wx.showModal({
              title: '验证码已发送',
              showCancel: false,
              content:'验证码已发送,请留意垃圾邮件箱!',
            });
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })
  },
  register:function(){
    var that = this
    if (!that.data.authSent) {
      app.showModal({
        title: '提示',
        showCancel: false,
        content: '请先获取验证码',
      });
      return;
    }
    if (that.data.user_itsc.match(/^\s*$/)) {
      app.showModal({
        title: '警告',
        showCancel: false,
        content: 'UID不能为空',
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
        content: '请先同意「用户条款及声明」',
      });
      return;
    }
    wx.showLoading({
      title: '提交中',
    })
    that.setData({
      isPosting:true
    })
    wx.login({
      success (res) {
        if(res.code){
          wx.request({
            url: 'https://pupu.boatonland.com/v1/user/register.php', 
            method: 'POST',
            data: {
              user_itsc:that.data.user_itsc,
              user_email_suffix:that.data.suffixes[that.data.suffix_idx],
              vcode_vcode:that.data.vcode_vcode,
              vcode_key:that.data.vcode_key,
              code:res.code
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success (res2) {
              wx.hideLoading()
              that.setData({
                isPosting:false
              })
              if(res2.data.code == 200){
                  wx.setStorageSync('token', res2.data.token)
                  wx.reLaunch({
                    url: '/pages/home/home',
                  })
              }else{
                wx.showToast({title: res2.data.msg, icon: "error", duration: 1000})
              }
            }
          })
        }else{
          wx.showToast({title: '登录失败，请稍后再试', icon: "none", duration: 1000})
        }
      }
  })
    
  },
  agreeChange: function (e) {
    this.setData({
      agree:!this.data.agree
    })
  },
  handleSuffixChange(e) {
    const idx = e.detail.value;
    this.setData({ suffix_idx: idx });
  },
  uidInput:function(e){
    this.setData({
      user_itsc:e.detail.value
    })
  },
  vcodeInput:function(e){
    this.setData({
      vcode_vcode:e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.hideHomeButton();
    wx.setNavigationBarTitle({ title: '验证UID' });
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
      title: 'HKU噗噗',
      imageUrl: '/images/cover.png',
    };
  },
});
