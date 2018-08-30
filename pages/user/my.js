// my.js

var app = getApp() // 获取入口文件app的应用实例
var util = require('../../utils/util.js')
var http_util = require('../../utils/http_util.js');


var loadMessageCountData = function (that) {
  var url1 = app.apiurl;
  var reqData = {
    "method": "accountGetNewMessageCount",
    "parameters": {
      "account": app.globalData.account,
      "password": app.globalData.password,
    }
  }

  try {
    var test = { data: reqData, url: url1 };
    http_util.httpPost(test).then(
      function (res) {

        var result = res.result;
        var message = res.message;
        var newCommentMessageCount = res.data.newCommentMessageCount;
        that.setData({
          newCommentMessageCount: newCommentMessageCount,
        });


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
    source: '',
    userInfo: null,
    loading: false,
    newCommentMessageCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (app.globalData.userInfo == null) {
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
        //更新数据，页面自动渲染
        that.setData({
          userInfo: userInfo
        })
      });
      console.log("onLoad 获取用户信息");
    } else {
      that.setData({
        userInfo: app.globalData.userInfo
      })
      console.log("onLoad 已登录");
    }

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
    if (this.data.userInfo == null && app.globalData.userInfo != null) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    }
    loadMessageCountData(this);
  },

  setAvatar: function (userInfo) {

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

  tapQuit: function () {
    var that = this;
    wx.removeStorageSync('globalData');
    var newObject = JSON.parse(JSON.stringify(app.initData));
    app.globalData = newObject;

    that.setData({
      userInfo: null,
      loading: false,
    });

    wx.showToast({
      title: '成功退出',
      icon: 'success',
      duration: 1000
    })
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

  tapType: function (e) {

    var that = this
    let formId = e.detail.formId;
    that.dealFormIds(formId); //处理保存推送码
    let type = e.detail.target.dataset.type;
    if (type=='tapQuit'){
      that.tapQuit();
    } else if (type=='tapLogin'){
      that.tapLogin();
    }
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
        loading: false
      })
    });

  },

  tapAbout: function (event) {
    wx.navigateTo({
      url: '../user/about'
    })
  },
  tapMyMessage: function (event) {

    if (this.data.userInfo == null) {
      wx.showToast({
        title: '请先登录',
        icon: 'loading',
        duration: 1000
      })
      return;
    }
    wx.navigateTo({
      url: '../message/index'
    })
  },
  tapMyPublish: function (event) {

    if (this.data.userInfo == null) {
      wx.showToast({
        title: '请先登录',
        icon: 'loading',
        duration: 1000
      })
      return;
    }
    wx.navigateTo({
      url: '../myconferencelist/myconferencelist?type=publish'
    })
  },
  tapMyJoin: function (event) {
    if (this.data.userInfo == null) {
      wx.showToast({
        title: '请先登录',
        icon: 'loading',
        duration: 1000
      })
      return;
    }
    wx.navigateTo({
      url: '../myconferencelist/myconferencelist?type=join'
    })
  }
})