const cloud = require('wx-server-sdk');
cloud.init();
exports.main = async (event, context) => {
  const user_itsc = event.user_itsc;
  const sheet_id = event.sheet_id;
  try {
    const result = await cloud.openapi.wxacode.getUnlimited({
      page: event.page,
      width: 300,
      scene: user_itsc + '&' + sheet_id,
      is_hyaline: true,
    });
    console.log(result);
    return await cloud.uploadFile({
      cloudPath: 'test/' + user_itsc + '_' + sheet_id + '.jpg',
      fileContent: result.buffer, // 处理buffer 二进制数据
      success: (res) => {
        // 文件地址
        console.log(res.fileID);
      },
      fail: console.error,
    });
  } catch (err) {
    console.log(err);
    return err;
  }
};
