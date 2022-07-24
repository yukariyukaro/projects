var app = getApp();
var util = require('../../utils/util.js');
Page({
  data: {
    func_list: [
      {
        label: '已发布',
        icon: '/images/user-post.svg',
        address: '/pages/pastPost/pastPost',
      },
      {
        label: '围观中',
        icon: '/images/following.svg',
        address: '/pages/followPost/followPost',
      },
      {
        label: '旧版私信',
        icon: '/images/pm.svg',
        address: '/pages/func1-pm/pm/pm',
      }
    ],
    chosen_func: -1,
    scroll_top: 0,
    user_serial: '',
    nickname: '',
    user_avatar: '',
    preURL: 'https://i.boatonland.com/avatar/',
    new_nickname: '',
    new_user_serial: '',
    userInfo:{},
  },

  // 选择进入功能
  funcTap: util.throttle(function (e) {
    const index = e.currentTarget.dataset.index;
    const address = this.data.func_list[index].address;
    this.setData({
      chosen_func: index,
    });
    setTimeout(
      () =>
        wx.navigateTo({
          url: address,
        }),
      500
    );
    setTimeout(
      () =>
        this.setData({
          chosen_func: -1,
        }),
      300
    );
  }, 2000),
  // 显示nicknamePrompt
  showNicknamePrompt: function () {
    this.nicknamePrompt.show();
  },
  // 显示serialPrompt
  showSerialPrompt: function () {
    this.serialPrompt.show();
  },
  // 将输入的value保存到new_nickname
  nicknameGetInput: function (e) {
    this.setData({
      new_nickname: e.detail.value,
    });
  },
  // 将输入的value保存到new_user_serial
  serialGetInput: function (e) {
    this.setData({
      new_user_serial: e.detail.value,
    });
  },
  // 确认昵称，先审查再调用提交
  nicknameConfirm: function () {
    if (this.data.new_nickname.match(/^\s*$/)) {
      wx.showToast({
        title: '你还未输入',
        icon: 'none',
        duration: 500,
      });
    } else if (this.data.new_nickname.indexOf('&') != -1) {
      wx.showToast({
        title: '存在非法字符：&',
        icon: 'none',
        duration: 500,
      });
    } else {
      wx.showLoading({
        title: '提交中',
      });
      var that = this
      wx.request({
        url: 'https://api.pupu.hkupootal.com/v3/user/nickname/update.php', 
        method: 'POST',
        data: {
          token:wx.getStorageSync('token'),
          user_nickname:that.data.new_nickname
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success (res) {
          wx.hideLoading()
          if(res.data.code == 200){
            wx.showToast({ title: '昵称设置成功', icon: 'none', duration: 1000,});
            that.setData({
              new_nickname: '',
            });
            that.nicknamePrompt.hide();
            that.getUserInfo()
          }else if(res.data.code == 800 ||res.data.code == 900){
            app.launch().then(res=>{
              that.nicknameConfirm()
            })
          }else{
            wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
          }
        }
      })
    }
  },
  // 确认id，先审查再调用提交
  serialConfirm: function () {
    if (this.data.new_user_serial.match(/^\s*$/) || this.data.new_user_serial.length < 3) {
      wx.showToast({
        title: 'ID至少三位',
        icon: 'none',
        duration: 500,
      });
    } else if (!this.data.new_user_serial.match(/^^[a-z0-9]+$/)) {
      wx.showToast({
        title: '存在非法字符',
        icon: 'none',
        duration: 500,
      });
    } else {
      wx.showLoading({
        title: '提交中',
      });
      var that = this
      wx.request({
        url: 'https://api.pupu.hkupootal.com/v3/user/pootalid/update.php', 
        method: 'POST',
        data: {
          token:wx.getStorageSync('token'),
          user_serial:that.data.new_user_serial
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success (res) {
          wx.hideLoading()
          if(res.data.code == 200){
            wx.showToast({ title: 'ID设置成功', icon: 'none', duration: 1000,});
            that.setData({
              new_user_serial: '',
            });
            that.serialPrompt.hide();
            that.getUserInfo()
          }else if(res.data.code == 800 ||res.data.code == 900){
            app.launch().then(res=>{
              that.serialConfirm()
            })
          }else{
            wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
          }
        }
      })
    }
  },
  // 取消昵称输入
  nicknameCancel: function () {
    this.nicknamePrompt.hide();
    this.setData({ new_nickname: '' });
  },
  // 取消新ID输入
  serialCancel: function () {
    this.serialPrompt.hide();
    this.setData({ new_user_serial: '' });
  },
  // 获取用户昵称和头像
  getUserInfo: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/user/profile/my.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
            that.setData({
              userInfo:res.data.userInfo
            })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getUserInfo()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  updateTabbar:function(){
    var notice_count = wx.getStorageSync('allNoticeCount')
    if(notice_count > 0){
      wx.setTabBarBadge({
        index: 2,
        text: String(notice_count),
      })
    }else{
      wx.removeTabBarBadge({
        index: 2,
      })
    }
  },

  // 控制选项卡折叠/展开
  changeExpand: function (e) {
    const index = e.currentTarget.dataset.index;
    const current = this.data.expandIndex;
    if (index === current) {
      this.setData({ expandIndex: -1 });
    } else {
      this.setData({ expandIndex: index });
    }
  },
  // 动画
  handleLogoTap: function () {
    this.animate(
      '.avatar-ripple',
      [
        { opacity: 0.8, scale: [1, 1] },
        { opacity: 0, scale: [1.5, 1.5] },
      ],
      1500,
      () => {
        this.clearAnimation('.avatar-ripple');
      }
    );
  },
  // 退出登录
  logout: function () {
    var that = this;
    app.showModal({
      title: '提示',
      content: '登出后将解绑微信号和UID,下次登陆将重新绑定。确定登出吗?',
      success(res) {
        if (res.confirm) {
          that.implementLogout();
        }
      },
    });
  },
  // 执行登出
  implementLogout: function () {
    wx.showLoading({
      title: '清除数据中',
    });
    // record记录开始
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/user/logout/wechat.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          wx.removeStorageSync('token')
          app.clearDB()
          wx.closeSocket()
          wx.setStorageSync('allNoticeCount', 0)
          wx.setStorageSync('systemNoticeCount', 0)
            wx.reLaunch({
              url: '/pages/register/register',
            })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.implementLogout()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.nicknamePrompt = this.selectComponent('#nicknamePrompt');
    this.serialPrompt = this.selectComponent('#serialPrompt');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.globalData.tabbarJS = this
    app.updateTabbar()
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
