const app = getApp();
const wxcache = require('../utils/wxcache.js')
const wechat = require('../utils/wechat.js')
import regeneratorRuntime from '../utils/regenerator-runtime/runtime.js'

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 检查当前用户是否登录
 */
const checkUser = (routing) => {
  let result = true;
  let userInfo = wx.getStorageSync("userInfo")
  // 暂时营造未登录状态
  // userInfo = "";
  // wx.setStorageSync("userInfo", '')
  if (!userInfo || !userInfo.nickName) {
    result = false;
    wx.showModal({
      title: '温馨提示',
      content: '尚未登录，请先登录',
      success(res) {
        if (res.confirm) {
          // 用户点击确定
          console.log('用户确定登录')
          wx.switchTab({
            url: routing,
          })
        } else if (res.cancel) {
          // 用户点击取消
          console.log('用户取消登录')
        }
      }
    })
    return;
  }
  return result;
};

/**
 * 扫码 公共代码
 */

const scanCode = (deviceId) => {
  //PV/UV统计
  statistics("扫码", "扫码");

  var userId = wx.getStorageSync("userInfo").wxUserId;
  wx.navigateTo({
    url: '/pages/homePage/pages/charging/chargingGuide/chargingGuide',
  })


}

//生成邀请码
const getInviteCode = () => {
  let uuid = getUUID();
  console.log("aaaaaaaaaaUUid = " + uuid);

}

//生成UUID
function getUUID() {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  var uuid = s.join("");
  console.log("uuid === " + uuid)
  return uuid;
}


//计算时间差
function getSubTime(startTime) {
  var date2 = new Date(); //结束时间
  var date3 = date2.getTime() - startTime //时间差的毫秒数

  //计算出相差天数
  var days = Math.floor(date3 / (24 * 3600 * 1000))

  //计算出小时数

  var leave1 = date3 % (24 * 3600 * 1000) //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000) //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))


  //计算相差秒数
  var leave3 = leave2 % (60 * 1000) //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000)


  // return (" 相差 " + days + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒")
  let obj = {};
  obj.day = days;
  obj.hour = hours;
  obj.minute = minutes;
  obj.second = seconds;
  return obj;
  // return (" 相差 " + days + "天 " + hours + "小时 " + minutes + " 分钟" + seconds + " 秒")
}




//页面PV/UV统计
//type:页面、按钮 
//event:页面名称、扫码、优惠按钮、开票按钮
function statistics(type, event) {
  console.log(type + "=========页面PV/UV统计=============" + event)
  let enterScene = app.globalData.enterScene //进入小程序的场景值
  
  let deviceId = app.globalData.deviceId;//设备id

  let params = {
    deviceSn: deviceId,
    type: type,
    event: event,
    scene: enterScene
  }
}


function showChangeCityModal() {
  return new Promise((resolve, reject) => {
    resolve();
  })
}



/**
 * 公共showToast
 */
function showToast(contant) {
  wx.showToast({
    title: contant,
    icon:'none',
    duration:1500
  })
}

/**
 * 获取 今天距离明天倒计时秒数
 */
function getSecrondsToTomorow() {
  var date = new Date();
  // 获取当前时间距离----毫秒数
  var m1 = date.getTime();
  Debugger.log(m1)
  // 设置为当前天凌晨0:0:0
  date.setHours(0);
  date.setMinutes(0);
  date.setSeconds(0);
  // 获取当前天凌晨距离----毫秒数
  var m0 = date.getTime();
  Debugger.log(m0)
  // 获取距离明天的秒数
  var m = 60 * 60 * 24 - (m1 - m0) / 1000;
  return m;
}



/**
 * 获取用户定位
 */
function getUserLocation() {
  return new Promise((resolve, reject) => {
    let enterpriseInfo = wxcache.get("enterpriseInfo"); //如果有商家信息 则定位城市为商家所在的城市
    if (enterpriseInfo) {
     
      wxcache.set("locateCity", enterpriseInfo.cityName);
      resolve()
    } else {

      wechat.getLocation().then(res => {
        let arr = res.split(",")
        app.globalData.longitude = arr[1];
        app.globalData.latitude = arr[0];

        let url = `https://apis.map.qq.com/ws/geocoder/v1/`;
        let key = 'WOEBZ-PJM6I-UMHGY-5TB2Y-WAP47-3JBDJ';
        let params = {
          location: res,
          key
        }

        console.log("==========", params)

        return wechat.get(url, params);
      })
        .then(d => {
          console.log("当前地址", d.data.result.address);
          //设置当前所在市
          let tempCity = d.data.result.address_component.city.replace('市', '');
          wxcache.set("locateCity", tempCity);
          resolve();
        })
        .catch(e => {
          console.log("========根据经纬度，查询用户城市报错======", e);
          reject();
        })

    }
  }).catch((reson) => {
    
    console.log("======== getUserLocation  catch Exception  ============", reson)
    // reject();
  });
}



module.exports = {
  formatTime: formatTime,
  checkUser: checkUser,
  scanCode: scanCode,
  getInviteCode: getInviteCode,
  getSubTime: getSubTime,
  statistics: statistics,
  getUserLocation: getUserLocation,
  showToast: showToast,
}