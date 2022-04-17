Component({
  behaviors: ['wx://form-field'],
  properties: {
    options: {
      type: Array,
      value: [],
    },
  },
  data: {
    selectedIndices: [],
    valueRange: [],
    value: [],
  },
  methods: {
    handleChange: function (e) {
      const selectedIndex = Number(e.detail.value);
      const { optionIndex } = e.currentTarget.dataset;
      const { value, selectedIndices } = this.data;
      const newValue = [ ...value ];
      const newSelectedIndices = [ ...selectedIndices ];
      newSelectedIndices[optionIndex] = selectedIndex;
      newValue[optionIndex] = selectedIndex + 1;
      this.setData({
        value: newValue,
        selectedIndices: newSelectedIndices,
      });
    },
  },
  lifetimes: {
    attached: function () {
      const { options } = this.properties;
      this.setData({
        selectedIndices: Array(options.length).fill(-1),
        valueRange: options.map((_, i) => i + 1),
        value: Array(options.length).fill(0),
      });
    }
  }
})
