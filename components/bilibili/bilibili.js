const app = getApp();
var util = require('../../utils/util.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    music_cover: String,
    music_player: String,
    music_title: String,
    music_epname: String,
    music_source: String,
    music_id: String,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 播放音乐
    playMusic: util.throttle(function () {
      wx.navigateToMiniProgram({ appId: "wx7564fd5313d24844", path: "/pages/video/video?bvid="+this.data.music_epname });
    }, 5000),
  }
})
