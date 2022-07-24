Page({

  /**
   * 页面的初始数据
   */
  data: {
    postList:[],
    page:0,
    isLast:false,
    key_word:'',
    is_loading_more:false,
    hit_count:'0',
    scroll_top:0,
    new_search:true
  },

  onInputKeyWord:function(e){
    this.setData({
      key_word:e.detail.value,
      page:0,
      scroll_top:0,
      is_loading_more:true
    })
    this.getPostBySearch()
  },
  clearInput:function(){
    this.setData({
      key_word:'',
      page:0,
      scroll_top:0,
      is_loading_more:true
    })
    this.getPostBySearch()
  },
  onLoadMore: function () {
    if(this.data.is_loading_more){return}
    if(this.data.isLast){return}
    this.setData({
      is_loading_more: true,
      page:this.data.page + 1
    });
    this.getPostBySearch();
  },
  newSearch: function (e) {
    this.setData({ new_search: e.detail.value });
    this.getPostBySearch()
    wx.openUrl({
      url:'https://baidu.com'
    })
  },

  getPostBySearch: function () {
    var that = this
    if(that.data.new_search){
      var url = 'https://api.pupu.hkupootal.com/v3/one/search.php'
    }else{
      var url ='https://api.pupu.hkupootal.com/v3/post/list/search.php'
    }
    wx.request({
      url: url,
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        key_word:that.data.key_word,
        page:that.data.page,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        if(res.data.code == 200){
          if(that.data.page == '0'){
            that.setData({
              postList:res.data.postList,
              isLast:res.data.isLast,
              is_loading_more: false,
              hit_count:res.data.hit_count
            })
            wx.stopPullDownRefresh()
          }else{
            that.setData({
              postList:that.data.postList.concat(res.data.postList),
              isLast:res.data.isLast,
              is_loading_more: false,
            })
          }
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getPostBySearch()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },

  bindScroll:function(e){
    // console.log(e.detail.scrollHeight - e.detail.scrollTop)
    if(this.data.is_loading_more){return}
    if(e.detail.scrollHeight - e.detail.scrollTop < 2500){
      this.onLoadMore()
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getPostBySearch()
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