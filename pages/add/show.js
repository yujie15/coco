// show.js
var app = getApp()
var network_util = require('../../utils/network_util.js');
var json_util = require('../../utils/json_util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: [],
    typeIndex: 0,
    oldLevel: "",
    teamViewIndex: 0,
    teamView: '',
    teamViews: [],
    type: "",
    submitType: "",
    bdate: "",
    btime: "",
    edate: "",
    etime: "",
    vbdate: "",
    vbtime: "",
    vedate: "",
    vetime: "",
    postid: 0,
    title: "",
    content: "",
    tags: "",
    size: "",
    mobile: "",
    price: "",
    storage: "",
    address: "",
    isSinglePost: false,
    isNotifyPost: false,
    uploadurls: [],
    location: {},
    loadingHidden: true,
    school: '',
    schoolid: '',
    group: '',
    groupid: '',
    switchobj: "",
    submitName: '发布',
    lists: [],
    weburl: "",
    showTopTips: false,
    msg:"",
    toastHidden: true, //吐司
    toastText: '',//吐司文本    
  },
  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  tapModify: function (event) {
    wx.navigateBack({
      delta: 1
    })
  },

  onToastChanged: function () {
    this.setData({ toastHidden: !this.data.toastHidden });
  },
  tapImage: function (event) {
    var that = this;
    var url=event.currentTarget.dataset.url
    console.log(url)
    console.log("url:"+url)
    that.setData({
      weburl: url,
    });

    wx.showToast({
      title: '设置提醒图片成功',
      icon: 'success',
      duration: 1000
    })

    console.log("weburl:" + that.data.weburl);
  },

  tapWeburl: function (event) {
    var that = this;
    that.setData({
      weburl: "",
    });
  },

  tapSubmit: function (event) {
    var that = this;
    let formId = event.detail.formId;

    app.collectFormIds(formId); //处理保存推送码

    that.setData({
      loadingHidden: false,
    });

    console.log("that.data.submitType：" + that.data.submitType);
    var method = "accountCreatePost";
    if (that.data.submitType == "mod") {
      method = "accountUpdatePost";
    }
    var infodata = {
      "method": method,
      "parameters": {
        "account": app.globalData.account,
        "password": app.globalData.password,
        "categoryID": that.data.types[that.data.typeIndex].categoryID,
        "dealType": "6",
        "id": that.data.postid,
        "title": that.data.title,
        "content": that.data.content,
        "phone": that.data.mobile,
        "originalPrice": that.data.price,
        "tags": that.data.tags,
        "brand": that.data.school,
        "size": that.data.size,
        "teamView": that.data.teamViews[that.data.teamViewIndex].value,
        "xyz": "",
        "uuid": "0",
        "storage": that.data.storage,
        "groupId": that.data.groupid,
        //"birthland": that.data.bdate + " " + that.data.btime,
        "oldLevel": that.data.oldLevel,
        "position": that.data.address,
        "isSinglePost": Number(that.data.isSinglePost) + "",
        "photos": that.data.uploadurls.toString(),
        "shopland": that.data.switchobj,
        "starttime": that.data.bdate + " " + that.data.btime,
        "endtime": that.data.edate + " " + that.data.etime,
        //"vstarttime": that.data.vbdate + " " + that.data.vbtime,
        "vendtime": that.data.vedate + " " + that.data.vetime,
        "cityid":that.data.schoolid,
        "fields":that.data.lists,
        "weburl": that.data.weburl,
      }
    }
    var url1 = app.apiurl;
    network_util._post_json(url1, infodata,
      function (res) {
        that.setData({
          loadingHidden: true,
        });
        var result = res.data.result;
        var message = res.data.message;

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
          title: '发布成功',
          icon: 'success',
          duration: 1000
        })


        app.reload = "2";

        if (that.data.school != "") {
          app.globalData.school = that.data.school;
          app.globalData.schoolid = that.data.schoolid;
        }
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.setData({
          submitType: "add",
          isAgree: false,
          isNext: false,
          postid: 0,
          title: "",
          content: "",
          storage: "",
          group: "",
          groupid: "",
          size: "",
          price: "",
          mobile: "",
          address: "",
          oldLevel: "",
          isSinglePost: false,
          isNotifyPost: false,
          uploadimgs: [],
          uploadurls: [],
          typeIndex: 0,
          teamViewIndex: 0,
          typeHidden: true,
          schoolHidden: true,
          groupHidden: false,
          moreHidden: false,
          switchxm: false,
          switchxb: false,
          switchsr: false,
          switchdh: false,
          switchrs: false,
          switchbz: false,
          switchsf: false,
          switchxx: false,
          switchtc: false,
          switchyx: false,
          switchwx: false,
          switchnj: false,
          switchxy: false,
          switchlist: false,
          lists: [],
        });

        //跳转到刚刚发布的
        wx.setStorageSync('show_postid', res.data.data.id);

        wx.switchTab({
          url: '../coco/event',
          success: function (e) {
          }
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
      })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this;
    var info = (wx.getStorageSync('info') || [])
    that.setData({
      bdate: info.bdate,
      btime: info.btime,
      edate: info.edate,
      etime: info.etime,
      vbdate: info.vbdate,
      vbtime: info.vbtime,
      vedate: info.vedate,
      vetime: info.vetime,
      postid: info.postid,
      submitType: info.submitType,
      title: info.title,
      content: info.content,
      storage: info.storage,
      oldLevel: info.oldLevel,
      tags: info.tags,
      size: info.size,
      uploadurls: info.uploadurls,
      mobile: info.mobile,
      price: info.price,
      address: info.address,
      isSinglePost: info.isSinglePost,
      isNotifyPost: info.isNotifyPost,

      location: info.location,
      types: info.types,
      typeIndex: info.typeIndex,
      type: info.types[info.typeIndex].categoryName,
      school: info.school,
      schoolid: info.schoolid,
      group: info.group,
      groupid: info.groupid,
      lists: info.lists,
      teamViews: info.teamViews,
      teamViewIndex: info.teamViewIndex,
      teamView: info.teamViews[info.teamViewIndex].name,
    })
    if (info.submitType == 'mod') {
      that.setData({
        submitName: "修改"
      })
    }
    //
    var switchobj = "";

    if (info.switchxm) {
      switchobj = switchobj + "switchxm,"
    }
    if (info.switchxb) {
      switchobj = switchobj + "switchxb,"
    }
    if (info.switchsr) {
      switchobj = switchobj + "switchsr,"
    }
    if (info.switchdh) {
      switchobj = switchobj + "switchdh,"
    }
    if (info.switchrs) {
      switchobj = switchobj + "switchrs,"
    }
    if (info.switchbz) {
      switchobj = switchobj + "switchbz,"
    }
    if (info.switchsf) {
      switchobj = switchobj + "switchsf,"
    }
    if (info.switchxx) {
      switchobj = switchobj + "switchxx,"
    }

    if (info.switchtc) {
      switchobj = switchobj + "switchtc,"
    }
    if (info.switchyx) {
      switchobj = switchobj + "switchyx,"
    }
    if (info.switchwx) {
      switchobj = switchobj + "switchwx,"
    }
    if (info.switchnj) {
      switchobj = switchobj + "switchnj,"
    }
    if (info.switchxy) {
      switchobj = switchobj + "switchxy,"
    }
    if (info.switchlist) {
      switchobj = switchobj + "switchlist,"
    }
    that.setData({
      switchobj: switchobj,
    })
    console.log("switchobj:" + switchobj);

    if (info.uploadurls && info.uploadurls.length>0){
      that.setData({
        msg: "点击图片，可以设置报名提醒图",
        weburl: info.uploadurls[info.uploadurls.length-1]
      })
      that.showTopTips();
    }
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
    wx.removeStorage({
      key: 'info'
    })
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