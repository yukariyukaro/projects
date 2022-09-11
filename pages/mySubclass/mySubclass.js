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
    calendar_list:[],
    weekday_list:['MON','TUE','WED','THU','FRI'],
    // timepoint_list:['0:00','0:30','2:30','4:30','6:30','8:30','10:30','12:30','14:30','16:30','18:30','20:30','22:30'],
    timepoint_list:['8:30','10:30','12:30','14:30','16:30','18:30'],
    color_list:['c8c8c8','229453','ffd111','ed5126','1a94bc','813c85','f1939c','1772b4','12a182','d6a01d','de7622','695776','2b5f8e','f4b974','f07544','de7ab1','c17886','ab96c5','b1c5b4','90caaf','3c5e91','229453','ffd111','ed5126','1a94bc','813c85','f1939c','1772b4','12a182','d6a01d','de7622','695776','2b5f8e','f4b974','f07544','de7ab1','c17886','ab96c5','b1c5b4','90caaf','3c5e91','229453','ffd111','ed5126','1a94bc','813c85','f1939c','1772b4','12a182','d6a01d','de7622','695776','2b5f8e','f4b974','f07544','de7ab1','c17886','ab96c5','b1c5b4','90caaf','3c5e91'],
    now_weekday:0,
    now_hour_position:0,
    show_half_modal:false,
    calendar_selected:{}
  },

  // getSubclass: function () {
  //   var that = this
  //   wx.request({
  //     url: 'https://api.pupu.hkupootal.com/v3/course/get.php', 
  //     method: 'POST',
  //     data: {
  //       token:wx.getStorageSync('token'),
  //       page:that.data.page,
  //     },
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     success (res) {
  //       if(res.data.code == 200){
  //         res.data.term_list.forEach(term => {
  //           term.timeslot_list.forEach(timeslot => {
  //             var start_time_hour = Date.parse("1970/01/01 " + timeslot.start_time) / 3600000 + 8
  //             var end_time_hour = Date.parse("1970/01/01 " + timeslot.end_time) / 3600000 + 8
  //             timeslot.position_top = (start_time_hour - 8.5) * 80
  //             timeslot.position_height = (end_time_hour - start_time_hour) * 80
  //           })
  //         })
  //         that.setData({
  //           term_list:res.data.term_list,
  //           term_name_list:res.data.term_name_list,
  //           refresh_triggered:false
  //         })
  //       }else if(res.data.code == 800 ||res.data.code == 900){
  //         app.launch().then(res=>{
  //           that.getSubclass()
  //         })
  //       }else{
  //         wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
  //       }
  //     }
  //   })

  // },
  getCalendarEvent: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/calendar/get.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          // res.data.term_list.forEach(term => {
          //   term.calendar_list.forEach(calendar_list => {
          //     var start_time_hour = Date.parse("1970/01/01 " + calendar_list.calendar_start_time) / 3600000 + 8
          //     var end_time_hour = Date.parse("1970/01/01 " + calendar_list.calendar_end_time) / 3600000 + 8
          //     calendar_list.position_top = (start_time_hour - 8.5) * 80
          //     calendar_list.position_height = (end_time_hour - start_time_hour) * 80
          //   })
          // })
          that.setData({
            term_list:res.data.term_list,
            term_name_list:res.data.term_name_list,
            refresh_triggered:false
          })
          that.updateToTerm()
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getCalendarEvent()
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
    this.getCalendarEvent()
  },
  nav2One: function(){
    wx.switchTab({
      url: '/pages/one/one',
    })
  },
  nav2AddCalendar: function(){
    wx.navigateTo({
      url: '/pages/addCalendar/addCalendar',
    })
  },
  selectCalendar:function(e){
    this.setData({
      calendar_selected: e.currentTarget.dataset.calendar,
    })
    this.showHalfModal()
  },
  changeTerm:function(){
    var that = this
    wx.showActionSheet({
      itemList: that.data.term_name_list,
      success(res) {
        that.setData({
          term_index:res.tapIndex
        })
        that.updateToTerm()
      },
    })
  },
  updateToTerm:function(){
    var that = this
    var calendar_list = that.data.term_list[that.data.term_index].calendar_list
    
    if(that.data.term_list[that.data.term_index].last_date == "SAT"){
      that.setData({
        weekday_list:['MON','TUE','WED','THU','FRI','SAT'],
      })
    }else if(that.data.term_list[that.data.term_index].last_date == "SUN"){
      that.setData({
        weekday_list:['MON','TUE','WED','THU','FRI','SAT','SUN'],
      })
    }else{
      that.setData({
        weekday_list:['MON','TUE','WED','THU','FRI'],
      })
    }

    if(that.data.term_list[that.data.term_index].first_time == 0){
      var first_time = 0
      var timepoint_list = ['0:00','0:30','2:30','4:30','6:30','8:30','10:30','12:30','14:30','16:30','18:30']
    }else if(that.data.term_list[that.data.term_index].first_time == 0.5){
      var first_time = 0.5
      var timepoint_list = ['0:30','2:30','4:30','6:30','8:30','10:30','12:30','14:30','16:30','18:30']
    }else if(that.data.term_list[that.data.term_index].first_time == 2.5){
      var first_time = 2.5
      var timepoint_list = ['2:30','4:30','6:30','8:30','10:30','12:30','14:30','16:30','18:30']
    }else if(that.data.term_list[that.data.term_index].first_time == 4.5){
      var first_time = 4.5
      var timepoint_list = ['4:30','6:30','8:30','10:30','12:30','14:30','16:30','18:30']
    }else if(that.data.term_list[that.data.term_index].first_time == 6.5){
      var first_time = 6.5
      var timepoint_list = ['6:30','8:30','10:30','12:30','14:30','16:30','18:30']
    }else{
      var first_time = 8.5
      var timepoint_list = ['8:30','10:30','12:30','14:30','16:30','18:30']
    }

    if(that.data.term_list[that.data.term_index].last_time == 22.5){
      timepoint_list = timepoint_list.concat(['20:30'])
    }else if(that.data.term_list[that.data.term_index].last_time == 24.5){
      timepoint_list = timepoint_list.concat(['20:30','22:30'])
    }
    calendar_list.forEach(calendar => {
      var start_time_hour = Date.parse("1970/01/01 " + calendar.calendar_start_time) / 3600000 + 8
      var end_time_hour = Date.parse("1970/01/01 " + calendar.calendar_end_time) / 3600000 + 8
      calendar.position_top = (start_time_hour - first_time) * 80
      calendar.position_height = (end_time_hour - start_time_hour) * 80
    })
    this.setData({
      calendar_list: calendar_list,
      timepoint_list: timepoint_list,
      now_weekday: new Date().getDay()
    })
    var now_hour = (Date.parse(new Date())%86400000/3600000 + 8)%24
    if(now_hour>first_time && now_hour<that.data.term_list[that.data.term_index].last_time){
      this.setData({
        now_hour_position: (now_hour - first_time) * 80
      })
    }
  },
  courseAddSubclass: function (e) {
    var that = this
    console.log(e.currentTarget.dataset.subclassid)
    console.log(e.currentTarget.dataset.index)
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/course/add.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        subclass_id:e.currentTarget.dataset.subclassid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          var calendar_selected = that.data.calendar_selected
          if(e.currentTarget.dataset.index){
            calendar_selected.calendar_data.course_subclass_list.forEach(subclass => {
              subclass.is_added = false
            });
            calendar_selected.calendar_data.course_subclass_list[e.currentTarget.dataset.index].is_added = true
            that.setData({
              calendar_selected: calendar_selected
            });
          }
          wx.showToast({title: "选课成功", icon: "success", duration: 1000})
          that.getCalendarEvent()
        }else if(res.data.code == 201){
          var calendar_selected = that.data.calendar_selected
          if(e.currentTarget.dataset.index){
            calendar_selected.calendar_data.course_subclass_list[e.currentTarget.dataset.index].is_added = true
            that.setData({
              calendar_selected: calendar_selected
            });
          }
          wx.showToast({title: "取消选课成功", icon: "success", duration: 1000})
          that.getCalendarEvent()
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.courseAddSubclass(e)
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })
  },
  showHalfModal:function(){
    var that = this;
    var animation  = wx.createAnimation({
        duration:500,
        timingFunction:'ease-out'
      })
    var overlay_animation  = wx.createAnimation({
        duration:500,
        timingFunction:'ease-out'
      })
    that.animation = animation
    that.overlay_animation = overlay_animation
    animation.translateY(800).step()
    overlay_animation.opacity(0).step()
    that.setData({
      half_modal_animation: animation.export(),
      overlay_animation: overlay_animation.export(),
      show_half_modal:true
    })
    setTimeout(function(){
      animation.translateY(0).step()
      overlay_animation.opacity(1).step()
      that.setData({
        half_modal_animation: animation.export(),
        overlay_animation: overlay_animation.export(),
      })
    },1)
  },
  hideHalfModal:function(){
    var that = this;
    var animation  = wx.createAnimation({
        duration:500,
        timingFunction:'ease-in'
      })
    var overlay_animation  = wx.createAnimation({
        duration:500,
        timingFunction:'ease-in'
      })
    that.animation = animation
    that.overlay_animation = overlay_animation
    animation.translateY(800).step()
    overlay_animation.opacity(0).step()
    that.setData({
      half_modal_animation: animation.export(),
      overlay_animation: overlay_animation.export(),
    })
    setTimeout(function(){
      that.setData({
        show_half_modal:false,
        calendar_selected: {}
      })
    },500)
  },
  deleteCalendar:function(){
    var that = this
    wx.showLoading({
      title: '加载中',
    })
    if(that.data.calendar_selected.calendar_type == 'course'){
      var e = {
        currentTarget: {
          dataset: {
            subclassid: that.data.calendar_selected.subclass_id
          }
        }
      }
      that.courseAddSubclass(e)
      that.hideHalfModal()
      return;
    }
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/calendar/delete.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        calendar_id:that.data.calendar_selected.calendar_id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          that.hideHalfModal()
          wx.showToast({title: "删除成功", icon: "success", duration: 1000})
          that.getCalendarEvent()
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.deleteCalendar()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })
  },
  editCalendar:function(){
    wx.navigateTo({
      url: '/pages/addCalendar/addCalendar?calendar_id=' + this.data.calendar_selected.calendar_id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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
    this.getCalendarEvent()
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