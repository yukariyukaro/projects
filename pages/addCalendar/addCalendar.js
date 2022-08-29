var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    calendar_title:'',
    calendar_location:'',
    calendar_type: '',
    calendar_type_show: '',
    calendar_start_time: '',
    calendar_end_time: '',
    calendar_notice_pre_time: 30,
    calendar_term:'',
    course_list: [],
    course_list_index: -1,
    course_id: '',
    course_code: '',
    course_list: '',
    date_list: ['MON','TUE','WED','THU','FRI','SAT','SUN'],
    date_list_index: -1,
    calendar_date: '',
    can_post:false,
    calendar_id:'',
    is_edit:false
  },

  selectCalendarType: function () {
    var that = this
    wx.showActionSheet({
      alertText: "日程类型",
      itemList: ['Tutorial', '自定日程 - 每周', '自定日程 - 单次'],
      success(res) {
        if (res.tapIndex == 0) {
          that.setData({
            calendar_type: 'tutorial',
            calendar_type_show: 'Tutorial'
          })
          if(that.checkData()){
            that.setData({
              can_post:true
            })
          }else{
            that.setData({
              can_post:false
            })
          }
        } else if (res.tapIndex == 1) {
          that.setData({
            calendar_type: 'diy_date',
            calendar_type_show: '自定日程 - 每周'
          })
          if(that.checkData()){
            that.setData({
              can_post:true
            })
          }else{
            that.setData({
              can_post:false
            })
          }
        } else if (res.tapIndex == 2) {
          that.setData({
            calendar_type: 'diy_ca',
            calendar_type_show: '自定日程 - 单次'
          })
          if(that.checkData()){
            that.setData({
              can_post:true
            })
          }else{
            that.setData({
              can_post:false
            })
          }
        }
      }
    })
  },
  bindCourseChange: function (e) {
    this.setData({
      course_list_index: e.detail.value,
      course_id: this.data.course_list[e.detail.value].course_id,
      course_code: this.data.course_list[e.detail.value].course_code,
      calendar_term: this.data.course_list[e.detail.value].course_term,
    })
    if(this.checkData()){
      this.setData({
        can_post:true
      })
    }else{
      this.setData({
        can_post:false
      })
    }
  },
  bindCalendarDateChange: function (e) {
    this.setData({
      date_list_index: e.detail.value,
      calendar_date: this.data.date_list[e.detail.value],
    })
    if(this.checkData()){
      this.setData({
        can_post:true
      })
    }else{
      this.setData({
        can_post:false
      })
    }
  },
  bindCalendarCaChange: function (e) {
    this.setData({
      calendar_ca: e.detail.value,
    })
    if(this.checkData()){
      this.setData({
        can_post:true
      })
    }else{
      this.setData({
        can_post:false
      })
    }
  },
  bindCalendarStartTimeChange: function (e) {
    this.setData({
      calendar_start_time: e.detail.value
    })
    if(this.checkData()){
      this.setData({
        can_post:true
      })
    }else{
      this.setData({
        can_post:false
      })
    }
  },
  bindCalendarEndTimeChange: function (e) {
    this.setData({
      calendar_end_time: e.detail.value
    })
    if(this.checkData()){
      this.setData({
        can_post:true
      })
    }else{
      this.setData({
        can_post:false
      })
    }
  },
  bindCalendarNoticePreTimeInput: function (e) {
    this.setData({
      calendar_notice_pre_time: e.detail.value
    })
    if(this.checkData()){
      this.setData({
        can_post:true
      })
    }else{
      this.setData({
        can_post:false
      })
    }
  },
  bindCalendarTitleInput: function (e) {
    this.setData({
      calendar_title: e.detail.value
    })
    if(this.checkData()){
      this.setData({
        can_post:true
      })
    }else{
      this.setData({
        can_post:false
      })
    }
  },
  bindCalendarLocationInput: function (e) {
    this.setData({
      calendar_location: e.detail.value
    })
    if(this.checkData()){
      this.setData({
        can_post:true
      })
    }else{
      this.setData({
        can_post:false
      })
    }
  },
  getCourseList: function () {
    var that = this;
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/course/getcourselist.php', 
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
            that.setData({
              course_list:res.data.course_list,
            })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getCourseList()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })
  },
  getSingleCalendar: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/calendar/getsingle.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        calendar_id:that.data.calendar_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
            console.log(res)
            if(res.data.calendar_detail.calendar_type == 'course'){
              that.setData({
                calendar_type:'course',
                calendar_notice_pre_time:res.data.calendar_detail.calendar_notice_pre_time
              })
            }else if(res.data.calendar_detail.calendar_type == 'tutorial'){
              that.setData({
                calendar_type:'tutorial',
                course_id:res.data.calendar_detail.course_id,
                calendar_term:res.data.calendar_detail.calendar_term,
                calendar_location:res.data.calendar_detail.calendar_location,
                calendar_date:res.data.calendar_detail.calendar_date,
                calendar_start_time:res.data.calendar_detail.calendar_start_time,
                calendar_end_time:res.data.calendar_detail.calendar_end_time,
                calendar_notice_pre_time:res.data.calendar_detail.calendar_notice_pre_time,
              })
            }else if(res.data.calendar_detail.calendar_type == 'diy_date'){
              that.setData({
                calendar_type:'diy_date',
                calendar_title:res.data.calendar_detail.calendar_title,
                calendar_location:res.data.calendar_detail.calendar_location,
                calendar_date:res.data.calendar_detail.calendar_date,
                calendar_start_time:res.data.calendar_detail.calendar_start_time,
                calendar_end_time:res.data.calendar_detail.calendar_end_time,
                calendar_notice_pre_time:res.data.calendar_detail.calendar_notice_pre_time,
              })
            }else if(res.data.calendar_detail.calendar_type == 'diy_ca'){
              that.setData({
                calendar_type:'diy_ca',
                calendar_title:res.data.calendar_detail.calendar_title,
                calendar_location:res.data.calendar_detail.calendar_location,
                calendar_ca:res.data.calendar_detail.calendar_ca,
                calendar_start_time:res.data.calendar_detail.calendar_start_time,
                calendar_end_time:res.data.calendar_detail.calendar_end_time,
                calendar_notice_pre_time:res.data.calendar_detail.calendar_notice_pre_time,
              })
            }else{
              wx.showToast({title: "未知错误", icon: "error", duration: 1000})
            }
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getSingleCalendar()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })
  },
  checkData:function(){
    var that = this
    if(that.data.calendar_type == 'course' && that.data.calendar_notice_pre_time){
      var data = {
        token:wx.getStorageSync('token'),
        calendar_notice_pre_time:that.data.calendar_notice_pre_time,
      }
      return data;
    }
    if(!that.data.calendar_start_time){
      return false;
    }
    if(!that.data.calendar_end_time){
      return false;
    }
    if(!that.data.calendar_notice_pre_time){
      return false;
    }
    if(!that.data.calendar_location){
      return false;
    }
    var calendar_start_time_stamp = Date.parse("1970/01/01 " + that.data.calendar_start_time)
    var calendar_end_time_stamp = Date.parse("1970/01/01 " + that.data.calendar_end_time)
    if(calendar_start_time_stamp >= calendar_end_time_stamp){
      return false;
    }
    if(that.data.calendar_type == 'tutorial'){
      if(that.data.course_id && that.data.calendar_date && that.data.calendar_term){
        var data = {
          token:wx.getStorageSync('token'),
          calendar_type:that.data.calendar_type,
          course_id:that.data.course_id,
          calendar_term:that.data.calendar_term,
          calendar_location:that.data.calendar_location,
          calendar_date:that.data.calendar_date,
          calendar_start_time:that.data.calendar_start_time,
          calendar_end_time:that.data.calendar_end_time,
          calendar_notice_pre_time:that.data.calendar_notice_pre_time,
        }
        return data;
      }else{
        return false;
      }
    }else if(that.data.calendar_type == 'diy_date'){
      if(that.data.calendar_title && that.data.calendar_date){
        var data = {
          token:wx.getStorageSync('token'),
          calendar_type:that.data.calendar_type,
          calendar_title:that.data.calendar_title,
          calendar_location:that.data.calendar_location,
          calendar_date:that.data.calendar_date,
          calendar_start_time:that.data.calendar_start_time,
          calendar_end_time:that.data.calendar_end_time,
          calendar_notice_pre_time:that.data.calendar_notice_pre_time,
        }
        return data;
      }else{
        return false;
      }
    }else if(that.data.calendar_type == 'diy_ca'){
      if(that.data.calendar_title && that.data.calendar_ca){
        var data = {
          token:wx.getStorageSync('token'),
          calendar_type:that.data.calendar_type,
          calendar_title:that.data.calendar_title,
          calendar_location:that.data.calendar_location,
          calendar_ca:that.data.calendar_ca,
          calendar_start_time:that.data.calendar_start_time,
          calendar_end_time:that.data.calendar_end_time,
          calendar_notice_pre_time:that.data.calendar_notice_pre_time,
        }
        return data;
      }else{
        return false;
      }
    }else{
      return false;
    }
  },
  create: function () {
    var that = this;
    var data = that.checkData()
    if(!data){
      wx.showToast({title: "填写的信息有误", icon: "error", duration: 1000})
      that.setData({
        can_post:false
      })
    }
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/calendar/create.php', 
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          wx.navigateBack({
            delta: 1,
            success() {
              wx.showToast({
                title: '创建成功',
                icon: "success",
                duration: 1000
              })
            }
          })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.create()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })
  },
  update: function () {
    var that = this;
    var data = that.checkData()
    if(!data){
      wx.showToast({title: "填写的信息有误", icon: "error", duration: 1000})
      that.setData({
        can_post:false
      })
    }
    data.calendar_id = that.data.calendar_id
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/calendar/update.php', 
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          wx.navigateBack({
            delta: 1,
            success() {
              wx.showToast({
                title: '更新成功',
                icon: "success",
                duration: 1000
              })
            }
          })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.update()
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
  onLoad(options) {
    this.getCourseList()
    if(options.calendar_id){
      wx.setNavigationBarTitle({
        title: '编辑日程'
      })
      this.setData({
        calendar_id:options.calendar_id,
        is_edit:true
      })
      this.getSingleCalendar()
    }
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
  onShareAppMessage() {

  }
})