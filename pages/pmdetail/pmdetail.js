var app = getApp()
var COS = require('../../utils/cos-wx-sdk-v5.js')
const localDB = require('../../utils/database.js')
const info = require('../../utils/info.js')
const { default: newRequest } = require('../../utils/request.js')
const _ = localDB.command
Page({

  /**
   * 页面的初始数据
   */
  data: {
    preURL: 'https://i.boatonland.com/avatar/',
    pm_msg:'',
    emojiShow: false,
    emojiChars: ["😀", "😁", "😂", "😃", "😄", "😅", "😆", "😉", "😊", "😋", "😎", "😍", "😘", "😗", "😙", "😚", "😇", "😐", "😑", "😶", "😏", "😣", "😥", "😮", "😯", "😪", "😫", "😴", "😌", "😛", "😜", "😝", "😒", "😓", "😔", "😕", "😲", "😷", "😖", "😞", "😟", "😤", "😢", "😭", "😦", "😧", "😨", "😬", "😰", "😱", "😳", "😵", "😡", "😠", "👦", "👧", "👨", "👩", "👴", "👵", "👶", "👱", "👮", "👲", "👳", "👷", "👸", "💂", "🎅", "👰", "👼", "💆", "💇", "🙍", "🙎", "🙅", "🙆", "💁", "🙋", "🙇", "🙌", "🙏", "👤", "👥", "🚶", "🏃", "👯", "💃", "👫", "👬", "👭", "💏", "💑", "👪", "💪", "👈", "👉", "☝", "👆", "👇", "✌", "✋", "👌", "👍", "👎", "✊", "👊", "👋", "👏", "👐", "✍", "👣", "👀", "👂", "👃", "👅", "👄", "💋", "👓", "👔", "👕", "👖", "👗", "👘", "👙", "👚", "👛", "👜", "👝", "🎒", "💼", "👞", "👟", "👠", "👡", "👢", "👑", "👒", "🎩", "🎓", "💄", "💅", "💍", "🌂"],
    keyboardHeight: 400,
    page:1,
    pm_list:[],
    toView:'',
    keyboardPosition:0,
    inputFocus:false,
    chatStyle:"",
    theme: app.globalData.theme,
    statusbar_height: wx.getSystemInfoSync().statusBarHeight,
    is_dark: false,
    temp_msg_list: [],
    show_notification: false,
    notification_type: "default"
  },


  onNotificationAction (){
    this.setData({
      show_notification: false
    })
  },

  bindInput: function (e) {
    this.setData({
      pm_msg: e.detail.value,
    });
  },

  onInputFocus: function (t) {
    this.setData({
      emojiShow:false
    })
    // var e = wx.getSystemInfoSync(),
    //   a = parseInt(750 * t.detail.height / e.windowWidth);
    // if(a>0){
    //   this.setData({
    //     keyboardHeight: t.detail.height
    //   })
    // }
  },

  onInputBlur () {
    this.setData({
      keyboardHeight: 400
    })
  },


  onEmojiText: function (t) {
    var e = t.currentTarget.dataset.index;
    this.data.pm_msg = this.data.pm_msg + this.data.emojiChars[e]
    this.setData({
      pm_msg: this.data.pm_msg
    });
  },

  onEmojiClick: function () {
    this.data.emojiShow ? this.setData({
      emojiShow: !1
    }) : this.setData({
      emojiShow: !0,
      keyboardHeight: this.data.keyboardHeight
    });
  },

  previewImage: function (e) {
    wx.previewImage({
      urls: [e.currentTarget.dataset.image],
    });
  },


  formatTime: function(timestamp){
    var s = new Date(timestamp*1000);
    var today = new Date();
    var day_diff = today.setHours(0,0,0,0) - s.setHours(0,0,0,0)
    var s = new Date(timestamp*1000);
    //same day
    if(day_diff == 0){
      return "今天 " + String(s.getHours()).padStart(2, "0")+":"+String(s.getMinutes()).padStart(2, "0");
    }else if(day_diff == 86400000){
      return "昨天 "+String(s.getHours()).padStart(2, "0")+":"+String(s.getMinutes()).padStart(2, "0");
    }else if(day_diff == 172800000){
      return "前天 "+String(s.getHours()).padStart(2, "0")+":"+String(s.getMinutes()).padStart(2, "0");
    }else{
      return (s.getYear()+1900)+"-"+(s.getMonth()+1)+"-"+s.getDate()+" "+String(s.getHours()).padStart(2, "0")+":"+String(s.getMinutes()).padStart(2, "0");
    }

  },

  getHistoryMessage:function(){
    app.getHistoryMessage()
  },

  setPageData:function(){
    var that = this
    var db = app.initDatabase()
    var pm = db.pm
    var pm_list = pm.where({chat_id:that.data.chat_id}).orderBy('pm_id', 'asc').get()
    for (let i=0; i<pm_list.length; i++){
      pm_list[i].pm_display_date = this.formatTime(pm_list[i].pm_create_time)
    }
    // console.log(pm_list)
    that.setData({
      pm_list:pm_list
    })
    setTimeout(function () {
      that.setData({
        toView: "pm-" + (pm_list.length - 1),
      })
    }, 100)
  },

  // /pm/message/send
  sendMessage: function () {
    app.subscribe(false)
    var that = this
    var pm_msg = that.data.pm_msg
    if (pm_msg.match(/^\s*$/)) {
      wx.showToast({ title: '内容不能为空', icon: 'none', duration: 1000,})
      return
    }
    that.setData({
      inputFocus:false
    })
    that.setData({
      pm_msg:'',
      emojiShow:false
    })
    //立即发送
    // const pm_create_time = Math.floor(Date.now() / 1000)
    // var pm_is_real_name = false
    // var user_alias = ''
    // var user_serial = ''
    // var user_avatar = ''
    // for (let i = 0; i < that.data.pm_list.length; i++) {
    //   if (that.data.pm_list[i].pm_is_from_me) {
    //     pm_is_real_name = that.data.pm_list[i].pm_is_real_name
    //     user_alias = that.data.pm_list[i].user_alias
    //     user_serial = that.data.pm_list[i].user_serial
    //     user_avatar = that.data.pm_list[i].user_avatar
    //     break
    //   }
    // }
    // wx.vibrateShort({
    //   type: 'heavy',
    // })
    // setTimeout(() => {
    //   wx.vibrateShort({
    //     type: 'heavy',
    //   })
    // }, 100);
    // that.setData({
    //   pm_list: [...that.data.pm_list, {
    //     chat_id: that.data.chat_id,
    //     pm_create_time: pm_create_time,
    //     pm_display_date: that.formatTime(pm_create_time),
    //     pm_id: null,
    //     pm_is_from_me: true,
    //     pm_is_real_name: pm_is_real_name,
    //     pm_msg: pm_msg,
    //     pm_media: null,
    //     user_avatar: user_avatar,
    //     user_alias: user_alias,
    //     user_serial: user_serial
    //   }]
    // })
    //立即发送结束
    newRequest("/pm/message/send", {
      chat_id:that.data.chat_id,
      pm_msg:pm_msg,
    }).then(res=>{
      if(res.code == 200){
        if (!wx.getStorageSync('block_notification_notice')) {
          newRequest("/notice/checkaccept", {})
            .then(res => {
              if (res.code == 200) {
                if (!res.notice_accept_service) {
                  console.log("show notification")
                  that.setData({
                    show_notification: true,
                    notification_type: "pm"
                  })
                }
              }
            })
        }
      }else{
        wx.showToast({title: res.msg? res.msg : "错误", icon: "error", duration: 1000})
      }
    })

  },
  sendImage:function(){
    var that =this
    var Bucket = 'boatonland-1307992092';
    var Region = 'ap-beijing';
    var cos = new COS({
      ForcePathStyle: true, // 如果使用了很多存储桶，可以通过打开后缀式，减少配置白名单域名数量，请求时会用地域域名
      getAuthorization: function (options, callback) {
          // 异步获取临时密钥
          wx.request({
              url: 'https://upload.tripleuni.com/index.php',
              data: {
                  bucket: options.Bucket,
                  region: options.Region,
              },
              dataType: 'json',
              success: function (result) {
                  var data = result.data;
                  var credentials = data && data.credentials;
                  if (!data || !credentials) return console.error('credentials invalid');
                  callback({
                      TmpSecretId: credentials.tmpSecretId,
                      TmpSecretKey: credentials.tmpSecretKey,
                      XCosSecurityToken: credentials.sessionToken,
                      // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
                      StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
                      ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000900
                  });
              }
          });
      }
    });
    // 接下来可以通过 cos 实例调用 COS 请求。
    // TODO

    // 选择文件
    wx.chooseMedia({
        count: 1, // 默认9
        mediaType: ['image'], //只允许照片
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认用原图
        sourceType: ['album','camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            wx.showLoading({title: '发送中',})
            console.log(res)
            var filePath = res.tempFiles[0].tempFilePath;
            cos.postObject({
                Bucket: Bucket,
                Region: Region,
                Key: info.school_label + '/pm/' + that.randomString() + that.getExt(filePath),
                FilePath: filePath,
                onProgress: function (info) {
                    console.log(info)
                    console.log(JSON.stringify(info));
                }
            }, function (err, data) {
                console.log(err || data);
                if(data.Location){
                  var location = 'https://i.boatonland.com/'+info.school_label +'/pm/' + data.Location.substr(data.Location.lastIndexOf("/") + 1);
                  newRequest("/pm/message/send", {
                    chat_id:that.data.chat_id,
                    pm_msg:"[Image]",
                    pm_media:JSON.stringify({
                      type:"image",
                      "image_link":location
                    })
                  }).then( res=>{
                    if (res.code != 200){
                      wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
                    }
                  })
                }else{
                  wx.hideLoading()
                  wx.showToast({title: '上传失败' ,icon:'error',})
                }
            });
        }
    });

  },
  randomString:function(e) {
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
      a = t.length,
      n = "";
    for (var i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n;
  },
  getExt:function(filename){
    var idx = filename.lastIndexOf('.');
    return (idx < 1) ? "" : "." + filename.substr(idx + 1);
  },

  longpress:function(e){
    var that = this
    wx.showActionSheet({
      itemList: ['复制', '删除'],
      success (res) {
        if(res.tapIndex == 0){
          wx.setClipboardData({
            data: e.currentTarget.dataset.pmmsg,
          })
        } else if(res.tapIndex == 1){
          app.deletePm(e.currentTarget.dataset.pmid)
          setTimeout(() => {
            that.setPageData()
          }, 1000);
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      chat_id:options.chat_id
    })
    app.globalData.indexJS = this
    app.globalData.chat_id = this.data.chat_id
    this.setPageData()
    var systemInfo = wx.getSystemInfoSync()
    if (systemInfo.theme == 'dark') {
      this.setData({
        is_dark: true,
      })
    }
    if (app.globalData.themeInfo.primaryColorLight) {
      if (systemInfo.theme == 'dark') {
        this.setData({
          chatStyle: "background:" + app.globalData.themeInfo.primaryColorDark + ";"
        })
      } else {
        this.setData({
          chatStyle: "background:" + app.globalData.themeInfo.primaryColorLight + ";"
        })
      }
    }
    wx.onThemeChange((result) => {
      if (result.theme == 'dark'){
        this.setData({
          is_dark: true,
          theme: app.globalData.theme
        })
      }else{
        this.setData({
          is_dark: false ,
          theme: app.globalData.theme
        })
      }
    })

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
    app.globalData.indexJS = this
    app.globalData.chat_id = this.data.chat_id
    this.setData({
      theme: app.globalData.theme,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    app.globalData.chat_id = ''
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.globalData.chat_id = ''
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