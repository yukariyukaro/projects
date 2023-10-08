import info from "../../utils/info"
import newRequest from "../../utils/request"

Component({
    data: {
        title: "用户服务条款和隐私协议更新",
        desc1: "你需要同意我们最新版本的",
        userAgreement: "《用户服务协议》",
        privacyAgreement: "《隐私条款》",
        desc2: "才可继续使用我们的服务。",
        innerShow: false,
        height: -500,
        school_label_lower: info.school_label.toLowerCase(),
    },
    lifetimes: {
      attached: function() {
        if (wx.getPrivacySetting) {
          wx.getPrivacySetting({
            success: res => {
                console.log("是否需要授权：", res.needAuthorization, "隐私协议的名称为：", res.privacyContractName)
                this.setData({urlTitle: res.privacyContractName})
                if (!res.needAuthorization) {
                  this.popUp()
                } else{
                  this.triggerEvent("agree")
                }
            },
            fail: () => { },
            complete: () => { },
          })
        } else {
          // 低版本基础库不支持 wx.getPrivacySetting 接口，隐私接口可以直接调用
          this.triggerEvent("agree")
        }
      },
    },
    methods: {
        handleDisagree(e) {
            this.triggerEvent("disagree")
            // setTimeout(() => {
            //   this.triggerEvent("disagree")
            // }, 450);
        },
        handleAgree(e) {  
            newRequest('/user/terms/agree', {}, this.handleAgree)
            .then((res) => {
                if (res.code == 200){
                    this.disPopUp()
                    setTimeout(() => {
                        this.triggerEvent("agree")
                    }, 450);
                } else {
                    wx.showToast({
                      title: '请求失败，请重试',
                      icon: "none", 
                      duration: 1000
                    })
                }
            })
        },
        popUp() {
          setTimeout(() => {
            this.setData({
              height:0,
              innerShow: true
            })
          }, 10);
        },
        disPopUp() {
            this.setData({
              innerShow: false,
              height: -400
            })
        },
        openPrivacyContract() {
          wx.openPrivacyContract({
            success: res => {
              console.log('openPrivacyContract success')
            },
            fail: res => {
              console.error('openPrivacyContract fail', res)
            }
          })
        },
    }
})