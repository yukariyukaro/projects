var app = getApp();
const AV = require('../../libs/av-core-min.js');

Page({
  data: {
    remnantLen: 750,
    content: '',
    content_public: true,
    content_with_serial: true,
    user_serial: '',
    isSending: false,
    focus: false,
    music_cover: '',
    music_player: '',
    music_title: '',
    music_epname: '',
    music_source: '',
    music_id: '',
    compress_url: '',
    uploaded_url: '',
    pic_width: undefined,
    pic_height: undefined,
    pic_legal: '',
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
      remnantLen: 750 - len,
    });
    this.data.content = content_tem;
    wx.setStorageSync('shared_write_content', content_tem);
  },
  // 选择是否公开发表
  switchPublicChange: function (e) {
    this.setData({ content_public: e.detail.value });
    wx.setStorageSync('shared_write_content_public', e.detail.value);
  },
  // 选择是否带编号
  switchSerialChange: function (e) {
    this.setData({ content_with_serial: e.detail.value });
    wx.setStorageSync('shared_write_content_with_serial', e.detail.value);
  },
  // 选择多媒体类型
  mediaSelectTap: function() {
    wx.showActionSheet({
      itemList: ['网易云音乐', 'BILIBILI'],
      success(res) {
        const index = res.tapIndex;
        switch (index) {
          case 0:
            wx.navigateTo({
              url: '/pages/searchMedia/searchMedia?source=NETEASE&shared=true',
            })
            break;
          case 1:
            wx.navigateTo({
              url: '/pages/searchMedia/searchMedia?source=BILIBILI&shared=true',
            })
            break;
        }
      },
      fail(res) {
        console.log(res.errMsg);
      },
    });
  },
  deleteMusic: function () {
    this.setData({
      music_cover: '',
      music_player: '',
      music_title: '',
      music_epname: '',
      music_source: '',
      music_id: '',
    });
    wx.removeStorageSync('shared_music_cover');
    wx.removeStorageSync('shared_music_player');
    wx.removeStorageSync('shared_music_title');
    wx.removeStorageSync('shared_music_epname');
    wx.removeStorageSync('shared_music_source');
    wx.removeStorageSync('shared_music_id');
  },
  // 提交
  submitNewPost: function () {
    const content = this.data.content;
    if (this.data.isSending) return;
    if (
      (this.data.pic_compress_url !== '' && this.data.pic_uploaded_url === '') ||
      (this.data.pic_compress_url !== '' && this.data.pic_legal === '')
    ) {
    } else if (this.data.pic_legal === false) {
      app.showModal({
        title: '提示',
        showCancel: false,
        content: '图片存在不合法内容，请检查后重新上传',
      });
    } else if (content.match(/^\s*$/)) {
      app.showModal({
        title: '提示',
        showCancel: false,
        content: '内容不能为空！',
      });
      this.setData({ isSending: false });
    } else {
      this.setData({ isSending: true });
      wx.showLoading({
        title: '提交中',
      });
      const post_alias = this.data.content_with_serial ? this.data.user_serial : 'null';
      const is_public = String(this.data.content_public);
      let pic = '';
      if (this.data.pic_uploaded_url !== '') {
        pic = `${this.data.pic_uploaded_url}?width=${this.data.pic_width.toFixed(
          2
        )}#height=${this.data.pic_height.toFixed(2)}`;
      }
      // 重要：将输入内容中的空行转化为\n字段
      const url = app.globalData.URL + '/shared/write';
      const music = this.data.music_id != '' && {
        music_id: this.data.music_id,
        music_cover: this.data.music_cover,
        music_player: this.data.music_player,
        music_source: this.data.music_source,
        music_epname: this.data.music_epname,
        music_title: this.data.music_title,
      };
      const data = {
        post_msg: content,
        school_label: app.globalData.school_label,
        post_alias,
        is_public,
        pic: pic,
        ...music,
      };
      app.request('POST', url, data, { json: true }).then((res) => {
        wx.hideLoading();
        if (res.error == 'false') {
          wx.removeStorageSync('shared_write_content');
          wx.removeStorageSync('shared_write_content_public');
          wx.removeStorageSync('shared_write_content_with_serial');
          wx.removeStorageSync('shared_music_cover');
          wx.removeStorageSync('shared_music_player');
          wx.removeStorageSync('shared_music_title');
          wx.removeStorageSync('shared_music_epname');
          wx.removeStorageSync('shared_music_source');
          wx.removeStorageSync('shared_music_id');
          wx.removeStorageSync('shared_pic_compress_url');
          wx.removeStorageSync('shared_pic_uploaded_url');
          wx.removeStorageSync('shared_pic_legal');
          wx.removeStorageSync('shared_pic_height');
          wx.removeStorageSync('shared_pic_width');
          //
          // 公开 public==1
          if (this.data.content_public) {
            wx.showToast({
              title: '#' + res.post_serial + '树洞诞生于星际之中⭐',
              icon: 'none',
              duration: 1000,
            });
            setTimeout(
              () =>
                wx.reLaunch({
                  url: '/pages/shared-home/shared-home',
                }),
              600
            );
          }
          // 私有 public==2
          else if (!this.data.content_public) {
            wx.showToast({
              title: '#' + res.post_serial + '私有树洞诞生了⭐',
              icon: 'none',
              duration: 1000,
            });
            setTimeout(
              () =>
                wx.reLaunch({
                  url: '/pages/profile/profile',
                }),
              600
            );
          }
        } else {
          this.setData({ isSending: false });
          app.showModal({
            title: '提示',
            showCancel: false,
            content: '提交树洞失败' + res.error,
          });
          console.log(res);
        }
      });
    }
  },
  // 取用管理员字段
  fetchIsAdminFromApp: function () {
    var that = this;
    const is_admin = wx.getStorageSync('is_admin');
    if (is_admin) {
      // 判断是否已经在全局变量里面了
      this.setData({ is_admin });
    } else {
      // 在app.js里定义一个回调函数 给请求成功后调用
      app.generalInfoCallback = () => {
        that.setData({
          is_admin: wx.getStorageSync('is_admin'),
        });
      };
    }
  },
  // 取用用户ID
  fetchUserSerial: function () {
    const user_serial = wx.getStorageSync('user_serial');
    if (user_serial) {
      this.setData({ user_serial });
    } else {
      const url = app.globalData.URL + '/getuserinfo';
      const data = null;
      app.request('POST', url, data).then((res) => {
        if (res.error == 'false') {
          this.setData({
            user_serial: res.user_serial,
          });
          wx.setStorageSync('user_serial', res.user_serial);
        } else {
          app.showModal({
            title: '提示',
            showCancel: false,
            content: '获取个人信息失败' + res.error,
            success: function (res) {
              if (res.confirm) {
                wx.navigateBack({ delta: 1 });
              }
            },
          });
        }
      });
    }
  },
  // 选择图片
  choosePic: function () {
    const that = this;
    wx.yx.chooseImage({
      count: 1,
      success(res) {
        wx.showLoading({
          title: '图片审核中',
        });
        console.log(res);
        const imgArray = res.imgArray || [];
        const imgObj = imgArray[0] || {};
        let w = imgObj.width;
        let h = imgObj.height;
        const p_w = 375;
        const max_wh = (p_w / 100) * 60;
        const ratio = w / h;
        if (w > max_wh && ratio >= 1) {
          w = max_wh;
          h = w / ratio;
        } else if (h > max_wh && ratio < 1) {
          h = max_wh;
          w = h * ratio;
        }
        that.setData({
          pic_compress_url: imgObj.url,
          pic_height: h,
          pic_width: w,
        });
        wx.setStorageSync('shared_pic_compress_url', imgObj.url);
        wx.setStorageSync('shared_pic_height', h);
        wx.setStorageSync('shared_pic_width', w);
        new AV.File('ust_' + imgObj.url.substr(imgObj.url.lastIndexOf('/') + 1), {
          blob: {
            uri: imgObj.url,
          },
        })
          // 上传
          .save()
          // 上传成功
          .then((file) => {
            that.setData({ pic_uploaded_url: file.url() });
            wx.setStorageSync('shared_pic_uploaded_url', file.url());
            console.log('上传成功');
            that.censorPic(file.url());
          })
          // 上传发生异常
          .catch(console.error);
      },
    });
  },
  // 审核图片
  censorPic: function (pic_path) {
    const url = app.globalData.URL + '/pics/censor';
    const data = {
      pic_path: pic_path,
    };
    app.request('POST', url, data).then((res) => {
      wx.hideLoading();
      if (res.error === 'false') {
        wx.setStorageSync('pic_legal', true);
        this.setData({ pic_legal: true });
      } else if (res.error === 'illegal') {
        app.showModal({
          title: '提示',
          showCancel: false,
          content: '图片存在不合法内容，请检查后重新上传',
        });
        wx.setStorageSync('pic_legal', false);
        this.setData({ pic_legal: false });
      } else {
        app.showModal({
          title: '提示',
          showCancel: false,
          content: '上传出错，请稍后再试',
        });
      }
    });
  },
  // 点击图片后，可以删除/查看
  picTap: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['删除', '查看'],
      success(res) {
        const index = res.tapIndex;
        switch (index) {
          case 0:
            that.deletePic();
            break;
          case 1:
            that.previewPic();
            break;
        }
      },
      fail(res) {
        console.log(res.errMsg);
      },
    });
  },
  deletePic: function () {
    this.setData({
      pic_compress_url: '',
      pic_uploaded_url: '',
      pic_legal: '',
      pic_height: undefined,
      pic_width: undefined,
    });
    wx.removeStorageSync('shared_pic_compress_url');
    wx.removeStorageSync('shared_pic_uploaded_url');
    wx.removeStorageSync('shared_pic_legal');
    wx.removeStorageSync('shared_pic_height');
    wx.removeStorageSync('shared_pic_width');
  },
  previewPic: function () {
    wx.previewImage({
      urls: [this.data.pic_compress_url],
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '发布Uni树洞',
    });
    this.fetchIsAdminFromApp();
    this.fetchUserSerial();
    // 从storage里拿出之前的记录
    // 主题不能是空，默认-1
    let is_public = wx.getStorageSync('shared_write_content_public');
    let with_serial = wx.getStorageSync('shared_write_content_with_serial');
    if (is_public == '') is_public = true;
    if (with_serial == '') with_serial = true;
    this.setData({
      content: wx.getStorageSync('shared_write_content'),
      content_public: is_public,
      content_with_serial: with_serial,
      music_id: wx.getStorageSync('shared_music_id'),
      music_source: wx.getStorageSync('shared_music_source'),
      music_title: wx.getStorageSync('shared_music_title'),
      music_cover: wx.getStorageSync('shared_music_cover'),
      music_epname: wx.getStorageSync('shared_music_epname'),
      music_player: wx.getStorageSync('shared_music_player'),
      pic_compress_url: wx.getStorageSync('shared_pic_compress_url'),
      pic_uploaded_url: wx.getStorageSync('shared_pic_uploaded_url'),
      pic_legal: wx.getStorageSync('shared_pic_legal'),
      pic_width: wx.getStorageSync('shared_pic_width'),
      pic_height: wx.getStorageSync('shared_pic_height'),
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (this.data.music_id != wx.getStorageSync('shared_music_id')) {
      this.setData({
        music_id: wx.getStorageSync('shared_music_id'),
        music_source: wx.getStorageSync('shared_music_source'),
        music_title: wx.getStorageSync('shared_music_title'),
        music_cover: wx.getStorageSync('shared_music_cover'),
        music_epname: wx.getStorageSync('shared_music_epname'),
        music_player: wx.getStorageSync('shared_music_player'),
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

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
