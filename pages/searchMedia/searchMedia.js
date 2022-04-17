const app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    inputTxt: '',
    source: '',
    result: undefined,
    shared: false
  },
  delete: function () {
    this.setData({
      inputTxt: ' ',
    });
  },
  bindSearchInput: function (e) {
    this.setData({
      inputTxt: e.detail.value,
    });
  },

  searchNetease: util.throttle(function () {
    wx.showLoading();
    wx.cloud.init();
    const that = this;
    // 调用云函数 获取 内容
    wx.cloud.callFunction({
      name: 'searchMusic',
      data: {
        body: {
          inputTxt: this.data.inputTxt,
        },
      },
      success: (res) => {
        wx.hideLoading();
        const result = res.result;
        console.log(result);
        if (result.error != 'false') {
          app.showModal({
            title: '错误',
            showCancel: false,
            content: '搜寻音乐发生错误: ' + result.error,
          });
        } else {
          that.setData({
            result: result.data
          });
        }
        console.log('云函数调用成功');
      },
      fail: (err) => {
        wx.hideLoading();
        app.showModal({
          title: '失败',
          content: '搜寻音乐发生错误' + err,
        });
        console.error('云函数调用失败', err);
        wx.hideLoading();
      },
    });
  }),
  searchBilibili: util.throttle(function () {
    wx.showLoading();
    wx.cloud.init();
    const that = this;
    // 调用云函数 获取 内容
    wx.cloud.callFunction({
      name: 'searchBilibili',
      data: {
        body: {
          inputTxt: this.data.inputTxt,
        },
      },
      success: (res) => {
        wx.hideLoading();
        const result = res.result;
        console.log(result);
        if (result.error != 'false') {
          app.showModal({
            title: '错误',
            showCancel: false,
            content: '搜寻视频发生错误: ' + result.error,
          });
        } else {
          that.setData({
            result: result.data
          });
        }
        console.log('云函数调用成功');
      },
      fail: (err) => {
        wx.hideLoading();
        app.showModal({
          title: '失败',
          content: '搜寻视频发生错误' + err,
        });
        console.error('云函数调用失败', err);
        wx.hideLoading();
      },
    });
  }),
  confirmResult: function () {
    const result = this.data.result;
    if (!this.data.shared) {
      wx.setStorageSync('music_id', result.musicId);
      wx.setStorageSync('music_source', result.musicSource);
      wx.setStorageSync('music_title', result.title);
      wx.setStorageSync('music_cover', result.cover);
      wx.setStorageSync('music_epname', result.epname);
      wx.setStorageSync('music_player', result.player);
    } else {
      wx.setStorageSync('shared_music_id', result.musicId);
      wx.setStorageSync('shared_music_source', result.musicSource);
      wx.setStorageSync('shared_music_title', result.title);
      wx.setStorageSync('shared_music_cover', result.cover);
      wx.setStorageSync('shared_music_epname', result.epname);
      wx.setStorageSync('shared_music_player', result.player);
    }

    wx.navigateBack({
      delta: 1,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      source,
      shared
    } = options;
    this.setData({
      shared: shared === "true",
      source: source
    })
    wx.setNavigationBarTitle({
      title: source === 'NETEASE' ? '选择唱片' : '选择视频',
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