// pages/homePage/pages/charging/chargingGuide/chargingGuide.js

let util = require('../../../../../utils/util.js')
let wechat = require('../../../../../utils/wechat.js')
import regeneratorRuntime from '../../../../../utils/regenerator-runtime/runtime.js'
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 去充电
   */
  toCharging: async function() {
    this.setData({
      flag: true
    })
    let deviceId = app.globalData.deviceId;
    console.log("aaaaaa=" + deviceId)
    let params = {};
    params.deviceId = deviceId;
    app.makeSign(params);

    let res = await wechat.post('/device/open', params, 'iot');

    //CHARGING_NOT_END   上次有未完成的充电
    //COUPON_NOT_ACTIVE  您有未使用的优惠券
    //BALANCE_LOW        余额不足
    let code = res.data.code; // 

    // wx.hideLoading();
    if (res.data.success) {
      // wx.showLoading({
      //   title: 'loading...',
      // });

      if (code && code === 'CHARGING_NOT_END'){
        //上次未完成的充电
        // wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false,
          success: function (resNotEnd) {
            // console.log(res)
            if (resNotEnd.confirm) {
              wx.redirectTo({
                url: '../../billing/index?time=' + res.data.time + '&deviceId=' + deviceId,
              })
            } else { //点击取消后跳回首页并清空设备号
              wx.switchTab({
                url: '../../../../tabBar/homePage/index',
              })
              app.globalData.deviceId = ''
            }

          },
          fail: function (error) {
            console.log(error)
          }
        })
      }else{
        let startChargingTimeKey = "START_CHARGING_TIME_" + deviceId;
        app.globalData.startChargingTimeKey = new Date().getTime();
        wx.redirectTo({
          url: '../../billing/index?code=' + res.data.code + '&deviceId=' + deviceId,
          success: () => {
            wx.showToast({
              title: '成功打开充电开关',
              duration: 1000
            })
          }
        })
      }
    } else {  //返回失败
      if (code && code === 'COUPON_NOT_ACTIVE') {
        //有未使用的优惠券
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: false,
          success: function (resNotUse) {
            // console.log(res)
            if (resNotUse.confirm) {
              wx.navigateTo({
                url: '../../../../userCenter/pages/wallet/myCoupon/myCoupon',
              })
            } else { //点击取消后跳回首页并清空设备号
              wx.switchTab({
                url: '../../../../tabBar/homePage/index',
              })
              app.globalData.deviceId = ''
            }

          },
          fail: function (error) {
            console.log(error)
          }
        })
        return;
      }else if (code && code === 'BALANCE_LOW') {
        // 余额不足
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: res.data.msg,
          showCancel: true,
          success: function (res) {
            // console.log(res)
            if (res.confirm) {
              wx.navigateTo({
                url: '../../../../userCenter/pages/deposit/deposit',
              })
            } else {
              wx.switchTab({
                url: '../../../../tabBar/homePage/index',
              })
              app.globalData.deviceId = ''
            }

          },
          fail: function (error) {
            console.log(error)
          }
        })
        return;
      }else{
        wx.showModal({
          title: '操作失败',
          content: res.data.msg,
          showCancel: false,
          // 下一步不成功时，跳转到首页并清除设备号
          success(res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../../../../tabBar/homePage/index',
              })
              app.globalData.deviceId = ''
              console.log(app.globalData.deviceId)
            }
          }
        })
        return;
      }
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
    // util.checkUser();
    util.statistics('页面', '充电说明', '')
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})