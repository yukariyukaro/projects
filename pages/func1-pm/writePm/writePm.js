var app = getApp();
var util = require('../../../utils/util.js');

Page({
  data: {
    pm_msg: '',
    remnantLen: 800,
    user_serial: '',
    post_id: '',
    comment_order: '',
    to_type: 'user',
    pm_with_serial:true,
    isSending:false,
    primaryColor: app.globalData.theme.primary,
  },
  // 绑定内容输入
  bindContentInput: function (e) {
    const len = e.detail.value.length;
    const pm_msg = e.detail.value;
    this.setData({
      remnantLen: 800 - len,
      pm_msg: pm_msg,
    });
  },
  // 绑定选择投递方式
  toTypeTap: function (e) {
    const to_type = e.currentTarget.dataset.idx;
    this.setData({
      to_type,
      user_serial: '',
      post_id: '',
      comment_order: '',
    });
  },
   bindUserSerialInput: function (e) {
      const user_serial = e.detail.value;
      this.setData({
        user_serial: user_serial,
      });
  },
  // 绑定寄送目标 post serial
  bindPostSerialInput: function (e) {
      const post_id = e.detail.value;
      this.setData({
        post_id: post_id,
      });
    
  },
  // 绑定寄送目标 post serial
  bindCommentOrderInput: function (e) {
      const comment_order = e.detail.value;
      this.setData({
        comment_order: comment_order,
      });
  },
  // 选择是否带编号
  switchSerialChange: function (e) {
    this.setData({ pm_with_serial: e.detail.value });
  },
  submitNewPm: function () {
    var that = this
    wx.showLoading({
      title: '提交中',
    })
    that.setData({
      isSending:true
    })
    if(that.data.to_type == 'user'){
      var data = {
        token:wx.getStorageSync('token'),
        to_type:'user',
        receiver_serial:that.data.user_serial,
        pm_msg:that.data.pm_msg,
        pm_with_serial:that.data.pm_with_serial,
      }
    }
    if(that.data.to_type == 'post'){
      if(that.data.comment_order){
        var comment_order = that.data.comment_order
      }else{
        var comment_order = -1
      }
      var data = {
        token:wx.getStorageSync('token'),
        to_type:'post',
        post_id:that.data.post_id,
        comment_order:comment_order,
        pm_msg:that.data.pm_msg,
        pm_with_serial:that.data.pm_with_serial,
      }
    }
    console.log(data)
    wx.request({
      url: 'https://pupu.boatonland.com/v1/pm/post.php', 
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        that.setData({
          isSending:false
        })
        if(res.data.code == 200){
            wx.navigateBack({
              delta: 1,
              success(){
                wx.showToast({title: "发送成功", icon: "none", duration: 1000})
              }
            })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.submitComment()
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
    var that = this;
    wx.setNavigationBarTitle({
      title: '寄送私信',
    });
    if(options.to_type == 'post'){
      that.setData({
        to_type:'post'
      })
    }
    if(options.user_serial){
      that.setData({
        user_serial:options.user_serial
      })
    }
    if(options.post_id){
      that.setData({
        post_id:options.post_id
      })
    }
    if(options.comment_order){
      that.setData({
        comment_order:options.comment_order
      })
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
