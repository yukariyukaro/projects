const form = {
  id: 69,
  title: "一周CP报名表",
  footer: "我们不会将你的信息用在其他地方",
  fields: [{
      label: "你的姓名",
      options: null,
      type: "input"
    },
    {
      label: "你的性别",
      options: ["男", "女"],
      type: "radio"
    },
    {
      label: "对方学校",
      options: ["CU", "UST", "HKU"],
      type: "checkbox"
    },
    {
      label: "用1到3排序你最看重的特质",
      options: ["长相", "性格", "财富"],
      type: "sort"
    },
  ]
};
const app = getApp();

Page({
  data: {
    formId: '',
    form: {},
    loading: false,
    error: '',
    primaryColor: app.globalData.theme.primary,
    secondaryColor: app.globalData.theme.secondary,
  },
  formSubmit(e) {
    const rawAns = e.detail.value;
    if (!this.formValidate(rawAns)) {
      return;
    }
    wx.showLoading({
      title: '正在提交',
    })
    const {
      form: {
        fields
      },
      formId: id
    } = this.data;
    const answers = [];
    Object.entries(rawAns).forEach(([idx, value]) => {
      switch (fields[idx].type) {
        case 'radio':
          answers[idx] = fields[idx].options.indexOf(value).toString();
          break;
        case 'checkbox':
          answers[idx] = value.map(v => fields[idx].options.indexOf(v)).toString().replace(/,/g, "|");
          break;
        case 'sort':
          const ansFromZero = value.map(ele => ele - 1)
          answers[idx] = ansFromZero.toString().replace(/,/g, "|");
          break;
        default:
          answers[idx] = value.toString();
      }
    });
    const url = app.globalData.URL + '/survey/submit';
    app.request('POST', url, {
      survey_id: Number(id),
      answers
    }, {
      json: true
    }).then((res) => {
      wx.hideLoading();
      const {
        error
      } = res;
      if (error == 'false') {
        wx.showToast({
          title: '成功提交问卷',
          icon: 'none',
          duration: 500,
        });
        setTimeout(
          () =>
            wx.navigateBack({
              delta: 1,
            }),
          600
        );
      } else {
        app.showModal({
          title: '提示',
          showCancel: false,
          content: '提交问卷失败' + res.error,
        });
      }
    })
  },
  formValidate(rawAns) {
    for (const ansIdx in rawAns) {
      const ans = rawAns[ansIdx];
      if (ans.length === 0 && !this.data.form.fields[ansIdx].optional) {
        wx.showToast({
          title: `请完成第${Number(ansIdx) + 1}题`,
          icon: 'none',
          duration: 1000
        })
        return false;
      } else if (Array.isArray(ans) && Number.isInteger(ans[0])) {
        let sortFlag = 1;
        while (sortFlag <= ans.length) {
          if (ans.indexOf(sortFlag) === -1) {
            wx.showToast({
              title: `第${Number(ansIdx) + 1}题排序格式有误`,
              icon: 'none',
              duration: 1000
            })
            return false;
          }
          sortFlag++;
        }
      }
    }
    return true;
  },
  getForm(id) {
    id = id || this.data.formId;
    const url = app.globalData.URL + `/survey/get?survey_id=${id}`;
    const data = null;
    this.setData({
      loading: true
    });
    wx.showLoading({
      title: '加载中',
    });
    app.request('POST', url, data).then((res) => {
      wx.hideLoading();
      const {
        error,
        ...form
      } = res;
      if (error == 'false') {
        form.fields.forEach((field, i) => {
          field.index = i;
          if (field.label.indexOf('@optional@') !== -1) {
            field.optional = true;
            field.label = field.label.replace('@optional@', "")
          }
        })
        this.setData({
          form,
          loading: false
        });
      } else {
        this.setData({
          loading: false,
          error
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      id
    } = options;
    this.setData({
      formId: id
    });
    this.getForm(id);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const {
      form,
      formId
    } = this.data;
    return {
      title: `HKU噗噗：${form.title || '来填写问卷吧'}`,
      path: `/pages/survey/survey?id=${formId}`,
    };
  }
})