// components/modal/modal.js
Component({
  properties: {
    title: String,
    confirmText: {
      type: String,
      value: '确认',
    },
    cancelText: {
      type: String,
      value: '取消',
    },
  },
  data: {
    hidden: true,
  },
  methods: {
    show: function () {
      this.setData({ hidden: false });
    },
    hide: function () {
      this.setData({ hidden: true });
    },
    _cancel() {
      this.hide();
      this.triggerEvent('modalCancel', null, { bubbles: true, composed: true });
    },
    _confirm() {
      this.hide();
      this.triggerEvent('modalConfirm', null, {
        bubbles: true,
        composed: true,
      });
    },
  },
});
