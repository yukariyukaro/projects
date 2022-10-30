// pages/banDetail/banDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  exit: function () {
    wx.exitMiniProgram()
  },

  nav2Mp: function () {
    wx.navigateTo({
      url: '/pages/webview/webview?url=https://mp.weixin.qq.com/s/mPbzfp2bcXNp7_KnU-IiiQ',
    })
  },

  getBanDetail: function () {
    var that = this
    wx.login({
      success(res) {
        if (res.code) {
          wx.request({
            url: 'https://api.pupu.hkupootal.com/v3/user/ban/detail.php',
            method: 'POST',
            data: {
              code: res.code,
              system_info: JSON.stringify(wx.getSystemInfoSync())
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success(res2) {
              if(res2.data.code == 200){
                that.setData({
                  ban_detail: res2.data.ban_detail
                })
              }else if(res2.data.code == 300){
                wx.reLaunch({
                  url: '/pages/home/home',
                })
              }else{
                wx.showToast({title: res2.data.msg, icon: "none", duration: 1000})
              }

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