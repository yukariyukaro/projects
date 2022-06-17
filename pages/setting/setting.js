var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    subscribe_accept:false,
    banUniPost:false
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
              subscribe_accept:res.data.userInfo.subscribe_accept
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
  clearUnread:function(){
    var that = this
    app.showModal({
      title:"提示",
      content:"确认清空未读消息？",
      showCancel:true,
      success(res){
        if(res.confirm){
          var db = app.initDatabase()
          var chat = db.chat
          var chat_list = chat.get()
          chat_list.forEach(item => {
            item.chat_unread_count = 0
            chat.where({
              chat_id: item.chat_id
            }).update(item)
          })
          wx.setStorageSync('allNoticeCount', 0)
          wx.setStorageSync('systemNoticeCount', 0)
          wx.showToast({title: '清理成功', icon: "none", duration: 1000})
        }
      }
    })
  },
  regetMessage:function(){
    var that = this
    app.showModal({
      title:"确认重新获取消息？",
      content:"获取过程可能略有卡顿，且流量消耗较大",
      showCancel:true,
      success(res){
        if(res.confirm){
          app.clearDB()
          app.globalData.gettingChatList = []
          wx.showToast({title: '后台获取中', icon: "none", duration: 1000})
          setTimeout(() => {
            app.getHistoryMessage()
          }, 1000);
        }
      }
    })
  },
  setBanUniPost:function(e){
    wx.setStorageSync('banUniPost', e.detail.value)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
    this.setData({
      banUniPost:wx.getStorageSync('banUniPost')
    })
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