const { json2xml } = require("../../utils/cos-wx-sdk-v5");

var app = getApp();
Page({
  data: {
    // scrollViewRefresherStyle: app.globalData.theme.scrollViewRefresherStyle,
    scroll_top: 0,
    currentTab: -1,
    startIndex: -3,
    navItems: ['👀','🔥','全部'],
    postList:[],
    page:0,
    isLast:false,
    topicList:[],
    is_error:false,
    errorInfo:{},
    show_ad: false,
    adInfo:{},
    functionList:{},
    is_loading_more:false,
    refresh_triggered: false,
    main_data_received:false,
    postButtonIcon:"",
    swiper_current:2,
    nav_to_view:0,
    allowHomeSwipe:false,
    banner_list:[],
    sticky_post_num:0,
    sticky_posts:[],
    sticky_text: "",
    collapsed: true,
    collapsedHeight: 'auto',
    collapsableTopPostion: 0
  },
  // 下拉刷新
  onRefresh: function () {
    this.setData({
      scroll_top:0,
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
  navbarTapPre: function (e) {
    this.navbarTap(e.currentTarget.dataset.index)
    this.setData({
      swiper_current:e.currentTarget.dataset.index - this.data.startIndex
    })
  },
  navbarTap: function (index) {
    wx.showLoading({
      title: '加载中',
    })
    if(this.data.sticky_post_num > 0){
      this.storeCollapseStatus()
    }
    this.setData({
      is_loading_more:true,
      postList:[],
      sticky_posts:[],
      sticky_post_num: 0,
      sticky_text: "",
      page:0,
      scroll_top:0,
      currentTab:index
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
          }else{
            var postList = res.data.postList
          }
          if(that.data.page == '0'){
            //折叠置顶功能
            if(res.data.stickey_text){
              that.setData({
                collapsed:true,
                isLast:res.data.isLast,
                main_data_received:true,
                refresh_triggered: false,
                is_loading_more: false,
                sticky_posts: res.data.stickeyPostList,
                sticky_post_num: res.data.stickeyPostList.length,
                sticky_text: res.data.stickey_text,
                postList: res.data.postList,
              }, ()=>{
                that.checkStickyHeight()
                that.setCollapseStatus()
              })
            }else{
              that.setData({
                postList:res.data.postList,
                isLast:res.data.isLast,
                main_data_received:true,
                refresh_triggered: false,
                is_loading_more: false,
                sticky_posts: [],
                sticky_post_num: 0,
                sticky_text: "",
              })
            }
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
            //折叠置顶功能
            if(res.data.stickey_text){
              that.setData({
                collapsed:true,
                isLast:res.data.isLast,
                main_data_received:true,
                refresh_triggered: false,
                is_loading_more: false,
                sticky_posts: res.data.stickeyPostList,
                sticky_post_num: res.data.stickeyPostList.length,
                sticky_text: res.data.stickey_text,
                postList: res.data.postList,
              }, ()=>{
                that.checkStickyHeight()
                that.setCollapseStatus()
              })
            }else{
              that.setData({
                postList:res.data.postList,
                isLast:res.data.isLast,
                main_data_received:true,
                refresh_triggered: false,
                is_loading_more: false,
                sticky_posts: [],
                sticky_post_num: 0,
                sticky_text: "",
              })
            }
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
            banner_list:res.data.banner_list
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
  getAd:function(){
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/info/openad.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        if (res.data.code == 200) {

        } else if (res.data.code == 201) {
          that.setData({
            adInfo:res.data.adInfo,
            show_ad:true
          })
        }  else if (res.data.code == 800 || res.data.code == 900) {
          app.launch().then(res => {
            that.getAd()
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
            duration: 1000
          })
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

  onTapAd:function(){
    this.setData({
      show_ad:false
    })
    var adInfo = this.data.adInfo
    switch (adInfo.ad_type) {
      case 'article':
        wx.navigateTo({
          url: '/pages/webview/webview?url=' + adInfo.article_link,
        });
        break;
      case 'post':
          wx.navigateTo({
            url: '/pages/detail/detail?post_id=' + adInfo.post_id,
          });
          break;
      case 'inner':
        wx.navigateTo({ url: adInfo.inner_path });
        break;
      case 'miniapp': 
        wx.navigateToMiniProgram({
          appId: adInfo.miniapp_appid,
          path: adInfo.miniapp_path,
        })
        break;
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

  // updateTabbar:function(){
  //   var notice_count = wx.getStorageSync('allNoticeCount')
  //   if(notice_count > 0){
  //     wx.setTabBarBadge({
  //       index: 2,
  //       text: String(notice_count),
  //     })
  //   }else{
  //     wx.removeTabBarBadge({
  //       index: 2,
  //     })
  //   }
  //   if(wx.getStorageSync('showOneRedDot')){
  //     wx.showTabBarRedDot({
  //       index:1
  //     })
  //   }
  // },

  getQueryVariable:function(qrlink,variable) {
       var vars = qrlink.split("&");
       console.log(vars)
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
  },
  swiperChange:function(e){
    if(e.detail.source != 'touch'){return}
    this.navbarTap(e.detail.current + this.data.startIndex)
    this.setData({
      nav_to_view:e.detail.current + this.data.startIndex - 2
    })
  },
  getCalendarNow:function(){
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/calendar/getnow.php', 
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
            calendar_now_data:res.data.calendar_now_data
          })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getCalendarNow()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })
  },

  //折叠 展开置顶树洞
  changeCollapse:function(){
    if(this.data.collapsed){
      this.animate('#stickyPostArea', [
        { height: String(this.data.collapsedHeight)+"px" },
        { height: 0}
        ], 500, function () {
          this.clearAnimation('#stickyPostArea')
          this.setData({
            collapsed: !this.data.collapsed,
          })
      }.bind(this))

    }else{
      this.animate('#stickyPostArea', [
        { height: 0},
        { height:  String(this.data.collapsedHeight)+"px"}
        ], 500, function () {
          this.clearAnimation('#stickyPostArea')
          this.setData({
            collapsed: !this.data.collapsed
          })
      }.bind(this))
    }

  },

  postIdSum:function(posts){
    var idSum = ""
    for (var post of posts){
      idSum += post.post_id
    }
    return idSum
  },

  storeCollapseStatus: function(){
    var collapsedStatus = wx.getStorageSync('collapsed')
    if (!this.data.collapsed){
      collapsedStatus[this.data.currentTab] = this.postIdSum(this.data.sticky_posts)
    }else{
      collapsedStatus[this.data.currentTab] = null
    }
    wx.setStorageSync('collapsed', collapsedStatus)
  },

  setCollapseStatus: function(){
    var that = this
    var collapsedStatus = wx.getStorageSync('collapsed')
    if (collapsedStatus[that.data.currentTab] == that.postIdSum(that.data.sticky_posts)){
      that.setData({collapsed: false})
    }else{
      that.setData({collapsed: true})
    }
  },

  checkStickyHeight: function(){
    let qSearch = this.createSelectorQuery()
    qSearch.select('#stickyPostArea').boundingClientRect()
    qSearch.exec( (res) => {
      let qSearch2 = this.createSelectorQuery()
      qSearch2.select('.collapsable').boundingClientRect()
      qSearch2.exec( (res2) => {
        this.setData({
          collapsedHeight: res[0].height,
          collapsableTopPostion: res2[0].top - 60
        })
      })
    })
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
    this.getAd()
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
    
    // 检查置顶树洞折叠状态
    if (!wx.getStorageSync('collapsed')){
      wx.setStorageSync('collapsed', {})
    }
    this.getTabBar().setData({ selected: 0 })
    app.globalData.tabbarJS = this
    app.updateTabbar()
    this.getCalendarNow()
    this.setData({
      allowHomeSwipe:wx.getStorageSync('allowHomeSwipe')
    })
    
    setTimeout(() => {
      if(app.globalData.themeInfo.postButtonIcon){
        this.setData({
          postButtonIcon:app.globalData.themeInfo.postButtonIcon
        })
      }
    }, 1000);
    
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.indexJS = ''
    this.storeCollapseStatus()
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.globalData.indexJS = ''
    this.storeCollapseStatus()
  },

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
