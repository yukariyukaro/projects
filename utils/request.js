const info = require('info.js')

export default function newRequest (path, body, relaunchFunction = new function(){},includeToken = true, includeLabel = false, noLoadingModal = false){
  return new Promise( (resolve, reject) => {
    if (includeToken) Object.assign(body, {token: wx.getStorageSync('token')});
    if (includeLabel) Object.assign(body, {user_school_label: info.school_label});

    wx.request({
      url: info.api_domain + path + ".php", 
      method: 'POST',
      data: body,
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success (res) {
        if (!noLoadingModal){
          wx.hideLoading()
        }
        if(res.data.code == 801 || res.data.code == 802){
          wx.login({
            success (res2) {
              console.log(res2);
              if(res2.code){
                newRequest("/user/login/wechatuni", {
                  code: res2.code,
                  system_info: JSON.stringify(wx.getSystemInfoSync())
                }, () => {}, false, true).then( (res3) => {
                  if(res3.code == 200){
                    wx.setStorageSync('token', res3.token)
                    relaunchFunction()
                    resolve(res.data)
                  }else if(res3.code == 401 || res3.code == 400){
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
                  }else{
                    wx.showToast({title: res3.msg, icon: "none", duration: 1000})
                    reject(res3.msg)
                  }
                })
              }else{
                wx.showToast({title: '登录失败，请稍后再试', icon: "none", duration: 1000})
                wx.hideLoading()
                reject(res3.data.msg)
              }
            }
          })
        }else if(res.data.code == 803 || res.data.code == 804){
          wx.reLaunch({
            url: '/pages/banDetail/banDetail',
          })
          reject(res.data.msg)
        }else if(res.data.code == 901){
          wx.showToast({title: '系统维护中', icon: "error", duration: 2000})
          reject(res.data.msg)
        }else if(res.data.code == 902){
          wx.showToast({title: res.data.msg, icon: "error", duration: 2000})
          reject(res.data.msg)
        }else{
          resolve (res.data)
        }
      },
      fail (res) {
        reject(res)
      }
    })
  })
}
