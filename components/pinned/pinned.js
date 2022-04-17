// components/singlePost/singlePost.js
var Channel = require('../../utils/Channel.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    bannerList: Array,
  },
  /**
   * 组件的方法列表
   */
  methods: {
    postDetail: function (e) {
      const { index } = e.currentTarget.dataset;
      const { banner_link, banner_type } = this.properties.bannerList[index];
      switch (banner_type) {
        case 'article':
          wx.navigateTo({
            url: '/pages/webview/webview?url=' + banner_link,
          });
          break;
        case 'inner':
          wx.navigateTo({ url: banner_link });
          break;
        case 'miniprogram': {
          const splitIndex = banner_link.indexOf('/');
          if (splitIndex >= 0) {
            const appId = banner_link.slice(0, splitIndex);
            const path = banner_link.slice(splitIndex + 1);
            wx.navigateToMiniProgram({ appId, path });
          } else {
            wx.navigateToMiniProgram({ appId: banner_link });
          }
          break;
        }
        case 'none':
        default:
          break;
      }
    },
  },
});
