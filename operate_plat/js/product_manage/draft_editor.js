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
var id =getUrlParam("leafClassId");
var draftNumber= getUrlParam("draftNumber");
console.log(draftNumber + id)

// 参数基本信息
// 头部分类
//var localUrl = 'http://172.16.40.153:8007';
var localUrl ='http://172.16.44.14:8007'; //王宣
var localHttp='http://172.16.44.85:8007'; //陶帅江
var showClass_url = localUrl+'/goods/GoodsClassification/showClass' ;//当前类目
var findclass_url=localUrl+'/goods/service/showServiceAndDetailsByleafClassId'; //商品类型 //商品类型
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


//页面回现接口
var findDraftUrl=localHttp+'/goods/draft/operator/findDraft';


//草稿箱
var lo = 'http://172.16.34.227:8007'
var draftUrl = lo+'/goods/draft/operator/draft';

//当前类目 
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

//分类ID
function path(){
    $.ajax({
        url:showClass_url,
        type:"post",
        data:{id:id},
        dataType:"json",
        success:function(data){
            console.log(data);
            $('.classCategory').text(data.data.path)
            // var html = template("seletion_li",data);
            // $('.seletion_li_right').append(html);
        }
    })
}

path();
//右侧信息
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

// //页面回现
function viewDetail(){
   $.ajax({
        url:findDraftUrl,
        type: "POST",
        dataType: "text",
        data:{draftNumber:draftNumber},
        success:function(data){
            var  data=eval('(' + data + ')');
            console.log(data);
            var  brandId =
            // var html = template("goodsIssue",data);
            // $('.goodsRelease').append(html);
        },
        error:function(){
            console.log(342)
        }
   })
}

viewDetail();



























