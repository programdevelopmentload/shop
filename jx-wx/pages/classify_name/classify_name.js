// pages/classify_name/classify_name .js
const app=getApp();
var classId = app.data.classId;
Page({

  /**
   * 页面的初始数据
   */
  data: {
     index:1,
     currentScroll:"",
     product:[],
     index:1,
     size:"B",
     price:"C",
     priceImg:"../img/default.png",
     sizeImg:"../img/default.png",
     isHideLoadMore:true,
     product:true
  },
  details:function(){
    wx.navigateTo({
      url: "../productDetails/productDetails",

    })
  },
  default1:function(e){

  this.setData({
    index:e.currentTarget.dataset.index,
    currentScroll:""
  })
  console.log(classId)
  var that = this;
  wx.request({
    url: 'http://172.16.34.227:8007/goods/sku/user/scrollSearch',
    data: {
      scrollSize: 10,
    },
    method: "POST",
    dataType: "json",
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      console.log(res);
      console.log(that.data.currentScroll);
      if (res.data.success) {
        that.setData({
          currentScroll: res.data.data.currentScroll
        })
        var data = res.data.data.data;
        console.log(data)
        var arr = [];
        for (var i = 0; i < data.length; i++) {
          var obj = {};
          obj.id = data[i].id;
          if (data[i].showName != "") {
            obj.name = data[i].showName;
          } else {
            obj.name = data[i].sysName;
          }
          obj.img - data[i].pics[0].pic;
          obj.size = data[i].size;
          obj.price = data[i].price;
          arr.push(obj);
        }
        that.setData({
          product: arr
        })
        console.log(that.data.arr);
        console.log(that.data.currentScroll);

      }

    },
    fail: function (err) {
      // console.log(err);
    }
  })
  },
  sale:function(e){
    var sizeImg="";
      if(this.data.sizeImg=="../img/default.png"){
        sizeImg="../img/bottom.png"
      } else if (this.data.sizeImg == "../img/bottom.png"){
        sizeImg = "../img/top.png"
      }else{
        
      }
    this.setData({
      index: e.currentTarget.dataset.index,
      currentScroll: "",
      price:"",
      sizeImg:sizeImg,
      priceImg:"../img/default.png"
    });
    if(this.data.size=="A"){
      this.setData({
            size:"B"
      });
    }else{
      this.setData({
        size: "A"
      });
    }

    var that = this;
    wx.request({
      url: 'http://172.16.34.227:8007/goods/sku/user/scrollSearch',
      data: {
        scrollSize: 10,
        size:that.data.size
      },
      method: "POST",
      dataType: "json",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

 
        if (res.data.success) {
          that.setData({
            currentScroll: res.data.data.currentScroll
          })
          var data = res.data.data.data;
  
          var arr = [];
          for (var i = 0; i < data.length; i++) {
            var obj = {};
            obj.id = data[i].id;
            if (data[i].showName != "") {
              obj.name = data[i].showName;
            } else {
              obj.name = data[i].sysName;
            }
            obj.img - data[i].pics[0].pic;
            obj.size = data[i].size;
            obj.price = data[i].price;
            arr.push(obj);
          }
          that.setData({
            product: arr
          })
      

        }

      },
      fail: function (err) {
        // console.log(err);
      }
    })
  },
  price:function(e){
    var priceImg=""
    if (this.data.priceImg == "../img/default.png") {
      priceImg = "../img/bottom.png"
    } else if (this.data.priceImg == "../img/bottom.png") {
      priceImg = "../img/top.png"
    }else{
      priceImg = "../img/bottom.png"
    }
    this.setData({
      index: e.currentTarget.dataset.index,
      currentScroll: "",
      size:"",
      priceImg: priceImg,
      sizeImg:"../img/default.png"
    })
    if (this.data.size == "D") {
      this.setData({
        price: "C"
      });
    } else {
      this.setData({
        price: "D"
      });
    }
    var that = this;
    wx.request({
      url: 'http://172.16.34.227:8007/goods/sku/user/scrollSearch',
      data: {
        scrollSize: 10,
        price:that.data.price
      },
      method: "POST",
      dataType: "json",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
     
        if (res.data.success) {
          that.setData({
            currentScroll: res.data.data.currentScroll
          })
          var data = res.data.data.data;

          var arr = [];
          for (var i = 0; i < data.length; i++) {
            var obj = {};
            obj.id = data[i].id;
            if (data[i].showName != "") {
              obj.name = data[i].showName;
            } else {
              obj.name = data[i].sysName;
            }
            obj.img - data[i].pics[0].pic;
            obj.size = data[i].size;
            obj.price = data[i].price;
            arr.push(obj);
          }
          that.setData({
            product: arr
          })
     

        }

      },
      fail: function (err) {
        // console.log(err);
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {




    var that = this;
    wx.request({
      url: 'http://172.16.34.227:8007/goods/sku/user/scrollSearch',
      data: {
        scrollSize: 10,
        size:"",
        price:""
      },
      method: "POST",
      dataType: "json",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

        if (res.data.success) {
          that.setData({
            currentScroll: res.data.data.currentScroll
          })
          var data = res.data.data.data;
          console.log(data)
          var arr = [];
          for (var i = 0; i < data.length; i++) {
            var obj = {};
            obj.id = data[i].id;
            if (data[i].showName != "") {
              obj.name = data[i].showName;
            } else {
              obj.name = data[i].sysName;
            }
            obj.img - data[i].pics[0].pic;
            obj.size = data[i].size;
            obj.price = data[i].price;
            arr.push(obj);
          }
          that.setData({
            product: arr
          })
          console.log(that.data.arr);
          console.log(that.data.currentScroll);

        }

      },
      fail: function (err) {
        // console.log(err);
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.product){

    }else{
      return;
    }
    var that=this;
    this.setData({
      isHideLoadMore:false
    })
    console.log(this.data)
    var that = this;
    var arr=that.data.product;
    wx.request({
      url: 'http://172.16.34.227:8007/goods/sku/user/scrollSearch',
      data: {
        scrollSize: 10,
      },
      method: "POST",
      dataType: "json",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        that.setData({
          isHideLoadMore:true
        })
        if (res.data.success) {
          that.setData({
            currentScroll: res.data.data.currentScroll
          })
          var data = res.data.data.data;
          if(data.length==0){
            that.setData({
              product:false
            })
            return;
          }
          
          for (var i = 0; i < data.length; i++) {
            var obj = {};
            obj.id = data[i].id;
            if (data[i].showName != "") {
              obj.name = data[i].showName;
            } else {
              obj.name = data[i].sysName;
            }
            obj.img - data[i].pics[0].pic;
            obj.size = data[i].size;
            obj.price = data[i].price;
            arr.push(obj);
          }
          that.setData({
            product: arr
          })
 

        }

      },
      fail: function (err) {
        // console.log(err);
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})