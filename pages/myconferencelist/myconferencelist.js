var app = getApp();
var http_util = require('../../utils/http_util.js');
var pageNum = 1;//翻页页数
var pageSize = 10;//每页条数

/**
 * 加载数据
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
  var reqData;
  if (that.data.type == "publish") {

    that.setData({
      timeName: "发布时间",
    });

    reqData = {
      "method": "getPostListByUser",
      "parameters": {
        "account": app.globalData.account,
        "password": app.globalData.password,
        "user": app.globalData.account,
        "start": (pageNum - 1) * pageSize,
        "count": pageSize,
        "type": "1051",
        "dealType": "0",
        "order": "postid",
      }
    }
  } else if (that.data.type == "join") {

    that.setData({
      timeName: "报名时间",
    });
    reqData = {
      "method": "getUserApplyList",
      "parameters": {
        "account": app.globalData.account,
        "password": app.globalData.password,
        "user": app.globalData.account,
        "start": (pageNum - 1) * pageSize,
        "count": pageSize,
        "type": "apply"
      }
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
  data: {
    type: '',
    timeName: '',
    hasMore: true,
    loadingHidden: true,
    postList: [],
    touch_end: "",
    touch_start: "",
    modalHidden: true,
    nocancel: false,
    id:"",
    email: "",
  },

  onReachBottom: function () {
    var that = this;
    loadPageData(that);
  },

  onLoad: function (options) {
    pageNum = 1;
    var that = this;
    if (options && options.type) {
      that.setData({
        type: options.type,
      })
    }
    that.setData({
      postList: [],
      hasMore: true,
      loadingHidden: true,
    });
    loadPageData(that);
  },
  delFeel: function (event) {
    let that = this;
    //触摸时间距离页面打开的毫秒数  
    var touchTime = that.data.touch_end - that.data.touch_start;
    //console.log(touchTime);
    //如果按下时间大于350为长按  
    if (touchTime > 350 && that.data.type == "join") {
      wx.showModal({
        title: '提示',
        content: '确认取消该报名?',
        success: function (res) {
          if (res.confirm) {
            var url1 = app.apiurl;
            var reqData = {
              "method": "accountDeleteCommentApply",
              "parameters": {
                "account": app.globalData.account,
                "password": app.globalData.password,
                "id": event.currentTarget.dataset.id
              }
            };


            var test = { data: reqData, url: url1 };
            http_util.httpPost(test).then(
              function (res) {
                var result = res.result;
                var message = res.message;
                if (result != "0") {
                  wx.showModal({
                    content: message,
                    showCancel: false,
                    success: function (res) {

                    }
                  });
                  return;
                }
                wx.showToast({
                  title: '取消成功',
                  icon: 'success',
                  duration: 1000
                })
                that.onLoad();
                return;

              }, function (res) {
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


          }
        }
      })
      //如果按下时间大于350为长按  
    } else if (touchTime > 350 && that.data.type == "publish") {
      wx.showModal({
        title: '提示',
        content: '确认删除该活动?',
        success: function (res) {
          if (res.confirm) {
            var url1 = app.apiurl;
            var reqData = {
              "method": "accountDeletePost",
              "parameters": {
                "account": app.globalData.account,
                "password": app.globalData.password,
                "id": event.currentTarget.dataset.id
              }
            };


            var test = { data: reqData, url: url1 };
            http_util.httpPost(test).then(
              function (res) {
                var result = res.result;
                var message = res.message;
                if (result != "0") {
                  wx.showModal({
                    content: message,
                    showCancel: false,
                    success: function (res) {

                    }
                  });
                  return;
                }
                wx.showToast({
                  title: '删除成功',
                  icon: 'success',
                  duration: 1000
                })
                that.onLoad();
                return;

              }, function (res) {
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


          }
        }
      })

    } else {
      wx.navigateTo({
        url: '/pages/detail/detail?postid=' + event.currentTarget.dataset.id
      })
    }
  },
  //按下事件开始  
  mytouchstart: function (e) {
    let that = this;
    that.setData({
      touch_start: e.timeStamp
    })
    //console.log(e.timeStamp + '- touch-start')
  },
  //按下事件结束  
  mytouchend: function (e) {
    let that = this;
    that.setData({
      touch_end: e.timeStamp
    })
    //console.log(e.timeStamp + '- touch-end')
  },
  bindApplyList: function (e) {
    wx.navigateTo({
      url: 'applylist?postid=' + e.currentTarget.dataset.id
    })
  },
  bindAddPost: function (e) {
    wx.setStorageSync('add_postid', e.currentTarget.dataset.id);

    wx.navigateTo({
      url: '../add/add'
    })  
  },  

  imgPreview: function (e) { //图片预览
    const img = e.currentTarget.dataset.bigcoverimgs;
    var imgArray = [];
    imgArray.push(img);
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: imgArray // 需要预览的图片http链接列表
    })
  },

  modalShow: function (e) {
    this.setData({
      id: e.currentTarget.dataset.id,
      modalHidden: false
    })
  },

  modalCancel: function () {
    this.setData({
      id: "",
      email: "",
      modalHidden: true,
    });
  },


  modalConfirm: function (e) {

    let that = this;

    if (that.data.email == "") {
      wx.showModal({
        content: '请填写邮箱',
        showCancel: false,
        success: function (res) {
        }
      });
      return;
    }

    that.setData({
      modalHidden: true,
    });


   // console.log(that.data.id);
    //console.log(that.data.email);

    var url1 = app.apiurl;
    var reqData = {
      "method": "accountSendEventApply",
      "parameters": {
        "account": app.globalData.account,
        "password": app.globalData.password,
        "id": that.data.id,
        "email": that.data.email,
      }
    };


    try {
      var test = { data: reqData, url: url1 };
      http_util.httpPost(test).then(
        function (res) {
          that.setData({
            loadingHidden: true,
            id: "",
            email: "",            
          });
          var result = res.result;
          var message = res.message;
          if (result != "0") {
            wx.showModal({
              content: message,
              showCancel: false,
              success: function (res) {
              }
            });
            return;
          }

          wx.showToast({
            title: '请查收',
            icon: 'success',
            duration: 1000
          })


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


  },

  bindInputEmail: function (e) {
    this.setData({
      email: e.detail.value
    })
  },

})
