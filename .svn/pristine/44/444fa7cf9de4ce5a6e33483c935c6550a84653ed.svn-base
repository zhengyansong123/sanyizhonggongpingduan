const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let scene = decodeURIComponent(options.scene)
    if (options.scene && typeof (scene) != "undefined" && scene) {
      app.globalData.scene = scene;
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
  onShow: function(options) {
    console.log("AAAAAAAAAAAAAAA")
    console.log(options)

    let appendUrl = '';
    let flag = 0;
    if (options) {
      if (options.inviteCode) {
        appendUrl = '?inviteCode=' + options.inviteCode;
        flag = 1;
      }
      if (options.scene) {
        if (flag == 0) {
          appendUrl = '?scene=' + options.scene;
        } else {
          appendUrl = appendUrl + '&scene=' + options.scene;
        }
      }
    }


    wx.redirectTo({
      url: '../index2/humor' + appendUrl,
    })
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