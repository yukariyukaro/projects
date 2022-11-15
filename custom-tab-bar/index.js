var e = getApp();

Component({
  data: {
    is_dark:false,
    tabbarFontColorLight:"#8a8a8a",
    tabbarFontSelectedColorLight:"#d85050",
    tabbarFontColorDark:"#8a8a8a",
    tabbarFontSelectedColorDark:"#864442",
    tabbarFontSelectedColorOne:"#1f86fc",
    allNoticeCount: 0,
    showOneRedDot: false,
    selected: 0,
    fontWeight: "bold",
    is_sending:false,
    list: [
      {
        pagePath: "/pages/home/home",
        iconPath: "/images/home-inactive.png",
        selectedIconPath: "/images/home-active.png",
        text: "树洞"
      },
      {
        pagePath: "/pages/one/one",
        iconPath: "/images/one-inactive.png",
        selectedIconPath: "/images/one-active.png",
        text: "ONE",
        is_one: true
      },
      {
        pagePath: "/pages/teasingwall/teasingwall",
        iconPath: "https://i.boatonland.com/emotion_tabbar/fadian.png",
        selectedIconPath: "https://i.boatonland.com/emotion_tabbar/add2.png",
        text: "",
        is_special: true
      },
      {
        pagePath: "/pages/pmlist/pmlist",
        iconPath: "/images/profile-inactive.png",
        selectedIconPath: "/images/profile-active.png",
        text: "消息"
      },
      {
        pagePath: "/pages/mine/mine",
        iconPath: "/images/more-inactive.png",
        selectedIconPath: "/images/more-active.png",
        text: "我的"
      }
    ],
    emotion_tabbar_icon_list:[
      "https://i.boatonland.com/emotion_tabbar/fadian.png",
      "https://i.boatonland.com/emotion_tabbar/bojin.png",
      "https://i.boatonland.com/emotion_tabbar/bailan.png",
      "https://i.boatonland.com/emotion_tabbar/pingjing.png",
    ]   
  },
  lifetimes: {
    attached(){
      this.updateTheme()
      this.changeEmotionIcon()
    },
    moved(){
      this.updateTheme()
      this.changeEmotionIcon()
    }
  },
  methods: {
    switchTab: function (e) {
      var that = this
      var index = e.currentTarget.dataset.index
      if(that.data.selected != index){
        wx.switchTab({
          url: that.data.list[index].pagePath
        })
        this.changeEmotionIcon()
      }else{
        if(index == 0){
          var allpages = getCurrentPages()  
          var nowpage = allpages[allpages.length - 1]
          nowpage.onRefresh()
        }else if(index == 2){
          var is_sending = that.data.is_sending
          var allpages = getCurrentPages()  
          var nowpage = allpages[allpages.length - 1]
          if(is_sending){
            nowpage.hideInput()
          }else{
            nowpage.showInput()
          }
          that.rotateIcon(is_sending)
        }
      }     
    },
    updateTheme:function(){
      var systemInfo = wx.getSystemInfoSync()
      if(systemInfo.theme == 'dark'){
        this.setData({
          is_dark: true
        })
      }else{
        this.setData({
          is_dark: false
        })
      }
    },
    changeEmotionIcon:function(){
      var emotion_tabbar_icon_list = this.data.emotion_tabbar_icon_list
      var iconPath = emotion_tabbar_icon_list[Math.floor((Math.random()*emotion_tabbar_icon_list.length))]
      var list = this.data.list
      list[2].iconPath = iconPath
      this.setData({
        list: list
      })
    },
    rotateIcon: function (e) {
      var that = this;
      var animation = wx.createAnimation({
        duration: 300,
        timingFunction: 'ease-out'
      })
      that.animation = animation
      if(!e){
        animation.rotate(405).step()
        that.setData({
          animation: animation.export(),
          is_sending: true
        })
      }else{
        animation.rotate(0).step()
        that.setData({
          animation: animation.export(),
          is_sending: false
        })
      }
    },
  },
  observers:{
    'selected': function() {
      this.updateTheme()
    },
  }
});