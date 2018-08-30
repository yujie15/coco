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
    content: ""
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



  questionSubmit: function () {

    this.setData({
      disabled: !this.data.disabled
    })
    let _this = this;

    if (_this.data.uploadimgs.length > 0) {
      util.upload(app.uploadurl, _this, this.submit);
    } else {
      this.submit();
    }


  },

  callContact: function (e) {  //拨打电话
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.phonenumber
    })
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


    if (that.data.content == '') {
      wx.showModal({
        content: "请填写问题",
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
      "method": "addInfoBack",
      "parameters": {
        "account": app.globalData.account,
        "password": app.globalData.password,
        "title": that.data.name,
        "telNo": that.data.phone,
        "msg": that.data.content,
        "photos": that.data.uploadurls.toString(),
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


})

