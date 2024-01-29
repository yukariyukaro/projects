export const getLinks = (msg, school_label) => {
    const reg_link = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|\&|\-)+)/g
    // const reg_post = /([^/\d])(#\d{5,6})[\s\S]/g
    const reg_post = /\b#?(\d{5,6})([\s\D])/g //([\s\D])\b
    // const tripleuni_links = msg.match(/https:\/\/tripleuni\.com\/post\/(\d+)/g)

    let new_msg = msg.replace(reg_post, '<a style="text-decoration: underline; display: inline;" className="post-link" href="$1|' + school_label + '">[树洞]$1</a>$2').replace(reg_link, '<a href="$1$2">$1$2</a>')

    return new_msg
}