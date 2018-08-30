//detail.js
var app = getApp();
var json_util = require('../../utils/json_util.js');
var http_util = require('../../utils/http_util.js');

var event_pageNum = 1; //翻页页数
var event_pageSize = 5; //每页条数


var member_pageNum = 1; //翻页页数
var member_pageSize = 10; //每页条数


var loadPageData = function(that) {
  var url1 = app.apiurl;
  var reqData = {
    "method": "getGroupDetail",
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


        if (data1.isJoin == "1") {
          that.setData({
            btnName: "退出",
          });
        } else {
          that.setData({
            btnName: "加入",
          });
        }

        if (data1.cover == "") {
          data1.cover = "https://sports.ttyclub.com/images/logo/group/default.png";
        }



        var photos = data1.photos;

        console.log("photos：" + photos);


        var smallphotos = [];
        var bigphotos = [];
        if (photos != null && photos != "") {
          smallphotos = photos.split(",");
        }
        if (photos != null && photos != "" ) {
          bigphotos = photos.replace(/_sm/g, "").split(",");
        }

        smallphotos.push("https://sports.ttyclub.com/images/logo/group/default.png");
        bigphotos.push("https://sports.ttyclub.com/images/logo/group/default.png");

        that.setData({
          group: data1,
          avatar: data1.avatar,
          groupid: data1.id,
          isJoin: data1.isJoin,
          isFounder: data1.isFounder,
          isAdmin: data1.isAdmin,
          cover: data1.cover,
          coverimgs: smallphotos,
          bigcoverimgs: bigphotos,
        });
        wx.setNavigationBarTitle({
          title: data1.name
        })

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


var loadMemberData = function(that) {
  var url1 = app.apiurl;
  var reqData = {
    "method": "getGroupMemberList",
    "parameters": {
      "account": app.globalData.account,
      "password": app.globalData.password,
      "id": that.data.groupid,
      "start": (member_pageNum - 1) * member_pageSize,
      "count": member_pageSize,
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
        var list = res.data.list;
        var totalCount = res.data.totalCount;
        var allData = that.data.memberList;

        if (totalCount == "0" || result == "4") {
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
        if (allData.length < totalCount) {
          member_pageNum++;
        }

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
        "start": (event_pageNum - 1) * event_pageSize,
        "count": event_pageSize,
        "groupId": that.data.groupid,
        "type": "1051",
        "dealType": "0",
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
          event_totalCount: totalCount,
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




// pages/group/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverimgs: [],
    bigcoverimgs: [],
    currentIndex: 1,
    postList: [],
    memberList: [],
    event_hasMore: true,
    event_totalCount: 0,
    loadingHidden: true,
    toastHidden: true,
    cover: "",
    images: {},
    btnName: "加入",
    group: {},
    groupid: 0,
    isJoin: 0,
    isAdmin: 0,
    isFounder: 0,
    formId: 0,
    actionSheetHidden: true,
    actionSheetItems: [
      {
        bindtap: 'Member',
        txt: '成员'
      }, {
        bindtap: 'Update',
        txt: '修改'
      },
      {
        bindtap: 'Delete',
        txt: '解散'
      },
    ],
  },

  imageHidden: function(e) {
    console.log("err");
    this.setData({
      cover: ""
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    var that = this;
    if (options && options.groupid) {
      that.setData({
        groupid: options.groupid,
      })
    }

    that.setData({
      loadingHidden: true,
    })

    event_pageNum = 1;
    member_pageNum = 1;

    loadPageData(this);
    loadMemberData(this);
    loadEventData(this);

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

    var that = this;

    return {
      title: that.data.group.name,
      success: function(res) {
        var shareTickets = res.shareTickets;
        if (shareTickets.length == 0) {
          return false;
        }
        wx.getShareInfo({
          shareTicket: shareTickets[0],
          success: function(res) {
            var encryptedData = res.encryptedData;
            var iv = res.iv;
            //app.getWXDecryptData(encryptedData, iv)
          }
        })
      },
      fail: function(res) {
        // 转发失败
      }
    }





  },

  tapGroupMember: function(e) {
    wx.navigateTo({
      url: 'member?groupid=' + this.data.groupid
    })
  },

  tapGroupEvent: function(e) {
    wx.navigateTo({
      url: 'event?groupid=' + this.data.groupid
    })
  },

  tapGroupFeature: function(e) {
    wx.navigateTo({
      url: '../feature/feature?groupid=' + this.data.groupid
    })
  },

  tapGroupJoin: function(e) {

    var that = this;
    that.setData({
      formId: e.detail.formId
    })


    if (that.data.isJoin == 1) {
      let formId = e.detail.formId;
      app.collectFormIds(formId); //处理保存推送码    
      wx.showModal({
        title: '提示',
        content: '确认退出?',
        success: function(res) {
          if (res.confirm) {
            var url1 = app.apiurl;
            var reqData = {
              "method": "accountQuitGroup",
              "parameters": {
                "account": app.globalData.account,
                "password": app.globalData.password,
                "id": that.data.groupid,
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

    } else {



      var url1 = app.apiurl;
      var reqData = {
        "method": "accountJoinGroup",
        "parameters": {
          "account": app.globalData.account,
          "password": app.globalData.password,
          "id": that.data.groupid,
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
  },


  tapGroupAdmin: function(e) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetbindchange: function() {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  bindMenuMember: function() {
    var that = this;
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
    this.tapGroupMember();
  },
  bindMenuUpdate: function() {
    var that = this;

    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })

    wx.setStorageSync('mod_groupid', this.data.groupid);
    wx.navigateTo({
      url: 'add'
    })
  },
  bindMenuDelete: function() {
    var that = this;
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })

    wx.showModal({
      title: '提示',
      content: '确认解散?',
      success: function(res) {
        if (res.confirm) {
          var url1 = app.apiurl;
          var reqData = {
            "method": "accountDeleteGroup",
            "parameters": {
              "account": app.globalData.account,
              "password": app.globalData.password,
              "id": that.data.groupid,
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
              app.reload = "2";

              wx.switchTab({
                url: '/pages/group/index',
                success: function(e) {}
              })
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
  bindTapIndex: function(e) {
    wx.switchTab({

      url: '../coco/group'

    })
  },
  bindTapHome: function(e) {
    wx.navigateTo({
      url: '../home/home?user=' + e.currentTarget.dataset.account
    })
  },
  setCurrent: function (e) { //当前图片索引
    this.setData({
      currentIndex: e.detail.current + 1
    })
  },
  imgPreview: function () { //图片预览
    const imgs = this.data.bigcoverimgs;
    wx.previewImage({
      current: imgs[this.data.currentIndex - 1], // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },
})