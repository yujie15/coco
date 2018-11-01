// pages/group/show.js   


//获取应用实例
var app = getApp()
var json_util = require('../../utils/json_util.js');
var http_util = require('../../utils/http_util.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: [],
    typeIndex: 0,
    teamViewIndex: 0,
    teamView: '',
    teamViews: [],
    type: "",
    submitType: "",
    groupid: 0,
    title: "",
    content: "",
    uploadurls: [],
    loadingHidden: true,
    submitName: '创建',
    isopen: 1,
    isshow: 1,
    schoolid: 0,
    school: '',
    mpname:'',

  },

  tapModify: function(event) {
    wx.navigateBack({
      delta: 1
    })
  },


  tapSubmit: function(event) {


    var that = this;
    that.setData({
      loadingHidden: false,
    });

    var method = "accountCreateGroup";
    if (that.data.submitType == "mod") {
      method = "accountUpdateGroup";
    }

    var infodata = {
      "method": method,
      "parameters": {
        "account": app.globalData.account,
        "password": app.globalData.password,
        "id": that.data.groupid,
        "name": that.data.title,
        "description": that.data.content,
        "photos": that.data.uploadurls.toString(),
        "uuid": "0",
        "isshow": that.data.teamViews[that.data.teamViewIndex].value,
        "cityid": that.data.schoolid,
        "mpName": that.data.mpname,
        
      }
    }
    //"cateid": that.data.types[that.data.typeIndex].cateid,

    var url1 = app.apiurl;

    var test = {
      data: infodata,
      url: url1
    };




    http_util.httpPost(test).then(

      function(res) {

        that.setData({
          loadingHidden: true,
        });
        var result = res.result;
        var message = res.message;

        if (result != 0) {
          wx.showModal({
            content: message,
            showCancel: false,
            success: function(res) {}
          });
          return;
        }

        wx.showToast({
          title: "提交成功",
          icon: 'success',
          duration: 1000
        })


        app.reload = "2";


        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.setData({
          submitType: "add",
          groupid: 0,
          title: "",
          content: "",
          mpname: "",
          uploadimgs: [],
          uploadurls: [],
          typeIndex: 0,
          teamViewIndex: 0,
        });

        //跳转到刚刚发布的
        wx.setStorageSync('show_groupid', res.data.id);

        wx.switchTab({
          url: '../coco/group',
          success: function(e) {}
        })


      },

      function(res) {
        wx.showModal({
          content: "网络连接失败",
          showCancel: false,
          success: function(res) {}
        });
      }

    );


  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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
    var info = (wx.getStorageSync('group') || [])
    that.setData({

      groupid: info.groupid,
      submitType: info.submitType,
      title: info.title,
      content: info.content,
      uploadurls: info.uploadurls,
      teamViews: info.teamViews,
      teamViewIndex: info.teamViewIndex,
      teamView: info.teamViews[info.teamViewIndex].name,
      schoolid: info.schoolid,
      school: info.school,
      mpname: info.mpname,
      
    })
    if (info.submitType == 'mod') {
      that.setData({
        submitName: "修改"
      })
    }
  },
  //types: info.types,
  //typeIndex: info.typeIndex,
  //type: info.types[info.typeIndex].cateName,

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

  }
})