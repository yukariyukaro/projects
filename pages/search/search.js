var app = getApp();
import info from '../../utils/info';
import newRequest from '../../utils/request';
import * as TextEncoding from 'text-encoding-shim';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // one_list:[
    //   {type:'course', data:{
    //     course_code: 'BBMS1001',
    //     course_title: 'Introduction to Human Anatomy and Physiology',
    //     course_dept: '这是课程类型的卡片',
    //     course_subclass_list: [
    //       {
    //         subclass_section: '2N',
    //         subclass_time: [{date:"MON",start_time:"11:30",end_time:"12:20",venue:"KKLG102"},{date:"THU",start_time:"10:30",end_time:"12:20",venue:"KKLG102"}],
    //         subclass_instructor: ["Ching,Yick Pang","Jin,Dong-Yan"]
    //       },
    //       {
    //         subclass_section: '2O',
    //         subclass_time: [{date:"MON",start_time:"11:30",end_time:"12:20",venue:"KKLG102"},{date:"THU",start_time:"10:30",end_time:"12:20",venue:"KKLG102"}],
    //         subclass_instructor: ["Kwong,Sze Ting Jasmine"]
    //       },
    //       {
    //         subclass_section: '2P',
    //         subclass_time: [{date:"MON",start_time:"11:30",end_time:"12:20",venue:"KKLG102"},{date:"THU",start_time:"10:30",end_time:"12:20",venue:"KKLG102"}],
    //         subclass_instructor: ["Kwong,Sze Ting Jasmine"]
    //       },
    //       {
    //         subclass_section: '2Q',
    //         subclass_time: [{date:"MON",start_time:"11:30",end_time:"12:20",venue:"KKLG102"},{date:"THU",start_time:"10:30",end_time:"12:20",venue:"KKLG102"}],
    //         subclass_instructor: ["Kwong,Sze Ting Jasmine"]
    //       },
    //       {
    //         subclass_section: '2R',
    //         subclass_time: [{date:"MON",start_time:"11:30",end_time:"12:20",venue:"KKLG102"},{date:"THU",start_time:"10:30",end_time:"12:20",venue:"KKLG102"}],
    //         subclass_instructor: ["Kwong,Sze Ting Jasmine"]
    //       }
    //     ]
    //   }},
    //   {type:"post", data:{
    //     post_id: '174343',
    //     post_topic: '随写',
    //     user_avatar: 'vector',
    //     is_following: false,
    //     follower_num: 23,
    //     comment_num: 45,
    //     post_is_folded: false,
    //     post_msg: '手机浏览器是把页面放在一个虚拟的"窗口"（viewport）中，通常这个虚拟的"窗口"（viewport）比屏幕宽，这样就不用把每个网页挤到很小的窗口中（这样会破坏没有针对手机浏览器优化的网页的布局），用户可以通过平移和缩放来看网页的不同部分。',
    //     post_image: 'https://i.boatonland.com/ZMybyA6YzBhbbFN4bAMMWHrhMJNMFkCM',
    //     post_is_complete: true,
    //     post_media: {
    //       media_type: 'bilibili',
    //       bilibili_title: '这是树洞类型的卡片'
    //     }
    //   }},
    //   {type:"article", data:{
    //     post_id: '174343',
    //     user_avatar: 'vector',
    //     post_media: {
    //       media_type: 'article',
    //       article_author: 'HKUPootal',
    //       article_title: '这是文章类型的卡片',
    //       article_link: 'https://mp.weixin.qq.com/s/MNUMoJXOpOimRL2ztaZg0Q',
    //       article_image: 'https://i.boatonland.com/YabK2GWMCDxCs4B45PnJ2EwjHPYZi3rE'
    //     }
    //   }},
    //   {type:"org", data:{
    //     org_avatar: 'https://i.boatonland.com/54ZWn83WM3FmnTZXzWDZGPCGBi25n4Q2',
    //     org_bg_image: 'https://i.boatonland.com/D2N57HJ7WZwBRNt53y3KFtGbT5rGx8Z7',
    //     org_intro: '这是社团类型的卡片，这个部分主要由入驻的社团自行决定，咱们开发时最好不要用这个卡片。',
    //     org_name: 'HKUPootal',
    //     org_banner: [
    //       {
    //         banner_type: 'article',
    //         banner_title: '',
    //         banner_image: 'https://i.boatonland.com/Q56HyHCYrrcHj33DfkyzK4Ks7NK4F5mQ',
    //         article_link: 'https://mp.weixin.qq.com/s/mPbzfp2bcXNp7_KnU-IiiQ'
    //       }
    //     ],
    //     org_model_main: {
    //       function_title: '投稿 | 表白墙 树洞 话题',
    //       function_type: 'miniapp',
    //       miniapp_appid: 'wxd947200f82267e58',
    //       miniapp_path: '/pages/wjxqList/wjxqList?activityId=95324803'
    //     },
    //     org_model_half: [
    //       {
    //         function_title: '成员名册',
    //         function_type: 'article',
    //         article_link: 'https://mp.weixin.qq.com/s/umgwj6Q5Z8KbHemY5dYi9w'
    //       },
    //       {
    //         function_title: '往期精选',
    //         function_type: 'list'
    //       },
    //       {
    //         function_title: '美食大王',
    //         function_type: 'post',
    //         post_id: '161884'
    //       },
    //       {
    //         function_title: '私信小噗',
    //         function_type: 'pm'
    //       }
    //     ]
    //   }},
    //   {type:'button', data:{
    //     button_title: '这是按钮类型的卡片',
    //     button_list: [
    //       {
    //         button_text: '每个卡片可点击的部分'
    //       },
    //       {
    //         button_text: '都是全功能的'
    //       },
    //       {
    //         button_text: '可以跳转树洞、网页、小程序等等'
    //       },
    //       {
    //         button_text: '链接类型的卡片也能跳小程序'
    //       },
    //       {
    //         button_text: '文字类型的标题也可以点'
    //       },
    //     ]
    //   }},
    //   {type:'link', data:{
    //     link_image: 'https://i.boatonland.com/ZMybyA6YzBhbbFN4bAMMWHrhMJNMFkCM',
    //     link_title: '这是链接类型的卡片',
    //     link_info: '图片是可选的，如无图片，右边的文字部分将占满宽度。介绍最多三行。不止能跳转链接，干啥都行。',
    //     function_type: 'url',
    //     url_link: 'https://baidu.com',
    //     url_title: '百度官网',
    //     sub_link_list: [
    //       {
    //         link_title: '这里是可选分链接1',
    //         function_type: 'url',
    //         url_link: 'https://baidu.com',
    //         url_title: '百度官网'
    //       },
    //       {
    //         link_title: '这里是可选分链接2',
    //         function_type: 'url',
    //         url_link: 'https://baidu.com',
    //         url_title: '百度官网'
    //       },
    //       {
    //         link_title: '这里是可选分链接3',
    //         function_type: 'url',
    //         url_link: 'https://baidu.com',
    //         url_title: '百度官网'
    //       },
    //     ]
    //   }},
    //   {type:"text", data:{
    //     text_title: '这是文字类型的卡片',
    //     text_content: '有没有一种可能，文字类型的标题也是可以点的呢？行程卡取消星号，值得一提的是，摘“星”消息传出后，刺激一些平台上的旅游产品搜索量齐上涨，令人欣喜，正如有业内人士所称，在多重利好政策及需求恢复的双重支撑下，旅游市场正在重回复苏轨道。但要清醒看到，摘“星”了并不意味着疫情防控可以掉以轻心，更...',
    //     text_content_completed: '有没有一种可能，文字类型的标题也是可以点的呢？行程卡取消星号，值得一提的是，摘“星”消息传出后，刺激一些平台上的旅游产品搜索量齐上涨，令人欣喜，正如有业内人士所称，在多重利好政策及需求恢复的双重支撑下，旅游市场正在重回复苏轨道。但要清醒看到，摘“星”了并不意味着疫情防控可以掉以轻心，更不意味着抗疫已经进入扫尾阶段。全国疫情总体处于稳中向好态势，但疫情还没有见底，外防输入、内防反弹压力还很大，仍需克服麻痹思想、厌战情绪、松劲心态。同时，政策释放的积极信号应精准抵达，各地不能在行程码摘“星”的同时，以其他方式变相“加码”。',
    //     text_image: 'https://i.boatonland.com/ZMybyA6YzBhbbFN4bAMMWHrhMJNMFkCM',
    //     text_is_completed: false,
    //     function_type: 'post',
    //     post_id: '161884'
    //   }},
    // ],
    one_list: [],
    search_placeholder: '',
    is_last: true,
    is_loading_more: false,
    focus: false,
    key_word: '',
    page: 0,
    scroll_top: 0,
    status_bar_height: 0,
    status_bar_opacity: 0,
    status_bar_opacity_mask: 0,
    theme: '',
    hku_one_logo: '',
    navigation_bar_background_color: wx.getSystemInfoSync().theme == 'dark'? info.search_nav_bar_color_dark :info.search_nav_bar_color,
    result_shown: false,
    search_mode: "default",
    show_modes: false,
    mode_list: ['默认', '最新', '最热'],
    mode_list_eng: ['default', 'latest', 'hot'],
    mode_index: 0,
    filter_list: ['UNI', '本校'],
    filter_index: 0,
    include_uni: true,
    allow_scroll: true,
    search_suggestion_list: [],
    search_list_loaded: false,
    aisearch_detail: null,
    ai_is_getting_answer: false,
    ai_answer: '',
    school_label: info.school_label
  },

  getOneList: function () {
    var that = this
    newRequest("/post/list/topic", {
        post_topic: info.search_page_topic,
        page: that.data.page
      }, that.getOneList)
      .then(res => {

        if (res.code == 200) {
          if (that.data.page == '0') {
            // that.setData({one_list: []})
            that.setData({
              one_list: res.one_list,
              is_last: res.is_last,
              is_loading_more: false
            })
          } else {
            that.setData({
              one_list: that.data.one_list.concat(res.one_list),
              is_last: res.is_last,
              is_loading_more: false
            })
          }
        } else {
          wx.showToast({
            title: res.msg,
            icon: "error",
            duration: 1000
          })
        }
      })

  },

  getBySearch: function () {
    var that = this
    if (that.data.page == '0') {
      wx.showLoading({
        title: '搜索中',
      })
    }

    that.setData({
      search_list_loaded: false,
      search_suggestion_list: []
    })

    newRequest("/post/list/search", {
        key_word: that.data.key_word,
        page: that.data.page,
        search_mode: that.data.search_mode,
        include_uni: that.data.include_uni,
      }, that.getBySearch, true, true)
      .then(res => {
        if (res.code == 200) {
          if (that.data.page == '0') {
            // that.setData({one_list: []})
            that.setData({
              one_list: res.one_list,
              is_last: res.is_last,
              is_loading_more: false,
              result_shown: true,
            })
          } else {
            that.setData({
              one_list: that.data.one_list.concat(res.one_list),
              is_last: res.is_last,
              is_loading_more: false,
            })
          }
          if (res.aisearch_detail) {
            that.setData({
              aisearch_detail: res.aisearch_detail
            })
            that.getAiSearchResult()
          } else {
            if (this.page == 0) {
              that.setData({
                aisearch_detail: null
              })
            }
          }
        } else {
          wx.showToast({
            title: res.msg ? res.msg : "错误",
            icon: "error",
            duration: 1000
          })
        }
      })

  },
  getPlaceholder: function () {
    var that = this
    newRequest("/info/placeholder", {}, that.getPlaceholder)
      .then(res => {
        if (res.code == 200) {
          that.setData({
            search_placeholder: res.placeholder
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

  check: function () {
    var that = this
    newRequest("/user/profile/get", {}, that.check)
      .then(res => {
        if (res.code == 200) {
          if (!res.user_info.is_following_service_account) {
            wx.reLaunch({
              url: '/pages/followService/followService',
            })
          }
        }
      })

  },

  setPlaceholder: function () {
    if (!this.data.key_word) {
      this.setData({
        key_word: this.data.search_placeholder,
      })
    }
    this.setData({
      page: 0,
      scroll_top: 0
    })
    this.getBySearch()
  },
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
    if (this.data.key_word) {
      this.getBySearch()
    } else {
      this.getOneList()
    }
  },
  bindScroll: function (e) {
    // var scrollTop = e.detail.scrollTop
    // if(scrollTop<100){ scrollTop = 100 }
    // let opacity = (scrollTop - 100) / 100;
    // if (scrollTop > 200) {
    //   opacity = 1;
    // }
    // this.setData({
    //   status_bar_opacity:opacity,
    //   status_bar_opacity_mask:0.3*opacity
    // });
    this.setData({
      focus: false
    })
    if (this.data.is_loading_more) {
      return
    }
    if (e.detail.scrollHeight - e.detail.scrollTop < 3500) {
      this.onLoadMore()
    }
  },

  getSearchSuggestion: function () {
    var that = this
    // console.log("search Suggestions: ", this.data.search_suggestion_list, this.data.search_suggestion_list.length)
    newRequest("/info/searchsuggestion", {
        key_word: that.data.key_word
      }, that.getSearchSuggestion)
      .then((res) => {
        if (res.code == 200) {
          var temp_list = []
          res.search_suggestion_list.forEach((suggestion) => {
            var parts = suggestion.split(new RegExp(that.data.key_word, "i"))
            temp_list.push({
              orginal: suggestion,
              before: parts[0],
              matched: that.data.key_word,
              after: parts[1]
            })
          })

          that.setData({
            search_list_loaded: true,
            search_suggestion_list: temp_list
          })
        }
      })
  },

  onInputKeyWord: function (e) {
    this.setData({
      key_word: e.detail.value,
      page: 0,
    })
    if (this.data.key_word) {
      this.getSearchSuggestion()
    } else {
      this.getOneList()
      this.setData({
        search_list_loaded: false,
        search_suggestion_list: []
      })
    }
  },

  clearInput: function () {
    this.setData({
      key_word: '',
      page: 0,
      scroll_top: 0,
      is_loading_more: false,
      show_modes: false,
      focus: false,
      result_shown: false,
      search_mode: this.data.mode_list_eng[0],
      mode_index: 0,
      search_suggestion_list: [],
      search_list_loaded: false,
      ai_answer: "",
      aisearch_detail: null
    })
    this.getOneList()
  },
  bindfocus: function () {
    this.setData({
      focus: true
    })
  },
  bindblur: function () {
    this.setData({
      focus: false
    })
  },
  bindModeTap: function () {
    var that = this
    that.setData({
      show_modes: !that.data.show_modes,
      allow_scroll: that.data.show_modes
    })
  },

  bindTapSuggestion: function (e) {
    var that = this
    var query = that.data.search_suggestion_list[e.currentTarget.id].orginal
    console.log(query)
    that.setData({
      key_word: query,
      page: 0,
    })
    that.getBySearch()
  },

  bindModes: function (e) {
    var that = this
    var new_mode = that.data.mode_list_eng[e.detail.value]
    that.setData({
      mode_index: e.detail.value,
      search_mode: new_mode,
      page: 0,
      is_loading_more: true,
      allow_scroll: true,
      scroll_top: 0,
    })

    if (that.data.show_modes) {
      setTimeout(() => {
        that.setData({
          scroll_top: 0,
          allow_scroll: false,
        }, 2)
      })
    }
    that.getBySearch()
  },

  bindFilters: function (e) {
    var that = this
    var include_uni = !!(1 - e.detail.value)
    that.setData({
      filter_index: e.detail.value,
      include_uni: include_uni,
      page: 0,
      is_loading_more: true,
      allow_scroll: true,
      scroll_top: 0,
    })

    if (that.data.show_modes) {
      setTimeout(() => {
        that.setData({
          scroll_top: 0,
          allow_scroll: false,
        }, 2)
      })
    }
    that.getBySearch()
  },

  getAiSearchResult() {
    let that = this
    if (that.data.ai_is_getting_answer) return
    that.setData({
      ai_is_getting_answer: true,
      ai_answer: '',
      ai_answer_html: ''
    })

    // const url = 'https://api.chat.hkupootal.com/search.php?id=' + that.data.aisearch_detail.ai_search_id + '&token=' + wx.getStorageSync('token')
    const url = 'https://chat.tripleuni.com/search.php?id=' + that.data.aisearch_detail.ai_search_id + '&token=' + wx.getStorageSync('token')

    const requestTask = wx.request({
      url: url,
      enableChunked: true,
    })

    requestTask.onChunkReceived(res => {
      // console.log(res)
      const uint8Array = new Uint8Array(res.data);
      // let result = String.fromCharCode.apply(null, uint8Array)
      const result = new TextEncoding.TextDecoder('utf-8').decode(uint8Array);
      let stream = result.split("\n\n")
      console.log(stream)

      stream.map((event) => {
        if (event.startsWith('data')) {
          try {
            let details = JSON.parse(event.replace("data:", ""))
            if (details.content) {
              that.setData({
                ai_answer: that.data.ai_answer + details.content
              })
            }
          } catch (error) {
            console.log(error)
          }
        } else if (event.startsWith("retry")) {
          requestTask.abort();
          that.setData({
            ai_is_getting_answer: false,
            ai_answer: that.data.ai_answer + "  \n  \n参考链接："
          })

          that.data.aisearch_detail.reference_list.map((reference, index) => {
            that.setData({
              ai_answer: that.data.ai_answer + "  \n\[" + (index + 1) + "\] [" + reference.title + "](" + reference.link + ")",
            })
          })
        }
      })
    })

  },

  updateTabbar: function () {
    var notice_count = wx.getStorageSync('allNoticeCount')
    if (notice_count > 0) {
      wx.setTabBarBadge({
        index: 2,
        text: String(notice_count),
      })
    } else {
      wx.removeTabBarBadge({
        index: 2,
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getOneList()
    const {
      statusBarHeight
    } = wx.getSystemInfoSync()
    this.setData({
      status_bar_height: statusBarHeight
    })
    if (app.globalData.themeInfo.hkuOneLogo) {
      this.setData({
        hku_one_logo: app.globalData.themeInfo.hkuOneLogo,
        hku_one_navigation_bar_background: app.globalData.themeInfo.hkuOneNavigationBarBackground
      })
    }
    wx.onThemeChange((result) => {
      if (result.theme == 'dark'){
        this.setData({
          navigation_bar_background_color: info.search_nav_bar_color_dark
        })
      } else {
        this.setData({
          navigation_bar_background_color: info.search_nav_bar_color
        })
      }
    })
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
    var is_dark = wx.getSystemInfoSync().theme == 'dark';
    this.getTabBar().setData({
      selected: 1
    })
    app.globalData.tabbarJS = this
    this.getPlaceholder()
    this.check()
    this.setData({
      theme: app.globalData.theme.backgroundTextStyle,
      navigation_bar_background_color: is_dark? info.search_nav_bar_color_dark : info.search_nav_bar_color
    })
    // wx.setTabBarStyle({
    //   color: '#8a8a8a',
    //   selectedColor: '#1f86fc'
    // })
    // wx.hideTabBarRedDot({
    //   index: 1,
    // })
    wx.setStorageSync('showOneRedDot', false)
    app.updateTabbar()
    if (this.data.key_word == '') {
      this.getOneList()
    }
    wx.onThemeChange((res) => {
      this.setData({
        theme: res.theme
      })
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.tabbarJS = ''
    // wx.setTabBarStyle({
    //   color: '#8a8a8a',
    //   selectedColor: '#D85050'
    // })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.globalData.tabbarJS = ''
    // wx.setTabBarStyle({
    //   color: '#8a8a8a',
    //   selectedColor: '#D85050'
    // })
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