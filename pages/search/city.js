// pages/search/city.js
var http_util = require('../../utils/http_util.js');

var app = getApp();

var loadCityData = function (that) {

  that.setData({
    loadingHidden: false,
  });


  var url1 = app.apiurl;
  var reqData = {
    "method": "getCategoryList",
    "parameters": {
      "type": "2",
      "categoryID": that.data.cityid,
      "items": 0,
    }
  }
  var test = { data: reqData, url: url1 };


  http_util.httpPost(test).then(

    function (res) {

      that.setData({
        loadingHidden: true,
      });
      var result = res.data.result;
      var message = res.data.message;
      var list = res.data.list;

      var all = [{
        "categoryID": that.data.cityid,
        "categoryName": that.data.cityname
      }]
      const moreCon = [...(all), ...(list)]

      that.setData({

        cityList: moreCon,
      });
    },

    function (res) {

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

  );

}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityid: 0,
    cityname: 0,
    returnPage: "",
    cityList: [],
    loadingHidden: true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cityid: options.cityid,
      cityname: options.cityname,
      returnPage: options.returnPage
    });

    loadCityData(this);
  },


  tapSchool: function (e) {
    var pages = getCurrentPages();
    if (this.data.returnPage == "add") {
      var prevPage = pages[pages.length - 3];  //上两个页面
      prevPage.setData({
        //tags: e.currentTarget.dataset.name,
        school: e.currentTarget.dataset.name,
        schoolid: e.currentTarget.dataset.id,
      })
      wx.navigateBack({
        delta: 2
      })
    } else {
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.setData({
       // categoryID: "0",
        currentTab: "0"
      })
      app.reload = 1;
      app.globalData.school = e.currentTarget.dataset.name;
      app.globalData.schoolid = e.currentTarget.dataset.id;
      wx.setStorageSync('globalData', app.globalData);
      wx.switchTab({
        url: '../group/index',
        success: function (e) {
        }
      })
    }
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


})