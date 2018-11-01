//获取应用实例
var app = getApp()
var util = require('../../utils/util.js');
var json_util = require('../../utils/json_util.js');
var http_util = require('../../utils/http_util.js');


/**
 * 加载栏目分类
 */
var loadSortData = function(that) {
  var url1 = app.apiurl;
  var reqData = {
    "method": "getGroupCategoryList",
    "parameters": {
      "referid": "0"
    }
  }
  var test = {
    data: reqData,
    url: url1
  };


  http_util.httpPost(test).then(

    function(res) {
      var list = res.data.list;
      that.setData({
        types: that.data.types.concat(list),
      });
    },

    function(res) {
      wx.showModal({
        content: '网络连接失败',
        showCancel: false,
        success: function(res) {}
      });
    }

  );

}


var loadGroupData = function(that) {

  var add_groupid = (wx.getStorageSync('add_groupid') || 0);
  var mod_groupid = (wx.getStorageSync('mod_groupid') || 0);

  //console.log("add_groupid:" + add_groupid);
  //console.log("mod_groupid:" + mod_groupid);
  var groupid = 0;

  if (add_groupid > 0) {
    groupid = add_groupid;
    that.setData({
      groupid: 0,
      submitType: "add"
    })
  } else if (mod_groupid > 0) {
    groupid = mod_groupid;
    that.setData({
      groupid: groupid,
      submitType: "mod"
    })
  } else {
    return;
  }


  wx.setStorageSync('add_groupid', 0);
  wx.setStorageSync('mod_groupid', 0);
  var url1 = app.apiurl;
  var reqData = {
    "method": "getGroup",
    "parameters": {
      "account": app.globalData.account,
      "password": app.globalData.password,
      "id": groupid
    }
  }
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
        groupid: data1.id,
        title: data1.name,
        content: data1.description,
        school: data1.cityName,
        schoolid: data1.cityid,

      })
      for (var i = 0; i < that.data.types.length; i++) {
        if (that.data.types[i].cateid == data1.cateid) {
          that.setData({
            typeIndex: i,
          });
        }
      }
      for (var i = 0; i < that.data.teamViews.length; i++) {
        if (that.data.teamViews[i].value == data1.isshow) {
          that.setData({
            teamViewIndex: i,
          });
        }
      }
      that.setData({
        loadingHidden: true,
      });
    },

    function(res) {
      wx.showModal({
        content: '网络连接失败',
        showCancel: false,
        success: function(res) {}
      });
    }

  );

}


// pages/group/add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: [],
    typeIndex: 0,
    teamViewIndex: 0,
    showTopTips: false,
    teamView: '',
    teamViews: [

      {
        "name": "公开可见",
        "value": "1",
        "note": "（优质群组会在发现推荐）"
      },

      {
        "name": "私密",
        "value": "0",
        "note": "(在我的可见)"
      }

    ],
    groupid: 0,
    title: "",
    content: "",
    errors: "",
    uploadimgs: [], //上传图片列表
    uploadurls: [], //上传图片URL列表    
    editable: true,
    isNext: false,
    schoolHidden:false,
    showTopTips: false,
    submitType: "add",
    school: '',
    schoolid: '',
    mpname:'',
  },
  chooseImage: function() {
    let _this = this;
    _this.setData({
      isNext: true
    })
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function(res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })
  },
  chooseWxImage: function(type) {
    let _this = this;
    _this.setData({
      isNext: true
    })
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function(res) {
        _this.setData({
          uploadimgs: _this.data.uploadimgs.concat(res.tempFilePaths)
        })
      }
    })
  },
  editImage: function() {
    let _this = this;
    _this.setData({
      editable: !_this.data.editable
    })
  },
  deleteImg: function(e) {
    let _this = this;
    var arr = _this.data.uploadimgs;
    var index = e.currentTarget.dataset.index;
    _this.setData({
      uploadimgs: arr.slice(0, index).concat(arr.slice(index + 1, arr.length))
    })
  },

  bindTitleChange: function(e) {
    this.setData({
      title: e.detail.value
    })
  },
  bindContentChange: function(e) {
    this.setData({
      content: e.detail.value
    })
  },
  bindMpnameChange: function (e) {
    this.setData({
      mpname: e.detail.value
    })
  },
  bindSchoolChange: function (e) {
    this.setData({
      school: e.detail.value
    })
  },
  bindToastTap: function(e) {
    var that = this;
    let formId = e.detail.formId;
    app.collectFormIds(formId); //处理保存推送码
    that.setData({
      isNext: true
    })
    if (that.data.uploadimgs.length > 0) {
      util.upload(app.uploadurl, that, that.submit);
    } else {
      setTimeout(function () {
        that.submit();
      }, 100)
    }
  },
  submit: function() {
    var that = this;
    if (that.data.title == '') {
      wx.showModal({
        content: "请填写名称",
        showCancel: false,
        success: function (res) { }
      });
      return;
    };
    if (that.data.content == '') {
      wx.showModal({
        content: "请填写介绍",
        showCancel: false,
        success: function (res) { }
      });
      return;
    };

    wx.setStorageSync('group', this.data)
    wx.navigateTo({
      url: 'show'
    })
  },

  showTopTips: function() {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function() {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  bindTypeChange: function(e) {
    this.setData({
      typeIndex: e.detail.value
    })
  },
  bindTeamViewChange: function(e) {
    this.setData({
      teamViewIndex: e.detail.value,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this;
    that.setData({
      submitType: "add",
      groupid: 0,
      title: "",
      content: "",
      isNext: false,
    })
    loadSortData(that);

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
    app.checkLogin();
    this.setData({
      isNext: false,
    });
    loadGroupData(that);

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    let that = this;
    //console.log("onHide<>" + this.data.submitType);
    //console.log("onHide<>" + this.data.isNext);
    //清除修改信息
    if (that.data.submitType == "mod" && !that.data.isNext) {
      that.onLoad();
    }
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

  tapSchool: function (event) {

    console.log("tapSchool<>" + this.data.isNext);
    this.setData({
      isNext: true,
    })
    wx.navigateTo({
      url: '../search/search?isSelect=1&returnPage=add'
    })
  },


})