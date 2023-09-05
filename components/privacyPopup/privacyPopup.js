 Component({
    data: {
        title: "用户隐私保护提示",
        desc1: "根据微信小程序政策，在您上传照片前应阅读并同意",
        urlTitle: "《用户隐私保护指引》",
        desc2: "当您点击同意并上传照片，即表示您已理解并同息该条款内容，该条款将对您产生法律约束力。如您拒绝，将无法上传照片。",
        innerShow: false,
        height: -500,
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
            this.disPopUp()
            setTimeout(() => {
              this.triggerEvent("disagree")
            }, 450);
        },
        handleAgree(e) {
            this.triggerEvent("agree")
            this.disPopUp()
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