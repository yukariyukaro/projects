const user_school_label = wx.getStorageSync('user_school_label');
var meta = {}

if (user_school_label.toUpperCase() == 'HKU') {
  var meta = {
    app_name: "HKU噗噗",
    app_title: "HKU噗噗",
    team_name: "HKUPootal",
    service_account: "HKU ONE",
    search_page_topic: "ONE",
    school_label: "HKU",
    slogan: "HKU噗噗， 你不孤单",
    contact_serial: "HKUPootal",
    contact_school_label: "HKU",
    primary_color_on_light: "#D85050",
    primary_color_on_dark: "#864442",
    search_nav_bar_color: "#1F86FC",
    search_nav_bar_color_dark: "#1F86FC",
    secondary_color: "#ffd700",
    user_id_name: "Pootal ID",
    share_cover: "/images/HKU/cover.png",
  }
} else if (user_school_label.toUpperCase() == 'UST') {
  var meta = {
    app_name: "Stardust 科大空间站",
    app_title: "科大空间站",
    team_name: "Stardust 科大星尘",
    service_account: "Stardust 科大空间站",
    search_page_topic: "小火鸟",
    school_label: "UST",
    slogan: "We're all stardust",
    contact_email: "support@tripleuni.com",
    contact_serial: "HKUPootal",
    contact_school_label: "HKU",
    primary_color_on_light: "#7A4BED",
    primary_color_on_dark: "#B49AED",
    search_nav_bar_color: "#7A4BED",
    search_nav_bar_color_dark: "#B49AED",
    secondary_color: "#F7D047",
    user_id_name: "Stardust ID",
    share_cover: "/images/UST/cover.png",
  }
} else if (user_school_label.toUpperCase() == 'CUHK') {
  var meta = {
    app_name: "马料水哔哔机",
    app_title: "马料水哔哔机",
    team_name: "CU转换器",
    service_account: "马料水猫抓板",
    search_page_topic: "猫抓板",
    school_label: "CUHK",
    slogan: "CU转换器，转换你的世界",
    contact_serial: "HKUPootal",
    contact_school_label: "HKU",
    primary_color_on_light: "#252D40",
    primary_color_on_dark: "#252D40",
    search_nav_bar_color: "#252D40",
    search_nav_bar_color_dark: "#252D40",
    secondary_color: "#F7D047",
    user_id_name: "Cutrans ID",
    share_cover: "/images/CUHK/cover.jpg",
  }
} else {
  var meta = {
    app_name: "Triple Uni",
    app_title: "Triple Uni",
    team_name: "Triple Uni",
    service_account: null,
    search_page_topic: null,
    school_label: "UNI",
    slogan: null,
    contact_serial: "HKUPootal",
    contact_school_label: "HKU",
    primary_color_on_light: "#366ABD",
    primary_color_on_dark: "#366ABD",
    search_nav_bar_color: "#252D40",
    search_nav_bar_color_dark: "#252D40",
    secondary_color: "#F7D047",
    user_id_name: "ID",
    share_cover: null,
  }
}

// api_domain: "https://api.uni.hkupootal.com/v4",
// socket:"wss://ws.uni.hkupootal.com:7230",
meta.api_domain = "https://api.tripleuni.com/v4";
meta.socket = "wss://ws.tripleuni.com:7230";
meta.terms_url = "https://terms.tripleuni.com";
meta.contact_email = "support@tripleuni.com";
meta.email_suffixes = ["@connect.hku.hk", "@connect.ust.hk", "@link.cuhk.edu.hk", "@hku.hk", "@ust.hk", "@cuhk.edu.hk", "@alumni.ust.hk"];

module.exports = meta;