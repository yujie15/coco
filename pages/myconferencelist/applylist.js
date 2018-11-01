var app = getApp();
var http_util = require('../../utils/http_util.js');
var pageNum = 1;//翻页页数
var pageSize = 10;//每页条数

var loadPageData = function (that) {
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
  var reqData;
  reqData = {
    "method": "getPostFeelByRelation",
    "parameters": {
      "account": app.globalData.account,
      "password": app.globalData.password,
      "id": that.data.postid,
      "start": (pageNum - 1) * pageSize,
      "count":pageSize,
      "isFriended": 0
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
        var allData = that.data.applyList;


        if (result == "4" || totalCount == "0") {
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
          applyList: allData,
        });
        if (allData.length >= totalCount) {
          that.setData({
            hasMore: false,
          });
        } else {
          pageNum++;
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


var loadPostData = function (that) {
  var url1 = app.apiurl;
  var reqData = {
    "method": "getPostDetail",
    "parameters": {
      "account": app.globalData.account,
      "password": app.globalData.password,
      "id": that.data.postid
    }
  }

  try {
    var test = {
      data: reqData,
      url: url1
    };
    http_util.httpPost(test).then(
      function (res) {

        var result = res.result;
        var message = res.message;

        if (result != "0") {
          wx.showModal({
            content: message,
            showCancel: false,
            success: function (res) { }
          });
          return;
        }
        var data1 = res.data;


        that.setData({
          userpost: data1,

        });

      },
      function (res) {

        wx.showModal({
          content: '网络连接失败',
          showCancel: false,
          success: function (res) { }
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
// pages/myconferencelist/applylist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasMore: true,
    loadingHidden: true,
    applyList: [],
    postid: "",
    userpost:{},
    account:"",
    markId:"",
    actionSheetHidden: true,
    actionSheetItems: [
      { bindtap: 'Delete', txt: '删除报名' },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    if (options && options.postid) {
      that.setData({
        postid: options.postid,
      })
    }

    that.setData({
      applyList: [],
      hasMore: true,
      loadingHidden: true,
      account: app.globalData.account
    });

    pageNum = 1;

    loadPageData(that);
    loadPostData(that);

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
    loadPageData(that);
  },

  tapApplyManage: function (event) {

    console.log("event.currentTarget.dataset.markId:"+event.currentTarget.dataset.markid);
    this.setData({
      markId: event.currentTarget.dataset.markid,
      actionSheetHidden: !this.data.actionSheetHidden
    })

    console.log(this.data.postid);
  },
  actionSheetbindchange: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindMenuDelete: function () {
    var that = this;
    console.log("postid："+that.data.postid);
    console.log(that.data.markId);

    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })

    wx.showModal({
      title: '提示',
      content: '确认删除?',
      success: function (res) {
        if (res.confirm) {
          var url1 = app.apiurl;
          var reqData = {
            "method": "accountDeleteCommentFeel",
            "parameters": {
              "account": app.globalData.account,
              "password": app.globalData.password,
              "id": that.data.postid,
              "markId": that.data.markId,
            }
          };

          var test = {
            data: reqData,
            url: url1
          };
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
                title: message,
                icon: 'success',
                duration: 1000
              })
              that.onLoad();
              return;

            },
            function (res) {
              wx.showModal({
                content: '网络连接失败',
                showCancel: false,
                success: function (res) { }
              });
            }
          ).catch(function (err) {
            console.log(err);
          });


        }
      }
    })

  },
})