// 云函数入口文件
const cloud = require('wx-server-sdk');
var rp = require('request-promise');
cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const bv = event.body.inputTxt;
  const reqUrl = 'https://api.bilibili.com/x/web-interface/view?bvid=' + bv;
  return await rp(reqUrl)
    .then((res) => {
      const data = JSON.parse(res);
      if (data.code === -400) {
        return {
          error: "找不到对应视频"
        };
      }
      if (data.code === 0) {
        return {
          error: "false",
          data: {
            musicId: "1024",
            musicSource: "BILIBILI",
            title: data.data.title,
            cover: data.data.pic,
            epname: bv,
            player: data.data.owner.name
          }
        }
      }
      return {
        error: '发生未知错误'
      };
    })
    .catch((err) => {
      return err;
    });
};