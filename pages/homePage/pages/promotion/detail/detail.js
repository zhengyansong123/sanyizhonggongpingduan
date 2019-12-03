// pages/index/promotion/detail/detail.js
const app = getApp();
const util = require('../../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */

  data: {
    initData: {
      // id: "1",
      // enterpriseName: "商家名称：水萝卜（昌平店）",
      // promotionDateStr: "活动期限：2018-11-17 至 2018-11-31",
      // distance: "<500m",
      // swapperImages: [
      //   {
      //     id: "0",
      //     url: "https://api.znpoo.com/wxPicture/03.jpg"
      //   }, {
      //     id: "1",
      //     url: "https://api.znpoo.com/wxPicture/04.jpg"
      //   }
      // ]
    },
    //图片swiper配置
    imageSwiperProp: {
      indicatorDots: true,

      vertical: false,
      autoplay: false,
      interval: 3000,
      duration: 1000,
    },
    imageArr: [],
    nowDate: new Date,

    promotionNotice:[]
  },


  previewImg: function (e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.imageArr;
    console.log(this.data.initData.swapperImages)
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let images = app.globalData.promotion_detail_swapperImages;
    if (options.detail) {
      let initData = JSON.parse(options.detail);
      initData.swapperImages = images;
      let imageArr = [];
      for (let i of images) {
        imageArr.push(i.url);
      }

      this.setData({
        initData: initData,
        imageArr: imageArr
      })
    }

    // 活动须知
    this.text()
  },


  toEnterpriseMap: function () {
    wx.openLocation({
      latitude: Number(this.data.initData.lat),
      longitude: Number(this.data.initData.lng),
      scale: 28,
      name: this.data.initData.enterpriseName,
      address: this.data.initData.addressContent
    })
  },

  makeCall: function () {
    console.log(this.data.initData)
    wx.makePhoneCall({
      phoneNumber: this.data.initData.homePhone,
      
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  // 截取活动须知
  text: function () {
    let promotionNotice = this.data.initData.promotionNotice
    let arr = ''
    arr = promotionNotice.split('\n')
    this.setData({
      promotionNotice : arr
    })
    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

    // util.checkUser();

    let initData = this.data.initData;
    util.statistics('页面', '详情（' + initData.enterpriseName + '_' + initData.id + '）')
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