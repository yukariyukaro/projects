var app = getApp();
var COS = require('../../utils/cos-wx-sdk-v5.js');
const info = require('../../utils/info.js');
const { default: newRequest } = require('../../utils/request.js');


Page({
  data: {
    is_dark:false,
    remain_len: 750,
    post_msg: '',
    post_public: true,
    post_with_serial: false,
    post_is_uni: false,
    post_is_markdown: false,
    topic_list: [],
    topic_index: -1,
    is_sending: false,
    focus: false,
    post_image: [],
    primary_color: app.globalData.theme.primary,
    post_with_media:false,
    post_media_received:false,
    post_media:[],
    media_list:["网易云","Bilibili","投票","引用"],
    media_index:-1,
    bilibili_bv:'',
    netease_link:'',
    vote_title:'',
    vote_option_list:[{}],
    vote_is_multi:false,
    isGettingMedia:false,
    user_id_name: info.user_id_name,
    showPrivacy: false,
    // emotion_selected_index:-1,
    // post_with_emotion:false,
    // post_media_emotion:{}
    school_label: info.school_label,
    statusbar_height: wx.getSystemInfoSync().statusBarHeight,
    theme: app.globalData.theme,
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
      remain_len: 750 - len,
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
  switchMarkdownChange: function (e) {
    var that = this
    if (e.detail.value && this.data.post_with_media){
     wx.showModal({
      title: '开启富文本编辑提示',
      content: '使用富文本编辑时将无法使用百宝箱中的功能！',
      complete: (res) => {
        if (res.cancel) {
          that.setData({ post_is_markdown: false });
        }
        if (res.confirm) {
          that.removeMedia();
          that.setData({ 
            post_is_markdown: e.detail.value,
          });
        }
      }
    })} else {
      that.setData({ post_is_markdown: e.detail.value });
    }
  },
  // 选择主题
  bindTopic: function (e) {
    this.setData({
      topic_index: e.detail.value,
    });
  },
  back() {
    wx.navigateBack()
  },

  getQuote: function (){
    return new Promise( (resolve,reject) => {
      var that = this
      if (!that.data.comment_order){
        var comment_order = "null"
      }else{
        var comment_order = that.data.comment_order
      }
      newRequest("/post/media/quote/create", {
        post_id: that.data.quote_post_id,
        comment_order: comment_order
      }).then(res => {
        if(res.code == 200){
          console.log(res.post_media)
          resolve(res.post_media)
        }else{
          wx.showToast({
            title: "树洞引用失败",
            icon: "none",
            duration: 1000
          })

        }
      })
    })
  },

  // 提交
  submitNewPost: async function () {
    var that = this
    let post_msg = this.data.post_msg;
    const topic_index = this.data.topic_index;
    if (this.data.is_sending) return;
    this.setData({
      is_sending:true
    })

    if(that.data.media_index == 3){
      if (that.data.quote_post_id.match(/^\s*$/)) {
        wx.showToast({ title: '树洞编号不得为空', icon: 'none', duration: 1000,});
        this.setData({ is_sending: false });
        return
      }
      
    }

    if(that.data.post_media.media_type == 'miniapp'){
      that.setData({
        post_with_media:true,
        post_media_received:true
      })
    }

    if (post_msg.match(/^\s*$/)) {
      wx.showToast({ title: '内容不得为空', icon: 'error', duration: 1000,});
      this.setData({ is_sending: false });
    } else if (topic_index == -1) {
      wx.showToast({ title: '话题不得为空', icon: 'error', duration: 1000,});
      this.setData({ is_sending: false });
    } else {
      wx.showLoading({
        title: '提交中',
      });



      const post_topic = this.data.topic_list[topic_index];
      const post_public = this.data.post_public ? 1 : 2;
      const post_with_serial = this.data.post_with_serial;

      if(that.data.post_with_media && that.data.post_media_received){
        var post_media = JSON.stringify(that.data.post_media)
      }else if (that.data.media_index == 3){
        var post_media = JSON.stringify(await this.getQuote())
      }else{
        var post_media = ''
      }

      if (that.data.post_is_markdown){
        post_msg = "[Triple Uni Markdown]\n" + post_msg
      }

      newRequest("/post/single/post", {
        post_msg:post_msg,
        post_topic:post_topic,
        user_is_real_name:post_with_serial,
        post_public:post_public,
        post_image:JSON.stringify(that.data.post_image),
        post_is_uni:that.data.post_is_uni,
        post_media:post_media,
      
      }, that.submitNewPost).then(res => {
        if(res.code == 200){
          if(post_public == 1){
            wx.showToast({ title: '新的公开树洞诞生了⭐', icon: 'none', duration: 1000,});
            setTimeout(() =>
              wx.reLaunch({url: '/pages/home/home',}),
            1000);
          }
          if(post_public == 2){
            wx.showToast({ title: '新的私有树洞诞生了⭐', icon: 'none', duration: 1000,});
            setTimeout(() =>
              wx.reLaunch({url: '/pages/mine/mine',}),
            1000);
          }
        }else{
          wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
        }
      })

    }
  },

  tapUploadImage:function(){
    // this.setData({
    //   showPrivacy: true
    // })
    this.uploadImage()
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
  
    wx.chooseMedia({
        count: 5, // 默认9
        mediaType: ['image'],
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认用原图
        sourceType: ['album','camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
            wx.showLoading({title: '上传中'})
            console.log(res)
            res.tempFiles.forEach((tempfile, i) => {
              var filePath = tempfile.tempFilePath;
              cos.postObject({
                Bucket: Bucket,
                Region: Region,
                Key: info.school_label + '/post/' + that.randomString() + that.getExt(filePath),
                FilePath: filePath,
                onProgress: function (info) {
                    console.log(info)
                    console.log(JSON.stringify(info));
                }
            }, function (err, data) {

                console.log(err || data);
                if(data.Location){
                  var location = 'https://i.boatonland.com/'+ info.school_label +'/post/' + data.Location.substr(data.Location.lastIndexOf("/") + 1);
                  // wx.showLoading({
                  //   title: '安全检测中',
                  // })
                  
                  setTimeout(function () {
                    if (i == res.tempFiles.length-1){
                      wx.hideLoading()
                      wx.showToast({title: '照片上传成功' ,icon:'success',})
                    }
                    var newimg = that.data.post_image
                    newimg.push(location)
                    console.log(newimg)
                    that.setData({
                      post_image: newimg,
                    })
                   }, 1000) 
                }else{
                  wx.hideLoading()
                  wx.showToast({title: '照片'+String(i+1)+'上传失败' ,icon:'error',})
                }
            });
            })
        }
    });

  },

  getExt:function(filename){
    var idx = filename.lastIndexOf('.');
    return (idx < 1) ? "" : "." + filename.substr(idx + 1);
  },

  picTap: function (e) {
    var that = this;
    wx.showActionSheet({
      itemList: ['删除', '查看'],
      success(res) {
        const index = res.tapIndex;
        switch (index) {
          case 0:
            console.log(e.currentTarget.dataset.index)
            that.deletePic(e.currentTarget.dataset.index);
            break;
          case 1:
            that.previewPic(e.currentTarget.dataset.index);
            break;
        }
      },
      fail(res) {
        console.log(res.errMsg);
      },
    });
  },

  deletePic: function (n) {
    var new_post_image = this.data.post_image
    new_post_image.splice(n,1)
    this.setData({
      post_image: new_post_image,
    });
  },

  previewPic: function (n) {
    wx.previewImage({
      current: this.data.post_image[n],
      urls: this.data.post_image,
    });
  },

  withMedia: function () {
    this.setData({
      post_with_media: !this.data.post_with_media,
    });
  },

  bindMediaInput:function(e){

    if(this.data.media_index == 0){
      this.setData({
        netease_link:e.detail.value
      })
    }else if(this.data.media_index == 1){
      this.setData({
        bilibili_bv:e.detail.value
      })
    }else if(this.data.media_index == 2){
      this.setData({
        vote_title:e.detail.value
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
      media_index: e.detail.value,
      post_media:[],
      netease_id:'',
      bilibili_bv:'',
      quote_post_id:'',
      quote_comment_order:'',
      post_media_received:false,
      vote_is_multi:false
    })
  },

  bindVoteOption: function (e) {
    // console.log(e.currentTarget.dataset.index)
    var new_option_list = this.data.vote_option_list
    new_option_list[e.currentTarget.dataset.index].option_title = e.detail.value
    this.setData({
      vote_option_list: new_option_list
    })
  },

  removeMedia:function(){
    this.setData({
      media_index: -1,
      post_media:[],
      netease_id:'',
      bilibili_bv:'',
      post_with_media:false,
      post_media_received:false,
      vote_is_multi:false,
      quote_post_id:'',
      quote_comment_order:'',
      vote_title: '',
      vote_option_list:[]
    })
  },

  getMedia:function(){
    if(this.data.media_index == 0){
      this.getNeteaseDetail()
    }else if(this.data.media_index == 1){
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

    newRequest("/post/media/netease/create", {
      netease_link: that.data.netease_link,
    })
    .then(res => {
      that.setData({
        isGettingMedia:false
      })
      if (res.code == 200){
        that.setData({
          post_media: res.post_media,
          post_media_received: true
        });
      } else {
        wx.showToast({ title: '获取失败', icon: 'none', duration: 1000,})
      }
    })
  },

  getBilibiliDetail:function(){
    var that = this
    wx.showLoading({
      title: '获取中',
    })
    that.setData({
      isGettingMedia:true
    })

    newRequest("/post/media/bilibili/create", {
      bilibili_bv: that.data.bilibili_bv,
    })
    .then(res => {
      that.setData({
        isGettingMedia:false
      })
      if (res.code == 200){
        that.setData({
          post_media: res.post_media,
          post_media_received: true
        });
      } else {
        wx.showToast({ title: '获取失败', icon: 'none', duration: 1000,})
      }
    })
  },

  setVote:function(){
    var that = this
    if (that.data.vote_title.match(/^\s*$/)) {
      wx.showToast({ title: '主题不得为空', icon: 'error', duration: 1000,});
      return
    }
    if (that.data.vote_option_list.length == 0) {
      wx.showToast({ title: '需要一个选项', icon: 'error', duration: 1000,});
      return
    }
    for (let option of that.data.vote_option_list) {
      if (option.option_title.match(/^\s*$/)) {
        wx.showToast({ title: '选项不得为空', icon: 'error', duration: 1000,});
        return
      }
    }
    that.setData({
      isGettingMedia:true
    })
    newRequest("/post/media/vote/create", {
      vote_is_multi: that.data.vote_is_multi,
      vote_title: that.data.vote_title,
      vote_option_list: JSON.stringify(that.data.vote_option_list)
    }).then( res => {
      that.setData({
        isGettingMedia: false
      })
      if (res.code == 200){
        that.setData({
          post_media: res.post_media,
          post_media_received: true
        });
      } else {
        wx.showToast({ title: '投票创建失败', icon: 'none', duration: 1000,})
      }
    })
  },

  removeOption:function(e){
    var that = this
    app.showModal({
      title:"提示",
      content:"确定移除选项？",
      success(res){
        if(res.confirm){
          console.log(e.currentTarget.dataset.index)
          var new_option_list = that.data.vote_option_list
          new_option_list.splice(e.currentTarget.dataset.index,1)
          that.setData({
            vote_option_list: new_option_list
          })
        }
      }
    })
  },

  addOption: function (e) {
    var new_option_list = [{
      option_title:""
    }]
    this.setData({
      vote_option_list: this.data.vote_option_list.concat(new_option_list)
    })
  },

  getPostTopic: function () {
    var that = this
    newRequest("/info/posttopic", {}, that.getPostTopic)
    .then(res => {
      if(res.code == 200){
        that.setData({
          topic_list:res.topic_list
        })
      }else{
        wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
      }
    }
    )
  },
  randomString:function(e) {
    e = e || 32;
    var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
      a = t.length,
      n = "";
    for (var i = 0; i < e; i++) n += t.charAt(Math.floor(Math.random() * a));
    return n;
  },

  privacyOverlayTap:function(e){
    this.setData({
      showPrivacy: false
    })
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
    var systemInfo = wx.getSystemInfoSync()
    if(systemInfo.theme == 'dark'){
      that.setData({
        is_dark:true
      })
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


    // 需要用户同意隐私授权时
    // wx.onNeedPrivacyAuthorization((resolve, eventInfo) => {
    //   console.log('触发本次事件的接口是：' + eventInfo.referrer)
    //   // 需要用户同意隐私授权时
    //   // 弹出开发者自定义的隐私授权弹窗
    //   this.setData({
    //     showPrivacy: true
    //   })
     
    //   // this.resolvePrivacyAuthorization = resolve
    // })

//     wx.requirePrivacyAuthorize({
//       success: () => {
//         console.log("用户同意授权")
//         // this.setData({
//         //   showPrivacy: true
//         // })
//       },
//       fail: () => {console.log("用户拒绝授权")}, // 用户拒绝授权
//       complete: () => {}
//     })
//   },

//   onPrivacyAgree(e){
//     console.log(e)
//     console.log("privacy agreeed")
//     this.setData({
//       showPrivacy: false
//     })
//     this.uploadImage()
//   },

//   onPrivacyDisagree(e){
//     console.log("privacy disagreeed")
//     this.setData({
//       showPrivacy: false
//     })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      theme: app.globalData.theme,
    })
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
      title: info.slogan,
      imageUrl: '/images/cover.jpg',
    };
  },
});
