var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    scrollViewRefresherStyle: app.globalData.theme.scrollViewRefresherStyle,
    refresh_triggered: false,
    is_loading_more: false,
    isLast: false,
    postList: [],
    page:0,
    navItems: ['本校'],
    currentTab: 0,
    scroll_top: 0
  },
  // 下拉刷新
  onRefresh() {
    this.setData({
      page:0,
      is_loading_more:true
    });
    wx.showLoading({
      title: '加载中',
    })
    this.getPostByFollow();
  },
  // 上拉加载更多
  onLoadMore: function () {
    if(this.data.is_loading_more){return}
    if(this.data.isLast){return}
    this.setData({
      is_loading_more: true,
      page:this.data.page + 1
    });
    this.getPostByFollow();
  },

  getPostByFollow: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/post/list/follow.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        page:that.data.page,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          if(that.data.page == '0'){
            that.setData({
              postList:res.data.postList,
              isLast:res.data.isLast,
              main_data_received:true,
              refresh_triggered: false,
              is_loading_more: false,
            })
            wx.stopPullDownRefresh()
          }else{
            that.setData({
              postList:that.data.postList.concat(res.data.postList),
              isLast:res.data.isLast,
              main_data_received:true,
              refresh_triggered: false,
              is_loading_more: false,
            })
          }
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getPostByFollow()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  bindScroll:function(e){
    // console.log(e.detail.scrollHeight - e.detail.scrollTop)
    if(this.data.is_loading_more){return}
    if(e.detail.scrollHeight - e.detail.scrollTop < 2500){
      this.onLoadMore()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPostByFollow();
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
