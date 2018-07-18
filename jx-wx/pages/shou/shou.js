const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 1,
    currentScroll: "",
    product: [],
    city:"北京",
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    index: 1
  },
  details: function () {
  
    wx.navigateTo({
      url: "../productDetails/productDetails",

    })
  },
  goCity:function(){
    wx.navigateTo({
      url: "../location/location",

    })
  },
  default1: function (e) {
    console.log(e)
    this.setData({
      index: e.currentTarget.dataset.index,
      currentScroll: ""
    })

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
  sale: function (e) {
    this.setData({
      index: e.currentTarget.dataset.index,
      currentScroll: ""
    });


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
  price: function (e) {
    this.setData({
      index: e.currentTarget.dataset.index,
      currentScroll: ""
    })
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
geter:function(){
  wx.scanCode({
    success: (res) => {
    console.log(1);
   console.log(res)
      wx.showToast({
        title: '成功',
        icon: 'success',
        duration: 2000
      })
    },
    fail: (res) => {
      wx.showToast({
        title: '失败',
        icon: 'success',
        duration: 2000
      })
    },
    complete: (res) => {
    }
  })
},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(app.data.city)
    this.setData({
      city:app.data.city
    })
    wx.getLocation({
      type:"wgs84",
      success: function(res) {
        console.log(res);
        var longitude=res.longitude;
        var latitude=res.latitude;
        
      },
    })

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
    if (app.globalData.userInfo) {
      
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          console.log(res);
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
},
getUserInfo: function (e) {
  console.log(e)
  app.globalData.userInfo = e.detail.userInfo
  this.setData({
    userInfo: e.detail.userInfo,
    hasUserInfo: true
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
    console.log(classId)
    var that = this;
    var arr = that.data.product;
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})