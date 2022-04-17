var app = getApp();
Page({
  data: {
    scrollViewRefresherStyle: app.globalData.theme.scrollViewRefresherStyle,
    scroll_top: 0,
    navItems: ['全部', '👀'],
    currentTab: -2,
    refresh_triggered: false,
    is_loading_more: false,
    is_admin: '',
    pinned: [],
    posts: [],
    main_data_received: false,
    main_no_more_post: false,
    hotPosts: [],
    hot_data_received: false,
    hot_no_more_post: false,
    following_posts: [],
    is_error:false,
    error_title:'',
    error_content:''
  },
  // 下拉刷新
  onRefresh: function () {
    this.setData({
      refresh_triggered: true,
    });
    switch (this.data.currentTab) {
      case -2:
        this.fetchHomePosts(true);
        break;
      case -1:
        this.fetchHotPosts();
        break;
    }
    console.log('刷新中');
  },
  // 刷新完复位
  onRestore: function (e) {
    console.log('已复位', e);
    wx.showToast({
      title: '刷新成功',
      icon: 'none',
      duration: 500,
    });
  },
  // 上拉加载更多
  onLoadMore: function () {
    let no_more_posts;
    let fetcher;
    switch (this.data.currentTab) {
      case -2:
        no_more_posts = this.data.main_no_more_post;
        fetcher = this.fetchHomePosts;
        break;
      case -1:
        no_more_posts = this.data.hot_no_more_post;
        fetcher = this.fetchHotPosts;
        break;
      default:
        no_more_posts = false;
    }
    if (!no_more_posts && !this.data.is_loading_more) {
      this.setData({ is_loading_more: true });
      setTimeout(() => {
        fetcher && fetcher.call(this, false);
        console.log('检测到触底，正在刷新');
      }, 500);
    }
  },
  // 切换导航栏选项卡
  // 全部posts会在页面初始化时就加载并储存，但是主题posts需要每次点击时重新请求
  navbarTap: function () {
    if (this.data.currentTab == -1 && this.data.hotPosts.length === 0) {
      this.fetchHotPosts();
    }
    // 滚动条回到顶部
    this.setData({ scroll_top: 0 });
  },
  // 获取全部posts
  fetchHomePosts: function (newFetch) {
    const { posts, main_data_received } = this.data;
    const is_load_top = !main_data_received || posts.length === 0 || newFetch;
    const url = app.globalData.URL + (is_load_top ? '/shared/post/top' : '/shared/post/posts');
    const data = is_load_top ? null : { serial: posts[posts.length - 1].post_serial };
    const dataSetter = (posts, no_more_posts, pinned) => ({
      posts,
      pinned,
      main_no_more_post: no_more_posts,
      main_data_received: true,
    });

    // record记录开始
    var that = this
    wx.request({
      url: 'https://pupu.boatonland.com/record/post/uni_get.php', 
      method: 'POST',
      data: {
        user_itsc:wx.getStorageSync('user_itsc')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        if(res.data.code == 200){
          that.setData({
            is_error:false,
          })
        }else if(res.data.code == 404){
          that.setData({
            is_error:true,
            error_title:res.data.error_title,
            error_content:res.data.error_content
          })
        }else if(res.data.code == 405){
          if(!wx.getStorageSync('MODAL'+ res.data.modal_id)){
            wx.showModal({
              title:res.data.modal_title,
              content:res.data.modal_content,
              showCancel:false
            })
            wx.setStorageSync('MODAL'+ res.data.modal_id, true)
          }
        }
      }
    })
    // record记录结束

    this.fetchGeneric(is_load_top, posts, main_data_received, url, dataSetter, data);
  },

  // 获取热门posts
  fetchHotPosts: function () {
    const { hotPosts, hot_data_received } = this.data;
    const url = app.globalData.URL + '/shared/post/hot';
    const dataSetter = (posts, no_more_posts) => ({
      hotPosts: posts,
      hot_no_more_post: no_more_posts,
      hot_data_received: true,
    });
    this.fetchGeneric(true, hotPosts, hot_data_received, url, dataSetter);
  },

  fetchGeneric: function (newFetch, posts, received, url, dataSetter, _data) {
    const serial =
      (posts.length == 0 && !received) || newFetch
        ? 'U699999'
        : posts[posts.length - 1].post_serial;
    const data = _data === undefined ? { serial } : _data;
    wx.showLoading({ title: '加载中' });
    app.request('POST', url, data).then((res) => {
      wx.hideLoading();
      this.setData({
        is_loading_more: false,
        refresh_triggered: false,
      });
      const { posts: res_posts, pinned: res_pinned, no_more_posts, error, following_posts } = res;
      if (error === 'false') {
        const partialData = dataSetter(
          serial === 'U699999' ? res_posts : posts.concat(res_posts),
          no_more_posts === 'true',
          res_pinned,
        );
        this.setData({
          following_posts,
          ...partialData,
        });
      } else {
        app.showModal({
          title: '提示',
          showCancel: false,
          content: '获取树洞失败' + error,
        });
      }
    });
  },
  // 取用storage中主题和权限
  fetchIsAdminFromApp: function () {
    var that = this;
    const is_admin = wx.getStorageSync('is_admin');
    if (is_admin) {
      // 判断是否已经在全局变量里面了
      that.setData({ is_admin });
    } else {
      // 在app.js里定义一个回调函数 给请求成功后调用
      app.generalInfoCallback = () => {
        that.setData({
          is_admin: wx.getStorageSync('is_admin'),
        });
      };
    }
  },
  handleWriteTap() {
    wx.navigateTo({
      url: '/pages/shared-write/shared-write',
    });
  },
  // 展开选择排序 todo: 节流
  // changeSort: function() {
  //   let states = ['按时间','按热度']
  //   let index = this.data.sort_index
  //   let current_index = 1 - index
  //   this.setData({
  //     sort: states[current_index],
  //     sort_index: current_index
  //   })
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    wx.setNavigationBarTitle({
      title: 'Uni空间站',
    });
    if (options) {
      if (options.jump_page) {
        if (options.jump_page === 'shared-detail') {
          wx.navigateTo({
            url: `/pages/shared-detail/shared-detail?post_serial=${options.post_serial}`,
          });
        }
      }
    }
    this.fetchHomePosts(true);
    // this.fetchHotPosts();
    // this.fetchMinePosts(true);
    // this.fetchFollowingPosts(true);
    this.fetchIsAdminFromApp();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {},

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
      title: 'HKU噗噗 你不孤单',
      imageUrl: '/images/cover.png',
    };
  },
});
