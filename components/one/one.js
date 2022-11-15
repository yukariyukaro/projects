// components/one/one.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: String,
    data: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    preURL: 'https://i.boatonland.com/avatar/',
    is_dark:false
  },

  lifetimes: {
    attached:function(){
      var that = this
      var systemInfo = wx.getSystemInfoSync()
      if(systemInfo.theme == 'dark'){
        that.setData({
          is_dark: true
        })
      }
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    postImageOnLoad: function () {
      var data = this.properties.data
      data.post_image_is_loaded = true
      this.setData({
        data: data
      });
    },
    courseShowAll: function () {
      var data = this.properties.data
      data.course_show_all = true
      this.setData({
        data: data
      });
    },
    courseAddSubclass: function (e) {
      var that = this
      console.log(e.currentTarget.dataset.subclassid)
      console.log(e.currentTarget.dataset.index)
      wx.request({
        url: 'https://api.pupu.hkupootal.com/v3/course/add.php', 
        method: 'POST',
        data: {
          token:wx.getStorageSync('token'),
          subclass_id:e.currentTarget.dataset.subclassid,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success (res) {
          wx.hideLoading()
          if(res.data.code == 200){
            var data = that.properties.data
            data.course_subclass_list[e.currentTarget.dataset.index].is_added = true
            that.setData({
              data: data
            });
            wx.showToast({title: "选课成功", icon: "success", duration: 1000})
            var pages = getCurrentPages()
            var currentPage = pages[pages.length-1]
            var url = currentPage.route
            if(url=="pages/mySubclass/mySubclass"){
              currentPage.getSubclass()
            }
          }else if(res.data.code == 201){
            var data = that.properties.data
            data.course_subclass_list[e.currentTarget.dataset.index].is_added = false
            that.setData({
              data: data
            });
            wx.showToast({title: "取消选课成功", icon: "success", duration: 1000})
            var pages = getCurrentPages()
            var currentPage = pages[pages.length-1]
            var url = currentPage.route
            if(url=="pages/mySubclass/mySubclass"){
              currentPage.getSubclass()
            }
          }else if(res.data.code == 800 ||res.data.code == 900){
            app.launch().then(res=>{
              that.courseAddSubclass(e)
            })
          }else{
            wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
          }
        }
      })
    },
    buttonShowAll: function () {
      var data = this.properties.data
      data.button_show_all = true
      this.setData({
        data: data
      });
    },
    textShowAll: function () {
      var data = this.properties.data
      data.text_content = data.text_content_completed
      data.text_is_completed = true
      this.setData({
        data: data
      });
    },
    nav2Post: function () {
      wx.navigateTo({
        url: '/pages/detail/detail?post_id=' + this.properties.data.post_id,
      })
    },
    nav2OrgFromArticle: function () {
      wx.navigateTo({
        url: '/pages/org/org?user_serial=' + this.properties.data.user_serial,
      })
    },
    nav2Article: function () {
      if(!this.properties.data.post_media.open_comment){
        wx.navigateTo({url: '/pages/webview/webview?url=' + this.properties.data.post_media.article_link,})
      }else{
        wx.navigateTo({url: '/pages/detail/detail?post_id=' + this.properties.data.post_id,})
      }
    },
    nav2OrgFromOrg: function () {
      wx.navigateTo({
        url: '/pages/org/org?user_serial=' + this.properties.data.user_serial,
      })
    },
    nav2MySubclass: function () {
      wx.navigateTo({
        url: '/pages/mySubclass/mySubclass',
      })
    },
    courseJoinGroup: function() {
      wx.navigateToMiniProgram({
        appId:'wxa5de39979ae7affa',
        path:'/pages/newindex/newindex?group_code=' + this.properties.data.course_code,
      })
    },
    courseNav2My: function(){
      var pages = getCurrentPages()
      var currentPage = pages[pages.length-1]
      var url = currentPage.route
      if(url!="pages/mySubclass/mySubclass"){
        wx.navigateTo({
          url: '/pages/mySubclass/mySubclass'
        })
      }else{
        wx.showToast({
          title: '点击下方按钮即可导出到日历',icon: "none",duration: 2000
        })
      }
      
    },
    copyUrl: function (e) {
      this.copyUrlReal(e.currentTarget.dataset.urllink, e.currentTarget.dataset.urltitle)
    },
    copyUrlReal: function (url_link, url_title) {
      wx.setClipboardData({
        data: url_link,
        success: () => {
          wx.hideToast()
          wx.showToast({
            title: '网页链接已复制，你也可以点击公众号推送跳转',
            icon: "none",
            duration: 2000
          })
        }
      })
      wx.request({
        url: 'https://api.pupu.hkupootal.com/v3/one/sendurl.php', 
        method: 'POST',
        data: {
          token:wx.getStorageSync('token'),
          url_link:url_link,
          url_title:url_title
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      })
    },
    orgOnTapBanner: function (e) {
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
          wx.navigateTo({
            url: banner_item.inner_path
          });
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
    handleFunctionPre: function (e) {
      this.handleFunction(e.currentTarget.dataset.functionitem)
    },
    handleFunction: function (function_item) {
      var that = this
      switch (function_item.function_type) {
        case 'list':
          wx.showActionSheet({
            itemList: function_item.function_list.map(x => {
              return x.function_title
            }),
            success(res) {
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
          wx.navigateTo({
            url: function_item.inner_path
          });
          break;
        case 'miniapp':
          wx.navigateToMiniProgram({
            appId: function_item.miniapp_appid,
            path: function_item.miniapp_path,
          })
          break;
        case 'pm':
          wx.showToast({
            title: '请进入社团主页后私信',
            icon: "none",
            duration: 1000
          })
          break;
        case 'url':
          that.copyUrlReal(function_item.url_link, function_item.url_title)
          break;
        case 'none':
        default:
          break;
      }
    },
  }
})