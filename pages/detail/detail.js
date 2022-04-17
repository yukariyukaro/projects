var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    scrollViewRefresherStyle: app.globalData.theme.scrollViewRefresherStyle,
    data_received: false,
    preURL: 'https://i.boatonland.com/avatar/',
    

    isSending: false,
    comment_remnant: 500,
    comment_placeholder: '想对这个树洞的拥有者说什么？',
    triggered: false,

    // 举报
    reportType: '', // 'comment' or 'post'
    reportMsg: '',
    reportId: '',
    reportIndex: '',
    reportUserMsg: '',

    post_serial:'',
    postDetail:{},
    commentList:[],
    comment_reverse: false,
  },
  // 下拉刷新
  onRefresh() {
    this.setData({
      triggered: true,
    });
    this.getPostDetail()
  },
  visitUser: function () {
    if (this.data.postDetail.is_anonymous){
      wx.navigateTo({
        url: "/pages/visitProfile/visitProfile?is_anonymous=true&user_serial=NA&post_id=" + this.data.postDetail.post_id
      })
    }else{
      wx.navigateTo({
        url: "/pages/visitProfile/visitProfile?&user_serial=" + this.data.postDetail.user_serial + "&post_id=" + this.data.postDetail.post_id
      })
    }
  },
  replyComment: function (e) {
    const {
      post_serial
    } = this.data;
    const comment_index = e.detail;
    const comment_floor = comment_index == '0' ? 'G层' : `LG${comment_index}`;
    const re_comment = `Re ${comment_floor}: `;
    app.globalData.tem_comment = re_comment;
    app.globalData.tem_comment_with_serial = true;
    app.globalData.tem_comment_post = post_serial;
    // 跳转到撰写页面
    this.goToComment();
  },

  reportPost: function () {
    this.reportPrompt.show();
    this.setData({
      reportMsg: this.data.postDetail.post_msg,
      reportId: this.data.post_serial,
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
    if(that.data.reportType == 'post'){
      var report_msg = "举报了#" + that.data.post_serial + "「" + that.data.postDetail.post_msg + "」，理由为「"+ that.data.reportUserMsg +"」"
    }
    if(that.data.reportType == 'comment'){
      var report_msg = "举报了#" + that.data.post_serial + "的评论LG"+ that.data.reportIndex +"「" + that.data.reportMsg + "」，理由为「"+ that.data.reportUserMsg +"」"
    }
    var that = this
    wx.request({
      url: 'https://pupu.boatonland.com/v1/post/report.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        report_msg:report_msg,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
            wx.showToast({title: '举报成功',icon: 'none',duration: 1000,});
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.reportPromptConfirm()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })
  },

  getPostDetail: function () {
    var that = this;
    var that = this
    wx.request({
      url: 'https://pupu.boatonland.com/v1/post/detail.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        post_id:that.data.post_serial,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
            that.setData({
              postDetail:res.data.postDetail,
              commentList:res.data.commentList,
              data_received:true,
              triggered: false,
            })
        }else if(res.data.code == 401){
          wx.navigateBack({
            delta: 1,
            success(){
              wx.showToast({title: "树洞不存在或已被删除", icon: "none", duration: 1000})
            }
          })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getPostDetail()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })
  },
  showMainMenu:function(){
    var that = this
    if(that.data.postDetail.is_author){
      if(that.data.postDetail.post_public == '1'){
        wx.showActionSheet({
          itemList: ['设为私密','删除'],
          success (res) {
            if(res.tapIndex == 0){
              that.setPrivate()
            }else if(res.tapIndex == 1){
              wx.showModal({
                title:"确认删除？",
                content:"删除后将无法恢复",
                success(res){
                  if(res.confirm){
                    that.delete()
                  }
                }
              })
            }
          }
        })
      }else if(that.data.postDetail.post_public == '2'){
        wx.showActionSheet({
          itemList: ['设为公开','删除'],
          success (res) {
            if(res.tapIndex == 0){
              that.setPublic()
            }else if(res.tapIndex == 1){
              wx.showModal({
                title:"确认删除？",
                content:"删除后将无法恢复",
                success(res){
                  if(res.confirm){
                    that.delete()
                  }
                }
              })
            }
          }
        })
      }
    }else{
      if(that.data.postDetail.is_following){
        wx.showActionSheet({
          itemList: ['取消围观','举报'],
          success (res) {
            if(res.tapIndex == 0){
              that.follow()
            }else if(res.tapIndex == 1){
              that.reportPost()
            }
          }
        })
      }else{
        wx.showActionSheet({
          itemList: ['围观','举报'],
          success (res) {
            if(res.tapIndex == 0){
              that.follow()
            }else if(res.tapIndex == 1){
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
      url: 'https://pupu.boatonland.com/v1/post/follow.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        post_id:that.data.post_serial,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
            that.data.postDetail.is_following = !that.data.postDetail.is_following
            that.data.postDetail.follower_num = Number(that.data.postDetail.follower_num) + 1
            that.setData({
              postDetail:that.data.postDetail,
            })
            wx.showToast({title: '开始围观⭐w⭐',icon: 'none',duration: 1000,});
        }else if(res.data.code == 201){
          that.data.postDetail.is_following = !that.data.postDetail.is_following
          that.data.postDetail.follower_num = Number(that.data.postDetail.follower_num) - 1
          that.setData({
            postDetail:that.data.postDetail,
          })
          wx.showToast({title: '停止了围观',icon: 'none',duration: 1000,});
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.follow()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
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
      url: 'https://pupu.boatonland.com/v1/post/setPrivate.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        post_id:that.data.post_serial,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
            that.data.postDetail.post_public = '2'
            that.setData({
              postDetail:that.data.postDetail,
            })
            wx.showToast({title: '成功设为私密',icon: 'none',duration: 1000,});
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.setPrivate()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
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
      url: 'https://pupu.boatonland.com/v1/post/setPublic.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        post_id:that.data.post_serial,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
            that.data.postDetail.post_public = '1'
            that.setData({
              postDetail:that.data.postDetail,
            })
            wx.showToast({title: '成功设为公开',icon: 'none',duration: 1000,});
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.setPublic()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
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
      url: 'https://pupu.boatonland.com/v1/post/delete.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        post_id:that.data.post_serial,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
            wx.showToast({title: '删除成功',icon: 'none',duration: 1000,});
            setTimeout(() => {
              that.getPostDetail()
            }, 1000)
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.delete()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
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
      url: 'https://pupu.boatonland.com/v1/comment/delete.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        comment_id:e.detail,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
            wx.showToast({title: '删除成功',icon: 'none',duration: 1000,});
            setTimeout(() => {
              that.getPostDetail()
            }, 1000)
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.deleteComment(e)
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })
  },


  
  // 预览大图片
  previewPic: function () {
    wx.previewImage({
      urls: [this.data.postDetail.post_image],
    });
  },
  // 跳转
  goToComment: function () {
    wx.navigateTo({
      url: '/pages/writeComment/writeComment?post_id=' + this.data.post_serial +'&is_author=' + this.data.postDetail.is_author,
    });
  },
  // 评论倒序
  reverseComments: function () {
    const commentList = this.data.commentList.reverse();
    this.setData({
      commentList: commentList,
      comment_reverse: !this.data.comment_reverse,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '树洞详情',
    });
    this.setData({
      post_serial: options.post_serial
    });
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
    return {
      path: `/pages/home/home?jump_page=detail&post_serial=${this.data.post_serial}`,
      title: 'HKU树洞用户: ' + msg,
    };
  },
});