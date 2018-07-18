//logs.js
const util = require('../../utils/util.js') 
Page({
  data: {
    activeIndex1:null,
    activeIndex2: null,
    num:1,  //input默认是1
    // 使用data数据对象设置样式名  
    minusStatus: 'disabled',
    buyInstructions:"",
    showModal1: true,   
    showModal3: true,   //是否隐藏弹框
    showModal2:true,
    showModal4:true,
    imgUrls: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    parameter:[],
    pick:[],
    product:null,
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    now:{
      name:null,
      price:null,
      priture:null,
      id:null,

      },
    type1:null,
    type2:null,
    attribute:"请选择规格属性",
    attr1:"",
    attr2:"",
    attribute:"",
    key1:"",//根据这个获取这个属性的价格。。。
    key2: "",
    key:"",
    mapping:null

  }, 
// 点击购买详情  弹框
  explain:function(){
    // console.log(11)
    this.setData({
      showModal3: !this.data.showModal3
    }) 

  }, 
  hideBtn5:function(){
    this.setData({
      showModal3: true
    })  
  },

  // 点击数量和规格
  number:function(){
    // console.log(11)
    this.setData({
      showModal2: !this.data.showModal2
    }) 
  },
  hideBtn2: function () {
    //  console.log(11)
    this.setData({
      showModal2: true
    })
  },
  choose1:function(e){
   var index1= e.currentTarget.dataset.index;
   if(this.data.type1.attributes[index1-1].able==""){
     return;
   }
  var type2 = this.data.type2;
  //mapping[i].key.split(",")[1].split(":")[1];
  //先把先把之前的恢复到初始化
  for (var j = 0; j < type2.attributes.length; j++) {
    type2.attributes[j]["able"] = "";
  }
  this.setData({
    type2
  })
   var key1 = this.data.type1.index +":"+ this.data.type1.attributes[index1 - 1].index;
   var key =key1 + "," + this.data.key2;
   var now = null;
   var name=this.data.type1.attributes[index1-1].value;
   var mapping=this.data.mapping;
   for (var i = 0; i < mapping.length; i++) {
     console.log(key == mapping[i].key)
     if (key == mapping[i].key) {
       now = mapping[i];
     }
   }
   for(var i=0;i<mapping.length;i++){
       if (mapping[i].key.split(",")[0].split(":")[1] == index1){
       var count = mapping[i].key.split(",")[1].split(":")[1];
       var type2 = this.data.type2;
       for (var j = 0; j < type2.attributes.length; j++) {
         if(type2.attributes[j].index==count){
          type2.attributes[j]["able"] = true;
         } 
       }
     }
   }
   var index1 = e.currentTarget.dataset.index;
   console.log(this.data.type1.attributes[index1 - 1].able)
   if (this.data.type1.attributes[index1 - 1].able == "") {
     return;
   }
   this.setData({
     attr1: name,
     activeIndex1:index1-1,
     attribute:name,
     key,
     key1,
     now,
     type2
   })
  },
  choose2: function (e) {
    var index = e.currentTarget.dataset.index;
    var type1 = this.data.type1;
    var type2 = this.data.type2;
    if (this.data.type2.attributes[index - 1].able == "") {
      return;
    }
    var name = this.data.type2.attributes[index - 1].value;
    //先把先把之前的恢复到初始化
    for (var j = 0; j < type1.attributes.length; j++) {
      type1.attributes[j]["able"] = "";
    }
    this.setData({
      type1
    })
    var name = this.data.type2.attributes[index - 1].value;
    var key2 = this.data.type2.index + ":" + this.data.type2.attributes[index - 1].index
    var key=this.data.key1+","+key2;
    var mapping=this.data.mapping;
    var now=null;
    for(var i=0;i<mapping.length;i++){
        if(key==mapping[i].key){
          now = mapping[i];
        }
    }
    for (var i = 0; i < mapping.length; i++) {
      if (mapping[i].key.split(",")[1].split(":")[1] == index) {
        var count = mapping[i].key.split(",")[0].split(":")[1];
        var type1 = this.data.type1;
        for (var j = 0; j < type1.attributes.length; j++) {
          if (type1.attributes[j].index == count) {
            type1.attributes[j]["able"] = true;
          }
        }
      }
    }
    this.setData({
      type1,
    attr2:name,
      activeIndex2: index-1,
      attribute:this.data.attr1+"  "+name+" "+"x"+this.data.num,
      now,
      key2,
      key
    })
  },
//点击参数
  param: function () {
    this.setData({
      showModal4: !this.data.showModal4
    });
  },
  hideBtn4:function(){
    this.setData({
      showModal4: true
    })
  },
  //  /点击 附属清单
  actioncnt: function () {
    // console.log(11)
    // var that=this;
    this.setData({
      showModal1: !this.data.showModal1
    });
  },
  hideBtn1: function () {
    this.setData({
      showModal1: true
    })
  },

     /* 点击减号 */
  bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减  
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },  
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1  
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态  
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回  
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },  
  /* 输入框事件 */
  bindManual: function (e) {
    console.log(e)
    var num = e.detail.value;
    // 将数值与状态写回  
    this.setData({
      num: num
    });
  } ,

 // 弹出框蒙层截断touchmove事件
  preventTouchMove: function () {
  },
  //  确定按钮
  // hideBtn:function(){
  //   // console.log(11)
  //   this.setData({
  //     showModal: true
  //   });
  // },
  
  onLoad: function () {
    var that=this;
    // 获取除了数量和规格
    wx.request({
      url: 'http://172.16.44.85:8007/goods/sku/user/details',
      data: {
        id: "1017703940456955906",
      },
      method: "POST",
      dataType: "json",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success:function(res){
        console.log(res)
        var data=res.data.data;
      
        for(var i=0;i<data.spu.length;i++){
       
          if (data.current+"" == data.spu[i].id){
           var shop = {};
            var product = data.spu[i];
            var pick = [];
            for (var j = 0; j < product.packings.length; j++) {
              var obj1 = {};
              obj1.value = product.packings[j].value;
              obj1.name = product.packings[j].packingsName
              pick.push(obj1);
            }
            for (var k = 0; k < product.parts.length; k++) {
              var obj2 = {};
              obj2.name = product.parts[k].partsName;
              obj2.value = product.parts[k].value;
              pick.push(obj2);
            }
            var imgArr = [];
            for (var q = 0; q < product.pics.length; q++) {
                 shop.pic=product.pics[0].pic
              imgArr.push(product.pics[q].pic);
            }
            var parameter = [];
            for (var w = 0; w < product.attributes.length; w++) {

              if (product.attributes[w].type == 2) {
                var obj3 = {};
                obj3.name = product.attributes[w].name;
                obj3.value = product.attributes[w].value;
                parameter.push(obj3);
              }
            }
            shop.id=product.id;
            shop.sysName = product.showName;
            shop.price = product.price;

            that.setData({
              buyInstructions: product.buyInstructions,
              pick: pick,
              
              now: shop,
              product: shop,
              imgUrls: imgArr,
              parameter: parameter
            })
          }
        }
      }
    })
  //数量和规格
  wx.request({
    url: 'http://172.16.44.85:8007/goods/sku/user/findSpecifications',
    data: {
      id: "1017703940456955905",
    },
    method: "POST",
    dataType: "json",
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success:function(res){
       console.log(res)
      var data=res.data.data;
        var type1;
        var type2;
        var activeIndex1;
        var key1;
        var key2;
        var key;
        var k1=0;
        var k2=0;
      for(var i=0;i<data.attributes.length;i++){
        if(data.attributes[i].index==1){    
          type1= data.attributes[i];
          for(var j=0;j<type1.attributes.length;j++){
            if (type1.attributes[j].check){
              activeIndex1=j;
              k1 = type1.attributes[j].index;
              key1 = "1" + ":" + k1;
            }
          }
        }else{
          type2 = data.attributes[i];
          for (var j = 0; j < type2.attributes.length; j++) {
            if (type2.attributes[j].check) {
              var activeIndex2 = j;
              k2 = type2.attributes[j].index;
              key2 = "2" + ":" + k2;
              key=key1+","+key2;
            }
          }
        }
      }
      // console.log(key1);
      // console.log(key2);
      var shop={};
      // console.log(type2)
      // console.log(activeIndex1)
      for (var j = 0; j < type2.attributes.length; j++) {
        type2.attributes[j]["able"] = "";
      }
      for (var j = 0; j < type1.attributes.length; j++) {
        type1.attributes[j]["able"] = "";
      }
      for (var k = 0; k < data.mapping.length;k++){
        var count1 = data.mapping[k].key.split(",")[1].split(":")[1];
        console.log(count1);
         for (var j = 0; j < type2.attributes.length; j++) {
           if (type2.attributes[j].index == count1) {
             type2.attributes[j]["able"] = true;
           }
         }
         var count2 = data.mapping[k].key.split(",")[0].split(":")[1];
         for (var j = 0; j < type1.attributes.length; j++) {
           if (type1.attributes[j].index == count2) {
             type1.attributes[j]["able"] = true;
           }
         }
        if(key==data.mapping[k].key){
          shop = data.mapping[k];
       
        }
        
   
      }
      var attr1;
      var attr2;
      for(var i=0;i<type1.attributes.length;i++){
        if(type1.attributes[i].check){
          attr1 = type1.attributes[i].value;
        }
      }
      for (var i = 0; i < type2.attributes.length; i++) {
        if (type2.attributes[i].check) {
          attr2 = type2.attributes[i].value;
        }
      }
      // console.log(shop);
      that.setData({
        type1,
        type2,
        key1,
        key2,
        key,
        attr1,
        attr2,
        now:shop,
        activeIndex1,
        activeIndex2,
        mapping:data.mapping
      })
    }
  })
   },

})