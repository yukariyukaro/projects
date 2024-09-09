const decode_token = require("../../utils/jwt-decode")
const info = require("../../utils/info")
var app = getApp()

// pages/enterTripleUni/enterTripleUni.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    school_label: info.school_label,
    relaunch_path: ''
  },

  check: function () {
    var that = this
    let token = wx.getStorageSync('token')
    if (token) {
      let stored_school_label = wx.getStorageSync('user_school_label')
      let token_school_label = decode_token(token)
      if (stored_school_label == token_school_label || token_school_label != 'HKU' || stored_school_label != 'HKU'){
        if (that.data.relaunch_path){
          wx.reLaunch({
            url: that.data.relaunch_path,
          })
        } else {
          wx.reLaunch({
            url: '/pages/home/home',
          })
        }
      }
    }
  },

  nav2Home:function(){
    wx.reLaunch({
      url: '/pages/home/home',
    })
  },

  enter(){
    wx.showToast({
      title: '正在进入',
      duration: 2000,
      icon: 'loading'
    })
    app.login(this.data.relaunch_path)
    .catch(() => {
      wx.showToast({
        title: '进入失败请重试',
        duration: 1000,
        icon: 'error'
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    console.log(options)
    console.log(decodeURIComponent(options.launchPath))
    if(options.launchPath){
      this.setData({
        relaunch_path: decodeURIComponent(options.launchPath)
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // this.check()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})