// pages/followService/followService.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  check: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/one/check.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          wx.reLaunch({
            url: '/pages/one/one',
          })
        }else if(res.data.code == 201){
          
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.check()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
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