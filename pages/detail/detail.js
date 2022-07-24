var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    scrollViewRefresherStyle: app.globalData.theme.scrollViewRefresherStyle,
    data_received: false,
    preURL: 'https://i.boatonland.com/avatar/',

    // 举报
    reportType: '', // 'comment' or 'post'
    reportMsg: '',
    reportId: '',
    reportIndex: '',
    reportUserMsg: '',
    comment_placeholder: '想对洞主说些什么？',

    post_id: '',
    postDetail: {},
    commentList: [],
    comment_reverse: false,

    adInfo:[],
    show_comment_box:false,
    comment_box_animation:'',
    comment_id:'',
    comment_msg: '',
    comment_with_serial: false,
    is_author: false,
    comment_box_placeholder: '想对洞主说些什么?',
    comment_is_sending:false,
    focus:false
  },
  // 下拉刷新
  onRefresh() {
    this.setData({
      triggered: true,
    });
    wx.showLoading({
      title: '加载中',
    })
    this.getPostDetail()
  },
  visitUser: function () {
    if (this.data.postDetail.post_school_label == "CUHK" || this.data.postDetail.post_school_label == "UST") {
      wx.showToast({
        title: '暂不支持UNI用户',
        icon: 'none',
        duration: 1000,
      });
      return;
    }
    if (this.data.postDetail.is_org) {
      wx.navigateTo({
        url: "/pages/org/org?user_serial=" + this.data.postDetail.user_serial
      })
    } else if (this.data.postDetail.is_anonymous) {
      wx.navigateTo({
        url: "/pages/visitProfile/visitProfile?is_anonymous=true&user_serial=NA&post_id=" + this.data.postDetail.post_id + "&comment_order=-1"
      })
    } else {
      wx.navigateTo({
        url: "/pages/visitProfile/visitProfile?&user_serial=" + this.data.postDetail.user_serial + "&post_id=" + this.data.postDetail.post_id
      })
    }
  },
  replyComment: function (e) {
    if(e.detail.comment_order == 0){
      var comment_box_placeholder = "Re G:"
    }else{
      var comment_box_placeholder = "Re LG" + e.detail.comment_order + ":"
    }
    if(this.data.postDetail.is_author){
      this.setData({
        comment_msg:'',
        comment_box_placeholder:comment_box_placeholder,
        comment_id:e.detail.comment_id,
        comment_with_serial:true
      })
    }else{
      this.setData({
        comment_msg:'',
        comment_box_placeholder:comment_box_placeholder,
        comment_id:e.detail.comment_id,
        comment_with_serial:false
      })
    }
    this.showCommentBox()
  },

  reportPost: function () {
    this.reportPrompt.show();
    this.setData({
      reportMsg: this.data.postDetail.post_msg,
      reportId: this.data.postDetail.post_id,
      reportType: 'post',
    });
  },
  reportComment: function (e) {
    const {
      comment_msg,
      comment_index,
      comment_id
    } = e.detail;
    this.reportPrompt.show();
    this.setData({
      reportMsg: comment_msg,
      reportId: comment_id,
      reportIndex: comment_index,
      reportType: 'comment',
    });
  },
  reportPromptGetInput: function (e) {
    this.setData({
      reportUserMsg: e.detail.value,
    });
  },
  reportPromptCancel: function () {
    this.reportPrompt.hide();
  },
  reportPromptConfirm: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    if (that.data.reportType == 'post') {
      var report_msg = "举报了#" + that.data.postDetail.post_id + "「" + that.data.postDetail.post_msg + "」，理由为「" + that.data.reportUserMsg + "」"
    }
    if (that.data.reportType == 'comment') {
      var report_msg = "举报了#" + that.data.postDetail.post_id + "的评论LG" + that.data.reportIndex + "「" + that.data.reportMsg + "」，理由为「" + that.data.reportUserMsg + "」"
    }
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/post/single/report.php',
      method: 'POST',
      data: {
        token: wx.getStorageSync('token'),
        report_msg: report_msg,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          wx.showToast({
            title: '举报成功',
            icon: 'none',
            duration: 1000,
          });
        } else if (res.data.code == 800 || res.data.code == 900) {
          app.launch().then(res => {
            that.reportPromptConfirm()
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
            duration: 1000
          })
        }
      }
    })
  },

  getPostDetail: function () {
    var that = this;
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/post/single/get.php',
      method: 'POST',
      data: {
        token: wx.getStorageSync('token'),
        post_id: that.data.post_id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.setData({
            postDetail: res.data.postDetail,
            commentList: res.data.commentList,
            data_received: true,
            triggered: false,
          })
          if (res.data.postDetail.is_author) {
            that.setData({
              comment_placeholder: "想在自己的树洞下补充些什么？"
            })
          }

        } else if (res.data.code == 401) {
          wx.navigateBack({
            delta: 1,
            success() {
              wx.showToast({
                title: "树洞不存在或已被删除",
                icon: "none",
                duration: 1000
              })
            }
          })
        } else if (res.data.code == 800 || res.data.code == 900) {
          app.launch().then(res => {
            that.getPostDetail()
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
            duration: 1000
          })
        }
      }
    })
  },
  getAd: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/info/detailad.php',
      method: 'POST',
      data: {
        token: wx.getStorageSync('token')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        if (res.data.code == 200) {
          that.setData({
            adInfo:res.data.adInfo
          })
        }  else if (res.data.code == 800 || res.data.code == 900) {
          app.launch().then(res => {
            that.getAd()
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
            duration: 1000
          })
        }
      }
    })
  },
  showMainMenu: function () {
    var that = this
    if (that.data.postDetail.is_author) {
      if (that.data.postDetail.post_public == '1') {
        wx.showActionSheet({
          itemList: ['设为私密', '删除'],
          success(res) {
            if (res.tapIndex == 0) {
              that.setPrivate()
            } else if (res.tapIndex == 1) {
              app.showModal({
                title: "确认删除？",
                content: "删除后将无法恢复",
                success(res) {
                  if (res.confirm) {
                    that.delete()
                  }
                }
              })
            }
          }
        })
      } else if (that.data.postDetail.post_public == '2') {
        wx.showActionSheet({
          itemList: ['设为公开', '删除'],
          success(res) {
            if (res.tapIndex == 0) {
              that.setPublic()
            } else if (res.tapIndex == 1) {
              app.showModal({
                title: "确认删除？",
                content: "删除后将无法恢复",
                success(res) {
                  if (res.confirm) {
                    that.delete()
                  }
                }
              })
            }
          }
        })
      }
    } else {
      if (that.data.postDetail.is_following) {
        wx.showActionSheet({
          itemList: ['取消围观', '举报'],
          success(res) {
            if (res.tapIndex == 0) {
              that.follow()
            } else if (res.tapIndex == 1) {
              that.reportPost()
            }
          }
        })
      } else {
        wx.showActionSheet({
          itemList: ['围观', '举报'],
          success(res) {
            if (res.tapIndex == 0) {
              that.follow()
            } else if (res.tapIndex == 1) {
              that.reportPost()
            }
          }
        })
      }

    }

  },
  follow: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/post/single/follow.php',
      method: 'POST',
      data: {
        token: wx.getStorageSync('token'),
        post_id: that.data.postDetail.post_id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.data.postDetail.is_following = !that.data.postDetail.is_following
          that.data.postDetail.follower_num = Number(that.data.postDetail.follower_num) + 1
          that.setData({
            postDetail: that.data.postDetail,
          })
          wx.showToast({
            title: '开始围观⭐w⭐',
            icon: 'none',
            duration: 1000,
          });
        } else if (res.data.code == 201) {
          that.data.postDetail.is_following = !that.data.postDetail.is_following
          that.data.postDetail.follower_num = Number(that.data.postDetail.follower_num) - 1
          that.setData({
            postDetail: that.data.postDetail,
          })
          wx.showToast({
            title: '停止了围观',
            icon: 'none',
            duration: 1000,
          });
        } else if (res.data.code == 800 || res.data.code == 900) {
          app.launch().then(res => {
            that.follow()
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
            duration: 1000
          })
        }
      }
    })
  },
  setPrivate: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/post/single/private.php',
      method: 'POST',
      data: {
        token: wx.getStorageSync('token'),
        post_id: that.data.postDetail.post_id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.data.postDetail.post_public = '2'
          that.setData({
            postDetail: that.data.postDetail,
          })
          wx.showToast({
            title: '成功设为私密',
            icon: 'none',
            duration: 1000,
          });
        } else if (res.data.code == 800 || res.data.code == 900) {
          app.launch().then(res => {
            that.setPrivate()
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
            duration: 1000
          })
        }
      }
    })
  },
  setPublic: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/post/single/public.php',
      method: 'POST',
      data: {
        token: wx.getStorageSync('token'),
        post_id: that.data.postDetail.post_id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.data.postDetail.post_public = '1'
          that.setData({
            postDetail: that.data.postDetail,
          })
          wx.showToast({
            title: '成功设为公开',
            icon: 'none',
            duration: 1000,
          });
        } else if (res.data.code == 800 || res.data.code == 900) {
          app.launch().then(res => {
            that.setPublic()
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
            duration: 1000
          })
        }
      }
    })
  },
  delete: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/post/single/delete.php',
      method: 'POST',
      data: {
        token: wx.getStorageSync('token'),
        post_id: that.data.postDetail.post_id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 1000,
          });
          setTimeout(() => {
            that.getPostDetail()
          }, 1000)
        } else if (res.data.code == 800 || res.data.code == 900) {
          app.launch().then(res => {
            that.delete()
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
            duration: 1000
          })
        }
      }
    })
  },
  deleteComment: function (e) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/comment/delete.php',
      method: 'POST',
      data: {
        token: wx.getStorageSync('token'),
        comment_id: e.detail,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          wx.showToast({
            title: '删除成功',
            icon: 'none',
            duration: 1000,
          });
          setTimeout(() => {
            that.getPostDetail()
          }, 1000)
        } else if (res.data.code == 800 || res.data.code == 900) {
          app.launch().then(res => {
            that.deleteComment(e)
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
            duration: 1000
          })
        }
      }
    })
  },
  vote: function (e) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/vote/post.php',
      method: 'POST',
      data: {
        token: wx.getStorageSync('token'),
        option_id: e.currentTarget.dataset.optionid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.getPostDetail()
        } else if (res.data.code == 201) {
          that.getPostDetail()
        } else if (res.data.code == 800 || res.data.code == 900) {
          app.launch().then(res => {
            that.vote(e)
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
            duration: 1000
          })
        }
      }
    })
  },


  previewPic: function () {
    wx.previewImage({
      urls: [this.data.postDetail.post_image],
    });
  },
  goToComment: function () {
    // wx.navigateTo({
    //   url: '/pages/writeComment/writeComment?post_id=' + this.data.postDetail.post_id + '&is_author=' + this.data.postDetail.is_author,
    // });
    if(this.data.postDetail.is_author){
      this.setData({
        comment_msg:'',
        comment_box_placeholder:'想在自己的树洞下补充些什么？',
        comment_id:'',
        comment_with_serial:true
      })
    }else{
      this.setData({
        comment_msg:'',
        comment_box_placeholder:'想对洞主说些什么',
        comment_id:'',
        comment_with_serial:false
      })
    }
    this.showCommentBox()
  },
  // 评论倒序
  reverseComments: function () {
    const commentList = this.data.commentList.reverse();
    this.setData({
      commentList: commentList,
      comment_reverse: !this.data.comment_reverse,
    });
  },
  onTapBilibili: function () {
    wx.navigateToMiniProgram({
      appId: 'wx7564fd5313d24844',
      path: "pages/video/video?bvid=" + this.data.postDetail.post_media.bilibili_bv
    })
  },
  onTapNetease: function () {
    wx.showLoading({
      title: '获取中',
    });
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    backgroundAudioManager.title = this.data.postDetail.post_media.netease_title;
    backgroundAudioManager.epname = this.data.postDetail.post_media.netease_epname;
    backgroundAudioManager.singer = this.data.postDetail.post_media.netease_aritst;
    backgroundAudioManager.coverImgUrl = this.data.postDetail.post_media.netease_image;
    // 设置了 src 之后会自动播放
    backgroundAudioManager.src =
      'http://music.163.com/song/media/outer/url?id=' + this.data.postDetail.post_media.netease_id;
    backgroundAudioManager.onPlay(() => {
      wx.hideLoading();
    });
    backgroundAudioManager.onError(() => {
      wx.hideLoading();
      wx.showToast({
        title: '版权受限',
        icon: 'none',
        duration: 1000,
      });
    })
  },
  onTapQuote: function () {
    if (this.data.postDetail.post_media.post_id == '') {
      wx.showToast({
        title: '该内容不存在或已被删除',
        icon: 'none',
        duration: 1000
      })
      return
    }
    wx.navigateTo({
      url: '/pages/detail/detail?post_id=' + this.data.postDetail.post_media.post_id,
    })
  },
  onTapArticle: function () {
    wx.navigateTo({
      url: '/pages/webview/webview?url=' + this.data.postDetail.post_media.article_link,
    })
  },
  onTapMiniapp: function () {
    wx.navigateToMiniProgram({
      appId: this.data.postDetail.post_media.miniapp_appid,
      path: this.data.postDetail.post_media.miniapp_path,
    })
  },
  onTapAd:function(){
    var adInfo = this.data.adInfo
    switch (adInfo.ad_type) {
      case 'article':
        wx.navigateTo({
          url: '/pages/webview/webview?url=' + adInfo.article_link,
        });
        break;
      case 'post':
          wx.navigateTo({
            url: '/pages/detail/detail?post_id=' + adInfo.post_id,
          });
          break;
      case 'inner':
        wx.navigateTo({ url: adInfo.inner_path });
        break;
      case 'miniapp': 
        wx.navigateToMiniProgram({
          appId: adInfo.miniapp_appid,
          path: adInfo.miniapp_path,
        })
        break;
      case 'none':
      default:
        break;
    }
  },
  showCommentBox:function(e){
    var that = this;
    var animation  = wx.createAnimation({
        duration:500,
        timingFunction:'ease-out'
      })
    that.animation = animation
    animation.translateY(400).step()
    that.setData({
      comment_box_animation: animation.export(),
      show_comment_box:true,
      focus:true
    })
    setTimeout(function(){
      animation.translateY(0).step()
      that.setData({
        comment_box_animation: animation.export(),
      })
    },50)
  },
  hideCommentBox:function(e){
    var that = this;
    var animation  = wx.createAnimation({
        duration:500,
        timingFunction:'ease-out'
      })
    that.animation = animation
    animation.translateY(400).step()
    that.setData({
      comment_box_animation: animation.export(),
    })
    setTimeout(function(){
      animation.translateY(0).step()
      that.setData({
        comment_box_animation: animation.export(),
        show_comment_box:false,
        focus:false,
        comment_msg:'',
        comment_box_placeholder:'想对洞主说些什么',
        comment_id:'',
        comment_with_serial:false
      })
    },50)
  },
  bindCommentMsgInput: function (e) {
    this.setData({
      comment_msg: e.detail.value,
    });
  },
  // 选择是否带编号
  switchSerialChange: function (e) {
    this.setData({ comment_with_serial: e.detail.value });
  },
  submitComment: function () {
    var that = this
    if(that.data.comment_is_sending){
      return
    }
    wx.showLoading({
      title: '发送中',
    })
    that.setData({
      comment_is_sending:true
    })
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/comment/post.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        post_id:that.data.postDetail.post_id,
        comment_id:that.data.comment_id,
        comment_msg:that.data.comment_msg,
        comment_with_serial:that.data.comment_with_serial,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        that.setData({
          comment_is_sending:false
        })
        if(res.data.code == 200){
          wx.showToast({title: "发布成功", icon: "none", duration: 1000})
          that.hideCommentBox()
          that.getPostDetail()
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.submitComment()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    if (options.post_serial) {
      this.setData({
        post_id: options.post_serial
      })
    } else {
      this.setData({
        post_id: options.post_id
      });
    }
    this.getAd()
    var systemInfo = wx.getSystemInfoSync()
    if (app.globalData.themeInfo.primaryColorLight) {
      if (systemInfo.theme == 'dark') {
        this.setData({
          tintStyle: "background:" + app.globalData.themeInfo.primaryColorDark + ";"
        })
      } else {
        this.setData({
          tintStyle: "background:" + app.globalData.themeInfo.primaryColorLight + ";"
        })
      }
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.reportPrompt = this.selectComponent('#reportPrompt')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getPostDetail();
  },

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
    let msg = this.data.postDetail.post_msg
    if (msg.length > 20) {
      msg = msg.slice(0, 20) + '...';
    }
    console.log(msg)
    return {
      path: `/pages/home/home?jump_page=detail&post_serial=${this.data.postDetail.post_id}`,
      title: 'HKU树洞用户: ' + msg,
    };
  },
});