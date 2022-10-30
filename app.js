const Mutex = require('async-mutex').Mutex;
const mutex = new Mutex();
// 获取 AV 命名空间的方式根据不同的安装方式而异，这里假设是通过手动导入文件的方式安装的 SDK
const AV = require('./libs/av-core-min.js');
const adapters = require('./libs/leancloud-adapters-weapp.js');
const themes = require('./theme');
const localDB = require('utils/database.js')
const _ = localDB.command

AV.setAdapters(adapters);
AV.init({
  appId: 'tjIhHKbi6UO6zQpYezL6OmfI-9Nh9j0Va',
  appKey: 'IHIuPgFAEEDHAbFLhoYOOTt8',
  // 请将 xxx.example.com 替换为你的应用绑定的自定义 API 域名
  serverURLs: 'https://api.12345toolapi.xyz',
});
App({
  onLaunch(){
    var that = this
    this.launch()
    this.watchCaptureScreen()
    this.getTheme()
    if(!wx.getStorageSync('allNoticeCount')){
      wx.setStorageSync('allNoticeCount', 0)
    }
    if(!wx.getStorageSync('systemNoticeCount')){
      wx.setStorageSync('systemNoticeCount', 0)
    }
    if(!wx.getStorageSync('banUniPost')){
      wx.setStorageSync('banUniPost', false)
    }
    if(!wx.getStorageSync('allowHomeSwipe')){
      wx.setStorageSync('allowHomeSwipe', false)
    }
    if(!wx.getStorageSync('oneLatestId')){
      wx.setStorageSync('oneLatestId', 0)
    }
    if(!wx.getStorageSync('showOneRedDot')){
      wx.setStorageSync('showOneRedDot', false)
    }
  },
  onShow:function(){
    this.launchWebSoccket()
    this.getOneLatest()
  },
  onHide: function () {
    this.globalData.redirectToRegister = false
    wx.closeSocket()
  },
  onThemeChange: function ({ theme }) {
    this.globalData.theme = themes[theme];
    this.globalData.colorScheme = theme;
    this.updateTheme()
  },
  

  globalData: {
    URL: 'https://service-74x06cvh-1301435395.sh.apigw.tencentcs.com/release/prod_hku',
    // URL: 'http://yapi.demo.qunar.com/mock/75500',
    school_label: 'HKU',
    userInfo: null,
    tem_comment: '',
    tem_comment_with_serial: true,
    tem_comment_post: '',
    sp_src: '',
    showDisclaimerModal: false,
    redirectToRegister: false,
    theme: themes[wx.getSystemInfoSync().theme],
    colorScheme: wx.getSystemInfoSync().theme,
    indexJS:'',
    wsConnect:false,
    chat_id:'',
    db_version:'4',
    gettingChatList:[],
    tabbarJS:'',
    auth_key:'',
    from_miniapp:'',
    themeInfo:'',
  },

  subscribe:function(mode){
    var that = this
    return new Promise(function (resolve, reject) {
      var tmplIds = ['rzlxxKpaBxAreM0aOGEG72pmWkhKL288hE10mfdseJo','gdUXklCC0B5W4vSFuEYp1CZ-ny6YoXFt35zrjRBtycY','V-WN788I-oJTlyLrVfSz4PA9O2n4L7WdgHaX0onp-hU']
    wx.getSetting({
      withSubscriptions: true,
      success(res){
        // console.log(res.subscriptionsSetting)
        if(!res.subscriptionsSetting.mainSwitch){
          // console.log('main button已经关闭')
          if(mode){
            that.showModal({
              title:'未开启订阅消息权限',
              content:'你未开启订阅消息权限，可能无法接收通知，请到设置页面开启。',
              success(res2){
                if(res2.confirm){
                  // console.log('跳转设置成功')
                  wx.openSetting({
                    withSubscriptions: true,
                  })
                }
              }
            })
            resolve(false)
          }else{
            // console.log('非必要，取消弹窗请求')
          }
        }else{
          new Promise(function (resolve, reject) {
            var valid_count = 0
            for(let i=0;i<tmplIds.length;i++){
              // console.log(i)
              var subid = tmplIds[i]
              if(res.subscriptionsSetting[subid] == 'accept'){
                // console.log(tmplIds[i],'接受')
                var valid_count = valid_count + 4
              }else if(res.subscriptionsSetting[subid] == 'reject'){
                // console.log(tmplIds[i],'拒绝')
                var valid_count = valid_count + 1
              }else{
                // console.log(tmplIds[i],'未知')
              }
              if(i == tmplIds.length - 1){
                // console.log('结果',valid_count)
                resolve(valid_count)
              }
            }
          }).then(function(valid_count){
            if(valid_count == 12){
              // console.log('all accept')
              wx.requestSubscribeMessage({
                tmplIds: tmplIds,
                complete(res2){
                  // console.log(res2)
                  // console.log('静默请求成功')
                  resolve(true)
                }
              })
            }else if(Math.round(valid_count%4) != 0){
              // console.log('some reject')
              if(mode){
                that.showModal({
                  title:'未开启订阅消息权限',
                  content:'你未开启订阅消息权限，可能无法接收通知，请到设置页面开启。',
                  success(res2){
                    if(res2.confirm){
                      // console.log('跳转设置成功')
                      wx.openSetting({
                        withSubscriptions: true,
                      })
                    }
                  }
                })
                resolve(false)
              }else{
                // console.log('非必要，取消弹窗请求')
              }

            }else{
              // console.log('have undifined')
              if(mode){
                wx.requestSubscribeMessage({
                  tmplIds: tmplIds,
                  complete(res2){
                    // console.log(res2)
                    // console.log('弹窗请求成功')
                    resolve(true)
                  }
                })
              }else{
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
  watchCaptureScreen:function(){
    wx.onUserCaptureScreen(function (res) {
      var pages = getCurrentPages()
      var currentPage = pages[pages.length-1]
      var url = currentPage.route
      var options = currentPage.options
      var urlWithArgs = url + '?'
      for(var key in options){
          var value = options[key]
          urlWithArgs += key + '=' + value + '&'
      }
      urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length-1)
      wx.request({
        url: 'https://api.pupu.hkupootal.com/v3/user/record/capturescreen.php', 
        method: 'POST',
        data: {
          token:wx.getStorageSync('token'),
          url: urlWithArgs,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
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

  launch:function(){
    var that = this
    return new Promise(function (resolve, reject) {
      var token = wx.getStorageSync('token')
      if(token){
        wx.request({
          url: 'https://api.pupu.hkupootal.com/v3/user/check/wechat.php',
          method:'POST',
          data: {
            token: token
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded'
          },
          success(res6){
            if(res6.data.code == 900){
              wx.login({
                success (res) {
                  if(res.code){
                    wx.request({
                      url: 'https://api.pupu.hkupootal.com/v3/user/login/wechat.php',
                      method:'POST',
                      data: {
                        code: res.code,
                        system_info:JSON.stringify(wx.getSystemInfoSync())
                      },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      success(res2){
                        if(res2.data.code == 200){
                          wx.setStorageSync('token', res2.data.token)
                          resolve()
                        }else if(res2.data.code == 401){
                          var pages = getCurrentPages()
                          var currentPage = pages[pages.length-1]
                          var url = currentPage.route
                          if(url!="pages/register/register"){
                            wx.reLaunch({
                              url: '/pages/register/register',
                              success(){
                                wx.showToast({title: '请先注册', icon: "none", duration: 1000})
                              }
                            })
                          }
                        }else if(res2.data.code == 800 || res2.data.code == 801){
                          var pages = getCurrentPages()
                          var currentPage = pages[pages.length-1]
                          var url = currentPage.route
                          if(url!="pages/banDetail/banDetail"){
                            wx.reLaunch({
                              url: '/pages/banDetail/banDetail',
                            })
                          }
                        }else{
                          wx.showToast({title: res2.data.msg, icon: "none", duration: 1000})
                        }
                        
                      }
                    })
                  }else{
                    wx.showToast({title: '登录失败，请稍后再试', icon: "none", duration: 1000})
                  }
                }
            })
            }else if(res6.data.code == 800 || res6.data.code == 801){
              var pages = getCurrentPages()
              var currentPage = pages[pages.length-1]
              var url = currentPage.route
              if(url!="pages/banDetail/banDetail"){
                wx.reLaunch({
                  url: '/pages/banDetail/banDetail',
                })
              }
            }
            
          }
        }) 
      }else{
        wx.login({
          success (res) {
            if(res.code){
              wx.request({
                url: 'https://api.pupu.hkupootal.com/v3/user/login/wechat.php',
                method:'POST',
                data: {
                  code: res.code,
                  system_info:JSON.stringify(wx.getSystemInfoSync())
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success(res2){
                  if(res2.data.code == 200){
                    wx.setStorageSync('token', res2.data.token)
                    resolve()
                  }else if(res2.data.code == 401){
                    var pages = getCurrentPages()
                    var currentPage = pages[pages.length-1]
                    var url = currentPage.route
                    if(url!="pages/register/register"){
                      wx.reLaunch({
                        url: '/pages/register/register',
                        success(){
                          wx.showToast({title: '请先注册', icon: "none", duration: 1000})
                        }
                      })
                    }
                  }else if(res2.data.code == 800 || res2.data.code == 801){
                    var pages = getCurrentPages()
                    var currentPage = pages[pages.length-1]
                    var url = currentPage.route
                    if(url!="pages/banDetail/banDetail"){
                      wx.reLaunch({
                        url: '/pages/banDetail/banDetail',
                      })
                    }
                  }else{
                    wx.showToast({title: res2.data.msg, icon: "none", duration: 1000})
                  }
                  
                }
              })
            }else{
              wx.showToast({title: '登录失败，请稍后再试', icon: "none", duration: 1000})
            }
          }
      })
      }
    })
  },

  getOneLatest: function () {
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/one/getlatest.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        if(res.data.code == 200){
          if(res.data.one_latest_id > wx.getStorageSync('oneLatestId')){
            wx.setStorageSync('oneLatestId', res.data.one_latest_id)
            wx.setStorageSync('showOneRedDot', true)
            that.updateTabbar()
          }
        }else if(res.data.code == 800 ||res.data.code == 900){
          that.launch().then(res=>{
            that.getOneLatest()
          })
        }else{
          wx.showToast({title: res.data.msg, icon: "error", duration: 1000})
        }
      }
    })

  },

  //新消息推送
  initDatabase:function(){
    // console.log('初始化数据库')
    var that = this
    // if(wx.getStorageSync('db_version') != this.globalData.db_version){
    //   that.clearDB()
    //   console.log("更新版本，清空数据库")
    //   wx.setStorageSync('db_version', this.globalData.db_version)
    // }
    localDB.init()
    var chat = localDB.collection('chat')
    if(!chat){
      // console.log("不存在chat")
      chat = localDB.createCollection('chat') 
    }
    var pm = localDB.collection('pm')
    if(!pm){
      // console.log("不存在pm")
      pm = localDB.createCollection('pm') 
    }
    pm.where({
      _timeout: _.lt(Date.now())
    }).remove()
    chat.where({
      _timeout: _.lt(Date.now())
    }).remove() 
    that.clearStorage(chat,pm,1)
    return{chat,pm}
  },
  clearStorage:function(chat,pm,i){
    var that = this
    // console.log("开始清理存储")
    // console.log("尝试清理"+i+"天")
    if(that.getBytesLength(JSON.stringify(wx.getStorageSync('localDB'))) > 900000){
      // console.log("容量要超了，提前清除")
      pm.where({
        _timeout: _.lt(Date.now() + i * 24 * 3600000)
      }).remove()
      chat.where({
        _timeout: _.lt(Date.now() + i * 24 * 3600000)
      }).remove() 
      setTimeout(() => {
        that.clearStorage(chat,pm,i+1)
      }, 100);
    }else{
      // console.log("不需要清理")
    }
  },
  getHistoryMessage:function(){
    var that = this
    return new Promise(function (resolve, reject) {
      var db = that.initDatabase()
      var pm = db.pm
      var latset_pm_id_list = pm.orderBy('pm_id', 'desc').limit(1).get()
      // console.log(latset_pm_id_list)
      if(!latset_pm_id_list[0]){
        var latset_pm_id = 0
      }else{
        var latset_pm_id = latset_pm_id_list[0].pm_id
      }
      // console.log("latset_pm_id为"+latset_pm_id)
      wx.request({
        url: 'https://api.pupu.hkupootal.com/v3/pmnew/message/get.php', 
        method: 'POST',
        data: {
          token:wx.getStorageSync('token'),
          pm_id:latset_pm_id
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success (res) {
          // console.log(res)
          if(res.data.code == 200){
            var pmList = res.data.pmList
            // console.log(pmList)
            pmList.forEach(item => {
              that.addMessageToDb(item)
            })
            resolve()
          }
        }
      })
    })
  },
  addMessageToDb:function(item){
    // console.log(item)
    var that = this
    var db = that.initDatabase()
    var chat = db.chat
    var pm = db.pm
    var pm_list = pm.where({
      pm_id: item.pm_id
    }).limit(1).get()
    if(pm_list[0]){
      return
    }
    item._timeout = Date.now() + 30 * 24 * 3600000
    pm.add(item)
    var chat_list = chat.where({
      chat_id: item.chat_id
    }).limit(1).get()
    // console.log(chat_list)
    if(!chat_list[0]){
      that.addChatToDb(item)
    }else{
      var newChatDetail = chat_list[0]
      newChatDetail.chat_latest_msg = item.pm_msg
      newChatDetail.chat_update_date = item.pm_date
      newChatDetail.chat_latest_pm_id = item.pm_id
      if(!item.pm_is_from_me && that.globalData.chat_id!=item.chat_id){
        newChatDetail.chat_unread_count += 1
        wx.setStorageSync('allNoticeCount', wx.getStorageSync('allNoticeCount')+1)
        that.updateTabbar()
      }
      chat.where({
        chat_id: item.chat_id
      }).update(newChatDetail)
      that.updateData()
    }
  },
  addChatToDb:function(item){
    var that = this
    if(that.globalData.gettingChatList.includes(item.chat_id)){
      // console.log("已经在获取"+item.chat_id)
      return
    }
    that.globalData.gettingChatList.push(item.chat_id)
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/pmnew/chat/get.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
        chat_id:item.chat_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        if(res.data.code == 200){
          var chatDetail = res.data.chatDetail
          chatDetail.chat_latest_msg = item.pm_msg
          chatDetail.chat_update_date = item.pm_date
          chatDetail.chat_latest_pm_id = item.pm_id
          if(item.pm_is_from_me){
            chatDetail.chat_unread_count = 0
          }else{
            chatDetail.chat_unread_count = 1
            wx.setStorageSync('allNoticeCount', wx.getStorageSync('allNoticeCount')+1)
            that.updateTabbar()
          }
          var db = that.initDatabase()
          var chat = db.chat
          var chat_list = chat.where({
            chat_id: item.chat_id
          }).limit(1).get()
          // console.log(chat_list)
          if(!chat_list[0]){
            chatDetail._timeout = Date.now() + 30 * 24 * 3600000
            chat.add(chatDetail)
            that.updateData()
          }
          that.globalData.gettingChatList.delete(item.chat_id)
        }
      }
    })
  },
  updateData:function(){
    var that = this
    // console.log("调用")
    if(that.globalData.indexJS != ''){
      that.globalData.indexJS.setPageData()
      // console.log("调用成功")
    }else{
      // console.log("调用失败")
    }
  },
  webSocketConnect:function(){
    console.log('开始链接')
    var that = this
    var websocket = wx.connectSocket({
      url: 'wss://ws.pupu.hkupootal.com:3330',
      success(res){
        console.log(res)
      },
      fail(res){
        console.log(res)
      },
    })

    websocket.onOpen(function() {
      console.log('WebSocket已连接')
      that.globalData.wsConnect = true
      var message = {
        type:'bind',
        token:wx.getStorageSync('token')
      }
      websocket.send({
        data:JSON.stringify(message)
      })
    })

    websocket.onMessage(function(res) {
      that.messageHandler(res.data)
    })

    websocket.onError(function(res) {
      that.globalData.wsConnect = false
      console.log('出现问题')
      console.log(res)
    })

    websocket.onClose(function() {
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
  messageHandler:function(data){
    var that = this
    // console.log(data)
    data = JSON.parse(data)
    switch(data.type){
      case "bind":
        if(data.bind_result){
          // console.log("uid绑定成功")
        }else{
          // console.log("uid绑定失败")
          wx.closeSocket()
          setTimeout(() => {
            // console.log("重新连接")
            that.webSocketConnect()
          }, 5000)
        }
        break
      case "message":
        var content = JSON.parse(data.content)
        that.addMessageToDb(content)
        wx.vibrateShort({type: 'medium',})
        break
      case "notice":
        wx.setStorageSync('allNoticeCount', wx.getStorageSync('allNoticeCount')+1)
        wx.setStorageSync('systemNoticeCount', wx.getStorageSync('systemNoticeCount')+1)
        that.updateTabbar()
        wx.vibrateShort({type: 'medium',})
        break
    }
  },
  launchWebSoccket:function(){
    var that = this
    if(!that.globalData.wsConnect){
      console.log("先获取历史消息")
      that.getHistoryMessage().then(res=>{
        console.log("然后链接")
        that.webSocketConnect()
      })
    }else{
      var message = {
        type : 'ping',
      }
      wx.sendSocketMessage({
        data:JSON.stringify(message)
      })
    }
    setTimeout(() => {
      console.log("每10秒检测一次")
      that.launchWebSoccket()
    }, 10000); 
  },
  updateTabbar:function(){
    var tabbarJS = this.globalData.tabbarJS
    if(tabbarJS != '')[
      tabbarJS.updateTabbar()
    ]
  },
  getBytesLength:function(string) {   
    var totalLength = 0 
    var charCode = 0
      for (var i = 0; i < string.length; i++) {  
        charCode = string.charCodeAt(i)
        if (charCode < 0x007f)  {     
            totalLength++
        } else if ((0x0080 <= charCode) && (charCode <= 0x07ff))  {     
            totalLength += 2  
        } else if ((0x0800 <= charCode) && (charCode <= 0xffff))  {     
          totalLength += 3 
        } else{  
            totalLength += 4
        }          
    }  
    return totalLength
  },
  clearDB:function(){
    var that = this
    var db = that.initDatabase()
    db.chat.remove()
    db.pm.remove()
  },


  getTheme:function(){
    var that = this
    wx.request({
      url: 'https://api.pupu.hkupootal.com/v3/info/theme.php', 
      method: 'POST',
      data: {
        token:wx.getStorageSync('token'),
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        if(res.data.code == 200){
          that.globalData.themeInfo = []
          that.updateTheme(true)
        }else if(res.data.code == 201){
          that.globalData.themeInfo = res.data.themeInfo
          that.updateTheme(true)
        }
      }
    })
  },
  updateTheme:function(withAnimation){
    var that = this
    var systemInfo = wx.getSystemInfoSync()
    if(that.globalData.themeInfo.navigationBarColorLight){
      if(systemInfo.theme == 'dark'){
        if(withAnimation){
          wx.setNavigationBarColor({
            frontColor: that.globalData.themeInfo.navigationBarFontColorDark,
            backgroundColor: that.globalData.themeInfo.navigationBarColorDark,
            animation: {
              duration: 1000,
              timingFunc: 'easeInOut'
            }
          })
        }else{
          wx.setNavigationBarColor({
            frontColor: that.globalData.themeInfo.navigationBarFontColorDark,
            backgroundColor: that.globalData.themeInfo.navigationBarColorDark
          })
        }
      }else{
        if(withAnimation){
          wx.setNavigationBarColor({
            frontColor: that.globalData.themeInfo.navigationBarFontColorLight,
            backgroundColor: that.globalData.themeInfo.navigationBarColorLight,
            animation: {
              duration: 1000,
              timingFunc: 'easeInOut'
            }
          })
        }else{
          wx.setNavigationBarColor({
            frontColor: that.globalData.themeInfo.navigationBarFontColorLight,
            backgroundColor: that.globalData.themeInfo.navigationBarColorLight
          })
        }
      }
    }
    var pages = getCurrentPages()
    var currentPage = pages[pages.length-1]
    var url = currentPage.route
    if(url == "pages/home/home" || url == "pages/pmlist/pmlist" || url == "pages/mine/mine"){
      if(that.globalData.themeInfo.tabbarFontSelectedColorLight){
        if(systemInfo.theme == 'dark'){
          wx.setTabBarStyle({
            color: that.globalData.themeInfo.tabbarFontColorDark,
            selectedColor: that.globalData.themeInfo.tabbarFontSelectedColorDark
          })
        }else{
          wx.setTabBarStyle({
            color: that.globalData.themeInfo.tabbarFontColorLight,
            selectedColor: that.globalData.themeInfo.tabbarFontSelectedColorLight
          })
        }
      }
      if(that.globalData.themeInfo.tabbarItem){
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
  _handleInstanceMethod(pageData, 'onShow', function(e) {
    var app = getApp()
    app.updateTheme(false)
  })
  page(pageData)
}
const _handleInstanceMethod = function(instanceData, name, callback) {
  if (instanceData[name]) {
    const e = instanceData[name]
    instanceData[name] = function(arg) {
      callback.call(this, arg)
      e.call(this, arg)
    }
  } else {
    instanceData[name] = function(arg) {
      callback.call(this, arg)
    }
  }
}