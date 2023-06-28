// pages/banDetail/banDetail.js
import newRequest from '../../utils/request'
import info from '../../utils/info'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    app_name: info.app_name,
    team_name: info.team_name
  },

  exit: function () {
    wx.exitMiniProgram()
  },

  nav2Mp: function () {
    wx.navigateTo({
      url: '/pages/webview/webview?url=https://mp.weixin.qq.com/s/mPbzfp2bcXNp7_KnU-IiiQ',
    })
  },

  // /user/ban/detail
  getBanDetail: function () {
    var that = this
    wx.login({
      success(res) {
        if (res.code) {
          newRequest('/user/ban/detail', {
            code: res.code,
            system_info: JSON.stringify(wx.getSystemInfoSync())
          }, () => {}, false)
          .then((res2) => {
            
            if(res2.code == 200 || res2.code == 201){
              that.setData({
                ban_detail: res2.ban_detail
              })
            }else if(res2.code == 202){
              wx.reLaunch({
                url: '/pages/home/home',
              })
            }else{
              wx.showToast({title: res2.msg, icon: "none", duration: 1000})
            }
            
          })
        } else {
          wx.showToast({
            title: '登录失败，请稍后再试',
            icon: "none",
            duration: 1000
          })
        }
      }
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
    this.getBanDetail()
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