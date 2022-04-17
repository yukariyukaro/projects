const app = getApp();
Page({
  data: {
    user_itsc: '',
    sheet_id: '',
    present_item: '',
    present_num: '',
    imgUrl: '', // 图片地址
    avatar: '',

    bgImageUrl:
      'https://686b-hkupootal-1303942058.tcb.qcloud.la/pyq.jpg?sign=88d1bb2fd22f7108e1f1cc4b027f3d06&t=1603724281', // 海报背景图片，固定地址的网络图片
    qrCodeUrl: '',
    imagePath_bg: undefined, // wx.getImageInfo转化的图片地址；cavas不能直接用网络地址。
    imagePath_qrcode: undefined, /// /wx.getImageInfo转化的图片地址 ;网络动态请求，小程序码网络图片
    imagePath_avatar: undefined,
    tempSavedImageURL: '', // cavas绘制图片临时保存路径
    // 注意，背景图片时固定大小600x1067，所以canvasStyle宽高比例必须也一致！否则画出来的图片会有多余的一片空白。
    canvasStyle: 'width: 750px;height:600px;position: fixed;top: -10000px;',
  },

  getWxacode() {
    wx.cloud.init();
    const that = this;
    // 调用云函数 获取 内容
    wx.cloud.callFunction({
      name: 'generateQRCode',
      data: {
        page: 'pages/func0/problemDetail/problemDetail',
        user_itsc: that.data.user_itsc,
        sheet_id: that.data.sheet_id,
      },
      success: (res) => {
        console.log('云函数调用成功', res);
        that.setData({
          qrCodeUrl: res.result.fileID,
        });
        that.draw_try();
      },
      fail: (err) => {
        wx.hideLoading();
        app.showModal({
          title: '失败',
          content: '获取分享图片失败' + err,
        });
        console.error('云函数调用失败', err);
        wx.hideLoading();
      },
    });
  },

  draw_try: function (e) {
    const urlStr = this.data.qrCodeUrl;
    const avatarStr = this.data.avatar;
    if (urlStr == '' || urlStr == undefined || avatarStr == '' || avatarStr == undefined) {
      return;
    }
    const that = this;
    // 背景图片
    wx.getImageInfo({
      src: that.data.bgImageUrl,
      success: function (sres) {
        that.data.imagePath_bg = sres.path;
        that.drawCanvasCxt_try();
      },
      fail: function (err) {},
    });
    // 小程序码图片
    wx.getImageInfo({
      src: urlStr,
      success: function (sres) {
        that.data.imagePath_qrcode = sres.path;
        that.drawCanvasCxt_try();
      },
      fail: function (err) {},
    });
    // 头像
    wx.getImageInfo({
      src: avatarStr,
      success: function (sres) {
        that.data.imagePath_avatar = sres.path;
        that.drawCanvasCxt_try();
      },
      fail: function (err) {},
    });
  },

  drawCanvasCxt_try: function () {
    // 异步调2次此方法；需获取到2张图片特殊路径canvas才能开始绘图
    if (
      this.data.imagePath_bg != undefined &&
      this.data.imagePath_qrcode != undefined &&
      this.data.imagePath_avatar != undefined
    ) {
      this.drawCanvasCxt(
        this.data.imagePath_bg,
        this.data.imagePath_qrcode,
        this.data.imagePath_avatar
      );
    }
  },

  drawCanvasCxt: function (imagePath_bg, imagePath_qrcode, imagePath_avatar) {
    const res = wx.getSystemInfoSync();
    const platform = res.platform;
    let time = 0;
    if (platform === 'android') {
      // 在安卓平台，经测试发现如果海报过于复杂在转换时需要做延时，要不然样式会错乱
      time = 300;
    }
    // 绘制背景图片，大小跟cavas一致。单位是px。如果是本地图片，不要搞太高清，毕竟小程序限制打包后<2M。
    this.ctx.drawImage(imagePath_bg, 0, 0, 750, 600);
    // 算出小程序码相对于背景海报的坐标。可以写个大概再根据效果慢慢调整
    this.ctx.drawImage(imagePath_qrcode, 280, 190, 190, 190);
    this.ctx.font = 'normal bold 30px sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(this.data.present_item + ' * 共' + this.data.present_num + '份', 375, 530);

    this.ctx.beginPath(); // 开始创建一个路径
    this.ctx.arc(375, 285, 45, 0, 2 * Math.PI, false); // 画一个圆形裁剪区域
    this.ctx.clip(); // 裁剪
    this.ctx.closePath();
    this.ctx.drawImage(imagePath_avatar, 330, 240, 90, 90);
    this.ctx.restore();//恢复之前保存的绘图上下文
    let that = this;
    //开始渲染
    this.ctx.draw(false, () => {
      setTimeout(() => {
        wx.canvasToTempFilePath({
          canvasId: 'myCanvas',
          success: function (res) {
            wx.hideLoading();
            const url = res.tempFilePath;
            console.log('url=' + url);
            that.setData({
              // 绘制完毕，显示到image对象上。
              tempSavedImageURL: url, // 返回的图片地址保存到一个全局变量里
            });
          },
          fail: function (失败) {
            wx.hideLoading();
            app.showModal({
              title: '错误',
              content: '绘制失败',
            });
          },
          complete: function () {},
        });
      }, time);
    });
  },

  onLoad: function (options) {
    var that = this;
    wx.showLoading({
      title: '请等待10秒..',
    });
    if (options) {
      that.data.user_itsc = options.user_itsc;
      that.data.sheet_id = options.sheet_id;
      that.data.present_item = options.present_item;
      that.data.present_num = options.present_num;
      that.data.avatar = options.avatar;
      that.ctx = wx.createCanvasContext('myCanvas', this);
      // 创建ctx耗时较长，延时500毫秒再请求url
      setTimeout((res) => {
        that.getWxacode();
      }, 500);
    } else {
      wx.redirectTo({
        url: 'pages/home/home',
      });
    }
  },
});
