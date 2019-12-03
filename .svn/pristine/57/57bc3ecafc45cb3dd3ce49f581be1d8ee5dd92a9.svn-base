// pages/index/Component/FormM/FormM.js
var model = require('../../../../component/model/model.js');
var show = false;
var item = {};
var app = getApp();
const util = require("../../../../utils/util.js")
const wechat = require('../../../../utils/wechat.js')
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime'
Page({
  //初始化数据
  data: {
    array: ['北京市', '天津市', '河北省', '山西省', '内蒙古自治区', '辽宁省', '吉林省', '黑龙江省', '上海市', '江苏省', '浙江省', '安徽省', '福建省', '江西省', '山东省', '河南省', '湖北省', '湖南省', '广东省', '广西壮族自治区', '海南省', '重庆市', '四川省', '贵州省', '云南省', '西藏自治区', '陕西省', '甘肃省', '青海省', '宁夏回族自治区', '新疆维吾尔自治区', '台湾省', '香港特别行政区', '澳门特别行政区'],
    index: 0,
    date: '2016-12-20',
    time: '11:19',
    allValue: '',
    item: {
      show: show
    },
    province: '请选择城市',
    city: '',
    county: '',
    flag1: false,
    flag2: false,
    firstname: '',
    nameShow: false,
    name: ""

  },
  //表单提交按钮
  formSubmit:  function(e) {
    var that = this;
    var values = e.detail.value;
    var msg = "";
    var type_select = ''
    if (this.data.flag1) {
      type_select = '产品代理'
    }
    if (this.data.flag2) {
      type_select = '广告代理'
    }
    if (this.data.flag1 && this.data.flag2) {
      type_select = '产品代理，广告代理'
    }
    if (values.mobile == "") {
      msg = "请输入手机号！";
    }

    if (values.userName == "") {
      msg = "请输入姓名！";
    }

    if (type_select == '') {
      msg = "请选择加盟类型！";
    }


    if (msg != "") {
      wx.showToast({
        title: msg,
        icon: 'none',
        duration: 1500
      })
      return;
    }

    var prov = this.data.province;
    if (prov == "请选择城市") {
      prov = "";
    }

    var params = {
      // wxUserId: wx.getStorageSync("userInfo").wxUserId,
      mobile: values.mobile,
      name: that.data.name,
      type: type_select,
      province: prov,
      city: that.data.city,
      district: that.data.county,
    }
    app.makeSign(params);

   let res =  wechat.post('/join',params)
   // if(res.data.success){
   //    wx.showToast({
   //       title: '提交成功',
   //       icon: 'success',
   //       duration: 2000,
   //       success: function () {
   //          console.log("AAAA")
   //          setTimeout(function () {
   //             console.log("BBBBB")
   //             wx.switchTab({
   //                url: '/pages/tabBar/homePage/index',
   //             })
   //          }, 2000);
   //       }
   //    })
   // }
   //  wx.request({
   //    url: app.globalData.url + '/wxApp/join',
   //    data: params,
   //    success: function(data) {
   //      wx.showToast({
   //        title: '提交成功',
   //        icon: 'success',
   //        duration: 2000,
   //        success: function() {
   //          console.log("AAAA")
   //          setTimeout(function() {
   //            console.log("BBBBB")
   //            wx.switchTab({
   //              url: '/pages/tabBar/homePage/index',
   //            })
   //          }, 2000);
   //        }
   //      })
   //    },
   //    fail: function(error) {
   //      console.log(error);
      
   //  })

  },
  //表单重置按钮
  formReset: function(e) {
    console.log('form发生了reset事件，携带数据为：', e.detail.value)
    this.setData({
      allValue: ''
    })
  },
  //---------------------与选择器相关的方法
  //代理地区选择
  bindPickerChange: function(e) {
    var array = this.data.array;
    var proxyProvince = array[e.detail.value];
    this.setData({
      proxyProvince: proxyProvince
    })

  },
  //日期选择
  bindDateChange: function(e) {
    this.setData({
      date: e.detail.value
    })
  },
  //时间选择
  bindTimeChange: function(e) {
    this.setData({
      time: e.detail.value
    })
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    // util.checkUser();
  },
  onReady: function(e) {
    // 页面渲染完成
    var that = this;
    //请求数据
    model.updateAreaData(that, 0, e);

    
  },
  onShow: function() {
    // 页面显示
  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  },

  //点击选择城市按钮显示picker-view 并将第一个城市设置为默认城市
  translate: function(e) {
    model.animationEvents(this, 0, true, 400);
    this.setData({
      province: '北京市',
      city: '北京市',
      county: '东城区'
    })
  },
  //隐藏picker-view
  hiddenFloatView: function(e) {
    model.animationEvents(this, 200, false, 400);

  },
  //滑动事件
  bindChange: function(e) {
    model.updateAreaData(this, 1, e);
    item = this.data.item;
    this.setData({
      province: item.provinces[item.value[0]].name,
      city: item.citys[item.value[1]].name,
      county: item.countys[item.value[2]].name
    });
  },
  onReachBottom: function() {},
  nono: function() {},

  //拨打手机号码
  makePhoneCall: function() {
    var that = this
    wx.makePhoneCall({
      phoneNumber: '4008102108',
      // success: function () {
      //   console.log("成功拨打电话")
      // }
    })
  },
  // 代理类型的选择

  // 产品代理
  type_select1: function(e) {
    this.data.flag1 = !this.data.flag1
    this.setData({
      _num1: this.data.flag1
    })

  },
  // 广告代理
  type_select2: function(e) {
    this.data.flag2 = !this.data.flag2
    this.setData({
      _num2: this.data.flag2
    })
  },

  // 先生女士选择

  check: function(e) {
    this.setData({
      name: this.data.firstname + e.target.dataset.sex,
      nameShow: false
    })
  },

  input_checkname: function(e) {
    if (e.detail.value.length == 1) {
      this.setData({
        nameShow: true,
        firstname: e.detail.value
      })
    } else {
      this.setData({
        nameShow: false
      })
    }
  }

})
