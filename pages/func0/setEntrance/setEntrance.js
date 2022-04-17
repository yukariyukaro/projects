Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  bindGetUserInfo(e) {
    if (e.detail.userInfo) {
      const nickName = e.detail.userInfo.nickName;
      const avatarUrl = e.detail.userInfo.avatarUrl;
      console.log(nickName + avatarUrl + '同意授权');
      wx.navigateTo({
        url: '/pages/func0/setProblem/setProblem?nickName=' + nickName + '&avatarUrl=' + avatarUrl,
      });
    } else {
      console.log('拒绝授权');
    }
  },
  onLoad: function () {
    wx.setNavigationBarTitle({
      title: 'HKU友情测试',
    });
  },
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
