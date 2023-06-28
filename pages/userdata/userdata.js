var app = getApp();
import newRequest from '../../utils/request'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    preURL: "https://i.boatonland.com/avatar/",
    user_avatar:'',
    user_serial:'',
    avatar_sdk_content:'',
    avatarCollection:[]
  },

  // /user/profile/get
  getUserInfo: function () {
    var that = this
    newRequest('/user/profile/get', {}, that.getUserInfo)
    .then((res) => {
      if(res.code == 200){
        that.setData({
          user_serial:res.user_info.user_serial,
          user_avatar:res.user_info.user_avatar,
        })
    }else{
      wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
    }
    })

  },

  // /user/avatar/get
  getAvatarCollection: function () {
    var that = this
    newRequest('/user/avatar/get', {}, that.getAvatarCollection)
    .then((res) => {
      wx.hideLoading()
      if(res.code == 200){
          console.log(res.avatar_collection)
          that.setData({
            avatarCollection:res.avatar_collection
          })
      }else{
        wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
      }
    })

  },
  
  // /user/avatar/exchange
  useSdk: function () {
    var that = this
    newRequest('/user/avatar/exchange', {avatar_sdk_content:that.data.avatar_sdk_content}, that.useSdk)
    .then((res) => {
      if(res.code == 200){
        wx.showToast({title: "兑换成功", icon: "none", duration: 1000})
        that.getAvatarCollection()
      }else if(res.code == 400){
        wx.showToast({title: "兑换码错误:(", icon: "none", duration: 1000})
      }else if(res.code == 401 || res.code == 402){
        wx.showToast({title: "你已经拥有它啦`^`", icon: "none", duration: 1000})
      }else if(res.code == 500){
        wx.showToast({title: "请输入兑换码", icon: "none", duration: 1000})
      }else{
        wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
      }
    })

  },

  // /user/profile/update
  update: function () {
    if (this.data.user_serial.match(/^\s*$/) || this.data.user_serial.length < 3) {
      wx.showToast({
        title: 'ID至少三位',
        icon: 'none',
        duration: 1000,
      });
    } else if (!this.data.user_serial.match(/^^[a-z0-9]+$/)) {
      wx.showToast({
        title: '存在非法字符',
        icon: 'none',
        duration: 1000,
      });
    } else {
      wx.showLoading({
        title: '提交中',
      });
      var that = this
      newRequest('/user/profile/update', {user_serial:that.data.user_serial, user_avatar:that.data.user_avatar}, that.update)
      .then((res) => {
        wx.hideLoading()
        if(res.code == 200){
          wx.navigateBack({
            delta: 1,
            success(){
              wx.showToast({title: "修改成功!", icon: "none", duration: 1000})
            }
          })
        }else if(res.code == 400){
          wx.showToast({title: "这个id被别人抢注了:(", icon: "none", duration: 1000})
        }else if(res.data.code == 401){
          wx.showToast({title: "你还未拥有这个头像:P", icon: "none", duration: 1000})
        }else{
          wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
        }
      })
    }
  },

  bindSerialInput: function (e) {
    this.setData({
      user_serial: e.detail.value,
    });
  },
  bindSdkInput: function (e) {
    this.setData({
      avatar_sdk_content: e.detail.value,
    });
  },
  chooseAvatar:function(e){
    this.setData({
      user_avatar: e.currentTarget.dataset.avatarname
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserInfo()
    this.getAvatarCollection()
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