var app = getApp();
var util = require('../../utils/util.js');
const { schoolToColor } = require('../../utils/constants');
Page({
  data: {
    scrollViewRefresherStyle: app.globalData.theme.scrollViewRefresherStyle,
    data_received: false,
    // 这条post的详细信息
    post_serial: '',
    post_msg: '',
    school_label: '',
    school_color: 'transparent',
    post_date: '',
    is_public: '',
    is_author: '',
    is_following: '',
    alias: '',
    alias_display: '',
    follower_num: '',
    user_avatar: '',
    alias_is_tapped: false,
    preURL: 'https://i.boatonland.com/avatar/',
    // 评论信息
    no_comment: true,
    comment_reverse: false,
    comments: [
      {
        comment_id: '',
        comment_index: '',
        comment_msg: '',
        comment_date: '',
        comment_is_author: '',
        comment_alias: '',
        user_avatar: '',
      },
    ],
    isSending: false,
    comment_remnant: 500,
    comment_placeholder: '想对这个树洞的拥有者说什么？',
    actions: [''],
    triggered: false,
    is_admin: '',
    // 音乐信息
    music_cover: '',
    music_player: '',
    music_title: '',
    music_epname: '',
    music_source: '',
    music_id: '',
    // 图片
    pic: '',
    pic_width: '',
    pic_height: '',
    pic_loaded: false,
    // 举报
    reportType: null, // 'comment' or 'post'
    reportMsg: '',
    reportId: '',
    reportIndex: '',
    reportUserMsg: ''
  },
  // 下拉刷新
  onRefresh() {
    this.setData({
      triggered: true,
    });
    this.fetchPostDetail();
    console.log('刷新中');
  },
  // 刷新复位
  onRestore(e) {
    console.log('已复位', e);
    wx.showToast({
      title: '刷新成功',
      icon: 'none',
      duration: 500,
    });
  },
  // 树洞详情页中点击编号访问用户
  visitUser: function () {
    this.setData({ alias_is_tapped: true });
    if (this.data.alias != 'null') {
      wx.navigateTo({
        url:
          '/pages/visitProfile/visitProfile?school_label=' +
          this.data.school_label +
          '&union_serial=' +
          this.data.alias,
      });
    } else {
      wx.navigateTo({
        url:
          '/pages/visitProfile/visitProfile?school_label=' +
          this.data.school_label +
          '&post_serial=' +
          this.data.post_serial +
          '&user_avatar=' +
          this.data.user_avatar,
      });
    }
    this.setData({ alias_is_tapped: false });
  },
  // 评论中触发的访问树洞拥有者
  visitCommentOwner: function () {
    this.visitUser();
  },
  // 删除评论
  deleteComment: function (e) {
    const comment_id = e.detail;
    const new_comments = [];
    for (let i = 0; i < this.data.comments.length; i++) {
      if (this.data.comments[i].comment_id != comment_id) {
        new_comments.push(this.data.comments[i]);
      }
    }
    this.setData({ comments: new_comments });
  },
  // 回复评论
  replyComment: function (e) {
    const { post_serial } = this.data;
    const comment_index = e.detail;
    const comment_floor = comment_index == '0' ? 'G层' : `LG${comment_index}`;
    const re_comment = `Re ${comment_floor}: `;
    app.globalData.tem_comment = re_comment;
    app.globalData.tem_comment_with_serial = true;
    app.globalData.tem_comment_post = post_serial;
    // 跳转到撰写页面
    this.goToComment();
  },
  //举报评论
  reportComment: function (e) {
    const { comment_msg, comment_id, comment_index } = e.detail;
    this.reportPrompt.show();
    this.setData({
      reportMsg: comment_msg,
      reportId: comment_id,
      reportIndex: comment_index,
      reportType: 'comment'
    })
  },
  reportPromptGetInput: function (e) {
    this.setData({
      reportUserMsg: e.detail.value,
    });
  },
  reportPromptCancel: function () {
    this.reportPrompt.hide();
  },
  reportPromptConfirm: function () {
    wx.showLoading({
      title: '发送中',
    });
    if (this.data.reportUserMsg.match(/^\s*$/)) return;
    const school = app.globalData.school_label;
    const itsc = wx.getStorageSync('user_itsc');
    const {
      reportType
    } = this.data;
    const that = this;
    let reportBody;
    if (reportType == 'comment') {
      reportBody = {
        type: 'comment',
        school,
        itsc,
        post_serial: that.data.post_serial,
        comment_floor: that.data.reportIndex,
        comment_id: that.data.reportId,
        reason: that.data.reportUserMsg,
        content: that.data.reportMsg
      };
    } else {
      reportBody = {
        type: 'post',
        school,
        itsc,
        post_serial: that.data.reportId,
        reason: that.data.reportUserMsg,
        content: that.data.reportMsg
      };
    }
    wx.cloud.init();
    wx.cloud.callFunction({
      name: 'slackReport',
      data: {
        body: {
          reportBody
        },
      },
      success: (res) => {
        wx.hideLoading();
        const result = res.result;
        console.log(result);
        if (result.error != 'false') {
          app.showModal({
            title: '错误',
            showCancel: false,
            content: '举报出错: ' + result.error,
          });
        } else {
          app.showModal({
            title: '提示',
            showCancel: false,
            content: '已提交举报，请耐心等待核查',
          })
        }
        console.log('云函数调用成功');
      },
      fail: (err) => {
        wx.hideLoading();
        app.showModal({
          title: '失败',
          content: '举报出错' + err,
        });
        console.error('云函数调用失败', err);
      },
    });
  },
  // 获取detail页数据并且初始化actionsheet
  fetchPostDetail: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    const url = app.globalData.URL + '/detail';
    const data = {
      serial: this.data.post_serial,
    };
    app.request('POST', url, data).then((res) => {
      wx.hideLoading();
      if (res.error == 'false') {
        if (this.data.triggered) {
          this.setData({ triggered: false });
        }
        this.setData({
          data_received: true,
          post_msg: res.post.post_msg,
          post_date: res.post.post_date,
          school_label: res.post.school_label,
          school_color: schoolToColor[res.post.school_label],
          is_author: res.post.is_author == 'true',
          is_following: res.post.is_following == 'true',
          is_public: res.post.is_public == 'true',
          alias: res.post.alias,
          alias_display: res.post.alias.replace(/\W$/, ''),
          user_avatar: res.post.user_avatar,
          follower_num: Number(res.post.follower_num),
          music_cover: res.post.music_cover,
          music_player: res.post.music_player,
          music_title: res.post.music_title,
          music_epname: res.post.music_epname,
          music_source: res.post.music_source,
          music_id: res.post.music_id,
          pic: res.post.pic,
        });
        // 处理图片
        if (res.post.pic && res.post.pic !== '') {
          const pic = res.post.pic;
          console.log(pic);
          const sizes = pic.split('?')[1];
          let width, height, w, h;
          if (sizes !== undefined && sizes.split('#').length === 2) {
            width = sizes.split('#')[0].split('=')[1];
            height = sizes.split('#')[1].split('=')[1];
            // this.resizePicToFit(width, height)
            this.setData({ pic_height: height, pic_width: width });
          } else {
            wx.getImageInfo({
              src: pic,
              success(res) {
                w = res.width;
                h = res.height;
                that.resizePicToFit(w, h);
              },
            });
          }
        }
        // 处理有无评论
        if (res.comments != 'null') {
          this.setData({
            no_comment: false,
            comments: res.comments,
          });
        } else {
          this.setData({ no_comment: true });
        }
        // 如果是楼主本人，要修改评论框里的placeholder
        if (res.is_author) {
          this.setData({
            comment_placeholder: '想在树洞下补充些什么？',
          });
        }
        // 处理actionsheet的选项
        this.proceedActionSheet();
      } else {
        app.showModal({
          title: '提示',
          showCancel: false,
          content: '获取树洞正文失败' + res.error,
          success(res) {
            if (res.confirm) {
              wx.navigateBack({
                delta: 1,
              });
            }
          },
        });
      }
    });
  },
  // 处理图片大小使适应手机尺寸
  resizePicToFit: function (w, h) {
    const phoneInfo = wx.getSystemInfoSync();
    const p_w = phoneInfo.windowWidth; // 宽
    const max_wh = (p_w / 100) * 60;
    const ratio = w / h;
    if (w > max_wh && ratio >= 1) {
      w = max_wh;
      h = w / ratio;
    } else if (h > max_wh && ratio < 1) {
      h = max_wh;
      w = h * ratio;
    }
    this.setData({ pic_height: h, pic_width: w });
  },
  picOnLoad: function () {
    this.setData({ pic_loaded: true });
  },
  // actionsheet选项函数
  callOutActionSheet: function () {
    var that = this;
    wx.showActionSheet({
      itemList: this.data.actions,
      success(res) {
        const actions = that.data.actions;
        const action = actions[res.tapIndex];
        switch (action) {
          case '停止围观':
            that.unFollow();
            break;
          case '围观树洞':
            that.follow();
            break;
          case '设置为隐私':
            that.setPrivate();
            break;
          case '设置为公开':
            that.setPublic();
            break;
          case '删除':
            that.deletePost();
            break;
          case '举报':
            that.reportPost();
            break;
        }
      },
      fail(res) {
        console.log(res.errMsg);
      },
    });
  },
  // 处理actionsheet的选项
  proceedActionSheet: function () {
    // 处理action sheet的操作列表
    const actions = [];
    if (this.data.is_author) {
      actions.push('删除');
      if (this.data.is_public) {
        actions.push('设置为隐私');
      }
      if (!this.data.is_public) {
        actions.push('设置为公开');
      }
    }
    if (!this.data.is_author) {
      actions.push('举报');
      if (this.data.is_following) {
        actions.push('停止围观');
      }
      if (!this.data.is_following) {
        actions.push('围观树洞');
      }
    }
    if (!this.data.is_author && !this.data.is_public) {
      wx.redirectTo({ url: '/pages/shared-home/shared-home' });
    }
    this.setData({ actions: actions });
  },
  // 设置公开
  setPublic: function () {
    wx.showLoading({
      title: '加载中',
    });
    const url = app.globalData.URL + '/setpublic';
    const data = {
      post_serial: this.data.post_serial,
    };
    app.request('POST', url, data).then((res) => {
      wx.hideLoading();
      if (res.error == 'false') {
        this.setData({ is_public: true });
        // 记得重新处理一遍actionshhet
        this.proceedActionSheet();
        wx.showToast({
          title: '成功设置为公开状态',
          icon: 'none',
          duration: 600,
        });
      } else {
        app.showModal({
          title: '提示',
          showCancel: false,
          content: '设置公开树洞失败' + res.error,
        });
      }
    });
  },
  // 设置私密
  setPrivate: function () {
    wx.showLoading({
      title: '加载中',
    });
    const url = app.globalData.URL + '/setprivate';
    const data = {
      post_serial: this.data.post_serial,
    };
    app.request('POST', url, data).then((res) => {
      wx.hideLoading();
      if (res.error == 'false') {
        this.setData({ is_public: false });
        // 记得重新处理一遍actionsheet
        this.proceedActionSheet();
        wx.showToast({
          title: '成功设置为隐私状态',
          icon: 'none',
          duration: 600,
        });
      } else {
        app.showModal({
          title: '提示',
          showCancel: false,
          content: '设置私密树洞失败' + res.error,
        });
      }
    });
  },
  // 围观树洞
  follow: util.throttle(function () {
    if (this.data.is_author) {
      wx.showToast({
        title: '不能围观自己:(',
        icon: 'none',
      });
      return;
    }
    wx.showLoading({
      title: '加载中',
    });
    const url = app.globalData.URL + '/follow';
    const data = {
      post_serial: this.data.post_serial,
    };
    app.request('POST', url, data).then((res) => {
      wx.hideLoading();
      if (res.error == 'false') {
        wx.vibrateLong();
        this.setData({
          is_following: true,
          follower_num: this.data.follower_num + 1,
        });
        // 记得重新处理一遍actionshhet
        this.proceedActionSheet();
        wx.showToast({
          title: '开始围观⭐w⭐',
          icon: 'none',
          duration: 600,
        });
      } else {
        app.showModal({
          title: '提示',
          showCancel: false,
          content: '围观树洞失败' + res.error,
        });
      }
    });
  }, 1000),
  // 取消围观树洞
  unFollow: util.throttle(function () {
    wx.showLoading({
      title: '加载中',
    });
    const url = app.globalData.URL + '/unfollow';
    const data = {
      post_serial: this.data.post_serial,
    };
    app.request('POST', url, data).then((res) => {
      wx.hideLoading();
      if (res.error == 'false') {
        this.setData({
          is_following: false,
          follower_num: this.data.follower_num - 1,
        });
        // 记得重新处理一遍actionshhet
        this.proceedActionSheet();
        wx.showToast({
          title: '停止了围观',
          icon: 'none',
          duration: 600,
        });
      } else {
        app.showModal({
          title: '提示',
          showCancel: false,
          content: '停止围观树洞失败' + res.error,
        });
      }
    });
  }, 1000),
  // 删除树洞-触发提示
  deletePost: function () {
    var that = this;
    app.showModal({
      title: '提示',
      content: '决定删除树洞吗（无法恢复）？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍后',
          });
          that.implementDeletePost();
        }
      },
    });
  },
  // 删除树洞-实际请求
  implementDeletePost: function () {
    wx.showLoading({
      title: '加载中',
    });
    const url = app.globalData.URL + '/delete';
    const data = {
      post_serial: this.data.post_serial,
    };
    app.request('POST', url, data).then((res) => {
      wx.hideLoading();
      if (res.error == 'false') {
        wx.showToast({
          title: '#' + this.data.post_serial + '树洞已被删除,消失在茫茫星际',
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
      } else {
        app.showModal({
          title: '提示',
          showCancel: false,
          content: '停止围观树洞失败' + res.error,
        });
      }
    });
  },
  // 取用storage中权限
  fetchGeneralInfoFromApp: function () {
    var that = this;
    if (that.data.is_admin == '') {
      if (wx.getStorageSync('is_admin') != '') {
        // 判断是否已经在全局变量里面了
        that.setData({
          is_admin: wx.getStorageSync('is_admin'),
        });
      } else {
        // 在app.js里定义一个回调函数 给请求成功后调用
        app.generalInfoCallback = () => {
          that.setData({
            is_admin: wx.getStorageSync('is_admin'),
          });
        };
      }
    }
  },
  // 举报
  reportPost: function () {
    this.reportPrompt.show();
    this.setData({
      reportMsg: this.data.post_msg.slice(0, 50),
      reportId: this.data.post_serial,
      reportType: 'post'
    })
  },
  // 预览大图片
  previewPic: function () {
    wx.previewImage({
      urls: [this.data.pic],
    });
  },
  // 跳转
  goToComment: function () {
    const { post_serial, is_author } = this.data;
    wx.navigateTo({
      url: `/pages/shared-writeComment/shared-writeComment?serial=${post_serial}&author=${is_author}`,
      events: {
        refresh: this.fetchPostDetail,
      },
    });
  },
  // 评论倒序
  reverseComments: function () {
    let cmt = this.data.comments.reverse();
    this.setData({
      comments: cmt,
      comment_reverse: !this.data.comment_reverse
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: 'Uni树洞详情',
    });
    this.setData({ post_serial: options.post_serial });
    this.fetchPostDetail();
    this.fetchGeneralInfoFromApp();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.reportPrompt = this.selectComponent('#reportPrompt');
  },

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
    wx.cloud.init();
    wx.cloud.callFunction({
      name: 'stats',
      data: {
        body: {
          post_serial: this.data.post_serial,
        },
      },
      success: (result) => {
        console.log(result);
      },
    });
    let msg = this.data.post_msg;
    if (msg.length > 20) {
      msg = msg.slice(0, 20) + '...';
    }
    return {
      path: `/pages/home/home?jump_page=detail&post_serial=${this.data.post_serial}`,
      title: `${this.data.school_label}树洞用户: ${msg}`,
    };
  },
});
