var app = getApp();
const { school_suffix } = require('../../utils/constants');
Page({
  data: {
    scrollViewRefresherStyle: app.globalData.theme.scrollViewRefresherStyle,
    scroll_top: 0,
    user_serial: '',
    refresh_triggered: false,
    is_loading_more: false,
    preURL: 'https://i.boatonland.com/avatar/',
    currentTab: 0,
    tabs: ["本校"],
    postList:[],
    page:0,
    isLast:false,
    userInfo:{},
    is_anonymous:true,
    post_id:'',
    comment_order:''
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
    this.getPostByUser()
  },
  // 上拉加载更多
  onLoadMore: function () {
    if(this.data.is_loading_more){return}
    if(this.data.isLast){return}
    this.setData({
      is_loading_more: true,
      page:this.data.page + 1
    });
    this.getPostByUser();
  },

  getUserInfo: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/user/profile/visit.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        visit_user_serial:that.data.user_serial
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
            that.setData({
              userInfo:res.data.userInfo
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
  getPostByUser:function(){
      var that = this
      wx.request({
        url: 'https://api.pupu.hkupootal.com/v3/post/list/user.php', 
        method: 'POST',
        data: {
          token:wx.getStorageSync('token'),
          visit_user_serial:that.data.user_serial,
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
                refresh_triggered: false,
                is_loading_more: false,
              })
              wx.stopPullDownRefresh()
            }else{
              that.setData({
                postList:that.data.postList.concat(res.data.postList),
                isLast:res.data.isLast,
                refresh_triggered: false,
                is_loading_more: false,
              })
            }
          }else if(res.data.code == 800 ||res.data.code == 900){
            app.launch().then(res=>{
              that.getPostByUser()
            })
          }else{
            wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
          }
        }
      })
  
  },
  // nav2Pm:function(){
  //   if(!this.data.is_anonymous){
  //     wx.navigateTo({
  //       url: '/pages/func1-pm/writePm/writePm?user_serial=' + this.data.user_serial,
  //     })
  //   }else{
  //     wx.navigateTo({
  //       url: '/pages/func1-pm/writePm/writePm?to_type=post&post_id=' + this.data.post_id + '&comment_order=' + this.data.comment_order,
  //     })
  //   }
  // },
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
              token:wx.getStorageSync('token'),
              sender_is_real_name:"true",
              to_type:"user",
              receiver_serial:that.data.user_serial,
            }
          }else{
            var data = {
              token:wx.getStorageSync('token'),
              sender_is_real_name:"true",
              to_type:"post",
              post_id:that.data.post_id,
              comment_order:that.data.comment_order,
            }
          }
        }else if(res.tapIndex == 1){
          if(!that.data.is_anonymous){
            var data = {
              token:wx.getStorageSync('token'),
              sender_is_real_name:"false",
              to_type:"user",
              receiver_serial:that.data.user_serial,
            }
          }else{
            var data = {
              token:wx.getStorageSync('token'),
              sender_is_real_name:"false",
              to_type:"post",
              post_id:that.data.post_id,
              comment_order:that.data.comment_order,
            }
          }
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
    if(options.is_anonymous){
      var userInfo = {
        user_serial:"匿名",
        user_nickname:"#"+options.post_id+"树洞旅客",
        user_avatar: "hkughost"
      }
      that.setData({
        is_anonymous:true,
        userInfo:userInfo,
        user_serial:"匿名",
        post_id:options.post_id,
      })
      if(options.comment_order){
        that.setData({
          comment_order:options.comment_order
        })
      }
    }else{
      that.setData({
        user_serial:options.user_serial,
        is_anonymous:false
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
