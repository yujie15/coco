// pages/detail/switch.js

var app = getApp()
var http_util = require('../../utils/http_util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    postid: "",
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

    switchxmval: "",
    switchxbval: "男",
    switchsrval: "",
    switchdhval: "",
    switchrsval: "",
    switchbzval: "",
    switchsfval: "",
    switchxxval: "",


    switchtcval: "",
    switchyxval: "",
    switchwxval: "",
    switchnjval: "",
    switchxyval: "",


    formId: "",
    sexarray: ['男', '女'],
    sexindex: 0,
    showTopTips: false,
    errors: "",
    content: "",
    json: {},
    lists: [],
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      postid: options.postid,
      switchobj: options.switchobj,
      lists: JSON.parse(options.fields),
    })

  },

  bindSwitchxmChange: function(e) {
    this.setData({
      switchxmval: e.detail.value
    })
  },



  bindSwitchxbChange: function(e) {
    var that = this;
    that.setData({
      sexindex: e.detail.value,
      switchxbval: that.data.sexarray[e.detail.value]
    })

  },

  bindSwitchsrChange: function(e) {
    this.setData({
      switchsrval: e.detail.value
    })
  },

  bindSwitchdhChange: function(e) {
    this.setData({
      switchdhval: e.detail.value
    })
  },

  bindSwitchrsChange: function(e) {
    this.setData({
      switchrsval: e.detail.value
    })
  },

  bindSwitchbzChange: function(e) {
    this.setData({
      switchbzval: e.detail.value
    })
  },

  bindSwitchsfChange: function(e) {
    this.setData({
      switchsfval: e.detail.value
    })
  },
  bindSwitchxxChange: function(e) {
    this.setData({
      switchxxval: e.detail.value
    })
  },
  bindSwitchwxChange: function(e) {
    this.setData({
      switchwxval: e.detail.value
    })
  },
  bindSwitchyxChange: function(e) {
    this.setData({
      switchyxval: e.detail.value
    })
  },
  bindSwitchxyChange: function(e) {
    this.setData({
      switchxyval: e.detail.value
    })
  },
  bindSwitchnjChange: function(e) {
    this.setData({
      switchnjval: e.detail.value
    })
  },
  bindSwitchtcChange: function(e) {
    this.setData({
      switchtcval: e.detail.value
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
  bindSubmitActivities: function(e) {

    var that = this;
    var content = "";
    var json = {}
    let formId = e.detail.formId;
    that.dealFormIds(formId); //处理保存推送码

    if (that.data.switchxm) {
      if (that.data.switchxmval == '') {
        that.setData({
          errors: "请填写姓名",
        })
        that.showTopTips();
        return;
      }
      content = content + "[姓名]：" + that.data.switchxmval + "\n";
      json.xm = that.data.switchxmval;
    }
    if (that.data.switchxb) {
      if (that.data.switchxbval == '') {
        that.setData({
          errors: "请填写性别",
        })
        that.showTopTips();
        return;
      }
      content = content + "[性别]：" + that.data.switchxbval + "\n";
      json.xb = that.data.switchxbval;
    }
    if (that.data.switchsr) {
      if (that.data.switchsrval == '') {
        that.setData({
          errors: "请填写生日",
        })
        that.showTopTips();
        return;
      }
      content = content + "[生日]：" + that.data.switchsrval + "\n";
      json.sr = that.data.switchsrval;
    }
    if (that.data.switchsf) {
      if (that.data.switchsfval == '') {
        that.setData({
          errors: "请填写身份证",
        })
        that.showTopTips();
        return;
      }
      content = content + "[身份证]：" + that.data.switchsfval + "\n";
      json.sf = that.data.switchsfval;
    }
    if (that.data.switchxx) {
      if (that.data.switchxxval == '') {
        that.setData({
          errors: "请填写学校",
        })
        that.showTopTips();
        return;
      }
      content = content + "[学校]：" + that.data.switchxxval + "\n";
      json.xx = that.data.switchxxval;
    }
    if (that.data.switchxy) {
      if (that.data.switchxyval == '') {
        that.setData({
          errors: "请填写学院",
        })
        that.showTopTips();
        return;
      }
      content = content + "[学院]：" + that.data.switchxyval + "\n";
      json.xy = that.data.switchxyval;
    }
    if (that.data.switchnj) {
      if (that.data.switchnjval == '') {
        that.setData({
          errors: "请填写年级",
        })
        that.showTopTips();
        return;
      }
      content = content + "[年级]：" + that.data.switchnjval + "\n";
      json.nj = that.data.switchnjval;

    }
    if (that.data.switchwx) {
      if (that.data.switchwxval == '') {
        that.setData({
          errors: "请填写微信号",
        })
        that.showTopTips();
        return;
      }
      content = content + "[微信号]：" + that.data.switchwxval + "\n";
      json.wx = that.data.switchwxval;

    }
    if (that.data.switchyx) {
      if (that.data.switchyxval == '') {
        that.setData({
          errors: "请填写邮箱",
        })
        that.showTopTips();
        return;
      }
      content = content + "[邮箱]：" + that.data.switchyxval + "\n";
      json.yx = that.data.switchyxval;

    }
    if (that.data.switchdh) {
      if (that.data.switchdhval == '') {
        that.setData({
          errors: "请填写电话",
        })
        that.showTopTips();
        return;
      }
      content = content + "[电话]：" + that.data.switchdhval + "\n";
      json.dh = that.data.switchdhval;

    }
    if (that.data.switchrs) {
      if (that.data.switchrsval == '') {
        that.setData({
          errors: "请填写人数",
        })
        that.showTopTips();
        return;
      }
      content = content + "[人数]：" + that.data.switchrsval + "\n";
      json.rs = that.data.switchrsval;

    }
    if (that.data.switchtc) {
      if (that.data.switchtcval == '') {
        that.setData({
          errors: "请填写特长",
        })
        that.showTopTips();
        return;
      }
      content = content + "[特长]：" + that.data.switchtcval + "\n";
      json.tc = that.data.switchtcval;

    }
    if (that.data.switchbz) {
      if (that.data.switchbzval == '') {
        that.setData({
          errors: "请填写备注",
        })
        that.showTopTips();
        return;
      }
      content = content + "[备注]：" + that.data.switchbzval + "\n";
      json.bz = that.data.switchbzval;

    }

    console.log("that.data.switchlist");
    console.log(that.data.switchlist);
    if (that.data.switchlist) {
      for (var i = 0; i < that.data.lists.length; i++) {
        if (!that.data.lists[i].value||that.data.lists[i].value == "") {
          that.setData({
            errors: "请填写" + that.data.lists[i].title,
          })
          that.showTopTips();
          return;
        }
      }

      for (var i = 0; i < that.data.lists.length; i++) {
        content = content + "[" + that.data.lists[i].title + "]：" + that.data.lists[i].value + "\n";
        var key = that.data.lists[i].title;
        var val = that.data.lists[i].value;
        json[key] = val;
      }

    }
    that.setData({
      formId: e.detail.formId,
      content: content,
      json: json,
      errors: ""
    })

    //console.log(JSON.stringify(json));

    wx.showModal({
      content: "确定报名?",
      success: function(res) {
        if (!res.confirm) {
          return;
        }
        that.createCommentFeel();
      }
    });
  },


  createCommentFeel: function(e) {
    var that = this;
    var url1 = app.apiurl;

    var formIds = app.globalData.gloabalFomIds; // 获取gloabalFomIds
    if (formIds.length) { //gloabalFomIds存在的情况下 将数组转换为JSON字符串
      formIds = JSON.stringify(formIds);
      app.globalData.gloabalFomIds = '';
    }


    var reqData = {
      "method": "accountCommentFeel",
      "parameters": {
        "account": app.globalData.account,
        "password": app.globalData.password,
        "id": that.data.postid,
        "grade": 1,
        "size": that.data.size,
        "content": that.data.content,
        "formid": that.data.formId,
        "openid": app.globalData.openid,
        "json": that.data.json,
        "formIds": formIds
      }
    };


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
            success: function(res) {
              if (result == "10100") {
                //调用应用实例的方法获取全局数据
                app.getUserInfo(function(userInfo) {
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
          title: res.message,
          icon: 'success',
          duration: 1000
        })


        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        prevPage.onLoad();
        wx.navigateBack({
          delta: 1, // 回退前 delta(默认为1) 页面
        })

      },
      function(res) {
        wx.showModal({
          content: '网络连接失败',
          showCancel: false,
          success: function(res) {}
        });
      }
    ).catch(function(err) {
      console.log(err);
    });
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

    app.checkLogin();

    var switchobj = this.data.switchobj;

    console.log("switchobj");
    console.log(switchobj)
    if (switchobj.indexOf("switchxm") > -1) {
      this.setData({
        switchxm: true,
      })
    }

    if (switchobj.indexOf("switchxb") > -1) {
      this.setData({
        switchxb: true,
      })
    }
    if (switchobj.indexOf("switchsr") > -1) {
      this.setData({
        switchsr: true,
      })
    }
    if (switchobj.indexOf("switchdh") > -1) {
      this.setData({
        switchdh: true,
      })
    }

    if (switchobj.indexOf("switchrs") > -1) {
      this.setData({
        switchrs: true,
      })
    }
    if (switchobj.indexOf("switchbz") > -1) {
      this.setData({
        switchbz: true,
      })
    }
    if (switchobj.indexOf("switchsf") > -1) {
      this.setData({
        switchsf: true,
      })
    }

    if (switchobj.indexOf("switchxx") > -1) {
      this.setData({
        switchxx: true,
      })
    }
    if (switchobj.indexOf("switchtc") > -1) {
      this.setData({
        switchtc: true,
      })
    }
    if (switchobj.indexOf("switchyx") > -1) {
      this.setData({
        switchyx: true,
      })
    }
    if (switchobj.indexOf("switchwx") > -1) {
      this.setData({
        switchwx: true,
      })
    }
    if (switchobj.indexOf("switchnj") > -1) {
      this.setData({
        switchnj: true,
      })
    }
    if (switchobj.indexOf("switchxy") > -1) {
      this.setData({
        switchxy: true,
      })
    }
    if (switchobj.indexOf("switchlist") > -1) {
      this.setData({
        switchlist: true,
      })
    }
  },

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
  bindKeyInput: function(e) {
    var index = e.currentTarget.dataset.id;
    var value = e.detail.value;

    var lists = this.data.lists;
    lists[index].value = value;
    this.setData({
      lists: lists,
    })
  },
})