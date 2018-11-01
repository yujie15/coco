
var http_util = require('../../utils/http_util.js');

var app = getApp();



var loadCityData = function (that) {

  that.setData({
    loadingHidden: false,
  });


  var url1 = app.apiurl;
  var reqData = {
    "method": "getCategoryList",
    "parameters": {
      "type": "2",
      "items": "0"
    }
  }
  var test = { data: reqData, url: url1 };


  http_util.httpPost(test).then(

    function (res) {

      that.setData({
        loadingHidden: true,
      });

      var result = res.data.result;
      var message = res.data.message;
      var list = res.data.list;
      that.setData({
        cityList: that.data.cityList.concat(list),
      });
    },

    function (res) {

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

  );

}


var loadSchoolData = function (that) {

  var url1 = app.apiurl;
  var reqData = {
    "method": "getSchoolList",
    "parameters": {
      "type": "2",
    }
  }
  var test = { data: reqData, url: url1 };
  http_util.httpPost(test).then(

    function (res) {

      var result = res.data.result;
      var message = res.data.message;
      var list = res.data.list;
      that.setData({
        schoolList: that.data.schoolList.concat(list),
      });
    },

    function (res) {

      wx.showModal({
        content: '网络连接失败',
        showCancel: false,
        success: function (res) {
        }
      });
    }

  );

}




var loadHotSchoolData = function (that) {

  that.setData({
    loadingHidden: false,
  });

  var url1 = app.apiurl;
  var reqData = {
    "method": "getSchoolList",
    "parameters": {
      "type": "2",
      "order": "hot",
    }
  }
  var test = { data: reqData, url: url1 };


  http_util.httpPost(test).then(

    function (res) {
      that.setData({
        loadingHidden: true,
      });
      var result = res.data.result;
      var message = res.data.message;
      var list = res.data.list;
      that.setData({
        hotschoolList: that.data.hotschoolList.concat(list),
      });
    },

    function (res) {
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

  );

}


var loadTagData = function (that) {
  var url1 = app.apiurl;
  var reqData = {
    "method": "getTagList",
    "parameters": {
      "type": "tags",
      "start": "0",
      "count": "100",
    }
  }
  var test = { data: reqData, url: url1 };
  http_util.httpPost(test).then(

    function (res) {
      var result = res.data.result;
      var message = res.data.message;
      var list = res.data.list;
      that.setData({
        tagList: that.data.tagList.concat(list),
      });
    },

    function (res) {
      wx.showModal({
        content: '网络连接失败',
        showCancel: false,
        success: function (res) {
        }
      });
    }

  );

}


Page({
  data: {
    inputShowed: false,
    inputVal: "",
    isSelect: "-1",
    tagList: [],
    cityList: [],
    schoolList: [],
    hotschoolList: [],
    filterList: [],
    scrollTop: 0,
    scrollHeight: 100,
    returnPage:"",
    loadingHidden: true,

  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      filterList: [],
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });

    //过滤包含关键字的选项
    var key = e.detail.value;
    if (key != "") {
      var schoolList = this.data.schoolList;
      var filterList = [];
      for (var o in schoolList) {
        if (schoolList[o].name.indexOf(key) > -1) {
          filterList.push(schoolList[o]);
        }
      }
      this.setData({
        filterList: filterList,
      });
    }


  },
  onLoad: function (option) {
    var that = this;

    if (option && option.keyword){
      that.setData({
        inputVal: option.keyword,
      });
    }

    if (option && option.isSelect) {
      that.setData({
        isSelect: option.isSelect,
      });
    }

    if (option && option.returnPage) {
      that.setData({
        returnPage: option.returnPage,
      });
    }
    //loadTagData(that);

    if (that.data.isSelect=='0'){
      loadHotSchoolData(that);
      loadSchoolData(that);
    } else if (that.data.isSelect == '1'){

      loadCityData(that);

    }
    wx.getSystemInfo({
      success: function (res) {
        console.log("res.windowHeight:" + res.windowHeight);
        that.setData({
          scrollHeight: res.windowHeight/2
        });
      }
    });
  },

  allSchool: function (e) {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      tags: "",
      categoryID: "0",
      currentTab: "0"
    })
    app.reload = 1;
    wx.switchTab({
      url: '../index/index',
      success: function (e) {
        // var page = getCurrentPages().pop();
        // if (page == undefined || page == null) return;
        // page.onShow();
      }
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

  tapHotSchool: function (e) {
    var that = this;
    let formId = e.detail.formId;
    that.dealFormIds(formId); //处理保存推送码
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      categoryID: "0",
      currentTab: "0"
    })

    app.reload = 1;
    app.globalData.school = e.detail.target.dataset.name;
    app.globalData.schoolid = e.detail.target.dataset.id;
    wx.setStorageSync('globalData', app.globalData);
    wx.switchTab({
      url: '../group/index',
      success: function (e) {
      }
    })
  },

  tapSchool: function (e) {

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      categoryID: "0",
      currentTab: "0"
    })
    app.reload = 1;
    app.globalData.school = e.currentTarget.dataset.name;
    app.globalData.schoolid = e.currentTarget.dataset.id;    
    wx.setStorageSync('globalData', app.globalData);

    wx.switchTab({
      url: '../group/index',
      success: function (e) {
      }
    })
  },

  searchSubmit: function (e) {
    if (e.detail.value == "") {
      return;
    }
    wx.navigateTo({
      url: 'list?keyword=' + e.detail.value
    })
  },  
  searchSubmit2: function (e) {
    if (e.detail.value == "") {
      return;
    }
    var pages = getCurrentPages();

    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      categoryID: "0",
      currentTab: "0"
    })
    app.reload = 1
    app.globalData.school = e.detail.value;
    wx.switchTab({
      url: '../index/index',
      success: function (e) {
      }
    })
  },
  toList: function (e) {
    var categoryID = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'list?cityid=' + categoryID
    })
  },
  toCity: function (e) {
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: "city?cityid=" + id + "&cityname=" + name+ "&returnPage=" + this.data.returnPage
    })
  },
  upper: function (e) {
  },
  lower: function (e) {
  },
  scroll: function (e) {
  },
});