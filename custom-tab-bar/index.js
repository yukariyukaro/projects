// var e = getApp();
import info from "../utils/info.js"

Component({
  data: {
    is_dark:false,
    tabbarFontColorLight:"#8a8a8a",
    tabbarFontSelectedColorLight: info.primary_color_on_light,
    tabbarFontColorDark:"#8a8a8a",
    tabbarFontSelectedColorDark: info.primary_color_on_dark,
    allNoticeCount: 0,
    one_color: '#1F86FC',
    showOneRedDot: false,
    selected: 1,
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
        pagePath: "/pages/search/search",
        iconPath: "/images/search-inactive.png",
        selectedIconPath: "/images/search-active.png",
        text: "搜索",
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
        iconPath: "/images/pm-inactive.png",
        selectedIconPath: "/images/pm-active.png",
        text: "消息"
      },
      {
        pagePath: "/pages/mine/mine",
        iconPath: "/images/mine-inactive.png",
        selectedIconPath: "/images/mine-active.png",
        text: "我的"
      }
    ],
    
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
      var data = e.currentTarget.dataset
      var index = data.index

      if(index != that.data.selected){
        if(index== 2){
          console.log(data)
          wx.navigateTo({
            url: data.url
          })

        }else{
          wx.switchTab({
            url: data.url
          })
        }

      }else{
          if(index === 0){
            var allpages = getCurrentPages()  
            var nowpage = allpages[allpages.length - 1]
            nowpage.onRefresh()
          }
      }     
    },
    updateTheme:function(){
      var systemInfo = wx.getSystemInfoSync()
      if(systemInfo.theme != (this.data.is_dark? "dark": "light")){ 
        if(systemInfo.theme == 'dark'){
          this.setData({
            is_dark: true
          })
        }else{
          this.setData({
            is_dark: false
          })
        }
      }
    },
  },

  observers:{
    'selected': function() {
      this.updateTheme()
    },
  }
});