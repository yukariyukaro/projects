var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    theme:'light',
    user_serial:'',
    orgInfo:{},
    page:0,
    postList:[],
    refresh_triggered: false,
    is_loading_more: false,
    scroll_top: 0,
    isLast:false,
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
  bindScroll:function(e){
    // console.log(e.detail.scrollHeight - e.detail.scrollTop)
    if(this.data.is_loading_more){return}
    if(e.detail.scrollHeight - e.detail.scrollTop < 2500){
      this.onLoadMore()
    }
  },
  getOrgInfo: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/user/org/get.php', 
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
              orgInfo:res.data.orgInfo
            })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getOrgInfo()
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
              token:wx.getStorageSync('token'),
              sender_is_real_name:"true",
              to_type:"user",
              receiver_serial:that.data.user_serial,
            }
        }else if(res.tapIndex == 1){
          var data = {
            token:wx.getStorageSync('token'),
            sender_is_real_name:"false",
            to_type:"user",
            receiver_serial:that.data.user_serial,
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
  handleFunctionPre:function(e){
    this.handleFunction(e.currentTarget.dataset.functionlist)
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
            url: '/pages/detail/detail?post_id=' + function_item.post_id,
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
    that.setData({
      user_serial:options.user_serial,
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