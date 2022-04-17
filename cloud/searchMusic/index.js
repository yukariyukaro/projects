// 云函数入口文件
const cloud = require('wx-server-sdk');
var rp = require('request-promise');
cloud.init();

// 云函数入口函数
exports.main = async (event, context) => {
  const mId = fetchMID(event);
  if (mId.error) {
    return { error: mId.error };
  }
  const reqUrl = 'https://music.163.com/api/song/detail/?id=' + mId + '&ids=%5B' + mId + '%5D';
  return await rp(reqUrl)
    .then((res) => {
      const data = stringPorcessor(res, mId);
      if (data.error) {
        return { error: data.error };
      }
      return { error: 'false', data: data };
    })
    .catch((err) => {
      return err;
    });
};

// searchMusic.js  检索音乐 返回音乐数据
// @param {String} uId: 用户uId
// @param {String} inputTxt: 粘贴的文字
// @param {String} musicSource: 音乐源，目前只有 NETEASE
// @return {Array} 元素结构：{}

function fetchMID(request) {
  const inputTxt = request.body.inputTxt;
  if (!inputTxt) {
    return { error: '没有 inputTxt' };
  }
  let mId;
  let keywords = [
    "music.163.com/song/",
    "music.163.com/song?",
    "music.163.com/#/song?",
    "y.music.163.com/m/song/",
    "y.music.163.com/m/song?",
    "y.music.163.com/#/song?",
  ]

  let idx = -1
  let keyWord;
  for(let i=0; i<keywords.length; i++) {
      keyWord = keywords[i]
      idx = inputTxt.indexOf(keyWord)
      if(idx >= 0) break
  }

  if(idx < 0) {
    return {error: "找不到匹配的关键词"}
  }

  let tmpstr1 = inputTxt.substring(idx + keyWord.length) //把前面 域名 和 无关的路径截掉

  tmpstr1.split("&").forEach(ele => {
    if (ele.split("=")[0] == "id"){
      mId = ele.split("=")[1];
    }
  })
  return mId;
}
function stringPorcessor(raw, mId) {
  if (typeof raw === 'string') raw = JSON.parse(raw);
  // return raw
  const songs = raw.songs || [];
  if (!songs || songs.length < 1) {
    return { error: '搜索没有结果' };
  }

  const song = songs[0];
  const album = song.album || {};
  const artists = song.artists || [];
  const bMusic = song.bMusic || {};
  // return song
  const linkData = {
    linkType: 'MUSIC',
    musicId: mId,
    musicSource: 'NETEASE',
    title: song.name || 'UNKNOWN',
    cover: album.picUrl || '',
    epname: album.name || '',
    player: '',
    extension: bMusic.extension || '',
  };

  if (artists.length === 1) {
    linkData.player = artists[0].name;
  } else if (artists.length > 1) {
    for (let i = 0; i < artists.length; i++) {
      linkData.player += artists[i].name;
      if (i < artists.length - 1) {
        linkData.player += ' / ';
      }
    }
  }
  return linkData;
}
