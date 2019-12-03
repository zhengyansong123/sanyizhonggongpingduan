const app = getApp()
const md5 = require("../utils/MD5.js");
const wechat = require("../utils/wechat.js")
const SIGN_KEY = "xE%(msPb}@=0F!?wo"
const imageUrl = "https://adv.screeminal.cn/wxPicture/"
// const host = app.globalData.url
//  const url = "http://192.168.1.202:9999"
// const url = "https://adv.screeminal.com"
const url = "https://adv.screeminal.cn"



const wxRequest = (params, url) => {
   // wx.showToast({
   //   title: '加载中',
   //   icon: 'loading'
   // })
   let token = wx.getStorageSync("token")
   // 检查用户是否具有登陆态
   // if (!userkey || !userId || !sessionData) {

   // console.log("token =====" + token)
   // console.log("url =====" + url)
   if (!token) {
      // 如果未登录就前往登录界面
      this.toLogin()
      return;
   }

   params.data.token = token;
   makeSign(params.data);
   // 这里我们每次调用接口时，都要先去调用app.js中的ready方法
   // 在app中ready会返回一个promise对象，只有其返回的状态时resolved状态时才会触发.then()方法
   // console.log(url);
   // 获取服务端数据
   wx.request({
      url: url,
      method: params.method || 'GET',
      data: params.data || {},
      header: {
         'Content-Type': 'application/json'
      },
      success: (res) => {
         params.success && params.success(res)
         // wx.hideToast()
      },
      fail: (res) => {
         params.fail && params.fail(res)
      },
      complete: (res) => {
         params.complete && params.complete(res)
      }
   })
}


//login & regist
const login = (params) => wxRequest(params, url + '/wx/login')
const register = (params) => wxRequest(params, url + '/wx/register')
const checkToken = (params) => wxRequest(params, url + '/wx/checkToken')

//index
const getIndexData = (params) => wxRequest(params, url + "/wx/index/getIndexData")

//device
const getDeviceList = (params) => wxRequest(params, url + "/wx/device/getList")

//income

//balance

//setting

const feedBack = (params) => wxRequest(params, url + "/setting/feedback")





/**
 *  数组对象按key升序, 并生成 md5_hex 签名
 * @param {Array/Object} obj   数组对象
 * @return {String}  encrypted md5加密后的字符串
 */

const makeSign = (obj) => {
   if (!obj) {
      console.log('需要加密的数组对象为空')
   }
   var str = '';
   //生成key升序数组
   var arr = Object.keys(obj);
   arr.sort();
   for (var i in arr) {
      str += arr[i] + obj[arr[i]];
   }
   // var encrypted = md5.hexMD5(str + secret);
   let token = wx.getStorageSync("token")
   var encrypted = md5.hexMD5(token + SIGN_KEY);
    obj.checkSign = encrypted;
   return encrypted;
}

const toLogin = () => {
   wx.showModal({
      title: '提示',
      content: '登录超时，正在重新登录。。',
      success: (res) => {
         app.login()
      }
   })
}
const checkMobile = (phone) => {
   if (!(/^1\d{10}$/.test(phone))) {
      return false;
   }
   return true;
}


module.exports = {
   imageUrl,
   url,
   checkMobile,
   login,
   register,
   getDeviceList,
   getIndexData,
   checkToken,
   feedBack
}
