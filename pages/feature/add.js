var app = getApp()
var util = require('../../utils/util.js');
var http_util = require('../../utils/http_util.js');
// question.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    uploadimgs: [], //上传图片列表
    uploadurls: [], //上传图片URL列表
    disabled: false,
    editable: true,
    phone: "",
    name: "",
    content: "",
    hasLocation: false,
    location: {},
    latitude: '',
    longitude: '',
    address: "",
    groupid: 0,
    loadingHidden: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    if (options && options.groupid) {
      that.setData({
        groupid: options.groupid,
      })
    }


    //that.getLocation();
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


  getLocation: function () {
    let _this = this;
    var that = wx.getLocation(
      {
        success: function (res) {
          console.log(res)
          wx.request({
            url: 'https://api.map.baidu.com/geocoder/v2/?ak=' + app.ak + '&location=' + res.latitude + ',' + res.longitude + '&output=json&pois=1', data: {},
            header: { 'Content-Type': 'application/json' },
            success: function (ops) {
              _this.setData({
                address: ops.data.result.formatted_address,
                hasLocation: true,
                location: util.formatLocation(res.longitude, res.latitude),//这里是获取经纬度
                longitude: res.longitude,
                latitude: res.latitude,
              })
            }
          })
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
  questionSubmit: function (e) {

    var that = this;
    let formId = e.detail.formId;
    that.dealFormIds(formId); //处理保存推送码

    that.setData({
      disabled: !that.data.disabled
    })

    if (that.data.uploadimgs.length > 0) {
      util.upload(app.uploadurl, that, that.submit);
    } else {
      that.submit();
    }

  },



  chooseImage: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
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
  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        _this.setData({
          uploadimgs: _this.data.uploadimgs.concat(res.tempFilePaths)
        })
      }
    })
  },
  editImage: function () {
    this.setData({
      editable: !this.data.editable
    })
  },
  deleteImg: function (e) {
    let _this = this;
    var arr = _this.data.uploadimgs;
    var index = e.currentTarget.dataset.index;
    _this.setData({
      uploadimgs: arr.slice(0, index).concat(arr.slice(index + 1, arr.length))
    })
  },
  bindContentChange: function (e) {
    this.setData({
      content: e.detail.value
    })
    console.log(this.data.content);
  },

  inputName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },

  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },


  submit: function (event) {

    var that = this;


    if (that.data.uploadurls.toString() == '' && that.data.content == '') {
      wx.showModal({
        content: "请填写内容",
        showCancel: false,
        success: function (res) {
        }
      });
      that.setData({
        disabled: !that.data.disabled
      })
      return;
    };


    that.setData({
      loadingHidden: false,
    });

    var url1 = app.apiurl;
    var reqData = {
      "method": "accountCreatePosition",
      "parameters": {
        "account": app.globalData.account,
        "password": app.globalData.password,
        "teamView": 111,
        "title": that.data.address,
        "content": that.data.content,
        "url": that.data.uploadurls.toString(),
        "uuid": 0,
        "groupId": that.data.groupid,
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
              }
            });
            that.setData({
              disabled: !that.data.disabled
            })
            return;
          }

          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 1000,
            success: function () {

              var pages = getCurrentPages();
              var prevPage = pages[pages.length - 2];  //上一个页面
              prevPage.onLoad();
              wx.navigateBack({
                delta: 1, // 回退前 delta(默认为1) 页面
              })
            }, //接口调用成功的回调函数  
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

  bindTapMap: function () {
    wx.navigateTo({
      url: '../map/map'
    })
  },
})

