var app = getApp();
Page({
  data: {
    preURL: 'https://i.boatonland.com/avatar/',
    avatarList: [''],
    chosenAvatar: '',
  },
  getAvatarList: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/user/avatar/get.php', 
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
            avatarList:res.data.avatarList,
          })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getAvatarList()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  chooseAvatar: function (e) {
    this.setData({
      chosenAvatar: e.currentTarget.dataset.item,
    });
  },
  submitNewAvatar: function () {
    var that = this
    if (that.data.chosenAvatar == '') {
      return;
    }
    wx.showLoading({
      title: '提交中',
    });
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/user/avatar/update.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        user_avatar:that.data.chosenAvatar
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          wx.showToast({ title: '头像设置成功', icon: 'none', duration: 1000,});
          setTimeout(() =>
              wx.reLaunch({url: '/pages/profile/profile',}),
          1000);
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.submitNewAvatar()
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
    wx.setNavigationBarTitle({
      title: '选择头像',
    });
    this.getAvatarList();
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
