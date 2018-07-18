var renameFlag = false;
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    nav_Common_fun("员工列表");
    searchPage();
});
var _nowPage = 1

/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */
//http://172.16.41.23:8001//goods/check/showAllCheck

//var localhost = 'http://172.16.41.184:8002/user'
//var localhost='http://172.16.40.134:8002/user';
var  localhost = getBaseUrl('lh');
var staff_add = localhost +'/user/platForm/unsettled'




var pagination = new Pagination(staff_add, "page", function (data) {
    fillTableData(data)
});

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
    var pageSize= +$('.pageSize_switch').val(); 
    var keyWord = $.trim($("#staff_key").val());
    var params = {
        'pageSize':pageSize,
        'inWords':keyWord
             
        };
    return params;
};

/** table数据 */
function fillTableData(data){
    console.log(data);
    debugger;
    var tr = "tr";
    var content = $("#table_data tbody");
    content.html("");
    var doc = '';
    for (var i = 0; i < data.length; i++) {
            doc+='<tr>'        
            doc+='<td>'+data[i].email+'</td>'
            doc+='<td>'+data[i].phoneNumber+'</td>'
            doc+='<td>'+data[i].realName+'</td>'
            doc+='<td>'+ctr_Switch(data[i].isFrozen)+'</td>'
            doc+='<td>'+ '<a href="./staff_management.html?id=' +data[i].id + '" >去分配</a> '+'</td>'
            doc+='</tr>'
       
    }
    content.append(doc)
}

/*判断审核状态*/
function ctr_Switch(params) {
    var str = "";
    if (params == 0) {//0是开启
        str += '待分配';
    } else if (params == 1) {
        str += '已分配';
    }
    return str;
}

$("#staff_sub").click(function(){
    searchNowPage();
    searchPage(_nowPage);
})



