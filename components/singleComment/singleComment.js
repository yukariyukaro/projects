var app = getApp();
Component({
  properties: {
    exist: Boolean,
    comment_id: Number,
    comment_order: Number,
    comment_msg: String,
    comment_date: String,
    is_author: Boolean,
    is_anonymous: Boolean,
    is_org: Boolean,
    post_is_author: Boolean,
    comment_alias: String,
    user_avatar: String,
    post_id: String,
    user_serial: String,
    comment_school_label: String,
    post_is_author: Boolean,
    comment_father_msg: String,
    comment_image: String,
    comment_theme_color: String
  },

  data: {
    preURL: 'https://i.boatonland.com/avatar/',
    borderStyle:""
  },
  
  lifetimes: {
    attached: function() {
      var app = getApp()
      var systemInfo = wx.getSystemInfoSync()
      if(app.globalData.themeInfo.primaryColorLight){
        if(systemInfo.theme == 'dark'){
          this.setData({
            borderStyle: "border: 1px solid " + app.globalData.themeInfo.primaryColorDark + ";"
          })
        }else{
          this.setData({
            borderStyle: "border: 1px solid " + app.globalData.themeInfo.primaryColorLight + ";"
          })
        }
      }
      if(this.properties.comment_theme_color){
        this.setData({
          borderStyle: "border: 1px solid " + this.properties.comment_theme_color + ";"
        })
      }
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    visitUser: function () {
      if(this.properties.is_org){
        wx.navigateTo({
          url: "/pages/org/org?user_serial=" + this.properties.user_serial
        })
      }else if(this.properties.comment_school_label == "CUHK" || this.properties.comment_school_label == "UST"){
        wx.showToast({title: '暂不支持UNI用户',icon: 'none',duration: 1000,});
        return;
      }
      if (this.properties.is_anonymous){
        wx.navigateTo({
          url: "/pages/visitProfile/visitProfile?is_anonymous=true&user_serial=NA&post_id=" + this.properties.post_id + "&comment_order=" + this.properties.comment_order
        })
      }else{
        wx.navigateTo({
          url: "/pages/visitProfile/visitProfile?&user_serial=" + this.properties.user_serial + "&post_id=" + this.properties.post_id + "&comment_order=" + this.properties.comment_order
        })
      }
    },
    reportComment: function () {
      this.triggerEvent('reportComment', {
        comment_msg: this.data.comment_msg,
        comment_index: this.data.comment_order,
        comment_id: this.data.comment_id,
      });
    },
    deleteComment: function () {
      var that = this
      app.showModal({
        title:"确认删除？",
        content:"删除后将无法恢复",
        success(res){
          if(res.confirm){
            var comment_id = that.properties.comment_id;
            that.triggerEvent('deleteComment', comment_id);
          }
        }
      })
      
    },
    goToComment: function () {
      this.triggerEvent('replyComment', {
        comment_id: this.data.comment_id,
        comment_order: this.data.comment_order,
      });
    },
    previewCommentPic: function () {
      wx.previewImage({
        urls: [this.properties.comment_image],
      });
    },
  },
  
  
});
