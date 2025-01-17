// var e = getApp();
import info from "../utils/info.js"
import newRequest from "../utils/request"
var app = getApp()

Component({
  data: {
    school_label: info.school_label,
    is_dark: false,
    tabbarFontColorLight: "#8a8a8a",
    tabbarFontSelectedColorLight: info.primary_color_on_light,
    tabbarFontColorDark: "#8a8a8a",
    tabbarFontSelectedColorDark: info.primary_color_on_dark,
    allNoticeCount: 0,
    one_color: info.search_nav_bar_color,
    showOneRedDot: false,
    selected: 1,
    fontWeight: "bold",
    is_sending: false,
    list: [{
        pagePath: "/pages/home/home",
        iconPath: "/images/" + info.school_label + "/home-inactive." + (info.school_label == 'CUHK' ?  'svg' : 'png'),
        selectedIconPath: "/images/" + info.school_label + "/home-active." + (info.school_label == 'CUHK' ?  'svg' : 'png'),
        text: "树洞"
      },
      {
        pagePath: "/pages/search/search",
        iconPath: "/images/" + info.school_label + "/search-inactive."+ (info.school_label == 'CUHK' ?  'svg' : 'png'),
        selectedIconPath: "/images/" + info.school_label + "/search-active." + (info.school_label == 'CUHK' ?  'svg' : 'png'),
        text: "搜索",
      },
      {
        pagePath: "/pages/write/write",
        iconPath: "/images/" + info.school_label + "/write." + (info.school_label == 'HKU' ?  'png' : 'svg'),
        selectedIconPath: "/images/" + info.school_label + "/write." + (info.school_label == 'HKU' ?  'png' : 'svg'),
        text: "",
        is_special: true
      },
      {
        pagePath: "/pages/pmlist/pmlist",
        iconPath: "/images/" + info.school_label + "/pm-inactive." + (info.school_label == 'CUHK' ?  'svg' : 'png'),
        selectedIconPath: "/images/" + info.school_label + "/pm-active." + (info.school_label == 'CUHK' ?  'svg' : 'png'),
        text: "消息"
      },
      {
        pagePath: "/pages/mine/mine",
        iconPath: "/images/" + info.school_label + "/mine-inactive." + (info.school_label == 'CUHK' ?  'svg' : 'png'),
        selectedIconPath: "/images/" + info.school_label + "/mine-active." + (info.school_label == 'CUHK' ?  'svg' : 'png'),
        text: "我的"
      }
    ],

  },
  lifetimes: {
    attached() {
      this.updateTheme()
    },
    moved() {
      this.updateTheme()
    }
  },
  methods: {
    switchTab: function (e) {
      var that = this
      var data = e.currentTarget.dataset
      var index = data.index

      if (index != that.data.selected) {
        if (index == 2) {
          // console.log(data)
          wx.navigateTo({
            url: data.url
          })

        } else {
          wx.switchTab({
            url: data.url
          })
        }

      } else {
        if (index === 0) {
          var allpages = getCurrentPages()
          var nowpage = allpages[allpages.length - 1]
          nowpage.onRefresh()
        }
      }
    },
    updateTheme: function () {
      var light_list = [{
          pagePath: "/pages/home/home",
          iconPath: "/images/" + info.school_label + "/home-inactive." + (info.school_label == 'CUHK' ?  'svg' : 'png'),
          selectedIconPath: "/images/" + info.school_label + "/home-active." + (info.school_label == 'CUHK' ?  'svg' : 'png'),
          text: "树洞"
        },
        {
          pagePath: "/pages/search/search",
          iconPath: "/images/" + info.school_label + "/search-inactive." + (info.school_label == 'CUHK' ?  'svg' : 'png'),
          selectedIconPath: "/images/" + info.school_label + "/search-active." + (info.school_label == 'CUHK' ?  'svg' : 'png'),
          text: "搜索",
        },
        {
          pagePath: "/pages/write/write",
          iconPath: "/images/" + info.school_label + "/write." + (info.school_label == 'HKU' ?  'png' : 'svg'),
          selectedIconPath: "/images/" + info.school_label + "/write." + (info.school_label == 'HKU' ?  'png' : 'svg'),
          text: "",
          is_special: true
        },
        {
          pagePath: "/pages/pmlist/pmlist",
          iconPath: "/images/" + info.school_label + "/pm-inactive." + (info.school_label == 'CUHK' ?  'svg' : 'png'),
          selectedIconPath: "/images/" + info.school_label + "/pm-active." + (info.school_label == 'CUHK' ?  'svg' : 'png'),
          text: "消息"
        },
        {
          pagePath: "/pages/mine/mine",
          iconPath: "/images/" + info.school_label + "/mine-inactive." + (info.school_label == 'CUHK' ?  'svg' : 'png'),
          selectedIconPath: "/images/" + info.school_label + "/mine-active." + (info.school_label == 'CUHK' ?  'svg' : 'png'),
          text: "我的"
        }
      ]
      var dark_list = [{
          pagePath: "/pages/home/home",
          iconPath: "/images/" + info.school_label + (info.school_label == 'UST' ? "/dark/home-inactive.svg" : "/home-inactive." +  (info.school_label == 'HKU' ?  'png' : 'svg')),
          selectedIconPath: "/images/" + info.school_label + (info.school_label == 'UST' ? "/dark/home-active.svg" : "/home-active." + (info.school_label == 'HKU' ?  'png' : 'svg')),
          text: "树洞"
        },
        {
          pagePath: "/pages/search/search",
          iconPath: "/images/" + info.school_label + (info.school_label == 'UST' ? "/dark/search-inactive.svg" : "/search-inactive." + (info.school_label == 'HKU' ?  'png' : 'svg')),
          selectedIconPath: "/images/" + info.school_label + (info.school_label == 'UST' ? "/dark/search-active.svg" : "/search-active." + (info.school_label == 'HKU' ?  'png' : 'svg')),
          text: "搜索",
        },
        {
          pagePath: "/pages/write/write",
          iconPath: "/images/" + info.school_label + (info.school_label == 'UST' ? "/dark/write.svg" : "/write." + (info.school_label == 'HKU' ?  'png' : 'svg')),
          selectedIconPath: "/images/" + info.school_label + (info.school_label == 'UST' ? "/dark/write.svg" : "/write." + (info.school_label == 'png' ?  'png' : 'svg')),
          text: "",
          is_special: true
        },
        {
          pagePath: "/pages/pmlist/pmlist",
          iconPath: "/images/" + info.school_label + (info.school_label == 'UST' ? "/dark/pm-inactive.svg" : "/pm-inactive." + (info.school_label == 'HKU' ?  'png' : 'svg')),
          selectedIconPath: "/images/" + info.school_label + (info.school_label == 'UST' ? "/dark/pm-active.svg" : "/pm-active." + (info.school_label == 'HKU' ?  'png' : 'svg')),
          text: "消息"
        },
        {
          pagePath: "/pages/mine/mine",
          iconPath: "/images/" + info.school_label + (info.school_label == 'UST' ? "/dark/mine-inactive.svg" : "/mine-inactive." + (info.school_label == 'HKU' ?  'png' : 'svg')),
          selectedIconPath: "/images/" + info.school_label + (info.school_label == 'UST' ? "/dark/mine-active.svg" : "/mine-active." + (info.school_label == 'HKU' ?  'png' : 'svg')),
          text: "我的"
        }
      ]
      var systemInfo = wx.getSystemInfoSync()
      if (systemInfo.theme != (this.data.is_dark ? "dark" : "light")) {
        if (systemInfo.theme == 'dark') {
          this.setData({
            is_dark: true,
            list: dark_list
          })
        } else {
          this.setData({
            is_dark: false,
            list: light_list
          })
        }
      }
    },
    clearUnread:function(){
      let that = this
      app.showModal({
        title:"提示",
        content:"确认清空未读消息？",
        showCancel:true,
        success(res){
          if(res.confirm){
            newRequest("/notice/clear", {})
            .then(res => {
              if (res.code == 200){
                var db = app.initDatabase()
                var chat = db.chat
                var chat_list = chat.get()
                chat_list.forEach(item => {
                  item.chat_unread_count = 0
                  chat.where({
                    chat_id: item.chat_id
                  }).update(item)
                })
                wx.removeTabBarBadge({
                  index: 1,
                })
                wx.setStorageSync('allNoticeCount', 0)
                wx.setStorageSync('systemNoticeCount', 0)
                app.updateTabbar()

                if (app.globalData.indexJS.route == 'pages/pmlist/pmlist') {
                  app.globalData.indexJS.setPageData()
                }

                wx.showToast({title: '清理成功', icon: "none", duration: 1000})
              }else{
                wx.showToast({title: '清理失败', icon: "none", duration: 1000})
              }
            })
          }
        }
      })
    },
  },

  observers: {
    'selected': function () {
      this.updateTheme()
    },
  }
});