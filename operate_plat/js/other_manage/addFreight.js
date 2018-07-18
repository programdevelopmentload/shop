$(".colseBtn").click(function(){
	$('.mask').hide();
	str='';
})
var localHttp='http://172.16.44.85:8007';
var findAllBack = localHttp+'/goods/pattern/operator/freight/findClass';

var localHost='http://172.16.38.206:8008';
var addSelectServerRegion = localHost+'/region/addSelectServerRegion';
var regionUrl = localHost+'/region/findSelectToRegion';

//点击spcBtn 的ajax；
//var localTion = 'http://172.16.38.137:8007';
var upsertUrl = localHttp +'/goods/pattern/operator/freight/upsertClass';
var str='';
var checknumber = 0;
//特殊分类
//无传参拉取嵌套层级分类包含信息
function category_threePull() {
    var dataJson = {};
    $.ajax({
        type: "post",
        url: findAllBack,
        dataType: "json",
        // data: params,
        success: function (res) {
            console.log(res);
            if (res.success == true) {
                var arr = [];//空数组
                var data = res.data;//提取数组
                for (var i = 0; i < data.length; i++) {

                    // if(data[i].level === 3){
                    //     if(data[i].check == 1){
                    //         checknumber+=1;
                    //         console.log(checknumber,data[i])
                    //     }
                    // };
                    if (data[i].parentId == 0) {
                        var obj = {};//存储所有一级的键值对
                        obj.id = data[i].id;
                        obj.name = data[i].name;
                        var secondArr = [];
                        for (var j = 0; j < data.length; j++) {
                            if (data[j].parentId == obj.id) {
                                var obj2 = {};
                                obj2.id = data[j].id;
                                obj2.name = data[j].name;
                                //存储新对象进入每一个一级目录中
                                secondArr.push(obj2);
                                var thirdArr = [];
                                for (var k = 0; k < data.length; k++) {

                                    var obj3 = {};
                                    if (data[k].parentId == obj2.id) {
                                        obj3.id = data[k].id;
                                        obj3.name = data[k].name;
                                        obj3.isCheck=data[k].isCheck;
                                        thirdArr.push(obj3);


                                    }

                                }
                                obj2.child = thirdArr;
                            }

                            //遍历3级菜单；
                        }
                        obj.child = secondArr;
                        arr.push(obj);
                    }
                }
                ;
                dataJson.options = arr;
                console.log(dataJson)
                var html = template("belong_box", dataJson);
                $('.countFreight').html(html);
               
            } else {
            }
        },
        error: function () {
        }
    });

}
category_threePull()

// 点击设置特殊商品 
$('.spcGoods').click(function(){
	 $('.mask').show();
	 $('.spcSet').show();
	 $('#area').hide();
	 $('.businessArea').hide();

})
//获取叶子分类的 id
// $('.leaf').click(function(){
//     //获取以选中的val ；
//     if($(this).find('input').hasClass('check')){
//         $(this).find('input').removeClass('check');
//     }else {
//         $(this).find('input').addClass('check');
//     }
//
//
//   // str +=$(this).find('input').val()+',';
// })



// 点击特殊商品商品设置时
$('#sureSpc').click(function(){
	 $('input[name="radio"]').removeAttr('disabled');
	 //str =str.substring(0,str.length-1);
    //console.log(checknumber,'asdasda');
    $.each($('.leaf input:checked'),function (i,v) {
        if($(v).length==0){
            alert('请先选择特殊商品');
        }else{
            str+= $(v).val()+','
        }

    })
    console.log(str)
    $('.mask').hide();
    $.ajax({
        url:upsertUrl,
        data:{clazz:str},
        dataType:'json',
        type:'post',
        success:function(data){
            console.log(data)
            alert('特殊商品设置成功！');
            str='';
        },
        error:function(){
            console.log(423432432)
        }

    })

	 // if (str == '') {
     //
	 // 	return false;
	 // }else{
	 //     str +=$('.leaf').find('input').prop('checked',true).val()+',';



	// }
   	 
	 
	//console.log(str)

})




function trigger(a){
      $(a).next().toggle();
   }
// 渲染页面 
function checkedlength(t){
    var $this = t;
    var Iput = $this.parent().parent().parent().find('p');
    var Icheck =  $this.parent().parent().parent().find('.checked');
    var parentName =  $this.parents('.trigger_click').siblings().find('span').text();
    var parentId = $this.parents('.trigger_click').siblings().find('input').attr('area');
    $this.parent().parents('li').find('i').css('color','red');
    $this.parent().parents('li').find('i').html('('+Icheck.length+')');

    //console.log(parentId + parentName)
    //console.log( $this.parents('.trigger_click').siblings().find('span').text(),Iput.length,Icheck.length);
            if(Icheck.length === 0){
//                          console.log('没有被选中的');
                $this.parents('.trigger_click').siblings().find('input').prop('checked',false);
                $this.parents('.trigger_click').siblings().find('input').prop('disabled',false);
            }else if(Icheck.length === Iput.length){
//                          console.log('被全选了');
                $this.parents('.trigger_click').siblings().find('input').prop('checked',true);
                $this.parents('.trigger_click').siblings().find('input').prop('disabled',true);
            }else{
//                          console.log('正常点选');
                $this.parents('.trigger_click').siblings().find('input').prop('checked',true);
                $this.parents('.trigger_click').siblings().find('input').prop('disabled',false);
            };
}


