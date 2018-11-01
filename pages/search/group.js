// pages/search/group.js

var http_util = require('../../utils/http_util.js');

var app = getApp();

var pageNum = 1;//翻页页数
var pageSize = 20;//每页条数


/**
 * 加载活动内容
 */
var loadGroupData = function (that) {


  try {
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
      "method": "accounGroupAdminList",
      "parameters": {
        "account": app.globalData.account,
        "password": app.globalData.password,
        "start": (pageNum - 1) * pageSize,
        "count": pageSize,
      }
    }



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
        var allData = that.data.groupList;
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
          groupList: allData,
        });



        /*
                const moreCon = [...(allData), ...(list)]
                const con = {
                  postList: moreCon,
                };
                that.setData(con);
        
        */

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
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  }
}





Page({

  /**
   * 页面的初始数据
   */
  data: {
    groupList: [],
    hasMore: true,
    loadingHidden: true,
    scrollTop: 0,
    scrollHeight: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
    var that = this;

    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight - res.windowWidth / 750 * 382
          //scrollHeight: res.windowHeight
        });
      }
    });

    that.setData({
      isSelect: options.isSelect,
      returnPage: options.returnPage,
    });
    pageNum = 1;
    loadGroupData(that);

  },
  tapGroup: function (e) {
    var pages = getCurrentPages();
    if (this.data.returnPage == "add") {
      var prevPage = pages[pages.length - 2];  //上两个页面
      prevPage.setData({
        //tags: e.currentTarget.dataset.name,
        group: e.currentTarget.dataset.name,
        groupid: e.currentTarget.dataset.id,
      })
      wx.navigateBack({
        delta: 1
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
  onPullDownRefresh() {
    this.topRefresh();
  },

  onReachBottom() {
    this.pullUpLoad();
  },


  // 下拉刷新数据  
  topRefresh: function () {
    this.setData({
      scrollTop: 0,
      hasMore: true,
      groupList: [],
    });
    pageNum = 1;
    loadGroupData(this);
  },

  // 上拉加载数据 上拉动态效果不明显有待改善  
  pullUpLoad: function () {
    loadGroupData(this);
  },

  // 定位数据  
  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },

})