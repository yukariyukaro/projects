const Mutex = require('async-mutex').Mutex;
const mutex = new Mutex();
// 获取 AV 命名空间的方式根据不同的安装方式而异，这里假设是通过手动导入文件的方式安装的 SDK
const AV = require('./libs/av-core-min.js');
const adapters = require('./libs/leancloud-adapters-weapp.js');
const themes = require('./theme');

AV.setAdapters(adapters);
AV.init({
  appId: 'tjIhHKbi6UO6zQpYezL6OmfI-9Nh9j0Va',
  appKey: 'IHIuPgFAEEDHAbFLhoYOOTt8',
  // 请将 xxx.example.com 替换为你的应用绑定的自定义 API 域名
  serverURLs: 'https://api.12345toolapi.xyz',
});
App({
  onLaunch(){
    this.launch()
    this.watchCaptureScreen()
  },
  onHide: function () {
    // 切后台的时候去掉跳转标记，从他处（分享链接）进入的时候能重新触发跳转
    this.globalData.redirectToRegister = false;
  },
  onThemeChange: function ({ theme }) {
    this.globalData.theme = themes[theme];
    this.globalData.colorScheme = theme;
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
  },

  subscribe:function(mode){
    return new Promise(function (resolve, reject) {
      var tmplIds = ['rzlxxKpaBxAreM0aOGEG72pmWkhKL288hE10mfdseJo','gdUXklCC0B5W4vSFuEYp1CZ-ny6YoXFt35zrjRBtycY','V-WN788I-oJTlyLrVfSz4PA9O2n4L7WdgHaX0onp-hU']
    wx.getSetting({
      withSubscriptions: true,
      success(res){
        console.log(res.subscriptionsSetting)
        if(!res.subscriptionsSetting.mainSwitch){
          console.log('main button已经关闭')
          if(mode){
            wx.showModal({
              title:'未开启订阅消息权限',
              content:'你未开启订阅消息权限，可能无法接收通知，请到设置页面开启。',
              success(res2){
                if(res2.confirm){
                  console.log('跳转设置成功')
                  wx.openSetting({
                    withSubscriptions: true,
                  })
                }
              }
            })
            resolve(false)
          }else{
            console.log('非必要，取消弹窗请求')
          }
        }else{
          new Promise(function (resolve, reject) {
            var valid_count = 0
            for(let i=0;i<tmplIds.length;i++){
              console.log(i)
              var subid = tmplIds[i]
              if(res.subscriptionsSetting[subid] == 'accept'){
                console.log(tmplIds[i],'接受')
                var valid_count = valid_count + 4
              }else if(res.subscriptionsSetting[subid] == 'reject'){
                console.log(tmplIds[i],'拒绝')
                var valid_count = valid_count + 1
              }else{
                console.log(tmplIds[i],'未知')
              }
              if(i == tmplIds.length - 1){
                console.log('结果',valid_count)
                resolve(valid_count)
              }
            }
          }).then(function(valid_count){
            if(valid_count == 12){
              console.log('all accept')
              wx.requestSubscribeMessage({
                tmplIds: tmplIds,
                complete(res2){
                  console.log(res2)
                  console.log('静默请求成功')
                  resolve(true)
                }
              })
            }else if(Math.round(valid_count%4) != 0){
              console.log('some reject')
              if(mode){
                wx.showModal({
                  title:'未开启订阅消息权限',
                  content:'你未开启订阅消息权限，可能无法接收通知，请到设置页面开启。',
                  success(res2){
                    if(res2.confirm){
                      console.log('跳转设置成功')
                      wx.openSetting({
                        withSubscriptions: true,
                      })
                    }
                  }
                })
                resolve(false)
              }else{
                console.log('非必要，取消弹窗请求')
              }

            }else{
              console.log('have undifined')
              if(mode){
                wx.requestSubscribeMessage({
                  tmplIds: tmplIds,
                  complete(res2){
                    console.log(res2)
                    console.log('弹窗请求成功')
                    resolve(true)
                  }
                })
              }else{
                console.log('非必要，取消弹窗请求')
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
        url: 'https://pupu.boatonland.com/v1/user/captureScreen.php', 
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
    console.log('执行launch')
    return new Promise(function (resolve, reject) {
      var token = wx.getStorageSync('token')
      if(token){
        wx.request({
          url: 'https://pupu.boatonland.com/v1/user/check.php',
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
                      url: 'https://pupu.boatonland.com/v1/user/login.php',
                      method:'POST',
                      data: {
                        code: res.code
                      },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded'
                      },
                      success(res2){
                        if(res2.data.code == 200){
                          wx.setStorageSync('token', res2.data.token)
                          resolve()
                        }else if(res2.data.code == 401){
                          wx.reLaunch({
                            url: '/pages/register/register',
                            success(){
                              wx.showToast({title: '请先注册', icon: "none", duration: 1000})
                            }
                          })
                        }else if(res2.data.code == 800){
                          wx.removeStorageSync('token')
                          wx.showModal({
                            title:"提示",
                            content:res2.data.msg,
                            showCancel:false
                          })
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
            }else if(res6.data.code == 800){
              wx.removeStorageSync('token')
              wx.showModal({
                title:"提示",
                content:res6.data.msg,
                showCancel:false
              })
            }
            
          }
        }) 
      }else{
        wx.login({
          success (res) {
            if(res.code){
              wx.request({
                url: 'https://pupu.boatonland.com/v1/user/login.php',
                method:'POST',
                data: {
                  code: res.code
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success(res2){
                  if(res2.data.code == 200){
                    wx.setStorageSync('token', res2.data.token)
                    resolve()
                  }else if(res2.data.code == 401){
                    wx.reLaunch({
                      url: '/pages/register/register',
                      success(){
                        wx.showToast({title: '请先注册', icon: "none", duration: 1000})
                      }
                    })
                  }else if(res2.data.code == 800){
                    wx.removeStorageSync('token')
                    wx.showModal({
                      title:"提示",
                      content:res2.data.msg,
                      showCancel:false
                    })
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
});
