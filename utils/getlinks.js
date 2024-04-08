export const getLinks = (msg, school_label) => {
    const reg_link = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|\&|\-)+)/g
    const reg_post = /(树洞)?(\b|#)(\d{5,6})(?!.*?<\/a>)/g
    // const reg_post = /\b(#?)(\d{5,6})([\s\D])/g 
    // const tripleuni_links = msg.match(/https:\/\/tripleuni\.com\/post\/(\d+)/g)

    let new_msg = msg.replace(reg_link, '<a href="$1$2">$1$2</a>').replace(reg_post, '<a style="text-decoration: underline; display: inline;" className="post-link" href="post:$3|' + school_label + '">[树洞]$2$3</a>')

    return new_msg
}