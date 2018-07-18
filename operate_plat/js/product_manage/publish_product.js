//获取url信息 
function getUrlParam(name){ 
    //构造一个含有目标参数的正则表达式对象 
    var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)"); 
    //匹配目标参数 
    var r = window.location.search.substr(1).match(reg); 
    //alert(r); 
    //返回参数值 
    if (r!=null) return decodeURI(r[2]); 
        return null; 
} 
var id =getUrlParam("id");
console.log(id)


// 参数基本信息
// 头部分类

//var localUrl = 'http://172.16.40.153:8002/goods'; //张名言
//var localUrl = 'http://172.16.40.153:8007';
//var localUrl ='http://172.16.38.183:8007'; //王宣

var localUrl = getBaseUrl('w');
//var localHttp = getBaseUrl('t');
var localImg =getBaseUrl('img');
var localHttp='http://172.16.44.85:8007';
var showClass_url = localUrl+'/goods/GoodsClassification/showClass' ;//当前类目

var findclass_url=localUrl+'/goods/service/showServiceAndDetailsByleafClassId'; //商品类型
//获取所属品牌
var findBy=localUrl+'/goods/brand/findByClassIdNoPageOpen';
//获取型号
var modelId =localUrl +'/goods/spu/findByClassIdBrandId';

//商品规格 
var goodsModel =localUrl+'/goods/attribute/findByClassIdNoPage';

//副属性单位
var unitUrl = localUrl+'/goods/unit/showAll';

// 点击提交路径 

var addUrl = localHttp+'/goods/draft/operator/add';

//判断是否重复
var existsUrl = localHttp +'/goods/draft/operator/exists';

var imgUrl =localImg +'/pic/upload'
 
//草稿箱
 var lo = 'http://172.16.44.85:8007'
 var draftUrl = lo+'/goods/draft/operator/draft';

var brandId;
function brandName(){
	$.ajax({
		url:findBy,
		type:"post",
	    data:{classId:id},
	    dataType:"json",
	    success:function(data){
	       console.log(data);
	       var str="";
	        for(var i=0;i<data.data.length;i++){
	            str+='<option data-value='+data.data[i].id+'>'+data.data[i].nameCh+'</option>'
	        }

	        $("#ss_brand").html(str);
	        console.log(brandId);
            brandId=$('#ss_brand').find("option:selected").attr("data-value");
            $.ajax({
                url:modelId,
                type:"post",
                dataType:"json",
                data:{
                    leafClassId:id,
                    brandId:brandId
                },
                success:function (data) {
                    console.log(data);
                    var doc = '';
                    for(var i=0;i<data.data.length;i++){
                        doc+='<option data-spuId="'+data.data[i].spuId+'"  value='+data.data[i].model+'>'+data.data[i].model+'</option>'
                        //$(".type").append("<option>"+data.data[i].model+"</option>")
                    }
                    $('.type').html(doc);
                }
            })

	        //getType(data.data[0].id);
	    },
        error:function () {
            
        }
	})
}
brandName();
$("#ss_brand").blur(function () {
    typeName()
})
function typeName() {
     brandId=$('#ss_brand').find("option:selected").attr("data-value");
    $.ajax({
        url:modelId,
        type:"post",
        dataType:"json",
        data:{
            leafClassId:id,
            brandId:brandId
        },
        success:function (data) {
            console.log(data);
            var doc = '';
            for(var i=0;i<data.data.length;i++){
 				doc+='<option data-spuId="'+data.data[i].spuId+'"  value='+data.data[i].model+'>'+data.data[i].model+'</option>'
            //$(".type").append("<option>"+data.data[i].model+"</option>")
            }
           $('.type').html(doc);
        }
    })
}
typeName()
//  改变判断 品牌
// $("#ss_brand").blur(function () {
//
//     var brandId=$(this).find("option:selected").attr("data-value");
//     console.log(brandId);
//     //getType(brandId)
//     $.ajax({
//         url:modelId,
//         type:"post",
//         dataType:"json",
//         data:{
//             leafClassId:id,
//             brandId:brandId
//         },
//         success:function (data) {
//             console.log(data);
//             var doc = '';
//             for(var i=0;i<data.data.length;i++){
//  				doc+='<option data-spuId="'+data.data[i].spuId+'"  value='+data.data[i].model+'>'+data.data[i].model+'</option>'
//             //$(".type").append("<option>"+data.data[i].model+"</option>")
//             }
//            $('.type').html(doc);
//         }
//     })
// });


