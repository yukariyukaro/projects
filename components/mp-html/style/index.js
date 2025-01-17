"use strict";

function t() {
    this.styles = []
}

function e(t, e) {
    function r(e) {
        if ("#" === e[0]) {
            if (t.attrs.id && t.attrs.id.trim() === e.substr(1)) return 3
        } else if ("." === e[0]) {
            e = e.substr(1);
            for (var r = (t.attrs.class || "").split(" "), s = 0; s < r.length; s++)
                if (r[s].trim() === e) return 2
        } else if (t.name === e) return 1;
        return 0
    }
    if (e instanceof Array) {
        for (var s = 0, n = 0; n < e.length; n++) {
            var i = r(e[n]);
            if (!i) return 0;
            i > s && (s = i)
        }
        return s
    }
    return r(e)
}
var r = require("./parser");
t.prototype.onParse = function (t, s) {
    var n = this;
    if ("style" === t.name && t.children.length && "text" === t.children[0].type) this.styles = this.styles.concat((new r).parse(t.children[0].text));
    else if (t.name) {
        for (var i = ["", "", "", ""], l = 0, a = this.styles.length; l < a; l++) ! function () {
            var r, a = n.styles[l],
                f = e(t, a.key || a.list[a.list.length - 1]);
            if (f) {
                if (!a.key) {
                    r = a.list.length - 2;
                    for (var c = s.stack.length; r >= 0 && c--;)
                        if (">" === a.list[r]) {
                            if (r < 1 || r > a.list.length - 2) break;
                            e(s.stack[c], a.list[r - 1]) ? r -= 2 : r++
                        } else e(s.stack[c], a.list[r]) && r--;
                    f = 4
                }
                if (a.key || r < 0)
                    if (a.pseudo && t.children) {
                        var u;
                        a.style = a.style.replace(/content:([^;]+)/, function (e, r) {
                            return u = r.replace(/['"]/g, "").replace(/attr\((.+?)\)/, function (e, r) {
                                return t.attrs[r.trim()] || ""
                            }).replace(/\\(\w{4})/, function (t, e) {
                                return String.fromCharCode(parseInt(e, 16))
                            }), ""
                        });
                        var o = {
                            name: "span",
                            attrs: {
                                style: a.style
                            },
                            children: [{
                                type: "text",
                                text: u
                            }]
                        };
                        "before" === a.pseudo ? t.children.unshift(o) : t.children.push(o)
                    } else i[f - 1] += a.style + (";" === a.style[a.style.length - 1] ? "" : ";")
            }
        }();
        i = i.join(""), i.length > 2 && (t.attrs.style = i + (t.attrs.style || ""))
    }
}, module.exports = t;