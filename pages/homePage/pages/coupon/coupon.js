// pages/index/coupon/coupon.js
const app = getApp();
const util = require("../../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowDate:new Date(),
    modalFlag: true,
    agentList: [{
      name: '2月'
    }, {
      name: '8月'
    }, {
      name: '10月'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    // util.checkUser();

    //生成邀请码
    let that = this;
    //生成邀请码
    let inviteCode = wx.getStorageSync("invite_code");

    if (!inviteCode) {
      let params = {};
      app.makeSign(params);
      
      wx.request({
        url: app.globalData.url + '/wxApp/getUserInviteCode',
        data: params,
        success: function(res) {
          if (res.data.success) {
            inviteCode = res.data.data;
            wx.setStorageSync("invite_code", inviteCode);
          } else {
            //请求inviteCode失败，暂不处理
            wx.showToast({
              title: '生成邀请码失败，请重试',
            })
          }
        }
      })
    }

  },

  /**
   * 活动说明
   */
  activityShow: function() {
    let modalFlag = this.data.modalFlag;
    this.setData({
      modalFlag: !modalFlag
    })
  },

  /**
   * 邀请好友
   */
  toShare: function() {
    this.onShareAppMessage();
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
    //用户领券
    // let params = {};
    // app.makeSign(params);

    // wx.request({
    //   url: app.globalData.url + '/wxApp/getShareCoupon',
    //   data: params
    // });


    let inviteCode = wx.getStorageSync("invite_code");
    console.log("inviteCode ===" + inviteCode)
    return {
      // desc: '邀好友，享充电',
      title: '邀好友，享充电',
      path: 'pages/index2/humor?inviteCode=' + inviteCode, // 路径，传递参数到指定页面。
      // imageUrl: 'https://api.znpoo.com/wxPicture/coupon_share.png'
    }
  },

})