//分类ID
function path(){
	$.ajax({
		url:showClass_url,
		type:"post",
	    data:{id:id},
	    dataType:"json",
	    success:function(data){
	    	console.log(data.data.path)
	    	$('.classCategory').text(data.data.path);
	    }

	})
}

path();

function right_select(){
    $.ajax({
    url:findclass_url,
    type:"post",
    data:{ leafClassId:id},
    dataType:"json",
    success:function (data) {
       console.log(data);
       //console.log(342)
             var html = template("seletion_li", data);
             $('.seletion_li_right').append(html);
    }

})
}
right_select()


// 商品详情上传图片
//
function upDetail(file) {
    var formData = new FormData();
    formData.append('uploadFile', file.files[0]);
    var  fileSize =file.files[0].size;
    var totleSize = 3*1024*1024;
    if (fileSize > totleSize) {
         alert('图片大小不能出超过 3M 哦！');
         return false;
     }
    $.ajax({
        url: imgUrl,
        type: "post",
        processData: false,
        contentType: false,
        dataType: "json",
        cache: false,
        data: formData,
        headers: {
            Authorization:localStorage.getItem("token"),
        },
        success: function (res) {
            if(res.errorCode==9527){
                window.location.href="../../login.html";
            }else{
                console.log(res)
                $("#detail_img").append("<div class='detail_img'><img src='"+res.data.ip+res.data.url+"'  data-url='"+res.data.url+"'   alt=''><span onclick='deleteDetail()'>删除</span></div>");
                $(".add_product_img").css("display", "none");
                console.log($('.detail_img img').attr('src'))
            }


        },
        error: function (err) {
            //console.log(err)
        }
    })
}

//删除图片 重新上传
function deleteDetail() {
    $(".detail_img").remove();
    $(".add_product_img").css("display", "block");
}

// 点击添加表格
var num=0;
 $(".table_left .jia").click(function () {
 	num++;
    $(".table_left tbody").append("<tr><td><input type='text' placeholder='请输入' maxlength='8' class='goods"+num+" form-control'></td><td><input type='text' class='nums"+num+" form-control' placeholder='请输入'></td></tr>")
});
$(".table_right .jia").click(function () {
	num++;
    $(".table_right tbody").append("<tr><td><input type='text' placeholder='请输入' maxlength='8' class='acc"+num+" form-control'></td><td><input type='text' placeholder='请输入' class='accnums"+num+" form-control' ></td></tr>")
});

//生成所有属性；
function allAttr(){
 	$.ajax({
        url: goodsModel,
        data: {classId:id },
        type:"post",
        dataType: "json",
        success:function(data){
              console.log(data.data);
            $.each(data.data,function(i,v){

                var html
                if(v.type == 0){
                     html = '<p class="form-group form-inline"><input type="checkbox" name=""><label data-id="'+v.id+'">*'+v.name+'</label><input type="text" maxlength="8" class="form-control" name=""></p>';
                    //主属性
                    $('.attr_product').prepend(html);
                    $('.add_attr_product').click(function(){ //点击加号复制数据
                        $(this).before(html)
                    });

                }else if(v.type == 1){
                    //副属性
                            var clonediv,fsxarr=[];
                            html = '<p class="form-group form-inline"><input type="checkbox" name=""><label data-id="'+v.id+'">*'+v.name+'</label><input type="text" maxlength="8" class="form-control" name=""><select class="form-control selecttd"></select></p>';
                            $('.attr_assistant').prepend(html);
                            //添加结构
                            $.ajax({
                                type:"post",
                                url:unitUrl,
                                success:function(data){
                                    $('.attr_assistant .form-control').html('');
                                    $.each(data.data,function(i,v){
                                        fsxarr.push(v.unit);
                                        $('.attr_assistant .form-control').append('<option value="'+v.unit+'">'+v.unit+'</option>');
                                    });
                                }
                            });
                            //请求select
                            //添加新的行
                            $('.add_attr_assistant').click(function(){
                                $(this).before(html);
                                $('.attr_assistant .form-control').html('');
                                        $.each(fsxarr,function(i,v){
                                            $('.attr_assistant .form-control').append('<option>'+v+'</option>');
                                        });
                            });
                            
                }else{
                     if (v.necessary == 0){
                         html ='<li class="form-group form-inline"><label data-id="'+v.id+'" >*'+v.name+':</label><input type="text" maxlength="8" class="form-control" data-necessary ="'+v.necessary +'"></li>';
                     }else{
                         html ='<li class="form-group form-inline"><label data-id="'+v.id+'">'+v.name+':</label><input type="text" maxlength="8" class="form-control"></li>';
                     }

                    $(".key").prepend(html);
                }
            })
        }
    });
}
   
