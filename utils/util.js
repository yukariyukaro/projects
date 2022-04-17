const formatTime = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  return (
    [year, month, day].map(formatNumber).join('/') +
    ' ' +
    [hour, minute, second].map(formatNumber).join(':')
  );
};

const formatNumber = (n) => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500;
  }

  let _lastTime = null;

  // 返回新的函数
  return function () {
    const _nowTime = +new Date();
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments); // 将this和参数传给原函数
      _lastTime = _nowTime;
    }
  };
}

function debounce(fn, gapTime) {
  let timer = null;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(context, args), gapTime);
  };
}

const setStorageDebounced = debounce(wx.setStorage, 2000);

module.exports = {
  formatTime,
  throttle,
  debounce,
  setStorageDebounced,
};
