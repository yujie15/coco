var app = getApp()
var util = require('../../utils/util.js');
var network_util = require('../../utils/network_util.js');
// 加载数据  
var loadPageData = function(that) {

  var url1 = app.apiurl;
  var reqData = {
    "method": "getCategoryList",
    "parameters": {
      "type": "1051",
      "items": 0,
    }
  }

  network_util._post_json(url1, reqData,
    function(res) {
      var result = res.data.result;
      var message = res.data.message;
      var list = res.data.data.list;
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
    });
}


function loadPostData(that) {
  var add_postid = (wx.getStorageSync('add_postid') || 0);
  var mod_postid = (wx.getStorageSync('mod_postid') || 0);


  console.log("add_postid:" + add_postid);
  console.log("mod_postid:" + mod_postid);
  var postid = 0;
  if (add_postid > 0) {
    postid = add_postid;
    that.setData({
      postid: 0,
      submitType: "add"
    })
  } else if (mod_postid > 0) {
    postid = mod_postid;
    that.setData({
      postid: postid,
      submitType: "mod"
    })
  } else {
    return;
  }

  wx.setStorageSync('add_postid', 0);
  wx.setStorageSync('mod_postid', 0);

  var reqData = {
    "method": "getPostDetail",
    "parameters": {
      "account": app.globalData.account,
      "password": app.globalData.password,
      "id": postid
    }
  }

  var url1 = app.apiurl;
  network_util._post_json(url1, reqData,
    function(res) {
      var result = res.data.result;
      var message = res.data.message;
      if (result != "0") {
        wx.showModal({
          content: message,
          showCancel: false,
          success: function(res) {}
        });
        return;
      }
      var data1 = res.data.data;

      var sbdate1 = data1.birthland + ":00";
      var bdate1 = new Date(Date.parse(sbdate1.replace(/-/g, "/")));

      var sedate1 = data1.endtime + ":00";
      var edate1 = new Date(Date.parse(sedate1.replace(/-/g, "/")));

      var svedate1 = data1.applyendtime + ":00";
      var vedate1 = new Date(Date.parse(svedate1.replace(/-/g, "/")));


      that.setData({
        title: data1.title,
        content: data1.content,
        mobile: data1.phone,
        school: data1.brand,
        schoolid: data1.cityid,
        address: data1.position,
        tags: data1.tags,
        price: data1.originalPrice,
        storage: data1.storage,
        oldLevel: data1.oldLevel,
        groupid: data1.groupId,
        group: data1.groupName,
        bdate: util.formatDate(bdate1, "yyyy-MM-dd"),
        btime: util.formatDate(bdate1, "hh:mm"),
        edate: util.formatDate(edate1, "yyyy-MM-dd"),
        etime: util.formatDate(edate1, "hh:mm"),
        vedate: util.formatDate(vedate1, "yyyy-MM-dd"),
        vetime: util.formatDate(vedate1, "hh:mm"),
        switchobj: data1.shopland,
        lists: data1.fields,
      });

      console.info("data1.groupId:" + data1.groupId);
      console.info("data1.groupName:" + data1.groupName);

      for (var i = 0; i < that.data.types.length; i++) {
        if (that.data.types[i].categoryID == data1.sortid) {
          that.setData({
            typeIndex: i,
          });
        }
      }
      for (var i = 0; i < that.data.teamViews.length; i++) {
        if (that.data.teamViews[i].value == data1.teamView) {
          that.setData({
            teamViewIndex: i,
          });
        }
      }

      if (data1.isSinglePost == "1") {
        that.setData({
          isSinglePost: true,
        });
      }

      if (data1.oldLevel != "") {
        that.setData({
          isNotifyPost: true,
        });
      }



      /////////////////////////
      //还原扩展字段选择状态
      var switchobj = that.data.switchobj;
      if (switchobj.indexOf("switchxm") > -1) {
        that.setData({
          switchxm: true,
        })
      }

      if (switchobj.indexOf("switchxb") > -1) {
        that.setData({
          switchxb: true,
        })
      }
      if (switchobj.indexOf("switchsr") > -1) {
        that.setData({
          switchsr: true,
        })
      }
      if (switchobj.indexOf("switchdh") > -1) {
        that.setData({
          switchdh: true,
        })
      }

      if (switchobj.indexOf("switchrs") > -1) {
        that.setData({
          switchrs: true,
        })
      }
      if (switchobj.indexOf("switchbz") > -1) {
        that.setData({
          switchbz: true,
        })
      }
      if (switchobj.indexOf("switchsf") > -1) {
        that.setData({
          switchsf: true,
        })
      }

      if (switchobj.indexOf("switchxx") > -1) {
        that.setData({
          switchxx: true,
        })
      }
      if (switchobj.indexOf("switchtc") > -1) {
        that.setData({
          switchtc: true,
        })
      }
      if (switchobj.indexOf("switchyx") > -1) {
        that.setData({
          switchyx: true,
        })
      }
      if (switchobj.indexOf("switchwx") > -1) {
        that.setData({
          switchwx: true,
        })
      }
      if (switchobj.indexOf("switchnj") > -1) {
        that.setData({
          switchnj: true,
        })
      }
      if (switchobj.indexOf("switchxy") > -1) {
        that.setData({
          switchxy: true,
        })
      }

      if (switchobj.indexOf("switchlist") > -1) {
        that.setData({
          switchlist: true,
        })
      }

      //////////////////////////////////////////

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
    });
}


