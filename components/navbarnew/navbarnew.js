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
      if(currentIndex == '-4'){
        wx.navigateTo({
          url: '/pages/search/search',
        })
      }else{
        this.setData({ currentIndex });
        this.triggerEvent('change', currentIndex);
      }
    },
  },
});
