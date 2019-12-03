
//获取应用实例
var WxSearch = require('../../../../component/wxSearch/wxSearch.js')
var app = getApp();
const util = require("../../../../utils/util.js")
const wechat = require('../../../../utils/wechat.js')
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime'
Page({
  data: {
    searchValue: "",
    centent_Show: true,
    dataList: {},//店铺信息列表
    originalHeadShopName: "商家",
    originalHeadAreaName: "区域",
    originalHeadSortName: "排序",
    headShopName: "商家",
    searchShop1: "",
    searchShop1Id:"",
    searchShop2: "",
    headAreaName: "区域",
    headArea1: "",//省
    headArea2: "",//市
    headArea3: "",//区
    headSortName: "排序",
    filterdata: {},  //筛选条件数据
    showfilter: false, //是否显示下拉筛选
    showfilterindex: null, //显示哪个筛选类目
    cateindex: 0,  //一级分类索引
    cateid: null,  //一级分类id
    subcateindex: 0, //二级分类索引
    subcateid: null, //二级分类id
    areaindex: 0,  //一级城市索引
    areaid: null,  //一级城市id
    subareaindex: 0,  //二级城市索引
    subareaid: null, //二级城市id
    sortindex: 0,//一级排序索引
    sortid: null,//一级排序id
    // dataList: [], //服务集市列表
    scrolltop: null, //滚动位置
    page: 0,  //分页
    transactionMsg: '你还没有消费信息！',
    records: [],
    listShow: true,
    current: 1,
    size: 15,
    hadLastPage: false,
    select1: '',
    select2: '',
    select3: '',

    qyopen: false,
    qyshow: false,
    area:null,
    cityleft: [],
    citycenter: [],
    cityright: [],
    searchArea1: '',
    searchArea2: '',
    searchArea3: '',
    searchSort: '',
    invoiceSwitch:'',
    isInvoice: false //是否显示开票按钮
  },
  onLoad: function (options) { //加载数据渲染页面
    // util.checkUser();
    var that = this

    let invoiceSwitch = '';
    if (options.invoiceSwitch){
      wx.setNavigationBarTitle({
        title: '智能开票'
      })
      invoiceSwitch = options.invoiceSwitch;
    }

    that.setData({
      cityleft: app.changeAreaToObj("86"),
      invoiceSwitch: invoiceSwitch
    });

    this.fetchFilterData();
    this.fetchShopData();

    
    //初始化的时候渲染wxSearchdata
    WxSearch.init(that, 43, ['咖啡厅', '火锅', '会所']);
    WxSearch.initMindKeys(['咖啡厅', '火锅', '会所']);


    //是否显示开票按钮
    if (app.globalData.isInvoice == true){
      this.setData({
        isInvoice: true
      })
    }
  },

  //根据名称搜索店铺
  searchValueInput: function (e) {
    var value = e.detail.value;
    if (!value && this.data.productData.length == 0) {
      this.setData({
        centent_Show: false,
      });
    }
  },

  selectleft: function (e) {
    var originalHeadAreaName = this.data.originalHeadAreaName;
    var tempAreaName = this.data.searchArea1;
    var tempAreaName2 = this.data.searchArea2;
    var tempValue = e.target.dataset.value;

    var cityCenter = app.changeAreaToObj(e.currentTarget.dataset.province);
    
    if (tempValue == tempAreaName && tempAreaName2=='') {
      tempValue = "";
      tempAreaName = originalHeadAreaName;
      cityCenter = [];
    }else{
      tempAreaName = tempValue;
    }


    this.setData({
      cityright: {},
      citycenter: cityCenter,
      searchArea1: tempValue,
      searchArea2: '',
      searchArea3: '',
      headAreaName: tempAreaName,
    });
    this.wxSearchFn();
  },


  selectcenter: function (e) {
    var originalHeadAreaName = this.data.searchArea1;
    var tempAreaName = this.data.searchArea2;
    var tempValue = e.target.dataset.value;
    var cityRight = app.changeAreaToObj(e.currentTarget.dataset.city);

    if (tempValue == tempAreaName) {
      tempValue = "";
      tempAreaName = originalHeadAreaName;
      cityRight = [];
    } else {
      tempAreaName = tempValue;
    }
    


    this.setData({
      cityright: cityRight,
      searchArea2: tempValue,
      searchArea3: '',
      headAreaName: tempAreaName,
    });
    this.wxSearchFn();
  },

  selectright: function (e) {
    var originalHeadAreaName = this.data.searchArea2;
    var tempAreaName = this.data.searchArea3;
    var tempValue = e.target.dataset.value;

    if (tempValue == tempAreaName) {
      tempValue = "";
      tempAreaName = originalHeadAreaName;
    } else {
      tempAreaName = tempValue;
    }
    this.setData({
      searchArea3: tempValue,
      headAreaName: tempAreaName,
    });
    this.wxSearchFn();
  },

  fetchShopData:async function () {  //获取附近店铺信息
    //查询参数
    var latitude = app.globalData.latitude;
    var longitude = app.globalData.longitude;

    var that = this;
    var thisData = this.data;
    var params = {};
   //  params.latitude = latitude;
   //  params.longitude = longitude;
    params.current = that.data.current;
    params.size = that.data.size;
    params.provinceName = thisData.searchArea1 == "全部" ? "" : thisData.searchArea1;
    params.cityName = thisData.searchArea2 == "全部" ? "" : thisData.searchArea2;
    params.searchArea3 = thisData.searchArea3 == "全部" ? "" : thisData.searchArea3;
     params.shopType = thisData.searchShop1 == "全部" ? "" : thisData.searchShop1Id;
   //  params.searchShop1 = thisData.searchShop1 == "全部" ? "" : thisData.searchShop1Id;
   //  params.searchShop2 = thisData.searchShop2 == "全部" ? "" : thisData.searchShop2;
    params.searchSort = thisData.searchSort;
   // 
     params.customerType = 9
      if(thisData.invoiceSwitch != ''){
         params.invoiceSwitch = thisData.invoiceSwitch;
      }
    if (thisData.wxSearchData && thisData.wxSearchData.value) {
      params.searchValue = thisData.wxSearchData.value;
    } else {
      params.searchValue = "";
    }

    if(params.shopId){
    }
    if (!params.shopType) {
      delete params.shopType
    }


    var checkSign = app.makeSign(params);
    params.checkSign = checkSign;
     let res = await wechat.get('/customer/page',params)

      if (res.data.success) {
         var data = res.data.data;
         var hadLastPage = false;
         var records = that.data.records;
         var current = that.data.current;
         var listShow = true;
         var transactionMsg = that.data.transactionMsg;
         if (res.data != 'error') {
            var centent_Show = true;
            //如果是最后一页
            if (data.length < that.data.size) {
               hadLastPage = true;
            } else {
               hadLastPage = false;
            }

            //渲染数据

            if (data.length > 0) {
               for (var i = 0; i < data.length; i++) {
                  var distance = data[i].distance;
                  // if (distance < 1) {
                    //  distance = (distance * 1000).toFixed(2) + "米";
                  // } else {
                    //  distance = distance.toFixed(2) + "公里";
                  // }
                 distance = (distance * 500) + "米";
                  if (data[i].shopImage == null || data[i].shopImage.trim() == "") {
                     data[i].shopImage = "https://api.znpoo.com/wxPicture/zhaoshang.jpg";
                  }
                  data[i].distance = distance;
                  records.push(data[i]);
               }
            } else {
               if (records.length <= 0) {
                  listShow = false;
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
   //    url: app.globalData.url + '/wxApp/map/shopLocation',
   //    data: params,
   //    success: function (res) {
      //   if (res.data.success) {
      //     var data = res.data.data;
      //     var hadLastPage = false;
      //     var records = that.data.records;
      //     var current = that.data.current;
      //     var listShow = true;
      //     var transactionMsg = that.data.transactionMsg;
      //     if (res.data != 'error') {
      //       var centent_Show = true;
      //       //如果是最后一页
      //       if (data.length < that.data.size) {
      //         hadLastPage = true;
      //       } else {
      //         hadLastPage = false;
      //       }

      //       //渲染数据
     
      //       if (data.length > 0) {
      //         for (var i = 0; i < data.length; i++) {
      //           var distance = data[i].distance;
      //           if (distance < 1) {
      //             distance = (distance * 1000).toFixed(2) + "米";
      //           } else {
      //             distance = distance.toFixed(2) + "公里";
      //           }

      //           if (data[i].image == null || data[i].image.trim() == "") {
      //             data[i].image = "https://api.znpoo.com/wxPicture/zhaoshang.jpg";
      //           }
      //           data[i].distance = distance;
      //           records.push(data[i]);
      //         }
      //       } else {
      //         if (records.length <= 0){
      //           listShow = false;
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
      // },
   //    fail: function () {
   //      console.log('获取店铺数据失败');
   //    }
   //  });


  toDetail: function (e) {
    wx.openLocation({
      latitude: Number(e.currentTarget.dataset.latitude),
      longitude: Number(e.currentTarget.dataset.longitude),
    })
    console.log('++=++', e.currentTarget.dataset.latitude)
  },
  setFilterPanel: function (e) { //展开筛选面板
  console.log(e)
     const d = this.data;
    const i = e.currentTarget.dataset.findex;
    if (d.showfilterindex == i) {
      this.setData({
        showfilter: false,
        showfilterindex: null
      })
    } else {
      this.setData({
        showfilter: true,
        showfilterindex: i,
      })
    }
  },

  setSortIndex: function (e) { //排序一级索引
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    var headSortName = this.data.originalHeadSortName;
    if (headSortName != dataset.sortname) {
      headSortName = dataset.sortname;
    }

    this.setData({
      searchSort: dataset.sortname,
      sortindex: dataset.sortindex,
      headSortName: headSortName,
    })
    this.wxSearchFn();
  },

  setCateIndex: function (e) { //分类一级索引
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    console.log(dataset)

    var headShopName = this.data.originalHeadShopName;
    var searchShop1Temp = null;
    let searchShop1Id = null;
    if (dataset.cateindex != 0) {
      headShopName = dataset.catename;
      searchShop1Temp = dataset.catename;
      searchShop1Id = dataset.cateid;
    }
    this.setData({
      cateindex: dataset.cateindex,
      cateid: dataset.cateid,
      subcateindex: d.cateindex == dataset.cateindex ? d.subcateindex : 0,
      searchShop1: searchShop1Temp,
      searchShop1Id: searchShop1Id,
     
      subcateid: null,
      headShopName: headShopName
    })
    this.wxSearchFn();
  },
  setSubcateIndex: function (e) { //分类二级索引
    const dataset = e.currentTarget.dataset;

    var headShopName = this.data.searchShop1;
    var searchShop2Temp = null;
    if (e.currentTarget.dataset.subcateindex != 0) {
      headShopName = dataset.subcatename;
      searchShop2Temp = dataset.subcatename;
    }

    this.setData({
      subcateindex: dataset.subcateindex,
      subcateid: dataset.subcateid,
      // showfilterindex: null,
      searchShop2: searchShop2Temp,
      headShopName: headShopName
    })
    this.wxSearchFn();
  },
  setAreaIndex: function (e) { //地区一级索引
    const d = this.data;
    const dataset = e.currentTarget.dataset;
    this.setData({
      areaindex: dataset.areaindex,
      areaid: dataset.areaid,
      subareaindex: d.areaindex == dataset.areaindex ? d.subareaindex : 0
    })

  },
  setSubareaIndex: function (e) { //地区二级索引
    const dataset = e.currentTarget.dataset;
    this.setData({
      subareaindex: dataset.subareaindex,
      subareaid: dataset.subareaid,
    })
  },
  hideFilter: function () { //关闭筛选面板
    this.setData({
      showfilter: false,
      showfilterindex: null
    })
  },
  scrollHandle: function (e) { //滚动事件
    this.setData({
      scrolltop: e.detail.scrollTop
    })
  },
  goToTop: function () { //回到顶部
    this.setData({
      scrolltop: 0
    })
  },
  scrollLoading: function () { //滚动加载
    this.fetchShopData();
  },
  onPullDownRefresh: function () { //下拉刷新
    var current = 1;
    var hadLastPage = false;
    var records = [];
    this.fetchShopData();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.hadLastPage) {
      wx.showToast({
        title: '到底了',
      })
      return;
    }
    this.fetchShopData();
  },

  fetchFilterData: async function () { //获取筛选条件
    var params = {};
    app.makeSign(params);
    var that = this;
     let res = await wechat.get("/dict/type/shop_type", {},"admin")
      console.log(res.data)
      if(res.data.success){
         that.setData({
          filterdata: {
            "sort": [
              {
                "id": 0,
                "title": "默认排序"
              }, {
                "id": 1,
                "title": "离我最近"
              }],
            "cate": res.data
          }
        });
      }
  },


  wxSearchFn: function (e) {
    var that = this
    WxSearch.wxSearchAddHisKey(that);
    that.init();
    that.fetchShopData();

  },

init: function(){
  this.setData({
    current: 1,
    hadLastPage:false,
    records:[],
    listShow:true,
    transactionMsg:"",
  });
},

  wxSearchInput: function (e) {
    var that = this
    WxSearch.wxSearchInput(e, that);
  },
  wxSerchFocus: function (e) {
    var that = this
    WxSearch.wxSearchFocus(e, that);
  },
  wxSearchBlur: function (e) {
    var that = this
    WxSearch.wxSearchBlur(e, that);
  },
  wxSearchKeyTap: function (e) {
    var that = this
    WxSearch.wxSearchKeyTap(e, that);
  },
  wxSearchDeleteKey: function (e) {
    var that = this
    WxSearch.wxSearchDeleteKey(e, that);
  },
  wxSearchDeleteAll: function (e) {
    var that = this;
    WxSearch.wxSearchDeleteAll(that);
  },
  wxSearchTap: function (e) {
    var that = this
    WxSearch.wxSearchHiddenPancel(that);
  },

  toInvoice:function(e){
    console.log(e)
    let enterpriseID=e.currentTarget.dataset.enterpriseid;
    let customId = e.currentTarget.dataset.customid;

      wx.navigateTo({
        url: '/pages/homePage/pages/invoice/invoice?enterpriseID=' + enterpriseID + '&customId=' + customId,
      })

  },


  /**
 * 用户点击右上角分享
 */
  // onShareAppMessage: function () {
  //   return {
  //     title: '屏端无线速充小程序',
  //     imageUrl: 'https://api.znpoo.com/wxPicture/smallApp.jpg',
  //     query: "fromId=" + wx.getStorageSync("userInfo").wxUserId,
  //     success: function (res) {
  //       // 转发成功 
  //       console.log("转发成功:" + JSON.stringify(res));

  //     },
  //     fail: function (res) {
  //       // 转发失败
  //       console.log("转发失败:" + JSON.stringify(res));
  //     }
  //   }
  // },
})