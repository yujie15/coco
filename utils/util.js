function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()
  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

//格式化日期,
function formatDate(date, format) {
  var paddNum = function (num) {
    num += "";
    return num.replace(/^(\d)$/, "0$1");
  }
  //指定格式字符
  var cfg = {
    yyyy: date.getFullYear() //年 : 4位
    , yy: date.getFullYear().toString().substring(2)//年 : 2位
    , M: date.getMonth() + 1  //月 : 如果1位的时候不补0
    , MM: paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
    , d: date.getDate()   //日 : 如果1位的时候不补0
    , dd: paddNum(date.getDate())//日 : 如果1位的时候补0
    , hh: paddNum(date.getHours())  //时
    , mm: paddNum(date.getMinutes()) //分
    , ss: paddNum(date.getSeconds()) //秒
  }
  format || (format = "yyyy-MM-dd hh:mm:ss");
  return format.replace(/([a-z])(\1)*/ig, function (m) { return cfg[m]; });
} 

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatLocation(longitude, latitude) {
  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}


/**
 * 可以上传多个附件
 * uploadurl 上传服务器后台URL
 * page 页面对象
 * callback 回调方法
 * 说明：page的data里需要有uploadurls
 */

function upload(uploadurl, page, callback) {
  var uploadCount = 0;
  var localLength = page.data.uploadimgs.length;
  var serverMsg = [];
  var upload = function () {
    wx.showToast({
      icon: "loading", title: "正在上传" + (uploadCount + 1), duration: 10000,
    });
    wx.uploadFile({
      url: uploadurl,
      filePath: page.data.uploadimgs[uploadCount], name: 'file',
      header: { "Content-Type": "multipart/form-data" },
      formData: {       //和服务器约定的token, 一般也可以放在header中 
        'session_token': wx.getStorageSync('session_token')
      },
      success: function (res) {
        if (res.statusCode != 200) {
          wx.showModal({ title: '提示', content: '上传失败', showCancel: false })
          return;
        }
        var data = JSON.parse(res.data);
        serverMsg[uploadCount] = data.msg;
        uploadCount++;
        if (uploadCount < localLength) {
          upload();
        }
      }, fail: function (e) {
        console.log(e);
        wx.showModal({
          title: '提示',
          content: '上传失败',
          showCancel: false
        })
      }, complete: function () {
        if (uploadCount == localLength) {
          page.setData({
            uploadurls: serverMsg
          })
          wx.hideToast();  //隐藏Toast 
          callback();
          //eval(functionName + "()");
        }
      }
    })
  }
  upload();
}

module.exports = {
  formatTime: formatTime,
  upload: upload,
  formatLocation: formatLocation,
  formatDate: formatDate,
}