// pages/index/invoice/invoice.js
const app = getApp();
const util = require('../../../../utils/util.js')
const wechat = require('../../../../utils/wechat.js')
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    invoiceUrl: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function(options) {
    let show = wx.canIUse('web-view');
    if (!show) {
      wx.showModal({
        title: '打开失败',
        content: '您的微信版本不支持打开开票页面，请升级微信版本后重试',
      })
    } else {
      let that = this;
      let params = {};
      let enterpriseInfo = wx.getStorageSync("enterpriseInfo");
      //   if (null == enterpriseInfo || "" == enterpriseInfo){
      //       wx.navigateTo({
      //         url: '../shopSelect/filter?invoiceSwitch=1',
      //       })
      //       return;
      //   }
      let enterpriseId = null; //设备所在商家id
      if (enterpriseInfo && enterpriseInfo.enterpriseID) {
        // enterpriseId = enterpriseInfo.enterpriseID;
        params.shopId = enterpriseInfo.enterpriseID;
      }
      let invoiceEnterpriseId = enterpriseId;
      let customId = enterpriseInfo.customId;

      if (options.enterpriseID) { //如果是从商家列表页面跳转过来的
        invoiceEnterpriseId = options.enterpriseID;
        customId = options.customId;
      }

      if (!invoiceEnterpriseId) {
        // util.showToast("未获取到商家信息，请从商家列表选择开票服务")
          wx.redirectTo({
            url: '../shopSelect/filter?invoiceSwitch=1',
          })
          return;
      } else {
        // let params = {
          params.invoiceShopId=invoiceEnterpriseId,
          params.deviceId=app.globalData.deviceId,
          params.customId= customId
        // };

        let res = await wechat.get('/invoiceRecord/getInvoiceUrl',params);


        if (res.data.success) {
          that.setData({
            invoiceUrl: res.data.data.url
          })
        } else {
          wx.showModal({
            title: '开票错误',
            content: res.data.msg,
            success: function () {
              // wx.navigateBack({
              //   delta: 1
              // })
              wx.navigateBack({
                url: '../shopSelect/filter?invoiceSwitch=1',
              })
            }
          })
        }
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