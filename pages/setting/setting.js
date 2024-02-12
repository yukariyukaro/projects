var app = getApp()
import newRequest from "../../utils/request"
const info = require("../../utils/info.js")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    subscribe_accept: false,
    web_subscribe_accept: false,
    ban_uni_post: false,
    allow_home_swipe: false,
    service_account_name: info.service_account,
    statusbar_height: wx.getSystemInfoSync().statusBarHeight,
    theme: app.globalData.theme,
  },

  checkMethod: function () {
    var that = this
    newRequest("/notice/checkaccept", {}, that.checkMethod)
      .then(res => {
        if (res.code == 200) {
          that.setData({
            subscribe_accept: res.notice_accept_service,
            web_subscribe_accept: res.notice_accept_webpush
          })
        } else {
          wx.showToast({
            title: res.msg ? res.msg : "错误",
            icon: "none",
            duration: 1000
          })
        }
      })
  },

  // /notice/accept
  serviceAccountNotification: function (e) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    newRequest("/notice/accept", {
      notice_accept: e.detail.value,
      notice_method: 'service'
    }, that.serviceAccountNotification).then(res => {
      if (res.code == 200) {
        that.setData({
          subscribe_accept: true
        })
        wx.showToast({
          title: '开启公众号推送成功',
          icon: "none",
          duration: 1000
        })
      } else if (res.code == 210) {
        that.setData({
          subscribe_accept: false
        })
        wx.showToast({
          title: '关闭公众号推送成功',
          icon: "none",
          duration: 1000
        })
      } else if (res.code == 401) {
        that.setData({
          subscribe_accept: false
        })
        wx.showToast({
          title: '没有关注' + info.service_account,
          icon: "none",
          duration: 1000
        })
        wx.navigateTo({
          url: '/pages/followService/followService',
        })
      } else {
        wx.showToast({
          title: res.msg ? res.msg : "错误",
          icon: "none",
          duration: 1000
        })
      }
    })
  },

  // /notice/accept
  webNotification: function (e) {
    var that = this
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    newRequest("/notice/accept", {
      notice_accept: e.detail.value,
      notice_method: 'webpush'
    }, that.webNotification).then(res => {
      if (res.code == 201) {
        that.setData({
          web_subscribe_accept: true
        })
        wx.showToast({
          title: '开启Web推送成功',
          icon: "none",
          duration: 1000
        })
      } else if (res.code == 211) {
        that.setData({
          web_subscribe_accept: false
        })
        wx.showToast({
          title: '关闭Web推送成功',
          icon: "none",
          duration: 1000
        })
      } else if (res.code == 401) {
        that.setData({
          web_subscribe_accept: false
        })
        wx.showModal({
          title: '未开启网页端推送授权',
          content: '请前往 tripleuni.com 并启动浏览器消息通知权限。',
          showCancel: false
        })
       
      } else {
        wx.showToast({
          title: res.msg ? res.msg : "错误",
          icon: "none",
          duration: 1000
        })
      }
    })
  },


  clearUnread: function () {
    var that = this
    app.showModal({
      title: "提示",
      content: "确认清空未读消息？",
      showCancel: true,
      success(res) {
        if (res.confirm) {
          newRequest("/notice/clear", {})
            .then(res => {
              if (res.code == 200) {
                var db = app.initDatabase()
                var chat = db.chat
                var chat_list = chat.get()
                chat_list.forEach(item => {
                  item.chat_unread_count = 0
                  chat.where({
                    chat_id: item.chat_id
                  }).update(item)
                })
                wx.removeTabBarBadge({
                  ndex: 1,
                })
                wx.setStorageSync('allNoticeCount', 0)
                wx.setStorageSync('systemNoticeCount', 0)
                wx.showToast({
                  title: '清理成功',
                  icon: "none",
                  duration: 1000
                })
              } else {
                wx.showToast({
                  title: '清理失败',
                  icon: "none",
                  duration: 1000
                })
              }
            })
        }
      }
    })
  },

  regetMessage: function () {
    var that = this
    app.showModal({
      title: "确认重新获取消息？",
      content: "获取过程可能略有卡顿，且流量消耗较大",
      showCancel: true,
      success(res) {
        if (res.confirm) {
          app.clearDB()
          app.globalData.gettingChatList = []
          wx.showToast({
            title: '后台获取中',
            icon: "none",
            duration: 1000
          })
          setTimeout(() => {
            app.getHistoryMessage()
          }, 1000);
        }
      }
    })
  },
  setBanUniPost: function (e) {
    wx.setStorageSync('ban_uni_post', e.detail.value)
  },
  setAllowHomeSwipe: function (e) {
    wx.setStorageSync('allow_home_swipe', e.detail.value)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkMethod()
    this.setData({
      ban_uni_post: wx.getStorageSync('ban_uni_post'),
      allow_home_swipe: wx.getStorageSync('allow_home_swipe')
    })
    wx.onThemeChange((result) => {
      this.setData({
        theme: app.globalData.theme
      })
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
    this.setData({
      theme: app.globalData.theme,
    })
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