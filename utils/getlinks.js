export const getLinks = (msg, school_label) => {
    const reg_link = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|\&|\-)+)/g
    const reg_post = /([^/\d])(#?\d{5,6})/g
    const tripleuni_links = msg.match(/https:\/\/tripleuni\.com\/post\/(\d+)/g)

    msg = "<div>" + msg.replace(reg_post, '$1<a style="text-decoration: underline; display: inline;" className="post-link" href="$2|' + school_label + '">[树洞]$2</a>').replace(reg_link, '<a href="$1$2">$1$2</a>') + "</div>"
    return msg
}