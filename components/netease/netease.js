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
    music_id: String
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
      wx.showLoading({
        title: '唱片收讯...',
      });
      const backgroundAudioManager = wx.getBackgroundAudioManager();
      backgroundAudioManager.title = this.data.music_title;
      backgroundAudioManager.epname = this.data.music_epname;
      backgroundAudioManager.singer = this.data.music_player;
      backgroundAudioManager.coverImgUrl = this.data.music_cover;
      // 设置了 src 之后会自动播放
      backgroundAudioManager.src =
        'http://music.163.com/song/media/outer/url?id=' + this.data.music_id;
      backgroundAudioManager.onPlay(() => {
        wx.hideLoading();
      });
      backgroundAudioManager.onError(() => {
        wx.hideLoading();
        app.showModal({
          title: '播放音乐失败',
          content: '可能原因：版权不支持在小程序播放',
          showCancel: false,
        });
      })
    }, 5000),
  }
})
