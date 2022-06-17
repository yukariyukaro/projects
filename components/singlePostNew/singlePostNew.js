// components/singlePost/singlePost.js
var app = getApp();
var util = require('../../utils/util.js');
const { schoolToColor } = require('../../utils/constants');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    post_id: String,
    topic_label: String,
    comment_num: String,
    follower_num: String,
    is_following: Boolean,
    post_msg: String,
    post_is_complete: String,
    user_avatar: String,
    pic: String,
    post_media: Object,
    post_is_folded: Boolean,
  },
  observers: {
    'topic_label, union': function (topic, union) {
      union && this.setData({ topic_color: schoolToColor[topic] });
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    preURL: 'https://i.boatonland.com/avatar/',
    post_link: '',
    link_type: '',
    pic_loaded: false,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    picOnLoad: function () {
      this.setData({ pic_loaded: true });
    },
    postDetail: util.throttle(function () {
      app.subscribe(false)
      if(this.properties.post_media.media_type == 'article' && this.properties.post_media.inner_path){
        wx.navigateTo({url: this.properties.post_media.inner_path,})
      }else if(this.properties.post_media.media_type == 'article' && this.properties.post_media.miniapp_appid){
        wx.navigateToMiniProgram({appId: this.properties.post_media.miniapp_appid,path: this.properties.post_media.miniapp_path,})
      }else if(this.properties.post_media.media_type == 'article' && !this.properties.post_media.open_comment){
        wx.navigateTo({url: '/pages/webview/webview?url=' + this.properties.post_media.article_link,})
      }else{
        wx.navigateTo({url: '/pages/detail/detail?post_id=' + this.properties.post_id,})
      }
    }, 1000),
    visitUser: util.throttle(function () {
      app.subscribe(false)
      if(this.properties.post_media.media_type == 'article'){
        wx.navigateTo({
          url: "/pages/org/org?&user_serial=" + this.properties.post_media.article_author
        })
      }
    }, 1000),

  },

  lifetimes: {},
});
