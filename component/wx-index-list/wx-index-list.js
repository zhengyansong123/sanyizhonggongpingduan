// component/wx-index-list/wx-index-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    data: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) { 
        this.resetRight(newVal);
      }
    },
    myCity: {
      type: String,
      value: "",
    },
    // 用于外部组件搜索使用
    search:{
      type:String,
      value:"",
      observer: function (newVal, oldVal) { 
        console.log(newVal)
        this.value = newVal;
        this.searchMt();
      }
    }
  },

  data: {
    list: [],
    rightArr: [],// 右侧字母展示
    jumpNum: '',//跳转到那个字母
    myCityName: '请选择' // 默认我的城市

  },
  ready() {
    let data = this.data.data;
    this.resetRight(data);
    if (this.data.myCity) {
      this.getCity()
    }
  },
  methods: {
    // 数据重新渲染
    resetRight(data) {
      let rightArr = []
      for (let i in data) {
        rightArr.push(data[i].title.substr(0, 1));
      }
      this.setData({
        list: data,
        rightArr
      })
    },
    getCity() {
      wx.getLocation({
        type: 'wgs84',
        success:(res)=>{
          console.log(res, 'alallalaal');
          this.latitude = res.latitude;
          this.longitude = res.longitude;
        }
      })
    },
    // 右侧字母点击事件
    jumpMt(e) {
      let jumpNum = e.currentTarget.dataset.id;
      this.setData({ jumpNum });
    },
    // 列表点击事件
    detailMt(e) {
      console.log(e)
      let detail = e.currentTarget.dataset.detail;
      
      let myEventOption = {
        bubbles: false,//事件是否冒泡
        composed: false,//事件是否可以穿越组件边界
        capturePhase: false //事件是否拥有捕获阶段
      } // 触发事件的选项
      this.triggerEvent('detail', detail, myEventOption)

    },
    // 获取搜索输入内容
    input(e) {
      this.value = e.detail.value;
    },
    // 基础搜索功能
    searchMt() {
      this._search();
    },
    _search(){
      let data = this.data.data;
      let newData = [];
      for (let i = 0; i < data.length; i++) {
        let itemArr = [];
        for (let j = 0; j < data[i].item.length; j++) {
          if (data[i].item[j].name.indexOf(this.value) > -1) {
            let itemJson = {};
            for (let k in data[i].item[j]) {
              itemJson[k] = data[i].item[j][k];
            }
            itemArr.push(itemJson);
          }
        }
        if (itemArr.length === 0) {
          continue;
        }
        newData.push({
          title: data[i].title,
          type: data[i].type ? data[i].type : "",
          item: itemArr
        })
      }
      this.resetRight(newData);
    },
    // 城市定位
    locationMt(e) {
      console.log("========233333333333333333333==============")
      console.log(e)
      let detail = e.currentTarget.dataset.detail;

      let myEventOption = {
        bubbles: false,//事件是否冒泡
        composed: false,//事件是否可以穿越组件边界
        capturePhase: false //事件是否拥有捕获阶段
      } // 触发事件的选项
      this.triggerEvent('detail', detail, myEventOption)
    }

  }
})
