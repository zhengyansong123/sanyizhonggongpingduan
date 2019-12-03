// pages/items/transactionDetails/index.js
const app = getApp();
const util = require("../../../../utils/util.js")
const wechat = require('../../../../utils/wechat.js')
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    transactionMsg: '你还没有消费信息！',
    records: [],
    listShow: true,
    windowHeight: "",
    windowWidth: "",
    current: 1,
    size: 10,
    hadLastPage: false,
  },

  onReady: function() {
    this.loadList();
  },

  loadList: async function () {
    if (this.data.hadLastPage) {
      wx.showToast({
        title: '到底了',
      })
      return;
    }

    var that = this;
    var params = {
      wxUserId: wx.getStorageSync("userInfo").wxUserId,
      current: that.data.current,
      size: that.data.size,
      userInfoFlag: false
    };
    params.checkSign = app.makeSign(params);
    let res = await wechat.get('/consume/page', params) //消费

    if (res.data.success) {
      var hadLastPage = false;
      var records = that.data.records;
      var current = that.data.current;
      var listShow = true;
      var transactionMsg = that.data.transactionMsg;
      if (res.data != 'error') {
        //如果是最后一页
        if (res.data.data.length < that.data.size) {
          hadLastPage = true;
        } else {
          hadLastPage = false;
        }

        //渲染数据
        if (res.data.data.length > 0) {
          for (var i = 0; i < res.data.data.length; i++) {
            records.push(res.data.data[i]);
          }
        }
      } else { //请求失败
        transactionMsg = '请求错误，请联系管理员！';
        listShow = false;
      }

      //如果没有数据
      if (records.length <= 0) {
        transactionMsg = '这里还没有数据呀！';
        listShow = false;
        current = 0; //setData的时候会+1，所以这里设为0
      }
      that.setData({
        hadLastPage: hadLastPage,
        records: records,
        current: current + 1,
        listShow: listShow,
        transactionMsg: transactionMsg,
      });

    } else {
      that.setData({
        hadLastPage: false,
        records: [],
        current: 1,
        listShow: false,
        transactionMsg: '请求错误，请联系管理员！',
      });

      let msg = res.data.msg;
      if (res.data.code == 'REDIS_TOKEN_NULL') {

      } else {

      }

      wx.showModal({
        title: '操作失败',
        content: res.data.msg,
        showCancel: false,
        // success:function(){
        //   if (res.data.code == 'REDIS_TOKEN_NULL') {
        //     app.login();
        //   }
        // }
      })
      return;
    }

  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.swichNav(this);
    //到后台取数据
    this.loadList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(e) {

    //PV/UV统计
    util.statistics('页面', '我的充电')


    wx.getSystemInfo({
      success: (res) => {
        console.log("我的充电-获取系统信息",res);
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
  onReachBottom: function() {
    this.loadList();
  },


  /**
   * 点击tab切换
   */
  swichNav: function(e) {
    // var that = this;

    // //如果是点击标签切换页面
    // if (e.target) {
    //   if (this.data.currentTab === e.target.dataset.current) {
    //     return false;
    //   } else {
    //     var transactionMsg = '你还没有消费信息哦！';
    //     if (this.data.currentTab == 2) {
    //       transactionMsg = '你还没有充值信息哦！';
    //     }
    //     that.setData({
    //       currentTab: e.target.dataset.current,
    //       records: [],
    //       hadLastPage: false,
    //       // current:1
    //     })
    //   }
    // }


    // //到后台取数据
    // this.loadList();
  },

  toHelpCenter: function() {
    wx.redirectTo({
      url: '../helpCenter/helpCenter'
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
})