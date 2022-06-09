var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preURL: "https://i.boatonland.com/avatar/",
    user_avatar:'',
    user_serial:'',
    avatar_sdk_content:'',
    avatarCollection:[]
  },

  getUserInfo: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/user/profile/my.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
            that.setData({
              user_serial:res.data.userInfo.user_serial,
              user_avatar:res.data.userInfo.user_avatar,
            })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getUserInfo()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  getAvatarCollection: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/user/avatarnew/get.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
            that.setData({
              avatarCollection:res.data.avatarCollection
            })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getAvatarCollection()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  useSdk: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/user/avatarnew/exchange.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        avatar_sdk_content:that.data.avatar_sdk_content,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          wx.showToast({title: "兑换成功", icon: "none", duration: 1000})
          that.getAvatarCollection()
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.useSdk()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  update: function () {
    if (this.data.user_serial.match(/^\s*$/) || this.data.user_serial.length < 3) {
      wx.showToast({
        title: 'ID至少三位',
        icon: 'none',
        duration: 1000,
      });
    } else if (!this.data.user_serial.match(/^^[a-z0-9]+$/)) {
      wx.showToast({
        title: '存在非法字符',
        icon: 'none',
        duration: 1000,
      });
    } else {
      wx.showLoading({
        title: '提交中',
      });
      var that = this
      wx.request({
        url: 'https://api.pupu.hkupootal.com/v3/user/profile/update.php', 
        method: 'POST',
        data: {
          token:wx.getStorageSync('token'),
          user_serial:that.data.user_serial,
          user_avatar:that.data.user_avatar
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success (res) {
          wx.hideLoading()
          if(res.data.code == 200){
            wx.navigateBack({
              delta: 1,
              success(){
                wx.showToast({title: "设置成功", icon: "none", duration: 1000})
              }
            })
            
          }else if(res.data.code == 800 ||res.data.code == 900){
            app.launch().then(res=>{
              that.update()
            })
          }else{
            wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
          }
        }
      })
    }
  },
  bindSerialInput: function (e) {
    this.setData({
      user_serial: e.detail.value,
    });
  },
  bindSdkInput: function (e) {
    this.setData({
      avatar_sdk_content: e.detail.value,
    });
  },
  chooseAvatar:function(e){
    this.setData({
      user_avatar: e.currentTarget.dataset.avatarname
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
    this.getAvatarCollection()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})