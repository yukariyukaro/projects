// components/enableNotification/enableNotification.js
import info from "../../utils/info"
import newRequest from "../../utils/request"

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    type: String,
  },

  /**
   * 组件的初始数据
   */
  data: {
    title: "开启通知功能？",
    message: "不要错过对你的评论、回复、私信以及你围观树洞的更新！",
    disclaimer: "*通知功能由「" + info.service_account + "」公众号提供，开启前需要先关注此公众号",
    school_label_lower: info.school_label.toLowerCase(),
    primary_color: wx.getSystemInfoSync().theme == 'light' ? info.primary_color_on_light : info.primary_color_on_dark,
    close: false,
    block_popup: false,
  },

  lifetimes: {
    attached() {
      if (this.properties.type == "default") {
        this.setData({
          message: "不要错过对你的评论、回复、私信以及你围观树洞的更新！",
        })
      } else if (this.properties.type == "comment") {
        this.setData({
          message: "保持关注！当你的评论收到回复时，我们会通知你。",
        })
      } else if (this.properties.type == "pm") {
        this.setData({
          message: "不要错过私信消息！开启通知功能后，我们会及时通知你新的私信消息。",
        })
      } else if (this.properties.type == "post") {
        this.setData({
          message: "保持关注！当有人评论你的树洞时，我们会通知你。",
        })
      } else if (this.properties.type == "follow") {
        this.setData({
          message: "不要错过围观树洞的更新！当洞主更新时，我们会通知你。",
        })
      }
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleDisagree(e) {
      if (this.data.block_popup) {
        wx.setStorageSync('block_notification_notice', true)
      }
      this.disPopUp()
      setTimeout(() => {
        this.triggerEvent("disagree")
      }, 390);
    },

    handleAgree(e) {
      var that = this

      newRequest("/notice/accept", {
        notice_accept: true,
        notice_method: 'service'
      }, that.serviceAccountNotification).then(res => {
        if (res.code == 200) {
          wx.showToast({
            title: '开启公众号推送成功',
            icon: "none",
            duration: 1000
          })
          that.disPopUp()
            setTimeout(() => {
              that.triggerEvent("agree")
            }, 450);
        } else if (res.code == 210) {
          wx.showToast({
            title: '关闭公众号推送成功',
            icon: "none",
            duration: 1000
          })
        } else if (res.code == 401) {
          wx.showToast({
            title: '没有关注' + info.service_account,
            icon: "none",
            duration: 1000
          })
          wx.navigateTo({
            url: '/pages/followService/followService',
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

    disPopUp() {
      this.setData({
        close: true
      })
    },

    agreeBlock() {
      this.setData({
        block_popup: !this.data.block_popup
      })
    }

    
  }
})