"use strict";

function e(t) {
    "@babel/helpers - typeof";
    return (e = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (e) {
        return typeof e
    } : function (e) {
        return e && "function" == typeof Symbol && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e
    })(t)
}

function t(e, t, i) {
    return t = n(t), t in e ? Object.defineProperty(e, t, {
        value: i,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : e[t] = i, e
}

function n(t) {
    var n = i(t, "string");
    return "symbol" === e(n) ? n : String(n)
}

function i(t, n) {
    if ("object" !== e(t) || null === t) return t;
    var i = t[Symbol.toPrimitive];
    if (void 0 !== i) {
        var o = i.call(t, n || "default");
        if ("object" !== e(o)) return o;
        throw new TypeError("@@toPrimitive must return a primitive value.")
    }
    return ("string" === n ? String : Number)(t)
}
/*!
 * mp-html v2.4.2
 * https://github.com/jin-yufeng/mp-html
 *
 * Released under the MIT license
 * Author: Jin Yufeng
 */
var o = require("./parser"),
    r = [require("./markdown/index.js"), require("./emoji/index.js"), require("./highlight/index.js"), require("./style/index.js")];
Component({
    data: {
        nodes: []
    },
    properties: {
        markdown: Boolean,
        containerStyle: String,
        content: {
            type: String,
            value: "",
            observer: function (e) {
                this.setContent(e)
            }
        },
        copyLink: {
            type: Boolean,
            value: !0
        },
        domain: String,
        errorImg: String,
        lazyLoad: Boolean,
        loadingImg: String,
        pauseVideo: {
            type: Boolean,
            value: !0
        },
        previewImg: {
            type: Boolean,
            value: !0
        },
        scrollTable: Boolean,
        selectable: null,
        setTitle: {
            type: Boolean,
            value: !0
        },
        showImgMenu: {
            type: Boolean,
            value: !0
        },
        tagStyle: Object,
        useAnchor: null
    },
    created: function () {
        this.plugins = [];
        for (var e = r.length; e--;) this.plugins.push(new r[e](this))
    },
    detached: function () {
        this._hook("onDetached")
    },
    methods: {
        in: function (e, t, n) {
            e && t && n && (this._in = {
                page: e,
                selector: t,
                scrollTop: n
            })
        },
        navigateTo: function (e, n) {
            var i = this;
            return e = this._ids[decodeURI(e)] || e, new Promise(function (o, r) {
                if (!i.data.useAnchor) return void r(Error("Anchor is disabled"));
                var a = wx.createSelectorQuery().in(i._in ? i._in.page : i).select((i._in ? i._in.selector : "._root") + (e ? "".concat(">>>", "#").concat(e) : "")).boundingClientRect();
                i._in ? a.select(i._in.selector).scrollOffset().select(i._in.selector).boundingClientRect() : a.selectViewport().scrollOffset(), a.exec(function (e) {
                    if (!e[0]) return void r(Error("Label not found"));
                    var a = e[1].scrollTop + e[0].top - (e[2] ? e[2].top : 0) + (n || parseInt(i.data.useAnchor) || 0);
                    i._in ? i._in.page.setData(t({}, i._in.scrollTop, a)) : wx.pageScrollTo({
                        scrollTop: a,
                        duration: 300
                    }), o()
                })
            })
        },
        getText: function (e) {
            var t = "";
            return function e(n) {
                for (var i = 0; i < n.length; i++) {
                    var o = n[i];
                    if ("text" === o.type) t += o.text.replace(/&amp;/g, "&");
                    else if ("br" === o.name) t += "\n";
                    else {
                        var r = "p" === o.name || "div" === o.name || "tr" === o.name || "li" === o.name || "h" === o.name[0] && o.name[1] > "0" && o.name[1] < "7";
                        r && t && "\n" !== t[t.length - 1] && (t += "\n"), o.children && e(o.children), r && "\n" !== t[t.length - 1] ? t += "\n" : "td" !== o.name && "th" !== o.name || (t += "\t")
                    }
                }
            }(e || this.data.nodes), t
        },
        getRect: function () {
            var e = this;
            return new Promise(function (t, n) {
                wx.createSelectorQuery().in(e).select("._root").boundingClientRect().exec(function (e) {
                    return e[0] ? t(e[0]) : n(Error("Root label not found"))
                })
            })
        },
        pauseMedia: function () {
            for (var e = (this._videos || []).length; e--;) this._videos[e].pause()
        },
        setPlaybackRate: function (e) {
            this.playbackRate = e;
            for (var t = (this._videos || []).length; t--;) this._videos[t].playbackRate(e)
        },
        setContent: function (e, t) {
            var n = this;
            this.imgList && t || (this.imgList = []), this._videos = [];
            var i = {},
                r = new o(this).parse(e);
            if (t)
                for (var a = this.data.nodes.length, s = r.length; s--;) i["nodes[".concat(a + s, "]")] = r[s];
            else i.nodes = r;
            if (this.setData(i, function () {
                    n._hook("onLoad"), n.triggerEvent("load")
                }), this.data.lazyLoad || this.imgList._unloadimgs < this.imgList.length / 2) {
                var l = 0,
                    c = function e(t) {
                        t && t.height || (t = {}), t.height === l ? n.triggerEvent("ready", t) : (l = t.height, setTimeout(function () {
                            n.getRect().then(e).catch(e)
                        }, 350))
                    };
                this.getRect().then(c).catch(c)
            } else this.imgList._unloadimgs || this.getRect().then(function (e) {
                n.triggerEvent("ready", e)
            }).catch(function () {
                n.triggerEvent("ready", {})
            })
        },
        _hook: function (e) {
            for (var t = r.length; t--;) this.plugins[t][e] && this.plugins[t][e]()
        },
        _add: function (e) {
            e.detail.root = this
        }
    }
});