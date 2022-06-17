var app = getApp()
var COS = require('../../utils/cos-wx-sdk-v5.js')
const localDB = require('../../utils/database.js')
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
    pmList:[],
    toView:'',
    keyboardPosition:0,
    inputFocus:false,
    chatStyle:""
  },

  bindInput: function (e) {
    this.setData({
      pm_msg: e.detail.value,
    });
  },

  onInputFocus: function (t) {
    var e = wx.getSystemInfoSync(),
      a = parseInt(750 * t.detail.height / e.windowWidth);
    if(a>0){
      this.setData({
        keyboardHeight:a
      })
    }
    this.setData({
      emojiShow:false
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

  getHistoryMessage:function(){
    app.getHistoryMessage()
  },

  setPageData:function(){
    var that = this
    var db = app.initDatabase()
    var pm = db.pm
    var pmList = pm.where({chat_id:that.data.chat_id}).orderBy('pm_id', 'asc').get()
    that.setData({
      pmList:pmList
    })
    setTimeout(function () {
      that.setData({
        toView: "pm-" + (pmList.length - 1),
      })
    }, 100)
  },

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
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/pmnew/message/send.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        chat_id:that.data.chat_id,
        pm_msg:pm_msg,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        if(res.data.code == 200){

        }else if(res.data.code == 800 ||res.data.code == 900){

        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
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
              url: 'https://image.boatonland.com/index.php',
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
    wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认用原图
        sourceType: ['album','camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            wx.showLoading({title: '发送中',})
            console.log(res)
            var filePath = res.tempFiles[0].path;
            var filename = filePath.substr(filePath.lastIndexOf('/') + 1);
            cos.postObject({
                Bucket: Bucket,
                Region: Region,
                Key: filename,
                FilePath: filePath,
                onProgress: function (info) {
                    console.log(info)
                    console.log(JSON.stringify(info));
                }
            }, function (err, data) {
                console.log(err || data);
                if(data.Location){
                  var location = 'https://i.boatonland.com/' + data.Location.substr(data.Location.lastIndexOf("/") + 1);
                  wx.request({
                    url: 'https://api.pupu.hkupootal.com/v3/pmnew/message/send.php', 
                    method: 'POST',
                    data: {
                      token:wx.getStorageSync('token'),
                      chat_id:that.data.chat_id,
                      pm_msg:"[Image]",
                      pm_media:JSON.stringify({
                        type:"image",
                        "image_link":location
                      })
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success (res) {
                      wx.hideLoading()
                      if(res.data.code == 200){
              
                      }else if(res.data.code == 800 ||res.data.code == 900){
              
                      }else{
                        wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
                      }
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

  longpress:function(e){
    wx.showActionSheet({
      itemList: ['复制'],
      success (res) {
        if(res.tapIndex == 0){
          wx.setClipboardData({
            data: e.currentTarget.dataset.pmmsg,
          })
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