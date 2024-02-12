const user_school_label = wx.getStorageSync('user_school_label');

if (user_school_label.toUpperCase() == 'HKU'){
  module.exports={
    "light":{
      "backgroundTextStyle": "light",
      "navigationBarTextStyle": "white",
      "scrollViewRefresherStyle": "black",
      "primary": "#D85050",
      // "primary": "linear-gradient(to bottom right, #c53d3d, #e96b9b)",
      "secondary": "#ffd700",
      "backgroundColor": "#fff",
      "navigationBarBackgroundColor": "#D85050",
      "navigationBarBackgroundColorWebview": "#D85050",
      "navigationBarTextStyleWebview": "black",
      "tabBarBackgroundColor": "#fff",
      "tabBarSelectedColor": "#D85050",
      "mineBackgroundImage": "/images/HKU/cover.png",
      "onBg1": "#000",
      "onBg2": "#808080"
    },
    "dark": {
      "backgroundTextStyle": "dark",
      "navigationBarTextStyle": "black",
      "scrollViewRefresherStyle": "white",
      "primary": "#864442",
      "secondary": "#f3ec68",
      "backgroundColor": "#000000",
      "navigationBarBackgroundColor": "#864442",
      "navigationBarBackgroundColorWebview": "#864442",
      "navigationBarTextStyleWebview": "white",
      "tabBarBackgroundColor": "#212121",
      "tabBarSelectedColor": "#864442",
      "mineBackgroundImage": "/images/HKU/cover.png",
      "onBg1": "rgba(255, 255, 255, 0.8)",
      "onBg2": "rgba(175, 175, 175, 0.8)"
    }
  }
} else if (user_school_label.toUpperCase() == 'UST'){
  module.exports={
    "light":{
      "backgroundTextStyle": "light",
      "navigationBarTextStyle": "white",
      "scrollViewRefresherStyle": "black",
      "primary": "#7A4BED",
      "secondary": "#F7D047",
      "backgroundColor": "#fff",
      "navigationBarBackgroundColor": "#D85050",
      "navigationBarBackgroundColorWebview": "#D85050",
      "navigationBarTextStyleWebview": "black",
      "tabBarBackgroundColor": "#fff",
      "tabBarSelectedColor": "#D85050",
      "mineBackgroundImage": "/images/UST/cover.png",
      "onBg1": "#000",
      "onBg2": "#808080"
    },
    "dark": {
      "backgroundTextStyle": "dark",
      "navigationBarTextStyle": "black",
      "scrollViewRefresherStyle": "white",
      "primary": "#B49AED",
      "secondary": "#e9ac06",
      "backgroundColor": "#000000",
      "navigationBarBackgroundColor": "#864442",
      "navigationBarBackgroundColorWebview": "#864442",
      "navigationBarTextStyleWebview": "white",
      "tabBarBackgroundColor": "#212121",
      "tabBarSelectedColor": "#864442",
      "mineBackgroundImage": "/images/UST/cover.png",
      "onBg1": "rgba(255, 255, 255, 0.8)",
      "onBg2": "rgba(175, 175, 175, 0.8)"
    }
  }
} else if (user_school_label.toUpperCase() == 'CUHK'){
  module.exports={
    "light":{
      "backgroundTextStyle": "light",
      "navigationBarTextStyle": "black",
      "scrollViewRefresherStyle": "black",
      "primary": "#252D40",
      "secondary": "#F7D047",
      "backgroundColor": "#fff",
      "navigationBarBackgroundColor": "#BBBCB6",
      "navigationBarBackgroundColorWebview": "#ffffff",
      "navigationBarTextStyleWebview": "black",
      "tabBarBackgroundColor": "#fff",
      "tabBarSelectedColor": "#D85050",
      "mineBackgroundImage": "https://i.boatonland.com/cover%20page%20%281%29.png",
      "onBg1": "#000",
      "onBg2": "#808080"
    },
    "dark": {
      "backgroundTextStyle": "dark",
      "navigationBarTextStyle": "black",
      "scrollViewRefresherStyle": "white",
      "primary": "#252D40",
      "secondary": "#f3ec68",
      "backgroundColor": "#000000",
      "navigationBarBackgroundColor": "#864442",
      "navigationBarBackgroundColorWebview": "#191919",
      "navigationBarTextStyleWebview": "white",
      "tabBarBackgroundColor": "#212121",
      "tabBarSelectedColor": "#864442",
      "mineBackgroundImage": "https://i.boatonland.com/cover%20page2.png",
      "onBg1": "rgba(255, 255, 255, 0.8)",
      "onBg2": "rgba(175, 175, 175, 0.8)"
    }
  }
} else {
  module.exports={
    "light":{
      "backgroundTextStyle": "light",
      "navigationBarTextStyle": "black",
      "scrollViewRefresherStyle": "black",
      "primary": "#1F9BF0",
      "secondary": "#F7D047",
    },
    "dark": {
      "backgroundTextStyle": "dark",
      "navigationBarTextStyle": "black",
      "scrollViewRefresherStyle": "white",
      "primary": "#366ABD",
      "secondary": "#f3ec68",

    }
  }
}