// pages/wallet/index.js
var app = getApp();
const api = require('../../../../utils/api.js')
const util = require("../../../../utils/util.js")
const wechat = require('../../../../utils/wechat.js')
import regeneratorRuntime from '../../../../utils/regenerator-runtime/runtime'
Page({
   data: {
      // 故障车周围环境图路径数组
      picUrls: [], //图片临时路径
      realPicUrls: [], //图片真实路径
      // 故障车编号和备注
      inputValue: {
         num: 0,
         desc: "",
      },

      // 选取图片提示
      actionText: "拍照/相册",

      // 复选框的value，此处预定义，然后循环渲染到页面
      itemsValue: [],

      // 被选中的故障类型
      checkedValue: []
   },
   // 页面加载
   onLoad: async function(options) {
      // util.checkUser();
      var that = this;
      var itemsValue = [];
      //获取列表数据
      var params = {
         type: 3
      }
      app.makeSign(params);
      let res = await wechat.get("/dict/type/break_down",{},"admin")
      console.log(res)
      if (res.data.success) {
         var data = res.data;
         for (var i = 0; i < data.length; i++) {
            var obj = {};
            obj.id = data[i].value;
            obj.value = data[i].label;
            obj.checked = false;
            obj.color = "#b9dd08";
            itemsValue.push(obj);
         }
         that.setData({
            itemsValue,
         });
         // console.log(itemsValue)
      } else { //权限不对
      }

      //  wx.request({
      //     url: '/admin/dict/type/shop_type',
      //    data: params,
      //    method: 'get', // POST
      //    // header: {}, // 设置请求的 header
      //    success: function(res) {
      //      // console.log(res)
      //      if (res.data.success) {
      //        var data = res.data.data;
      //        for (var i = 0; i < data.length; i++) {
      //          var obj = {};
      //          obj.id = data[i].id;
      //          obj.value = data[i].content;
      //          obj.checked = false;
      //          obj.color = "#b9dd08";
      //          itemsValue.push(obj);
      //        }
      //        that.setData({
      //          itemsValue,
      //        });
      //        // console.log(itemsValue)
      //      } else { //权限不对
      //      }
      //    }
      //  })

      that.setData({
         inputValue: {
            num: app.globalData.deviceId,
         }
      });
      wx.setNavigationBarTitle({
         title: '故障报修'
      })
   },

   //点击选择故障类型
   chooseWarn: function(e) {
      console.log(e)
      let id2 = e.currentTarget.dataset.id;
      let dataMap = this.data.itemsValue;
      dataMap.map(function(item) {
         if (item.id === id2) {
            item.checked = !item.checked;
         }
      }.bind(this))
      this.setData({
         itemsValue: dataMap,
      })
   },



   // 输入单车编号，存入inputValue
   numberChange: function(e) {
      this.setData({
         inputValue: {
            num: e.detail.value,
            desc: this.data.inputValue.desc
         }
      })
   },
   // 输入备注，存入inputValue
   descChange: function(e) {
      this.setData({
         inputValue: {
            num: this.data.inputValue.num,
            desc: e.detail.value
         }
      })
   },
   // 提交到服务器
   formSubmit: async function(e) {
      let deviceId = this.data.inputValue.num;
      let checked = this.data.checked
      let itemsValue = this.data.itemsValue

      let values = itemsValue.filter(function(x) {
         return x.checked;
      })

      if (values.length == 0) {
         wx.showToast({
            title: '请选择故障类型',
         })
         return;
      } else if (!deviceId) {
         wx.showToast({
            title: '请填写设备号',
         })
         return;
      }

      let latitude = app.globalData.latitude;
      let longitude = app.globalData.longitude;
      if (!latitude) {
         latitude = 0;
      }
      if (!longitude) {
         longitude = 0;
      }
      // 故障类型
      if (values.length != 0) {
         let dataMap = this.data.itemsValue;
         let obj = {}
         let text = []
         let id = []
         let checkedValue = this.data.checkedValue
         dataMap.map(function(item) {
            if (item.checked) {
               text.push(item.value)
               id.push(item.id)
            }
         }.bind(this))
         for (var i = 0; i < text.length; i++) {
            var warn = {}
            warn.value = id[i]
            warn.label = text[i]
            checkedValue.push(warn)
         }
         this.setData({
            checkedValue
         })


         obj.brokendown = this.data.checkedValue
         obj.desc = this.data.inputValue.desc;
         var params = {
            wxUserId: wx.getStorageSync("userInfo").wxUserId,
            imgs: JSON.stringify(this.data.realPicUrls),
            deviceNo: this.data.inputValue.num,
            content: JSON.stringify(obj), //故障内容+描述json
            type: '充电设备故障-from屏端小程序', //故障类型
            latitude: latitude,
            longitude: longitude,
            desc:this.data.inputValue.desc
         };
         app.makeSign(params);
         console.log(params);

         let res = await wechat.post('/breakdown',params)
        

        if(res.data){
           wx.showToast({
                     // title: res.data.data.msg,
                     title: '提交成功',
                     icon: 'success',
                     duration: 2000,
                     success: function() {
                        setTimeout(function() {
                           wx.navigateBack({
                              delta: 1 // 回退前 delta(默认为1) 页面
                           })
                        }, 2000);
                     }
                  })
        }else{
           wx.showModal({
                     title: '操作失败',
                     content: res.data.msg,
                     showCancel: false
                  })
                  return;
        }
      }
         // wx.request({
         //    url: app.globalData.url + "/wxApp/warn",
         //    data: params,
         //    method: 'get', // POST
         //    // header: {}, // 设置请求的 header
         //    success: function(res) {
         //       if (res.data.success) {
         //          wx.showToast({
         //             // title: res.data.data.msg,
         //             title: '提交成功',
         //             icon: 'success',
         //             duration: 2000,
         //             success: function() {
         //                setTimeout(function() {
         //                   wx.navigateBack({
         //                      delta: 1 // 回退前 delta(默认为1) 页面
         //                   })
         //                }, 2000);
         //             }
         //          })
         //       } else {
         //          wx.showModal({
         //             title: '操作失败',
         //             content: res.data.msg,
         //             showCancel: false
         //          })
         //          return;
         //       }
         //    }
         // })



         // wx.showToast({
         //   // title: res.data.data.msg,
         //   title: '提交成功',
         //   icon: 'success',
         //   duration: 2000,
         //   success: function () {
         //     setTimeout(function(){
         //       wx.navigateBack({
         //         delta: 1 // 回退前 delta(默认为1) 页面
         //       })
         //     },1000);
         //   }
         // })
         // wx.request({
         //   url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/msg',
         //   data: {
         //     // picUrls: this.data.picUrls,
         //     // inputValue: this.data.inputValue,
         //     // checkboxValue: this.data.checkboxValue
         //   },
         //   method: 'get', // POST
         //   // header: {}, // 设置请求的 header
         //   success: function(res){
         //     console.log('success');
         //     wx.showToast({
         //       // title: res.data.data.msg,
         //       title: '提交成功',
         //       icon: 'success',
         //       duration: 2000,
         //       success:function(){
         //         // setTimeout(function(){
         //         //   wx.navigateBack({
         //         //     delta: 1 // 回退前 delta(默认为1) 页面
         //         //   })
         //         // },2000);
         //       }
         //     })
         //   }
         // })
      
      //  else {
      //    wx.showModal({
      //       title: "请填写反馈信息",
      //       content: '反馈信息不能为空',
      //       confirmText: "继续",
      //       cancelText: "不填了",
      //       success: (res) => {
      //          if (res.confirm) {
      //             // 继续填
      //          } else {
      //             // console.log("back")
      //             wx.navigateBack({
      //                delta: 1 // 回退前 delta(默认为1) 页面
      //             })
      //          }
      //       }
      //    })
      // }

   },
   // 选择故障车周围环境图 拍照或选择相册
   bindCamera: async function() {
      var that = this;
      let scToken = await wechat.getSCToken();
      wx.chooseImage({
         count: 9,
         sizeType: ['original', 'compressed'],
         sourceType: ['album', 'camera'],
         success: function(res) {
            //图片回显
            let tfps = res.tempFilePaths;
            let _picUrls = that.data.picUrls;
            for (let item of tfps) {
               _picUrls.push(item);
               that.setData({
                  picUrls: _picUrls,
                  actionText: "+"
               });
            }


            //保存图片
            var tempFilePaths = res.tempFilePaths
            var params = {
               deviceId: app.globalData.deviceId
            };
            app.makeSign(params);
        

            for (var i = 0; i < tempFilePaths.length; i++) {
               wx.uploadFile({
                  // url: api.urlSCToken + '/admin/file/upload',
                  url: api.url + '/admin/file/upload',
                  filePath: tempFilePaths[i],
                  name: 'file',
                  header: {
                     'content-type': 'multipart/form-data',
                     'Authorization': 'Bearer ' + scToken
                  }, // 设置请求的 header
                  formData: params,
                  success: function(res) {
                     console.log("上传成功！！")
                     var data = JSON.parse(res.data);
                     var realPicUrls = that.data.realPicUrls;
                     realPicUrls.push(data.data.fileName);
                     // console.log(data.data.fileName);
                     // console.log(data);
                     that.setData({
                        realPicUrls: realPicUrls,
                     });
                     console.log(that.data.realPicUrls)
                    
                  },
                  fail: function(error) {
                     console.log("上传失败！！")
                  }
               })
            }
         }


         // success: (res) => {
         //   var tempFilePaths = res.tempFilePaths
         //   console.log(tempFilePaths)
         //   // wx.saveFile({
         //   //   tempFilePath: tempFilePaths[0],
         //   //   success: function (res) {
         //   //     var savedFilePath = res.savedFilePath
         //   //     console.log(savedFilePath);
         //   //   }
         //   // })



         //   let tfps = res.tempFilePaths;
         //   let _picUrls = this.data.picUrls;
         //   for (let item of tfps) {
         //     _picUrls.push(item);
         //     this.setData({
         //       picUrls: _picUrls,
         //       actionText: "+"
         //     });
         //   }
         // }
      })
   },
   // 删除选择的故障车周围环境图
   delPic: function(e) {
      let index = e.target.dataset.index;
      let _picUrls = this.data.picUrls;
      _picUrls.splice(index, 1);
      this.setData({
         picUrls: _picUrls
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

   onShow: function() {
      //PV/UV统计
      util.statistics('页面', '故障报修')
   }
})