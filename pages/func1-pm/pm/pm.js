var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // scrollViewRefresherStyle: app.globalData.theme.scrollViewRefresherStyle,
    navItems: ['收件箱', '发件箱'],
    currentTab: 0,
    scroll_top: 0,
    triggered: false,
    today_local_left_num: 0,
    today_union_left_num: 0,
    unread_num: '',
    receiveList: [],
    sendList: [],
    pm_quota:'0'
  },
  // 切换导航栏选项卡
  navbarTap: function () {
    this.setData({
      scroll_top: 0,
    });
  },
  bindSwiperChange: function (e) {
    this.setData({
      currentTab: e.detail.current,
    });
  },
  // 下拉刷新
  onRefresh() {
    this.setData({
      triggered: true,
    });
    wx.showLoading({
      title: '加载中',
    })
    this.getPm();
  },
  getPm:function(){
    var that = this
      wx.request({
        url: 'https://api.pupu.hkupootal.com/v3/pm/get.php', 
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
              receiveList:res.data.receiveList,
              sendList:res.data.sendList,
              pm_quota:res.data.pm_quota,
              triggered: false,
            });

          }else if(res.data.code == 800 ||res.data.code == 900){
            app.launch().then(res=>{
              that.getPm()
            })
          }else{
            wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
          }
        }
      })
  },
  // 跳转到写私信
  toWritePm: function () {
    if (this.data.pm_quota == 0) {
      app.showModal({
        title: '提示',
        showCancel: false,
        content: '达到私信发送上限 无法进入私信',
      });
    } else {
      wx.navigateTo({
        url: '/pages/func1-pm/writePm/writePm',
      });
    }
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '私信',
    });
    this.getPm();
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
