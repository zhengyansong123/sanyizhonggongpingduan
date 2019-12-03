var app = getApp();
const util = require("../../../../utils/util.js")
Page({
  data:{
    
  },
  onLoad:function(options){
    // 生命周期函数--监听页面加载
    // util.checkUser();
    
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