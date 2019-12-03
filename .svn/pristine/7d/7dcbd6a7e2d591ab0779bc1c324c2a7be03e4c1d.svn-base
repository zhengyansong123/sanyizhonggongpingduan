// pages/index/index.js
const app = getApp();
var mapCtx = null;
const util = require("../../../../utils/util.js")
let wechat = require("../../../../utils/wechat.js")
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "",
    markers: [],
    dataList: {},
    dataMap: null,
    longitude: 0,
    latitude: 0,
    modalFlag: true,
    showAlertMessage: true,
    paramUrl: new Date(),

    // tab切换
    currentTab: 0,
    //搜索
    hotSearch: "查看周边",
    showModal: false,
    polyline: [{
      points: [{
        longitude: 0,
        latitude: 0
      }],
      color: '#FF0000DD',
      width: 2,
      dottedLine: true
    }],
    deviceNoStatus: false // 设备编号状态
  },


  /**
   * 底部图标，还原定位
   */
  toCenter: function () {
    this.movetoCenter();
  },

  /**
   * 底部按钮，确定充电
   */
  toChargingGuide: function () {
    wx.navigateTo({
      url: '../../pages/charging/chargingGuide/chargingGuide'
    })
  },

  /**
   * 底部图标，充电
   */
  checkUser(){
    if (util.checkUser('../../../tabBar/userCenter/index')){
      this.toCharging()
    }
  },
  toCharging: function () {
    if (this.timer) {
      wx.navigateBack({
        delta: 1
      })
    } else {
      console.log('charging');
      //扫码充电
      wx.scanCode({
        success: (res) => {
          console.log(res,"AAAAAAAAAAAA 扫码充电 AAAAAAAAAAA")

          let content = "";
          if (res.result) {
            console.log(res.result, "BBBBBBBBBBBBBB 扫码充电 BBBBBBBBBBBB")
          }

          if (res.scanType !== "QR_CODE" && res.scanType !== 'WX_CODE') {
            if (res.result && res.result.indexOf("http://weixin.qq.com/r/zDgDG2LETT8yrSZ4923e") != -1) {
              content = "您扫描的是公众号二维码，请扫充电码";
            } else {
              content = "您扫描的不是充电码，请扫充电码";
            }
          } else {
            if (res.path && res.path.indexOf("ACTIVITY_") != -1) {
              content = "您扫描的是微信小游戏活动二维码，请扫充电码";
            }
          }

          if (content != '') {
            wx.showModal({
              title: '扫码错误',
              content: content,
            })
            return;
          }

          let deviceId = "";
          if (res.path) {
            deviceId = res.path.substring(res.path.indexOf("=") + 1);
          } else {
            deviceId = res.result;
          }
          if (deviceId) {
            app.globalData.deviceId = deviceId;
            // 拿到设备id,跳转充电页面
            util.scanCode(deviceId);
          } else {
            wx.showToast({
              title: '设备id不合法，请重试',
            })
          }
        }
      })
    }
  },

  /**
   * 底部图标，报修
   */
  toBreakdown: function () {
    wx.navigateTo({
      url: '../warn/index',
    })
  },


  //获取附近店铺信息
   setShopMarkers: async function(latitude, longitude) {
    var that = this;
    var params = {};
    params.latitude = latitude;
    params.longitude = longitude;
    params.current = 1;
    params.size = 50;
    params.customerType = 9
    app.makeSign(params);


     let res = await wechat.get("/customer/page", params)


     if (res.data.success) {
       var dataList = res.data.data;
          var markers = [];
          let dataMap = new Map();
          for (let item of dataList) {
            dataMap.set(item.id, item);
            let marker1 = that.createMarker(item);
            markers.push(marker1)
          }
          that.setData({
            dataMap: dataMap,
            markers: markers,
            dataList: dataList,
            showAlertMessage: true
        })
        } else {
          console.log("====== setShopMarkers  error =========")
        }
  },

  createMarker(point) {
    let marker = {
      iconPath: "../../image/markers.png",
      id: point.id || 0,
      userName: point.contacts || '',
      title: point.customerName || '',
      phone: point.phone || '',
      address: point.address || '',
       latitude: Number(point.latitude),
       longitude: Number(point.longitude),
      width: 30,
      height: 35
    };
    return marker;
  },


  //marker点击事件
  markertap(e) {
    for (let item of e.currentTarget.dataset.id) {
      if (e.markerId === item.id) {
        console.log(item, '商铺');
         this.setData({
           businessDetail: item
        });
      }
    }

    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
      showModalStatus: true
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()
      })
    }.bind(this), 200)
  },
  //隐藏对话框
  hideModal: function () {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "linear",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showModalStatus: false
      })
    }.bind(this), 200)
  },
  // 导航
  gotohere: function(e){
    const item = e.currentTarget.dataset.markers;
    console.log(item, 'item');
    let lat = ''; // 获取点击的markers经纬度
    let lon = ''; // 获取点击的markers经纬度
    let name = ''; // 获取点击的markers名称
    let address = ''; // 获取点击的markers地址
    let markerId = item.id;// 获取点击的markers  id
    let markers = item;// 获取markers列表

    lat = item.latitude;
    lon = item.longitude;
    name = item.title;
    address = item.address;
    wx.openLocation({ // 打开微信内置地图，实现导航功能（在内置地图里面打开地图软件）
      latitude: lat,
      longitude: lon,
      name: name,
      address: address,
      success: function (res) {
        console.log(res, 'ccc');
      },
      fail: function (res) {
        console.log(res, 'bb');
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   

    // let checkResult = util.checkUser();
    // if (!checkResult) {
    //   return;
    // }

    this.timer = options.timer;

    // 判断是否存在设备号
    if (app.globalData.deviceId && app.globalData.deviceId !== undefined) {
      this.setData({
        deviceNoStatus: true
      })
    } else {
      deviceNoStatus: false
    }
  },

  movetoCenter: function () {
    this.mapctx.moveToLocation();
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //PV/UV统计
    util.statistics('页面', '充电页')
    
    let that = this;
    console.log("app.globalData.longitude=" + app.globalData.longitude)

    // let checkResult = util.checkUser();
    // if (!checkResult) {
    //   return;
    // }

    this.mapctx = wx.createMapContext("map");
    this.movetoCenter();

    //显示店铺位置定时定时任务
    var count2 = 0;
    var shopLocationInvt = setInterval(function () {
      if (that.data.markers.length > 0 || count2 == 3) {
        clearInterval(shopLocationInvt);
        return;
      }
      if (app.globalData.latitude) {
        that.setShopMarkers(Number(app.globalData.latitude), Number(app.globalData.longitude));
        that.setData({
          showAlertMessage: false
        });
      }
      count2++;
    }, 2000) //循环时间 这里是1秒
  },
  /**
   * 视野发生变化时触发
   */
  bindregionchange: function (res) {
    // console.log(res, '视野变化');
    // if (res.type == "end") {
      // console.log(res, '动作结束');
      // // 获取屏幕中心的经纬度
      // mapCtx.getCenterLocation({
      //   success: function (res) {
      //    console.log("中心点经纬度", res);
      //     var latitude = res.latitude;
      //     var longitude = res.longitude;
      //     // 将经纬度转换成具体位置
      //     wx.request({
      //       url: 'http://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude + '&key=WOEBZ-PJM6I-UMHGY-5TB2Y-WAP47-3JBDJ',
      //       success: (res) => {
      //         console.log("具体位置", res);
      //         wx.showModal({
      //           title: '当前位置',
      //           content: res.data.result.address,
      //           showCancel: false
      //         })
      //       }
      //     })

      //   }
      // })
    // }

  },


  //搜索店铺
  onMenuClick: function (event) {
    wx.navigateTo({
      url: '../shopSelect/filter',
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let mapCtx = this.mapctx;
    setTimeout(() => {
      mapCtx.moveToLocation();
    }, 1000);
    setTimeout(() => {
      this.getAddress(mapCtx);
    }, 2000);
  },
  getAddress(mapCtx) {
    let that = this;
    wechat.getCenterLocation(mapCtx)
      .then(d => {
        console.log(d); //经纬度
        let {
          latitude,
          longitude
        } = d;
        console.log("当前位置纬度", latitude, "当前位置经度", longitude);
        app.globalData.longitude = longitude;
        app.globalData.latitude = latitude;
        that.setShopMarkers(latitude, longitude);
        that.setData({
          longitude: longitude,
          latitude: latitude
        });


        let url = `https://apis.map.qq.com/ws/geocoder/v1/`;
        let key = 'WOEBZ-PJM6I-UMHGY-5TB2Y-WAP47-3JBDJ';
        let params = {
          location: latitude + "," + longitude,
          key
        }
        return wechat.get(url, params);
      })
      .then(d => {
        console.log(d); //当前地址信息
        console.log("当前地址", d.data.result.address);
        //设置当前所在市
        app.globalData.currentCity = d.data.result.address_component.city;
      })
      .catch(e => {
        console.log(e);
      })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    return {
      title: '屏端无线速充小程序',
      imageUrl: 'https://api.znpoo.com/wxPicture/smallApp.jpg',
      query: "fromId=" + wx.getStorageSync("userInfo").wxUserId,
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));

      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },

})