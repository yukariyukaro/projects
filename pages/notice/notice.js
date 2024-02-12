const { default: newRequest } = require("../../utils/request")

var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice_list:[],
    user_info:[],
    scroll_top: 0,
    page:0,
    is_last:false,
    is_loading_more:false,
    refresh_triggered: false,
    statusbar_height: wx.getSystemInfoSync().statusBarHeight,
  },

  formatTime: function(timestamp){
    var s = new Date(timestamp*1000);
    var today = new Date();
    var day_diff = today.setHours(0,0,0,0) - s.setHours(0,0,0,0)
    var s = new Date(timestamp*1000);
    //same day
    if(day_diff == 0){
      return "今天 " + String(s.getHours()).padStart(2, "0")+":"+String(s.getMinutes()).padStart(2, "0");
    }else if(day_diff == 86400000){
      return "昨天 "+String(s.getHours()).padStart(2, "0")+":"+String(s.getMinutes()).padStart(2, "0");
    }else if(day_diff == 172800000){
      return "前天 "+String(s.getHours()).padStart(2, "0")+":"+String(s.getMinutes()).padStart(2, "0");
    }else{
      return (s.getYear()+1900)+"-"+(s.getMonth()+1)+"-"+s.getDate()+" "+String(s.getHours()).padStart(2, "0")+":"+String(s.getMinutes()).padStart(2, "0");
    }

  },

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
 

  getNotice: function () {
    var that = this
    newRequest('/notice/get', {page:that.data.page}, that.getNotice)
    .then(res=>{
      if(res.code == 200){
        
        if (res.notice_list){
          for (let i=0; i<res.notice_list.length; i++){
            res.notice_list[i].notice_display_date = this.formatTime(res.notice_list[i].notice_create_time)
          }
        }

        if(that.data.page == '0'){
          that.setData({notice_list: []})
          that.setData({
            notice_list:res.notice_list,
            is_last:res.is_last,
            refresh_triggered: false,
            is_loading_more: false,
          })
          wx.stopPullDownRefresh()
        }else{
          that.setData({
            notice_list:that.data.notice_list.concat(res.notice_list),
            is_last:res.is_last,
            refresh_triggered: false,
            is_loading_more: false,
          })
        }
      }else {
        wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
      }
    })

  },
  nav2Notice:function(e){
    this.readNotice(e)
    var notice_list = this.data.notice_list
    notice_list = notice_list.map(item => {
      if(item.notice_url == e.currentTarget.dataset.url){
        item.notice_is_read = '1'
      }
      return item
    })
    this.setData({
      notice_list:notice_list
    })
    
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
    
  },

  readNotice: function (e) {
    var that = this
    newRequest("/notice/read", {notice_id:e.currentTarget.dataset.noticeid}, that.readNotice)
    .then(res=>{
      if(res.code == 200){
        app.checkUnread()
      }else{
        wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
      }
    })


  },

  onRefresh() {
    this.setData({
      page:0,
      refresh_triggered: true,
    });
    wx.showLoading({
      title: '加载中',
    })
    this.getNotice()
  },
  onLoadMore: function () {
    if(this.data.is_last){
      return
    }
    this.setData({
      is_loading_more: true,
      page:this.data.page + 1
    });
    this.getNotice()
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
    this.getUserInfo()
    this.getNotice()
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