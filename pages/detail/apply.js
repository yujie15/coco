// apply.js
var app = getApp()
var http_util = require('../../utils/http_util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    postid: "",
    grade: "",
    content: "",
    loadingHidden: true,
    userInfo: {}
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

  applySubmit: function (e) {

    var that = this;
    // if (that.data.grade == '') {
    //   wx.showModal({
    //     content: "请填写报名人数",
    //     showCancel: false,
    //     success: function (res) {
    //     }
    //   });
    //   return;
    // };
    let formId = e.detail.formId;
    that.dealFormIds(formId); //处理保存推送码

    if (that.data.content == '') {
      wx.showModal({
        content: "请填写留言",
        showCancel: false,
        success: function (res) {
        }
      });
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
        "id": that.data.postid,
        "grade": that.data.grade,
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
            title: '留言成功',
            icon: 'success',
            duration: 1000
          })
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2];  //上一个页面
          // prevPage.setData({
          //   applyList: [],
          //   hasMore: true,
          // })
          prevPage.onLoad();
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
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

  bindGradeChange: function (e) {
    this.setData({
      grade: e.detail.value
    })
    console.log(this.data.grade);
  },

  bindContentChange: function (e) {
    this.setData({
      content: e.detail.value
    })
    console.log(this.data.content);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      postid: options.postid,
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


})