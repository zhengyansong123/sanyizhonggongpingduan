// pages/billing/index.js
const app = getApp();
const util = require("../../../../utils/util.js")
const wechat = require("../../../../utils/wechat.js")
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deviceId: '',
    hours: 0,
    minutes: 0,
    seconds: 0,
    actionText: "正在充电",
    clickBtn: false,
    animationData: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // util.checkUser();
    this.setData({
      deviceId: options.deviceId
    })

    //重新设置时间
    if (options.time) {
      let startChargingTimeKey = "START_CHARGING_TIME_" + options.deviceId;
      app.globalData.startChargingTimeKey = options.time;
    }

  },

  //设置定时器
  setInterval: function() {
    let h = this.data.hours;
    let m = this.data.minutes;
    let s = this.data.seconds;
    this.timer = setInterval(() => {

      this.setData({
        seconds: s++
      })

      if (h > 0) {
        this.endride();
      }
      if (s == 60) {
        s = 0;
        m++;
        setTimeout(() => {
          this.setData({
            minutes: m
          })
        }, 1000)
      }
      if (m == 30) {
        m = 0;
        h++;
        app.globalData.deviceId = '';
        setTimeout(() => {
          this.setData({
            minutes: m
          })
        }, 1000)
      }
    }, 1000)
  },
  // 结束充电
  endride:async function() {
    clearInterval(this.timer);
    this.timer = "";
    this.setData({
      actionText: "本次充电时间为",
      clickBtn: true
    });
    let userInfo = wx.getStorageSync("userInfo")
    var userId = userInfo.wxUserId;
    var params = {
      userId: userId,
      deviceId: this.data.deviceId,
    };
    app.makeSign(params);

    let res = await wechat.post('/device/lock',params,'iot');
    console.log(res)
    wx.hideLoading();
    if (res.data.success) {
      wx.switchTab({
        url: '/pages/tabBar/homePage/index',
      })
      app.globalData.deviceId = '';
    } else {
      // 关闭错误
      wx.showModal({
        title: '提示',
        content: '无法关闭设备，请重试',
        showCancel: false
      })
      return;
    }
  },
  // 返回首页
  returnIndex: function() {
    app.globalData.hasCharging = true;
    clearInterval(this.timer);
    if (this.timer == "") {
      wx.switchTab({
        url: '/pages/tabBar/homePage/index'
      })
    } else {
      wx.switchTab({
        url: '/pages/tabBar/homePage/index?timer=' + this.timer,
      })
    }
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
    let deviceId = app.globalData.deviceId;
    let startChargingTimeKey = "START_CHARGING_TIME_" + deviceId;
    let startChargingTime = app.globalData.startChargingTimeKey;

    if (startChargingTime) {
      let obj = util.getSubTime(startChargingTime);
      let day = obj.day;
      let hour = obj.hour;
      let minute = obj.minute;
      let second = obj.second;

      // console.log("HH=" + hour + "&MM=" + minute + "&SS=" + second)

      if (day > 0 || hour > 0) {
        wx.redirectTo({
          url: '/pages/tabBar/homePage/index',
        })
      }

      //修正误差
      second = second - 3;
      if (second < 0) {
        second = 0;
      }

      this.setData({
        hours: hour,
        minutes: minute,
        seconds: second
      })
    }

    this.setInterval();

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    clearInterval(this.timer);

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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: '屏端无线速充小程序',
      imageUrl: 'https://api.znpoo.com/wxPicture/smallApp.jpg',
      query: "fromId=" + wx.getStorageSync("userInfo").wxUserId,
      success: function(res) {
        // 转发成功 
        console.log("转发成功:" + JSON.stringify(res));

      },
      fail: function(res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },


})