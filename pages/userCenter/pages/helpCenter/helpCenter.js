// pages/items/helpCenter/helpCenter.js

var app = getApp();
const util = require("../../../../utils/util.js")
const wechat = require('../../../../utils/wechat.js')
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
  records:[],
  listShow:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    // util.checkUser();
    var that = this;
   
    //到后台取数据
     let res = await wechat.get('/dict/type/help_center',{},'admin')
    
     if (res.data.success) {
        that.setData({
           records: res.data
        });
     } else {
        wx.showModal({
           title: '操作失败',
           content: res.msg,
           showCancel: false
        })
        return;
     }
 
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
    //PV/UV统计
    util.statistics('页面', '帮助中心')
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
