// components/singlePost/singlePost.js
var app = getApp();
var util = require('../../utils/util.js');
const { schoolToColor } = require('../../utils/constants');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    post_serial: String,
    topic_label: String,
    comment_num: String,
    follower_num: String,
    is_following: Boolean,
    post_msg: String,
    post_is_complete: String,
    user_avatar: String,
    music_title: String,
    music_player: String,
    music_source: String,
    pic: String,
    union: Boolean,
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
      const pages = getCurrentPages();
      app.subscribe(false)
      if (pages.length < 10) {
        wx.navigateTo({
          url: this.properties.union
            ? '/pages/shared-detail/shared-detail?post_serial=' + this.properties.post_serial
            : '/pages/detail/detail?post_serial=' + this.properties.post_serial,
        });
      } else {
        wx.showToast({
          title: '打开太多页面啦',
          icon: 'none',
        });
      }
    }, 1000),

    getSpecialPost: function () {
      const that = this;
      const url = app.globalData.URL + '/post/pinned';
      const data = null;
      return app.request('POST', url, data).then((res) => {
        if (res.error === 'false') {
          that.setData({
            post_link: res.post_link,
            link_type: res.link_type,
          });
          return '获取置顶成功';
        }
        throw '获取置顶失败';
      });
    },
  },

  lifetimes: {},
});
