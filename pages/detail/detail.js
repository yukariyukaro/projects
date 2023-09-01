var app = getApp();
var COS = require('../../utils/cos-wx-sdk-v5.js')
const info = require("../../utils/info.js")
import { getImageCache } from '../../utils/imageCache.js'
import newRequest from "../../utils/request"


Page({
  data: {
    // scrollViewRefresherStyle: app.globalData.theme.scrollViewRefresherStyle,
    data_received: false,
    pre_url: 'https://i.boatonland.com/avatar/',
    school_label: info.school_label,
    comment_theme_color:'',
    primary_color: info.primary_color_on_light,

    // 举报
    report_type: '', // 'comment' or 'post'
    report_msg: '',
    report_id: '',
    report_index: '',
    report_user_msg: '',

    comment_placeholder: '想对洞主说些什么？',
    uni_post_id: '',
    post_serial: '',
    post_detail: {},
    post_date: '',
    comment_list: [],
    comment_reverse: false,

    ad_info: {},
    show_comment_box:false,
    comment_report_box_animation:'',
    comment_id:'',
    comment_msg: '',
    comment_image:'',
    comment_with_serial: false,
    is_author: false,
    comment_box_placeholder: '想对洞主说些什么?',
    comment_is_sending:false,
    focus:false,
    is_dark:false,
    show_report_box:false,
    my_school_label: info.school_label
  },
  // 下拉刷新
  onRefresh() {
    this.setData({
      triggered: true,
    });
    wx.showLoading({
      title: '加载中',
    })
    this.getPostDetail()
  },

  onRestore() {
    this.setData({
      triggered: false,
    });
    wx.hideLoading()
  },

  visitUser: function () {

    if (this.data.post_detail.user_is_org && this.data.post_detail.user_is_real_name) {
      wx.navigateTo({
        url: "/pages/org/org?user_serial=" + this.data.post_detail.user_serial +"&school_label=" + this.data.post_detail.user_school_label
      })
    } else if (!this.data.post_detail.user_is_real_name) {
      wx.navigateTo({
        url: "/pages/visitProfile/visitProfile?is_anonymous=true&user_serial=NA&comment_order=null&uni_post_id=" + this.data.post_detail.uni_post_id + "&avatar=" + this.data.post_detail.user_avatar + "&school_label=" + this.data.post_detail.user_school_label
      })
    } else {
      wx.navigateTo({
        url: "/pages/visitProfile/visitProfile?&user_serial=" + this.data.post_detail.user_serial + "&uni_post_id=" + this.data.post_detail.uni_post_id + "&school_label=" + this.data.post_detail.user_school_label
      })
    }
  },

  replyComment: function (e) {
    if(e.detail.comment_order == 0){
      var comment_box_placeholder = "Re G:"
    }else{
      var comment_box_placeholder = "Re LG" + e.detail.comment_order + ":"
    }
    if(this.data.post_detail.is_author){
      this.setData({
        comment_msg:'',
        comment_box_placeholder:comment_box_placeholder,
        comment_id:e.detail.comment_id,
        comment_with_serial:true
      })
    }else{
      this.setData({
        comment_msg:'',
        comment_box_placeholder:comment_box_placeholder,
        comment_id:e.detail.comment_id,
        comment_with_serial:false
      })
    }
    this.showCommentReportBox()
  },

  reportPost: function () {
    this.setData({
      report_msg: this.data.post_detail.post_msg,
      report_id: this.data.post_detail.post_id,
      report_type: 'post',
    });
    this.showCommentReportBox()
  },

  reportComment: function (e) {
    const {
      comment_msg,
      comment_index,
      comment_id
    } = e.detail;
    this.setData({
      report_msg: comment_msg,
      report_id: comment_id,
      report_index: comment_index,
      report_type: 'comment',
    });
    this.showCommentReportBox()
  },
  
  reportPromptGetInput: function (e) {
    this.setData({
      report_user_msg: e.detail.value,
    });
  },

  reportPromptConfirm: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    if (that.data.report_type == 'post') {
      var report_msg = "举报了#" + that.data.post_detail.post_id + "「" + that.data.post_detail.post_msg + "」，理由为「" + that.data.report_user_msg + "」"
    }
    if (that.data.report_type == 'comment') {
      var report_msg = "举报了#" + that.data.post_detail.post_id + "的评论LG" + that.data.report_index + "「" + that.data.report_msg + "」，理由为「" + that.data.report_user_msg + "」"
    }

    newRequest("/post/single/report", {uni_post_id: that.data.uni_post_id, report_msg: report_msg}, that.reportPromptConfirm)
    .then(res => {
      that.setData({show_report_box: false})
      if (res.code == 200) {
          wx.showToast({
            title: '举报成功',
            icon: 'none',
            duration: 1000,
          });
        } else {
          wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
        } 
    })
  },


  time: function(){
    var date=new Date();
    var time=date.getTime().toString();
    return parseInt(time.substring(0,time.length-3));
  },

  format_time: function(timestamp){
    var dur = this.time() - timestamp;
    if(dur < 60){
      return '刚刚';
    }else if(dur < 3600){
      return parseInt(dur/60)+'分钟前';
    }else if(dur < 86400){
      return parseInt(dur/3600)+'小时前';
    }else if(dur < 172800){
      var s = new Date(timestamp*1000);
      return "昨天 "+String(s.getHours()).padStart(2, "0")+":"+String(s.getMinutes()).padStart(2, "0");
    }else if(dur < 259200){
      var s = new Date(timestamp*1000);
      return "前天 "+String(s.getHours()).padStart(2, "0")+":"+String(s.getMinutes()).padStart(2, "0");
    }else{
      var s = new Date(timestamp*1000);
      return (s.getYear()+1900)+"-"+(s.getMonth()+1)+"-"+s.getDate()+" "+String(s.getHours()).padStart(2, "0")+":"+String(s.getMinutes()).padStart(2, "0");
    }

  },

// /post/single/get
  getPostDetail: function () {
    var that = this
    newRequest('/post/single/get', {uni_post_id: that.data.uni_post_id, post_id: that.data.post_serial}, that.getPostDetail)
    .then((res) => {
      if (res.code == 200) {
        res.post_detail.post_msg = res.post_detail.post_msg.replaceAll("\\n", "\n")
        for(let i = 0; i<res.comment_list.length ; i++){
          res.comment_list[i].comment_msg = res.comment_list[i].comment_msg.replaceAll("\\n", "\n")
        }
        
        that.setData({
          post_detail: res.post_detail,
          post_date: that.format_time(res.post_detail.post_create_time),
          data_received: true,
          comment_list: res.comment_list,
          triggered: false,
          uni_post_id: res.post_detail.uni_post_id
        })
        if (res.post_detail.is_author) {
          that.setData({
            comment_placeholder: "想在自己的树洞下补充些什么？"
          })
        }
        
      } else if (res.code == 400) {
        wx.navigateBack({
          delta: 1,
          success() {
            wx.showToast({
              title: "它好像不见了>.<",
              icon: "none",
              duration: 1000
            })
          }
        })
      } else {
        wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
      }
    })
  },

  // /info/detailad
  getAd: function () {
    var that = this
    newRequest('/info/detailad', {}, that.getAd)
    .then((res) => {
      if (res.code == 200) {
        getImageCache("detailAd", res.ad_info.ad_image)
        .then( (path) => {
          console.log("detailAd image cache at: ", path)
          res.ad_info.ad_image = path
          that.setData({
            ad_info:res.ad_info
          })
        })
        .catch(() => {
          console.log(res.ad_info)
          that.setData({
            ad_info:res.ad_info
          })
        })
        
      } else {
        wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
      }
    })
  },

  showMainMenu: function () {
    var that = this
    if (that.data.post_detail.is_author) {
      if (that.data.post_detail.post_public == '1') {

          wx.showActionSheet({
            alertText: 'UNI ID: U' + that.data.uni_post_id,
            itemList: ['设为私密', '删除'],
            success(res) {
              if (res.tapIndex == 0) {
                that.setPrivate()
              } else if (res.tapIndex == 1) {
                app.showModal({
                  title: "确认删除？",
                  content: "删除后将无法恢复",
                  success(res) {
                    if (res.confirm) {
                      that.delete()
                    }
                  }
                })
              }
            }
          })
   
      } else if (that.data.post_detail.post_public == '2') {

          wx.showActionSheet({
            alertText: 'UNI ID: U' + that.data.uni_post_id,
            itemList: ['设为公开', '删除'],
            success(res) {
              if (res.tapIndex == 0) {
                that.setPublic()
              } else if (res.tapIndex == 1) {
                app.showModal({
                  title: "确认删除？",
                  content: "删除后将无法恢复",
                  success(res) {
                    if (res.confirm) {
                      that.delete()
                    }
                  }
                })
              }
            }
          })
        
      }
    } else {
      if (that.data.post_detail.is_following) {
    
          wx.showActionSheet({
            alertText: 'UNI ID: U' + that.data.uni_post_id,
            itemList: ['取消围观', '举报'],
            success(res) {
              if (res.tapIndex == 0) {
                that.follow()
              } else if (res.tapIndex == 1) {
                that.reportPost()
              }
            }
          })
        
      } else {
        
          wx.showActionSheet({
            alertText: 'UNI ID: U' + that.data.uni_post_id,
            itemList: ['围观', '举报'],
            success(res) {
              if (res.tapIndex == 0) {
                that.follow()
              } else if (res.tapIndex == 1) {
                that.reportPost()
              }
            }
          })

      }

    }

  },

  // /post/single/follow
  follow: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    var that = this
    newRequest("/post/single/follow", {uni_post_id: that.data.uni_post_id}, that.follow)
    .then( res => {
      if (res.code == 200) {
        that.data.post_detail.is_following = !that.data.post_detail.is_following
        that.data.post_detail.post_follower_num = Number(that.data.post_detail.post_follower_num) + 1
        that.setData({
          post_detail: that.data.post_detail,
        })
        wx.showToast({
          title: '开始围观⭐w⭐',
          icon: 'none',
          duration: 1000,
        });
      } else if (res.code == 201) {
        that.data.post_detail.is_following = !that.data.post_detail.is_following
        that.data.post_detail.post_follower_num = Number(that.data.post_detail.post_follower_num) - 1
        that.setData({
          post_detail: that.data.post_detail,
        })
        wx.showToast({
          title: '停止了围观',
          icon: 'none',
          duration: 1000,
        });
      } else {
        wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
      }
    }
    )
  },

  // /post/single/private
  setPrivate: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    var that = this
    newRequest("/post/single/private", {uni_post_id: that.data.uni_post_id}, that.setPrivate)
    .then( res => {
      if (res.code == 200) {
        that.data.post_detail.post_public = '2'
        that.setData({
          post_detail: that.data.post_detail,
        })
        wx.showToast({
          title: '成功设为私密',
          icon: 'none',
          duration: 1000,
        });
      } else {
        wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
      } 
    }
    )
  },

  // /post/single/public
  setPublic: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    var that = this
    newRequest("/post/single/public", {uni_post_id: that.data.uni_post_id}, that.setPublic)
    .then( res=>{
      if (res.code == 200) {
        that.data.post_detail.post_public = '1'
        that.setData({
          post_detail: that.data.post_detail,
        })
        wx.showToast({
          title: '成功设为公开',
          icon: 'none',
          duration: 1000,
        });
      } else {
        wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
      }
    })

  },

  // /post/single/delete
  delete: function () {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    var that = this
    newRequest("/post/single/delete", {uni_post_id: that.data.uni_post_id}, that.delete)
    .then(res => {
      if (res.code == 200) {
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 1000,
        });
        setTimeout(() => {
          that.getPostDetail()
        }, 1000)
      } else {
        wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
      }
    })
  },

  // /comment/delete
  deleteComment: function (e) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    newRequest("/comment/delete", {
      comment_id: e.detail,
    },that.delete).then( res => {
      if (res.code == 200) {
        wx.showToast({
          title: '删除成功',
          icon: 'none',
          duration: 1000,
        });
        setTimeout(() => {
          that.getPostDetail()
        }, 1000)
      } else {
        wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
      }
    })

  },

  // /post/media/vote/vote
  vote: function (e) {
    var that = this;
    wx.showLoading({
      title: '加载中',
    });
    var that = this
    newRequest("/post/media/vote/vote", {option_id: e.currentTarget.dataset.optionid}, that.vote)
    .then( res => {
      if (res.code == 200) {
        that.getPostDetail()
      } else if (res.code == 201) {
        that.getPostDetail()
      } else {
        wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
      }
    })
  },


  previewPic: function (e) {
    wx.previewImage({
      current: this.data.post_detail.post_image[e.currentTarget.dataset.index],
      urls: this.data.post_detail.post_image,
    });
  },
  goToComment: function () {
    if(this.data.post_detail.is_author){
      this.setData({
        comment_msg:'',
        comment_box_placeholder:'想在自己的树洞下补充些什么？',
        comment_id:'',
        comment_with_serial:true,
      })
    }else{
      this.setData({
        comment_msg:'',
        comment_box_placeholder:'想对洞主说些什么',
        comment_id:'',
        comment_with_serial:false,
      })
    }
    this.showCommentReportBox()
  },
  // 评论倒序
  reverseComments: function () {
    const comment_list = this.data.comment_list.reverse();
    this.setData({
      comment_list: comment_list,
      comment_reverse: !this.data.comment_reverse,
    });
  },
  onTapBilibili: function () {
    wx.navigateToMiniProgram({
      appId: 'wx7564fd5313d24844',
      path: "pages/video/video?bvid=" + this.data.post_detail.post_media.bilibili_bv
    })
  },
  onTapNetease: function () {
    wx.showLoading({
      title: '获取中',
    });
    const backgroundAudioManager = wx.getBackgroundAudioManager();
    backgroundAudioManager.title = this.data.post_detail.post_media.netease_title;
    backgroundAudioManager.epname = this.data.post_detail.post_media.netease_epname;
    backgroundAudioManager.singer = this.data.post_detail.post_media.netease_aritst;
    backgroundAudioManager.coverImgUrl = this.data.post_detail.post_media.netease_image;
    // 设置了 src 之后会自动播放
    backgroundAudioManager.src =
      'http://music.163.com/song/media/outer/url?id=' + this.data.post_detail.post_media.netease_id;
    backgroundAudioManager.onPlay(() => {
      wx.hideLoading();
    });
    backgroundAudioManager.onError(() => {
      wx.hideLoading();
      wx.showToast({
        title: '版权受限',
        icon: 'none',
        duration: 1000,
      });
    })
  },
  onTapQuote: function () {
    if (this.data.post_detail.post_media.uni_post_id == '') {
      wx.showToast({
        title: '该内容不存在或已被删除',
        icon: 'none',
        duration: 1000
      })
      return
    }
    wx.navigateTo({
      url: '/pages/detail/detail?uni_post_id=' + this.data.post_detail.post_media.uni_post_id,
    })
  },
  onTapArticle: function () {
    wx.navigateTo({
      url: '/pages/webview/webview?url=' + this.data.post_detail.post_media.article_link,
    })
  },
  onTapMiniapp: function () {
    wx.navigateToMiniProgram({
      appId: this.data.post_detail.post_media.miniapp_appid,
      path: this.data.post_detail.post_media.miniapp_path,
    })
  },

  onTapHKUGroup: function () {
    wx.navigateToMiniProgram({
      appId: "wxa5de39979ae7affa",
      path: "/pages/group/group?group_id=" + this.data.post_detail.post_media.group_id,
    })
  },

  onTapFile:  function () {
    wx.showLoading()
    wx.downloadFile({
      // 示例 url，并非真实存在
      url: this.data.post_detail.post_media.file_link,
      success: function (res) {
        wx.hideLoading()
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          showMenu: true,
          success: function () {
            console.log('打开文档成功')
          },
          fail: function(){
            console.log('打开文档失败')
            wx.showToast({
              title: '无法打开文件',
              icon: 'error'
            })
          }
        })
      },
      fail: function(res){
        console.log('打开文档失败')
        console.log(res)
        wx.showToast({
          title: '无法打开文件',
          icon: 'error'
        })
      }
    })
  },

  onTapAd:function(){
    var ad_info = this.data.ad_info
    switch (ad_info.ad_type) {
      case 'article':
        wx.navigateTo({
          url: '/pages/webview/webview?url=' + ad_info.article_link,
        });
        break;
      case 'post':
          wx.navigateTo({
            url: '/pages/detail/detail?post_id=' + ad_info.post_id,
          });
          break;
      case 'inner':
        wx.navigateTo({ url: ad_info.inner_path });
        break;
      case 'miniapp': 
        wx.navigateToMiniProgram({
          appId: ad_info.miniapp_appid,
          path: ad_info.miniapp_path,
        })
        break;
      case 'none':
      default:
        break;
    }
  },

  showCommentReportBox:function(){
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
    animation.translateY(400).step()
    if(that.data.report_type!=""){
      that.setData({
        comment_report_box_animation: animation.export(),
        overlay_animation: overlay_animation.export(),
        show_report_box: true
      })
    }else{
      that.setData({
        comment_report_box_animation: animation.export(),
        overlay_animation: overlay_animation.export(),
        show_comment_box: true
      })
    }
  
    setTimeout(function(){
      animation.translateY(0).step()
      overlay_animation.opacity(1).step()
      that.setData({
        comment_report_box_animation: animation.export(),
        overlay_animation: overlay_animation.export(),
      })
    },1)

    setTimeout(function(){
      that.setData({
        focus:true
      })
    },800)
  },
  hideCommentReportBox:function(){
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
    animation.translateY(400).step()
    overlay_animation.opacity(0).step()
    that.setData({
      comment_report_box_animation: animation.export(),
      overlay_animation: overlay_animation.export(),
    })
    setTimeout(function(){
      animation.translateY(0).step()
      that.setData({
        show_report_box:false,
        show_comment_box:false,
        report_type: "",
        focus:false,
        comment_msg:'',
        comment_image:'',
        comment_box_placeholder:'想对洞主说些什么',
        comment_id:'',
        comment_with_serial:false
      })
    },500)
  },
  bindCommentMsgInput: function (e) {
    var regex = /\/\/HKUPootal:picture/

    if(regex.test(e.detail.value)){
      this.uploadImage()
      e.detail.value = e.detail.value.replace(regex, '')
    }
    this.setData({
      comment_msg: e.detail.value,
    });
  },
  // 选择是否带编号
  switchSerialChange: function (e) {
    this.setData({ comment_with_serial: e.detail.value });
  },

  // /comment/post
  submitComment: function () {
    var that = this
    if(that.data.comment_is_sending){
      return
    }
    wx.showLoading({
      title: '发送中',
    })
    that.setData({
      comment_is_sending:true
    })
    newRequest("/comment/post", {
      comment_msg:that.data.comment_msg,
      uni_post_id:that.data.post_detail.uni_post_id,
      user_is_real_name:that.data.comment_with_serial,
      comment_image:that.data.comment_image,
      comment_father_id: that.data.comment_id
    }, that.submitComment).then( res=>{
      that.setData({
        comment_is_sending:false
      })
      if(res.code == 200){
        
        that.hideCommentReportBox()
        that.getPostDetail()
        wx.showToast({title: "发布成功", icon: "none", duration: 1000})
        
      }else{
        wx.showToast({title: res.msg? res.msg : "错误", icon: "none", duration: 1000})
      }
    })


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
    // wx.chooseImage({
    //     count: 1, // 默认9
    //     sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认用原图
    //     sourceType: ['album','camera'], // 可以指定来源是相册还是相机，默认二者都有
    //     success: function (res) {
    //         wx.showLoading({title: '上传中',})
    //         console.log(res)
    //         var filePath = res.tempFiles[0].path;
    //         cos.postObject({
    //             Bucket: Bucket,
    //             Region: Region,
    //             Key: 'pupu/post/' + that.randomString() + that.getExt(filePath),
    //             FilePath: filePath,
    //             onProgress: function (info) {
    //                 console.log(info)
    //                 console.log(JSON.stringify(info));
    //             }
    //         }, function (err, data) {
    //             console.log(err || data);
    //             if(data.Location){
    //               var location = 'https://i.boatonland.com/pupu/post/' + data.Location.substr(data.Location.lastIndexOf("/") + 1);
    //               wx.showLoading({
    //                 title: '安全检测中',
    //               })
    //               setTimeout(function () {
    //                 wx.hideLoading()
    //                 wx.showToast({title: '上传成功' ,icon:'success',})
    //                 that.setData({
    //                   comment_image: location,
    //                 })
    //                }, 1000) 
    //             }else{
    //               wx.hideLoading()
    //               wx.showToast({title: '上传失败' ,icon:'error',})
    //             }
    //         });
    //     }
    // });

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
            that.previewCommentPic();
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
      comment_image: '',
    });
  },
  previewCommentPic: function () {
    wx.previewImage({
      urls: [this.data.comment_image],
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.getAd()
    console.log(options)
    if (options.post_serial) {
      this.setData({
        post_serial: options.post_serial
      })
    } else if (options.post_id){
      this.setData({
        post_serial: options.post_id
      })
    } else {
      this.setData({
        uni_post_id: options.uni_post_id
      });
    }
    var systemInfo = wx.getSystemInfoSync()
    if (app.globalData.themeInfo.primaryColorLight) {
      if (systemInfo.theme == 'dark') {
        this.setData({
          tintStyle: "background:" + app.globalData.themeInfo.primaryColorDark + ";",
          primary_color: info.primary_color_on_dark
        })
      } else {
        this.setData({
          tintStyle: "background:" + app.globalData.themeInfo.primaryColorLight + ";",
          primary_color: info.primary_color_on_light
        })
      }
    }

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.reportPrompt = this.selectComponent('#reportPrompt')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getPostDetail();
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
    let msg = this.data.post_detail.post_msg
    if (msg.length > 20) {
      msg = msg.slice(0, 20) + '...';
    }
    console.log(msg)
    return {
      path: `/pages/home/home?jump_page=detail&uni_post_id=${this.data.post_detail.uni_post_id}`,
      title: info.app_name + '用户: ' + msg,
    };
  },
});