var app = getApp();
var sessionID;
var user_itsc;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sheets: [],
    done_sheets: [],
  },

  // 获取用户的出题
  fetchUserSheets: function () {
    wx.showLoading({
      title: '加载中',
    });
    const url = app.globalData.URL + '/getsheetlist';
    const data = null;
    app.request('POST', url, data).then((res) => {
      wx.hideLoading();
      if (res.error == 'false') {
        this.setData({
          sheets: res.sheets,
          done_sheets: res.done_sheets,
        });
        // 如果正在刷新，则把triggered关上
        if (this.data.refresh_triggered) {
          this.setData({ refresh_triggered: false });
        }
      } else {
        app.showModal({
          title: '提示',
          showCancel: false,
          content: '获取测试题目失败' + res.error,
        });
        console.log(res);
      }
    });
  },

  // 去自己的问卷详情
  ownSheetDetail: function (e) {
    const sheet_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url:
        '/pages/func0/problemDetail/problemDetail?sheet_id=' + sheet_id + '&user_itsc=' + user_itsc,
    });
  },
  // 去别人的问卷详情
  otherSheetDetail: function (e) {
    const sheet_id = e.currentTarget.dataset.id;
    const user_itsc = e.currentTarget.dataset.itsc;
    wx.navigateTo({
      url:
        '/pages/func0/problemDetail/problemDetail?sheet_id=' + sheet_id + '&user_itsc=' + user_itsc,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    user_itsc = wx.getStorageSync('user_itsc');
    var that = this;
    wx.setNavigationBarTitle({
      title: 'HKU友情测试',
    });
    // 首先登陆检查
    sessionID = wx.getStorageSync('sessionID');
    // 如果用户缓存不存在：先登录再获取
    if (sessionID == '') {
      app.userLogin().then((res) => {
        if (res) {
          sessionID = wx.getStorageSync('sessionID');
          that.fetchUserSheets();
        }
      });
    } else {
      that.fetchUserSheets();
    }
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
