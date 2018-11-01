// pages/coco/comment.js


var app = getApp();
var json_util = require('../../utils/json_util.js');
var http_util = require('../../utils/http_util.js');

var comment_pageNum = 1; //翻页页数
var comment_pageSize = 10; //每页条数
var loadCommentData = function(that) {
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
    "method": "getPostCommentsByRelation",
    "parameters": {
      "account": app.globalData.account,
      "password": app.globalData.password,
      "id": 0,
      "type": "1051",
      "start": (comment_pageNum - 1) * comment_pageSize,
      "count": comment_pageSize,
      "isFriended": 0,
      "order": "likes",
      "keyword": that.data.keyword,
    }
  }



  try {
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
            success: function(res) {}
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

  }
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cover: "https://sports.ttyclub.com/images/coco/sanhome2.jpg",
    commentList: [],
    hasMore: true,
    loadingHidden: true,
    account: "",
    keyword: "三行家书",
    scrollTop: 0,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    var that = this;
    if (options.keyword && options.keyword != '') {
      that.setData({
        keyword: options.keyword,
      });
    }

    that.setData({
      commentList: [],
      hasMore: true,
      loadingHidden: true,
      scrollTop: 0,

    })
    comment_pageNum = 1;
    loadCommentData(this);

  },
  // 下拉刷新数据  
  topRefresh: function() {
    this.setData({
      scrollTop: 0,
    });

    comment_pageNum = 1;
    this.setData({
      commentList: [],
      hasMore: true,
    });
    loadCommentData(this);


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
    var that = this;
    wx.setNavigationBarTitle({
      title: that.data.keyword
    })
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

  // 上拉加载数据 上拉动态效果不明显有待改善  
  pullUpLoad: function() {

    loadCommentData(this);

  },

  // 定位数据  
  scroll: function(event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(options) {



    var that = this;　　 // 设置菜单中的转发按钮触发转发事件时的转发内容

    var shareObj = {
      title: this.data.keyword, // 默认是小程序的名称(可以写slogan等)
      path: '/pages/coco/comment?kewword=' + this.data.keyword, // 默认是当前页面，必须是以‘/’开头的完整路径

      success: function(res) {　　　　　　 // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {　　　　　　}
      },
      fail: function() {　　　　　　 // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {　　　　　　　　 // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {　　　　　　　　 // 转发失败，其中 detail message 为详细失败信息
        }
      },
      complete: function() {　　　　　　 // 转发结束之后的回调（转发成不成功都会执行）
      }
    }

    // 来自页面内的按钮的转发

    if (options.from == 'button') {
      var eData = options.target.dataset;
      // 此处可以修改 shareObj 中的内容
      shareObj.path = '/pages/detail/detail?postid=' + eData.id + "&markid=" + eData.markid;
    }

    return shareObj;


  },
  tapLike: function(e) {
    let that = this;
    var markId = e.currentTarget.dataset.markid;
    let currentIndex = that.data.commentList.findIndex(item => item.markId === markId);
    var isLike = that.data.commentList[currentIndex].isLike;
    var likeCount = Number(that.data.commentList[currentIndex].likes) + 1;

    that.setData({
      ['commentList[' + currentIndex + '].isLike']: '1',
      ['commentList[' + currentIndex + '].likes']: likeCount
    });

    var url1 = app.apiurl;
    var reqData = {
      "method": "accountLikeComment",
      "parameters": {
        "account": app.globalData.account,
        "password": app.globalData.password,
        "markId": markId,
      }
    };

    try {
      var test = {
        data: reqData,
        url: url1
      };
      http_util.httpPost(test).then(
        function(res) {
          var result = res.result;
          var message = res.message;
          if (result != "0") {
            wx.showModal({
              content: message,
              showCancel: false,
              success: function(res) {
                if (result == "10100") {
                  //调用应用实例的方法获取全局数据
                  app.getUserInfo(function(userInfo) {
                    //更新数据，页面自动渲染
                    that.setData({
                      userInfo: userInfo
                    })
                  })
                }


              }
            });
            return;
          }

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

    }
  },

  tapViewComment: function(e) {
    let that = this;
    var markId = e.currentTarget.dataset.markid;
    wx.navigateTo({
      url: '../detail/comment?markid=' + markId
    })
  },

  tapEvent: function(e) {
    let that = this;
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../detail/detail?postid=" + id
    })
  },

  bindTapHome: function(e) {
    wx.navigateTo({
      url: '../home/home?user=' + e.currentTarget.dataset.account
    })
  },

})