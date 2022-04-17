// components/prompt/prompt.js
Component({
  options: {
    multipleSlots: true, // 在组件定义时的选项中启用多slot支持
  },
  /**
   * 组件的属性列表
   */
  properties: {
    title: String,
    max_length: String,
    type: String,
    desc: String,
  },
  data: {
    focus: false,
    current_length: 0,
  },
  methods: {
    hide: function () {
      this.setData({ focus: false });
      this.modal.hide();
    },
    show() {
      this.setData({ focus: true });
      this.modal.show();
    },
    /*
     * 内部私有方法建议以下划线开头
     * triggerEvent 用于触发事件
     */
    _textareaInput(e) {
      // 将参数传出去，这样在getInput函数中可以通过e去获得必要的参数
      this.triggerEvent('getInput', e.detail);
      const len = e.detail.value.length;
      this.setData({ current_length: len });
    },
    _inputInput(e) {
      // 将参数传出去，这样在getInput函数中可以通过e去获得必要的参数
      this.triggerEvent('getInput', e.detail);
      const len = e.detail.value.length;
      this.setData({ current_length: len });
    },
  },
  lifetimes: {
    ready: function () {
      this.modal = this.selectComponent('#prompt-modal');
    },
  },
});