allAttr();
function addImg(a) {

    var html = $(a).parent(".addimg").prev().find(".checkbox").eq(0).clone(true);

    $(a).parent().prev().append(html)
}

function product_type(obj){
    var num1=$('.attr_product input:checked').length,num2=$('.attr_assistant input:checked').length;
    var data_id = $('.attr_product label').attr('data-id');
    var attr_assistan_id = $('.attr_assistant label').attr('data-id');
    var html = '';
    $('.product_type').find('span').eq(0).html(num1);
    $('.product_type').find('span').eq(1).html(num2);
    $('.product_type').find('span').eq(2).html(num1*num2);
    //主副属性计算  同时底部做添加
    $('.sales_uls').html('')
    $.each(obj, function(i,v) {
        //console.log(obj);
        //console.log(i); //主属性
        //console.log(v); //副属性
        $('.parent_setting').html('')
        $.each(v, function(x,y) {
            //console.log(y)
            html +='<li><i>X</i><span> <a href="javascript:;" data-id="'+data_id+'">'+i+'</a> <a href="javascript:;" data-id="'+attr_assistan_id+'">'+y+'</a></span><span class="add_reat"><img src="../../images/a11.png" class="imgUp" >  <input type="file" onchange="upFile(this)" accept="image/jpg,image/jpeg,image/png,image/bmp" multiple  class="imgUpLoad"></span></li>'
        });
    });
    $('.sales_uls').append(html);
    $('.sales_uls i').on('click',function(){
        $(this).parent().remove();
        $('.parent_setting').html('')
    })
};

//绑定需要确认一下  不然很别扭 
$('.product_sku').click(function(){
    $('.parent_setting').text(' ');
    var obj= {},arr1=[];
    var specificationsParams =[]; 
    var newObj={}
    $('.attr_product input:checked').each(function(i,v){
        obj[$(v).siblings('input').val()] = i ;  //获取到 值
        arr1=[];
        $.each($('.attr_assistant input:checked'), function(x,y) {
                arr1.push($(y).siblings('input').val()+' '+'<a href="javascript:;" class="unitMasking">'+$(this).siblings('select').find('option:selected').val()+'</a>')
                obj[$(v).siblings('input').val()] = arr1;
            });
            product_type(obj);   
    });
    $.each($('.sales_uls li'),function(){
        var arr = {};
        var goodsAttributeParams = [];
        var type0 = {};
        var type1 = {};
        var pics = [];
            newObj.spuId = Number($('#modelType option:selected').attr('data-spuId')); //型号id
            newObj.leafClassId = Number(id);
            type0.attributeId = Number($(this).find('a').first().attr('data-id'))
            type0.attributeValue = $(this).find('a').first().text();
            //type0.goodsAttributeParams =goodsAttributeParams;
            goodsAttributeParams.push(type0)

            type1.attributeId = Number($(this).find('a').eq(1).attr('data-id'))
            type1.attributeValue = $(this).find('a').eq(1).text();
            type1.unit = $('.unitMasking').text();
            console.log(type1.unit+'副属性单位');
            console.log(type1.attributeValue+'副属性id和值');
            goodsAttributeParams.push(type1)
            // for (var i = 0; i < $(this).find(".imgFiles img").length; i++) {
            //     pics.push($(".imgFiles img").eq(i).attr("data-url"))
            // }

            // arr.pics=pics;
            arr.goodsAttributeParams = goodsAttributeParams;
            specificationsParams.push(arr);

      })
      newObj.specificationsParams =specificationsParams;
        var data = JSON.stringify(newObj);
         console.log(data)
         $.ajax({
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            }, 
             type:'post',
             dataType:'json',
             url:existsUrl,
             data:data,
             success:function(data){
                console.log(data);
                if(data.data != null){
                    $('.parent_setting').text('该商品已存在，请勿重复发布');
                    return false;
                }else{
                      $('.parent_setting').text(' ');
                }  
                
             }
         }) 
    
});


