// pages/index/city/city.js
// 导入数据，可以ajax获取
let City = require('../../../../utils/allcity.js');
let util = require('../../../../utils/util.js')
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime.js'

const app = getApp();
const wxcache = require('../../../../utils/wxcache.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: City,
    myCity:{key:'定位',name:'北京'}
  },

  binddetail(e) {
    console.log(e.detail)
    // app.globalData.selectCity = e.detail.name;
    wxcache.set("selectCity", e.detail.name)
    // 返回 例 :{name: "北京", key: "B", test: "testValue"}
    wx.navigateBack({
      delta:1
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    
    //获取定位
    // await util.getUserLocation();
    let locateCity = wxcache.get("locateCity") || ''; //当前定位的城市
    console.log(locateCity)
    let myCity = this.data.myCity;
    myCity.name=locateCity;
    this.setData({
      myCity
    })
    console.log("00000000000000000000000", locateCity)
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
    util.statistics('页面', '地址选择')

    // util.checkUser();
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

  }
})