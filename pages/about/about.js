// pages/about/about.js
const info = require("../../utils/info")
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    app_name:info.app_name,
    is_dark: '',
    version: '4.4.0',
    school_label: info.school_label,
    team_name: info.team_name,
    theme: app.globalData.theme
  },

  logoAnimation: function () {
    this.animate(
      '.avatar-ripple',
      [
        { opacity: 0.8, scale: [1, 1] },
        { opacity: 0, scale: [1.5, 1.5] },
      ],
      1500,
      () => {
        this.clearAnimation('.avatar-ripple');
      }
    )
    setTimeout(() => {
      this.logoAnimation()
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.logoAnimation()
    var systemInfo = wx.getSystemInfoSync()
    this.setData({
      is_dark: systemInfo.theme == 'dark',
    })
    console.log(systemInfo)
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