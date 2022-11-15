var app = getApp();
var util = require('../../utils/util.js');

Page({
  data: {
    remnantLen: 500,
    comment_msg: '',
    comment_with_serial: false,
    is_author: '',
    placeholder: '想对洞主说些什么?',
    focus: true,
    post_id: '',
    comment_id:'',
    is_author: false,
    // primaryColor: app.globalData.theme.primary,
    isSending:false
  },
  // 让输入框聚焦
  focus: function () {
    this.setData({ focus: true });
  },
  // 绑定内容输入
  bindContent: function (e) {
    const len = e.detail.value.length;
    this.setData({
      remnantLen: 500 - len,
      comment_msg: e.detail.value,
    });
  },
  // 选择是否带编号
  switchSerialChange: function (e) {
    this.setData({ comment_with_serial: e.detail.value });
  },



  // 保存
  submitComment: function () {
    var that = this
    wx.showLoading({
      title: '提交中',
    })
    that.setData({
      isSending:true
    })
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/comment/post.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        post_id:that.data.post_id,
        comment_id:that.data.comment_id,
        comment_msg:that.data.comment_msg,
        comment_with_serial:that.data.comment_with_serial,
      },
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
                wx.showToast({title: "发布成功", icon: "none", duration: 1000})
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
  // 取消
  cancel: function () {
    wx.navigateBack({
      delta: 1,
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: options.post_id + '号树洞的评论',
    });
    that.setData({
      post_id:options.post_id,
      is_author:options.is_author,
    })
    if(options.is_author == 'true'){
      that.setData({
        comment_with_serial:true,
        placeholder:"想在自己的树洞下补充些什么？"
      })
    }
    if(options.comment_id){
      if(options.comment_order == 0){
        that.setData({
          comment_id:options.comment_id,
          placeholder:"Re G: "
        })
      }else{
        that.setData({
          comment_id:options.comment_id,
          placeholder:"Re LG" + options.comment_order + ": "
        })
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
  onUnload: function () {

  },

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
