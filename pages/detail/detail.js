//detail.js
var app = getApp();
var json_util = require('../../utils/json_util.js');
var network_util = require('../../utils/network_util.js');
var http_util = require('../../utils/http_util.js');

var comment_pageNum = 1; //翻页页数
var comment_pageSize = 10; //每页条数


var apply_pageNum = 1; //翻页页数
var apply_pageSize = 10; //每页条数


function loadPageData(that) {

  var reqData = {
    "method": "getPostDetail",
    "parameters": {
      "account": app.globalData.account,
      "password": app.globalData.password,
      "id": that.data.postid
    }
  }

  var url1 = app.apiurl;
  network_util._post_json(url1, reqData,
    function (res) {
      var result = res.data.result;
      var message = res.data.message;
      if (result != "0") {
        wx.showModal({
          content: message,
          showCancel: false,
          success: function (res) { }
        });
        return;
      }
      var data1 = res.data.data;
      var photos = data1.photos
      var smallphotos = [];
      var bigphotos = [];
      if (photos != null && photos != "" && data1.photo == 1) {
        smallphotos = photos.split(",");
      }
      if (photos != null && photos != "" && data1.photo == 1) {
        bigphotos = photos.replace(/_sm/g, "").split(",");
      }
      //smallphotos.push(data1.wxqrcodeUrl);
      //bigphotos.push(data1.wxqrcodeUrl);
      smallphotos.push("https://sports.ttyclub.com/images/logo/group/default.png");
      bigphotos.push("https://sports.ttyclub.com/images/logo/group/default.png");



      if (parseInt(data1.storage) > 0 && parseInt(data1.feelCount) >= parseInt(data1.storage)) {
        that.setData({
          btnName: "报名替补",
        });
      } else {
        that.setData({
          btnName: "报名",
        });
      }
      if (data1.size != "默认") {
        that.setData({
          btnName: "口令报名",
        });
      }
      if (data1.isApply == "1") {
        that.setData({
          btnName: "取消报名",
        });
      }

      console.log("data1.freeShipment :" + data1.freeShipment);


      var d1 = new Date(data1.applyendtime);
      var d2 = new Date();

      total_micro_second = parseInt(d2 - d1) / 1000

      //console.log("total_micro_second:" + total_micro_second);

      //已结束
      if (data1.enddaynote == "0") {
        that.setData({
          //disabled: true,
        });
      }
      //已报名，小于一天
      if (data1.isApply == "1" && parseInt(data1.endday) <= 1) {
        that.setData({
          //disabled: true,
        });
      }
      //截掉标签末尾,
      var tags = data1.tags;
      tags = (tags.substring(tags.length - 1) == ',') ? tags.substring(0, tags.length - 1) : tags;
      data1.tags = tags;
      that.setData({
        userpost: data1,
        avatar: data1.avatar,
        coverimgs: smallphotos,
        bigcoverimgs: bigphotos,
        storage: parseInt(data1.storage),
      });
      that.setData({
        loadingHidden: true,
      });
    },
    function (res) {
      wx.showModal({
        content: '网络连接失败',
        showCancel: false,
        success: function (res) { }
      });
    });
}




