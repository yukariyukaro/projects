"use strict";
import newRequest from "../../../utils/request"

function t(r) {
  "@babel/helpers - typeof";
  return (t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
    return typeof t
  } : function (t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
  })(r)
}

function r(t, r, i) {
  return r = e(r), r in t ? Object.defineProperty(t, r, {
    value: i,
    enumerable: !0,
    configurable: !0,
    writable: !0
  }) : t[r] = i, t
}

function e(r) {
  var e = i(r, "string");
  return "symbol" === t(e) ? e : String(e)
}

function i(r, e) {
  if ("object" !== t(r) || null === r) return r;
  var i = r[Symbol.toPrimitive];
  if (void 0 !== i) {
    var o = i.call(r, e || "default");
    if ("object" !== t(o)) return o;
    throw new TypeError("@@toPrimitive must return a primitive value.")
  }
  return ("string" === e ? String : Number)(r)
}
Component({
  data: {
    ctrl: {},
    isiOS: wx.getSystemInfoSync().system.includes("iOS")
  },
  properties: {
    childs: Array,
    opts: Array
  },
  options: {
    addGlobalClass: !0
  },
  attached: function () {
    this.triggerEvent("add", this, {
      bubbles: !0,
      composed: !0
    })
  },
  methods: {
    noop: function () {},
    getNode: function (t) {
      try {
        for (var r = t.split("_"), e = this.data.childs[r[0]], i = 1; i < r.length; i++) e = e.children[r[i]];
        return e
      } catch (t) {
        return {
          text: "",
          attrs: {},
          children: []
        }
      }
    },
    play: function (t) {
      if (this.root.triggerEvent("play"), this.root.data.pauseVideo) {
        for (var r = !1, e = t.target.id, i = this.root._videos.length; i--;) this.root._videos[i].id === e ? r = !0 : this.root._videos[i].pause();
        if (!r) {
          var o = wx.createVideoContext(e, this);
          o.id = e, this.root.playbackRate && o.playbackRate(this.root.playbackRate), this.root._videos.push(o)
        }
      }
    },
    imgTap: function (t) {
      var r = this.getNode(t.target.dataset.i);
      if (r.a) return this.linkTap(r.a);
      if (!r.attrs.ignore && (this.root.triggerEvent("imgtap", r.attrs), this.root.data.previewImg)) {
        var e = this.root.imgList[r.i];
        wx.previewImage({
          showmenu: this.root.data.showImgMenu,
          current: e,
          urls: this.root.imgList
        })
      }
    },
    imgLoad: function (t) {
      var e, i = t.target.dataset.i,
        o = this.getNode(i);
      o.w ? (this.data.opts[1] && !this.data.ctrl[i] || -1 === this.data.ctrl[i]) && (e = 1) : e = t.detail.width, e && this.setData(r({}, "ctrl." + i, e)), this.checkReady()
    },
    checkReady: function () {
      var t = this;
      this.root.data.lazyLoad || (this.root.imgList._unloadimgs -= 1, this.root.imgList._unloadimgs || setTimeout(function () {
        t.root.getRect().then(function (r) {
          t.root.triggerEvent("ready", r)
        }).catch(function () {
          t.root.triggerEvent("ready", {})
        })
      }, 350))
    },
    nav2post: function (post) {
      let post_id = post.split('|')[0]
      let post_school_label = post.split('|')[1]
      newRequest("/post/single/id", {
          post_id: Number(post_id),
          post_school_label: post_school_label
        }, this.nav2post)
        .then((res) => {
          if (!res) return
          wx.navigateTo({
            url: '/pages/detail/detail?uni_post_id=' + res.uni_post_id
          })
        })
    },

    linkTap: function (t) {
      var r = t.currentTarget ? this.getNode(t.currentTarget.dataset.i) : {},
        e = r.attrs || t,
        i = e.href;

      let url = i
      console.log(url)
      if (url.slice(0, 4) == "http") {
        const tripleUniLink = url.match(/https:\/\/tripleuni\.com\/post\/(\d+)/g)
        const article = url.startsWith("https://mp.weixin.qq.com/s")
        if (tripleUniLink) {
          let uni_post_id = tripleUniLink[0].replace('https://tripleuni.com/post/', '')
          console.log(uni_post_id)
          wx.navigateTo({
            url: '/pages/detail/detail?uni_post_id=' + uni_post_id
          })
          return
        } else if (article) {
          // wx.navigateTo({url: '/pages/webview/webview?url=' + url})
          wx.setClipboardData({
            data: url,
            complete() {
              return
            },
            fail(e) {
              console.log(e)
            }
          })
        } else {
          wx.setClipboardData({
            data: url,
            complete() {
              return
            },
            fail(e) {
              console.log(e)
            }

          })
        }
      } else {
        if (url.slice(0, 5) == 'post:') {
          this.nav2post(url.slice(5))
        } else {
          wx.setClipboardData({
            data: url,
            complete() {
              return
            },
            fail(e) {
              console.log(e)
            }
          })
        }
      }
    },
    // linkTap: function (t) {
    //     var r = t.currentTarget ? this.getNode(t.currentTarget.dataset.i) : {},
    //         e = r.attrs || t,
    //         i = e.href;
    //     this.root.triggerEvent("linktap", Object.assign({
    //         innerText: this.root.getText(r.children || [])
    //     }, e)), i && ("#" === i[0] ? this.root.navigateTo(i.substring(1)).catch(function () {}) : i.split("?")[0].includes("://") ? this.root.data.copyLink && wx.setClipboardData({
    //         data: i,
    //         success: function () {
    //             return wx.showToast({
    //                 title: "链接已复制"
    //             })
    //         }
    //     }) : wx.navigateTo({
    //         url: i,
    //         fail: function () {
    //             wx.switchTab({
    //                 url: i,
    //                 fail: function () {}
    //             })
    //         }
    //     }))
    // },
    mediaError: function (t) {
      var e = t.target.dataset.i,
        i = this.getNode(e);
      if ("video" === i.name || "audio" === i.name) {
        var o = (this.data.ctrl[e] || 0) + 1;
        if (o > i.src.length && (o = 0), o < i.src.length) return this.setData(r({}, "ctrl." + e, o))
      } else "img" === i.name && (this.data.opts[2] && this.setData(r({}, "ctrl." + e, -1)), this.checkReady());
      this.root && this.root.triggerEvent("error", {
        source: i.name,
        attrs: i.attrs,
        errMsg: t.detail.errMsg
      })
    }
  }
});