//图片上传
function upFile(file) {
    var fileimg ='';
    var that = $(file);
    var formData = new FormData();
    formData.append('uploadFile', file.files[0]);


    $.ajax({
        url: imgUrl,
        headers: {
            Authorization:localStorage.getItem("token"),
        },
        type: "post",
        processData: false,
        contentType: false,
        dataType: "json",
        cache: false,
        data: formData,
        success: function (res) {
            console.log(res)
            if(res.errorCode==9527){
                window.location.href="../../login.html";
            }else{
                console.log(res);
                fileimg ="<span class='imgFiles'><img src='"+res.data.ip+res.data.url+"' data-url='"+res.data.url+"'  class='imglength'><span class='delete' onclick='removeLi(this)'>删除</span></span>";
                var imgFilesLength = that.parent('.add_reat').find('.imgFiles').length;
                if (imgFilesLength>= 4) {
                    alert('最多只能上传4张。')
                    return false;
                }else{
                    that.before(fileimg);
                }
            }

        },
        error: function (err) {
            console.log(err)
        }
    })
}

function removeLi(obj){
    $(obj).parent().remove();
}   


var userId = userId_getIem()
console.log(userId);
  function appendMsg(msgUrl, state) {
        var obj = {};
        var keyNecessary;
        obj.state = state;
        obj.userId =userId;
        obj.brandName = $('#ss_brand option:selected').text(); //品牌名
        obj.spuId = Number($('#modelType option:selected').attr('data-spuId')); //型号id
        obj.type = Number($('.typeId').attr('data-type')); 
        obj.brandId = Number($('#ss_brand option:selected').attr("data-value"));
        obj.leafClassId=Number(id);
        obj.model=$('.type option:selected').attr("value");

        //obj.level=$('.level').val(); //获取等级值
        //obj.unit=$('.unit').val();  //获取单位值
        obj.goodsDetails = $(".detail_img img").attr("data-url");
        var left_table = $(".table_left tbody input:even");
        var leftTableArr = [];
        for (var i = 0; i < left_table.length; i++) {
            var leftObj = {};
            if($(".table_left tbody input:even").eq(i).val()!==""){
                
                leftObj.partsName = $.trim($(".table_left tbody input:even").eq(i).val());
                leftObj.value = Number($.trim($(".table_left tbody input:odd").eq(i).val()));
                console.log(leftObj.value)
                if (isNaN(leftObj.value)) {
                    alert('配件数量为数字！')
                    leftObj.value = Number($.trim($(".table_left tbody input:odd").eq(i).val('')));
                }
                leftTableArr.push(leftObj);
            }
        }
        obj.parts = leftTableArr;
        var right_table = $(".table_right tbody input:even");
        var rightTableArr = [];
        for (var i = 0; i < right_table.length; i++) {
            var rightObj = {};
            if($(".table_right tbody input:even").eq(i).val()!==""){

                rightObj.packingsName = $.trim($(".table_right tbody input:even").eq(i).val());
                rightObj.value = Number($.trim($(".table_right tbody input:odd").eq(i).val()));
                console.log(rightObj.value)
                if (isNaN(rightObj.value)) {
                    alert('包装数量为数字！')
                    rightObj.value = Number($.trim($(".table_right tbody input:odd").eq(i).val('')));
                }
                rightTableArr.push(rightObj);
            }
        }
        obj.packings = rightTableArr;
        obj.buyInstructions=$.trim($('#text').val());
        //params.   attributeId  attributeValue
         var params=[];
         if ($('.key label').length !=0) {
       
            $.each($('.key label'),function(){
              var attributeId={};
              attributeId.attributeId =Number($(this).attr('data-id'));
              keyNecessary = $(this).siblings().attr('data-necessary');
              if (keyNecessary !=undefined ){
                  $(this).siblings().addClass('ac')
              }
              console.log(keyNecessary);

              attributeId.attributeValue = $.trim($(this).next().val()); //获取关键属性值
              console.log(attributeId.attributeValue)
              console.log(attributeId.attributeId)
              params.push(attributeId);

            })
            obj.params =params;
         }else{
            console.log(32423)
         }
          
       
         

         //specificationsParams goodsAttributeParams attributeId attributeValue unit pics[]
          var specificationsParams =[];
          var liLength
          $.each($('.sales_uls li'),function(i,v){
              console.log($('.sales_uls li').length)
            var arr = {};
            var goodsAttributeParams = [];
            var type0 = {};
            var type1 = {};
            var pics = [];
                type0.attributeId = Number($(this).find('a').first().attr('data-id'))
                type0.attributeValue = $(this).find('a').first().text();
                //type0.goodsAttributeParams =goodsAttributeParams;
                goodsAttributeParams.push(type0)

                type1.attributeId = Number($(this).find('a').eq(1).attr('data-id'))
                type1.attributeValue = $(this).find('a').eq(1).text();
                type1.unit =$(this).find('a').eq(2).text();
                console.log(type1.unit+'副属性单位');
                goodsAttributeParams.push(type1)

              liLength = $(v).find($('.add_reat span img'))
                $.each(liLength,function (z,j) {
                    console.log($(j))
                    var imgFiles = $(v).find($(j)).attr("data-url");
                    console.log(imgFiles);
                    pics.push(imgFiles);
                    
                })
                arr.pics=pics;
                arr.goodsAttributeParams = goodsAttributeParams;
                specificationsParams.push(arr);

          })
          
        obj.specificationsParams =specificationsParams;
        var data = JSON.stringify(obj);
          if ($('#ss_brand option:selected').val() != '' && $('.type option:selected').val() != '' && $('.ac').val() != ''){
              $.ajax({
                      headers:{
                          'Accept':'application/json',
                          'Content-Type':'application/json'
                      },
                      url:msgUrl,
                      type: "POST",
                      dataType: "json",
                      //contentType:"application/json",
                      data:data,
                      success:function(data){
                          console.log(data)
                          if (data.success== true) {
                              if(state ==0){
                                  debugger;
                                  console.log("已提交")
                                  window.location.href='./publish_success.html?id='+id
                              }else if (state ==1){
                                  console.log("保存到草稿箱")
                                  window.location.href='./draft_success.html?id='+id
                              }else{
                                  alert('带*标示的数据请填写完整')
                              }
                          }


                      },
                      error:function(data){

                          if(data.errorCode == 1012){
                              console.log(data.errorCode)
                              $('.parent_setting').text('该商品已存在，请勿重复发布');
                          }else{
                              alert('带*标示的数据请填写完整');
                          }

                          console.log(data)

                      }


                  })
          }else{
              alert('数据填写完整')

              // $.ajax({
              //     headers:{
              //         'Accept':'application/json',
              //         'Content-Type':'application/json'
              //     },
              //     url:msgUrl,
              //     type: "POST",
              //     dataType: "json",
              //     //contentType:"application/json",
              //     data:data,
              //     success:function(data){
              //         console.log(data)
              //         if (data.success== true) {
              //             if(state ==0){
              //                 debugger;
              //                 console.log("已提交")
              //                 window.location.href='./publish_success.html?id='+id
              //             }else if (state ==1){
              //                 console.log("保存到草稿箱")
              //                 window.location.href='./draft_success.html?id='+id
              //             }else{
              //                 alert('带*标示的数据请填写完整')
              //             }
              //         }
              //
              //
              //     },
              //     error:function(data){
              //         alert('请填写完整的数据');
              //         //console.log(234343);
              //         console.log(data)
              //
              //     }
              //
              //
              // })
          }

        
        console.log(data)
       
        return obj;
        
        
    }
$('#goods_btn').click(function () {
      appendMsg(addUrl,0)
      //window.location.href='./publish_success.html?id='+id+''

  });

$('.draft').click(function(){
    //console.log(draftUrl)
    appendMsg(draftUrl,1)
    //window.location.href='./draft_success.html?id='+id+''
})


// function setIframeHeight(height){
//  height = height+20;
//  $("#iframemainbox").css("height",height);
//  $("#iframemain").css("height",height);
// }
//window.parent.setIframeHeight(document.body.scrollHeight);
