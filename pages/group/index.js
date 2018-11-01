// pages/group/index.js

//index.js
//获取应用实例
var app = getApp()
var json_util = require('../../utils/json_util.js');
var http_util = require('../../utils/http_util.js');

var group_pageNum = 1; //翻页页数
var event_pageNum = 1; //翻页页数

var pageSize = 10; //每页条数

var loadCityData = function(that) {
  var url1 = app.apiurl;
  var reqData = {
    "method": "getCategoryList",
    "parameters": {
      "type": "2"
    }
  }
  var test = {
    data: reqData,
    url: url1
  };

  http_util.httpPost(test).then(

    function(res) {
      var result = res.data.result;
      var message = res.data.message;
      var list = res.data.list;

      var all = [{
        "categoryID": '0',
        "categoryName": "不限"
      }]
      const moreCon = [...(all), ...(list)]

      that.setData({
        cityList: moreCon,
      });
    },

    function(res) {
      wx.showModal({
        content: '网络连接失败',
        showCancel: false,
        success: function(res) {}
      });
    }

  );

}


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


    var method = "getGroupListByOrder";

    var url1 = app.apiurl;
    var reqData = {
      "method": method,
      "parameters": {
        "account": app.globalData.account,
        "password": app.globalData.password,
        "start": (group_pageNum - 1) * pageSize,
        "count": pageSize,
        "order": "",
        "isBest": "1",
        //"cityid": that.data.schoolid,
        "photo": that.data.havaPhoto,
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
      "method": "getPostListByEvent",
      "parameters": {
        "account": app.globalData.account,
        "password": app.globalData.password,
        "user": app.globalData.account,
        "start": (event_pageNum - 1) * pageSize,
        "count": pageSize,
        "type": "1051",
        //"cityid": that.data.schoolid,
        "keyword": that.data.keyword,
        "tags": that.data.tags,
        "photo": that.data.havaPhoto,
        "isBest": "1",
        "order": "postid",

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




Page({

  /**
   * 页面的初始数据
   */
  data: {
    // nav 初始化
    winHeight: "", //窗口高度
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置

    // nav 初始化
    groupList: [],
    postList: [],
    cityList: [],
    schoolList: [],

    group_hasMore: true,
    event_hasMore: true,
    groupViews: [{
        "current": 0,
        "name": "推荐活动",
        "value": ""
      },

      {
        "current": 1,
        "name": "推荐群组",
        "value": ""
      },


    ],
    cover: "https://sports.ttyclub.com/images/coco/sanhome1.jpg",

    title_city: "地区",
    title_school: "学校",


    loadingHidden: true,
    toastHidden: true,
    schoolid: "",
    school: "地区",
    keyword: "",
    tags: "",
    isNext: false,
    havaPhoto: 1,
    shownavindex: '',
    qy: [],
    nz: [],
    px: [],
    qyopen: false,
    qyshow: false,
    nzopen: false,
    nzshow: false,
    pxopen: false,
    pxshow: false,
    isfull: false,
  },

  listqy: function(e) {
    if (this.data.qyopen) {
      this.setData({
        qyopen: false,
        qyshow: false,
        nzopen: false,
        nzshow: false,
        pxopen: false,
        pxshow: false,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        qyopen: true,
        qyshow: true,
        nzopen: false,
        nzshow: false,
        pxshow: false,
        pxopen: false,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }

  },
  listnz: function(e) {
    if (this.data.nzopen) {
      this.setData({
        nzopen: false,
        pxopen: false,
        qyopen: false,
        nzshow: false,
        pxshow: false,
        qyshow: false,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        nzopen: true,
        pxopen: false,
        qyopen: false,
        nzshow: true,
        pxshow: false,
        qyshow: false,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }
  },
  listpx: function(e) {

    if (this.data.pxopen) {
      this.setData({
        nzopen: false,
        pxopen: false,
        qyopen: false,
        nzshow: false,
        pxshow: false,
        qyshow: false,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        nzopen: false,
        pxopen: true,
        qyopen: false,
        nzshow: false,
        pxshow: true,
        qyshow: false,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav
      })
    }


  },
  hidebg: function(e) {
    this.setData({
      qyopen: false,
      nzopen: false,
      pxopen: false,
      nzshow: false,
      pxshow: false,
      qyshow: false,
      isfull: false,
      shownavindex: 0
    })
  },


  selectcity: function(e) {


    var all = [{
      "categoryID": e.target.dataset.cityid,
      "categoryName": "不限"
    }]
    let moreCon = [];
    if (e.target.dataset.cityid != '0') {
      var schoolall = this.data.cityList[e.target.dataset.city].subCategory;
      moreCon = [...(all), ...(schoolall)]
      this.setData({
        schoolid: e.target.dataset.cityid,
        schoolList: moreCon,
        title_city: e.target.dataset.name,
      });      
    }else{
      moreCon = [...(all)]
      this.setData({
        schoolid: e.target.dataset.cityid,
        schoolList: moreCon,
        title_city: "地区",
        title_school: "学校",
      });    
    }

    app.reload = "1";
    this.hidebg();
    this.topRefresh();
  },
  selectschool: function(e) {
    this.setData({
      schoolid: e.target.dataset.cityid,
      title_school: e.target.dataset.name,
    });
    app.reload = "1";
    this.hidebg();
    this.topRefresh();
  },



  // 滚动切换标签样式
  switchTab: function(e) {
    this.setData({
      currentTab: e.detail.current,
    });
    this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function(e) {
    var cur = e.target.dataset.current;

    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })

      this.topRefresh();
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function() {
    if (this.data.currentTab > 4) {
      this.setData({
        scrollLeft: 300
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  // 下拉刷新数据  
  topRefresh: function() {
    console.log("topRefresh");
    this.setData({
      scrollTop: 0,
    });

    if (this.data.schoolid != '' && this.data.schoolid != '0') {
      this.setData({
        havaPhoto: 1,
      });
    } else {
      this.setData({
        havaPhoto: 1,
      });
    }
    if (this.data.currentTab == 1 || app.reload != '') {
      group_pageNum = 1;
      this.setData({
        groupList: [],
        group_hasMore: true,
      });
      loadGroupData(this);
    }
    if (this.data.currentTab == 0 || app.reload != '') {

      event_pageNum = 1;
      this.setData({
        postList: [],
        event_hasMore: true,
      });
      loadEventData(this);
    }
    app.reload = "";

  },

  // 上拉加载数据 上拉动态效果不明显有待改善  
  pullUpLoad: function() {
    console.log("pullUpLoad");
    if (this.data.currentTab == 1) {
      loadGroupData(this);
    } else if (this.data.currentTab == 0) {
      loadEventData(this);
    }
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
    console.log("markid:" + options.markid);



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
      postList: [],
      scrollTop: 0,
      group_hasMore: true,
      event_hasMore: true,

    });

    //注意顺序
    that.setData({
      school: app.globalData.school,
      schoolid: app.globalData.schoolid,
    });
    
    group_pageNum = 1;
    event_pageNum = 1;

    loadGroupData(that);
    loadEventData(that);
    //loadCityData(that);


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
    console.log("onShowonShow");
    console.log("app.globalData.schoolid:" + app.globalData.schoolid);
    let that = this;
    //注意顺序
    that.setData({
      school: app.globalData.school,
      schoolid: app.globalData.schoolid,
    });

    if (app.reload == "1") {
      that.topRefresh();
      app.reload = "";
    }
    //延时刷新
    if (app.reload == "2") {
      setTimeout(function() {
        that.topRefresh();
      }, 5000);
      app.reload = "";
    }
    //
    var show_groupid = (wx.getStorageSync('show_groupid') || 0);

    if (show_groupid > 0) {
      wx.setStorageSync('show_groupid', 0);
      wx.navigateTo({
        url: "../group/detail?groupid=" + show_groupid
      })
    }


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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  tapBL: function(event) {
    wx.navigateTo({
      url: '../group/bl'
    })
  },

  tapCreateGroup: function(event) {
    wx.navigateTo({
      url: '../group/add'
    })
  },

  tapCreateEvent: function(event) {

    wx.navigateTo({
      url: '../add/add'
    })

  },

  tapSchool: function(event) {
    var that = this;
    let formId = event.detail.formId;
    app.collectFormIds(formId); //处理保存推送码      
    that.setData({
      isNext: true,
    })
    wx.navigateTo({
      url: '../search/search?isSelect=1'
    })
  },

  tapSearch: function(event) {
    var that = this;
    let formId = event.detail.formId;
    app.collectFormIds(formId); //处理保存推送码      
    wx.navigateTo({
      url: '../search/search?isSelect=0&keyword=' + that.data.keyword
    })
  },
  tapClearSchool: function(event) {

    console.log("tapClearSchooltapClearSchool");
    var that = this;
    app.globalData.school = "全部地区";
    app.globalData.schoolid = "";
    wx.setStorageSync('globalData', app.globalData);
    app.reload = "1";
    that.onShow();
  },
  tapComments: function (e) {
    var that = this;
    wx.navigateTo({
      url: '/pages/coco/comment?keyword=三行家书'
    })
  },
})