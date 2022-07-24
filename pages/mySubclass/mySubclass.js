var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    refresh_triggered:false,
    term_list:[],
    term_name_list:[],
    term_index:0,
    weekday_list:['MON','TUE','WED','THU','FRI'],
    timepoint_list:['8:30','10:30','12:30','14:30','16:30','18:30','20:30'],
    color_list:['229453','ffd111','ed5126','1a94bc','813c85','f1939c','1772b4','12a182','d6a01d','de7622']
  },

  getSubclass: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/course/get.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        page:that.data.page,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        if(res.data.code == 200){
          res.data.term_list.forEach(term => {
            term.timeslot_list.forEach(timeslot => {
              var start_time_hour = Date.parse("1970/01/01 " + timeslot.start_time) / 3600000 + 8
              var end_time_hour = Date.parse("1970/01/01 " + timeslot.end_time) / 3600000 + 8
              timeslot.position_top = (start_time_hour - 8.5) * 80
              timeslot.position_height = (end_time_hour - start_time_hour) * 80
              timeslot.color_index = timeslot.course_id % 30
            })
          })
          that.setData({
            term_list:res.data.term_list,
            term_name_list:res.data.term_name_list,
            refresh_triggered:false
          })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getSubclass()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  bindCalendar: function (e) {
    var that = this
    wx.showActionSheet({
      alertText:"提醒时间：上课前",
      itemList: ['10分钟','15分钟','20分钟','30分钟','45分钟','60分钟'],
      success (res) {
        if(res.tapIndex == 0){
          that.getCalendar(e.currentTarget.dataset.subclassterm, 10)
        }else if(res.tapIndex == 1){
          that.getCalendar(e.currentTarget.dataset.subclassterm, 15)
        }else if(res.tapIndex == 2){
          that.getCalendar(e.currentTarget.dataset.subclassterm, 20)
        }else if(res.tapIndex == 3){
          that.getCalendar(e.currentTarget.dataset.subclassterm, 30)
        }else if(res.tapIndex == 4){
          that.getCalendar(e.currentTarget.dataset.subclassterm, 45)
        }else if(res.tapIndex == 5){
          that.getCalendar(e.currentTarget.dataset.subclassterm, 60)
        }
      }
    })
  },
  getCalendar: function (subclass_term, notice_time) {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/course/calendar.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        subclass_term:subclass_term,
        notice_time:notice_time
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          wx.setClipboardData({
            data: res.data.download_url,
            success: () => {
              wx.hideToast()
            }
          })
          app.showModal({
            title: "日历导出成功",
            content: "链接已复制，在手机浏览器打开即可导入到手机日历",
            // cancelText: "我知道了",
            confirmText: "我知道了",
            success(res) {

            }
          })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getCalendar(subclass_term, notice_time)
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },
  onRefresh() {
    this.getSubclass();
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },
  nav2One: function(){
    wx.switchTab({
      url: '/pages/one/one',
    })
  },
  scrollToCourse:function(e){
    this.setData({
      to_view: "course-" + e.currentTarget.dataset.courseid,
    })
  },
  changeTerm:function(){
    var that = this
    wx.showActionSheet({
      itemList: that.data.term_name_list,
      success(res) {
        that.setData({
          term_index:res.tapIndex
        })
        this.getSubclass()
      },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getSubclass()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(){
    
  },
  onShareTimeline(){
    
  }
})