// var e = getApp();
import info from "../utils/info.js"

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
        iconPath: "/images/" + info.school_label + "/home-inactive.png",
        selectedIconPath: "/images/" + info.school_label + "/home-active.png",
        text: "树洞"
      },
      {
        pagePath: "/pages/search/search",
        iconPath: "/images/" + info.school_label + "/search-inactive.png",
        selectedIconPath: "/images/" + info.school_label + "/search-active.png",
        text: "搜索",
      },
      {
        pagePath: "/pages/write/write",
        iconPath: "/images/" + info.school_label + "/write.png",
        selectedIconPath: "/images/" + info.school_label + "/write.png",
        text: "",
        is_special: true
      },
      {
        pagePath: "/pages/pmlist/pmlist",
        iconPath: "/images/" + info.school_label + "/pm-inactive.png",
        selectedIconPath: "/images/" + info.school_label + "/pm-active.png",
        text: "消息"
      },
      {
        pagePath: "/pages/mine/mine",
        iconPath: "/images/" + info.school_label + "/mine-inactive.png",
        selectedIconPath: "/images/" + info.school_label + "/mine-active.png",
        text: "我的"
      }
    ],

  },
  lifetimes: {
    attached() {
      this.updateTheme()
      wx.onThemeChange((result) => {
        this.updateTheme()
      })
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
          console.log(data)
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
          iconPath: "/images/" + info.school_label + "/home-inactive.png",
          selectedIconPath: "/images/" + info.school_label + "/home-active.png",
          text: "树洞"
        },
        {
          pagePath: "/pages/search/search",
          iconPath: "/images/" + info.school_label + "/search-inactive.png",
          selectedIconPath: "/images/" + info.school_label + "/search-active.png",
          text: "搜索",
        },
        {
          pagePath: "/pages/write/write",
          iconPath: "/images/" + info.school_label + "/write." + (this.data.school_label == 'UST'? 'svg' : 'png'),
          selectedIconPath: "/images/" + info.school_label + "/write." + (this.data.school_label == 'UST'? 'svg' : 'png'),
          text: "",
          is_special: true
        },
        {
          pagePath: "/pages/pmlist/pmlist",
          iconPath: "/images/" + info.school_label + "/pm-inactive.png",
          selectedIconPath: "/images/" + info.school_label + "/pm-active.png",
          text: "消息"
        },
        {
          pagePath: "/pages/mine/mine",
          iconPath: "/images/" + info.school_label + "/mine-inactive.png",
          selectedIconPath: "/images/" + info.school_label + "/mine-active.png",
          text: "我的"
        }
      ]
      var dark_list = [{
          pagePath: "/pages/home/home",
          iconPath: "/images/" + info.school_label + (info.school_label == 'UST' ? "/dark/home-inactive.svg" : "/home-inactive.png"),
          selectedIconPath: "/images/" + info.school_label + (info.school_label == 'UST' ? "/dark/home-active.svg" : "/home-active.png"),
          text: "树洞"
        },
        {
          pagePath: "/pages/search/search",
          iconPath: "/images/" + info.school_label + (info.school_label == 'UST' ? "/dark/search-inactive.svg" : "/search-inactive.png"),
          selectedIconPath: "/images/" + info.school_label + (info.school_label == 'UST' ? "/dark/search-active.svg" : "/search-active.png"),
          text: "搜索",
        },
        {
          pagePath: "/pages/write/write",
          iconPath: "/images/" + info.school_label + (info.school_label == 'UST' ? "/dark/write.svg" : "/write.png"),
          selectedIconPath: "/images/" + info.school_label + (info.school_label == 'UST' ? "/dark/write.svg" : "/write.png"),
          text: "",
          is_special: true
        },
        {
          pagePath: "/pages/pmlist/pmlist",
          iconPath: "/images/" + info.school_label + (info.school_label == 'UST' ? "/dark/pm-inactive.svg" : "/pm-inactive.png"),
          selectedIconPath: "/images/" + info.school_label + (info.school_label == 'UST' ? "/dark/pm-active.svg" : "/pm-active.png"),
          text: "消息"
        },
        {
          pagePath: "/pages/mine/mine",
          iconPath: "/images/" + info.school_label + (info.school_label == 'UST' ? "/dark/mine-inactive.svg" : "/mine-inactive.png"),
          selectedIconPath: "/images/" + info.school_label + (info.school_label == 'UST' ? "/dark/mine-active.svg" : "/mine-active.png"),
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
          is_dark = false
          this.setData({
            is_dark: false,
            list: light_list
          })
        }
      }
    },
  },

  observers: {
    'selected': function () {
      this.updateTheme()
    },
  }
});