//渲染品牌分类

// var localhost = 'http://172.16.41.23:8007'
// var checkClass_url =localhost +'/goods/check/checkClass '
// var checkBrand_url = localhost+'/goods/check/checkBrand'

// function checkBrand(){
//     $.ajax({
//         type: "post",
//         url:checkBrand_url,
//         dataType: "json",
//         success:function(res){
//             var data=res.data;
//             console.log(data)
//             var html = '';
//             for(var i = 0; i<data.length;i++){
//                 html+='< data-id="'+ data[i].id+' " value=" '+data[i].nameCh +'" >'+ data[i].nameCh+'</option>'
//             }
//             $('.add_brand').html(html)
//         },
//         error:function(){}
//     })
// }
// checkBrand()


// // 渲染叶子分类
// function checkClass(){
//     $.ajax({
//         type: "post",
//         url:checkClass_url,
//         dataType: "json",
//         success:function(res){
//             console.log(res)
//             var data=res.data;
//             var html = '';
//             for(var i = 0; i<data.length;i++){
//                 html+='<option dataId = "'+ data[i].id+'" value=" '+data[i].name +'">'+ data[i].name+'</option>'
//             }
//             $('.add_checkClass').html(html)
//         },
//         error:function(){}
//     })
// }
// checkClass()



 //判断顶部是否显示更多更少按钮
    judgeSwitch_ishave();
    topArea_active();

// // 分页管理
var renameFlag = false;
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    searchPage();
});

/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */

// 分页地址
var localhost = 'http://172.16.41.23:8007'
var verify_log = localhost +'/goods/check/showModelBrandClass'
var pagination = new Pagination(verify_log, "page", function (data) {
    fillTableData(data)
});
var _nowPage = 1

function searchPage(page) {//首次两参进入
    pagination.search(getParams(), page);
}

function searchNowPage() {//首次两参进入
    var a;
    a = pagination.returnParams();
    _nowPage = a.currentPageNo;
    debugger;
};

/** 得到搜索条件的json对象 */
function getParams() { 

    var params = {
        'pageSize': 3
        };
    return params;
};

/** table数据 */
function fillTableData(data){
    console.log(data);
    var tr = "tr";
    var content = $("#table_data tbody");
    content.html("");
    var doc = '';
    for (var i = 0; i < data.length; i++) {
        doc+='<tr>'
        doc+='<td class="oleModel">' + data[i].model+'</td>' //型号
        doc+='<td>' + data[i].leafClassName+'</td>' //所属分类
        doc+='<td>' + data[i].brandName+'</td>' //所属品牌
        doc+='<td>' + getNowFormatDate(data[i].createTime)+'</td>'   //添加时间
        doc+='<td class="audits" data-model="'+ data[i].model+'"  data-id="'+ data[i].id+' "  data-leafClassName= "'+data[i].leafClassName+'"  data-brandName= "'+data[i].brandName+'" data-leafClassId="'+ data[i].leafClassId+ ' " data-brandId="'+data[i].brandId+' " onclick="audit(this)">审核</td>'   //操作

       
    }
    content.append(doc)
}



//tab 切换 
$('.uls span').click(function(){
    var index = $(this).index();
    $('.new_model').eq(index).show().siblings().hide();
    $(this).addClass('actived').siblings().removeClass('actived')
})

//点击标准型号路径
var  createSpu_url = localhost+ '/goods/check/createSpuId';
var findByClassIdBrand_url = localhost+'/goods/spu/findByClassIdBrandId';


// 点击归档型号确认按钮
var updateClassBrand_url = localhost+'/goods/check/updateClassBrandModel'

function audit(obj){
    var $this = $(obj)
   $('.mask').show();
    //获取ID 叶子类名 品牌名  新型号 当前的型号
    var dataID= $this.attr('data-id');
    var leafClassName = $this.attr('data-leafClassName');
    var brandName = $this.attr('data-brandName');
    var model = $this.attr('data-model');
    var oldMoelType = $this.parent().find('.oleModel')
    var leafClassId = $this.attr('data-leafClassId')
    var brandId  = $this.attr('data-brandId')
   

    var newModelType = $('#newType_model').val();

    $('.curr_model').text(model)
    $('.curr_brank').text(brandName)
    $('.curr_leafClass').text(leafClassName);
    
    $('#newType_model').change(function(){
        var thisVal = $(this).val();
        $('.curr_model').text(thisVal);
        oldMoelType.text(thisVal);
    })
    $('#setUp').click(function(){
        var newModelType = $('#newType_model').val();
        console.log(newModelType)
        $.ajax({
            type:'post',
            dataType:'json',
            data:{goodsCheckId:17,newModel:newModelType},
            url:createSpu_url,
            success:function(data){
                console.log(data);
                alert(data.message);
                $('.mask').hide();
                $('#newType_model').val('');
                searchPage(_nowPage);
                searchNowPage();
            },
            error:function(){
                console.log(12345)
            }
        })
    })

    // 渲染归档型号
    function archive(){
        $.ajax({
            type:'post',
            dataType:'json',
            data:{leafClassId:leafClassId,brandId:brandId},
            url:findByClassIdBrand_url,
            success:function(data){
                console.log(data);
                var html= '';
                for(var i = 0; i <data.length;i++){
                    html+='<li>'
                    html+='<span data-model="'+data[i].spuId+' ">'+data[i].model+'</span>'
                    html+='<input type="radio"  name="typeRadio"/>'
                    html+='</li>'
                }
                $('.model_ul').html(html);
            },

            error:function(){
                console.log(12345999)
            }
        })
    }
    archive();

    //点击归档型号确认按钮

    $('#modelType_btn').click(function(){
        //获取SPUID goodsCheckId
        var spuId = $('.model_ul li').find('input').attr('checked').prev().attr('data-model');
        $.ajax({
            type:'post',
            dataType:'json',
            data:{spuId:spuId,goodsCheckId:17},
            url:updateClassBrand_url,  
            success:function(data){
                console.log(data);
                alert(data.message)
            }
        })

        
    })

} 

// 点击x隐藏弹框
$(".mask_tit_close").click(function(){
    $(".mask").hide();
})