function jsonData() {
   $.ajax({
      type:'post',
      url:regionUrl,
      //url:'../area.json',
      dataType:'json',
      success:function(data){
        console.log(data);
        var  regionInfo= data.data.regionInfo;
        var selected =data.data.selected;
       //console.log(selected);
           var html='';
           html+=' <div class="area_line clearfix"> <div class="area_right fl"><ul class="clearfix listul">'
           for(var i=0;i<regionInfo.length;i++){
           html+='<li><label><input type="checkbox" area="'+regionInfo[i].id+'" class="inputs"> <span>'+regionInfo[i].name+'</span></label><i class="totle">(0)</i><p class="trigger" onclick="trigger(this)"></p><div class="trigger_click">'
            html+='<ul class="clearfix" class="uls">';
            for(var j=0;j<regionInfo[i].regionInfoList.length;j++){
              //console.log(regionInfo[i].regionInfoList[j].id)
                html+=' <p><label><input type="checkbox" area="'+regionInfo[i].regionInfoList[j].id+'">'+regionInfo[i].regionInfoList[j].name+'</label></p>'
            }
               html+='</ul><label class="close1">关闭</label></div></li>';
              
            
        }   
           html+=' </ul></div> ';
           $('#area').html(html);
           $('.close1').click(function(){
                $(this).parent().toggle();

           });

           $.each($("[area]"), function(i,v) {
                for(var a=0;a<selected.length;a++){
                    if(selected[a].id  == $(v).attr('area')){
                        $(v).prop('checked',true).addClass('checked').addClass('checked1');
                        $(v).parents('.trigger_click').siblings().find('input').prop('checked',true);
                        $(v).attr('disabled',true);
                        checkedlength($(v));
                    }
                };
           });
           $('.trigger_click input').on('click',function(){
                    var $this = $(this);
                    
                    if($this.hasClass('checked')){
                        $this.removeClass('checked');
                    }else{
                        $this.addClass('checked');
                    };
                    checkedlength($this);
           });
          
          
      },
      error:function(){
        console.log('dadas')
      }
   })
           
}



function chooseArea(obj){
    $('.mask').show();
    $('.businessArea').show();
    $('.spcSet').hide();
    $('#area').show();

}
//
// $('.chooesArea').click(function(){
// 	//console.log(3423)
// 	$('.mask').show();
// 	$('.businessArea').show();
// 	$('.spcSet').hide();
// 	$('#area').show();
// })

$('#sureArea').click(function(){
        var regionInfoArr=[];
        var regionInfo=[];
        var arr = [];
        var Inx = 0; //这个是因为获取不到索引0 not.checked1 是从已有选项开始计算
        $.each($('.trigger_click').siblings('label').find('input:checked'), function(i,v) {
         if($(v).parent().siblings('.trigger_click').find('.checked').not('.checked1').length  > 0){
          console.log('带默认项与其他的添加  并且找到选择的市区',$(v).parent().text());
           regionInfo[Inx] = {  //省份
              'name':$(v).parent().text(),
              'id':$(v).attr('area'),
              'regionInfoList':[]
              };
          console.log(Inx)
          regionInfoArr = [];
           $.each($(v).parent().siblings('.trigger_click').find('.checked').not('.checked1'), function(x,y) {
            regionInfoArr[x] = {  //市区
             'name':$(y).parent().text(),
             'id':$(y).attr('area')
            };
            regionInfo[Inx]['regionInfoList'] = regionInfoArr;
           });
           Inx++;
           console.log(regionInfo)//这个是生成最终数据

         }else{
          console.log('只有默认项的省份不添加',$(v).parent().text());
         }
        });
         $.ajax({
               type:'post',
               contentType:'application/json;charest=UTF-8',
               url:addSelectServerRegion,
               data:JSON.stringify(regionInfo),
               dataType:'json',
               success:function(data){
                   console.log(data);
                   alert('添加成功！')

               },
               error:function(data){
               	  alert('请选择正确的省和市！')
                  //console.log(data);
               }
           })
 })
jsonData();

$('.addLine').click(function(){

 	var lineBefor = '<li><span class="chooesArea" onclick="chooseArea(this)">选择区域</span><span class="form-inline"><input type="text" class="form-control"></span></li>';
    $(this).parent().before(lineBefor);

})
