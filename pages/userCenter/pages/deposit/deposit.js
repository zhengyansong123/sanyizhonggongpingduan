var app = getApp();
const util = require("../../../../utils/util.js")
const wechat = require('../../../../utils/wechat.js')
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime'

Page({
  data: {
    userInfo: {},
    payParams: {},
    currentMoney: 10,
    listHeight: 0,
    moneyArr: [],
    //记录上一次点击的充值选项的id
    // lastMoneyId: 0
  },
  onLoad: async function(options) {
    let that = this;
    // 生命周期函数--监听页面加载
    // util.checkUser();
    var params = {};
    app.makeSign(params);

    let res = await wechat.get('/wx/getDepositList', params)

    if (res.data.success) {
      that.setData({
        moneyArr: res.data.records,
        listHeight: res.data.listHeight,
        currentMoney: res.data.currentMoney
      })
    } else {
      // 关闭错误
      wx.showModal({
        title: '提示',
        content: '获取充值列表失败',
        showCancel: false
      })
      return;
    }

  },
  //充值协议
  chargeAgree: function() {
    console.log("点击充值协议")
    wx.navigateTo({
      url: '../recharged/recharged',
    })
  },
  //点击充值选项
  chioceAct: function(res) {
    var that = this
    console.log("点击充值选项")
    console.log(res.currentTarget.dataset)
    var id = res.currentTarget.dataset.currentid
    let moneyArr = that.data.moneyArr;
    let currentMoney = that.data.currentMoney;
    for (let i of moneyArr) {
      if (id == i.id) {
        i.color = "#fff";
        i.background = "#fe7503";
        currentMoney = i.id;
      } else {
        i.color = "#000";
        i.background = "#FFFFFF";
      }
    }

    that.setData({
      moneyArr: moneyArr,
      currentMoney: currentMoney
    })


  },
  gotoRecharged: async function() {
    var that = this;
    let userInfo = wx.getStorageSync("userInfo")
    var openId = userInfo.openId;
    var wxUserId = userInfo.wxUserId;
    if (this.data.currentMoney <= 0 || isNaN(this.data.currentMoney)) {
      wx.showModal({
        title: '充值失败',
        content: '请选择充值金额！',
      })
    } else {
      var params = {
        totalFee: this.data.currentMoney, // 充值金额
      };
      app.makeSign(params);

      let res = await wechat.post('/wx/unifiedOrder', params)
      console.log(res)
      if (res.data.success) {
        if (res.data.status == '100') {
          that.setData({
            payParams: res.data // 后端从微信得到的统一下单的参数
          })
          that.xcxPay(); // 拿到统一下单的参数后唤起微信支付页面
        } else {
          wx.showModal({
            title: '操作失败',
            content: res.data.msg,
            showCancel: false
          })
          return;
        }
      } else {
        wx.showModal({
          title: '操作失败',
          content: res.data.msg,
          showCancel: false
        })
        return;
      }


      // wx.request({
      //   url: app.globalData.url + '/wxApp/pay/order',
      //   method: "get",
      //   data: params,
      //   success: function (res) {
      //     var data = res.data.data;
      //     if(res.data.success){
      //       if (res.data.data.status == '100') {
      //         that.setData({
      //           payParams: res.data.data  // 后端从微信得到的统一下单的参数
      //         })
      //         that.xcxPay();  // 拿到统一下单的参数后唤起微信支付页面
      //       }else{
      //         wx.showModal({
      //           title: '操作失败',
      //           content: res.data.msg,
      //           showCancel: false
      //         })
      //         return;
      //       }
      //     }else{
      //       wx.showModal({
      //         title: '操作失败',
      //         content: res.data.msg,
      //         showCancel: false
      //       })
      //       return;
      //     }
      //   },fail: function (res){
      //     wx.showModal({
      //       title: '充值失败',
      //       content: '网络错误，请稍后再试！',
      //     })
      //   }
      // })

      wx.redirectTo({
        url: '../wallet/index',
      })
    }
  },

  xcxPay: function() {
    var that = this;
    console.log("返回参数");
    console.log(that.data.payParams);

    var tradeNo = that.data.payParams.out_trade_no;
    wx.requestPayment({
      'timeStamp': that.data.payParams.timestamp.toString(), // 时间戳必须是字符串，否则会报错
      'nonceStr': that.data.payParams.nonceStr,
      'package': that.data.payParams.package, // 这里的值必须是 prepay_id=XXXXXXXXX 的格式，否则也会报错
      'signType': 'MD5',
      'paySign': that.data.payParams.paySign,
      'success': function(res) {
        // 这里应该是 res.errMsg , 跟公众号的支付返回的参数不一样，公众号是 err_msg, 就因为没注意到这个，折腾了很长时间
        // console.log("that.data.payParams ==" + res);
        // console.log(res);

        var title = '支付成功';

        if (res.errMsg == "requestPayment:ok") { // 调用支付成功
          // url: '../paysuccess/paysuccess'
          // title = '';
        } else if (res.errMsg == 'requestPayment:cancel') {
          // 用户取消支付的操作
          title = '您已取消支付';
        }


        wx.showToast({
          title: title,
          icon: 'success',
          duration: 2000
        })

        // that.updateOrdert(tradeNo, status);
        wx.redirectTo({
          url: '../wallet/index',
          //  url: '../charge/index'   // 充值成功后的处理，可以跳转，也可以根据自己的需要做其他处理
        })
      },
      'fail': function(res) {
        // that.updateOrdert(tradeNo, '3');
        wx.showToast({
          title: '支付失败',
          icon: 'success',
          duration: 2000
        })
        return false;
      },
      'complete': function(res) {}
    })
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

  onShow: function() {
    //PV/UV统计
    util.statistics('页面', '充值')
  }
})