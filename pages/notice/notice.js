var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeList:[],
    userInfo:[],
    scroll_top: 0,
    page:0,
    isLast:false,
    is_loading_more:false,
    refresh_triggered: false,
  },

  getUserInfo: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/user/profile/my.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
            that.setData({
              userInfo:res.data.userInfo
            })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getUserInfo()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  acceptSubscribe: function (e) {
    var that = this
    if(e.detail.value){
      app.showModal({
        title:"开启推送",
        content:"请在新界面勾选「总是保持以上选择，不再询问」并选择「允许」",
        showCancel:false,
        success(res){
          if(res.confirm){
            app.subscribe(true).then(function(bool){
              console.log(bool)
              if(bool){
                that.accept(true)
              }else{
                that.data.userInfo.subscribe_accept = false
                that.setData({
                  userInfo:that.data.userInfo
                })
              }
            }
            )
          }
        }
      })
    }else{
      that.accept(false)
    }

  },
  accept: function (e) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/notice/accept.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        subscribe_accept:e
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          that.data.userInfo.subscribe_accept = true
          that.setData({
            userInfo:that.data.userInfo
          })
          wx.showToast({title: '开启推送成功', icon: "none", duration: 1000})
        }else if(res.data.code == 201){
          that.data.userInfo.subscribe_accept = false
          that.setData({
            userInfo:that.data.userInfo
          })
          wx.showToast({title: '关闭推送成功', icon: "none", duration: 1000})
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.accept(e)
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  getNotice: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/notice/get.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        page:that.data.page,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          if(that.data.page == '0'){
            that.setData({
              noticeList:res.data.noticeList,
              isLast:res.data.isLast,
              refresh_triggered: false,
              is_loading_more: false,
            })
            wx.stopPullDownRefresh()
          }else{
            that.setData({
              noticeList:that.data.noticeList.concat(res.data.noticeList),
              isLast:res.data.isLast,
              refresh_triggered: false,
              is_loading_more: false,
            })
          }
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getPost()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  nav2Notice:function(e){
    this.readNotice(e)
    var noticeList = this.data.noticeList
    noticeList = noticeList.map(item => {
      if(item.notice_url == e.currentTarget.dataset.url){
        item.notice_is_read = '1'
      }
      return item
    })
    this.setData({
      noticeList:noticeList
    })
    var match = e.currentTarget.dataset.url.match(/(\/pages\/teasingwall\/teasingwall\?emotion_message_id=)([0-9]+)/)
    if(match){
      app.globalData.emotion_message_id = match[2]
      wx.reLaunch({
        url: '/pages/teasingwall/teasingwall',
      })
    }else{
      wx.navigateTo({
        url: e.currentTarget.dataset.url
      })
    }
  },
  readNotice: function (e) {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/notice/read.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        notice_id:e.currentTarget.dataset.noticeid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.readNotice()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  clearNotice: function () {
    var that = this
    app.showModal({
      title:"提示",
      content:"确认清空未读通知？",
      showCancel:true,
      success(res){
        if(res.confirm){
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
            url: 'https://api.pupu.hkupootal.com/v3/notice/clear.php', 
            method: 'POST',
            data: {
              token:wx.getStorageSync('token'),
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success (res) {
              wx.hideLoading()
              if(res.data.code == 200){
                that.onRefresh()
                wx.removeTabBarBadge({
                  index: 1,
                })
                wx.setStorageSync('notice_count', '0')
              }else if(res.data.code == 800 ||res.data.code == 900){
                app.launch().then(res=>{
                  that.clearNotice()
                })
              }else{
                wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
              }
            }
          })
        }
      }
    })

  },
  onRefresh() {
    this.setData({
      page:0,
      refresh_triggered: true,
    });
    wx.showLoading({
      title: '加载中',
    })
    this.getNotice()
  },
  onLoadMore: function () {
    if(this.data.isLast){
      return
    }
    this.setData({
      is_loading_more: true,
      page:this.data.page + 1
    });
    this.getNotice()
  },
  bindScroll:function(e){
    // console.log(e.detail.scrollHeight - e.detail.scrollTop)
    if(this.data.is_loading_more){return}
    if(e.detail.scrollHeight - e.detail.scrollTop < 2500){
      this.onLoadMore()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
    this.getNotice()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})