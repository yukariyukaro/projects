const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_dark:false,
    row_number:5,
    time:0,
    touchStartTime: 0,
    touchEndTime: 0,
    emotion_message_seleted: {},
    show_bubble: false,
    show_input: true,
    reload: false,
    to_post: false,
    emotion_list:[
      {
        emotion_name:'搏尽',
        emotion_emoji:'🧐',
        emotion_color_light:'#F8C794',
        emotion_color_dark:'#E1A669'
      },
      {
        emotion_name:'摆烂',
        emotion_emoji:'🤗',
        emotion_color_light:'#C5FAA8',
        emotion_color_dark:'#8BB676'
      },
      {
        emotion_name:'发癫',
        emotion_emoji:'🤪',
        emotion_color_light:'#D2B6F6',
        emotion_color_dark:'#C3A6E8'
      },
      {
        emotion_name:'平静',
        emotion_emoji:'😐',
        emotion_color_light:'#ABCDFF',
        emotion_color_dark:'#7BA1D8'
      },
    ],
    emotion_selected_index:-1,
    emotion_message_msg:''
  },

  bindSelectEmotion: function (e) {
    var that = this
    var systemInfo = wx.getSystemInfoSync()
    if(e.currentTarget.dataset.emotionindex == that.data.emotion_selected_index){
      that.setData({
        emotion_selected_index: -1,
      })
      if(systemInfo.theme == 'dark'){
        wx.setNavigationBarColor({
          frontColor: "#000000",
          backgroundColor: "#864442",
          animation: {
            duration: 1000,
            timingFunc: 'easeInOut'
          }
        })
      }else{
        wx.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: "#D85050",
          animation: {
            duration: 1000,
            timingFunc: 'easeInOut'
          }
        })
      }
    }else{
      that.setData({
        emotion_selected_index: e.currentTarget.dataset.emotionindex,
      })
      if(systemInfo.theme == 'dark'){
        wx.setNavigationBarColor({
          frontColor: "#000000",
          backgroundColor: that.data.emotion_list[e.currentTarget.dataset.emotionindex].emotion_color_dark,
          animation: {
            duration: 1000,
            timingFunc: 'easeInOut'
          }
        })
      }else{
        wx.setNavigationBarColor({
          frontColor: "#000000",
          backgroundColor: that.data.emotion_list[e.currentTarget.dataset.emotionindex].emotion_color_light,
          animation: {
            duration: 1000,
            timingFunc: 'easeInOut'
          }
        })
      }
    }
  },

  touchStart:function (e) {
    // console.log(e)
    this.setData({
      touchStartTime: e.timeStamp
    })
  },
  touchEnd:function(e) {
    // console.log(e)
    this.setData({
      touchEndTime: e.timeStamp
    })
  },
  multipleTap:function(e) {
    console.log(e)
    var that = this
    if (that.data.touchEndTime - that.data.touchStartTime < 350) {
      var currentTime = e.timeStamp;
      var lastTapTime = that.data.lastTapTime;
      that.setData({
        lastTapTime: currentTime
      })
      if (currentTime - lastTapTime < 300) {
        clearTimeout(that.lastTapTimeoutFunc)
        that.like(e.currentTarget.dataset.emotionmessage.emotion_message_id)
      } else {
        that.lastTapTimeoutFunc = setTimeout(function () {
          that.setData({
            emotion_message_seleted: e.currentTarget.dataset.emotionmessage
          })
          that.showBubble()
        }, 300);
      };
    }
  },


  doNothing: function () {

  },

  onTapBubble: function (e) {
    console.log(e)
  },

  showBubble: function () {
    var that = this
    if(that.data.show_input){
      that.hideInput()
    }
    if(that.data.is_dark){
      wx.setNavigationBarColor({
        frontColor: "#000000",
        backgroundColor: that.data.emotion_message_seleted.emotion_color_dark,
        animation: {
          duration: 500,
          timingFunc: 'easeInOut'
        }
      })
    }else{
      wx.setNavigationBarColor({
        frontColor: "#000000",
        backgroundColor: that.data.emotion_message_seleted.emotion_color_light,
        animation: {
          duration: 500,
          timingFunc: 'easeInOut'
        }
      })
    }
    var bubble_animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var overlay_animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    that.bubble_animation = bubble_animation
    that.overlay_animation = overlay_animation
    bubble_animation.opacity(0).step()
    overlay_animation.opacity(0).step()
    that.setData({
      bubble_animation: bubble_animation.export(),
      overlay_animation: overlay_animation.export(),
      show_bubble: true
    })
    setTimeout(function () {
      bubble_animation.opacity(1).step()
      overlay_animation.opacity(1).step()
      that.setData({
        bubble_animation: bubble_animation.export(),
        overlay_animation: overlay_animation.export(),
      })
    }, 1)
  },
  hideBubble: function () {
    var that = this
    if(this.data.show_input){
      return
    }
    if(that.data.is_dark){
      wx.setNavigationBarColor({
        frontColor: "#000000",
        backgroundColor: "#864442",
        animation: {
          duration: 1000,
          timingFunc: 'easeInOut'
        }
      })
    }else{
      wx.setNavigationBarColor({
        frontColor: "#ffffff",
        backgroundColor: "#D85050",
        animation: {
          duration: 1000,
          timingFunc: 'easeInOut'
        }
      })
    }
    var bubble_animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in'
    })
    var overlay_animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in'
    })
    that.bubble_animation = bubble_animation
    that.overlay_animation = overlay_animation
    bubble_animation.opacity(0).step()
    overlay_animation.opacity(0).step()
    that.setData({
      bubble_animation: bubble_animation.export(),
      overlay_animation: overlay_animation.export(),
    })
    setTimeout(function () {
      that.setData({
        show_bubble: false,
        emotion_message_seleted: {}
      })
    }, 500)
  },
  showInput: function () {
    var that = this
    if(that.data.show_bubble){
      that.hideBubble()
    }
    var input_animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-out'
    })
    var overlay_animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    that.input_animation = input_animation
    that.overlay_animation = overlay_animation
    input_animation.translateY(400).step()
    overlay_animation.opacity(0).step()
    that.setData({
      input_animation: input_animation.export(),
      overlay_animation: overlay_animation.export(),
      show_input: true
    })
    setTimeout(function () {
      input_animation.translateY(0).step()
      overlay_animation.opacity(1).step()
      that.setData({
        input_animation: input_animation.export(),
        overlay_animation: overlay_animation.export(),
      })
    }, 1)
  },
  hideInput: function () {
    var that = this
    if(that.data.emotion_selected_index != -1){
      if(that.data.is_dark){
        wx.setNavigationBarColor({
          frontColor: "#000000",
          backgroundColor: "#864442",
          animation: {
            duration: 1000,
            timingFunc: 'easeInOut'
          }
        })
      }else{
        wx.setNavigationBarColor({
          frontColor: "#ffffff",
          backgroundColor: "#D85050",
          animation: {
            duration: 1000,
            timingFunc: 'easeInOut'
          }
        })
      }
    }
    that.setData({
      emotion_selected_index: -1,
      emotion_message_msg: ''
    })
    var input_animation = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease-in'
    })
    var overlay_animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-in'
    })
    that.input_animation = input_animation
    that.overlay_animation = overlay_animation
    input_animation.translateY(800).step()
    overlay_animation.opacity(0).step()
    that.setData({
      input_animation: input_animation.export(),
      overlay_animation: overlay_animation.export(),
    })
    setTimeout(function () {
      that.setData({
        show_input: false,
      })
    }, 300)
  },

  bindInput: function (e) {
    this.setData({
      emotion_message_msg: e.detail.value,
    });
  },

  post: function () {
    var that = this
    if(!that.data.emotion_message_msg){
      wx.showToast({title: "请输入吐槽内容", icon: "error", duration: 1000})
      return
    }
    if(that.data.emotion_selected_index == '-1'){
      wx.showToast({title: "请选择情绪", icon: "error", duration: 1000})
      return
    }
    wx.showLoading({title: '发送中',})
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/emotion/post.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        emotion_message_msg: that.data.emotion_message_msg,
        emotion_index: that.data.emotion_selected_index,
        emotion_data: JSON.stringify(that.data.emotion_list[that.data.emotion_selected_index])
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          wx.showToast({title: "发送成功", icon: "success", duration: 1000})
          that.hideInput()
          that.getTabBar().rotateIcon(true)
          that.get()
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.post()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })
  },

  single: function (emotion_message_id) {
    var that = this
    wx.showLoading({title: '加载中',})
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/emotion/single.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        emotion_message_id: emotion_message_id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        wx.hideLoading()
        if(res.data.code == 200){
          that.setData({
            emotion_message_seleted: res.data.emotion_message
          })
          that.showBubble()
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.single(emotion_message_id)
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })
  },

  get: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/emotion/get.php', 
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
            emotion_message_list: res.data.emotion_message_list
          })
          that.setData({
            reload:true,
            time:0
          })
          setTimeout(() => {
            that.setData({
              reload:false
            })
          }, 10)
          that.reloadDanmu()
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.get()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },

  reloadDanmu:function(){
    var that = this
    var row_number = that.data.row_number
    var emotion_message_list_package =  new Array(row_number)
    for(var i=0;i<row_number; i++){
      emotion_message_list_package[i] = []
    }
    var emotion_message_list = that.data.emotion_message_list
    while(emotion_message_list.length < 50*row_number){
      emotion_message_list = emotion_message_list.concat(emotion_message_list)
    }
    for(var i=0; i<50; i++){
      for(var j=0; j<row_number; j++){
        emotion_message_list_package[j].push(emotion_message_list[10*i + j])
      }
    }
    that.setData({
      emotion_message_list_package: emotion_message_list_package
    })
  },
  
  nav2Post:function(e){
    this.setData({
      to_post:true
    })
    wx.navigateTo({
      url: '/pages/detail/detail?post_id=' + e.currentTarget.dataset.postid,
    })
  },

  likePre:function(e){
    this.like(e.currentTarget.dataset.emotionmessageid)
  },

  like: function (emotion_message_id) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/emotion/like.php',
      method: 'POST',
      data: {
        token: wx.getStorageSync('token'),
        emotion_message_id: emotion_message_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          var emotion_message_list = that.data.emotion_message_list
          emotion_message_list.forEach(item => {
            if(item.emotion_message_id == emotion_message_id){
              item.emotion_like_num = Number(item.emotion_like_num) + 1
              item.is_liked = true
            }
          })
          that.setData({
            emotion_message_list:emotion_message_list
          })
          that.reloadDanmu()
          if(that.data.emotion_message_seleted){
            var emotion_message_seleted = that.data.emotion_message_seleted
            emotion_message_seleted.emotion_like_num = Number(emotion_message_seleted.emotion_like_num) + 1
            emotion_message_seleted.is_liked = true
            that.setData({
              emotion_message_seleted:emotion_message_seleted
            })
          }
          wx.showToast({title: "+1成功", icon: "none", duration: 500})
        } else if (res.data.code == 201) {
          var emotion_message_list = that.data.emotion_message_list
          emotion_message_list.forEach(item => {
            if(item.emotion_message_id == emotion_message_id){
              item.emotion_like_num = Number(item.emotion_like_num) - 1
              item.is_liked = false
            }
          })
          that.setData({
            emotion_message_list:emotion_message_list
          })
          that.reloadDanmu()
          if(that.data.emotion_message_seleted){
            var emotion_message_seleted = that.data.emotion_message_seleted
            emotion_message_seleted.emotion_like_num = Number(emotion_message_seleted.emotion_like_num) - 1
            emotion_message_seleted.is_liked = false
            that.setData({
              emotion_message_seleted:emotion_message_seleted
            })
          }
          wx.showToast({title: "-1成功", icon: "none", duration: 500})
        } else if (res.data.code == 800 || res.data.code == 900) {
          app.launch().then(res => {
            that.like(emotion_message_id)
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: "error",
            duration: 1000
          })
        }
      }
    })
  },
  timer:function(){
    var time = this.data.time + 1
    this.setData({
      time: time
    })
    if(time >= 80){
      this.get()
    }
    setTimeout(() => {
      this.timer()
    }, 1000);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this
    this.timer()
    if (options.emotion_message_id) {
      this.single(options.emotion_message_id)
    }
    if(app.globalData.emotion_message_id){
      this.single(app.globalData.emotion_message_id)
      app.globalData.emotion_message_id = ''
    }
    wx.getSystemInfo({  // 获取页面可视区域的高度
      success: (res) =>{
        var pixelRatio = 750 / res.windowWidth
        that.setData({
          row_number: (parseInt((res.windowHeight - 70)/(120/pixelRatio)))
        })
      },
    })
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
    this.getTabBar().setData({
      selected: 2
    })
    app.globalData.tabbarJS = this
    app.updateTabbar()
    var systemInfo = wx.getSystemInfoSync()
    if(systemInfo.theme == 'dark'){
      this.setData({
        is_dark:true
      })
    }else{
      this.setData({
        is_dark:false
      })
    }
    if(this.data.to_post){
      this.setData({
        to_post: false
      })
    }else{
      this.get()
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    app.globalData.tabbarJS = ''
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    app.globalData.tabbarJS = ''
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