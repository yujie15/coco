var app = getApp()
var json_util = require('../../utils/json_util.js');
var http_util = require('../../utils/http_util.js');

var event_pageNum = 1; //翻页页数

var pageSize = 10; //每页条数

/**
 * 加载活动内容
 */
var loadEventData = function(that) {


  try {
    that.setData({
      loadingHidden: false,
    });

    if (!that.data.event_hasMore) {
      that.setData({
        loadingHidden: true,
      });
      return;
    }



    var url1 = app.apiurl;
    var reqData = {
      "method": "getUserEventList",
      "parameters": {
        "account": app.globalData.account,
        "password": app.globalData.password,
        "user": app.globalData.account,
        "start": (event_pageNum - 1) * pageSize,
        "count": pageSize,
      }
    }


    var test = {
      data: reqData,
      url: url1
    };
    http_util.httpPost(test).then(
      function(res) {
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
            event_hasMore: false,
          });
          return;
        }


        if (result != "0" && result != "4") {
          wx.showModal({
            content: message,
            showCancel: false,
            success: function(res) {}
          });
          return;
        }

        for (var i = 0; i < list.length && allData.length < totalCount; i++) {
          allData.push(list[i]);
        }
        that.setData({
          postList: allData,
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
            event_hasMore: false,
          });
        } else {
          event_pageNum++;
        };

      },
      function(res) {
        that.setData({
          loadingHidden: true,
        });
        wx.showModal({
          content: '网络连接失败',
          showCancel: false,
          success: function(res) {}
        });
      }

    ).catch(function(err) {
      console.log(err);
    });

  } catch (error) {
    console.log(error.message);
  } finally {
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  }
}




// pages/coco/event.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: "",
    postList: [],
    event_hasMore: true,
    loadingHidden: true,
    toastHidden: true,
    userInfo: null,
  },
  // 下拉刷新数据  
  topRefresh: function() {
    this.setData({
      scrollTop: 0,
    });

    event_pageNum = 1;
    this.setData({
      postList: [],
      event_hasMore: true,
    });
    loadEventData(this);


  },

  // 上拉加载数据 上拉动态效果不明显有待改善  
  pullUpLoad: function() {

    loadEventData(this);

  },

  // 定位数据  
  scroll: function(event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;

    console.log("scene:" + options.scene);
    if (options.scene) {
      var scene = decodeURIComponent(options.scene);
      console.log("go scene");
      wx.navigateTo({
        url: "../detail/detail?postid=" + scene
      })
    }
    
    app.checkLogin();

    // 高度自适应
    wx.getSystemInfo({
      success: function(res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR;
        that.setData({
          winHeight: calc
        });
      }
    });

    that.setData({
      types: [],
      postList: [],
      scrollTop: 0,
      event_hasMore: true,

    });
    event_pageNum = 1;
    loadEventData(that);


  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;

    app.checkLogin();

    //注意顺序，先设置标签
    that.setData({
      account: app.globalData.account,
      userInfo: app.globalData.userInfo,
    });

    if (app.reload == "1") {
      app.reload = "";
      that.topRefresh();
    }
    //延时刷新
    if (app.reload == "2") {
      app.reload = "";
      setTimeout(function() {
        that.topRefresh();
      }, 5000);
    }
    //


    var show_postid = (wx.getStorageSync('show_postid') || 0);

    if (show_postid > 0) {
      wx.setStorageSync('show_postid', 0);
      wx.navigateTo({
        url: "../detail/detail?postid=" + show_postid
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.topRefresh();

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.pullUpLoad();

  },

  /**
   * 用户点击右上角分享
   */


  tapCreateEvent: function(event) {
    wx.navigateTo({
      url: '/pages/add/add'
    })

  },

  tapHome: function(e) {
    var that = this;
    wx.navigateTo({
      url: '/pages/user/my'
    })
  },
})