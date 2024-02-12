var app = getApp();
import {
  getLinks
} from "../../utils/getlinks"
Component({
  properties: {
    exist: Boolean,
    comment_id: Number,
    comment_order: Number,
    comment_msg: String,
    comment_create_time: String,
    is_author: Boolean,
    is_anonymous: Boolean,
    is_org: Boolean,
    post_is_author: Boolean,
    comment_alias: String,
    user_avatar: String,
    uni_post_id: String,
    user_serial: String,
    comment_school_label: String,
    post_is_author: Boolean,
    comment_father_msg: (String || null),
    comment_image: (String || null),
    comment_theme_color: String,
    is_skeleton: Boolean,
  },

  data: {
    preURL: 'https://i.boatonland.com/avatar/',
    borderStyle: "",
    comment_date: "",
    parsed_msg: "",
    theme: app.globalData.theme
  },

  lifetimes: {
    attached: function () {
      var app = getApp()
      var systemInfo = wx.getSystemInfoSync()
      // console.log(this.properties.comment_school_label)
      this.setData({
        comment_date: this.format_time(this.properties.comment_create_time),
        parsed_msg: getLinks(this.properties.comment_msg, this.properties.comment_school_label)
      })
      if (app.globalData.themeInfo.primaryColorLight) {
        if (systemInfo.theme == 'dark') {
          this.setData({
            borderStyle: "border: 1px solid " + app.globalData.themeInfo.primaryColorDark + ";"
          })
        } else {
          this.setData({
            borderStyle: "border: 1px solid " + app.globalData.themeInfo.primaryColorLight + ";"
          })
        }
      }
      if (this.properties.comment_theme_color) {
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
      if (this.properties.is_org && !this.properties.is_anonymous) {
        wx.navigateTo({
          url: "/pages/org/org?user_serial=" + this.properties.user_serial + "&school_label=" + this.properties.comment_school_label
        })
      } else if (this.properties.is_anonymous) {
        wx.navigateTo({
          url: "/pages/visitProfile/visitProfile?is_anonymous=true&user_serial=NA&uni_post_id=" + this.properties.uni_post_id + "&comment_order=" + this.properties.comment_order + "&avatar=" + this.properties.user_avatar + "&school_label=" + this.properties.comment_school_label
        })
      } else {
        wx.navigateTo({
          url: "/pages/visitProfile/visitProfile?&user_serial=" + this.properties.user_serial + "&uni_post_id=" + this.properties.uni_post_id + "&comment_order=" + this.properties.comment_order + "&school_label=" + this.properties.comment_school_label
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
        title: "确认删除？",
        content: "删除后将无法恢复",
        success(res) {
          if (res.confirm) {
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

    time: function () {
      var date = new Date();
      var time = date.getTime().toString();
      return parseInt(time.substring(0, time.length - 3));
    },

    format_time: function (timestamp) {
      var dur = this.time() - timestamp;
      if (dur < 60) {
        return '刚刚';
      } else if (dur < 3600) {
        return parseInt(dur / 60) + '分钟前';
      } else if (dur < 86400) {
        return parseInt(dur / 3600) + '小时前';
      } else if (dur < 172800) {
        var s = new Date(timestamp * 1000);
        return "昨天 " + String(s.getHours()).padStart(2, "0") + ":" + String(s.getMinutes()).padStart(2, "0");
      } else if (dur < 259200) {
        var s = new Date(timestamp * 1000);
        return "前天 " + String(s.getHours()).padStart(2, "0") + ":" + String(s.getMinutes()).padStart(2, "0");
      } else {
        var s = new Date(timestamp * 1000);
        return (s.getYear() + 1900) + "-" + (s.getMonth() + 1) + "-" + s.getDate() + " " + String(s.getHours()).padStart(2, "0") + ":" + String(s.getMinutes()).padStart(2, "0");
      }

    },

  },


});