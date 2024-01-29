var themes = require('./theme');
var info = require('./utils/info')

const localDB = require('utils/database.js')
const _ = localDB.command
import newRequest from "./utils/request"
import decode_token from "./utils/jwt-decode"

App({
  onLaunch() {

    // wx.setBackgroundFetchToken({
    //   token: 
    // })

    if (!wx.getStorageSync('allNoticeCount')) {
      wx.setStorageSync('allNoticeCount', 0)
    }
    if (!wx.getStorageSync('systemNoticeCount')) {
      wx.setStorageSync('systemNoticeCount', 0)
    }
    if (!wx.getStorageSync('ban_uni_post')) {
      wx.setStorageSync('ban_uni_post', false)
    }
    if (!wx.getStorageSync('allow_home_swipe')) {
      wx.setStorageSync('allow_home_swipe', false)
    }
    if (!wx.getStorageSync('oneLatestId')) {
      wx.setStorageSync('oneLatestId', 0)
    }
    if (!wx.getStorageSync('showOneRedDot')) {
      wx.setStorageSync('showOneRedDot', false)
    }
    if (!wx.getStorageSync('user_school_label')) {
      wx.setStorageSync('user_school_label', 'UNI')
    }
    if (!wx.getStorageSync('block_splash')) {
      wx.setStorageSync('block_splash', false)
    }


    this.launch()
      .then(() => {
        this.globalData.token_checked = true
        this.checkTerms()
      })
  },

  onShow: function () {
    // console.log(this.globalData)
    // if (this.globalData.loggedin){
    //   this.launchWebSoccket()
    //   this.checkUnread()
    // }

    // this.getOneLatest()
  },

  onHide: function () {
    this.globalData.redirectToRegister = false
    wx.closeSocket()
  },

  checkTerms: function () {
    let that = this
    newRequest('/user/terms/check', {}, that.checkTerms)
      .then((res) => {
        if (res.code == 201) {
          this.globalData.show_privacy = true
          this.globalData.privacy_checked = true
          var pages = getCurrentPages()
          var currentPage = pages[pages.length - 1]
          var url = currentPage.route
          if (url != "pages/home/home") {
            wx.reLaunch({
              url: '/pages/home/home',
              success() {
                wx.showToast({
                  title: '需先同意用户协议与隐私条款',
                  icon: "none",
                  duration: 1000
                })
              }
            })
          }
        } else if (res.code == 200) {
          this.globalData.show_privacy = false
          this.globalData.privacy_checked = true
        } else {
          wx.showToast({
            title: res.msg ? res.msg : "错误",
            icon: "none",
            duration: 1000
          })
        }
      })
  },

  onThemeChange: function ({
    theme
  }) {
    this.globalData.theme = themes[theme];
    this.globalData.colorScheme = theme;
    this.updateTheme()
    var tabbarJS = this.globalData.tabbarJS
    if (tabbarJS) {
      tabbarJS.getTabBar().updateTheme()
    }
  },

  //数据监听器 https://juejin.cn/post/7304537109850898483
  watch: function (key, method) {
    var obj = this.globalData;
    //加个前缀生成隐藏变量，防止死循环发生
    let ori = obj[key]; //obj[key]这个不能放在Object.defineProperty里
    if (ori) { //处理已经声明的变量，绑定处理
      method(ori);
    }
    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this['_' + key] = value;
        console.log('是否会被执行2')
        method(value);
      },
      get: function () {
        // 在其他界面调用key值的时候，这里就会执行。
        if (typeof this['_' + key] == 'undefined') {
          if (ori) {
            //这里读取数据的时候隐藏变量和 globalData设置不一样，所以要做同步处理
            this['_' + key] = ori;
            return ori;
          } else {
            return undefined;
          }
        } else {
          return this['_' + key];
        }
      }
    })
  },


  globalData: {
    // URL: 'https://service-74x06cvh-1301435395.sh.apigw.tencentcs.com/release/prod_hku',
    app_name: info.app_name,
    app_title: info.app_title,
    school_label: info.school_label,
    email_suffixes: info.email_suffixes,
    userInfo: null,
    tem_comment: '',
    tem_comment_with_serial: true,
    tem_comment_post: '',
    sp_src: '',
    showDisclaimerModal: false,
    redirectToRegister: false,
    theme: themes[wx.getSystemInfoSync().theme],
    colorScheme: wx.getSystemInfoSync().theme,
    indexJS: '',
    wsConnect: false,
    chat_id: '',
    db_version: '4',
    gettingChatList: [],
    tabbarJS: '',
    auth_key: '',
    from_miniapp: '',
    themeInfo: '',
    token_checked: false,
    show_privacy: false,
    privacy_checked: false,
    initial_launch: wx.getStorageSync('block_splash') ? false : true,
    close_socket: false,
  },

  subscribe: function (mode) {
    var that = this
    return new Promise(function (resolve, reject) {
      var tmplIds = ['rzlxxKpaBxAreM0aOGEG72pmWkhKL288hE10mfdseJo', 'gdUXklCC0B5W4vSFuEYp1CZ-ny6YoXFt35zrjRBtycY', 'V-WN788I-oJTlyLrVfSz4PA9O2n4L7WdgHaX0onp-hU']
      wx.getSetting({
        withSubscriptions: true,
        success(res) {
          // console.log(res.subscriptionsSetting)
          if (!res.subscriptionsSetting.mainSwitch) {
            // console.log('main button已经关闭')
            if (mode) {
              that.showModal({
                title: '未开启订阅消息权限',
                content: '你未开启订阅消息权限，可能无法接收通知，请到设置页面开启。',
                success(res2) {
                  if (res2.confirm) {
                    // console.log('跳转设置成功')
                    wx.openSetting({
                      withSubscriptions: true,
                    })
                  }
                }
              })
              resolve(false)
            } else {
              // console.log('非必要，取消弹窗请求')
            }
          } else {
            new Promise(function (resolve, reject) {
              var valid_count = 0
              for (let i = 0; i < tmplIds.length; i++) {
                // console.log(i)
                var subid = tmplIds[i]
                if (res.subscriptionsSetting[subid] == 'accept') {
                  // console.log(tmplIds[i],'接受')
                  var valid_count = valid_count + 4
                } else if (res.subscriptionsSetting[subid] == 'reject') {
                  // console.log(tmplIds[i],'拒绝')
                  var valid_count = valid_count + 1
                } else {
                  // console.log(tmplIds[i],'未知')
                }
                if (i == tmplIds.length - 1) {
                  // console.log('结果',valid_count)
                  resolve(valid_count)
                }
              }
            }).then(function (valid_count) {
              if (valid_count == 12) {
                // console.log('all accept')
                wx.requestSubscribeMessage({
                  tmplIds: tmplIds,
                  complete(res2) {
                    // console.log(res2)
                    // console.log('静默请求成功')
                    resolve(true)
                  }
                })
              } else if (Math.round(valid_count % 4) != 0) {
                // console.log('some reject')
                if (mode) {
                  that.showModal({
                    title: '未开启订阅消息权限',
                    content: '你未开启订阅消息权限，可能无法接收通知，请到设置页面开启。',
                    success(res2) {
                      if (res2.confirm) {
                        // console.log('跳转设置成功')
                        wx.openSetting({
                          withSubscriptions: true,
                        })
                      }
                    }
                  })
                  resolve(false)
                } else {
                  // console.log('非必要，取消弹窗请求')
                }

              } else {
                // console.log('have undifined')
                if (mode) {
                  wx.requestSubscribeMessage({
                    tmplIds: tmplIds,
                    complete(res2) {
                      // console.log(res2)
                      // console.log('弹窗请求成功')
                      resolve(true)
                    }
                  })
                } else {
                  // console.log('非必要，取消弹窗请求')
                }
              }
            })
          }
        }
      })

    })
  },

  // 记录截屏开始
  // /user/record/capturescreen
  watchCaptureScreen: function () {
    var that = this;
    wx.onUserCaptureScreen(function (res) {
      // console.log(res)
      var pages = getCurrentPages()
      var currentPage = pages[pages.length - 1]
      var url = currentPage.route
      var options = currentPage.options
      var urlWithArgs = url + '?'
      for (var key in options) {
        var value = options[key]
        urlWithArgs += key + '=' + value + '&'
      }
      urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
      newRequest('/user/record/capturescreen', {
          url: urlWithArgs
        }, that.watchCaptureScreen)
        .then((res) => {
          if (res.code == 200) {
            console.log("Screen Capture Recorded")
          } else {
            console.log("Screen Capture Error: ", res)
          }
        })
    })
  },
  // 记录截屏结束

  // 包装微信自带界面
  /**
   * @param {WechatMiniprogram.ShowModalOption} options
   * @returns {WechatMiniprogram.PromisifySuccessResult<WechatMiniprogram.ShowModalOption,WechatMiniprogram.ShowModalOption>}
   */

  showModal(options) {
    return wx.showModal({
      confirmColor: this.globalData.theme.primary,
      ...options,
    });
  },

  launch() {
    let that = this
    return new Promise(function (resolve, reject) {
      var token = wx.getStorageSync('token')
      // wx.showLoading({})
      if (token) {
        // user already logged in
        console.log("has token")
        // 带token进入 无label
        let stored_label = wx.getStorageSync('user_school_label')
        let token_label = decode_token(token).user_school_label
        if (stored_label == 'UNI' || stored_label != token_label) {
          wx.reLaunch({
            url: '/pages/enterTripleUni/enterTripleUni',
          })
        }
        // 检查token
        newRequest("/user/check/wechat", {}).then((res) => {
          if (res.code != 200) {
            reject()
          } else {
            that.launchWebSoccket()
            that.watchCaptureScreen()
            that.checkUnread()
            // let stored_label = wx.getStorageSync('user_school_label')
            // let token_label = decode_token(token).user_school_label
            // if (stored_label == 'UNI' || stored_label != token_label) {
            //   wx.reLaunch({
            //     url: '/pages/enterTripleUni/enterTripleUni',
            //   })

              // that.login().then( () => {
              //   resolve()
              // })

              // let pages = getCurrentPages()
              // let current_page = pages[pages.length - 1].route
              // wx.setStorageSync('user_school_label', token_label)
              // wx.setStorageSync('block_splash', true)
              // wx.restartMiniProgram({
              //   path: '/' + current_page
              // })
            // }
            if (wx.getStorageSync('block_splash')) {
              wx.setStorageSync('block_splash', false)
            }
            resolve()
          }
        })
      } else {
        console.log("no token")
        that.login()
        .then(() => {
          resolve()
        })
        .catch(() => {
          reject()
        })
      }
    })
  },

  login: function () {
    // user not logged in
    let that = this
    return new Promise(function (resolve, reject) {
      wx.login({
        success(res) {
          console.log(res)
          if (res.code) {
            // 请求开发者服务器
            newRequest('/user/login/wechatuni', {
                code: res.code,
                system_info: JSON.stringify(wx.getSystemInfoSync())
              }, this.login, false, false)
              .then((res2) => {
                if (res2.code == 200) {
                  //保存登陆状态
                  wx.setStorageSync('token', res2.token)
                  if (res2.user_school_label != wx.getStorageSync('user_school_label')) {
                    wx.setStorageSync('user_school_label', res2.user_school_label)
                    wx.setStorageSync('block_splash', true)
                    wx.restartMiniProgram({
                      path: '/pages/home/home'
                    })
                  }
                  // if (wx.getStorageSync('block_splash')) {
                  //   wx.setStorageSync('block_splash', false)
                  // }
                  that.launchWebSoccket()
                  that.checkUnread()
                  that.watchCaptureScreen()
                  resolve()
                } else if (res2.code == 201) {
                  let query_str = JSON.stringify(res2.account_list)
                  wx.reLaunch({
                    url: '/pages/chooseAccount/chooseAccount?account_list=' + query_str
                  })
                } else if (res2.code == 401) {
                  //未注册，跳转注册页
                  var pages = getCurrentPages()
                  var currentPage = pages[pages.length - 1]
                  var url = currentPage.route
                  if (url != "pages/register/register") {
                    wx.reLaunch({
                      url: '/pages/register/register',
                      success() {
                        wx.showToast({
                          title: '请先注册',
                          icon: "none",
                          duration: 1000
                        })
                      }
                    })
                  }
                } else {
                  wx.showToast({
                    title: res.msg ? res.msg : "错误",
                    icon: "none",
                    duration: 1000
                  })
                }
                reject()
              })

          } else {
            wx.showToast({
              title: '登录失败，请稍后再试',
              icon: "none",
              duration: 1000
            })
            // wx.hideLoading()
            reject()
          }

        },

        fail(res) {
          console.log(res)
          let pages = getCurrentPages()
          let currentPage = pages[pages.length - 1]
          let url = currentPage.route
          if (url != "pages/register/register") {
            wx.reLaunch({
              url: '/pages/register/register',
              success() {
                wx.showToast({
                  title: '请先注册',
                  icon: "none",
                  duration: 1000
                })
              }
            })
          }
          reject()
        },
      })
    })
  },

  checkUnread: function () {
    newRequest("/notice/checkunread", {}, this.checkUnread)
      .then(res => {
        if (res.code == 200) {
          // console.log(wx.getStorageSync('systemNoticeCount'))
          if (wx.getStorageSync('systemNoticeCount') != res.notice_count) {
            var newAllNoticeCount = wx.getStorageSync('allNoticeCount') - wx.getStorageSync('systemNoticeCount') + res.notice_count
            wx.setStorageSync('systemNoticeCount', res.notice_count)
            wx.setStorageSync('allNoticeCount', newAllNoticeCount)
          }
          this.updateTabbar()
          if (wx.getStorageSync('allNoticeCount') == 0) {
            var {
              chat
            } = this.initDatabase()
            var unread_chat = chat.where({
              chat_unread_count: _.gt(0)
            }).get()
            // console.log(unread_chat)
            unread_chat.forEach(achat => {
              achat.chat_unread_count = 0
              chat.where({
                chat_id: achat.chat_id
              }).update(achat)
            })
          } else {

          }
        } else {
          wx.showToast({
            title: '请先注册',
            icon: "none",
            duration: 1000
          })
        }
      })
  },


  // getOneLatest: function () {
  //   var that = this
  //   // console.log(5)
  //   newRequest()
  //   wx.request({
  //     url: 'https://api.pupu.hkupootal.com/v3/one/getlatest.php', 
  //     method: 'POST',
  //     data: {
  //       token:wx.getStorageSync('token')
  //     },
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     success (res) {
  //       if(res.data.code == 200){
  //         console.log(6)
  //         if(res.data.one_latest_id > wx.getStorageSync('oneLatestId')){
  //           wx.setStorageSync('oneLatestId', res.data.one_latest_id)
  //           wx.setStorageSync('showOneRedDot', true)
  //           that.updateTabbar()
  //         }
  //       }else if(res.data.code == 800 ||res.data.code == 900){
  //         that.launch().then(res=>{
  //           that.getOneLatest()
  //         })
  //       }else{
  //         wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
  //       }
  //     }
  //   })
  // },

  //新消息推送
  initDatabase: function () {
    // console.log('初始化数据库')
    var that = this
    // if(wx.getStorageSync('db_version') != this.globalData.db_version){
    //   that.clearDB()
    //   console.log("更新版本，清空数据库")
    //   wx.setStorageSync('db_version', this.globalData.db_version)
    // }
    localDB.init()
    var chat = localDB.collection('chat')
    if (!chat) {
      // console.log("不存在chat")
      chat = localDB.createCollection('chat')
    }
    var pm = localDB.collection('pm')
    if (!pm) {
      // console.log("不存在pm")
      pm = localDB.createCollection('pm')
    }
    pm.where({
      _timeout: _.lt(Date.now())
    }).remove()
    chat.where({
      _timeout: _.lt(Date.now())
    }).remove()
    that.clearStorage(chat, pm, 1)
    return {
      chat,
      pm
    }
  },

  deletePm: function (pmId) {
    var that = this
    var pm = localDB.collection('pm')
    var pm_chat_id = pm.where({
      pm_id: pmId
    }).limit(1).get()[0].chat_id
    // console.log(pm_chat_id)
    var latest_two_msg_in_chat = pm.where({
      chat_id: pm_chat_id
    }).orderBy('pm_id', 'desc').limit(2).get()
    // console.log(latest_two_msg_in_chat)
    if (latest_two_msg_in_chat[0].pm_id == pmId) {
      var new_chat_detail = localDB.collection('chat').where({
        chat_id: pm_chat_id
      }).limit(1).get()[0]
      if (latest_two_msg_in_chat[1]) {
        new_chat_detail.chat_update_date = that.formatTime(latest_two_msg_in_chat[1].pm_create_time)
        new_chat_detail.chat_latest_msg = latest_two_msg_in_chat[1].pm_msg
        new_chat_detail.chat_latest_pm_id = latest_two_msg_in_chat[1].pm_id
      } else {
        new_chat_detail.chat_update_date = ""
        new_chat_detail.chat_latest_msg = ""
        new_chat_detail.chat_latest_pm_id = ""
      }
      localDB.collection('chat').where({
        chat_id: pm_chat_id
      }).update(new_chat_detail)
      that.updateData()
    }
    pm.where({
      pm_id: pmId
    }).remove()
    newRequest("/pm/message/delete", {
      pm_id: pmId
    }).then(res => {
      if (res.code == 200) {

      } else {
        wx.showToast({
          title: '私信删除失败',
          icon: "error",
          duration: 1000
        })
      }
    })

  },

  deleteChat: function (chatId, unreadCount) {
    var pm = localDB.collection('pm')
    var chat = localDB.collection('chat')
    chat.where({
      chat_id: chatId
    }).remove()
    pm.where({
      chat_id: chatId
    }).remove()
    this.updateData()
    newRequest("/pm/chat/ban", {
      chat_id: chatId
    }).then(res => {
      if (res.code == 200) {
        wx.setStorageSync('allNoticeCount', wx.getStorageSync('allNoticeCount') - unreadCount)
        this.updateTabbar()

      } else {
        wx.showToast({
          title: '删除失败',
          icon: "error",
          duration: 1000
        })
      }
    })
  },

  clearStorage: function (chat, pm, i) {
    var that = this
    // console.log("开始清理存储")
    // console.log("尝试清理"+i+"天")
    if (that.getBytesLength(JSON.stringify(wx.getStorageSync('localDB'))) > 900000) {
      // console.log("容量要超了，提前清除")
      pm.where({
        _timeout: _.lt(Date.now() + i * 24 * 3600000)
      }).remove()
      chat.where({
        _timeout: _.lt(Date.now() + i * 24 * 3600000)
      }).remove()
      setTimeout(() => {
        that.clearStorage(chat, pm, i + 1)
      }, 100);
    } else {
      // console.log("不需要清理")
    }
  },

  // /pm/message/history
  getHistoryMessage: function () {
    var that = this
    return new Promise(function (resolve, reject) {
      var db = that.initDatabase()
      var pm = db.pm
      var latset_pm_id_list = pm.orderBy('pm_id', 'desc').limit(1).get()
      // console.log(latset_pm_id_list)
      if (!latset_pm_id_list[0]) {
        var latset_pm_id = 0
      } else {
        var latset_pm_id = latset_pm_id_list[0].pm_id
      }
      // console.log("latset_pm_id为"+latset_pm_id)
      newRequest("/pm/message/history", {
        pm_id: latset_pm_id
      }).then(res => {
        // console.log(res)
        if (res.code == 200) {
          var pm_list = res.pm_list
          // console.log(pm_list)
          pm_list.forEach(item => {
            that.addMessageToDb(item)
          })
          resolve()
        } else {
          reject()
        }
      })

    })
  },

  formatTime: function (timestamp) {
    var s = new Date(timestamp * 1000);
    return (s.getYear() + 1900) + "-" + String(s.getMonth() + 1).padStart(2, "0") + "-" + String(s.getDate()).padStart(2, "0") + " " + String(s.getHours()).padStart(2, "0") + ":" + String(s.getMinutes()).padStart(2, "0");

  },

  addMessageToDb: function (item) {
    // console.log(item)
    var that = this
    var db = that.initDatabase()
    var chat = db.chat
    var pm = db.pm
    var pm_list = pm.where({
      pm_id: item.pm_id
    }).limit(1).get()
    if (pm_list[0]) {
      return
    }
    item._timeout = Date.now() + 30 * 24 * 3600000
    pm.add(item)
    var chat_list = chat.where({
      chat_id: item.chat_id
    }).limit(1).get()
    // console.log(chat_list)
    if (!chat_list[0]) {
      that.addChatToDb(item)
    } else {
      var newChatDetail = chat_list[0]
      newChatDetail.chat_latest_msg = item.pm_msg
      newChatDetail.chat_update_date = that.formatTime(item.pm_create_time)
      newChatDetail.chat_latest_pm_id = item.pm_id
      if (!item.pm_is_from_me && that.globalData.chat_id != item.chat_id) {
        newChatDetail.chat_unread_count += 1
        wx.setStorageSync('allNoticeCount', wx.getStorageSync('allNoticeCount') + 1)
        that.updateTabbar()
      }
      chat.where({
        chat_id: item.chat_id
      }).update(newChatDetail)
      that.updateData()
    }
  },

  // /pm/chat/get
  addChatToDb: function (item) {
    console.log(item)
    var that = this
    if (that.globalData.gettingChatList.includes(item.chat_id)) {
      // console.log("已经在获取"+item.chat_id)
      return
    }
    that.globalData.gettingChatList.push(item.chat_id)
    newRequest("/pm/chat/get", {
      chat_id: item.chat_id
    }).then(res => {
      if (res.code == 200) {
        var chat_detail = res.chat_detail
        chat_detail.chat_latest_msg = item.pm_msg
        chat_detail.chat_update_date = that.formatTime(item.pm_create_time)
        chat_detail.chat_latest_pm_id = item.pm_id
        if (item.pm_is_from_me) {
          chat_detail.chat_unread_count = 0
        } else {
          chat_detail.chat_unread_count = 1
          wx.setStorageSync('allNoticeCount', wx.getStorageSync('allNoticeCount') + 1)
          that.updateTabbar()
        }
        var db = that.initDatabase()
        var chat = db.chat
        var chat_list = chat.where({
          chat_id: item.chat_id
        }).limit(1).get()
        // console.log(chat_list)
        if (!chat_list[0]) {
          chat_detail._timeout = Date.now() + 30 * 24 * 3600000
          chat.add(chat_detail)
          that.updateData()
        }
        // that.globalData.gettingChatList.delete(item.chat_id)
      }
    })

  },

  updateData: function () {
    var that = this
    // console.log("调用")
    if (that.globalData.indexJS != '') {
      that.globalData.indexJS.setPageData()
      // console.log("调用成功")
    } else {
      // console.log("调用失败")
    }
  },

  webSocketConnect: function () {
    console.log('开始链接')
    var that = this
    var websocket = wx.connectSocket({
      url: info.socket,
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res)
      },
    })

    websocket.onOpen(function () {
      console.log('WebSocket已连接')
      that.globalData.wsConnect = true
      var message = {
        type: 'bind',
        token: wx.getStorageSync('token')
      }
      websocket.send({
        data: JSON.stringify(message)
      })
    })

    websocket.onMessage(function (res) {
      that.messageHandler(res.data)
    })

    websocket.onError(function (res) {
      that.globalData.wsConnect = false
      console.log('出现问题')
      console.log(res)
    })

    websocket.onClose(function () {
      that.globalData.wsConnect = false
      console.log('WebSocket 已关闭！')
    })

    // wx.onSocketOpen(function() {
    //   console.log('WebSocket已连接')
    //   that.globalData.wsConnect = true
    //   var message = {
    //     type:'bind',
    //     token:wx.getStorageSync('token')
    //   }
    //   wx.sendSocketMessage({
    //     data:JSON.stringify(message)
    //   })
    // })

    // wx.onSocketMessage(function(res) {
    //   that.messageHandler(res.data)
    // })

    // wx.onSocketClose(function() {
    //   that.globalData.wsConnect = false
    //   console.log('WebSocket 已关闭！')
    // })

    // wx.onSocketError(function(res) {
    //   that.globalData.wsConnect = false
    //   console.log('出现问题')
    //   console.log(res)
    // })
  },

  messageHandler: function (data) {
    var that = this
    // console.log(data)
    data = JSON.parse(data)
    switch (data.type) {
      case "bind":
        if (data.bind_result) {
          // console.log("uid绑定成功")
        } else {
          // console.log("uid绑定失败")
          wx.closeSocket()
          setTimeout(() => {
            // console.log("重新连接")
            that.webSocketConnect()
          }, 5000)
        }
        break
      case "message":
        var content = data.content
        // console.log(content)
        that.addMessageToDb(content)
        wx.vibrateShort({
          type: 'heavy',
        })
        setTimeout(() => {
          wx.vibrateShort({
            type: 'heavy',
          })
        }, 100);
        break
      case "notice":
        console.log(data.content)
        wx.setStorageSync('allNoticeCount', wx.getStorageSync('allNoticeCount') + 1)
        wx.setStorageSync('systemNoticeCount', wx.getStorageSync('systemNoticeCount') + 1)
        that.updateTabbar()
        wx.vibrateShort({
          type: 'heavy',
        })
        setTimeout(() => {
          wx.vibrateShort({
            type: 'heavy',
          })
        }, 100);
        break
    }
  },

  launchWebSoccket: function () {
    var that = this
    if (!that.globalData.wsConnect) {
      console.log("先获取历史消息")
      that.getHistoryMessage().then(() => {
        console.log("然后链接")
        that.webSocketConnect()
      }).catch(() => {
        that.launchWebSoccket()
      })
    } else {
      var message = {
        type: 'ping',
      }
      wx.sendSocketMessage({
        data: JSON.stringify(message)
      })
    }
    if (!that.globalData.close_socket) {
      setTimeout(() => {
        console.log("每10秒检测一次")
        that.launchWebSoccket()
      }, 10000);
    }
  },

  updateTabbar: function () {
    var tabbarJS = this.globalData.tabbarJS
    if (tabbarJS != '') {
      tabbarJS.getTabBar().setData({
        allNoticeCount: wx.getStorageSync('allNoticeCount'),
        showOneRedDot: wx.getStorageSync('showOneRedDot')
      })
    }
  },
  getBytesLength: function (string) {
    var totalLength = 0
    var charCode = 0
    for (var i = 0; i < string.length; i++) {
      charCode = string.charCodeAt(i)
      if (charCode < 0x007f) {
        totalLength++
      } else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {
        totalLength += 2
      } else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {
        totalLength += 3
      } else {
        totalLength += 4
      }
    }
    return totalLength
  },
  clearDB: function () {
    var that = this
    var db = that.initDatabase()
    db.chat.remove()
    db.pm.remove()
  },


  // getTheme:function(){
  //   var that = this
  //   wx.request({
  //     url: 'https://api.pupu.hkupootal.com/v3/info/theme.php', 
  //     method: 'POST',
  //     data: {
  //       token:wx.getStorageSync('token'),
  //     },
  //     header: {
  //       'content-type': 'application/x-www-form-urlencoded'
  //     },
  //     success (res) {
  //       if(res.data.code == 200){
  //         that.globalData.themeInfo = []
  //         that.updateTheme(true)
  //       }else if(res.data.code == 201){
  //         that.globalData.themeInfo = res.data.themeInfo
  //         that.updateTheme(true)
  //       }
  //     }
  //   })
  // },

  updateTheme: function (withAnimation) {
    var that = this
    var systemInfo = wx.getSystemInfoSync()
    var pages = getCurrentPages()
    var currentPage = pages[pages.length - 1]
    var url = currentPage.route
    if (url != "pages/webview/webview") {
      if (that.globalData.themeInfo.navigationBarColorLight) {
        if (systemInfo.theme == 'dark') {
          if (withAnimation) {
            wx.setNavigationBarColor({
              frontColor: that.globalData.themeInfo.navigationBarFontColorDark,
              backgroundColor: that.globalData.themeInfo.navigationBarColorDark,
              animation: {
                duration: 1000,
                timingFunc: 'easeInOut'
              }
            })
          } else {
            wx.setNavigationBarColor({
              frontColor: that.globalData.themeInfo.navigationBarFontColorDark,
              backgroundColor: that.globalData.themeInfo.navigationBarColorDark
            })
          }
        } else {
          if (withAnimation) {
            wx.setNavigationBarColor({
              frontColor: that.globalData.themeInfo.navigationBarFontColorLight,
              backgroundColor: that.globalData.themeInfo.navigationBarColorLight,
              animation: {
                duration: 1000,
                timingFunc: 'easeInOut'
              }
            })
          } else {
            wx.setNavigationBarColor({
              frontColor: that.globalData.themeInfo.navigationBarFontColorLight,
              backgroundColor: that.globalData.themeInfo.navigationBarColorLight
            })
          }
        }
      }
    }
    if (url == "pages/home/home" || url == "pages/one/one" || url == "pages/pmlist/pmlist" || url == "pages/mine/mine") {
      if (that.globalData.themeInfo.tabbarFontSelectedColorLight) {
        if (systemInfo.theme == 'dark') {
          // wx.setTabBarStyle({
          //   color: that.globalData.themeInfo.tabbarFontColorDark,
          //   selectedColor: that.globalData.themeInfo.tabbarFontSelectedColorDark
          // })
        } else {
          // wx.setTabBarStyle({
          //   color: that.globalData.themeInfo.tabbarFontColorLight,
          //   selectedColor: that.globalData.themeInfo.tabbarFontSelectedColorLight
          // })
        }
      }
      if (that.globalData.themeInfo.tabbarItem) {
        that.globalData.themeInfo.tabbarItem.forEach(item => {
          wx.setTabBarItem({
            index: item.index,
            text: item.text,
            iconPath: item.iconPath,
            selectedIconPath: item.selectedIconPath
          })
        })
      }
    }
  },

});

const page = Page
Page = function (pageData) {
  _handleInstanceMethod(pageData, 'onShow', function (e) {
    var app = getApp()
    app.updateTheme(false)
  })
  page(pageData)
}
const _handleInstanceMethod = function (instanceData, name, callback) {
  if (instanceData[name]) {
    const e = instanceData[name]
    instanceData[name] = function (arg) {
      callback.call(this, arg)
      e.call(this, arg)
    }
  } else {
    instanceData[name] = function (arg) {
      callback.call(this, arg)
    }
  }
}