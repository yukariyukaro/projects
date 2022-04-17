// 云函数入口文件
const cloud = require('wx-server-sdk');
var rp = require('request-promise');
cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const {
    reportBody
  } = event.body;
  const reqUrl = 'https://hooks.slack.com/services/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';
  let text = "";
  if (reportBody.type == "post") {
    text = `【${reportBody.school}】${reportBody.itsc}举报了id为 ${reportBody.post_serial} 的帖子 | 【举报理由】：${reportBody.reason} | 【帖子内容】：${reportBody.content}`
  } else if (reportBody.type === "comment") {
    text = `【${reportBody.school}】${reportBody.itsc}举报了#${reportBody.post_serial} 帖子下的第 ${reportBody.comment_floor} 楼的评论（${reportBody.comment_id}） | 【举报理由】：${reportBody.reason} | 【评论内容】：${reportBody.content}`
  } else if (reportBody.type === "pm") {
    text = `【${reportBody.school}】${reportBody.itsc}举报了${reportBody.is_union ? '联校' : '本校'
    }#${reportBody.pm_id} 私信 | 【举报理由】：${reportBody.reason} | 【私信内容】：${reportBody.content}`
  }
  var options = {
    uri: reqUrl,
    method: 'post',
    json: true,
    body: {
      text
    }
  }
  return await rp(options)
    .then((res) => {
      return {
        error: 'false'
      };
    })
    .catch((err) => {
      return err;
    });
};