var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data_received: false,
    preURL: 'https://avtar-space-1301435395.cos.ap-shanghai.myqcloud.com/stardust_pics/hku_pics/func0pics/',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    sheet_id: '',
    user_itsc: '',
    currentIndex: 0,
    author_wc_avatar: '',
    author_wc_nickname: '',
    is_author: false,
    is_finished: false,
    user_score: '',
    score_desc: '',
    problem_list: [],
    scores: [],
    // 给做过的
    correct_answers: [],
    user_answers: [],
    // 给没做过的
    answer_list: [],
    nickName: '',
    avatarUrl: '',
    isSending: false,
    // 奖品
    present_item: '',
    present_num: 0,
    present_score: 0,
  },
  bindSwiperChange: function (e) {
    this.setData({
      currentIndex: e.detail.current,
    });
  },
  selectAnswer: function (e) {
    console.log(e.currentTarget.dataset.id);
    const new_answer_list = this.data.answer_list;
    if (new_answer_list.length <= this.data.currentIndex) {
      new_answer_list.push(e.currentTarget.dataset.id);
    } else {
      new_answer_list[this.data.currentIndex] = e.currentTarget.dataset.id;
    }
    this.setData({
      answer_list: new_answer_list,
    });
    if (this.data.currentIndex <= 8) {
      this.setData({ currentIndex: this.data.currentIndex + 1 });
    }
  },
  fetchProblemList: function () {
    var that = this;
    // 登陆取tem auth
    wx.login({
      success: function (res) {
        wx.showLoading({
          title: '正在获取题目',
        });
        // 登陆成功后再请求
        const url = app.globalData.URL + '/func0/getproblemlist';
        const data = {
          user_itsc: that.data.user_itsc,
          sheet_id: that.data.sheet_id,
          temAuth: res.code,
        };
        console.log(data);
        app.requestRaw({ url, data, method: 'POST' }, { sessionID: '' }).then((res) => {
          wx.hideLoading();
          console.log(res);
          if (res.error == 'false') {
            // 做题人身份
            if (res.is_author == 'false') {
              // 有分数，已经做过
              if (res.user_score) {
                that.setData({
                  data_received: true,
                  is_author: false,
                  is_finished: true,
                  user_score: res.user_score,
                  author_wc_avatar: res.author_wc_avatar,
                  author_wc_nickname: res.author_wc_nickname,
                  scores: res.scores,
                  problem_list: res.problem_list,
                  correct_answers: res.correct_answers,
                  user_answers: res.user_answers,
                  present_num: res.present.present_num,
                  present_score: res.present.present_score,
                  present_item: res.present.present_item,
                });
                if (res.user_score >= 90) {
                  that.setData({
                    score_desc: '「是愿意借出八达通的满分好友了!」',
                  });
                } else if (res.user_score >= 70 && res.user_score <= 80) {
                  that.setData({
                    score_desc: '「是个愿意帮忙take attendance的老铁!」',
                  });
                } else if (res.user_score >= 50 && res.user_score <= 60) {
                  that.setData({
                    score_desc: '「是个会帮忙liba占座的及格朋友」',
                  });
                } else if (res.user_score >= 20 && res.user_score <= 40) {
                  that.setData({ score_desc: '「是个可以约饭的熟人」' });
                } else if (res.user_score >= 20 && res.user_score <= 40) {
                  that.setData({ score_desc: '「点头之交? :)」' });
                }
              }
              // 新做题
              else {
                that.setData({
                  data_received: true,
                  is_author: false,
                  is_finished: false,
                  author_wc_avatar: res.author_wc_avatar,
                  author_wc_nickname: res.author_wc_nickname,
                  problem_list: res.problem_list,
                  present_num: res.present.present_num,
                  present_score: res.present.present_score,
                  present_item: res.present.present_item,
                });
              }
            }
            // 出题人身份
            else {
              that.setData({
                data_received: true,
                is_author: true,
                is_finished: true,
                author_wc_avatar: res.author_wc_avatar,
                scores: res.scores,
                problem_list: res.problem_list,
                correct_answers: res.correct_answers,
                present_num: res.present.present_num,
                present_score: res.present.present_score,
                present_item: res.present.present_item,
              });
            }
          } else {
            app.showModal({
              title: '提示',
              showCancel: false,
              content: '获取测试失败' + res.error,
            });
            console.log(res);
          }
        });
      },
    });
  },
  // 新做题提交
  submitAnswer: function (e) {
    const answer_list = this.data.answer_list;
    if (answer_list.length < 10) {
      wx.showToast({
        title: '请完成所有题目后再提交~',
        icon: 'none',
      });
      return;
    }
    answer_list.map((answer) => {
      if (answer == null) {
        wx.showToast({
          title: '请完成所有题目后再提交~',
          icon: 'none',
        });
      }
    });
    if (e.detail.userInfo) {
      this.data.nickName = e.detail.userInfo.nickName;
      this.data.avatarUrl = e.detail.userInfo.avatarUrl;
      console.log(this.data.nickName + this.data.avatarUrl + '同意授权');
      this.implementSubmitAnswer();
    } else {
      console.log('拒绝授权');
    }
  },
  // 执行新问题提交
  implementSubmitAnswer: function () {
    wx.showLoading({
      title: '提交中',
    });
    this.setData({ isSending: true });
    var that = this;
    // 登陆取tem auth
    wx.login({
      success: function (res) {
        // 答案格式要求 字符串
        let answers = '';
        that.data.answer_list.map((ans) => {
          answers = answers + ans;
        });
        // 登陆成功后再请求
        const url = app.globalData.URL + '/func0/setscore';
        const data = {
          sheet_id: that.data.sheet_id,
          user_itsc: that.data.user_itsc,
          wc_avatar: that.data.avatarUrl,
          wc_nickname: that.data.nickName,
          answers: answers,
          temAuth: res.code,
        };
        app.requestRaw({ url, data, method: 'POST' }, { sessionID: '' }).then((res) => {
          wx.hideLoading();
          that.setData({ isSending: false });
          if (res.error == 'false') {
            wx.reLaunch({
              url:
                '/pages/func0/problemDetail/problemDetail?sheet_id=' +
                that.data.sheet_id +
                '&user_itsc=' +
                that.data.user_itsc,
            });
          } else {
            app.showModal({
              title: '提示',
              showCancel: false,
              content: '提交测试失败' + res.error,
            });
            console.log(res);
          }
        });
      },
    });
  },
  shareSheet: function () {
    wx.navigateTo({
      url:
        '/pages/func0/shareQR/shareQR?user_itsc=' +
        this.data.user_itsc +
        '&sheet_id=' +
        this.data.sheet_id +
        '&present_item=' +
        this.data.present_item +
        '&present_num=' +
        this.data.present_num +
        '&avatar=' +
        this.data.author_wc_avatar,
    });
  },
  setOwnSheet: function () {
    wx.reLaunch({
      url: '/pages/profile/profile',
    });
  },
  goHomePage: function () {
    wx.reLaunch({
      url: '/pages/home/home',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.scene) {
      const scene = decodeURIComponent(options.scene);
      that.data.user_itsc = scene.split('&')[0];
      that.data.sheet_id = scene.split('&')[1];
    } else if (options) {
      that.data.user_itsc = options.user_itsc;
      that.data.sheet_id = options.sheet_id;
    }
    wx.setNavigationBarTitle({
      title: 'HKU友情测试',
    });
    that.fetchProblemList();
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
  onShareAppMessage: function () {
    return {
      title: '只有港大人才懂的友情测试，看看我们之间的默契吧',
      imageUrl: '/images/func0-cover.jpg',
    };
  },
});
