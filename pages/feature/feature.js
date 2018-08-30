var http_util = require('../../utils/http_util.js');
var pageNum = 1;//翻页页数
var pageSize = 10;//每页条数



// 获取全局应用程序实例对象
const app = getApp();


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




  reqData = {
    "method": "getDynamicLocationByGroup",
    "parameters": {
      "account": app.globalData.account,
      "password": app.globalData.password,
      "start": (pageNum - 1) * pageSize,
      "count": pageSize,
      "groupId": that.data.groupid,

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



// 创建页面实例对象
Page({
  /**
   * 页面名称
   */
  name: "feature",
  /**
   * 页面的初始数据
   */

  data: {
    hasMore: true,
    loadingHidden: true,
    postList: [],
    scrollHeight: 0,
    scrollTop: 0,
    commentShow: false,
    commentId: 0,
    content: "",
    account: "",
    groupid:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    that.setData({
      postList: [],
      hasMore: true,
      loadingHidden: true,
    });

    if (options && options.groupid) {
      that.setData({
        groupid: options.groupid,
      })
    }

    pageNum = 1;

    loadPageData(that);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    var that = this;
    that.setData({
      account: app.globalData.account
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    pageNum = 1;
    this.setData({
      postList: [],
      scrollTop: 0,
      hasMore: true,
    });
    loadPageData(this)
    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1500);
  },
  bindDownLoad: function () {
    var that = this;
    loadPageData(that);
  },
  scroll: function (event) {
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  refresh: function (event) {
    pageNum = 1;
    this.setData({
      postList: [],
      scrollTop: 0,
      hasMore: true,
    });
    loadPageData(this)
  },
  onReachBottom: function () {
    var that = this;
    loadPageData(that);
  },

  //点击emoji背景遮罩隐藏emoji盒子
  cemojiCfBg: function () {
    this.setData({
      commentShow: false
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

  tapComment: function (e) {

    let that = this;
    var id = e.currentTarget.dataset.id;
    console.log("id:" + id);

    that.setData({
      commentId: id,
      commentShow: true
    });
  },
  //文本域获得焦点事件处理
  textAreaFocus: function () {
    this.setData({

    })
  },
  //文本域失去焦点时 事件处理
  textAreaBlur: function (e) {
    //获取此时文本域值
    this.setData({
      content: e.detail.value
    })
  },
  tapLike: function (e) {
    let that = this;
    var id = e.currentTarget.dataset.id;
    let currentIndex = that.data.postList.findIndex(item => item.id === id);
    var isLike = that.data.postList[currentIndex].isLike;
    var likeCount = Number(that.data.postList[currentIndex].likeCount) + 1;

    that.setData({
      ['postList[' + currentIndex + '].isLike']: '1',
      ['postList[' + currentIndex + '].likeCount']: likeCount
    });

    var url1 = app.apiurl;
    var reqData = {
      "method": "accountLikeLocation",
      "parameters": {
        "account": app.globalData.account,
        "password": app.globalData.password,
        "id": id,
      }
    };

    try {
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

  tapUnLike: function (e) {

    let that = this;
    var id = e.currentTarget.dataset.id;
    let currentIndex = that.data.postList.findIndex(item => item.id === id);
    var isLike = that.data.postList[currentIndex].isLike;
    var likeCount = Number(that.data.postList[currentIndex].likeCount) - 1;

    if (likeCount < 0) {
      likeCount = 0;
    }

    that.setData({
      ['postList[' + currentIndex + '].isLike']: '0',
      ['postList[' + currentIndex + '].likeCount']: likeCount
    });

    var url1 = app.apiurl;
    var reqData = {
      "method": "accountDeleteLikedLocation",
      "parameters": {
        "account": app.globalData.account,
        "password": app.globalData.password,
        "id": id,
      }
    };

    try {
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

  send: function () {
    var that = this;
    //此处延迟的原因是 在点发送时 先执行失去文本焦点 再执行的send 事件 此时获取数据不正确 故手动延迟100毫秒
    setTimeout(function () {
      that.addComment();
    }, 100)
  },

  addComment: function () {

    var that = this, conArr = [];
    console.log("addComment:" + that.data.commentId);

    let currentIndex = that.data.postList.findIndex(item => item.id === that.data.commentId);
    var comments = that.data.postList[currentIndex].comments;

    if (that.data.content == '') {
      that.setData({
        content: "",//清空文本域值
        commentShow: true
      })
      return;
    };

    that.setData({
      loadingHidden: false,
    });

    var url1 = app.apiurl;
    var reqData = {
      "method": "accountCommentLocation",
      "parameters": {
        "account": app.globalData.account,
        "password": app.globalData.password,
        "id": that.data.commentId,
        "content": that.data.content,
      }
    };


    try {
      var test = { data: reqData, url: url1 };
      http_util.httpPost(test).then(
        function (res) {
          that.setData({
            loadingHidden: true,
          });
          var result = res.result;
          var message = res.message;
          if (result != "0") {
            wx.showModal({
              content: message,
              showCancel: false,
              success: function (res) {
                if (result == "10100") {
                  //调用应用实例的方法获取全局数据
                  app.getUserInfo(function (userInfo) {
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

          wx.showToast({
            title: '评论成功',
            icon: 'success',
            duration: 1000
          })

          that.setData({
            content: "",//清空文本域值
            commentShow: false,
          })
          console.log("send ok1");
          that.setData({
            ["postList[" + currentIndex + "].comments"]: comments.concat(res.data),
            ["postList[" + currentIndex + "].commentCount"]: comments.length+1,
          })
          console.log("send ok2");

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
  delComment: function (event) {
    let that = this;
    console.log("event.currentTarget.dataset.markId:" + event.currentTarget.dataset.markid);

    wx.showModal({
      title: '提示',
      content: '确认删除?',
      success: function (res) {
        if (res.confirm) {
          var url1 = app.apiurl;
          var reqData = {
            "method": "accountDeleteCommentLocation",
            "parameters": {
              "account": app.globalData.account,
              "password": app.globalData.password,
              "markId": event.currentTarget.dataset.markid
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

  },
  delPosition: function (event) {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确认删除?',
      success: function (res) {
        if (res.confirm) {
          var url1 = app.apiurl;
          var reqData = {
            "method": "accountDeletePosition",
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

  },  
  goAdd: function () {
    wx.navigateTo({
      url: 'add?groupid=' + this.data.groupid
    })
  },
})

