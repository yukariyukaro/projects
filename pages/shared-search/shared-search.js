// pages/search/search.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    serial: '',
  },
  bindSearchInput: function (e) {
    this.setData({
      serial: e.detail.value,
    });
  },
  search: function () {
    let serial = this.data.serial;
    if (serial.match(/^\s*$/)) return;
    while (serial.length < 6) {
      serial = '0' + serial;
    }
    serial = 'U' + serial;
    wx.navigateTo({
      url: '/pages/shared-detail/shared-detail?post_serial=' + serial,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {},
});
