var app = getApp();
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
    statusBarHeight:0,
    statusBarOpacity: 0,
    statusBarOpacityMask:0,
    theme:'',
    hkuOneIcon:'',
    hkuOneNavigationBarBackground:''
  },

  getOneList: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/one/get.php', 
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
              one_list:res.data.one_list,
              is_last:res.data.is_last,
              is_loading_more:false
            })
          }else{
            that.setData({
              one_list:that.data.one_list.concat(res.data.one_list),
              is_last:res.data.is_last,
              is_loading_more:false
            })
          }
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getOneList()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  getBySearch: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/one/search.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        key_word:that.data.key_word,
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
              one_list:res.data.one_list,
              is_last:res.data.is_last,
              is_loading_more:false
            })
          }else{
            that.setData({
              one_list:that.data.one_list.concat(res.data.one_list),
              is_last:res.data.is_last,
              is_loading_more:false
            })
          }
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getBySearch()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  getPlaceholder: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/one/placeholder.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          that.setData({
            search_placeholder: res.data.search_placeholder
          })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getPlaceholder()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  check: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/one/check.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){

        }else if(res.data.code == 201){
          wx.setTabBarStyle({
            color: '#8a8a8a',
            selectedColor: '#D85050'
          })
          wx.reLaunch({
            url: '/pages/followService/followService',
          })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.check()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  setPlaceholder: function() {
    if(!this.data.search_placeholder || this.data.key_word){
      return
    }
    this.setData({
      key_word: this.data.search_placeholder
    })
    this.getBySearch()
    this.getPlaceholder()
  },
  onLoadMore: function () {
    if(this.data.is_loading_more){return}
    if(this.data.is_last){return}
    this.setData({
      is_loading_more: true,
      page:this.data.page + 1
    });
    if(this.data.key_word){
      this.getBySearch()
    }else{
      this.getOneList()
    }
  },
  bindScroll:function(e){
    var scrollTop = e.detail.scrollTop
    if(scrollTop<100){ scrollTop = 100 }
    let opacity = (scrollTop - 100) / 100;
    if (scrollTop > 200) {
      opacity = 1;
    }
    this.setData({
      statusBarOpacity:opacity,
      statusBarOpacityMask:0.3*opacity
    });
    this.setData({
      focus: false
    })
    if(this.data.is_loading_more){return}
    if(e.detail.scrollHeight - e.detail.scrollTop < 2500){
      this.onLoadMore()
    }
  },
  onInputKeyWord:function(e){
    this.setData({
      key_word:e.detail.value,
      page:0,
      scroll_top:0,
      is_loading_more:true
    })
    if(this.data.key_word){
      this.getBySearch()
    }else{
      this.getOneList()
    }
  },
  clearInput:function(){
    this.setData({
      key_word:'',
      page:0,
      scroll_top:0,
      is_loading_more:true,
      focus: true
    })
    this.getOneList()
  },
  bindfocus: function(){
    this.setData({
      focus: true
    })
  },
  bindblur: function(){
    this.setData({
      focus: false
    })
  },
  updateTabbar:function(){
    var notice_count = wx.getStorageSync('allNoticeCount')
    if(notice_count > 0){
      wx.setTabBarBadge({
        index: 2,
        text: String(notice_count),
      })
    }else{
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
    const { statusBarHeight } = wx.getSystemInfoSync()
    this.setData({
      statusBarHeight:statusBarHeight
    })
    if (app.globalData.themeInfo.hkuOneLogo) {
      this.setData({
        hkuOneLogo: app.globalData.themeInfo.hkuOneLogo,
        hkuOneNavigationBarBackground: app.globalData.themeInfo.hkuOneNavigationBarBackground
      })
    }
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
    app.globalData.tabbarJS = this
    this.getPlaceholder()
    this.check()
    this.setData({
      theme:app.globalData.theme.backgroundTextStyle
    })
    wx.setTabBarStyle({
      color: '#8a8a8a',
      selectedColor: '#1f86fc'
    })
    wx.hideTabBarRedDot({
      index: 1,
    })
    wx.setStorageSync('showOneRedDot', false)
    if(this.data.key_word == ''){
      this.getOneList()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.indexJS = ''
    wx.setTabBarStyle({
      color: '#8a8a8a',
      selectedColor: '#D85050'
    })
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.globalData.indexJS = ''
    wx.setTabBarStyle({
      color: '#8a8a8a',
      selectedColor: '#D85050'
    })
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