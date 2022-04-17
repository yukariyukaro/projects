Component({
  properties: {
    disabled: {
      type: Boolean,
      value: false,
    },
    loading: {
      type: Boolean,
      value: false,
    },
    error: {
      type: Boolean,
      value: false,
    },
    index: Number,
    options: Array,
    labelProp: String,
  },
  data: {
    label: String,
  },
  observers: {
    'index, options, labelProp': function (index, options, labelProp) {
      if (!labelProp) return this.setData({ label: options[index] || '' });
      if (!options[index]) return this.setData({ label: '' });
      this.setData({ label: options[index][labelProp] });
    },
  },
  methods: {
    handleChange(e) {
      this.triggerEvent('change', { value: e.detail.value });
    },
    handleRetry() {
      this.triggerEvent('retry');
    },
  },
});
