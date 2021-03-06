// pages/coco/gourp.js


//获取应用实例
var app = getApp()
var json_util = require('../../utils/json_util.js');
var http_util = require('../../utils/http_util.js');

var group_pageNum = 1; //翻页页数
var pageSize = 10; //每页条数

/**
 * 加载圈子内容
 */
var loadGroupData = function(that) {


  try {
    that.setData({
      loadingHidden: false,
    });

    if (!that.data.group_hasMore) {
      that.setData({
        loadingHidden: true,
      });
      return;
    }


    var method = "accounGroupLiveList";

    var url1 = app.apiurl;
    var reqData = {
      "method": method,
      "parameters": {
        "account": app.globalData.account,
        "password": app.globalData.password,
        "start": (group_pageNum - 1) * pageSize,
        "count": pageSize
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
        var allData = that.data.groupList;
        if (result == "4" || totalCount == "0") {
          that.setData({
            group_hasMore: false,
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
            group_hasMore: false,
          });
        } else {
          group_pageNum++;
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


Page({

  /**
   * 页面的初始数据
   */
  data: {
    account: "",    
    groupList: [],
    group_hasMore: true,
    loadingHidden: true,
    toastHidden: true,
    userInfo: null,
    loading: false,

  },

  // 下拉刷新数据  
  topRefresh: function() {
    console.log("topRefresh");
    this.setData({
      scrollTop: 0,
    });

    group_pageNum = 1;
    this.setData({
      groupList: [],
      group_hasMore: true,
    });
    loadGroupData(this);


  },

  // 上拉加载数据 上拉动态效果不明显有待改善  
  pullUpLoad: function() {
    loadGroupData(this);
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

    if (options&&options.scene) {
      var scene = decodeURIComponent(options.scene);
      console.log("go scene");
      wx.navigateTo({
        url: "../group/detail?groupid=" + scene
      })
    }

    
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
      groupList: [],
      scrollTop: 0,
      group_hasMore: true,

    });



    if (app.globalData.userInfo != null) {
      group_pageNum = 1;
      loadGroupData(that);
    }


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
    //注意顺序，先设置标签

    that.setData({
      account: app.globalData.account,
      userInfo: app.globalData.userInfo
    })


    if (app.globalData.userInfo == null) {
      that.setData({
        types: [],
        groupList: [],
        scrollTop: 0,
        group_hasMore: true,
      });
    }


    if (app.reload == "1") {
      app.reload = "";
      that.topRefresh();
    }
    //延时刷新
    if (app.reload == "2") {
      app.reload = "";
      setTimeout(function() {
        that.topRefresh();
      },3000);
    }
    //
    var show_groupid = (wx.getStorageSync('show_groupid') || 0);

    if (show_groupid > 0) {
      wx.setStorageSync('show_groupid', 0);
      wx.navigateTo({
        url: "../group/detail?groupid=" + show_groupid
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

  tapCreateGroup: function(event) {
    wx.navigateTo({
      url: '/pages/group/add'
    })
  },

  tapHome: function(e) {
    var that = this;
    wx.navigateTo({
      url: '/pages/user/my'
    })
  },
  tapCoco: function (e) {
    var that = this;
    wx.navigateTo({
      url: '/pages/group/index'
    })
  },
  
  tapLogin: function () {

    var that = this

    that.setData({
      loading: true
    });

    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据，页面自动渲染
      that.setData({
        userInfo: userInfo,
        loading: false,
      })

    });



  },
})