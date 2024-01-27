var app = getApp();
import info from "../../utils/info";
import newRequest from "../../utils/request";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pre_url: "https://i.boatonland.com/avatar/",
    nav_bar_height:0,
    user_background_scale:1,
    user_info:[],
    mine_background_image:app.globalData.theme.mineBackgroundImage,
    school_label: info.school_label.toLowerCase(),
    terms_url: info.terms_url
  },
  
  // /user/profile/get
  getUserInfo: function () {
    var that = this
    newRequest("/user/profile/get",{}, that.getUserInfo)
    .then((res) => {
      if(res.code == 200){
        that.setData({
          user_info:res.user_info,
        })
      }else{
        wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
      }
    })

  },

  // /pm/chat/create
  nav2Pm:function(){
    var that = this
    var data = {
      sender_is_real_name:"true",
      to_type:"user",
      receiver_serial: info.contact_serial,
      receiver_school_label: info.contact_school_label
    }

    newRequest("/pm/chat/create", data, that.nav2Pm)
    .then(res=>{
      if(res.code == 200){
        wx.navigateTo({
          url: '/pages/pmdetail/pmdetail?chat_id='+ res.chat_id,
        })
      }else{
        wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
      }
    })
  },

  nav2Url:function(e){
    wx.navigateTo({
      url: e.currentTarget.dataset.url,
    })
  },

  nav2Web:function(e){
    wx.navigateTo({
      url: "/pages/webview/webview?url="+e.currentTarget.dataset.url,
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

  // 执行登出 /user/logout/wechat
  implementLogout: function () {
    wx.showLoading({
      title: '清除数据中',
    });
    // record记录开始
    newRequest("/user/logout/wechatuni", {}, this.implementLogout)
    .then((res) => {
      if(res.code == 200){
        wx.removeStorageSync('token')
        app.clearDB()
        app.globalData.close_socket = true
        wx.closeSocket()
        wx.setStorageSync('allNoticeCount', 0)
        wx.setStorageSync('systemNoticeCount', 0)
        wx.setStorageSync('user_school_label', 'UNI')
        wx.reLaunch({
          url: '/pages/register/register',
        })
      }else{
        wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
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
        user_background_scale: n
      });
    }
  },
  // updateTabbar:function(){
  //   var notice_count = wx.getStorageSync('allNoticeCount')
  //   if(notice_count > 0){
  //     wx.setTabBarBadge({
  //       index: 2,
  //       text: String(notice_count),
  //     })
  //   }else{
  //     wx.removeTabBarBadge({
  //       index: 2,
  //     })
  //   }
  //   if(wx.getStorageSync('showOneRedDot')){
  //     wx.showTabBarRedDot({
  //       index:1
  //     })
  //   }
  // },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
    let nav_bar_height = this.getNavbarHeight()
    this.setData({
      nav_bar_height: nav_bar_height
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
    this.getTabBar().setData({ selected: 4 })
    app.globalData.tabbarJS = this
    app.updateTabbar()
    this.getUserInfo()
    wx.onThemeChange(() => {
      this.setData({
        mine_background_image:app.globalData.theme.mineBackgroundImage
      })
    })
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.tabbarJS = ''
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.globalData.tabbarJS = ''
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
    return {
      title: info.slogan,
      imageUrl: info.share_cover,
    };
  }
})