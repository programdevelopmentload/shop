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
        doc+='<td>标准型号</td>'   //操作

       
    }
    content.append(doc)
}





