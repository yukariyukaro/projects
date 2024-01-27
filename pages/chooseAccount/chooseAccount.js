const { default: newRequest } = require("../../utils/request")
const info = require("../../utils/info")

var app = getApp()
// pages/followService/followService.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pre_url: 'https://i.boatonland.com/avatar/',
    school_label: info.school_label,
    statusbar_height: wx.getSystemInfoSync().statusBarHeight
  },

  nav2Home:function(){
    wx.reLaunch({
      url: '/pages/home/home',
    })
  },

  select_account:function(e){
    console.log(e)
    let idx = e.currentTarget.id
    app.showModal({
      content: this.data.account_list[idx].user_serial,
      title: '你确定选择此账号吗？',
      success: (result) => {

        //获取微信code
        wx.login({
          success: (res) => {
            newRequest("/user/register/wechatuni/choose", {
              user_itsc: this.data.account_list[idx].user_itsc,
              user_school_label: this.data.account_list[idx].user_school_label,
              code: res.code
            }, this.select_account, false, false)
            .then((res2) => {
              if (res2.code == 200) {
                wx.setStorageSync('token', res2.token)
                wx.setStorageSync('user_school_label', res2.user_school_label)
                wx.setStorageSync('block_splash', true)
                wx.restartMiniProgram({path: "/pages/home/home"})
              } else {
                wx.showToast({
                  title: res2.msg ? res2.msg : "选择失败请重试",
                  icon: "none",
                  duration: 1000
                })
              }
            })
          },
          fail: (res) => {
            wx.showToast({
              title: res.errMsg,
              duration: 1000,
            })
          }
        })

      },
    })
  },

  time: function () {
    var date = new Date();
    var time = date.getTime().toString();
    return parseInt(time.substring(0, time.length - 3));
  },

  format_time: function (timestamp) {
    var dur = this.time() - timestamp;
    if (dur < 60) {
      return '刚刚';
    } else if (dur < 3600) {
      return parseInt(dur / 60) + '分钟前';
    } else if (dur < 86400) {
      return parseInt(dur / 3600) + '小时前';
    } else if (dur < 172800) {
      var s = new Date(timestamp * 1000);
      return "昨天 " + String(s.getHours()).padStart(2, "0") + ":" + String(s.getMinutes()).padStart(2, "0");
    } else if (dur < 259200) {
      var s = new Date(timestamp * 1000);
      return "前天 " + String(s.getHours()).padStart(2, "0") + ":" + String(s.getMinutes()).padStart(2, "0");
    } else {
      var s = new Date(timestamp * 1000);
      return (s.getYear() + 1900) + "-" + (s.getMonth() + 1) + "-" + s.getDate() + " " + String(s.getHours()).padStart(2, "0") + ":" + String(s.getMinutes()).padStart(2, "0");
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
      console.log(options.account_list)
      let accounts = JSON.parse(options.account_list.replaceAll('\'','\"'))
      accounts.forEach((item) => {
        item.display_time = this.format_time(item.user_create_time)
      })
      this.setData({
        account_list: accounts,
      })
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