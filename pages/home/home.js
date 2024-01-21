// const { json2xml } = require("../../utils/cos-wx-sdk-v5");
import newRequest from "../../utils/request"
import info from "../../utils/info"

import {
  getImageCache
} from '../../utils/imageCache.js'

var app = getApp();
Page({
  data: {
    // scrollViewRefresherStyle: app.globalData.theme.scrollViewRefresherStyle,
    page: 0,
    scroll_top: 0,
    current_tab: -1,
    start_index: -3,
    swiper_current: 2,
    nav_to_view: 0,
    navbar_items: ['👀', '🔥', '全部'],
    post_list: [],
    banner_list: [],
    topic_list: [],
    function_list: [],
    ad_info: {},
    is_last: false,
    show_ad: false,
    is_loading_more: false,
    refresh_triggered: false,
    main_data_received: false,
    allow_home_swipe: false,
    post_button_icon: "",
    show_privacy: false,
    app_title: info.app_title,
    theme: app.globalData.theme,
    statusbar_height: wx.getSystemInfoSync().statusBarHeight,
    content_loaded: 0
  },
  // 下拉刷新
  onRefresh: function () {
    this.setData({
      scroll_top: 0,
      page: 0,
      is_loading_more: true,
    });
    wx.showLoading({
      title: '加载中',
    })
    this.getAll()
  },

  onRestore: function () {
    wx.hideLoading()
    this.setData({
      page: 0,
      is_loading_more: false,
      refresh_triggered: false,
    });
  },

  // 上拉加载更多
  onLoadMore: function () {
    if (this.data.is_loading_more) {
      return
    }
    if (this.data.is_last) {
      return
    }
    this.setData({
      is_loading_more: true,
      page: this.data.page + 1
    });
    this.getAll()
  },

  onPrivacyDisagree: function (e) {
    // console.log(e)
    wx.exitMiniProgram({
      success: (res) => {
        console.log(res)
      },
      fail: (res) => {
        console.log(res)
      }
    })
  },

  onPrivacyAgree: function (e) {
    this.setData({
      show_privacy: false
    })
    app.globalData.show_privacy = false
  },

  // 切换导航栏选项卡
  // 全部posts会在页面初始化时就加载并储存，但是主题posts需要每次点击时重新请求
  navbarTapPre: function (e) {
    this.navbarTap(e.currentTarget.dataset.index)
    this.setData({
      swiper_current: e.currentTarget.dataset.index - this.data.start_index
    })
  },
  navbarTap: function (index) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      is_loading_more: true,
      post_list: [],
      page: 0,
      scroll_top: 0,
      current_tab: index
    })
    this.getAll()
  },

  closeAD: function () {
    this.setData({
      show_ad: false
    })
  },


  // 获取全部posts
  // /post/list/all
  getPost: function () {
    var that = this
    newRequest("/post/list/all", {
        page: that.data.page
      }, that.getPost)
      .then((res) => {
        if (res.code == 200) {
          var post_list = res.one_list
          if (wx.getStorageSync('ban_uni_post')) {
            var post_list = res.one_list.filter(function (item) {
              return !item.data.post_is_uni
            });
          }

          if (that.data.page == '0') {
            // that.setData({post_list:[]})
            that.setData({
              post_list: post_list,
              is_last: res.is_last,
              main_data_received: true,
              refresh_triggered: false,
              is_loading_more: false,
              content_loaded: this.data.content_loaded + 1
            })
            wx.stopPullDownRefresh()
          } else {
            that.setData({
              post_list: that.data.post_list.concat(post_list),
              is_last: res.is_last,
              main_data_received: true,
              refresh_triggered: false,
              is_loading_more: false,
            })
          }
        } else {
          wx.showToast({
            title: res.msg ? res.msg : "错误",
            icon: "none",
            duration: 1000
          })
        }
      })
  },

  // /post/list/hot
  getPostByHot: function () {
    var that = this
    newRequest('/post/list/hot', {
        page: that.data.page
      }, that.getPostByHot)
      .then((res) => {
        wx.hideLoading()
        if (res.code == 200) {

          if (wx.getStorageSync('ban_uni_post')) {
            var post_list = res.one_list.filter(function (item) {
              return !item.data.post_is_uni
            });
          } else {
            var post_list = res.one_list
          }

          if (that.data.page == '0') {
            // that.setData({post_list:[]})
            that.setData({
              post_list: post_list,
              is_last: res.is_last,
              main_data_received: true,
              refresh_triggered: false,
              is_loading_more: false,
            })
            wx.stopPullDownRefresh()
          } else {
            that.setData({
              post_list: that.data.post_list.concat(post_list),
              is_last: res.is_last,
              main_data_received: true,
              refresh_triggered: false,
              is_loading_more: false,
            })
          }
        } else {
          wx.showToast({
            title: res.msg ? res.msg : "错误",
            icon: "none",
            duration: 1000
          })
        }
      })


  },

  // /post/list/latest
  getPostByLatest: function () {
    var that = this
    newRequest('/post/list/latest', {
        page: that.data.page
      }, that.getPostByLatest)
      .then((res) => {
        wx.hideLoading()
        if (res.code == 200) {

          if (wx.getStorageSync('ban_uni_post')) {
            var post_list = res.one_list.filter(function (item) {
              return !item.data.post_is_uni
            });
          } else {
            var post_list = res.one_list
          }

          if (that.data.page == '0') {
            // that.setData({post_list:[]})
            that.setData({
              post_list: post_list,
              is_last: res.is_last,
              main_data_received: true,
              refresh_triggered: false,
              is_loading_more: false,
            })
            wx.stopPullDownRefresh()
          } else {
            that.setData({
              post_list: that.data.post_list.concat(post_list),
              is_last: res.is_last,
              main_data_received: true,
              refresh_triggered: false,
              is_loading_more: false,
            })
          }
        } else {
          wx.showToast({
            title: res.msg ? res.msg : "错误",
            icon: "none",
            duration: 1000
          })
        }
      })

  },

  // /post/list/topic
  getPostByTopic: function () {
    var that = this
    newRequest("/post/list/topic", {
        post_topic: that.data.topic_list[that.data.current_tab],
        page: that.data.page
      }, that.getPostByTopic)
      .then((res) => {
        if (res.code == 200) {
          if (wx.getStorageSync('ban_uni_post')) {
            var post_list = res.one_list.filter(function (item) {
              return !item.data.post_is_uni
            });
          } else {
            var post_list = res.one_list
          }

          if (that.data.page == '0') {
            // that.setData({post_list:[]})
            that.setData({
              post_list: post_list,
              is_last: res.is_last,
              main_data_received: true,
              refresh_triggered: false,
              is_loading_more: false,
            })
            wx.stopPullDownRefresh()
          } else {
            that.setData({
              post_list: that.data.post_list.concat(post_list),
              is_last: res.is_last,
              main_data_received: true,
              refresh_triggered: false,
              is_loading_more: false,
            })
          }
        } else {
          wx.showToast({
            title: res.msg ? res.msg : "错误",
            icon: "none",
            duration: 1000
          })
        }
      })

  },

  // /info/banner
  getBanner: function () {
    var that = this
    newRequest('/info/banner', {}, that.getBanner)
      .then((res) => {
        if (res.code == 200) {
          that.setData({
            banner_list: res.banner_list,
            content_loaded: this.data.content_loaded + 1
          })
        } else {
          wx.showToast({
            title: res.msg ? res.msg : "错误",
            icon: "none",
            duration: 1000
          })
        }
      })
  },

  // /info/gettopic
  getTopic: function () {
    var that = this
    newRequest("/info/gettopic", {}, that.getTopic)
      .then((res) => {
        if (res.code == 200) {
          that.setData({
            navbar_items: that.data.navbar_items.concat(res.topic_list),
            topic_list: res.topic_list,
            content_loaded: this.data.content_loaded + 1
          })
        } else {
          wx.showToast({
            title: res.msg ? res.msg : "错误",
            icon: "none",
            duration: 1000
          })
        }
      })
  },

  // /info/openad
  getAd: function () {
    var that = this
    newRequest('/info/openad', {}, that.getAd)
      .then((res) => {
        if (res.code == 200 && res.ad_info != null) {
          getImageCache("openAd", res.ad_info.ad_image)
            .then((path) => {
              console.log("openAd image cache at: ", path)
              res.ad_info.ad_image = path
              that.setData({
                ad_info: res.ad_info,
                show_ad: true,
                content_loaded: this.data.content_loaded + 1
              })
            })
            .catch(() => {
              that.setData({
                ad_info: res.ad_info,
                show_ad: true,
                content_loaded: this.data.content_loaded + 1
              })
            })
        } else {
          that.setData({
            content_loaded: this.data.content_loaded + 1
          })
        }
      })

  },

  getAll: function () {
    if (this.data.current_tab == -4) {
      wx.hideLoading()
    } else if (this.data.current_tab == -3) {
      this.getPostByLatest();
    } else if (this.data.current_tab == -2) {
      this.getPostByHot();
    } else if (this.data.current_tab == -1) {
      this.getPost();
    } else if (this.data.current_tab >= 0) {
      this.getPostByTopic();
    }
  },

  // onTapFunction:function(){
  //   var function_list = this.data.function_list
  //   switch (function_list.function_type) {
  //     case 'article':
  //       wx.navigateTo({
  //         url: '/pages/webview/webview?url=' + function_list.function_link,
  //       });
  //       break;
  //     case 'inner':
  //       console.log(function_list)
  //       wx.navigateTo({ url: function_list.function_link });
  //       break;
  //     case 'miniprogram': {
  //       const splitIndex = function_list.function_link.indexOf('/');
  //       if (splitIndex >= 0) {
  //         const appId = function_list.function_link.slice(0, splitIndex);
  //         const path = function_list.function_link.slice(splitIndex + 1);
  //         wx.navigateToMiniProgram({ appId, path });
  //       } else {
  //         wx.navigateToMiniProgram({ appId: function_list.function_link });
  //       }
  //       break;
  //     }
  //     case 'none':
  //     default:
  //       break;
  //   }
  // },

  onTapAd: function () {
    this.setData({
      show_ad: false
    })
    var ad_info = this.data.ad_info
    switch (ad_info.ad_type) {
      case 'article':
        wx.navigateTo({
          url: '/pages/webview/webview?url=' + ad_info.article_link,
        });
        break;
      case 'post':
        wx.navigateTo({
          url: '/pages/detail/detail?post_id=' + ad_info.post_id,
        });
        break;
      case 'inner':
        wx.navigateTo({
          url: ad_info.inner_path
        });
        break;
      case 'miniapp':
        wx.navigateToMiniProgram({
          appId: ad_info.miniapp_appid,
          path: ad_info.miniapp_path,
        })
        break;
      case 'none':
      default:
        break;
    }
  },

  // handleStarTap() {
  //   wx.navigateTo({
  //     url: '/pages/write/write'
  //   });
  // },

  bindScroll: function (e) {
    // console.log(e.detail.scrollHeight - e.detail.scrollTop)
    if (this.data.is_loading_more) {
      return
    }
    if (e.detail.scrollHeight - e.detail.scrollTop < 3000) {
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

  getQueryVariable: function (qrlink, variable) {
    var vars = qrlink.split("&");
    console.log(vars)
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return (false);
  },

  swiperChange: function (e) {
    if (e.detail.source != 'touch') {
      return
    }
    this.navbarTap(e.detail.current + this.data.start_index)
    this.setData({
      nav_to_view: e.detail.current + this.data.start_index - 2
    })
  },

  checkTerms: function () {
    let that = this
    return new Promise(function (resolve, reject) {
      newRequest('/user/terms/check', {}, that.checkTerms)
        .then((res) => {
          if (res.code == 201) {
            that.setData({
              show_privacy: true
            })
            reject()
          } else if (res.code == 200) {
            resolve()
          } else {
            wx.showToast({
              title: res.msg ? res.msg : "错误",
              icon: "none",
              duration: 1000
            })
            reject()
          }
        })
    })
  },
  // getCalendarNow:function(){
  //   var that = this
  //   wx.request({
  //     url: 'https://api.pupu.hkupootal.com/v3/calendar/getnow.php', 
  //     method: 'POST',
  //     data: {
  //       token:wx.getStorageSync('token'),
  //     },
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     success (res) {
  //       if(res.data.code == 200){
  //         that.setData({
  //           calendar_now_data:res.data.calendar_now_data
  //         })
  //       }else if(res.data.code == 800 ||res.data.code == 900){
  //         app.launch().then(res=>{
  //           that.getCalendarNow()
  //         })
  //       }else{
  //         wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
  //       }
  //     }
  //   })
  // },


  initializeWhenReady: function (options) {
      this.getAd()
      this.getAll()
      this.getBanner()
      this.getTopic()

      if (options && !app.globalData.show_privacy) {
        if (options.jump_page) {
          if (options.jump_page === 'detail') {
            if (options.uni_post_id) {
              wx.navigateTo({
                url: '/pages/detail/detail?uni_post_id=' + options.uni_post_id,
              });
            } else if (options.post_id) {
              wx.navigateTo({
                url: '/pages/detail/detail?post_serial=' + options.post_id,
              });
            } else if (options.post_serial) {
              wx.navigateTo({
                url: '/pages/detail/detail?post_serial=' + options.post_serial,
              });
            }
          }
        }
      }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    // var qrlink = decodeURIComponent(options.q)
    // if(qrlink.match("https://pupu.hkupootal.com/qrcode?")){
    //   var query = qrlink.split("https://pupu.hkupootal.com/qrcode?")
    //   var mode = that.getQueryVariable(query[1],"mode")
    //   if(mode == "auth"){
    //     wx.navigateTo({
    //       url: '/pages/auth/auth?auth_key=' + that.getQueryVariable(query[1],"auth_key"),
    //     })
    //   }
    // }
    that.initializeWhenReady(options)
    
    app.watch('privacy_checked',(v)=>{
      console.log("Privacy checked: ", v)
      this.setData({
          show_privacy: app.globalData.show_privacy
      })
  })

    wx.onThemeChange((result) => {
      that.setData({
        theme: app.globalData.theme
      })
    })

    // if (app.globalData.auth_key) {
    //     wx.navigateTo({
    //         url: '/pages/auth/auth?auth_key=' + app.globalData.auth_key + '&from_miniapp=' + app.globalData.from_miniapp,
    //     })
    // }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().setData({
      selected: 0
    })
    app.globalData.tabbarJS = this
    app.updateTabbar()
    // this.getCalendarNow()
    this.setData({
      allow_home_swipe: wx.getStorageSync('allow_home_swipe'),
      show_privacy: app.globalData.show_privacy
    })

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.indexJS = ''
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.globalData.indexJS = ''
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
      title: info.slogan,
      imageUrl: info.share_cover,
    };
  },
});