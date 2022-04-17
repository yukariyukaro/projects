var app = getApp();
Page({
  data: {
    scrollViewRefresherStyle: app.globalData.theme.scrollViewRefresherStyle,
    scroll_top: 0,
    currentTab: -2,
    navItems: ['全部', '🔥'],
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
    });
    wx.showLoading({
      title: '加载中',
    })
    if(this.data.currentTab == -2){
      this.getPost();
    }else if(this.data.currentTab == -1){
      this.getPostByHot();
    }else if(this.data.currentTab >= 0){
      this.getPostByTopic();
    }
  },
  // 上拉加载更多
  onLoadMore: function () {
    this.setData({
      is_loading_more: true,
      page:this.data.page + 1
    });
    if(this.data.currentTab == -2){
      this.getPost();
    }else if(this.data.currentTab == -1){
      this.getPostByHot();
    }else if(this.data.currentTab >= 0){
      this.getPostByTopic();
    }
  },
  // 切换导航栏选项卡
  // 全部posts会在页面初始化时就加载并储存，但是主题posts需要每次点击时重新请求
  navbarTap: function () {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      postList:'',
      page:0,
      scroll_top:0
    })
    if(this.data.currentTab == -2){
      this.getPost();
    }else if(this.data.currentTab == -1){
      this.getPostByHot();
    }else if(this.data.currentTab >= 0){
      this.getPostByTopic();
    }
  },

  closeAD:function(){
    this.setData({
      show_ad:false
    })
  },
  nav2AD:function(){
    // record记录开始
    var that = this
    wx.request({
      url: 'https://pupu.boatonland.com/v1/user/ad.php', 
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
    wx.navigateTo({
      url:'/pages/webview/webview?url=' + that.data.adInfo.ad_link
    })
  },


  // 获取全部posts
  getPost: function () {
    var that = this
    wx.request({
      url: 'https://pupu.boatonland.com/v1/post/get.php', 
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
      url: 'https://pupu.boatonland.com/v1/post/getByHot.php', 
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
              postList:res.data.postList,
              isLast:res.data.isLast,
              main_data_received:true,
              refresh_triggered: false,
              is_loading_more: false,
            })
            wx.stopPullDownRefresh()
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
  getPostByTopic: function () {
    var that = this
    wx.request({
      url: 'https://pupu.boatonland.com/v1/post/getByTopic.php', 
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
  getGeneral: function () {
    var that = this
    wx.request({
      url: 'https://pupu.boatonland.com/v1/post/general.php', 
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
            topicList:res.data.topicList,
            bannerList:res.data.bannerList,
            functionList:res.data.functionList,
            navItems:that.data.navItems.concat(res.data.topicList),
          })
        }else if(res.data.code == 201){
          that.setData({
            topicList:res.data.topicList,
            bannerList:res.data.bannerList,
            functionList:res.data.functionList,
            navItems:that.data.navItems.concat(res.data.topicList),
          })
          if(!wx.getStorageSync('AD'+ res.data.adInfo.ad_id)){
            that.setData({
              show_ad:true,
              adInfo:res.data.adInfo
            })
          }
        }else if(res.data.code == 202){
          that.setData({
            topicList:res.data.topicList,
            bannerList:res.data.bannerList,
            functionList:res.data.functionList,
            navItems:that.data.navItems.concat(res.data.topicList),
          })
          if(!wx.getStorageSync('MODAL'+ res.data.modalInfo.modal_id)){
            wx.showModal({
              title:res.data.modalInfo.modal_title,
              content:res.data.modalInfo.modal_content,
              showCancel:false
            })
            wx.setStorageSync('MODAL'+ res.data.modalInfo.modal_id, true)
          }
        }else if(res.data.code == 400){
          that.setData({
            is_error:true,
            errorInfo:res.data.errorInfo
          })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getGeneral()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

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
      url: 'https://pupu.boatonland.com/v1/user/ad.php', 
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
    const topicList = this.data.topicList
    wx.navigateTo({
      url: '/pages/write/write',
      success(res) {
        res.eventChannel.emit('acceptTopics', topicList);
      },
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    if (options) {
      if (options.jump_page) {
        if (options.jump_page === 'detail') {
          if (options.post_serial[0] === "U") {
            wx.navigateTo({
              url: '/pages/shared-detail/shared-detail?post_serial=' + options.post_serial,
            });
          } else {
            wx.navigateTo({
              url: '/pages/detail/detail?post_serial=' + options.post_serial,
            });
          }
        }
      }
    }
    this.getPost();
    this.getGeneral()
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
  onShareAppMessage: function () {
    return {
      title: 'HKU噗噗 你不孤单',
      imageUrl: '/images/cover.png',
    };
  },
});
