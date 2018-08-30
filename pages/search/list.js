// list.js

var app = getApp()
var network_util = require('../../utils/network_util.js');
var json_util = require('../../utils/json_util.js');
var http_util = require('../../utils/http_util.js');

var pageNum = 1;//翻页页数
var pageSize = 10;//每页条数


/**
 * 加载活动内容
 */
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
  var reqData = {
    "method": "getPostListBySearchKeyword",
    "parameters": {
      "account": app.globalData.account,
      "password": app.globalData.password,
      "type": "1051",
      "dealType": "0",
      "order": "postid",
      "start": (pageNum - 1) * pageSize,
      "count": pageSize,
      "categoryID": that.data.categoryID,
      "cityid": that.data.cityid,
      "keyword": that.data.keyword,
      "tags": that.data.tags
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
    postList: [],
    hasMore: true,
    loadingHidden: true,
    categoryID: 0,
    cityid: 0,
    scrollTop: 0,
    scrollHeight: 0,
    keyword: "",
    tags: "",
    toastHidden: true, //吐司  
    toastText: '',//吐司文本 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });

      }
    });
    that.setData({
      postList: [],
      scrollTop: 0,
      hasMore: true,
      keyword: option.keyword,
      cityid: option.cityid,
    });
    pageNum = 1;
    loadPageData(that);
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

  },




  // 下拉刷新数据  
  topRefresh: function () {
    this.setData({
      scrollTop: 0,
      hasMore: true,
      postList: [],
    });
    pageNum = 1;
    loadPageData(this);
  },

  // 上拉加载数据 上拉动态效果不明显有待改善  
  pullUpLoad: function () {
    loadPageData(this);
  },

  // 定位数据  
  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
})