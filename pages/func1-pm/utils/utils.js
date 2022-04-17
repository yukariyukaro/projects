const app = getApp();

function deletePm(pm_id, type, union) {
  const url =
    app.globalData.URL +
    (type === 'receive' ? '/pm/rcvdelete' : '/pm/sdrdelete') +
    `?pm_id=${pm_id}&union=${!!union}`;
  wx.showLoading({
    title: '正在删除私信',
  });

  
  return app.request('POST', url, null).then((res) => {
    wx.hideLoading();
    if (res.error !== 'false') {
      app.showModal({
        title: '提示',
        showCancel: false,
        content: '删除私信失败' + res.error,
      });
    }
    return res;
  });
}

module.exports = {
  deletePm,
};