var loadApplyeData = function (that) {
  var url1 = app.apiurl;
  var reqData = {
    "method": "getPostFeelByRelation",
    "parameters": {
      "account": app.globalData.account,
      "password": app.globalData.password,
      "id": that.data.postid,
      "start": (apply_pageNum - 1) * apply_pageSize,
      "count": apply_pageSize,
      "isFriended": 0
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
        var list = res.data.list;
        var totalCount = res.data.totalCount;
        var allData = that.data.applyList;

        if (totalCount == "0" || result == "4") {
          return;
        }
        if (result != "0" && result != "4") {
          wx.showModal({
            content: message,
            showCancel: false,
            success: function (res) { }
          });
          return;
        }
        for (var i = 0; i < list.length && allData.length < totalCount; i++) {
          allData.push(list[i]);
        }
        that.setData({
          applyList: allData,
        });
        if (allData.length < totalCount) {
          apply_pageNum++;
        }

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



var loadCommentData = function (that) {
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
  var reqData = {
    "method": "getPostCommentsByRelation",
    "parameters": {
      "account": app.globalData.account,
      "password": app.globalData.password,
      "id": that.data.postid,
      "start": (comment_pageNum - 1) * comment_pageSize,
      "count": comment_pageSize,
      "isFriended": 0,
      "order": "likes",
    }
  }



  try {
    var test = {
      data: reqData,
      url: url1
    };
    http_util.httpPost(test).then(
      function (res) {

        that.setData({
          loadingHidden: true,
        });

        var result = res.result;
        var message = res.message;
        var list = res.data.list;
        var totalCount = res.data.totalCount;
        var allData = that.data.commentList;

        if (totalCount == "0" || result == "4") {
          that.setData({
            hasMore: false,
          });
          return;
        }
        if (result != "0" && result != "4") {
          wx.showModal({
            content: message,
            showCancel: false,
            success: function (res) { }
          });
          return;
        }

        for (var i = 0; i < list.length && allData.length < totalCount; i++) {
          allData.push(list[i]);
        }
        that.setData({
          commentList: allData,
        });
        if (allData.length >= totalCount) {
          that.setData({
            hasMore: false,
          });
        } else {
          comment_pageNum++;
        };

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
}

// 定义一个总毫秒数，以一分钟为例。TODO，传入一个时间点，转换成总毫秒数
var total_micro_second = 36 * 60 * 60 * 1000;

/* 毫秒级倒计时 */
function count_down(that) {
  // 渲染倒计时时钟
  that.setData({
    clock: date_format(total_micro_second)
  });

  if (total_micro_second <= 0) {
    that.setData({
      clock: "已经截止"
    });
    // timeout则跳出递归
    return;
  }
  setTimeout(function () {
    // 放在最后--
    total_micro_second -= 10;
    count_down(that);
  }, 10)
}

// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
function date_format(micro_second) {
  // 秒数
  var second = Math.floor(micro_second / 1000);
  // 小时位
  var hr = Math.floor(second / 3600);
  // 分钟位
  var min = fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
  // 秒位
  var sec = fill_zero_prefix((second - hr * 3600 - min * 60)); // equal to => var sec = second % 60;
  // 毫秒位，保留2位
  var micro_sec = fill_zero_prefix(Math.floor((micro_second % 1000) / 10));

  return hr + ":" + min + ":" + sec + " " + micro_sec;
}

// 位数不足补零
function fill_zero_prefix(num) {
  return num < 10 ? "0" + num : num
}


Page({
  data: {
    postid: "",
    artype: "",
    userpost: {},
    coverimgs: [],
    bigcoverimgs: [],
    currentIndex: 1,
    applyList: [],
    commentList: [],
    hasMore: true,
    loadingHidden: true,
    disabled: false,
    btnName: "报名",
    userInfo: {},
    modalHidden: true,
    nocancel: false,
    size: "",
    formId: "",
    storage: 0,
    account: "",
    avatar: "../../images/msn.png",
    clock: '',

    isPopping: false, //是否已经弹出
    animPlus: {}, //旋转动画
    animCollect: {}, //item位移,透明度
    animTranspond: {}, //item位移,透明度
    animInput: {}, //item位移,透明度


    actionSheetHidden: true,
    actionSheetItems: [{
      bindtap: 'EditPost',
      txt: '修改活动'
    },
    {
      bindtap: 'ImgPreview',
      txt: '二维码'
    },
    {
      bindtap: 'ModalShow',
      txt: '下载报名'
    },
    {
      bindtap: 'AddPost',
      txt: '再发一个'
    },
      {
        bindtap: 'DelPost',
        txt: '删除活动'
      },
    ],
    emailModalHidden: true,
    email: "",
    nocancel: false,
    animationData: '',
    showModalStatus: false

  },
  callContact: function (e) { //拨打电话
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phonenumber
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //console.log("用户登录账户：" + app.globalData.account);

    console.log("app.reload:" + app.reload);
    if (app.reload == 1) {
      app.reload = "";
      this.onLoad();
    }


    var formIds = app.globalData.gloabalFomIds; // 获取gloabalFomIds
    if (formIds != null && formIds.length) { //gloabalFomIds存在的情况下 将数组转换为JSON字符串
      formIds = JSON.stringify(formIds);
      console.log("formIds:" + formIds);
    }
    this.setData({
      account: app.globalData.account
    });


  },

  onLoad: function (options) {
    wx.showShareMenu({
      withShareTicket: true
    })
    var that = this;
    if (options && options.postid) {
      that.setData({
        postid: options.postid,
      })
    }
    console.log("postid:" + this.data.postid);

    that.setData({
      applyList: [],
      commentList: [],
      hasMore: true,
      loadingHidden: true,
      size: ""
    })
    comment_pageNum = 1;
    apply_pageNum = 1;
    loadPageData(this);
    loadApplyeData(this);
    loadCommentData(this);
  },

  onReachBottom: function () {
    loadCommentData(this);
  },

  pullUpLoadApply: function () {
    //console.log("pullUpLoadApply");
    loadApplyeData(this);
  },

  modalCancel: function () {
    this.setData({
      modalHidden: true,
      size: "",
    });
  },
  modalConfirm: function () {
    if (this.data.size == "") {
      wx.showModal({
        content: '请填写口令',
        showCancel: false,
        success: function (res) { }
      });
      return;
    }
    this.setData({
      modalHidden: true
    });
    this.createCommentFeel();
  },

  bindInputSize: function (e) {
    this.setData({
      size: e.detail.value
    })
  },


  bindSubmitActivities: function (e) {

    var that = this;
    that.setData({
      formId: e.detail.formId
    })


    if (that.data.userpost.isApply == 1) {
      let formId = e.detail.formId;
      that.dealFormIds(formId); //处理保存推送码    
      wx.showModal({
        title: '提示',
        content: '是否取消该报名?',
        success: function (res) {
          if (res.confirm) {
            var url1 = app.apiurl;
            var reqData = {
              "method": "accountDeleteCommentApply",
              "parameters": {
                "account": app.globalData.account,
                "password": app.globalData.password,
                "id": that.data.postid,
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
                  title: '取消成功',
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

    } else {




      let fieldsStr = JSON.stringify(that.data.userpost.fields)
      if (that.data.userpost.shopland != "") {
        let formId = e.detail.formId;
        that.dealFormIds(formId); //处理保存推送码        
        wx.navigateTo({
          url: '../detail/switch?postid=' + this.data.postid + "&switchobj=" + that.data.userpost.shopland + "&fields=" + fieldsStr
        })
        return;
      }
      if (that.data.userpost.size && that.data.userpost.size != "默认") {
        that.setData({
          modalHidden: false
        })
      } else {
        wx.showModal({
          content: "确定报名?",
          success: function (res) {
            if (!res.confirm) {
              return;
            }
            that.createCommentFeel();
          }
        });
      }
    }
  },

  dealFormIds: function (formId) {
    let formIds = app.globalData.gloabalFomIds; //获取全局数据中的推送码gloabalFomIds数组
    if (!formIds) formIds = [];
    let data = {
      formId: formId,
      expire: parseInt(new Date().getTime() / 1000) + 604800 //计算7天后的过期时间时间戳
    }
    formIds.push(data); //将data添加到数组的末尾
    app.globalData.gloabalFomIds = formIds; //保存推送码并赋值给全局变量
  },


  createCommentFeel: function (e) {

    var that = this;
    var url1 = app.apiurl;

    var formIds = app.globalData.gloabalFomIds; // 获取gloabalFomIds
    if (formIds && formIds.length) { //gloabalFomIds存在的情况下 将数组转换为JSON字符串
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
        "content": "报名",
        "formid": that.data.formId,
        "openid": app.globalData.openid,
        "formIds": formIds

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
          title: res.message,
          icon: 'success',
          duration: 1000
        })

        that.showWeburl("open");
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
  },

  onShareAppMessage: function () {

    return {
      title: this.data.userpost.title,
      desc: this.data.userpost.description,
      path: '/pages/detail/detail?postid=' + this.data.userpost.id,
      withShareTicket: true,
      success: function (res) {

        wx.getShareInfo({
          shareTicket: res.shareTickets[0],
          success(res) {
            console.log(res.encryptedData)
            console.log(res.iv)
            // 后台解密，获取 openGId
          }
        })


      }
    }
  },

  bindTapComment: function () {
    wx.navigateTo({
      url: '../detail/apply?postid=' + this.data.postid
    })
  },

  setCurrent: function (e) { //当前图片索引
    this.setData({
      currentIndex: e.detail.current + 1
    })
  },
  imgPreview: function () { //图片预览
    const imgs = this.data.bigcoverimgs;
    wx.previewImage({
      current: imgs[this.data.currentIndex - 1], // 当前显示图片的http链接
      urls: imgs // 需要预览的图片http链接列表
    })
  },

  avatarPreview: function (e) { //图片预览
    if (e.currentTarget.dataset.url != "") {
      const imgs = [e.currentTarget.dataset.url];
      wx.previewImage({
        current: imgs[0], // 当前显示图片的http链接
        urls: imgs // 需要预览的图片http链接列表
      })
    }
  },



  bindTapMap: function () {
    wx.navigateTo({
      url: '../map/map?query=' + this.data.userpost.tags
    })
  },

  bindTapHome: function (e) {
    wx.navigateTo({
      url: '../home/home?user=' + e.currentTarget.dataset.account
    })
  },
  bindTapModify: function (e) {
    wx.setStorageSync('mod_postid', this.data.postid);
    wx.navigateTo({
      url: '../add/add'
    })

  },


  bindTapIndex: function (e) {
    wx.switchTab({
      url: '../coco/event'
    })
  },

  bindApplyList: function (e) {
    wx.navigateTo({
      url: '../myconferencelist/applylist?postid=' + this.data.postid
    })
  },
  //点击弹出
  plus: function () {
    if (this.data.isPopping) {
      //缩回动画
      this.popp();
      this.setData({
        isPopping: false
      })
    } else if (!this.data.isPopping) {
      //弹出动画
      this.takeback();
      this.setData({
        isPopping: true
      })
    }
  },

  //弹出动画
  popp: function () {
    //plus顺时针旋转
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(180).step();
    //animationcollect.translate(-100, -100).rotateZ(180).opacity(1).step();
    //animationTranspond.translate(-140, 0).rotateZ(180).opacity(1).step();
    //animationInput.translate(-100, 100).rotateZ(180).opacity(1).step();



    animationcollect.translate(0, -200).rotateZ(180).opacity(1).step();
    animationTranspond.translate(0, -150).rotateZ(180).opacity(1).step();
    animationInput.translate(0, -100).rotateZ(180).opacity(1).step();



    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  },
  //收回动画
  takeback: function () {
    //plus逆时针旋转
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(0).step();
    animationcollect.translate(0, 0).rotateZ(0).opacity(0).step();
    animationTranspond.translate(0, 0).rotateZ(0).opacity(0).step();
    animationInput.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animTranspond: animationTranspond.export(),
      animInput: animationInput.export(),
    })
  },
  tapEventManage: function (event) {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },
  actionSheetbindchange: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },

  bindMenuEditPost: function () {
    var that = this;

    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })


    that.bindTapModify();

  },
  bindMenuImgPreview: function (e) { //图片预览

    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })

    const img = this.data.userpost.wxqrcodeUrl;
    var imgArray = [];
    imgArray.push(img);
    wx.previewImage({
      current: img, // 当前显示图片的http链接
      urls: imgArray // 需要预览的图片http链接列表
    })
  },
  bindMenuModalShow: function (e) { //图片预览
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })

    this.emailModalShow();
  },

  bindMenuAddPost: function (e) { //图片预览
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
    wx.setStorageSync('add_postid', this.data.userpost.id);

    wx.navigateTo({
      url: '../add/add'
    })
  },

  bindMenuDelPost: function (e) { //图片预览
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })

    var that = this;


    wx.showModal({
      title: '提示',
      content: '确认删除该活动?',
      success: function (res) {
        if (res.confirm) {
          var url1 = app.apiurl;
          var reqData = {
            "method": "accountDeletePost",
            "parameters": {
              "account": app.globalData.account,
              "password": app.globalData.password,
              "id": that.data.userpost.id
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

  emailModalShow: function (e) {
    this.setData({
      emailModalHidden: false
    })
  },

  emailModalCancel: function () {
    this.setData({
      email: "",
      emailModalHidden: true,
    });
  },


  emailModalConfirm: function (e) {

    let that = this;

    if (that.data.email == "") {
      wx.showModal({
        content: '请填写邮箱',
        showCancel: false,
        success: function (res) { }
      });
      return;
    }

    that.setData({
      emailModalHidden: true,
    });


    var url1 = app.apiurl;
    var reqData = {
      "method": "accountSendEventApply",
      "parameters": {
        "account": app.globalData.account,
        "password": app.globalData.password,
        "id": that.data.userpost.id,
        "email": that.data.email,
      }
    };


    try {
      var test = {
        data: reqData,
        url: url1
      };
      http_util.httpPost(test).then(
        function (res) {
          that.setData({
            loadingHidden: true,
            email: "",
          });
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

          wx.showToast({
            title: '请查收',
            icon: 'success',
            duration: 1000
          })


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

  bindInputEmail: function (e) {
    this.setData({
      email: e.detail.value
    })
  },
  tapLike: function (e) {
    let that = this;
    var markId = e.currentTarget.dataset.markid;
    let currentIndex = that.data.commentList.findIndex(item => item.markId === markId);
    var isLike = that.data.commentList[currentIndex].isLike;
    var likeCount = Number(that.data.commentList[currentIndex].likes) + 1;

    that.setData({
      ['commentList[' + currentIndex + '].isLike']: '1',
      ['commentList[' + currentIndex + '].likes']: likeCount
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
              success: function (res) { }
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

  //关闭窗口
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.showWeburl(currentStatu)
  }, 


  previewImage: function (e) {
    let that = this;

    var current = e.target.dataset.src
    var ImageLinkArray = [current]
    wx.previewImage({
      current: current,
      urls: ImageLinkArray,//内部的地址为绝对路径
      fail: function () {
        console.log('fail')
      },
      complete: function () {
        console.info("点击图片了");
        that.showWeburl("close");
      },
    })
  },

  showWeburl: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例   
    var animation = wx.createAnimation({
      duration: 200,  //动画时长  
      timingFunction: "linear", //线性  
      delay: 0  //0则不延迟  
    });

    // 第2步：这个动画实例赋给当前的动画实例  
    this.animation = animation;

    // 第3步：执行第一组动画  
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存  
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画  
    setTimeout(function () {
      // 执行第二组动画  
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象  
      this.setData({
        animationData: animation
      })

      //关闭  
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false
          }
        );
      }
    }.bind(this), 200)

    // 显示  
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true
        }
      );
    }
  }

})