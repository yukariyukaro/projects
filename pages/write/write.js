var app = getApp();
const AV = require('../../libs/av-core-min.js');
var COS = require('../../utils/cos-wx-sdk-v5.js')
Page({
  data: {
    remnantLen: 750,
    post_msg: '',
    post_public: true,
    post_with_serial: false,
    topicList: [],
    topicIndex: -1,
    isSending: false,
    focus: false,
    post_image: '',
    primaryColor: app.globalData.theme.primary,
  },
  // 让输入框聚焦
  focus: function () {
    this.setData({ focus: true });
  },
  // 绑定内容输入
  bindContent: function (e) {
    const len = e.detail.value.length;
    const content_tem = e.detail.value;
    this.setData({
      remnantLen: 750 - len,
    });
    this.data.post_msg = content_tem;
  },
  // 选择是否公开发表
  switchPublicChange: function (e) {
    this.setData({ post_public: e.detail.value });
  },
  // 选择是否带编号
  switchSerialChange: function (e) {
    this.setData({ post_with_serial: e.detail.value });
  },
  // 选择主题
  bindTopic: function (e) {
    this.setData({
      topicIndex: e.detail.value,
    });
  },

  // 提交
  submitNewPost: function () {
    var that = this
    const post_msg = this.data.post_msg;
    const topicIndex = this.data.topicIndex;
    if (this.data.isSending) return;
    this.setData({
      isSending:true
    })
    if (post_msg.match(/^\s*$/)) {
      wx.showToast({ title: '内容不得为空', icon: 'error', duration: 1000,});
      this.setData({ isSending: false });
    } else if (topicIndex == -1) {
      wx.showToast({ title: '话题不得为空', icon: 'error', duration: 1000,});
      this.setData({ isSending: false });
    } else {
      wx.showLoading({
        title: '提交中',
      });
      const post_topic = this.data.topicList[topicIndex];
      const post_public = this.data.post_public ? 1 : 2;
      const post_with_serial = this.data.post_with_serial;
      wx.request({
        url: 'https://pupu.boatonland.com/v1/post/post.php', 
        method: 'POST',
        data: {
          token:wx.getStorageSync('token'),
          post_msg:post_msg,
          post_topic:post_topic,
          post_with_alias:post_with_serial,
          post_public:post_public,
          post_image:that.data.post_image,
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
            if(post_public == 1){
              wx.showToast({ title: '#'+res.data.post_id+'公开树洞诞生了⭐', icon: 'none', duration: 1000,});
              setTimeout(() =>
                wx.reLaunch({url: '/pages/home/home',}),
              1000);
            }
            if(post_public == 2){
              wx.showToast({ title: '#'+res.data.post_id+'私有树洞诞生了⭐', icon: 'none', duration: 1000,});
              setTimeout(() =>
                wx.reLaunch({url: '/pages/profile/profile',}),
              1000);
            }
          }else if(res.data.code == 800 ||res.data.code == 900){
            app.launch().then(res=>{
              that.submitNewPost()
            })
          }else{
            wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
          }
        }
      })
    }
  },
  


  uploadImage:function(){
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
            wx.showLoading({title: '上传中',})
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
                  wx.showLoading({
                    title: '安全检测中',
                  })
                  setTimeout(function () {
                    wx.hideLoading()
                    wx.showToast({title: '上传成功' ,icon:'success',})
                    that.setData({
                      post_image: location,
                    })
                   }, 1000) 
                }else{
                  wx.hideLoading()
                  wx.showToast({title: '上传失败' ,icon:'error',})
                }
            });
        }
    });

  },
  // 点击图片后，可以删除/查看
  picTap: function () {
    var that = this;
    wx.showActionSheet({
      itemList: ['删除', '查看'],
      success(res) {
        const index = res.tapIndex;
        switch (index) {
          case 0:
            that.deletePic();
            break;
          case 1:
            that.previewPic();
            break;
        }
      },
      fail(res) {
        console.log(res.errMsg);
      },
    });
  },
  deletePic: function () {
    this.setData({
      post_image: '',
    });
  },
  previewPic: function () {
    wx.previewImage({
      urls: [this.data.post_image],
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '发布树洞',
    });
    const eventChannel = this.getOpenerEventChannel();
    eventChannel.on('acceptTopics', function (topicList) {
      that.setData({
        topicList:topicList
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

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
  onShareAppMessage: function () {
    return {
      title: 'HKU噗噗 你不孤单',
      imageUrl: '/images/cover.png',
    };
  },
});
