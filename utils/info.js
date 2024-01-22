const user_school_label = wx.getStorageSync('user_school_label');
var meta = {}

if (user_school_label.toUpperCase() == 'HKU') {
  var meta = {
    app_name: "HKU噗噗",
    app_title: "HKU噗噗",
    team_name: "HKUPootal",
    service_account:  "HKU ONE",
    search_page_topic: "ONE",
    school_label: "HKU",
    slogan: "HKU噗噗， 你不孤单",
    contact_serial: "HKUPootal",
    contact_school_label: "HKU",
    primary_color_on_light: "#ec849e",
    primary_color_on_dark: "#c96b82",
    search_nav_bar_color:"#1F86FC",
    search_nav_bar_color_dark:"#1F86FC",
    secondary_color: "#ffd700",
    user_id_name: "Pootal ID"
  }
} else if (user_school_label.toUpperCase() == 'UST') {
  var meta = {
    app_name: "Stardust 科大空间站",
    app_title: "科大空间站",
    team_name: "Stardust 科大星尘",
    service_account: "科大空间站",
    search_page_topic: "小火鸟",
    school_label: "UST",
    slogan: "We're all stardust",
    contact_email: "support@tripleuni.com",
    contact_serial: "HKUPootal",
    contact_school_label: "HKU",
    primary_color_on_light: "#7A4BED",
    primary_color_on_dark: "#B49AED",
    search_nav_bar_color:"#7A4BED",
    search_nav_bar_color_dark:"#B49AED",
    secondary_color: "#F7D047",
    user_id_name: "Stardust ID"
  }
}
// api_domain: "https://api.uni.hkupootal.com/v4",
// socket:"wss://ws.uni.hkupootal.com:7230",
meta.api_domain = "https://api.tripleuni.com/v4";
meta.socket = "wss://ws.tripleuni.com:7230";
meta.terms_url = "https://terms.tripleuni.com";
meta.contact_email = "support@tripleuni.com";
meta.email_suffixes = ["@connect.hku.hk", "@connect.ust.hk", ,"@hku.hk", "@ust.hk", "@alumni.ust.hk"];

module.exports = meta;