$(function () {

    //nav_Common_fun("业务区域");
    searchPage();

});

/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */
//var localHost = "http://172.16.40.239:8008";
var localHost=getBaseUrl('ys');
var regionUrl = localHost+'/region/findSelectToServerRegion';

var pagination = new Pagination(regionUrl, "page", function (data) {
    fillTableData(data)
});

var _nowPage = 1;

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
    //var  _pageSize = $('.pageSize_switch').val();
    //var keyWord = $.trim($("#formGroupInputLarge").val());
    var params = {
        'pageSize':20
  
        };
    return params;
};

/** table数据 */
function fillTableData(res){
    console.log(res)
    if (res.length=="null") {
         $("#pic_no").show();
        $("#table_data").hide();
        $(".leftBottom").hide();
        return false;
    }else{
        $("#pic_no").hide();
        $("#table_data").show();
        $(".leftBottom").show();
    var tr = "tr";
    var content = $("#table_data tbody");
    content.html("");
    var doc = '';
    for (var i = 0; i < res.length; i++) {
         doc+='<tr>'
         doc+='<td>'+res[i].provinceName+'</td>';
         doc+='<td>'+res[i].cityName+'</td>'
         doc+='<td>'+res[i].createTime+'</td>'
        doc+='</tr>'
        }
     content.append(doc)
    }
}
