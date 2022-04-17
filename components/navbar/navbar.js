// components/navbar/navbar.js
Component({
  options: {
    multipleSlots: true,
  },
  externalClasses: ['active-class'],
  properties: {
    items: {
      type: Array,
      value: [],
    },
    startIndex: {
      type: Number,
      value: 0,
    },
    currentIndex: {
      type: Number,
      value: 0,
    },
    prop: String,
  },
  methods: {
    navbarTap: function (e) {
      const currentIndex = e.currentTarget.dataset.index;
      // setData 设置properties
      // 在外层使用model:current-index=...双向绑定
      // 因为私信等页面外部也要用到currentIndex这个变量
      this.setData({ currentIndex });
      this.triggerEvent('change', currentIndex);
    },
  },
});
