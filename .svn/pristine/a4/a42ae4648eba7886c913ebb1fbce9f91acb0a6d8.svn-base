// pages/wallet/index.js
const app = getApp();
const util = require("../../../../utils/util.js")
const wechat = require('../../../../utils/wechat.js')
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
     ticket : 0,
     money : 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  movetoRecharge: function () {
     wx.redirectTo({
        url: '../deposit/deposit',
     })
  },

  movetoCharge: function () {
    wx.redirectTo({
      url: '../../../../pages/homePage/pages/charging/charging',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  //优惠券
  myCoupon: function () {
    wx.navigateTo({
      url: './myCoupon/myCoupon',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    //PV/UV统计
    util.statistics('页面', '我的钱包')

    var that = this;
    let userInfo = wx.getStorageSync("userInfo")
    var params = {
      openid: userInfo.openId,
      wxUserId: userInfo.wxUserId
    };
    params.checkSign = app.makeSign(params);
    let res = await wechat.get('/wxUser/page', params)
    console.log(res.data.data)
    if (res.data.success) {
      var balance = 0;
      if (res.data.data[0].balance) {
        balance = res.data.data[0].balance / 100;
      }

      that.setData({
        money: balance
      });
    } else {
      wx.showModal({
        title: '操作失败',
        content: res.data.msg,
        showCancel: false
      })
      return;
    }
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



  //交易明细
  transactionDetails: function () {
    wx.navigateTo({
      url: '/pages/userCenter/pages/wallet/transactionDetails/index',
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
