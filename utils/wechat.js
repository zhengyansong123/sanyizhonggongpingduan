/**
 * Promise化小程序接口
 */
const app = getApp();
const api = require('../utils/api.js')
const constant = require('../utils/constant.js')
const wxcache = require('../utils/wxcache.js')
const md5 = require('../utils/MD5.js')
import regeneratorRuntime from '../utils/regenerator-runtime/runtime.js'
class Wechat {
  /**
   * 登陆
   * @return {Promise}
   */
  static login() {
    return new Promise((resolve, reject) => wx.login({
      success: resolve,
      fail: reject
    }));
  };

  /**
   * 获取用户信息
   * @return {Promise}
   */
  static getUserInfo() {
    return new Promise((resolve, reject) => wx.getUserInfo({
      success: resolve,
      fail: reject
    }));
  };

  /**
   * 发起网络请求  GET
   * @param {string} url
   * @param {object} params
   * @return {Promise}
   */
  static async request(url, params = {}, method = "GET", server = "adv", type = "application/json") {
    if (url.toLocaleLowerCase().indexOf('http') == -1) {
      url = api.url + "/" + server + url;
    }
    console.log("向后端传递的参数", params, url);

    let scToken = await this.getSCToken();

    // this.getSCToken().then(res=>{
    this.makeSign(params);
    let data = Object.assign({}, params);
    return new Promise((resolve, reject) => {
      let opts = {
        url: url,
        data: Object.assign({}, params),
        method: method,
        header: {
          'Content-Type': type,
          'Authorization': 'Bearer ' + scToken
        },
        // success: resolve,
        success: function (resSuccess) {
          // debugger;
          console.log("请求成功的原始结果为：",resSuccess)
          if (resSuccess.data && resSuccess.data.status && (resSuccess.data.status != 200 || resSuccess.data.status != 0)) {
            resSuccess.data.success = false;
            resSuccess.data.msg = resSuccess.data.message || resSuccess.data.msg;
          } else {
            //换成新的微服务以后，返回数据格式转换，这样前端代码不用动
            if (resSuccess.data && resSuccess.data.data) {
              resSuccess.data = resSuccess.data.data;
            }

            //生成后台返回数据格式修改
            if (resSuccess.data === true) {
              resSuccess.data = {};
            }
            if (null == resSuccess.data.success) {
              resSuccess.data.success = true;
              resSuccess.data.data = resSuccess.data.records
            }
          }
          resolve(resSuccess);
        },
        fail: resComplete => {
          console.log("当前请求错误：", resComplete)

          reject();
        },
        complete: resComplete => {
          console.log("当前请求的结果是：", resComplete)
          if (scToken === resComplete.data) {
            console.log("SCToken过期，重新获取后再次请求")
            wxcache.remove(constant.SC_TOKEN_KEY);
            return this.request(url, params, method)
          }
          resolve();
        }
      }
      wx.request(opts);
    });
    // });
  };

  /**
   * 发起网络请求 POST
   * @param {string} url
   * @param {object} params
   * @return {Promise}
   */
  static async post(url, params = {}, server, type = 'application/json;chaeset =UTF-8') {
    return await this.request(url, params, "POST", server, type)
  }

  /**
   * 发起网络请求 get
   * @param {string} url
   * @param {object} params
   * @return {Promise}
   */
  static async get(url, params = {}, server, type) {
    return await this.request(url, params, "GET", server, type, )
  }

  /**
   * 获取SpringCloud的token
   */
  static getSCToken(url, params, method = "GET", type = "json", headers) {
    let scToken = wxcache.get(constant.SC_TOKEN_KEY);
    if (!scToken) {
      return new Promise((resolve, reject) => {
        let opts = {
          url: api.url + '/auth/oauth/token?grant_type=client_credentials',
          header: {
            isToken: false,
            'WX_FLAG': '1',
            'TENANT_ID': '1',
            'Authorization': 'Basic YXBwRGVtbzoxMTExMTE='
          },
          method: 'post',
          data: {
            client_id: "appDemo",
            client_secret: "111111"
          },
          success: function (res) {
            console.log("获取SpringCloud的token", res);
            wxcache.set(constant.SC_TOKEN_KEY, res.data.access_token, res.data.expires_in);
            scToken = res.data.access_token;
            resolve(scToken);
          },
          fail: reject
        }
        wx.request(opts);
      });
    } else {
      return new Promise((resolve, reject) => {
        resolve(scToken);
      });
    }
  };

