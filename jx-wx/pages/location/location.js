// pages/location/location.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    geth:'0',
    shengIndex:0,
    shiIndex:0,
    cityArr:[],
    city_sheng:"北京市",
    city_shi:"北京市"
  },
sheng:function(e){

    this.setData({
      shengIndex:e.currentTarget.dataset.index,
      city_sheng: this.data.cityArr[e.currentTarget.dataset.index].name,
      city_shi: this.data.cityArr[e.currentTarget.dataset.index].shi[0].name
    })
    app.data.city = this.data.cityArr[e.currentTarget.dataset.index].shi[0].name

  },
  shi:function(e){
    this.setData({
      shiIndex: e.currentTarget.dataset.index,
      city_shi: this.data.cityArr[this.data.shengIndex].shi[e.currentTarget.dataset.index].name
   
    })
    app.data.city = this.data.cityArr[this.data.shengIndex].shi[e.currentTarget.dataset.index].name
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    console.log(wx.getSystemInfoSync().windowHeight)
    this.setData({
      geth: wx.getSystemInfoSync().windowHeight
    })
    wx.request({
      url: 'http://172.16.40.239:8008/region/findAllRegionInfo',
      dataType:"json",
      method:"POST",
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        console.log(res);
        if(res.data.success){
          var data=res.data.data;
          console.log(data);
          var arr=[];
            for(var i=0;i<data.length;i++){
            var obj={};
            obj.name=data[i].name;
            obj.id=data[i].id;
            var sarr=[];
            for (var j = 0; j < data[i].regionInfoList.length;j++){
                var sobj={};
                sobj.name = data[i].regionInfoList[j].name;
                sobj.id = data[i].regionInfoList[j].id
                sarr.push(sobj);
            }
            obj.shi=sarr;
            arr.push(obj);
          }
          console.log(arr);
          that.setData({
            cityArr:arr
          })
        }

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
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})