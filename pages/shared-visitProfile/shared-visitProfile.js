var app = getApp();
Page({
  data: {
    past_data_received: false,
    scroll_top: 0,
    union_serial: '',
    union_serial_display: '',
    refresh_triggered: false,
    is_loading_more: false,
    past_no_more_post: false,
    nickname: '',
    user_avatar: '',
    school_label: '',
    preURL: 'https://i.boatonland.com/avatar/',
    past_posts: [
      {
        post_serial: '',
        post_msg: '',
        topic_label: '',
        comment_num: '',
        follower_num: '',
      },
    ],
    past_following_posts: [],
  },
  // 下拉刷新
  onRefresh() {
    this.setData({
      refresh_triggered: true,
    });
    this.fetchVisitUserDetail(true);
    console.log('刷新中');
  },
  // 刷新完复位
  onRestore(e) {
    console.log('已复位', e);
    wx.showToast({
      title: '刷新成功',
      icon: 'none',
      duration: 500,
    });
  },
  // 上拉加载更多
  onLoadMore: function () {
    if (!this.data.past_no_more_post && !this.data.is_loading_more) {
      // 表示正在加载更多
      this.setData({
        is_loading_more: true,
      });
      setTimeout(() => {
        this.fetchVisitUserDetail();
        console.log('检测到触底，正在刷新');
      }, 500);
    }
  },
  // 获取访问用户信息
  // 参数newFetch：如果是刷新的，需要重开头获取并赋值
  fetchVisitUserDetail: function (newFetch) {
    let serial;
    // 如果没有暂存的data，需要从0开始获取，信号词U699999
    if ((this.data.past_posts.length == 1 && !this.data.past_data_received) || newFetch) {
      serial = 'U699999';
    }
    // 如果已经有一批posts了，serial是目前最后的post的serial
    else {
      serial = this.data.past_posts[this.data.past_posts.length - 1].post_serial;
    }
    wx.showLoading({
      title: '加载中',
    });
    const url = app.globalData.URL + '/shared/post/visituser';
    const data = {
      union_serial: this.data.union_serial,
      serial,
    };
    app.request('POST', url, data).then((res) => {
      wx.hideLoading();
      if (res.error == 'false') {
        const nickname = res.nickname || '未设置';
        this.setData({
          past_data_received: true,
          nickname,
          user_avatar: res.user_avatar,
          school_label: res.school_label, // 由于某种原因不从这里拿school_label
        });
        // 从0开始：直接赋值
        if (serial == 'U699999') {
          this.setData({
            past_posts: res.posts,
            past_following_posts: res.following_posts,
          });
        }
        // 接上的：concat合并
        else {
          this.setData({
            past_posts: this.data.past_posts.concat(res.posts),
            past_following_posts: this.data.past_following_posts.concat(res.following_posts),
          });
        }
        // 如果正在刷新，则把triggered关上
        if (this.data.refresh_triggered) {
          this.setData({ refresh_triggered: false });
        }
        // 如果正在加载更多，把loading关上
        if (this.data.is_loading_more) {
          this.setData({ is_loading_more: false });
        }
        // 如果没有更多，把past no more关上
        this.setData({ past_no_more_post: res.no_more_posts == 'true' });
      } else {
        app.showModal({
          title: '提示',
          showCancel: false,
          content: '访问个人资料失败' + res.error,
        });
      }
    });
  },
  sendPm: function () {
    if (this.data.union_serial == '匿名') {
      wx.setStorageSync('pm_to_type', 'post');
      wx.setStorageSync('pm_to_post_serial', this.data.post_serial.replace(/^U/, ''));
      wx.setStorageSync('pm_to_comment_order', this.data.comment_index);
      wx.setStorageSync('pm_to_union_post', true);
    } else {
      wx.setStorageSync('pm_to_type', 'user');
      wx.setStorageSync('pm_to_user_serial', this.data.union_serial_display);
      wx.setStorageSync('pm_to_school', this.data.school_label);
    }
    wx.navigateTo({
      url: '/pages/func1-pm/writePm/writePm',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '访问Uni日志',
    });
    const { union_serial, school_label } = options;
    this.setData({ school_label });
    if (union_serial) {
      this.setData({
        union_serial,
        union_serial_display: union_serial.replace(/\W$/, ''),
      });
      // 首先登陆检查
      this.fetchVisitUserDetail(true);
    } else {
      this.setData({
        post_serial: options.post_serial,
        user_avatar: options.user_avatar,
        union_serial: '匿名',
        union_serial_display: '匿名',
        nickname: '#' + options.post_serial + '树洞旅客',
      });
      if (options.comment_index) {
        this.setData({
          comment_index: options.comment_index,
        });
      }
    }
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
  onShareAppMessage: function () {},
});
