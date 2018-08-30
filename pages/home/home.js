// pages/home/home.js

var app = getApp();
var network_util = require('../../utils/network_util.js');
var http_util = require('../../utils/http_util.js');

var pageNum = 1;//翻页页数
var pageSize = 10;//每页条数

function loadUserData(that) {

  var reqData = {
    "method": "getUserInfo",
    "parameters": {
      "account": app.globalData.account,
      "password": app.globalData.password,
      "user": that.data.user
    }
  }

  var url1 = app.apiurl;
  network_util._post_json(url1, reqData,
    function (res) {
      var result = res.data.result;
      var message = res.data.message;
      if (result != "0") {
        wx.showModal({
          content: message,
          showCancel: false,
          success: function (res) {
          }
        });
        return;
      }
      var data1 = res.data.data;
      that.setData({
        userInfo: data1,
      });
      if (data1.avatar && data1.avatar!=""){
        that.setData({
          avatar: data1.avatar,
        });
      }
      that.setData({
        loadingHidden: true,
      });
    }, function (res) {
      wx.showModal({
        content: '网络连接失败',
        showCancel: false,
        success: function (res) {
        }
      });
    });
}


/**
 * 加载活动内容
 */
var loadPostData = function (that) {
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
    "method": "getPostListBySearchKeyword",
    "parameters": {
      "account": app.globalData.account,
      "password": app.globalData.password,
      "type": "1051",
      "dealType": "6",
      "order": "postid",
      "start": (pageNum - 1) * pageSize,
      "count": pageSize,
      "user": that.data.user,
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
        var allData = that.data.postList;
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
          postList: allData,
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

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    user: "",
    avatar: "../../images/msn.png",
    hasMore: true,
    loadingHidden: true,
    postList: [],
    scrollTop: 0,
    scrollHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 382
        });
      }
    });

    if (options && options.user) {
      that.setData({
        user: options.user,
      })
    }

    that.setData({
      postList: [],
      scrollTop: 0,
      hasMore: true,
    });

    pageNum = 1;
    loadUserData(this);
    loadPostData(this);
  },
  // 上拉加载数据 上拉动态效果不明显有待改善  
  pullUpLoad: function () {
    console.log("pullUpLoad");
    loadPageData(this);
  },
  // 定位数据  
  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
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
    console.log(this.data.userInfo);
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


  avatarPreview: function (e) { //图片预览

    if (e.currentTarget.dataset.url != "") {
      const imgs = [e.currentTarget.dataset.url];
      wx.previewImage({
        current: imgs[0], // 当前显示图片的http链接
        urls: imgs // 需要预览的图片http链接列表
      })
    }
  },




})