// add.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    types: [],
    typeIndex: 0,
    teamViewIndex: 0,
    oldLevel: "",
    showTopTips: false,
    submitType: "add",
    bdate: "",
    bdatestart: "",
    btime: "",
    edate: "",
    edatestart: "",
    etime: "",
    vbdate: "",
    vbdatestart: "",
    vbtime: "",
    vedate: "",
    vedatestart: "",
    vetime: "",
    postid: 0,
    title: "",
    content: "",
    storage: "",
    tags: "",
    size: "",
    price: "",
    mobile: "",
    address: "",
    isSinglePost: false,
    isNotifyPost: false,
    edate: "",
    etime: "",
    isAgree: false,
    isNext: false,
    errors: "",
    uploadimgs: [], //上传图片列表
    uploadurls: [], //上传图片URL列表
    disabled: false,
    editable: true,
    hasLocation: false,
    location: {},
    latitude: '',
    longitude: '',
    school: '',
    schoolid: '',
    group: '',
    groupid: '',
    teamView: '',
    teamViews: [

      {
        "name": "公开可见",
        "value": "",
        "note": "（优质活动会在发现推荐）"
      },

      {
        "name": "私密活动",
        "value": "111",
        "note": "(在我的活动可见)"
      }

    ],
    typeHidden: false,
    schoolHidden: false,
    groupHidden: false,
    moreHidden: true,
    switchobj: "",
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
  },
  addList: function() {
    var lists = this.data.lists;
    var newData = {
      title: ""
    };
    lists.push(newData); //实质是添加lists数组内容，使for循环多一次
    this.setData({
      lists: lists,
    })
  },
  delList: function() {
    var lists = this.data.lists;
    lists.pop(); //实质是删除lists数组内容，使for循环少一次
    this.setData({
      lists: lists,
    })
  },

  bindKeyInput: function(e) {
    var index = e.currentTarget.dataset.id;
    var title = e.detail.value;

    var lists = this.data.lists;
    lists[index].title = title;
    this.setData({
      lists: lists,
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
    var schoolHidden = true;
    var groupHidden = true;

    if (e.detail.value == 0) {
      schoolHidden = false;

      groupHidden = false;

    } else {
      schoolHidden = true;
      groupHidden = true;

    }

    this.setData({
      teamViewIndex: e.detail.value,
      schoolHidden: schoolHidden,
      groupHidden: groupHidden

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
  bindMobileChange: function(e) {
    this.setData({
      mobile: e.detail.value
    })
  },
  bindPriceChange: function(e) {
    this.setData({
      price: e.detail.value
    })
  },

  bindSizeChange: function(e) {
    this.setData({
      size: e.detail.value
    })
  },

  bindAddressChange: function(e) {
    this.setData({
      address: e.detail.value
    })
  },
  bindTagsChange: function(e) {
    this.setData({
      tags: e.detail.value
    })
  },
  bindSchoolChange: function(e) {
    this.setData({
      school: e.detail.value
    })
  },
  bindGroupChange: function(e) {
    this.setData({
      group: e.detail.value
    })
  },
  bindStorageChange: function(e) {
    this.setData({
      storage: e.detail.value
    })
  },

  bindBDateChange: function(e) {
    this.setData({
      bdate: e.detail.value
    })
  },
  bindBTimeChange: function(e) {
    this.setData({
      btime: e.detail.value
    })
  },
  bindEDateChange: function(e) {
    this.setData({
      edate: e.detail.value
    })
  },
  bindETimeChange: function(e) {
    this.setData({
      etime: e.detail.value
    })
  },


  bindVBDateChange: function(e) {
    this.setData({
      vbdate: e.detail.value
    })
  },
  bindVBTimeChange: function(e) {
    this.setData({
      vbtime: e.detail.value
    })
  },
  bindVEDateChange: function(e) {
    this.setData({
      vedate: e.detail.value
    })
  },
  bindVETimeChange: function(e) {
    this.setData({
      vetime: e.detail.value
    })
  },

  bindAgreeChange: function(e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  submit: function() {
    wx.setStorageSync('info', this.data)
    wx.navigateTo({
      url: '../add/show'
    })
  },
  dealFormIds: function(formId) {
    let formIds = app.globalData.gloabalFomIds; //获取全局数据中的推送码gloabalFomIds数组
    if (!formIds) formIds = [];
    let data = {
      formId: formId,
      expire: parseInt(new Date().getTime() / 1000) + 604800 //计算7天后的过期时间时间戳
    }
    formIds.push(data); //将data添加到数组的末尾
    app.globalData.gloabalFomIds = formIds; //保存推送码并赋值给全局变量
  },

  bindToastTap: function(e) {
    var that = this;
    let formId = e.detail.formId;
    that.dealFormIds(formId); //处理保存推送码

    if (that.data.title == '') {
      wx.showModal({
        content: "请填写主题",
        showCancel: false,
        success: function(res) {}
      });
      return;
    };
    if (that.data.content == '') {
      wx.showModal({
        content: "请填写活动详情",
        showCancel: false,
        success: function(res) {}
      });
      return;
    };
    /*
    if (that.data.address == '') {
      wx.showModal({
        content: "请填写场地",
        showCancel: false,
        success: function(res) {}
      });
      return;
    };
    */
    /*
    if (!that.data.schoolHidden && that.data.school == '') {
      wx.showModal({
        content: "请填写学校",
        showCancel: false,
        success: function(res) {}
      });
      return;
    };
    */
    that.setData({
      disabled: !this.data.disabled,
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


  getLocation: function() {
    let _this = this;
    var that = wx.getLocation({
      success: function(res) {
        console.log(res)
        wx.request({
          url: 'https://api.map.baidu.com/geocoder/v2/?ak=' + app.ak + '&location=' + res.latitude + ',' + res.longitude + '&output=json&pois=1',
          data: {},
          header: {
            'Content-Type': 'application/json'
          },
          success: function(ops) {
            _this.setData({
              address: ops.data.result.formatted_address,
              hasLocation: true,
              location: util.formatLocation(res.longitude, res.latitude), //这里是获取经纬度
              longitude: res.longitude,
              latitude: res.latitude,
            })
          }
        })
      }
    })
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("onLoad");
    var that = this;
    var now = new Date();
    var now_later = new Date(now.getTime());
    var d = util.formatDate(now_later, "yyyy-MM-dd");
    var t00 = util.formatDate(now_later, "00:00");
    var t12 = util.formatDate(now_later, "12:00");
    var t23 = util.formatDate(now_later, "23:00");

    that.setData({
      submitType: "add",
      oldLevel: "",
      postid: 0,
      title: "",
      content: "",
      storage: "",
      size: "",
      price: "",
      mobile: "",
      address: "",
      isSinglePost: false,
      isNotifyPost: false,
      isAgree: false,
      isNext: false,
      bdate: d,
      bdatestart: d,
      btime: t12,
      edate: d,
      edatestart: d,
      etime: t23,

      vbdate: d,
      vbdatestart: d,
      vbtime: t00,
      vedate: d,
      vedatestart: d,
      vetime: t23,

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

      //tags: app.globalData.school,
      //school: app.globalData.school,
      //schoolid: app.globalData.schoolid,
    })
    //that.getLocation();
    loadPageData(that);



  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("onShow");
    var that = this;
    app.checkLogin();
    this.setData({
      isNext: false,
    })

    loadPostData(that);
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    let that = this;
    console.log("onHide<>" + this.data.submitType);
    console.log("onHide<>" + this.data.isNext);
    //清除修改信息,修改信息
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
  tapSchool: function(event) {

    console.log("tapSchool<>" + this.data.isNext);
    this.setData({
      isNext: true,
    })
    wx.navigateTo({
      url: '../search/search?isSelect=1&returnPage=add'
    })
  },

  tapGroup: function(event) {

    console.log("tapGroup<>" + this.data.isNext);
    this.setData({
      isNext: true,
    })
    wx.navigateTo({
      url: '../search/group?isSelect=1&returnPage=add'
    })
  },

  switchxm: function(e) {
    this.setData({
      switchxm: e.detail.value,
    })
  },

  switchxb: function(e) {
    this.setData({
      switchxb: e.detail.value,
    })
  },


  switchsr: function(e) {
    this.setData({
      switchsr: e.detail.value,
    })
  },

  switchdh: function(e) {
    this.setData({
      switchdh: e.detail.value,
    })
  },


  switchrs: function(e) {
    this.setData({
      switchrs: e.detail.value,
    })
  },


  switchbz: function(e) {
    this.setData({
      switchbz: e.detail.value,
    })
  },

  switchsf: function(e) {
    this.setData({
      switchsf: e.detail.value,
    })
  },

  switchxx: function(e) {
    this.setData({
      switchxx: e.detail.value,
    })
  },

  bindIsSinglePostChange: function(e) {
    this.setData({
      isSinglePost: e.detail.value,
    })
  },

  bindIsNotifyPostChange: function(e) {
    this.setData({
      isNotifyPost: e.detail.value,
    })
    if (e.detail.value) {
      this.setData({
        oldLevel: "isNotifyPost",
      })
    } else {
      this.setData({
        oldLevel: "",
      })
    }

  },

  tapMore: function(e) {
    this.setData({
      moreHidden: !this.data.moreHidden
    })
  },
  clickButton: function(e) {
    //打印所有关于点击对象的信息

    var name = e.currentTarget.dataset.name;
    if (name == 'xm') {
      this.setData({
        switchxm: this.data.switchxm ? 0 : 1
      })
    }

    if (name == 'xb') {
      this.setData({
        switchxb: this.data.switchxb ? 0 : 1
      })
    }
    if (name == 'sr') {
      this.setData({
        switchsr: this.data.switchsr ? 0 : 1
      })
    }
    if (name == 'dh') {
      this.setData({
        switchdh: this.data.switchdh ? 0 : 1
      })
    }
    if (name == 'rs') {
      this.setData({
        switchrs: this.data.switchrs ? 0 : 1
      })
    }
    if (name == 'bz') {
      this.setData({
        switchbz: this.data.switchbz ? 0 : 1
      })
    }

    if (name == 'list') {
      this.setData({
        switchlist: this.data.switchlist ? 0 : 1
      })
    }

    if (name == 'sf') {
      this.setData({
        switchsf: this.data.switchsf ? 0 : 1
      })
    }
    if (name == 'xx') {
      this.setData({
        switchxx: this.data.switchxx ? 0 : 1
      })
    }
    if (name == 'yx') {
      this.setData({
        switchyx: this.data.switchyx ? 0 : 1
      })
    }
    if (name == 'tc') {
      this.setData({
        switchtc: this.data.switchtc ? 0 : 1
      })
    }
    if (name == 'wx') {
      this.setData({
        switchwx: this.data.switchwx ? 0 : 1
      })
    }
    if (name == 'nj') {
      this.setData({
        switchnj: this.data.switchnj ? 0 : 1
      })
    }
    if (name == 'xy') {
      this.setData({
        switchxy: this.data.switchxy ? 0 : 1
      })
    }
  },
})