  /**
   * 获取微信数据,传递给后端
   */
  static async getCryptoData() {
    let code = "";
    let data = await this.login();
    code = data.code;
    console.log("login接口获取的code:", code);

    let data2 = await this.getUserInfo();
    console.log("getUserInfo接口", data2);
    let obj = {
      js_code: code,
    };
    return Promise.resolve(obj);
  };


  /**
   * 统一登录接口
   */
  static commonLogin() {
    let token = wx.getStorageSync("token")
    console.log("tokentoken", token)
    if (typeof(token) != "undefined" && token) {
      return this.loginWithToken(token);
    } else {
      return this.loginWithoutToken();

    }
  }

  /**
   * 有token的登录
   */
  static async loginWithToken(token) {
    let res = await this.get("/wx/checkToken", {
      token: token
    });

    if (res.data.code != 0) {
      wx.removeStorageSync("token")
      return this.commonLogin();
    } else {
      return Promise.resolve();
    }
  }


  /**
   * 没有token的登录
   */
  static async loginWithoutToken() {
    let data = await this.login();
    let url = '/wx/login';
    let deviceSn = getApp().globalData.scene;

    let params = {
      code: data.code,
      deviceSn:deviceSn
    };
    let res = await this.get(url, params)
    console.log(res, '没有token的登录')
    //将token存入缓存
    if (res.data.token) {
      wx.setStorageSync("token", res.data.token)
      // app.globalData.token = res.data.token;

      //活动是否开启
      let activityArr = res.data.activityArr;
      if (activityArr) {
        Object.keys(activityArr).forEach(function(key) {
          wx.setStorageSync(key, activityArr[key])
        })
      }

      //广告时间
      wx.setStorageSync("advExpire", res.data.advExpire)
    }

    if (!res.data.userInfo) {
      return 'userInfo null';
    }


    if (res.data.code == 10000) {
      return 'register error';
    }
    if (res.data.code != 0) {
      // 登录错误
      wx.hideLoading();
      wx.showModal({
        title: '提示',
        content: '无法登录，请重试',
        showCancel: false
      })
      // resultObj.success = false;
      // resultObj.msg = 'login error';
      return 'login error';
    }

    wx.setStorageSync("userInfo", res.data.userInfo)

    if (res.data.area) {
      wx.setStorage({
        key: "area",
        data: res.data.area
      })
    }

    //设备信息
    if (res.data.deviceInfo){
      wx.setStorageSync("enterpriseInfo", res.data.deviceInfo)
    }

    return Promise.resolve();
  };


  /**
   * 从后端获取openid
   * @param {object} params
   */
  static getMyOpenid(params) {
    let url = 'https://xx.xxxxxx.cn/api/openid';
    return this.post(url, params, "application/x-www-form-urlencoded");
  };


  /**
   * 获取用户中心位置经纬度
   * @param {ctx} name
   */
  static getCenterLocation(name) {
    return new Promise((resolve, reject) => name.getCenterLocation({
      success: resolve,
      fail: reject
    }));
  };


  /**
   * 获取用户位置
   * @param {ctx} name
   */
  static getLocation() {
    return new Promise((resolve, reject) => {
      wx.getLocation({
        type: 'gcj02',
        success: (res) => {

          console.log("=========用户位置信息======", res)

          // app.globalData.longitude = res.longitude;
          // app.globalData.latitude = res.latitude;
          resolve(res.latitude + ',' + res.longitude);
        },
        fail: (err) => {
          wxcache.remove("locateCity");
          console.log("======= getUserLocation  reject ========", err.errMsg)
          reject(err.errMsg);
        }
      })
    });
  };

  /**
   *  数组对象按key升序, 并生成 md5_hex 签名
   * @param {Array/Object} obj   数组对象
   * @return {String}  encrypted md5加密后的字符串
   */
  static makeSign(obj) {
    let token = wx.getStorageSync("token");
    if (token) {
      obj.wxToken = token;
    } else {
      console.log('========加密时token为空========');
    }

    if (!obj) {
      console.log('需要加密的数组对象为空')
    }
    var str = '';
    var secret = constant.SIGN_KEY;

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
  }
}

module.exports = Wechat;