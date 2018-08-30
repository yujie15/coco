// pages/message/index.js
var app = getApp();
var json_util = require('../../utils/json_util.js');
var network_util = require('../../utils/network_util.js');
var http_util = require('../../utils/http_util.js');
var comment_pageNum = 1;//翻页页数
var comment_pageSize = 10;//每页条数


var loadCommentData = function (that) {
  that.setData({
    loadingHidden: false,
  });

  if (!that.data.hasMore) {
    that.setData({
      loadingHidden: true,
    });
    return;
  }


  var url1 = app.apiurl;
  var reqData = {
    "method": "accountGetSystemMessageBox",
    "parameters": {
      "account": app.globalData.account,
      "password": app.globalData.password,
      "start": (comment_pageNum - 1) * comment_pageSize,
      "count": comment_pageSize,
      "partition": "comment",
    }
  }



  try {
    var test = { data: reqData, url: url1 };
    http_util.httpPost(test).then(
      function (res) {

        that.setData({
          loadingHidden: true,
        });

        var result = res.result;
        var message = res.message;
        var list = res.data.list;
        var totalCount = res.data.totalCount;
        var allData = that.data.commentList;

        if (totalCount == "0" || result == "4") {
          that.setData({
            hasMore: false,
          });
          return;
        }
        if (result != "0" && result != "4") {
          wx.showModal({
            content: message,
            showCancel: false,
            success: function (res) {
            }
          });
          return;
        }

        for (var i = 0; i < list.length && allData.length < totalCount; i++) {
          allData.push(list[i]);
        }
        that.setData({
          commentList: allData,
        });
        if (allData.length >= totalCount) {
          that.setData({
            hasMore: false,
          });
        } else {
          comment_pageNum++;
        };

      }, function (res) {
        that.setData({
          loadingHidden: true,
        });
        wx.showModal({
          content: '网络连接失败',
          showCancel: false,
          success: function (res) {
          }
        });
      }

    ).catch(function (err) {
      console.log(err);
    });

  } catch (error) {
    console.log(error.message);
  } finally {

  }
}



Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: [],
    hasMore: true,
    loadingHidden: true,
    touch_end: "",
    touch_start: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      commentList: [],
      hasMore: true,
      loadingHidden: true,
    })
    comment_pageNum = 1;
    loadCommentData(this);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    loadCommentData(that);
  },
  delFeel: function (event) {
    let that = this;
    //触摸时间距离页面打开的毫秒数  
    var touchTime = that.data.touch_end - that.data.touch_start;
    console.log(touchTime);
    //如果按下时间大于350为长按  
    if (touchTime > 350) {
      wx.showModal({
        title: '提示',
        content: '确认删除?',
        success: function (res) {
          if (res.confirm) {
            var url1 = app.apiurl;
            var reqData = {
              "method": "accountDeleteNewMessageBox",
              "parameters": {
                "account": app.globalData.account,
                "password": app.globalData.password,
                "id": event.currentTarget.dataset.id
              }
            };


            var test = { data: reqData, url: url1 };
            http_util.httpPost(test).then(
              function (res) {
                var result = res.result;
                var message = res.message;
                if (result != "0") {
                  wx.showModal({
                    content: message,
                    showCancel: false,
                    success: function (res) {

                    }
                  });
                  return;
                }
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000
                })
                that.onLoad();
                return;

              }, function (res) {
                wx.showModal({
                  content: '网络连接失败',
                  showCancel: false,
                  success: function (res) {
                  }
                });
              }
            ).catch(function (err) {
              console.log(err);
            });


          }
        }
      })
    } else {
      wx.navigateTo({
        url: '/pages/detail/detail?postid=' + event.currentTarget.dataset.value
      })
    }
  },
  //按下事件开始  
  mytouchstart: function (e) {
    let that = this;
    that.setData({
      touch_start: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-start')
  },
  //按下事件结束  
  mytouchend: function (e) {
    let that = this;
    that.setData({
      touch_end: e.timeStamp
    })
    console.log(e.timeStamp + '- touch-end')
  },

})