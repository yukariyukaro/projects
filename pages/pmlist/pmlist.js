var app = getApp()
const localDB = require('../../utils/database.js')
const _ = localDB.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preURL: 'https://i.boatonland.com/avatar/',
    chat_list: [],
    systemNoticeCount: 0,
    statusbar_height: wx.getSystemInfoSync().statusBarHeight
  },

  setPageData:function(){
    var that = this
    var db = app.initDatabase()
    var chat = db.chat
    var chat_list = chat.orderBy('chat_latest_pm_id', 'desc').get()
    // console.log(chat_list)
    that.setData({
      chat_list:chat_list
    })
  },
  nav2PmDetail:function(e){
    wx.navigateTo({
      url: '/pages/pmdetail/pmdetail?chat_id=' + e.currentTarget.dataset.chatid,
    })
    app.subscribe(false)
    var that = this
    var db = app.initDatabase()
    var chat = db.chat
    var chat_list = chat.where({
      chat_id: e.currentTarget.dataset.chatid
    }).limit(1).get()
      var newChatDetail = chat_list[0]
      var oldUnreadCount = newChatDetail.chat_unread_count
      newChatDetail.chat_unread_count = 0
      chat.where({
        chat_id: e.currentTarget.dataset.chatid
      }).update(newChatDetail)
      var allNoticeCount = wx.getStorageSync('allNoticeCount') - oldUnreadCount
      if(allNoticeCount>0){
        wx.setStorageSync('allNoticeCount', allNoticeCount)
      }else{
        wx.setStorageSync('allNoticeCount', 0)
      }
  },
  nav2Notice:function(){
    wx.navigateTo({
      url: '/pages/notice/notice'
    })
    app.subscribe(false)
    var that = this

  },

  longpress:function(e){
    var that = this
    wx.showActionSheet({
      itemList: ['删除并屏蔽用户'],
      success (res) {
        if(res.tapIndex == 0){
          app.deleteChat(e.currentTarget.dataset.chatid, e.currentTarget.dataset.unreadcount)
          setTimeout(() => {
            that.setPageData()
          }, 1000);
        } 
      }
    })
  },

  // updateTabbar:function(){
  //   var notice_count = wx.getStorageSync('allNoticeCount')
  //   if(notice_count > 0){
  //     wx.setTabBarBadge({
  //       index: 2,
  //       text: String(notice_count),
  //     })
  //   }else{
  //     wx.removeTabBarBadge({
  //       index: 2,
  //     })
  //   }
  //   if(wx.getStorageSync('showOneRedDot')){
  //     wx.showTabBarRedDot({
  //       index:1
  //     })
  //   }
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.open_notice){
      wx.navigateTo({
        url: '/pages/notice/notice',
      })
    }
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
    this.getTabBar().setData({ selected: 3 })
    this.setPageData()
    app.globalData.indexJS = this
    app.globalData.tabbarJS = this
    app.updateTabbar()
    this.setData({
      systemNoticeCount:wx.getStorageSync('systemNoticeCount'),
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.indexJS = ''
    app.globalData.tabbarJS = ''
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.globalData.indexJS = ''
    app.globalData.tabbarJS = ''
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
    return {
      title: info.slogan,
      imageUrl: info.share_cover,
    };
  },
})