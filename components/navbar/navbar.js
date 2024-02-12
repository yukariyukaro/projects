// components/navbar/navbar.js
var app = getApp()

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    showBack: Boolean
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusbar_height: wx.getSystemInfoSync().statusBarHeight,
    primary: app.globalData.theme.primary,
    is_dark: wx.getSystemInfoSync().theme == "dark"
  },

  lifetimes: {
    attached() {
      this.setData({
        primary: app.globalData.theme.primary
      })

      wx.onThemeChange((result) => {
        this.setData({
          primary: app.globalData.theme.primary,
          is_dark: result.theme == "dark"
        })
      })
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    back() {
      wx.navigateBack()
    },
  }
})