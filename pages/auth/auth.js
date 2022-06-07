var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    auth_key:'',
    from_miniapp:false,
    dev_name:'',
    user_has_email_suffix:false
  },

  getAuth: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/auth/user/get.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        auth_key:that.data.auth_key
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
            that.setData({
              dev_name:res.data.dev_name,
              user_has_email_suffix:res.data.user_has_email_suffix
            })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getAuth()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })
  },

  confirm: function () {
    var that = this
    if(that.data.user_has_email_suffix){
      that.confirmAuth('')
    }else{
      wx.showActionSheet({
        alertText:"请选择你的邮箱后缀",
        itemList: ['@connect.hku.hk','@hku.hk'],
        success (res) {
          if(res.tapIndex == 0){
            that.confirmAuth('@connect.hku.hk')
          }else if(res.tapIndex == 1){
            that.confirmAuth('@hku.hk')
          }
        }
      })
    }
  },

  confirmAuth:function(user_email_suffix){
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/auth/user/confirm.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        auth_key:that.data.auth_key,
        user_email_suffix:user_email_suffix
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          app.globalData.auth_key = ''
          app.globalData.from_miniapp = ''
          if(that.data.from_miniapp){
            wx.navigateBackMiniProgram({
              extraData: {
                pupu_auth:'success'
              },
            })
          }else{
            wx.reLaunch({
              url: '/pages/home/home',
            })
          }     
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.confirmAuth(user_email_suffix)
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })
  },

  reject:function(){
    var that = this
    app.globalData.auth_key = ''
    app.globalData.from_miniapp = ''
    if(that.data.from_miniapp){
      wx.navigateBackMiniProgram({
        extraData: {
          pupu_auth:'fail'
        },
      })
    }else{
      wx.reLaunch({
        url: '/pages/home/home',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      auth_key:options.auth_key
    })
    if(options.from_miniapp){
      this.setData({
        from_miniapp:true
      })
      app.globalData.from_miniapp = true
    }
    this.getAuth()
    app.globalData.auth_key = options.auth_key
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})