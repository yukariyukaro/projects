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
        pagePath: "/pages/write/write",
        iconPath: "https://i.boatonland.com/emotion_tabbar/add2.png",
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
    },
    moved(){
      this.updateTheme()
    }
  },
  methods: {
    switchTab: function (e) {
      var that = this
      var index = e.currentTarget.dataset.index
      if(that.data.selected != index){
        if(index == 2){
          wx.navigateTo({
            url: that.data.list[index].pagePath
          })
        }else{
          wx.switchTab({
            url: that.data.list[index].pagePath
          })
        }
      }else{
        if(index == 0){
          var allpages = getCurrentPages()  
          var nowpage = allpages[allpages.length - 1]
          nowpage.onRefresh()
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
  },
  observers:{
    'selected': function() {
      this.updateTheme()
    },
  }
});