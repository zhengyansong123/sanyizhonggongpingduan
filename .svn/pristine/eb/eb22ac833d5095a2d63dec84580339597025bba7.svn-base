// pages/tabBar/homePage/index.js
const wxcache = require('../../../utils/wxcache.js')
const util = require('../../../utils/util.js')

const app = getApp();
const wechat = require('../../../utils/wechat.js')
import regeneratorRuntime from '../../../utils/regenerator-runtime/runtime'

const baseUrl = '../../homePage/pages/';
Page({

   /**
    * 页面的初始数据
    */
   data: {
      //图片swiper配置
      imageSwiperProp: {
         indicatorDots: true,
         vertical: false,
         autoplay: true,
         interval: 3000,
         duration: 1000,
         circular: true
      },
      initData: {
         swapperImages: [],
         gridData: [],
         activityData: [],
         popupData: []
     },
     goodsData: [],
      queryCity: '北京',
      initUrls: {
         'charging': baseUrl + 'charging/charging',
         'invoice': baseUrl + 'shopSelect/filter?invoiceSwitch=1',
         'charging_deviceId': baseUrl + 'charging/chargingGuide/chargingGuide',
         'invoice_deviceId': baseUrl + 'invoice/invoice',
         'promotion': baseUrl + 'promotion/promotion',
         'join': baseUrl + 'welcomeJoin/welcomeJoin',
         'share': baseUrl + 'coupon/coupon'
      },
      flag: true,
      show: false
   },

   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: async function (options) {
      // util.checkUser();

      let that = this;

      //加载默认数据
      let queryCity = wxcache.get("queryCity");
      // 根据播放间隔判断是否显示弹窗
      if (wxcache.get('moreTime')) {
         this.setData({
            flag: false
         })
      }

      // 如果没有查询城市
      if (!queryCity) {
        queryCity = app.globalData.defaultCity;
      }

      this.setData({
         queryCity
      })


      //TODO  修改成同步
      this.loadDataList(queryCity);

      //定位
      //获取定位
      await util.getUserLocation();
      let locateCity = wxcache.get("locateCity"); //当前定位的城市


      //比较
      if (typeof (locateCity) != 'undefined' &&
         !(locateCity.indexOf(queryCity) != -1 ||
            queryCity.indexOf(locateCity) != -1)) { //如果定位城市与当前城市不相同
         wx.showModal({
            title: '切换城市',
            content: '当前城市与定位城市不同，是否切换',
            success: function (result) {
               if (result.confirm) {
                  that.setData({
                     queryCity: locateCity
                  })
                  that.loadDataList(locateCity);
               }
            }
         })
      }

      //如果是从转发来的，处理转发请求
      this.handleForwardInfo();

      //如果是扫描设备过来的
      var scene = app.globalData.scene;
      if (scene && scene != 'undefined') {
         app.globalData.scene = '';

         if (scene.indexOf("ACTIVITY") != -1) { //如果是活动 ACTIVITY
            let activityExpire = wx.getStorageSync(scene + "_EXPIRE")
            if (activityExpire) { //活动开启入口
               that.giveCoupon(scene);
            }
         } else {
            app.globalData.deviceId = scene;
         }
      }
   },

   /**
    * 七夕活动赠送一张优惠券
    */
   giveCoupon: function (scene) {
      let params = {
         scene: scene
      };
      app.makeSign(params);
      wx.request({
         url: app.globalData.url + '/wxApp/giveCoupon',
         data: params,
         success: function (res) {
            if (res.data.success) {
               wx.showModal({
                  title: '',
                  content: '立即激活优惠券',
                  success: function (confirmRes) {
                     if (confirmRes.confirm) {
                        wx.navigateTo({
                           url: '../wallet/myCoupon/myCoupon',
                        })
                     }
                  }
               })
            } else {
               // wx.showModal({
               //   title: '',
               //   content: res.data.msg.message,
               //   showCancel: false
               // })
            }
         },
         fail: function () {
            console.log('组织markers 数据失败');
         }
      });

      this.showPopup()
   },

   /**
    * 根据城市加载数据
    */
   loadDataList: async function (queryCity, flag) {
      console.log("===========================================", flag)
      if (!flag) {
         console.log("===========================================", "22222")
         wxcache.set("queryCity", queryCity);
         wxcache.set("selectCity", queryCity);
      }

      console.log("当前查询的城市数据=" + queryCity)
      var that = this;
      var params = {
         cityName: queryCity
      };
      app.makeSign(params);
      console.log(queryCity)
      let res = await wechat.get('/subject/getHomePageData',params)
      if (res.data.success) {
         
        let data1 = res.data.data1;  // 轮播
        let data2 = res.data.data2;  // 菜单
        let data3 = res.data.data3;  // 屏端招商
        let data4 = res.data.data4;
       
         let initData = that.data.initData;

         if (flag) {
            if (initData.swapperImages.length <= 0) {
               initData.swapperImages = data1;
            }
            if (initData.gridData.length <= 0) {
               initData.gridData = data2;
            }
            if (initData.activityData.length <= 0) {
               initData.activityData = data3;
            }
            if (initData.popupData.length <= 0) {
               if (data4.length != 0) {
                  data4[0].image = data4[0].image + '&v=' + new Date().getTime();
                  initData.popupData = data4;
               }
            }

         } else {

            if (data1.length > 0) {
               initData.swapperImages = data1;
            }else {
               initData.swapperImages = ''
            }
            if (data2.length > 0) {
               initData.gridData = data2;
            }else{
               initData.gridData = ''
            }
            if (data3.length > 0) {
               initData.activityData = data3;
            }else{
               initData.activityData = ''
            }
            if (data4 != undefined) {
               if (data4.length > 0) {
                  console.log(data4)
                  data4[0].image = data4[0].image + '&v=' + new Date().getTime();
                  initData.popupData = data4;
               }else{
                  initData.popupData = ''
               }
            }
         }


         that.setData({
            initData
         })

      }
    //   const obj = {
    //     current: 1,
    //     size: 6  
    //   }
    //  let goodsRes = await wechat.get('/goods/page', obj);
    //  if (goodsRes.data.success) {
    //    let goodsData = that.data.goodsData;
    //    goodsData = goodsRes.data.data;
    //    that.setData({
    //      goodsData
    //    })
    //    // 无商品时隐藏屏端商品模块
    //    let show = this.data.show;
    //    if (goodsData.length === 0) {
    //      show = false;
    //    } else {
    //      show = true;
    //    }
    //    this.setData({
    //      show
    //    })
    //  }
   },

   // 点击显示全部商品
  // showGoods: function() {
  //   wx.redirectTo({
  //     url: '/pages/homePage/pages/goods/goods',
  //   })
  // },
  // // 点击跳转外部链接
  // goOut: async function (e) {
  //   wx.navigateTo({
  //     url: '../../homePage/pages/webView/webView?webUrl=' + e.currentTarget.dataset.url,
  //     success: function () {
  //     },       //成功后的回调；
  //     fail: function () { },         //失败后的回调；
  //     complete: function () { }      //结束后的回调(成功，失败都会执行)
  //   })
  // },


   // 弹窗显示频率
   showPopup: function () {
      let that = this
      if (that.data.initData.popupData[0]) {
         var frequency = that.data.initData.popupData[0].frequency
         var beginDate = new Date(that.data.initData.popupData[0].beginDate)
         var endDate = new Date(that.data.initData.popupData[0].endDate)
      }

      // 播放次数
      let moreTime = wxcache.get('moreTime') || false; //一天播放多次
      let everyDay = wxcache.get('everyDay') || false; //一天只显示一次
      let once = wxcache.get('once') || false //只显示一次

      console.log('开始日期为====' + beginDate + '结束日期为======' + endDate)
      // 播放周期
      var nowTime = new Date()
      if (beginDate <= nowTime && endDate >= nowTime && endDate >= beginDate) { //开始日期在当前日期之前
         console.log("在播放时间之内 ")
         // 根据播放频率显示
         switch (frequency) {
            case 1: //每日播放一次
               if (everyDay) {
                  that.setData({
                     flag: false
                  })
               }
               break;
            case 2: //每日播放多次
               if (moreTime) {
                  that.setData({
                     flag: false
                  })
               }
               break;
            case 0: //只播放一次
               if (once) {
                  that.setData({
                     flag: false
                  })
               }
               break;
            default:
               ;
         }
      } else {
         console.log("超过结束时间")
         that.setData({
            flag: false
         })
      }
   },

   // 关闭弹窗
   closePoup: function () {
      var intervalTime = this.data.initData.popupData[0].intervalTime * 3600
      wxcache.set('moreTime', true, intervalTime)
      wxcache.set('everyDay', true, util.getSecrondsToTomorow)
      wxcache.set('once', true)
      this.setData({
         flag: false
      })
   },

   /**
    * 城市切换
    */
   bindCityChange: function () {
      wx.navigateTo({
         url: '../../homePage/pages/city/city',
      })
   },

   /**
    * 九宫格点击
    */
   handleClick: function (e) {
      let deviceId = app.globalData.deviceId;
      // deviceId = null;
      let data = e.currentTarget.dataset;
      let subjectType = data.subjecttype;
      let toUrl = data.tourl;
      let urlType = data.urltype;
      let tourl = data.tourl;
      let id = data.id;
      let isInvoice = app.globalData.isInvoice
      console.log(data)
      // 是否显示开票按钮
      if (tourl == 'invoice') {
         app.globalData.isInvoice = true;
      } else if (tourl == 'charging') {
         app.globalData.isInvoice = false;
      }

      //PV/UV统计
      switch (subjectType) {
         case '0':
            util.statistics('点击', '首页轮播_' + id);
            break;
         case '1':
            util.statistics('点击', '首页服务_' + id);
            break;
         case '2':
            util.statistics('点击', '首页专题_' + id);
            break;
         case '3':
            util.statistics('点击', '首页弹窗_' );
            break;
         default:
            ;
      }



      //如果没有配置链接，则直接返回
      console.log(subjectType, toUrl, urlType, id)

      if (!toUrl) {
         console.log("toUrl=====")
         return;
      }

      let initUrls = this.data.initUrls;

      let endUrl = ''; //最终的url

      if ('0' === urlType) { //web-view
         endUrl = "../../homePage/pages/webView/webView?webUrl=" + toUrl;
      } else {
         if (deviceId && deviceId.trim() != '') { //如果知道设备ID，则直接进入功能页
            if (app.globalData.hasCharging) { //是否直接跳转到充电页面
               endUrl = '/pages/homePage/pages/billing/index?deviceId=' + deviceId;
               app.globalData.hasCharging = false;
            } else {
               endUrl = initUrls[toUrl + '_deviceId'] || initUrls[toUrl] || toUrl
            }
         } else { //否则进入列表页
           console.log("进入列表页")
            endUrl = initUrls[toUrl] || toUrl;
         }
      }
      console.log(endUrl)
      wx.navigateTo({
         url: endUrl,
      })
      // 跳转到其他小程序
      // wx.navigateToMiniProgram({
      //   appId: 'wx93c4049e357632d7',
      //   success(res) {
      //     // 打开成功
      //     console.log('打开成功')
      //   },
      //   fail(res){
      //     console.log('打开失败')
      //   }
      // })

   },

   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady:  function () {
      // let that = this;
      //重新定位
      // setTimeout(async function() {
      // let notPromptChangeCity = wxcache.get("notPromptChangeCity"); //是否需要提示城市不一致，一天只提示一次
      // let noNeedLocate = wxcache.get("noNeedLocate") || false; //是否需要定位，每天定位一次
      // let locateCity = wxcache.get("locateCity") || ''; //当前定位的城市，一天过期一次

      //   if (!noNeedLocate) { //如果需要定位
      //     //获取定位
      //     await util.getUserLocation();
      //     let locateCity = wxcache.get("locateCity"); //当前定位的城市
      //     if (locateCity) {
      //       wxcache.set("noNeedLocate", true, util.getSecrondsToTomorow)

      //       //比较当前城市与定位城市是否一致
      //       let queryCity = that.data.queryCity;
      //       if (!(locateCity.indexOf(queryCity) != -1 || queryCity.indexOf(locateCity) != -1)) { //如果定位城市与查询城市不相同

      //         wx.showModal({
      //           title: '切换城市',
      //           content: '当前选择城市与设备所在城市不一致，是否切换',
      //           success: function(res) {
      //             if (res.confirm) {
      //               that.setData({
      //                 queryCity: locateCity
      //               })
      //               that.loadDataList(locateCity);
      //             }
      //           },
      //           complete: function() {
      //             wxcache.set("notPromptChangeCity", true, that.getSecrondsToTomorow);
      //           }
      //         })
      //         console.log("当前城市与查询城市不一致")
      //       }
      //     }
      //   }
      // }, 2000)


   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function () {
      let that = this;
      let queryCity = wxcache.get("queryCity");
      let selectCity = wxcache.get('selectCity');


      if (selectCity && (selectCity != queryCity)) {
         this.setData({
            queryCity: selectCity
         })
         console.log("111111111111111")
         this.loadDataList(selectCity);
      }

      //PV/UV统计
      util.statistics('页面', '首页')

      // 显示页面定时任务
      var count = 0;
      var timer = setInterval(function () {
         count++;
         let initData = that.data.initData;

         // 关闭定时器
         if (initData.activityData.length > 0 && initData.swapperImages.length > 0 &&
            initData.gridData.length > 0 || count == 3) {
            clearInterval(timer)
            return
         }

         if (initData.activityData.length <= 0 ||
            initData.swapperImages.length <= 0 ||
            initData.gridData.length <= 0) {
            let defaultCity = app.globalData.defaultCity;
            console.log("2222222222222====")
            that.loadDataList(defaultCity, true);
         }
      }, 3000)


   },
   /**
    * 处理转发请求
    */
   handleForwardInfo: function () {
      let that = this;
      let inviteCode = app.globalData.inviteCode;
      if (inviteCode) {
         //保存邀请信息
         that.saveInviteInfo(inviteCode);
      }
   },

   /**
    * 保存邀请信息
    */
   saveInviteInfo: function (inviteCode) {
      let params = {
         inviteCode: inviteCode
      };
      app.makeSign(params);
      wx.request({
         url: app.globalData.url + '/wxApp/saveInviteInfo',
         data: params,
         success: function (res) {
            if (res.data.success) {
               //回填为空，防止重复保存
               app.globalData.inviteCode = "";

            } else {
               //暂不处理
               // wx.showToast({
               //   title: '接受转发成功',
               // })
            }
         },
         fail: function () {
            console.log('保存邀请信息失败 数据失败');
         }
      });
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
      //下拉刷新
      if (this.data.initData.activityData.length <= 0 ||
         this.data.initData.swapperImages.length <= 0 ||
         this.data.initData.gridData.length <= 0) {
         // let defaultCity = app.globalData.defaultCity;
         // this.loadDataList(defaultCity, true);
         this.onLoad()
      }
      if (this.data.initData.activityData.length > 0 && this.data.initData.swapperImages.length > 0 &&
         this.data.initData.gridData.length > 0) {
         wx.stopPullDownRefresh()
      }
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