//app.js
if (!Array.prototype.findIndex) {
  require('./utils/array-findIndex')
}

App({
  apiurl: 'https://sports.ttyclub.com/client_android.action',
  uploadurl: 'https://sports.ttyclub.com/servlet/JJUploadImageServlet',
  ak: 'NQMDt0Qph0MQwL03hpdGlyzUzb3LIN0k',
  reload: 0,
  name: "可可社群活动",
  shareTicket: "",

  initData: {
    userInfo: null,
    code: "",
    iv: "",
    encryptedData: "",
    account: "guest",
    password: "123456",
    openid: "",
    //school: "",
    //schoolid: "",
    school: "北京市",
    schoolid: "257",
  },

  globalData: {},

  collectFormIds: function(formId) {
    let formIds = this.globalData.gloabalFomIds; //获取全局数据中的推送码gloabalFomIds数组
    if (!formIds) formIds = [];
    let data = {
      formId: formId,
      expire: parseInt(new Date().getTime() / 1000) + 604800 //计算7天后的过期时间时间戳
    }
    formIds.push(data); //将data添加到数组的末尾
    this.globalData.gloabalFomIds = formIds; //保存推送码并赋值给全局变量
  },

  onLaunch: function(options) {
    //调用API从本地缓存中获取数据
    this.globalData = JSON.parse(JSON.stringify(this.initData));
    this.loadUserInfo();


    console.log("shareTicket:" + options.shareTicket);
  },
  getUserInfo: function(cb) {

    var that = this;
    if (that.globalData.userInfo != null) {
      console.log("getUserInfo 已经登录");
      typeof cb == "function" && cb(that.globalData.userInfo)
    } else {
      console.log("getUserInfo 开始登录");
      //调用登录接口
      wx.login({
        success: function(res) {
          let code = res.code;
          wx.getUserInfo({
            success: function(res) {
              that.globalData.userInfo = res.userInfo;
              that.globalData.code = code;
              that.globalData.iv = res.iv;
              that.globalData.encryptedData = res.encryptedData;
              that.get3rdSession();
              typeof cb == "function" && cb(that.globalData.userInfo);

            },
            fail: function() {
              wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
                success: function(res) {
                  if (res.confirm) {
                    wx.openSetting({
                      success: (res) => {
                        if (res.authSetting["scope.userInfo"]) { ////如果用户重新同意了授权登录
                          wx.getUserInfo({
                            success: function(res) {
                              that.globalData.userInfo = res.userInfo;
                              that.globalData.code = code;
                              that.globalData.iv = res.iv;
                              that.globalData.encryptedData = res.encryptedData;
                              that.get3rdSession();
                              typeof cb == "function" && cb(that.globalData.userInfo);

                            }
                          })
                        }
                      },
                      fail: function(res) {

                      }
                    })

                  }
                }
              })
            },
            complete: function(res) {


            }

          })

          // wx.request({
          //   url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx9e205f329d6e7fb3&secret=4e4872a7dd1dfaf3eb7e684f1dd102fb&js_code=' + res.code + '&grant_type=authorization_code',
          //   data: {},
          //   header: {
          //     'content-type': 'application/json'
          //   },
          //   success: function (res) {
          //     var openid = res.data.openid; //返回openid
          //     that.globalData.openid = openid;
          //   }
          // })
        }
      })
    }
  },
  checkLogin: function() {
    console.log("checkLogin " + this.globalData.account);
    if (this.globalData.userInfo == null || this.globalData.account == "" || this.globalData.account == "guest") {
      let globalData = wx.getStorageSync('globalData');
      if (globalData && globalData.userInfo && globalData.userInfo != null) {
        console.log("checkLogin 设置存储信息");
        this.globalData = globalData;
        return;
      }
      wx.showModal({
        content: "请先登录",
        showCancel: false,
        success: function(res) {

          wx.navigateTo({
            url: '/pages/user/my',
          })
          // wx.switchTab({
          //   url: '/pages/user/my',
          //   success: function(e) {}
          // })
        }
      });
    }
  },

  loadUserInfo: function() {
    console.log("loadUserInfo 加载用户登录信息");
    if (this.globalData.userInfo == null || this.globalData.account == "" || this.globalData.account == "guest") {
      let st_globalData = wx.getStorageSync('globalData');
      if (st_globalData && st_globalData.userInfo && st_globalData.userInfo != null) {
        this.globalData = st_globalData;
        console.log("loadUserInfo 设置用户存储信息成功");
      } else {
        console.log("loadUserInfo 未获得用户登录信息");
      }
    } else {
      console.log("loadUserInfo 已经登录");
    }
  },


  get3rdSession: function() {
    let that = this
    wx.request({
      url: 'https://sports.ttyclub.com/servlet/WXLoginServlet',
      data: {
        code: that.globalData.code,
        iv: that.globalData.iv,
        encryptedData: this.globalData.encryptedData
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res) {
        console.log("get3rdSession errmsg:" + res.data.errmsg);
        if (typeof(res.data.errmsg) != "undefined") {
          wx.showModal({
            content: res.data.errmsg,
            showCancel: false,
            success: function(res) {}
          });
          return;
        }
        that.globalData.account = res.data.account;
        that.globalData.password = res.data.password;
        that.globalData.openid = res.data.openid;
        if (that.globalData.userInfo != null && that.globalData.userInfo.avatarUrl == "") {
          that.globalData.userInfo.avatarUrl = "/images/msn.png";
        }

        wx.setStorageSync('globalData', that.globalData);
        wx.showToast({
          title: '登录成功',
          icon: 'success',
          duration: 1000
        })

      }
    })
  },


  getWXDecryptData: function(encryptedData, iv) {

    let that = this

    console.log("that.globalData.code：" + that.globalData.code);
    var reqData = {
      "method": "getWXDecryptData",
      "parameters": {
        "account": that.globalData.account,
        "password": that.globalData.password,
        "encryptedData": encryptedData,
        "iv": iv,
      }
    }

    console.log("that.apiurl："+that.apiurl);
    wx.request({
      url: that.apiurl,
      data: reqData,
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function(res) {
        console.log(res.data);
        console.log("getWXDecryptData:" + res.data);
      }
    })
  },

})