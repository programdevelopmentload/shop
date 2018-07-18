const app=getApp();
Page({
  data: {
    cateItems: [],
    curNav: 1,
    curIndex: 0
  },
  toast:function(e){
    app.data.classId = e.currentTarget.dataset.id
   
    // console.log(11)
    wx.navigateTo({
      url: "../classify_name/classify_name",
    })
  },
  //事件处理函数  
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值  
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index
    })
  },
onLoad:function(){
  var that=this;
  wx.request({
    url: 'http://172.16.34.37:8007/goods/GoodsClassification/findAllBackClass',
    method: 'POST',
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      console.log(res);
      var data=res.data.data;
      console.log(data)
      var arr=[];
      for(var i=0;i<data.length;i++){
        if (data[i].parentId==0){  //一级
          var obj = {};
          obj.cate_name=data[i].name;
          obj.cate_id=i;
          obj.ishaveChild=true;
          obj.id=data[i].id;
          var arr2 = [];
          for(var j=0;j<data.length;j++){    
            if (data[j].parentId == obj.id) { //二级
              var obj1 = {};
              obj1.child_id=j;
              obj1.id=data[j].id;
              obj1.name=data[j].name;  
              arr2.push(obj1);
              var thirdArr = [];
              for (var k = 0; k < data.length; k++) {
                var obj3 = {};
                if (data[k].parentId == obj1.id) {
                  obj3.id = data[k].id;
                  obj3.name = data[k].name;
                  thirdArr.push(obj3);
                }

              }
              obj1.child = thirdArr;
            }      
          }
          obj.children=arr2;
          arr.push(obj);
       
        }
      }
      console.log(arr)
      that.setData({
        cateItems:arr
      })

    },
    fail:function(e){
      // console.log(e)
    }
  })   
}



})  