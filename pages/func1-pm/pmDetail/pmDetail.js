var app = getApp();
var Channel = require('../../../utils/Channel.js');
const {
  deletePm
} = require('../utils/utils');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    preURL: 'https://i.boatonland.com/avatar/',
    type: '',
    pm_id: '',
    pm_date:'',
    sender_serial: '',
    sender_avatar: '',
    receiver_serial: '',
    pm_msg : '',
    pm_id: '',
    pm_is_read: '',
    post_id: '',
  },
  visitUser: function () {
    if (this.data.sender_serial == '匿名') return;
    wx.navigateTo({
      url: "/pages/visitProfile/visitProfile?user_serial=" + this.data.sender_serial
    });
  },
  visitPost: function () {
    if(this.data.post_id == "NA"){
      return
    }
    wx.navigateTo({
      url: "/pages/detail/detail?post_serial=" + this.data.post_id
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '私信详情',
    });
    // channel中取数据
    const detail = Channel.getChannel();
    console.log(detail);
    this.setData({
        type: detail.type,
        pm_date:detail.pm_date,
        sender_serial: detail.sender_serial,
        sender_avatar: detail.sender_avatar,
        receiver_serial: detail.receiver_serial,
        pm_msg : detail.pm_msg,
        pm_id: detail.pm_id,
        pm_is_read: detail.pm_is_read,
        post_id: detail.post_id
    });
    Channel.set0();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.reportPrompt = this.selectComponent('#reportPrompt');
  },

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