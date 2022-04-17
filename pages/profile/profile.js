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
        label: '私信',
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
    noticeList:[],
    page:0,
    isLast:false,
    is_loading_more:false,
    refresh_triggered: false,
    crollViewRefresherStyle: app.globalData.theme.scrollViewRefresherStyle,
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
        url: 'https://pupu.boatonland.com/v1/user/changeNickname.php', 
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
        url: 'https://pupu.boatonland.com/v1/user/changePootalID.php', 
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
      url: 'https://pupu.boatonland.com/v1/user/getInfo.php', 
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
  // 下拉刷新
  onRefresh() {
    this.setData({
      page:0,
      refresh_triggered: true,
    });
    wx.showLoading({
      title: '加载中',
    })
    this.getNotice()
  },
  onLoadMore: function () {
    this.setData({
      is_loading_more: true,
      page:this.data.page + 1
    });
    this.getNotice()
  },

  acceptSubscribe: function (e) {
    var that = this
    if(e.detail.value){
      wx.showModal({
        title:"开启推送",
        content:"请在新界面勾选「总是保持以上选择，不再询问」并选择「允许」",
        showCancel:false,
        success(res){
          if(res.confirm){
            app.subscribe(true).then(function(bool){
              console.log(bool)
              if(bool){
                that.accept(true)
              }else{
                that.data.userInfo.subscribe_accept = false
                that.setData({
                  userInfo:that.data.userInfo
                })
              }
            }
            )
          }
        }
      })
    }else{
      that.accept(false)
    }

  },
  accept: function (e) {
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://pupu.boatonland.com/v1/notice/accept.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        subscribe_accept:e
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          that.data.userInfo.subscribe_accept = true
          that.setData({
            userInfo:that.data.userInfo
          })
          wx.showToast({title: '开启推送成功', icon: "none", duration: 1000})
        }else if(res.data.code == 201){
          that.data.userInfo.subscribe_accept = false
          that.setData({
            userInfo:that.data.userInfo
          })
          wx.showToast({title: '关闭推送成功', icon: "none", duration: 1000})
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.accept(e)
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  getNotice: function () {
    var that = this
    wx.request({
      url: 'https://pupu.boatonland.com/v1/notice/get.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        page:that.data.page,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          if(that.data.page == '0'){
            that.setData({
              noticeList:res.data.noticeList,
              isLast:res.data.isLast,
              refresh_triggered: false,
              is_loading_more: false,
            })
            wx.stopPullDownRefresh()
          }else{
            that.setData({
              noticeList:that.data.noticeList.concat(res.data.noticeList),
              isLast:res.data.isLast,
              refresh_triggered: false,
              is_loading_more: false,
            })
          }
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getPost()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  nav2Notice:function(e){
    app.subscribe(false)
    wx.navigateTo({
      url: e.currentTarget.dataset.url
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '漫游日志',
    });
    this.getUserInfo()
    this.getNotice()
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
