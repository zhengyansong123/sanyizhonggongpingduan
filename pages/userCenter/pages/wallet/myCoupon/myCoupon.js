// pages/items/transactionDetails/index.js
const app = getApp();
const util = require("../../../../../utils/util.js")
const wechat = require('../../../../../utils/wechat.js')
import regeneratorRuntime from '../../../../../utils/regenerator-runtime/runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 1, //1未使用，2已激活
    transactionMsg: '你还没有消费信息！',
    records: [],
    listShow: true,
    windowHeight: "", 
    windowWidth: "",
    current: 1,
    size: 15,
    hadLastPage: false,
    showModal: false,
  },

  onReady: function () {
    this.loadList();
  },

  loadList:async function () {
    if (this.data.hadLastPage) {
      wx.showToast({
        title: '到底了',
      })
      return;
    }

    var that = this;
    
    //PV/UV统计
    if (that.data.currentTab == 1){
      util.statistics('页面', '优惠券_未使用')
    }else{
      util.statistics('页面', '优惠券_已激活')
    }
   

    
    var params = {
      status: that.data.currentTab == '1' ? 'NOT_ACTIVITE' : 'ACTIVITE', //1未使用，2已激活
      current: that.data.current,
      size: that.data.size,
    };
    params.checkSign = app.makeSign(params);
     let res = await wechat.get('/coupon/page',params)
     if (res.data.success) {
        var data = res.data.data;
        var hadLastPage = false;
        var records = that.data.records;
        var current = that.data.current;
        var listShow = true;
        var transactionMsg = that.data.transactionMsg;

        if (res.data != 'error') {
           //如果是最后一页
           if (data.length < that.data.size) {
              hadLastPage = true;
           } else {
              hadLastPage = false;
           }

           //渲染数据
           if (data.length > 0) {
              for (var i = 0; i < data.length; i++) {
                 records.push(data[i]);
              }
           }
        } else {//请求失败
           transactionMsg = '请求错误，请联系管理员！';
           listShow = false;
        }

        //如果没有数据
        if (records.length <= 0) {
           transactionMsg = '这里还没有数据呀！';
           listShow = false;
           current = 0;//setData的时候会+1，所以这里设为0
        }
        that.setData({
           hadLastPage: hadLastPage,
           records: records,
           current: current + 1,
           listShow: listShow,
           transactionMsg: transactionMsg,
        });
        console.log(records)
     } else {
        that.setData({
           hadLastPage: false,
           records: [],
           current: 1,
           listShow: false,
           transactionMsg: '请求错误，请联系管理员！',
        });

        wx.showToast({
           title: res.data.msg,
           icon: 'fail',
           duration: 2000,
           mask: true
        })
     }
  },
   //  wx.request({
   //    url: app.globalData.url + '/wxApp/getCouponList',
   //    data: params,
   //    success: function (res) {
   //     console.log(res)
      //   if (res.data.success) {
      //     var data = res.data.data;
      //     var hadLastPage = false;
      //     var records = that.data.records;
      //     var current = that.data.current;
      //     var listShow = true;
      //     var transactionMsg = that.data.transactionMsg;
          
      //     if (res.data != 'error') {
      //       //如果是最后一页
      //       if (data.length < that.data.size) {
      //         hadLastPage = true;
      //       } else {
      //         hadLastPage = false;
      //       }

      //       //渲染数据
      //       if (data.length > 0) {
      //         for (var i = 0; i < data.length; i++) {
      //           records.push(data[i]);
      //         }
      //       }
      //     } else {//请求失败
      //       transactionMsg = '请求错误，请联系管理员！';
      //       listShow = false;
      //     }

      //     //如果没有数据
      //     if (records.length <= 0) {
      //       transactionMsg = '这里还没有数据呀！';
      //       listShow = false;
      //       current = 0;//setData的时候会+1，所以这里设为0
      //     }
      //     that.setData({
      //       hadLastPage: hadLastPage,
      //       records: records,
      //       current: current + 1,
      //       listShow: listShow,
      //       transactionMsg: transactionMsg,
      //     });
      //   } else {
      //     that.setData({
      //       hadLastPage: false,
      //       records: [],
      //       current: 1,
      //       listShow: false,
      //       transactionMsg: '请求错误，请联系管理员！',
      //     });

      //     wx.showToast({
      //       title: res.data.msg,
      //       icon: 'fail',
      //       duration: 2000,
      //       mask: true
      //     })
      //   }
      // }
   //  })
//   },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // util.checkUser();
    this.swichNav(this);
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

/**
 * 立即激活
 */
  activeNow: async function(e){
    let couponId = e.currentTarget.dataset.couponid;
    let that = this;
    let currentTab = that.data.currentTab;
    if(currentTab == 1){//未使用
      let params = {
         status: 'ACTIVITE', //1未使用，
        id: couponId
      };
      params.checkSign = app.makeSign(params);
       let res = await wechat.post('/wx/activeCoupon',params)
       console.log(res)
       if (res.data.success) {
          wx.showModal({
             title: '提示',
             content: '激活成功',
             showCancel: false,
             success: function () {
                wx.redirectTo({
                   url: '../myCoupon/myCoupon',
                })
             }
          })
       } else {
          wx.showModal({
             title: '提示',
             content: '激活失败，请重试',
             showCancel: false,
             success: function () {
                //
             }
          })
       }

      // wx.request({
      //   url: app.globalData.url + '/wx/activeCoupon',
      //   data: params,
      //   success: function (res) {
         
      //   }
      // })
    }
  },

/**
 * 使用规则
 */
  rule:function(){
    this.setData({
      showModal: true
    })
  },

  /**
 * 关闭弹窗
 */
  closeActivity: function () {
    this.setData({
      showModal: false
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (e) {

    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    })
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
    var current = 1;
    var hadLastPage = false;
    var records = [];
    this.loadList();


    console.log("下拉刷新");
    // console.log(e)
    // var current = this.data.current - 1 <= 0 ? 1 : this.data.current - 1;
    // console.log(current)
    // this.setData({
    //   current: current
    // });
    // this.loading();
    // this.loadList();
    // 数据成功后，停止下拉刷新
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.loadList();
  },


  /**
 * 点击tab切换
 */
  swichNav: function (e) {
    var that = this;

    //如果是点击标签切换页面
    if (e.target) {
      console.log(e.target)
      if (this.data.currentTab === e.target.dataset.current) { //如果是未使用
        return false;
      } else {
       

        var transactionMsg = '你还没有优惠券哦！';
        if (this.data.currentTab == 2) {
          transactionMsg = '请先激活优惠券！';
        }
        that.setData({
          currentTab: e.target.dataset.current,
          records: [],
          hadLastPage: false,
          current: 1
        })
      }
    }

    

    //到后台取数据
    this.loadList();
  },

  toHelpCenter: function () {
    wx.redirectTo({
      url: '../helpCenter/helpCenter'
    })
  },


  /**
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    return {
      title: '屏端无线速充小程序',
      imageUrl: 'https://api.znpoo.com/wxPicture/smallApp.jpg',
      query: "fromId=" + wx.getStorageSync("userInfo").wxUserId,
      success: function (res) {
        // 转发成功 
        console.log("转发成功:" + JSON.stringify(res));

      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
      }
    }
  },
})
