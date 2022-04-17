var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    remnantLen: 500,
    content: '',
    comment_with_serial: true,
    is_author: '',
    placeholder: '想对树洞的拥有者说些什么?',
    focus: true,
    post_serial: '',
    is_admin: '',
    primaryColor: app.globalData.theme.primary,
  },
  // 让输入框聚焦
  focus: function () {
    this.setData({ focus: true });
  },
  // 绑定内容输入
  bindContent: function (e) {
    const len = e.detail.value.length;
    const content_tem = e.detail.value;
    this.setData({
      remnantLen: 500 - len,
      content: content_tem,
    });
  },
  // 选择是否带编号
  switchSerialChange: function (e) {
    this.setData({ comment_with_serial: e.detail.value });
  },
  // 保存
  submitNewComment: util.throttle(function () {
    const post_serial = this.data.post_serial;
    if (!post_serial) {
      return app.showModal({
        title: '提示',
        showCancel: false,
        content: '提交评论失败，页面出现了一点小问题',
      });
    }
    // 重要：将输入内容中的空行转化为\n字段
    const content = this.data.content;
    const alias_style = this.data.comment_with_serial ? 1 : 0;
    if (content.match(/^\s*$/)) {
      return app.showModal({
        title: '提示',
        showCancel: false,
        content: '内容不能为空！',
      });
    }

    wx.showLoading({ title: '提交中' });
    const url = app.globalData.URL + '/writecomment/json';
    const data = {
      school_label: app.globalData.school_label,
      content: content,
      post_serial: post_serial,
      alias_style: alias_style,
    };
    app.request('POST', url, data, { json: true }).then((res) => {
      wx.hideLoading();
      switch (res.error) {
        case 'false':
          this.setData({
            comment_with_serial: true,
            content: '',
          });
          wx.showToast({
            title: '评论发表成功',
            icon: 'none',
            duration: 600,
          });
          // 通知上一页刷新列表
          this.getOpenerEventChannel().emit('refresh');
          wx.navigateBack({
            delta: 1,
          });
          break;
        default:
          app.showModal({
            title: '提示',
            showCancel: false,
            content: '提交评论失败' + res.error,
          });
          console.log(res);
          break;
      }
    });
  }, 2000),
  // 取消
  cancel: function () {
    wx.navigateBack({
      delta: 1,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: options.serial + '号树洞的评论',
    });
    that.setData({ is_author: options.author });
    if (that.data.is_author == 'true') {
      that.setData({ placeholder: '想在自己的树洞补充什么?' });
    }

    // 从app取出暂存，如果暂存的不是本条post的评论，就清空暂存
    if (options.serial !== app.globalData.tem_comment_post) {
      app.globalData.tem_comment = '';
      app.globalData.tem_comment_with_serial = true;
      app.globalData.tem_comment_post = options.serial;
    }
    that.setData({
      content: app.globalData.tem_comment,
      comment_with_serial: app.globalData.tem_comment_with_serial,
      remnantLen: 500 - app.globalData.tem_comment.length,
      post_serial: options.serial,
    });
    that.setData({
      is_admin: wx.getStorageSync('is_admin'),
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.globalData.tem_comment = this.data.content;
    app.globalData.tem_comment_with_serial = this.data.comment_with_serial;
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: 'HKU噗噗 你不孤单',
      imageUrl: '/images/cover.png',
    };
  },
});
