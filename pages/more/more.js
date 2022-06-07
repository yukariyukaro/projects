var app = getApp();
Page({
  data: {
    user_serial: '',
    expandIndex: -1,
    intro: '',
  },

  // 控制选项卡折叠/展开
  changeExpand: function (e) {
    const index = e.currentTarget.dataset.index;
    const current = this.data.expandIndex;
    if (index === current) {
      this.setData({ expandIndex: -1 });
    } else {
      this.setData({ expandIndex: index });
    }
  },
  // 动画
  handleLogoTap: function () {
    this.animate(
      '.avatar-ripple',
      [
        { opacity: 0.8, scale: [1, 1] },
        { opacity: 0, scale: [1.5, 1.5] },
      ],
      1500,
      () => {
        this.clearAnimation('.avatar-ripple');
      }
    );
  },
  // 退出登录
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
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          wx.removeStorageSync('token')
          wx.removeStorageSync('localDB')
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '更多内容',
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if (app.globalData.showDisclaimerModal) {
      app.globalData.showDisclaimerModal = false;
      const modal = this.selectComponent('#disclaimer-modal');
      modal.show();
    }
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
  onShareAppMessage: function () {
    return {
      title: 'HKU噗噗 你不孤单',
      imageUrl: '/images/cover.png',
    };
  },
});
