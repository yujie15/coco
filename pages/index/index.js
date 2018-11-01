//index.js
//获取应用实例
var app = getApp()
var json_util = require('../../utils/json_util.js');
var http_util = require('../../utils/http_util.js');

var pageNum = 1;//翻页页数
var pageSize = 10;//每页条数


/**
 * 加载栏目分类
 */
var loadSortData = function (that) {
  var url1 = app.apiurl;
  var reqData = {
    "method": "getCategoryList",
    "parameters": {
      "type": "1051"
    }
  }
  var test = { data: reqData, url: url1 };


  http_util.httpPost(test).then(

    function (res) {
      var result = res.data.result;
      var message = res.data.message;
      var list = res.data.list;
      that.setData({
        swiperTabHidden: false,
        types: that.data.types.concat(list),
      });
    },

    function (res) {
      wx.showModal({
        content: '网络连接失败',
        showCancel: false,
        success: function (res) {
        }
      });
    }

  );

}


/**
 * 加载活动内容
 */
var loadPageData = function (that) {


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
      "method": "getPostListByEvent",
      "parameters": {
        "account": app.globalData.account,
        "password": app.globalData.password,
        "type": "1051",
        "dealType": "0",
        "order": "postid",
        "start": (pageNum - 1) * pageSize,
        "count": pageSize,
        "categoryID": that.data.categoryID,
        "cityid": that.data.schoolid,
        "keyword": that.data.keyword,
        "tags": that.data.tags
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
  // 页面初始数据
  data: {
    types: [],
    adList: [],
    categoryID: 0,
    school: "",
    schoolid: 0,
    postList: [],
    hasMore: true,
    loadingHidden: true,
    swiperTabHidden: true,
    swiperBoxHidden: true,
    scrollTop: 0,
    scrollHeight: 0,
    toastHidden: true, //吐司  
    toastText: '',//吐司文本 
    // banner 初始化
    indicatoractivecolor: "pink", 
    indicatorcolor: "#fff",  
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 4000,
    duration: 1000,
    // nav 初始化
    curNavId: 1,
    curIndex: 0,
    currentTab: '',
    keyword: "",
    tags: "",
    swipers: [{
      image: "/images/jd1.jpg"
    }, {
      image: "/images/jd2.jpg"
    }, {
      image: "/images/jd3.jpg"
    }, {
      image: "/images/jd4.jpg"
    }, {
      image: "/images/jd5.jpg"
    }
    ],
    deg: 135,
    colorArr: [
      "#6956ec, #56b2ba",
      "#3023ae, #c86dd7",
      "#bd4de8, #ff2366",
      "#fd4935, #fad414",
      "#72afd3, #37ecba"
    ]
  },

  goDetail: function (event) {
    const Id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: `../detail/detail?postid=${Id}`,
      fail: function (res) { console.log(res) },
    })
  },
  // 滑动切换tab 
  bindSwichChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },

  // 点击tab切换 
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current,
        categoryID: e.target.dataset.current,
        postList: [],
        scrollTop: 0,
        hasMore: true,
      })
      pageNum = 1;
      loadPageData(that);
    }
  },
  onPullDownRefresh() {
    console.log("onPullDownRefresh");
    this.topRefresh();
  },

  onReachBottom() {
    console.log("onReachBottom");
    this.pullUpLoad();
  },
  dealFormIds: function (formId) {
    let formIds = app.globalData.gloabalFomIds;//获取全局数据中的推送码gloabalFomIds数组
    if (!formIds) formIds = [];
    let data = {
      formId: formId,
      expire: parseInt(new Date().getTime() / 1000) + 604800 //计算7天后的过期时间时间戳
    }
    formIds.push(data);//将data添加到数组的末尾
    app.globalData.gloabalFomIds = formIds; //保存推送码并赋值给全局变量
  },

  tapSearch: function (e) {

    var that = this;

    let formId = e.detail.formId;
    that.dealFormIds(formId); //处理保存推送码      

    wx.navigateTo({
      url: '../search/search?keyword=' + that.data.keyword
    })
  },

  // 下拉刷新数据  
  topRefresh: function () {
    console.log("topRefresh");
    this.setData({
      scrollTop: 0,
      hasMore: true,
      postList: [],
      categoryID: "0",
      currentTab: "0"
    });
    pageNum = 1;
    loadPageData(this);
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    //注意顺序，先设置标签
    that.setData({
      school: app.globalData.school,
      schoolid: app.globalData.schoolid,
    });

    if (app.reload == "1") {
      app.reload = "";
      that.topRefresh();
    }
    //延时刷新
    if (app.reload == "2") {
      app.reload = "";
      setTimeout(function () {
        that.topRefresh();
      }
        , 5000);
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

  onShareAppMessage2: function () {
    return {
      title: app.name,
      desc: app.globalData.school,
      path: '/pages/index/index?school=' + app.globalData.school + "&schoolid=" + app.globalData.schoolid + "&tags=" + this.data.tags
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    const imgUrl = res.target.dataset.img;
    const title = res.target.dataset.title;
    const path = `/pages/detail/detail?postid=${res.target.dataset.id}&share=1`;
    return {
      title: title,
      path: path,
      imageUrl: imgUrl,
      success: function (res) {
        // 转发成功
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 1500
        })
      },
      fail: function (res) {
        // 转发失败
        console.log(res)
      },
      complete: function (res) {
        console.log(res)
      }
    }
  },


  onLoad: function (option) {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          //scrollHeight: res.windowHeight - res.windowWidth / 750 * 382
          scrollHeight: res.windowHeight
        });
      }
    });
    if (option.schoolid && option.schoolid != '') {
      app.globalData.schoolid = option.schoolid;
    }
    if (option.school && option.school != '') {
      app.globalData.school = option.school;
    }
    if (option.tags && option.tags != '') {
      app.globalData.tags = option.tags;
    }



    that.setData({
      types: [],
      postList: [],
      scrollTop: 0,
      hasMore: true,
      //school: app.globalData.school,
      //schoolid: app.globalData.schoolid,
    });
    pageNum = 1;
    loadPageData(that);
    loadSortData(that);
    loadAdData(that);
    console.log("scene:" + option.scene);
    if (option.scene) {
      var scene = decodeURIComponent(option.scene);
      console.log("go scene");
      wx.navigateTo({
        url: "../detail/detail?postid=" + scene
      })
    }

    let sub = 1;
    let right = 200;
    let left = 135;
    let timer = setInterval(() => {
      this.setData({
        deg: (this.data.deg + sub)
      })
      if (Math.ceil(this.data.deg) == right || Math.ceil(this.data.deg) == left) {
        sub = -sub;
      }
    }, 1000 / 60)


  },
})

