import info from "../../utils/info"
import newRequest from "../../utils/request"

Component({
    data: {
        title: "用户服务条款和隐私协议更新",
        desc1: "你需要同意我们最新版本的",
        userAgreement: "《用户服务协议》",
        privacyAgreement: "《隐私条款》",
        desc2: "才可继续使用我们的服务。",
        school_label_lower: info.school_label.toLowerCase(),
        terms_url: info.terms_url,
        primary_color: wx.getSystemInfoSync().theme == 'light'? info.primary_color_on_light : info.primary_color_on_dark,
        close: false
    },

    lifetimes: {
      attached: function() {
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
        // popUp() {
        //   setTimeout(() => {
        //     this.setData({
        //       height:0,
        //       innerShow: true
        //     })
        //   }, 10);
        // },
        disPopUp() {
            this.setData({
              close: true
            })
        },
        
    }
})