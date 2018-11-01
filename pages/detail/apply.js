// apply.js
var app = getApp();
var util = require('../../utils/util.js');
var http_util = require('../../utils/http_util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    postid: "",
    grade: "",
    content: "",
    loadingHidden: true,
    userInfo: {},
    uploadimgs: [], //上传图片列表
    uploadurls: [], //上传图片URL列表
    disabled: false,
    editable: true,
  },



  applySubmit: function(e) {
    let formId = e.detail.formId;
    app.collectFormIds(formId); //处理保存推送码
    this.setData({
      disabled: !this.data.disabled
    })
    let _this = this;

    if (_this.data.uploadimgs.length > 0) {
      util.upload(app.uploadurl, _this, this.submit);
    } else {
      setTimeout(function() {
        _this.submit();
      }, 100)
    }
  },

  submit: function() {

    var that = this;
    // if (that.data.grade == '') {
    //   wx.showModal({
    //     content: "请填写报名人数",
    //     showCancel: false,
    //     success: function (res) {
    //     }
    //   });
    //   return;
    // };


    if (that.data.content == '') {
      wx.showModal({
        content: "请填写留言",
        showCancel: false,
        success: function(res) {}
      });

      that.setData({
        disabled: false
      })
      return;
    };


    that.setData({
      loadingHidden: false,
    });


    var url1 = app.apiurl;
    var reqData = {
      "method": "accountCommentPost",
      "parameters": {
        "account": app.globalData.account,
        "password": app.globalData.password,
        "id": that.data.postid,
        "grade": that.data.grade,
        "content": that.data.content,
        "uuid": 0,
        "photos": that.data.uploadurls.toString(),
      }
    };


    try {
      var test = {
        data: reqData,
        url: url1
      };
      http_util.httpPost(test).then(
        function(res) {
          that.setData({
            loadingHidden: true,
          });
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
            title: '留言成功',
            icon: 'success',
            duration: 1000
          })
          var pages = getCurrentPages();
          var prevPage = pages[pages.length - 2]; //上一个页面
          // prevPage.setData({
          //   applyList: [],
          //   hasMore: true,
          // })
          prevPage.onLoad();
          wx.navigateBack({
            delta: 1, // 回退前 delta(默认为1) 页面
          })


        },
        function(res) {
          that.setData({
            loadingHidden: true,
          });
          wx.showModal({
            content: '网络连接失败',
            showCancel: false,
            success: function(res) {}
          });
        }

      ).catch(function(err) {
        console.log(err);
      });

    } catch (error) {
      console.log(error.message);
    } finally {
      that.setData({
        disabled: false
      })
    }
  },

  bindGradeChange: function(e) {
    this.setData({
      grade: e.detail.value
    })
    console.log(this.data.grade);
  },

  bindContentChange: function(e) {
    this.setData({
      content: e.detail.value
    })
    console.log(this.data.content);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      postid: options.postid,
    })
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

  chooseImage: function() {
    let _this = this;

    if (_this.data.uploadimgs.length > 0) {
      return;
    }
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
    wx.chooseImage({
      count: 1,
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
    this.setData({
      editable: !this.data.editable
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
})