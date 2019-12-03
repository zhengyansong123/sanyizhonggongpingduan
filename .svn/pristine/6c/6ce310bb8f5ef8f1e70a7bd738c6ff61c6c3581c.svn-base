const app = getApp();
const expire = 3; //广告过期时间
let advInterval = app.globalData.advInterval;
const wechat = require('../../utils/wechat.js')
const wxcache = require('../../utils/wxcache.js')
import regeneratorRuntime from '../../utils/regenerator-runtime/runtime'
let scene = "";
Page({
  data: {
    sec: expire,
    v: new Date(),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    //广告时间
    let sec = wx.getStorageSync("advExpire");
    if (sec) {
      this.setData({
        sec: sec + 1
      })
    }


    console.log("options......", options);
    let inviteCode = options.inviteCode;

    if (inviteCode) {
      app.globalData.inviteCode = inviteCode;
    }

    scene = decodeURIComponent(options.scene)
    if (options.scene && typeof(scene) != "undefined" && scene) {
      app.globalData.scene = scene;
    }

    let that = this;
    if (!advInterval) {
      advInterval = setInterval(function() {
        let sec = that.data.sec
        if (sec <= 1) {
          that.setData({
            sec: sec - 1
          })
          that.skipAdv('', 'first');
          return;
        }

        that.setData({
          sec: sec - 1
        })
      }, 1000)
    }

  },

  skipAdv: function(e, time) {
    clearInterval(advInterval)
    app.globalData.advInterval = null;
    advInterval = null; ;

    wx.switchTab({
      url: "/pages/tabBar/homePage/index",
    });
    // this.getEnterpriseInfo(e, time).then(res => {
    //   //广告结束后的方案：授权、充电、首页
    //   let toUrl = "/pages/tabBar/homePage/index"; //默认是首页

    //   if (res === 'homePage') {
    //     wx.switchTab({
    //       url: "/pages/tabBar/homePage/index", //首页
    //     });
    //     return;
    //   } else {
    //     if (res === 'charging') {
    //       toUrl = "/pages/homePage/pages/charging/charging"; //充电页
    //     } else if (res === 'authorize') {
    //       toUrl = "/pages/index2/authorize/authorize"; //授权页
    //     }
    //     wx.redirectTo({
    //       url: toUrl,
    //     })
    //   }

    // }).catch((error) => {
    //   // 去首页
    //   wx.switchTab({
    //     url: "/pages/tabBar/homePage/index",
    //   });
    //   return;
    // });

    return;
  },


  /**
   * 获取商家信息
   */
  getEnterpriseInfo: async function(scene, time) {
    // await app.onShow();
    await wechat.commonLogin();
    let that = this;
    let userInfo = wx.getStorageSync("userInfo")
    return new Promise((resolve, reject) => {
      let scene = app.globalData.scene;

      if (userInfo) {
        if (scene && scene.indexOf("ACTIVITY") == -1) {
          //如果是充电码，获取商家信息
          resolve("charging");
        } else {
          //移除商家设备信息
          wx.removeStorageSync("enterpriseInfo");
          resolve("homePage");
        }
      } else {
        if (time === 'first') {
          resolve("homePage");
        } else {
          //去授权
          resolve("authorize");
        }
      }
    });
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

  }
})