var app = getApp();
var COS = require('../../utils/cos-wx-sdk-v5.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    amount: 100,
    file_url: '',
    allow_download: false
  },

  amountInput: function (e) {
    this.setData({
      amount: parseInt(e.detail.value * 100),
    });
  },

  requestPay: function () {
    var that = this
    wx.showLoading({
      title: '请求中',
    })
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/buy/order/create.php',
      method: 'POST',
      data: {
        token: wx.getStorageSync('token'),
        payment_amount: that.data.amount
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.callPayment(res.data.timeStamp, res.data.nonceStr, res.data.package, res.data.paySign)
        } else if (res.data.code == 800 || res.data.code == 900) {
          app.launch().then(res => {
            that.requestPay()
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

  callPayment: function (timeStamp, nonceStr, packageWx, paySign) {
    wx.requestPayment({
      nonceStr: nonceStr,
      package: packageWx,
      paySign: paySign,
      signType: "RSA",
      timeStamp: timeStamp.toString(),
      success(res) {
        console.log(res)
        wx.showToast({
          title: "支付成功",
          icon: "success",
          duration: 2000
        })
      },
      fail(res) {
        console.log(res)
        wx.showToast({
          title: "支付失败",
          icon: "error",
          duration: 2000
        })
      },
    })
  },

  changeAllowDownload:function(e){
    this.setData({allow_download:e.detail.value})
  },

  showFile: function () {
    var that = this
    if (!this.data.file_url) {
      return
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.downloadFile({
      url: this.data.file_url,
      success: function (res) {
        wx.hideLoading()
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          showMenu: that.data.allow_download
        })
      },
    })
  },

  chooseFile: function () {
    var that = this
    wx.showActionSheet({
      alertText: "选择文档的来源",
      itemList: ['微信聊天记录', '系统文件管理'],
      success(res) {
        if (res.tapIndex == 0) {
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
          wx.chooseMessageFile({
            count: 1,
            type: "file",
            extension: ['doc','docx','ppt','pptx','xls','xlsx','pdf'],
            success: function (res) {
              wx.showLoading({
                title: '上传中',
              })
              console.log(res)
              var filePath = res.tempFiles[0].path;
              cos.postObject({
                Bucket: Bucket,
                Region: Region,
                Key: that.randomString() + that.getExt(filePath),
                StorageClass: "STANDARD",
                FilePath: filePath,
                onProgress: function (info) {
                  console.log(info)
                  console.log(JSON.stringify(info));
                }
              }, function (err, data) {
                console.log(err || data);
                if (data.Location) {
                  var location = 'https://i.boatonland.com/' + data.Location.substr(data.Location.lastIndexOf("/") + 1);
                  wx.hideLoading()
                  wx.showToast({
                    title: '上传成功',
                    icon: 'success',
                  })
                  that.setData({
                    file_url: location,
                  })
                } else {
                  wx.hideLoading()
                  wx.showToast({
                    title: '上传失败',
                    icon: 'error',
                  })
                }
              });
            }
          })
        } else if (res.tapIndex == 1) {
          wx.navigateTo({
            url: '/pages/upload/upload'
          })
        }
      }
    })
  },
  randomString(e) {
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