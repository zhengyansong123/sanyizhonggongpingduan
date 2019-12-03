// pages/scanResult/index.js
var app = getApp();
const util = require("../../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    time: 3,
    deviceId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // util.checkUser();
    console.log(options);
    var that = this;
    this.setData({
      // password: options.password,
      deviceId: options.deviceId
    })

    // wx.showLoading({
    //   title: '数据加载中...',
    // })

    let time = 3;
    this.timer = setInterval(() => {
      this.setData({
        time: --time
      });
      if (time <= 0) {

        // wx.hideLoading()

        clearInterval(this.timer);
        console.log('deviceId: ' + that.data.deviceId);
        wx.redirectTo({
          url: '../billing/index?deviceId=' + that.data.deviceId,
        })
      }
    }, 1000)
  },

  backIndex: function() {
    clearInterval(this.timer);
    wx.redirectTo({
      url: '../index/index3',
    })
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