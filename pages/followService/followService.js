const { default: newRequest } = require("../../utils/request")

// pages/followService/followService.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  check: function () {
    var that = this
    newRequest("/user/profile/get", {}, that.check)
    .then(res=>{
      if(res.code == 200){
        if(res.user_info.is_following_service_account){
          wx.reLaunch({
            url: '/pages/search/search',
          })
        }
      }
    })
  },
  nav2Home:function(){
    wx.reLaunch({
      url: '/pages/home/home',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    this.check()
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