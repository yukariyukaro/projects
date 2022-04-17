var app = getApp();
Page({
  data: {
    colorScheme: app.globalData.colorScheme,
    data_received: false,
    preURL: 'https://avtar-space-1301435395.cos.ap-shanghai.myqcloud.com/stardust_pics/hku_pics/func0pics/',
    user_itsc: '',
    nickName: '',
    avatarUrl: '',
    currentIndex: 0,
    // 总共挑出来的十道题目
    selected_problem_list: [],
    // 记录现在已有的题目的index用于在剩余题目中随机挑选
    selected_index: [],
    // 总题目
    problem_list: [],
    current_editing_index: -1,
    current_editing_content: '',
    answer_list: [],
    // 奖品
    presnet: [],
    chosenPresentIndex: 0,
    present_num: 1,
    present_score: 7,
  },
  noTouchMove: function () {
    return false;
  },
  next: function () {
    // 没回答目前最头上题目不能翻到下一题
    if (
      this.data.answer_list.length <= this.data.currentIndex ||
      this.data.answer_list[this.data.currentIndex] == null
    ) {
      wx.showToast({
        title: '请先回答此题~',
        icon: 'none',
      });
      return;
    }
    // 把编辑状态关掉
    if (this.data.current_editing_index != -1) {
      wx.showToast({
        title: '请先保存编辑的答案~',
        icon: 'none',
      });
      return;
    }
    // 不能有空答案
    const empty = '';
    if (this.data.selected_problem_list[this.data.currentIndex].default_options.includes(empty)) {
      wx.showToast({
        title: '请不要保留空选项',
        icon: 'none',
      });
      return;
    }
    this.setData({ currentIndex: this.data.currentIndex + 1 });
  },
  prev: function () {
    // 没有上一题
    if (this.data.currentIndex == 0) {
      wx.showToast({
        title: '没有上一题啦',
        icon: 'none',
      });
    }
    // 把编辑状态关掉
    if (this.data.current_editing_index != -1) {
      wx.showToast({
        title: '请先保存编辑的答案~',
        icon: 'none',
      });
      return;
    }
    if (this.data.currentIndex > 0) {
      this.setData({ currentIndex: this.data.currentIndex - 1 });
    }
  },
  editAnswer: function (e) {
    const current_editing_index = e.target.dataset.id;
    this.setData({
      current_editing_index: current_editing_index,
      current_editing_content: this.data.selected_problem_list[this.data.currentIndex]
        .default_options[current_editing_index],
    });
  },
  bindInputChange: function (e) {
    this.data.current_editing_content = e.detail.value;
  },
  saveAnswer: function (e) {
    if (this.data.current_editing_content.match(/^\s*$/)) {
      wx.showToast({
        title: '请不要输入空内容',
        icon: 'none',
      });
      return;
    }
    const new_list = this.data.selected_problem_list;
    new_list[this.data.currentIndex].default_options[
      this.data.current_editing_index
    ] = this.data.current_editing_content;
    this.setData({
      selected_problem_list: new_list,
      current_editing_index: -1,
      current_editing_content: '',
    });
  },
  // 选择一个选项
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
    this.next();
  },
  // 删除一个选项
  deleteAnswer: function (e) {
    const new_list = this.data.selected_problem_list;
    new_list[this.data.currentIndex].default_options.splice(e.currentTarget.dataset.id, 1);
    if (this.data.answer_list[this.data.currentIndex] == e.currentTarget.dataset.id) {
      this.data.answer_list[this.data.currentIndex] = null;
    }
    this.setData({
      selected_problem_list: new_list,
      current_editing_index: -1,
    });
  },
  // 添加新选项
  addAnswer: function () {
    const new_answer = '';
    const new_list = this.data.selected_problem_list;
    new_list[this.data.currentIndex].default_options.push(new_answer);
    this.setData({
      selected_problem_list: new_list,
    });
  },
  // 随机换一换
  change: function () {
    const total_len = this.data.problem_list.length;
    const new_answer_list = this.data.answer_list;
    const new_list = this.data.selected_problem_list;
    const new_selected_index = this.data.selected_index;
    const current = this.data.currentIndex;
    let random_index = Math.floor(Math.random() * total_len);
    // 关掉编辑状态
    if (this.data.current_editing_index != -1) {
      this.setData({ current_editing_index: -1 });
    }
    // 如果随机的结果已经在选中的列表里了，就再随机
    while (this.data.selected_index.includes(random_index)) {
      random_index = Math.floor(Math.random() * total_len);
    }
    new_list[current] = this.data.problem_list[random_index];
    new_selected_index[current] = random_index;
    new_answer_list[current] = null;
    this.setData({
      selected_problem_list: new_list,
      selected_index: new_selected_index,
      answer_list: new_answer_list,
    });
  },
  fetchProblemList: function () {
    const url = app.globalData.URL + '/func0/getproblems';
    const data = null;
    app.requestRaw({ method: 'POST', url, data }, { sessionID: '' }).then((res) => {
      if (res.error == 'false') {
        this.setData({
          data_received: true,
          problem_list: res.problem_list,
          present: res.present_list,
          selected_problem_list: res.problem_list.slice(0, 10),
          selected_index: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        });
        console.log(this.data.problem_list);
        console.log(this.data.selected_problem_list);
      } else {
        app.showModal({
          title: '提示',
          showCancel: false,
          content: '获取题目库失败' + res.error,
        });
        console.log(res);
      }
    });
  },
  submit: function () {
    if (this.data.answer_list[9] == null) {
      wx.showToast({
        title: '请完成所有题目后再提交~',
        icon: 'none',
      });
      return;
    }
    if (isNaN(this.data.present_num) || isNaN(this.data.present_score)) {
      wx.showToast({
        title: '份数或最小题数应为数字~',
        icon: 'none',
      });
      return;
    }
    if (
      this.data.present_num < 1 ||
      this.data.present_num > 10 ||
      this.data.present_score < 1 ||
      this.data.present_score > 10
    ) {
      wx.showToast({
        title: '份数或最小题数应在1到10之间~',
        icon: 'none',
      });
      return;
    }
    var that = this;
    app.showModal({
      title: '提示',
      content: '提交后将无法编辑',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '请稍等',
          });
          that.implementSubmitProblems();
        }
      },
    });
  },
  // 执行提交
  implementSubmitProblems: function () {
    var that = this;
    wx.showLoading({
      title: '提交中',
    });
    const problem_list = [];
    const problems = {};
    const present = {};
    const current_problem_list = that.data.selected_problem_list;
    current_problem_list.map((problem) => {
      const single_problem = {};
      single_problem.pid = problem.problem_id;
      single_problem.options = problem.default_options;
      problem_list.push(single_problem);
    });
    present.present_item = that.data.present[that.data.chosenPresentIndex];
    present.present_num = that.data.present_num;
    present.present_score = that.data.present_score * 10;
    problems.problem_list = problem_list;
    problems.answers = that.data.answer_list;
    problems.present = present;
    // 先发送头像和昵称
    const url = app.globalData.URL + '/setuserinfo';
    const data = {
      wc_avatar: that.data.avatarUrl,
      wc_nickname: that.data.nickName,
    };
    console.log(data);
    app.request('POST', url, data).then((res) => {
      console.log(res);
      if (res.error == 'false') {
        // 发送题目部分
        app
          .request('POST', app.globalData.URL + '/setproblemlist', JSON.stringify(problems), {
            json: true,
          })
          .then((res) => {
            wx.hideLoading();
            console.log(JSON.stringify(problems));
            console.log(res);
            if (res.data.error == 'false') {
              const sheet_id = res.data.sheet_id;
              wx.reLaunch({
                url:
                  '/pages/func0/problemDetail/problemDetail?sheet_id=' +
                  sheet_id +
                  '&user_itsc=' +
                  that.data.user_itsc,
              });
            } else {
              app.showModal({
                title: '提示',
                showCancel: false,
                content: '出题失败' + res.data.error,
              });
              console.log(res.data);
            }
          });
      } else {
        app.showModal({
          title: '提示',
          showCancel: false,
          content: '获取您的信息失败' + res.error,
        });
        console.log(res);
      }
    });
  },
  // 更换奖品
  changePresent: function () {
    const length = this.data.present.length;
    const index = this.data.chosenPresentIndex;
    if (index < length - 1) {
      this.setData({ chosenPresentIndex: index + 1 });
    } else {
      this.setData({ chosenPresentIndex: 0 });
    }
  },
  // 奖品最低分
  bindPresentScore: function (e) {
    const score = e.detail.value;
    this.data.present_score = score;
  },
  // 奖品份数
  bindPresentNum: function (e) {
    const num = e.detail.value;
    this.data.present_num = num;
  },
  // 取用storage中的userserial和权限
  fetchUserSerialFromApp: function () {
    var that = this;
    if (that.data.user_itsc == '') {
      if (wx.getStorageSync('user_itsc') != '') {
        // 判断是否已经在全局变量里面了
        that.setData({
          user_itsc: wx.getStorageSync('user_itsc'),
          is_admin: wx.getStorageSync('is_admin'),
        });
      } else {
        // 在app.js里定义一个回调函数 给请求成功后调用
        app.generalInfoCallback = () => {
          that.setData({
            user_itsc: wx.getStorageSync('user_itsc'),
            is_admin: wx.getStorageSync('is_admin'),
          });
        };
      }
    }
  },
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: 'HKU友情测试',
    });
    // problemlist不需要session
    that.fetchProblemList();
    // 从setEntrance传值过来的昵称头像
    that.data.nickName = options.nickName;
    that.data.avatarUrl = options.avatarUrl;
    if (options.nickName == undefined || options.avatarUrl == undefined) {
      wx.reLaunch({
        url: '/pages/func0/setEntrance/setEntrance',
      });
    }
    // 获取serial
    that.fetchUserSerialFromApp();
  },
});
