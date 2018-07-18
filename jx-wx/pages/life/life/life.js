Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[{
      'imgup':'../../img/down.png','textup':'了解更多','classup':'detail2'
    }, {
      'imgup': '../../img/down.png', 'textup': '了解更多', 'classup': 'detail2'
      }, {
        'imgup': '../../img/down.png', 'textup': '了解更多', 'classup': 'detail2'
      }]
  },
show:function(e){
console.log(e);
var index = e.currentTarget.dataset.index;
console.log(index);
var that=this;
var text=this.data.list[index].textup;
if(text=="了解更多"){
  this.data.list[index].textup="收起";
  this.data.list[index].imgup = "../../img/up.png";
  this.data.list[index].classup = "detail";
}else{
  this.data.list[index].textup = "了解更多";
  this.data.list[index].imgup = "../../img/down.png";
  this.data.list[index].classup = "detail2";
}
this.setData({
  list:that.data.list
})
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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