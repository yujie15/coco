var app = getApp();
var http_util = require('../../utils/http_util.js');
var pageNum = 1; //翻页页数
var pageSize = 10; //每页条数

var loadPageData = function(that) {
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
    "method": "getGroupMemberList",
    "parameters": {
      "account": app.globalData.account,
      "password": app.globalData.password,
      "id": that.data.groupid,
      "start": (pageNum - 1) * pageSize,
      "count": pageSize,
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
        var allData = that.data.memberList;


        console.log(totalCount);
        console.log(list.length);

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
            success: function(res) {}
          });
          return;
        }


        for (var i = 0; i < list.length && allData.length < totalCount; i++) {
          allData.push(list[i]);
        }
        that.setData({
          memberList: allData,
        });
        if (allData.length >= totalCount) {
          that.setData({
            hasMore: false,
          });
        } else {
          pageNum++;
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



var loadGroupData = function(that) {
  var url1 = app.apiurl;
  var reqData = {
    "method": "getGroup",
    "parameters": {
      "account": app.globalData.account,
      "password": app.globalData.password,
      "id": that.data.groupid
    }
  }

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
            success: function(res) {}
          });
          return;
        }
        var data1 = res.data;


        that.setData({
          group: data1,
          isJoin: data1.isJoin,
          isFounder: data1.isFounder,
          isAdmin: data1.isAdmin,
        });

      },
      function(res) {

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



// pages/myconferencelist/applylist.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hasMore: true,
    loadingHidden: true,
    scrollTop: 0,
    scrollHeight: 0,
    memberList: [],

    group: {},
    isJoin: 0,
    isAdmin: 0,
    isFounder: 0,

    groupid: "",
    select_account: "",
    select_isAdmin: "",
    actionSheetHidden: true,
    actionSheetItems: [{
        bindtap: 'Delete',
        txt: '删除成员'
      },
      {
        bindtap: 'Black',
        txt: '拉黑成员'
      },
      {
        bindtap: 'Admin',
        txt: '管理员'
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {


    var that = this;
    if (options && options.groupid) {
      that.setData({
        groupid: options.groupid,
      })
    }


    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          scrollHeight: res.windowHeight
        });

      }
    });
    that.setData({
      memberList: [],
      hasMore: true,
      loadingHidden: true,
      scrollTop: 0,
      account: "",
    });
    pageNum = 1;
    loadGroupData(that);
    loadPageData(that);

  },
  // 定位数据  
  scroll: function(event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
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
    console.log("onReachBottom");
  },


  // 上拉加载数据 上拉动态效果不明显有待改善  
  pullUpLoad: function() {
    console.log("pullUpLoad");
    loadPageData(this);
  },

  tapGroupManage: function(event) {
    this.setData({
      select_account: event.currentTarget.dataset.account,
      select_isAdmin: event.currentTarget.dataset.isadmin,
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetbindchange: function() {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindMenuDelete: function() {
    var that = this;

    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
    wx.showModal({
      title: '提示',
      content: '确认删除?',
      success: function(res) {
        if (res.confirm) {
          var url1 = app.apiurl;
          var reqData = {
            "method": "accountDeleteGroupMember",
            "parameters": {
              "account": app.globalData.account,
              "password": app.globalData.password,
              "id": that.data.groupid,
              "user": that.data.select_account,
            }
          };

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
            function(res) {
              wx.showModal({
                content: '网络连接失败',
                showCancel: false,
                success: function(res) {}
              });
            }
          ).catch(function(err) {
            console.log(err);
          });


        }
      }
    })

  },
  bindMenuBlack: function() {
    var that = this;

    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })

    wx.showModal({
      title: '提示',
      content: '确认拉黑?',
      success: function(res) {
        if (res.confirm) {
          var url1 = app.apiurl;
          var reqData = {
            "method": "accountBlackGroupMember",
            "parameters": {
              "account": app.globalData.account,
              "password": app.globalData.password,
              "id": that.data.groupid,
              "user": that.data.select_account,
            }
          };

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
            function(res) {
              wx.showModal({
                content: '网络连接失败',
                showCancel: false,
                success: function(res) {}
              });
            }
          ).catch(function(err) {
            console.log(err);
          });


        }
      }
    })

  },
  bindMenuAdmin: function() {
    var that = this;

    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })

    var msg = ""

    if (that.data.select_isAdmin == '1') {
      msg = "取消"
    } else {
      msg = "设置"
    }

    wx.showModal({
      title: '提示',
      content: '确认' + msg + '?',
      success: function(res) {
        if (res.confirm) {
          var url1 = app.apiurl;
          var reqData = {
            "method": "accountAdminGroupMember",
            "parameters": {
              "account": app.globalData.account,
              "password": app.globalData.password,
              "id": that.data.groupid,
              "user": that.data.select_account,
            }
          };

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
            function(res) {
              wx.showModal({
                content: '网络连接失败',
                showCancel: false,
                success: function(res) {}
              });
            }
          ).catch(function(err) {
            console.log(err);
          });


        }
      }
    })

  },
})