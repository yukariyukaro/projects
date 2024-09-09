// components/one/one.js
const info = require("../../utils/info");

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: String,
    data: Object,
    source: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    preURL: 'https://i.boatonland.com/avatar/',
    is_dark:false,
    school_label: info.school_label,
    tag_has_emoji: false,
  },

  lifetimes: {
    attached:function(){      
      var that = this
      // console.log(that.properties)
      var systemInfo = wx.getSystemInfoSync()
      if(systemInfo.theme == 'dark'){
        that.setData({
          is_dark: true
        })
      }
      
      if (that.data.type == 'post'){
        const regex_emoji = /[\p{Extended_Pictographic}\u{1F3FB}-\u{1F3FF}\u{1F9B0}-\u{1F9B3}]+/gu;
        const has_emoji = that.data.data.post_topic.match(regex_emoji)? true : false;
        // let temp = that.data.data
        // if(emoji){
        //   let post_fix = temp.post_topic.slice(2)
        //   if (post_fix.length > 9){
        //     post_fix = post_fix.slice(5,10)
        //   }

        //   temp.post_topic = emoji+post_fix
        // }
        // temp.post_msg = temp.post_msg.replaceAll("\\n", "\n")

        that.setData({
          tag_has_emoji: has_emoji,
          data: that.data.data,
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
      let query_str = JSON.stringify(this.properties.data)
      wx.navigateTo({
        url: '/pages/detail/detail?uni_post_id=' + this.properties.data.uni_post_id + '&post_detail=' + query_str,
      })
    },
    nav2OrgFromArticle: function () {
      wx.navigateTo({
        url: '/pages/org/org?user_serial=' + this.properties.data.user_serial,
      })
    },
    nav2Article: function () {
      if(this.properties.data.article_link){
        wx.navigateTo({url: '/pages/webview/webview?url=' + this.properties.data.article_link,})
      }else{
        let query_str = JSON.stringify(this.properties.data)
        wx.navigateTo({url: '/pages/detail/detail?uni_post_id=' + this.properties.data.uni_post_id + '&post_detail=' + query_str})
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
        path: "/pages/group/group?group_id=" + this.properties.data.group_id,
      })
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
      // wx.request({
      //   url: 'https://api.pupu.hkupootal.com/v3/one/sendurl.php', 
      //   method: 'POST',
      //   data: {
      //     token:wx.getStorageSync('token'),
      //     url_link:url_link,
      //     url_title:url_title
      //   },
      //   header: {
      //     'content-type': 'application/x-www-form-urlencoded'
      //   }
      // })
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
            url: '/pages/detail/detail?uni_post_id=' + banner_item.uni_post_id,
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
        case 'report2023':
          wx.navigateTo({
            url: '/pages/webview/webview?url=' + info.report_url + '&token=' + wx.getStorageSync('token')
          });
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
            url: '/pages/detail/detail?uni_post_id=' + function_item.uni_post_id,
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