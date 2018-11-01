// pages/detail/comment.js

var app = getApp();
var json_util = require('../../utils/json_util.js');
var http_util = require('../../utils/http_util.js');

var loadPageData = function (that) {
  var url1 = app.apiurl;
  var reqData = {
    "method": "getPostCommentsByMarkId",
    "parameters": {
      "account": app.globalData.account,
      "password": app.globalData.password,
      "markId": that.data.markid
    }
  }

  try {
    var test = {
      data: reqData,
      url: url1
    };
    http_util.httpPost(test).then(
      function (res) {

        var result = res.result;
        var message = res.message;

        if (result != "0") {
          wx.showModal({
            content: message,
            showCancel: false,
            success: function (res) { }
          });
          return;
        }
        var data1 = res.data;
        console.log(data1);
        that.setData({
          answermsg: data1,
        });
      },
      function (res) {

        wx.showModal({
          content: '网络连接失败',
          showCancel: false,
          success: function (res) { }
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

  /**
   * 页面的初始数据
   */
  data: {
    markid:0,
    comment: {},
    loadingHidden: true,
    comment:"",
    answermsg:null,
    commentShow: false,
    commentId: 0,
    account:"",
    isAuthor:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options && options.markid) {
      that.setData({
        markid: options.markid,
      })
    }


    that.setData({
      loadingHidden: true,
    })
    loadPageData(this);


  },
  boardimgPreview: function (e) { //图片预览

    var cover = e.currentTarget.dataset.cover;


    if (cover != null && cover != "") {
      cover = cover.replace(/_sm/g, "");
    } else {
      return;
    }

    var imgArray = [];
    imgArray.push(cover);
    wx.previewImage({
      current: cover, // 当前显示图片的http链接
      urls: imgArray // 需要预览的图片http链接列表
    })
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
    let that = this;

    that.setData({
      account: app.globalData.account,
    })
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

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },



  //点击emoji背景遮罩隐藏emoji盒子
  cemojiCfBg: function () {
    this.setData({
      commentShow: false
    })
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
      comment: e.detail.value
    })
  },


  delComment: function (event) {
    let that = this;

    wx.showModal({
      title: '提示',
      content: '确认删除?',
      success: function (res) {
        if (res.confirm) {
          var url1 = app.apiurl;
          var reqData = {
            "method": "accountDeleteCommentPost",
            "parameters": {
              "account": app.globalData.account,
              "password": app.globalData.password,
              "markId": event.currentTarget.dataset.markid
            }
          };


          var test = {
            data: reqData,
            url: url1
          };
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

            },
            function (res) {
              wx.showModal({
                content: '网络连接失败',
                showCancel: false,
                success: function (res) { }
              });
            }
          ).catch(function (err) {
            console.log(err);
          });


        }
      }
    })

  },
  
  tapComment: function (e) {

    let that = this;
    var markId = e.currentTarget.dataset.markid;
    that.setData({
      commentId: markId,
      commentShow: true
    });
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
    if (that.data.content == "") {
      that.setData({
        comment: "",//清空文本域值
        commentShow: true
      })
      return;
    };

    that.setData({
      loadingHidden: false,
    });

    var url1 = app.apiurl;

    var reqData = {
      "method": "accountCommentPost",
      "parameters": {
        "account": app.globalData.account,
        "password": app.globalData.password,
        "id": that.data.answermsg.id,
        "markId": that.data.commentId,
        "content": that.data.comment,

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

          let list = that.data.answermsg.comments
          list.push(res.data);

          that.setData({
            comment: "",//清空文本域值
            commentShow: false,
            ["answermsg.comments"]: list,
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
  tapLike: function (e) {
    let that = this;
    var markId = e.currentTarget.dataset.markid;
    var isLike = that.data.answermsg.isLike;
    var likeCount = Number(that.data.answermsg.likes) + 1;

    var _isLike = 'answermsg.isLike';
    var _likes = 'answermsg.likes';

    that.setData({
      [_isLike]: '1',
      [_likes]: likeCount
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
        function (res) {
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

        },
        function (res) {
          that.setData({
            loadingHidden: true,
          });
          wx.showModal({
            content: '网络连接失败',
            showCancel: false,
            success: function (res) { }
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

  
})