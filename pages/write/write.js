var app = getApp();
var COS = require('../../utils/cos-wx-sdk-v5.js')
Page({
  data: {
    remnantLen: 750,
    post_msg: '',
    post_public: true,
    post_with_serial: false,
    post_is_uni: false,
    topicList: [],
    topicIndex: -1,
    isSending: false,
    focus: false,
    post_image: '',
    primaryColor: app.globalData.theme.primary,
    post_with_media:false,
    post_media_received:false,
    post_media:[],
    mediaList:["网易云","Bilibili","投票","引用"],
    mediaIndex:-1,
    bilibili_bv:'',
    netease_link:'',
    vote_content:'',
    vote_is_multi:false,
    isGettingMedia:false,
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
  switchUNIChange: function (e) {
    this.setData({ post_is_uni: e.detail.value });
  },
  switchMultiChange: function (e) {
    this.setData({ vote_is_multi: e.detail.value });
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
    if(that.data.mediaIndex == 3){
      if (that.data.quote_post_id.match(/^\s*$/)) {
        wx.showToast({ title: '树洞编号不得为空', icon: 'none', duration: 1000,});
        this.setData({ isSending: false });
        return
      }
      if(that.data.quote_comment_order == ''){
        var post_media = {
          media_type:'quote',
          post_id:that.data.quote_post_id,
          comment_order:null,
        }
      }else{
        var post_media = {
          media_type:'quote',
          post_id:that.data.quote_post_id,
          comment_order:that.data.quote_comment_order,
        }
      }
      that.setData({
        post_media: post_media,
        post_media_received:true
      });
    }
    if(that.data.post_media.media_type == 'miniapp'){
      that.setData({
        post_with_media:true,
        post_media_received:true
      })
    }
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

      if(that.data.post_with_media && that.data.post_media_received){
        var post_media = JSON.stringify(that.data.post_media)
      }else{
        var post_media = ''
      }
      wx.request({
        url: 'https://api.pupu.hkupootal.com/v3/post/single/post.php', 
        method: 'POST',
        data: {
          token:wx.getStorageSync('token'),
          post_msg:post_msg,
          post_topic:post_topic,
          post_with_alias:post_with_serial,
          post_public:post_public,
          post_image:that.data.post_image,
          post_media:post_media,
          post_is_uni:that.data.post_is_uni,
          vote_is_multi:that.data.vote_is_multi
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
                wx.reLaunch({url: '/pages/mine/mine',}),
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
            wx.showLoading({title: '上传中'})
            console.log(res)
            var filePath = res.tempFiles[0].path;
            cos.postObject({
                Bucket: Bucket,
                Region: Region,
                Key: that.randomString() + that.getExt(filePath),
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
  getExt:function(filename){
    var idx = filename.lastIndexOf('.');
    return (idx < 1) ? "" : "." + filename.substr(idx + 1);
  },
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
  withMedia: function () {
    this.setData({
      post_with_media: true,
    });
  },
  bindMediaInput:function(e){
    if(this.data.mediaIndex == 0){
      this.setData({
        netease_link:e.detail.value
      })
    }else if(this.data.mediaIndex == 1){
      this.setData({
        bilibili_bv:e.detail.value
      })
    }else if(this.data.mediaIndex == 2){
      this.setData({
        vote_content:e.detail.value
      })
    }
  },
  bindQuotePostIdInput:function(e){
    this.setData({
      quote_post_id:e.detail.value
    })
  },
  bindQuoteCommentOrderInput:function(e){
    this.setData({
      quote_comment_order:e.detail.value
    })
  },
  bindSelectMedia: function (e) {
    this.setData({
      mediaIndex: e.detail.value,
      post_media:[],
      netease_id:'',
      bilibili_bv:'',
      quote_post_id:'',
      quote_comment_order:'',
      post_media_received:false,
      vote_is_multi:false
    })
  },
  removeMedia:function(){
    this.setData({
      mediaIndex: -1,
      post_media:[],
      netease_id:'',
      bilibili_bv:'',
      post_with_media:false,
      post_media_received:false,
      vote_is_multi:false,
      quote_post_id:'',
      quote_comment_order:''
    })
  },
  getMedia:function(){
    if(this.data.mediaIndex == 0){
      this.getNeteaseDetail()
    }else if(this.data.mediaIndex == 1){
      this.getBilibiliDetail()
    }
  },
  getNeteaseDetail:function(){
    var that = this
    wx.showLoading({
      title: '获取中',
    })
    that.setData({
      isGettingMedia:true
    })
    wx.cloud.init();
    wx.cloud.callFunction({
      name: 'searchMusic',
      data: {
        body: {
          inputTxt: that.data.netease_link,
        },
      },
      success: (res) => {
        wx.hideLoading()
        that.setData({
          isGettingMedia:false
        })
        const result = res.result;
        console.log(result);
        if (result.error != 'false') {
          wx.showToast({ title: '获取失败', icon: 'none', duration: 1000,})
        } else {
          var post_media = {
            media_type:'netease',
            netease_id:result.data.musicId,
            netease_title:result.data.title,
            netease_artist:result.data.player,
            netease_image:result.data.cover,
            netease_epname:result.data.epname
          }
          that.setData({
            post_media: post_media,
            post_media_received:true
          });
        }
      },
      fail: (err) => {
        wx.hideLoading()
        that.setData({
          isGettingMedia:false
        })
        wx.showToast({ title: '获取失败', icon: 'none', duration: 1000,})
      },
    });
  },
  getBilibiliDetail:function(){
    var that = this
    wx.showLoading({
      title: '获取中',
    })
    that.setData({
      isGettingMedia:true
    })
    wx.cloud.init();
    wx.cloud.callFunction({
      name: 'searchBilibili',
      data: {
        body: {
          inputTxt: that.data.bilibili_bv,
        },
      },
      success: (res) => {
        wx.hideLoading()
        that.setData({
          isGettingMedia:false
        })
        const result = res.result;
        console.log(result);
        if (result.error != 'false') {
          wx.showToast({ title: '获取失败', icon: 'none', duration: 1000,})
        } else {
          var post_media = {
            media_type:'bilibili',
            bilibili_bv:result.data.epname,
            bilibili_title:result.data.title,
            bilibili_image:result.data.cover,
            bilibili_author:result.data.player
          }
          that.setData({
            post_media: post_media,
            post_media_received:true
          });
        }
      },
      fail: (err) => {
        wx.hideLoading()
        that.setData({
          isGettingMedia:false
        })
        wx.showToast({ title: '获取失败', icon: 'none', duration: 1000,})
      },
    });
  },
  setVote:function(){
    var that = this
    if (that.data.vote_content.match(/^\s*$/)) {
      wx.showToast({ title: '内容不得为空', icon: 'error', duration: 1000,});
      return
    }
    if(that.data.post_media.media_type == 'vote'){
      var newOptionList = [{
        option_title:that.data.vote_content
      }]
      var post_media = {
        media_type:'vote',
        vote_title:that.data.post_media.vote_title,
        optionList:that.data.post_media.optionList.concat(newOptionList)
      }
      that.setData({
        post_media: post_media,
        post_media_received:true,
        vote_content:''
      })
    }else{
      var post_media = {
        media_type:'vote',
        vote_title:that.data.vote_content,
        optionList:[]
      }
      that.setData({
        post_media: post_media,
        post_media_received:true,
        vote_content:''
      })
    }
  },
  removeOption:function(e){
    var that = this
    app.showModal({
      title:"提示",
      content:"确定移除选项？",
      success(res){
        if(res.confirm){
          console.log(e.currentTarget.dataset.index)
          var newOptionList = that.data.post_media.optionList
          newOptionList.splice(e.currentTarget.dataset.index,1)
          var post_media = {
            media_type:'vote',
            vote_title:that.data.post_media.vote_title,
            optionList:newOptionList
          }
          console.log(post_media)
          that.setData({
            post_media: post_media,
            post_media_received:true,
            vote_content:''
          })
        }
      }
    })
  },
  getPostTopic: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/info/posttopic.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        if(res.data.code == 200){
          that.setData({
            topicList:res.data.topicList
          })
        }else if(res.data.code == 800 ||res.data.code == 900){
          app.launch().then(res=>{
            that.getPostTopic()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.setNavigationBarTitle({
      title: '发布树洞',
    });
    wx.enableAlertBeforeUnload({
      message: '返回后草稿内容将不会被保存，确认返回？',
    })
    that.getPostTopic()
    if(options.post_media){
      var post_media = decodeURIComponent(options.post_media)
      post_media = JSON.parse(post_media)
      that.setData({
        post_media:post_media,
      })
    }
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
