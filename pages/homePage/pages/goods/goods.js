// pages/homePage/pages/goods/goods.js
const wxcache = require('../../../../utils/wxcache.js')
// const util = require('../../../../utils/util.js')

const app = getApp();
const wechat = require('../../../../utils/wechat.js')
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime'

const baseUrl = '../../../homePage/pages/';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsData: [],
    data:{
      current: 1,
      size: 12
    },
    show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();

  },
  // 加载商品列表
  getList: async function () {
    const obj = this.data.data;
    let goodsRes = await wechat.get('/goods/page', obj);
    if (goodsRes.data.success) {
      let goodsData = this.data.goodsData;
      goodsData = goodsRes.data.records;
      this.setData({
        goodsData
      })
      // 无更多数据是隐藏获取按钮
      let show = this.data.show;
      let size = this.data.data.size;
      if (goodsRes.data.total > size) {
        show = true;
      } else{
        show = false;
      }
      this.setData({
        show
      })
    }
  },
  // 加载更多
  showMore: async function () {
    this.data.data.current += 1;
    const obj = this.data.data;
    let goodsRes = await wechat.get('/goods/page', obj);
    if (goodsRes.data.success) {
      let data = goodsRes.data.records;
      let goodsData = this.data.goodsData.concat(data);
      this.setData({
        goodsData
      });
      let show = this.data.show;
      if (goodsRes.data.total > goodsData.length) {
        show = true;
      } else {
        show = false;
      }
      this.setData({
        show
      })
    }
  },
  // 点击跳转外部链接
  goOut: async function (e) {
    wx.navigateTo({
      url: '../webView/webView?webUrl=' + e.currentTarget.dataset.url, 
      success: function () {
      },       //成功后的回调；
      fail: function () { },         //失败后的回调；
      complete: function () { }      //结束后的回调(成功，失败都会执行)
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})