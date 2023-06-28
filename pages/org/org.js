import newRequest from "../../utils/request";
const info = require("../../utils/info")

var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme:'light',
    user_serial:'',
    org_info:{},
    page:0,
    postList:[],
    refresh_triggered: false,
    is_loading_more: false,
    scroll_top: 0,
    is_last:false,
    have_full_width_func:false,
    half_list:[]
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

  onRestore() {
    this.setData({
      refresh_triggered: false,
      is_loading_more:false,
    });
    wx.hideLoading()
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
  bindScroll:function(e){
    // console.log(e.detail.scrollHeight - e.detail.scrollTop)
    if(this.data.is_loading_more){return}
    if(e.detail.scrollHeight - e.detail.scrollTop < 2500){
      this.onLoadMore()
    }
  },
  getOrgInfo: function () {
    var that = this
    newRequest("/user/profile/org", {visit_user_serial: that.data.user_serial}, that.getOrgInfo) 
    .then(res =>{
      if (res.code == 200){
        var have_full_width_func = false;
        if (res.org_info.org_function){
          var have_full_width_func = (res.org_info.org_function.length % 2 != 0)
        }
        var half_list=[]
        if(have_full_width_func){
          half_list = res.org_info.org_function.slice(1)
        }else{
          half_list = res.org_info.org_function
        }
        that.setData({
          org_info: res.org_info,
          have_full_width_func: have_full_width_func,
          half_list: half_list
        })
      }else{
        wx.showToast({title: res.msg? res.msg : "错误", icon: "error", duration: 1000})
      }
    })


  },

  getPostByUser:function(){
    var that = this
      newRequest("/post/list/user", {
          visit_user_serial:that.data.user_serial,
          page:that.data.page,
          visit_user_school_label: that.data.school_label
      }, that.getPostByUser)
      .then(res => {
        if(res.code == 200){
          if(that.page == '0'){
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
    

  },
  onTapBanner:function(e){
    var banner_item = e.currentTarget.dataset.banneritem
    switch (banner_item.banner_type) {
      case 'article':
        wx.navigateTo({
          url: '/pages/webview/webview?url=' + banner_item.article_link,
        });
        break;
      case 'post':
          wx.navigateTo({
            url: '/pages/detail/detail?post_id=' + banner_item.post_id,
          });
          break;
      case 'inner':
        wx.navigateTo({ url: banner_item.inner_path });
        break;
      case 'miniapp': 
        wx.navigateToMiniProgram({
          appId: banner_item.miniapp_appid,
          path: banner_item.miniapp_path,
        })
        break;
      case 'none':
      default:
        break;
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
            var data = {
              sender_is_real_name:"true",
              to_type:"user",
              receiver_serial:that.data.user_serial,
              receiver_school_label: that.data.school_label
            }
        }else if(res.tapIndex == 1){
            var data = {
              sender_is_real_name:"false",
              to_type:"user",
              receiver_serial:that.data.user_serial,
              receiver_school_label: that.data.school_label
            }
        }
        newRequest("/pm/chat/create", data, that.nav2Pm)
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
  handleFunctionPre:function(e){
    this.handleFunction(e.currentTarget.dataset.functionlist)
    console.log(e.currentTarget.dataset.functionlist)
  },
  handleFunction:function(function_item){
    var that = this
    switch (function_item.function_type) {
      case 'list':
        wx.showActionSheet({
          itemList: function_item.function_list.map(x => {return x.function_title}),
          success (res) {
            that.handleFunction(function_item.function_list[res.tapIndex])
          }
        })
        break;
      case 'article':
        wx.navigateTo({
          url: '/pages/webview/webview?url=' + function_item.article_link,
        });
        break;
      case 'post':
          wx.navigateTo({
            url: '/pages/detail/detail?uni_post_id=' + function_item.uni_post_id,
          });
          break;
      case 'inner':
        wx.navigateTo({ url: function_item.inner_path });
        break;
      case 'miniapp': 
        wx.navigateToMiniProgram({
          appId: function_item.miniapp_appid,
          path: function_item.miniapp_path,
        })
        break;
      case 'pm': 
        that.nav2Pm()
        break;
      case 'none':
      default:
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var school_label = info.school_label
    if(options.school_label){
      school_label = options.school_label
    }
    that.setData({
      user_serial:options.user_serial,
      school_label:school_label
    })
    that.getOrgInfo()
    that.getPostByUser()
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
    this.setData({
      theme:app.globalData.theme.backgroundTextStyle
    })
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