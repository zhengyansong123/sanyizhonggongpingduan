const app = getApp();
const util = require('../../../utils/util.js')
const wechat = require('../../../utils/wechat.js')
const wxcache = require('../../../utils/wxcache.js')
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime.js'
let clickCount = 0;
let preTime = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    btnDisabled: false,
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseOpenSetting: wx.canIUse('getSetting')

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    this.recordUserLoginInfo("onload", new Date());
    let canIUse = this.data.canIUse;
    if (!canIUse) {
      wx.showModal({
        title: '提示',
        content: '您的微信版本不支持按钮授权，请升级微信版本',
      })
    }
  },
  authClick: function() {
    let that = this;
    this.recordUserLoginInfo("authClick", new Date());
    if (preTime == 0) {
      clickCount = 1;
      preTime = new Date().getTime();
    } else {
      let now = new Date().getTime();
      let subTime = now - preTime;
      if (subTime < 5000) {
        clickCount = clickCount + 1;
        preTime = now;
      } else {
        clickCount = 1;
        preTime = 0;
      }
    }

    if (clickCount >= 3) {
      wx.showModal({
        title: '无法授权',
        content: '您的网络情况不好，请您稍后重试，或者删除小程序并重启微信后重试',
      })
    }
  },

  //取消授权
  noAuthorize: function() {
    wx.navigateBack({
      delta: 1
    })
  },

  //确认授权
  onGotUserInfo: function (e) {
    this.recordUserLoginInfo(e.detail.userInfo, new Date());
    let that = this;
    if (!e.detail.userInfo) {
      if (!this.data.canIUseOpenSetting) {
        wx.showModal({
          title: '提示',
          content: '您的微信版本不支持按钮授权，请升级微信版本',
        })
      }

      // 查看是否授权
      wx.getSetting({
        success: function (res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function(res) {
                console.log("222222222222222")
                that.register(res.userInfo);
              },
              fail: function(err) {
                console.log("111111111")
                console.log(err)
              }
            })
          } else {
            wx.switchTab({
              url: '../../tabBar/userCenter/index',
              success: function (res) {
                wx.showModal({
                  title: '授权提示',
                  content: '小程序需要您的微信授权才能使用充电功能哦~'
                })
              },
              fail: function (err) {
              }
            })
            console.log("66666")
            // that.openSetting();
          }
        },
        fail: function(err) {
          console.log("444444444")
          wx.showToast({
            title: '获取授权失败',
          })
        }
      })
    } else {
      that.register(e.detail.userInfo);
    }
  },


  register: async function(userInfo) {
    let that = this;
    let authLoading = wx.showLoading({
      title: '正在授权',
    })
    // 禁用重复提交
    this.setData({
      btnDisabled: true
    });

    console.log("userInfo===========" + userInfo + '===========')

    let params = userInfo


    let res = await wechat.post("/wx/register", params);

    if (res.data.success) {
      wxcache.remove("token") //如果有登录信息 则移除token 重新登录
      return wechat.commonLogin().then(data => {
        wx.hideLoading(authLoading);
        wx.switchTab({
          url: '/pages/tabBar/homePage/index',
        })
      })
    } else {
      wx.hideLoading(authLoading);
      util.showToast(res.data.msg)
      return;
    }
  },


  //跳转设置页面授权
  openSetting: function() {
    var that = this
    console.log("7777777777")
    if (wx.openSetting) {
      console.log("888888888")
      wx.openSetting({
        success: function(res) {
          console.log("9999999")
          console.log(res)

          that.recordUserLoginInfo("success", new Date());

          if (res.authSetting['scope.userInfo']) {
            console.log("aaaaaaaaaaaaaa")
            //尝试再次登录
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.getUserInfo({
              success: function(res) {
                that.register(res.userInfo);
              }
            })
          } else {
            wx.showModal({
              title: '授权失败',
              content: '您未开启授权，，请您稍后点击登录按钮重试',
            })
          }



        },
        fail: function(err) {
          console.log("======== openSetting error  =======")
          that.recordUserLoginInfo("err", new Date());

        }
      })
    } else {
      wx.showModal({
        title: '授权提示',
        content: '小程序需要您的微信授权才能正常使用哦~ 授权方法：我的->登录->点击授权按钮'
      })
    }
  },

  //获取用户登录信息
  recordUserLoginInfo: function(e, clickTime) {
    //获取用户登录信息
    wx.getSystemInfo({
      success: function(res) {
        res.e = e;
        res.clickTime = util.formatTime(clickTime);
        console.log("手机品牌=" + res.brand)
        console.log("手机型号=" + res.model)
        console.log("语言=" + res.language)
        console.log("微信版本号=" + res.version)
        console.log("操作系统版本=" + res.system)
        console.log("客户端平台=" + res.platform)
        console.log("客户端基础库版本=" + res.SDKVersion)
        console.log(res.e)

        let params = res;
        let url = '/wx/recordUserLoginInfo';
        wechat.get(url,params);
      }
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

  }
})