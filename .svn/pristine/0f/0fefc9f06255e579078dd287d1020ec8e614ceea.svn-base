// pages/index/promition/promotion.js
const app = getApp();
const util = require('../../../../utils/util.js')
const wxcache= require('../../../../utils/wxcache.js')
const wechat = require('../../../../utils/wechat.js')
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    // areas: ['北京', '沈阳'],
    nowDate: new Date(),
    currentTab: 0,
    enterpriseTypeId: '',
    transactionMsg: '你还没有消费信息！',
    records: [
      // {
      //   id: "0",
      //   enterpriseImage: "https://api.znpoo.com/wxPicture/01.jpg",
      //   enterpriseName: "商家名称：唇辣号重庆老火锅（昌平店）",
      //   promotionDateStr: "活动期限：2018-10-17 至 2018-10-31",
      //   distance: "小于500m",
      // },
    ],
    enterpriseTypes: [
      // { enterpriseTypeId: '', name: '全部', class: 'active'},
      // { enterpriseTypeId: '123', name: '美食', class:''},
      // { enterpriseTypeId: '234', name: '生活服务', class: '' },
    ],
    listShow: true,
    windowHeight: "",
    windowWidth: "",
    current: 1,
    size: 15,
    hadLastPage: false,

    //图片swiper配置
    imageSwiperProp: {
      indicatorDots: true,

      vertical: false,
      autoplay: true,
      interval: 3000,
      duration: 1000,
    },

   //  filterdata: {
   //    "sort": [{
   //      "id": 0,
   //      "title": "默认排序"
   //    }, {
   //      "id": 1,
   //      "title": "离我最近"
   //    }],
   //  }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // util.checkUser();

    util.statistics('页面', '活动列表页（全部）')

  },


  /**
   * 类型切换
   */
  typeChange: function(e) {
    var that = this;
    let enterpriseTypeId = e.currentTarget.dataset.enterprisetypeid;
    let index = e.currentTarget.dataset.index;
    let name = e.currentTarget.dataset.name;


    //如果是点击标签切换页面

    if (this.data.currentTab === index) {
      return false;
    } else {
      //PV/UV统计
      util.statistics('页面', '活动列表页（' + name + '）')

      //修改tab颜色
      let enterpriseTypes = this.data.enterpriseTypes;
      for (let i of enterpriseTypes) {
        if (i.shopType == enterpriseTypeId) {
          i.class = 'active';
        } else {
          i.class = '';
        }
      }

      var transactionMsg = '这里还没有信息哦！';
      that.setData({
        enterpriseTypes: enterpriseTypes,
        currentTab: index,
        current: 1,
        records: [],
        hadLastPage: false,
        enterpriseTypeId: enterpriseTypeId
      });

      //到后台取数据
      this.loadList();
    }
  },


  /**
   * 跳转到详情页
   */
  toDetail: function(e) {
    let itemid = e.currentTarget.dataset.itemid;
    let dataList = this.data.records;
    let item = {};
    let images = null;
    console.log(dataList)
    for (let i of dataList) {
      if (i.id == itemid) {
        item.id = i.id;
        item.enterpriseName = i.customerName;
        item.promotionDateStr = i.promotionDateStr;
        item.addressContent = i.address;
        item.showDistance = i.showDistance;
        item.distance = i.distance;
        item.promotionDesc = i.promotionDesc;
        item.promotionNotice = i.promotionNotice;
        item.promotionName = i.promotionName;
        item.supportWeekend = i.supportWeekend;
      //   item.homePhone = i.homePhone; //拨打电话
        item.lat = i.lat;
        item.lng = i.lng;
        images = i.swapperImages;
        app.globalData.promotion_detail_swapperImages = i.swapperImages;
        break;
      }
    }

    wx.navigateTo({
      url: '../promotion/detail/detail?detail=' + JSON.stringify(item),
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    let lat = app.globalData.latitude;
    let lng = app.globalData.longitude;
    if (!lat || !lng) {
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {
          app.globalData.longitude = res.longitude;
          app.globalData.latitude = res.latitude;
          this.loadList();
        },
        fail: (err) => {
          this.loadList();
        }
      })
    } else {
      this.loadList();
    }
  },

  loadList: async function() {
    console.log(this.data, 'this.data')
    if (this.data.hadLastPage) {
      wx.showToast({
        title: '到底了',
      })
      return;
    }

    var that = this;
    let index = that.data.index;
    console.log(wxcache.get('queryCity'))
    var params = {
      selectCity: wxcache.get("queryCity"),
      current: that.data.current,
      size: that.data.size,
      lat: app.globalData.latitude,
      lng: app.globalData.longitude,
       promotionStatus:'展示'
    };

    if (that.data.enterpriseTypeId) {
      params.shopType = parseInt(that.data.enterpriseTypeId) + 1
    }

    params.checkSign = app.makeSign(params);

     let res = await wechat.get('/promotion/page', params)
     
     if (res.data.success) {
        var hadLastPage = false;
        var records = that.data.records;
        var current = that.data.current;
        var listShow = true;
        var transactionMsg = that.data.transactionMsg;
        var pic = that.data.pic
        if (res.data != 'error') {
           //如果是最后一页
           if (res.data.records.length <= that.data.size) {
              hadLastPage = true;
           } else {
              hadLastPage = false;
           }

           //渲染数据
           if (res.data.records.length > 0) {
              for (var i = 0; i < res.data.records.length; i++) {
                 records.push(res.data.records[i]);
              }
              // 特惠与详情页首张图片一致
             
              for (var j = 0; j < records.length; j++) {
                 records[j].pic = records[j].swapperImages[0].url
              }
           } else { //请求失败
              transactionMsg = '请求错误，请联系管理员！';
              listShow = false
           }

           //如果没有数据
           if (res.data.records.length <= 0) {
              transactionMsg = '这里还没有数据呀！';
              listShow = false;
              current = 0; //setData的时候会+1，所以这里设为0
           }

           //修改服务条目
           let enterpriseTypes = that.data.enterpriseTypes;
           if (that.data.enterpriseTypes.length == 0) {
              enterpriseTypes = res.data.shopTypes;
              that.setData({
                 enterpriseTypes: enterpriseTypes,
              });
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
              current: 1,
              records: [],
              current: 1,
              listShow: false,
              transactionMsg: '请求错误，请联系管理员！',
           });

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

        }

     }
  },

  /**
   * 地区切换
   */
  // bindAreaChange: function (e) {
  //   let that = this;
  //   let areas = that.data.areas;
  //   this.setData({
  //     index: e.detail.value
  //   })

  //   app.globalData.selectCity = areas[e.detail.value];

  //   util.statistics('页面', '活动列表页（全部）')

  //   //重新加载数据
  //   that.initData();

  //   //到后台取数据
  //   this.loadList();
  // },


  initData: function() {
    this.setData({
      currentTab: 0,
      current: 1,
      records: [],
      hadLastPage: false,
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {},

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
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})