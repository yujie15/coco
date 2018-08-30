var app = getApp();
var bmap = require('../../utils/bmap-wx.min.js');
var util = require('../../utils/util.js');
var wxMarkerData = [];
// map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    query: '',
    height: 'auto',
    markers: [],
    latitude: '',
    longitude: '',
    location: '',
    address: '',     //地址  
    cityInfo: {},     //城市信息     
    inputShowed: false,
    array: [],//下拉提示选项
    selectArea: true,//显示下拉提示
    toastHidden: true, //吐司  
    toastText: '',//吐司文本 
    hasLocation: false,
    rgcData: {}

  },
  onToastChanged: function () {
    this.setData({ toastHidden: !this.data.toastHidden });
  },
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  onLoad: function (options) {
    var that = this;
    that.setData({
      query: options.query,
    });
    /* 获取定位地理位置 */
    // 新建bmap对象   

    //调用wx.getSystemInfo接口，然后动态绑定组件高度
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          height: res.windowHeight
        })
      }
    })
    //that.getLocation();
    //that.regeocoding();
    that.query();
  },
  //视野发生变化时触发
  bindtap(e) {

  },
  makertap: function (e) {
    var that = this;
    var id = e.markerId;
    console.log("makertap:" + id);
    that.showSearchInfo(wxMarkerData, id);
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2];  //上一个页面
    prevPage.setData({
      latitude: that.data.latitude,
      longitude: that.data.longitude,
      address: that.data.address,
    })

  },
  //视野发生变化时触发
  regionchange(e) {
    console.log(e.type)
  },
  //点击控件时触发
  controltap(e) {
    console.log(e.controlId)
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


  //查询输入框回车
  confirmQueryInput: function (e) {
    this.setData({
      markers: [],
      query: e.detail.value,
      selectArea: true,
      location: '',
    });
    this.query();
  },

  //点击联想词
  clickSelect: function (e) {
    var that = this;
    that.setData({
      markers: [],
      query: e.currentTarget.dataset.name,
      selectArea: true,
      location: e.currentTarget.dataset.latitude + "," + e.currentTarget.dataset.longitude,
    });
    that.query();
  },
  /**
   * 监码输入
   */
  listenerQueryInput: function (e) {

    var that = this;
    that.setData({
      location: '',
      query: e.detail.value,
    });

    if (e.detail.value == '') {
      return;
    }

    // 新建百度地图对象 
    var BMap = new bmap.BMapWX({
      ak: app.ak
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      var arr = new Array();
      for (var i = 0; i < data.result.length; i++) {
        if (data.result[i].uid != '') {
          arr.push(data.result[i]);
        }
      }
      if (arr.length > 0) {
        that.setData({
          selectArea: false,
          array: arr,
        });
      }
    }
    // 发起suggestion检索请求 
    BMap.suggestion({
      query: that.data.query,
      region: '北京',
      city_limit: true,
      fail: fail,
      success: success
    });
  },

  /**
   * 查询关键字
   */
  query: function () {
    var that = this;
    var search_fail = function (data) {
      console.log(data);
    };
    var search_success = function (data) {
      //使用wxMarkerData获取数据  
      if (data.wxMarkerData.length > 0) {
        wxMarkerData = data.wxMarkerData;
        console.log("wxMarkerData：" + wxMarkerData);
        console.log(wxMarkerData);

        that.setData({
          markers: wxMarkerData,
          latitude: wxMarkerData[0].latitude,
          longitude: wxMarkerData[0].longitude,
          address: wxMarkerData[0].address,
        });
      } else {
        that.setData({
          markers: [],
          location: '',
          toastHidden: false, //吐司  
          toastText: '未找到',//吐司文本  
        })
      }
    }

    var BMap = new bmap.BMapWX({
      ak: app.ak
    });
    // 发起POI检索请求 
    BMap.search({
      query: that.data.query,
      tag: "休闲娱乐,美食,购物,房地产",
      location: that.data.location,
      fail: search_fail,
      success: search_success,
      // 此处需要在相应路径放置图片文件 
      iconPath: '../../images/marker_red.png',
      // 此处需要在相应路径放置图片文件 
      iconTapPath: '../../images/marker_red.png'
    });

  },


  changeMarkerColor: function (data, i) {
    if (data.length < 2) {
      return;
    }
    var that = this;
    var markers = [];
    for (var j = 0; j < data.length; j++) {
      if (j == i) {
        // 此处需要在相应路径放置图片文件 
        data[j].iconPath = "../../images/marker_yellow.png";
      } else {
        // 此处需要在相应路径放置图片文件 
        data[j].iconPath = "../../images/marker_red.png";
      }
      markers.push(data[j]);
    }
    that.setData({
      markers: markers
    });
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

              console.log("ops.data.result.formatted_address:" + ops.data.result.formatted_address);
              console.log("res.longitude:" + res.longitude);
              console.log("res.latitude:" + res.latitude);
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
  regeocoding: function () {
    var that = this;
    var BMap = new bmap.BMapWX({
      ak: app.ak
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      wxMarkerData = data.wxMarkerData;
      that.setData({
        markers: wxMarkerData
      });
      that.setData({
        latitude: wxMarkerData[0].latitude
      });
      that.setData({
        longitude: wxMarkerData[0].longitude
      });
    }
    BMap.regeocoding({
      fail: fail,
      success: success,
      iconPath: '../../images/marker_red.png',
      iconTapPath: '../../images/marker_red.png'
    });
  },
  showSearchInfo: function (data, i) {
    var that = this;
    console.log("showSearchInfo:");
    console.log(data);
    that.setData({
      rgcData: {
        title: '名称：' + data[i].title + '\n',
        address: '地址：' + data[i].address + '\n',
        desc: '描述：' + data[i].desc + '\n',
        business: '商圈：' + data[i].business
      },
      latitude: data[i].latitude,
      longitude: data[i].longitude,
      address: data[i].address,
    });
  }
})