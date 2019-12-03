//app.js
var md5 = require("./utils/MD5.js");
const wxcache = require('./utils/wxcache.js')
const wechat = require('./utils/wechat.js')
const api = require('./utils/api.js')
//广告页默认的跳转时间
App({
  onLaunch: function (options) {
    // wx.setStorageSync("enterScene", options.scene);
    this.globalData.enterScene = options.scene;
    let canIUseUpdate = wx.canIUse('getUpdateManager');
    if (canIUseUpdate) {
      const updateManager = wx.getUpdateManager()
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        // console.log(res.hasUpdate)
      })

      updateManager.onUpdateReady(function () {
        wx.showModal({
          title: '更新提示',
          content: '新版本已经准备好，是否重启应用？',
          success: function (res) {
            if (res.confirm) {
              // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
              updateManager.applyUpdate()
            }
          }
        })
      })

      updateManager.onUpdateFailed(function () {
        // 新的版本下载失败
        wx.showModal({
          title: '更新提示',
          content: '新版本下载失败',
          showCancel: false
        })
      })
    }
  },


  onShow: function () {
    // this.login();
    //3秒内只加载1次，防止重复加载
    // let alreadyLoad = wxcache.get("alreadyLoad");
    // console.log("bbbbbbbbbbb", alreadyLoad)
    // if (!alreadyLoad){
    //   wxcache.set("alreadyLoad",true,3);

    wechat.commonLogin();

     
    // }

    this.checkNet()
  },



  login: function () {
    var that = this;
    let token = wx.getStorageSync("token")
    if (typeof (token) != "undefined" && token) {
      console.log('if token : ' + token);
      wx.request({
        url: that.globalData.url + '/wx/checkToken',
        data: {
          token: token
        },
        success: function (res) {
          if (res.data.code != 0) {
            wx.removeStorageSync("token")
            that.login();
            return;
          }
        }
      })
      return;
    } else {
      console.log('else token')
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.request({
              url: that.globalData.url + '/wx/login',
              data: {
                code: res.code
              },
              success: function (res) {
                console.log(res)
                //设置临时区域
                // that.globalData.areas = res.data.areas;


                //将token存入缓存/
                if (res.data.token) {
                  wx.setStorageSync("token", res.data.token)
                  that.globalData.token = res.data.token;

                  //活动是否开启
                  let activityArr = res.data.activityArr;
                  if (activityArr) {
                    Object.keys(activityArr).forEach(function (key) {
                      wx.setStorageSync(key, activityArr[key])
                    })
                  }

                  //广告时间
                  wx.setStorageSync("advExpire", res.data.advExpire)
                }

                if (!res.data.userInfo) {
                  return;
                }


                if (res.data.code == 10000) {
                  // 去授权注册
                  // wx.redirectTo({
                  //   // url: '',
                  // })
                  return;
                }
                if (res.data.code != 0) {
                  // 登录错误
                  wx.hideLoading();
                  wx.showModal({
                    title: '提示',
                    content: '无法登录，请重试',
                    showCancel: false
                  })
                  return;
                }

                wx.setStorageSync("userInfo", res.data.userInfo)

                if (res.data.area) {
                  wx.setStorage({
                    key: "area",
                    data: res.data.area
                  })
                }

              },
              fail: function (res) {
                console.log('登录失败1！' + res.errMsg);
              }
            })
          } else {
            console.log('登录失败2！' + res.errMsg);
          }
        }
      })
    }
  },
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登陆接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              typeof cb == "function" && cb(that.globalData.userInfo)
            }
          })
        }
      })
    }

  },
  globalData: {
    url: api.url,
    imageUrl: api.imageUrl,
    userInfo: null,
    version: "PD 1.2.1", //屏端版本号
    shareProfile: '屏端无线速充', // 首页转发的文案
    token: null,
    SIGN_KEY: "xE%(msPb}@=0F!?wo",
    deviceId: '',
    longitude: '',
    latitude: '',
    enterpriseInfo: null,
    enterScene: '', //进入小程序的场景值
    promotion_detail_swapperImages: [], //活动详情页图片
    advInterval: null,
    defaultCity: '北京', //默认城市
    // areas: [], //临时区域列表
    addrCode: '', //当前地址 行政区代码
    hasCharging: false,  //点击返回首页时 判断用户是否有充电状态，
    isInvoice:'',//开票按钮是否显示
  },
  title: [],
  imgUrls: [],
  author: [],
  date: [],
  url: [],
  requestUrl: "top",
  cssActive: 0,
  page: 0,

  /**
   *  数组对象按key升序, 并生成 md5_hex 签名
   * @param {Array/Object} obj   数组对象
   * @return {String}  encrypted md5加密后的字符串
   */

  makeSign: function (obj) {
    let token = wx.getStorageSync("token");
    if (token) {
      obj.token = token;
    } else {
      console.log('========加密时token为空========');
    }

    if (!obj) {
      console.log('需要加密的数组对象为空')
    }
    var str = '';
    var secret = this.globalData.SIGN_KEY;
    if (!secret) {
      console.log('密钥未获取');
    }
    //生成key升序数组
    var arr = Object.keys(obj);
    arr.sort();
    for (var i in arr) {
      str += arr[i] + obj[arr[i]];
    }
    // var encrypted = md5.hexMD5(str + secret);
    var encrypted = md5.hexMD5(token + secret);
    obj.checkSign = encrypted;
    return encrypted;
  },

  //将区域信息改成obj
  changeAreaToObj: function (key) {
    var area = wx.getStorageSync("area");
    var values = area[key];
    var citys = [];
    for (var i = 0; i < values.length; i++) {
      var arr = JSON.stringify(values[i]).replace("{", "").replace("}", "").replace(/"/g, "").split(":");
      var obj = {};
      obj.code = arr[0];
      obj.name = arr[1];
      citys.push(obj);
    }
    return citys;
  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function () {
  //   return {
  //     title: 'xx小程序',
  //     path: 'https://api.znpoo.com/wxPicture/smallApp.jpg',
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

  // 没联网时
    checkNet(){
      wx.onNetworkStatusChange(function(res){
        console.log('当前网络状态' + res.isConnected);
      })
    }
    
})