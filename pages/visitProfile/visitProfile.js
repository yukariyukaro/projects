var app = getApp();
import newRequest from '../../utils/request';
const info = require('../../utils/info.js')

Page({
  data: {
    // scrollViewRefresherStyle: app.globalData.theme.scrollViewRefresherStyle,
    scroll_top: 0,
    user_serial: '',
    refresh_triggered: false,
    is_loading_more: false,
    preURL: 'https://i.boatonland.com/avatar/',
    currentTab: 0,
    postList:[],
    page:0,
    is_last:false,
    userInfo:{},
    is_anonymous:true,
    uni_post_id:'',
    comment_order:'',
    school_label:'',
    statusbar_height: wx.getSystemInfoSync().statusBarHeight,
  },

  // 下拉刷新
  onRefresh() {
    this.setData({
      page:0,
      is_loading_more:true
    });
    if(!this.data.is_anonymous){
      wx.showLoading({
        title: '加载中',
      })
    }
    this.getPostByUser()
  },

  onRestore() {
    this.setData({
      refresh_triggered: false,
      is_loading_more: false,
    });
    wx.stopPullDownRefresh()
    wx.hideLoading()
  },
  // 上拉加载更多
  onLoadMore: function () {
    if(this.data.is_loading_more){return}
    if(this.data.is_last){return}
    this.setData({
      is_loading_more: true,
      page:this.data.page + 1
    });
    this.getPostByUser();
  },

  // /user/profile/visit
  getUserInfo: function () {
    var that = this
    newRequest('/user/profile/visit', {visit_user_serial:that.data.user_serial,
    visit_user_school_label: that.data.school_label}, that.getUserInfo)
    .then((res) => {
      wx.hideLoading()
      if(res.code == 200){
          that.setData({
            userInfo:res.user_info
          })
      }else{
        wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
      }
    })
  },

  getPostByUser:function(){
      var that = this
      if(!this.data.is_anonymous){
        newRequest("/post/list/user", {
          token:wx.getStorageSync('token'),
          visit_user_serial:that.data.user_serial,
          page:that.data.page,
          visit_user_school_label: that.data.school_label
        }, that.getPostByUser)
        .then(res => {
          if(res.code == 200){
            if(that.data.page == '0'){
              that.setData({postList: []})
              that.setData({
                postList:res.one_list,
                is_last:res.is_last,
                refresh_triggered: false,
                is_loading_more: false,
              })
              wx.stopPullDownRefresh()
            }else{
              that.setData({
                postList:that.data.postList.concat(res.one_list),
                is_last:res.is_last,
                refresh_triggered: false,
                is_loading_more: false,
              })
            }
          }else {
            wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
          }
        })
      } else {
        this.setData({
          page:0,
          is_loading_more:false,
          refresh_triggered: false
        });
        wx.stopPullDownRefresh()
      }
  
  },

  nav2Pm:function(){
    var that = this
    wx.showActionSheet({
      itemList: ['实名私信','匿名私信'],
      success (res) {
        wx.showLoading({
          title: '加载中',
        })
        if(res.tapIndex == 0){
          if(!that.data.is_anonymous){
            var data = {
              sender_is_real_name:"true",
              to_type:"user",
              receiver_serial:that.data.user_serial,
              receiver_school_label: that.data.school_label
            }
          }else{
            var data = {
              sender_is_real_name:"true",
              to_type:"post",
              uni_post_id:that.data.uni_post_id,
              comment_order:that.data.comment_order,
            }
          }
        }else if(res.tapIndex == 1){
          if(!that.data.is_anonymous){
            var data = {
              sender_is_real_name:"false",
              to_type:"user",
              receiver_serial:that.data.user_serial,
              receiver_school_label: that.data.school_label
            }
          }else{
            var data = {
              sender_is_real_name:"false",
              to_type:"post",
              uni_post_id:that.data.uni_post_id,
              comment_order:that.data.comment_order,
            }
          }
        }
        newRequest("/pm/chat/create", data)
        .then(res=>{
          if(res.code == 200){
            wx.navigateTo({
              url: '/pages/pmdetail/pmdetail?chat_id='+ res.chat_id,
            })
          }else{
            wx.showToast({
              title: res.msg? res.msg : "错误",
              icon: 'error',
              duration: 1000
            })
          }
        })

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
    var that = this;
    var school_label = info.school_label
    if(options.school_label){
      school_label = options.school_label
    }
    if(options.is_anonymous){
      var userInfo = {
        user_serial:"匿名",
        user_nickname:"#"+options.uni_post_id+"树洞旅客",
        user_avatar: options.avatar
      }
      that.setData({
        school_label: school_label,
        is_anonymous:true,
        userInfo:userInfo,
        user_serial:"匿名",
        uni_post_id:options.uni_post_id,
      })
      if(options.comment_order){
        that.setData({
          comment_order:options.comment_order
        })
      }
    }else{
      that.setData({
        school_label: school_label,
        user_serial: options.user_serial,
        is_anonymous: false
      })
      that.getUserInfo()
      that.getPostByUser()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
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
