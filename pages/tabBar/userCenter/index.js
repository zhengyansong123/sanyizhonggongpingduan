// pages/wallet/index.js
const app = getApp();
const util = require("../../../utils/util.js")
const wechat = require('../../../utils/wechat.js')
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myChargeUrl:'/pages/userCenter/pages/myCharge/myCharge',
    myWalletUrl:'/pages/userCenter/pages/wallet/index',
    inviteJoinUrl: '/pages/userCenter/pages/myInvite/myInvite',
    helpCenterUrl: '/pages/userCenter/pages/helpCenter/helpCenter',
    aboutUsUrl: '/pages/userCenter/pages/aboutUs/aboutUs',
    chargingUrl: '../../../pages/homePage/pages/charging/charging',
    authorizeUrl: '../../../pages/index2/authorize/authorize',
    ticket: 0,
    money: 0,
    motto: 'welcome',
    userInfo: '',
    phoneNumber: '',
    mobileBtnShow: true,
    version: app.globalData.version
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var mobileBtnShow = true;
    let userInfo = wx.getStorageSync("userInfo")
    // 暂时营造未登录状态
    // userInfo = "";
    // wx.setStorageSync("userInfo", '')
    if (userInfo.mobile) {
      mobileBtnShow = false;
    }

    this.setData({
      userInfo: userInfo,
      phoneNumber: userInfo.mobile,
      mobileBtnShow: mobileBtnShow
    })
  },

  movetoCharge: function () {
    wx.navigateTo({
      url: '../charge/index',
    })
  },

  // 验证是否通过
  toCheckUser :function(e) {
    if (util.checkUser('index')) {
      wx.navigateTo({
        url: e.target.dataset.url,
      })
    }
  },
  // 授权
  toAuthorize: function (e) {
    if (util.checkUser('index')) {
      wx.navigateTo({
        url: e.target.dataset.url,
      })
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
    util.statistics('页面', '个人中心')
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



  getPhoneNumber: async function (e) {
    if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '未授权',
        success: function (res) {
          console.log('同意授权')
          console.log(res)
        }
      })
    } else {
      var iv = e.detail.iv;
      var encryptedData = e.detail.encryptedData;
      var params = {
        iv: iv,
        encryptedData: encryptedData,
      //   wxUserId: wx.getStorageSync("userInfo").wxUserId,
      }
      params.checkSign = app.makeSign(params);
      // 下面开始调用修改手机号接口
       let res = await wechat.get('/wx/getPhoneNumber',params)
       if (res.data.success) {
          this.setData({
             phoneNumber: res.data.mobile,
             mobileBtnShow: false,
          })

          //放入缓存
          let userInfo = wx.getStorageSync("userInfo")
          userInfo.mobile = res.data.mobile;
          wx.setStorageSync("userInfo", userInfo)
       } else {
          wx.showModal({
             title: '操作失败',
             content: res.data.msg,
             showCancel: false
          })
          return;
       }
    }
  },

  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    
    // wx.showToast({
    //   title: '开始转发',
    // })

    // app.onShareAppMessage();
  },
})