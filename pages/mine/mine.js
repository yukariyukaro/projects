var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preURL: "https://i.boatonland.com/avatar/",
    navBarHeight:0,
    userBackgroundScale:1,
    userInfo:[],
    mineBackgroundImage:"/images/cover.png"
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
              userInfo:res.data.userInfo,
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
  nav2Pm:function(){
    var that = this
    var data = {
      token:wx.getStorageSync('token'),
      sender_is_real_name:"true",
      to_type:"user",
      receiver_serial:"Vector",
    }
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/pmnew/chat/create.php', 
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          wx.navigateTo({
            url: '/pages/pmdetail/pmdetail?chat_id='+ res.data.chat_id,
          })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.nav2Pm()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })
  },
  nav2Url:function(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },
  logout: function () {
    var that = this;
    app.showModal({
      title: '提示',
      content: '登出后将解绑微信号和UID,下次登陆将重新绑定。确定登出吗?',
      success(res) {
        if (res.confirm) {
          that.implementLogout();
        }
      },
    });
  },
  // 执行登出
  implementLogout: function () {
    wx.showLoading({
      title: '清除数据中',
    });
    // record记录开始
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/user/logout/wechat.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        system_info:JSON.stringify(wx.getSystemInfoSync())
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          wx.removeStorageSync('token')
          app.clearDB()
          wx.closeSocket()
          wx.setStorageSync('allNoticeCount', 0)
          wx.setStorageSync('systemNoticeCount', 0)
            wx.reLaunch({
              url: '/pages/register/register',
            })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.implementLogout()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },

  getNavbarHeight:function () {
    return this.rpx2px(this.isIos() ? 88 : 96) + this.getStatusBarHeight();
  },
  isIos: function () {
    return wx.getSystemInfoSync().system.toLowerCase().includes("ios");
  },
  rpx2px: function (t) {
    var e = this.getWindowWidth() / 750;
    return parseFloat((t * e).toPrecision(12), 10);
  },
  getWindowWidth: function () {
    return wx.getSystemInfoSync().windowWidth;
  },
  getStatusBarHeight: function () {
    return wx.getSystemInfoSync().statusBarHeight;
  },
  onPageScroll: function (t) {
    var e = t.scrollTop > 0;
    if (this.isIos() && !e) {
      var n = 1 + Math.abs(t.scrollTop) / 150;
      this.setData({
        userBackgroundScale: n
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let navBarHeight = this.getNavbarHeight()
    this.setData({
      navBarHeight: navBarHeight
    })
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
    this.getUserInfo()
    if(app.globalData.themeInfo.mineBackgroundImage){
      this.setData({
        mineBackgroundImage:app.globalData.themeInfo.mineBackgroundImage
      })
    }
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