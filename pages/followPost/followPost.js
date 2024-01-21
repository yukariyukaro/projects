var app = getApp();
import newRequest from '../../utils/request'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // scrollViewRefresherStyle: app.globalData.theme.scrollViewRefresherStyle,
    refresh_triggered: false,
    is_loading_more: false,
    is_last: false,
    one_list: [],
    page:0,
    scroll_top: 0,
    statusbar_height: wx.getSystemInfoSync().statusBarHeight,
    theme: app.globalData.theme,
    is_dark: false,
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

  onRestore() {},

  // 上拉加载更多
  onLoadMore: function () {
    if(this.data.is_loading_more){return}
    if(this.data.is_last){return}
    this.setData({
      is_loading_more: true,
      page:this.data.page + 1
    });
    this.getPostByFollow();
  },

  back() {
    wx.navigateBack()
  },

  // /post/list/follow
  getPostByFollow: function () {
    var that = this
    newRequest('/post/list/follow', {page:that.data.page}, that.getPostByFollow)
    .then((res) => {
      if(res.code == 200){
        if(that.data.page == '0'){
          that.setData({
            one_list:res.one_list,
            is_last:res.is_last,
            main_data_received: true,
            refresh_triggered: false,
            is_loading_more: false,
          })
          wx.stopPullDownRefresh()
        }else{
          that.setData({
            one_list:that.data.one_list.concat(res.one_list),
            is_last:res.is_last,
            main_data_received:true,
            refresh_triggered: false,
            is_loading_more: false,
          })
        }
      }else{
        wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
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
  onLoad: function () {
    this.getPostByFollow();
    var systemInfo = wx.getSystemInfoSync()
    if (systemInfo.theme == 'dark') {
      this.setData({
        is_dark: true,
      })
    }
    wx.onThemeChange((result) => {
      if (result.theme == 'dark'){
        this.setData({
          is_dark: true,
          theme: app.globalData.theme
        })
      }else{
        this.setData({
          is_dark: false ,
          theme: app.globalData.theme
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      theme: app.globalData.theme,
    })
  },

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
