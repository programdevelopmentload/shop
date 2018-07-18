//分类渲染 

var localhost = 'http://172.16.41.23:8007'
var checkClass_url =localhost +'/goods/check/checkClass '
var checkBrand_url = localhost+'/goods/check/checkBrand'

function checkClass(){
    $.ajax({
        type: "post",
        url:checkClass_url,
        dataType: "json",
        success:function(res){
            var data=res.data;
            var html = '';
            var html='<span class="moldClass_all moldClass_active">全部</span>'
            for(var i = 0; i<data.length;i++){
                html+='<span>'+ data[i].name+'</span>'
            }
            $('.model_checkClass').html(html)
        },
        error:function(){}
    })
}
checkClass()

// 渲染品牌分类
function checkBrand(){
    $.ajax({
        type: "post",
        url:checkBrand_url,
        dataType: "json",
        success:function(res){
            console.log(res)
            var data=res.data;
            var html = '';
            var html='<span class="moldClass_all moldClass_active">全部</span>'
            for(var i = 0; i<data.length;i++){
                html+='<span>'+ data[i].nameCh+'</span>'
            }
            $('.moldClass_brand').html(html)
        },
        error:function(){}
    })
}
checkBrand()








//分页渲染
//
var _nowPage = 1;
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    searchPage();
    $('.pageSize_switch').on('change', function () {
        searchPage();
    })
});
function searchNowPage() {//首次两参进入
    var a;
    a = pagination.returnParams();
    _nowPage = a.currentPageNo;
};

function searchPage(page) {//首次两参进入
    pagination.search(getParams(), page);
}


/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */

var localhost = 'http://172.16.41.23:8007';
var model_brand = localhost +'/goods/spu/showAll'

var pagination = new Pagination(model_brand, "page", function (data) {
    fillTableData(data)
});


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
            var html = '';
            for (var i = 0; i < data.length; i++) {
                html+='<tr>'
                html+='<td class="new_model">' +data[i].model +'</td>'  //型号
                html+='<td>'+data[i].leafClassName+'</td>' //所属分类
                html+='<td>'+data[i].brandName+'</td>'//所属品牌
                html+='<td>'+ getNowFormatDate(data[i].createTime)+'</td>' //添加时间
                html+='<td>标准型号</td>' //添加时间
                html+='</tr>'
            }
            content.append(html)          
}