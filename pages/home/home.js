var app = getApp();
Page({
  data: {
    scrollViewRefresherStyle: app.globalData.theme.scrollViewRefresherStyle,
    scroll_top: 0,
    currentTab: -1,
    navItems: ['🔎','👀','🔥','全部'],
    postList:[],
    page:0,
    isLast:false,
    topicList:[],
    bannerList:[],
    is_error:false,
    errorInfo:{},
    show_ad:false,
    adInfo:{},
    functionList:{},
    is_loading_more:false,
    refresh_triggered: false,
    main_data_received:false
  },
  // 下拉刷新
  onRefresh: function () {
    this.setData({
      page:0,
      is_loading_more:true,
    });
    wx.showLoading({
      title: '加载中',
    })
    this.getAll()
  },
  // 上拉加载更多
  onLoadMore: function () {
    if(this.data.is_loading_more){return}
    if(this.data.isLast){return}
    this.setData({
      is_loading_more: true,
      page:this.data.page + 1
    });
    this.getAll()
  },
  // 切换导航栏选项卡
  // 全部posts会在页面初始化时就加载并储存，但是主题posts需要每次点击时重新请求
  navbarTap: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      is_loading_more:true,
      postList:'',
      page:0,
      scroll_top:0
    })
    this.getAll()
  },

  closeAD:function(){
    this.setData({
      show_ad:false
    })
  },


  // 获取全部posts
  getPost: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/post/list/all.php', 
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
          if(wx.getStorageSync('banUniPost')){
            var postList = res.data.postList.filter(function (item) {
              return item.post_topic != "UST" && item.post_topic != "CUHK"
            });
          }
          if(that.data.page == '0'){
            that.setData({
              postList:postList,
              isLast:res.data.isLast,
              main_data_received:true,
              refresh_triggered: false,
              is_loading_more: false,
            })
            wx.stopPullDownRefresh()
          }else{
            that.setData({
              postList:that.data.postList.concat(postList),
              isLast:res.data.isLast,
              main_data_received:true,
              refresh_triggered: false,
              is_loading_more: false,
            })
          }
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getPost()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  getPostByHot: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/post/list/hot.php', 
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
            that.getPostByHot()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  getPostByLatest: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/post/list/latest.php', 
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
            that.getPostByLatest()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  getPostByTopic: function () {
    var that = this
    if(that.data.topicList[that.data.currentTab] == '漫步'){
      var url = 'https://api.pupu.hkupootal.com/v3/post/list/random.php'
    }else{
      var url = 'https://api.pupu.hkupootal.com/v3/post/list/topic.php'
    }
    wx.request({
      url: url, 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        post_topic:that.data.topicList[that.data.currentTab],
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
            that.getPostByTopic()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  getBanner:function(){
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/info/banner.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        if(res.data.code == 200){
          that.setData({
            bannerList:res.data.bannerList,
          })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getBanner()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })
  },
  getTopic:function(){
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/info/gettopic.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        if(res.data.code == 200){
          that.setData({
            navItems:that.data.navItems.concat(res.data.topicList),
            topicList:res.data.topicList
          })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getTopic()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })
  },
  getAll:function(){
    if(this.data.currentTab == -4){
      wx.hideLoading()
    }else if(this.data.currentTab == -3){
      this.getPostByLatest();
    }else if(this.data.currentTab == -2){
      this.getPostByHot();
    }else if(this.data.currentTab == -1){
      this.getPost();
    }else if(this.data.currentTab >= 0){
      this.getPostByTopic();
    }
  },

  onTapFunction:function(){
    var functionList = this.data.functionList
    switch (functionList.function_type) {
      case 'article':
        wx.navigateTo({
          url: '/pages/webview/webview?url=' + functionList.function_link,
        });
        break;
      case 'inner':
        console.log(functionList)
        wx.navigateTo({ url: functionList.function_link });
        break;
      case 'miniprogram': {
        const splitIndex = functionList.function_link.indexOf('/');
        if (splitIndex >= 0) {
          const appId = functionList.function_link.slice(0, splitIndex);
          const path = functionList.function_link.slice(splitIndex + 1);
          wx.navigateToMiniProgram({ appId, path });
        } else {
          wx.navigateToMiniProgram({ appId: functionList.function_link });
        }
        break;
      }
      case 'none':
      default:
        break;
    }
  },

  onTapAD:function(){
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/user/record/ad.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        ad_id: that.data.adInfo.ad_id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
    })
    // record记录结束
    wx.setStorageSync('AD'+ that.data.adInfo.ad_id, true)
    that.setData({
      show_ad:false
    })
    var adInfo = that.data.adInfo
    switch (adInfo.ad_type) {
      case 'article':
        wx.navigateTo({
          url: '/pages/webview/webview?url=' + adInfo.ad_link,
        });
        break;
      case 'inner':
        wx.navigateTo({ url: adInfo.ad_link });
        break;
      case 'miniprogram': {
        const splitIndex = adInfo.ad_link.indexOf('/');
        if (splitIndex >= 0) {
          const appId = adInfo.ad_link.slice(0, splitIndex);
          const path = adInfo.ad_link.slice(splitIndex + 1);
          wx.navigateToMiniProgram({ appId, path });
        } else {
          wx.navigateToMiniProgram({ appId: adInfo.ad_link });
        }
        break;
      }
      case 'none':
      default:
        break;
    }
  },

  handleStarTap() {
    wx.navigateTo({
      url: '/pages/write/write'
    });
  },

  bindScroll:function(e){
    // console.log(e.detail.scrollHeight - e.detail.scrollTop)
    if(this.data.is_loading_more){return}
    if(e.detail.scrollHeight - e.detail.scrollTop < 2500){
      this.onLoadMore()
    }
  },

  updateTabbar:function(){
    var notice_count = wx.getStorageSync('allNoticeCount')
    if(notice_count > 0){
      wx.setTabBarBadge({
        index: 1,
        text: String(notice_count),
      })
    }else{
      wx.removeTabBarBadge({
        index: 1,
      })
    }
  },

  getQueryVariable:function(qrlink,variable) {
       var vars = qrlink.split("&");
       console.log(vars)
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var qrlink = decodeURIComponent(options.q)
    if(qrlink.match("https://pupu.hkupootal.com/qrcode?")){
      var query = qrlink.split("https://pupu.hkupootal.com/qrcode?")
      var mode = that.getQueryVariable(query[1],"mode")
      if(mode == "auth"){
        wx.navigateTo({
          url: '/pages/auth/auth?auth_key=' + that.getQueryVariable(query[1],"auth_key"),
        })
      }
    }
    if(app.globalData.auth_key){
      wx.navigateTo({
        url: '/pages/auth/auth?auth_key=' + app.globalData.auth_key + '&from_miniapp=' + app.globalData.from_miniapp,
      })
    }
    if (options) {
      if (options.jump_page) {
        if (options.jump_page === 'detail') {
          wx.navigateTo({
            url: '/pages/detail/detail?post_id=' + options.post_serial,
          });
        }
      }
    }
    this.getPost()
    this.getBanner()
    this.getTopic()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {    
    app.globalData.tabbarJS = this
    app.updateTabbar()
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
  onShareAppMessage: function () {
    return {
      title: 'HKU噗噗 你不孤单',
      imageUrl: '/images/cover.png',
    };
  },
});
