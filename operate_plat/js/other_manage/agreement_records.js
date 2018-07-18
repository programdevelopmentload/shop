var renameFlag = false;
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
$(function () {
     searchPage();
     setDateTime();
    $('.pageSize_switch').on('change', function () {
        searchPage();
    })
});
var _nowPage = 1;

/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */
// 分页 
//var localhost = 'http://172.16.39.70:8003';
var localhost=getBaseUrl('y_jl');
//var localhost ='http://172.16.40.134:8002/user'
var recordUrl= localhost + '/agreement/record/list';


var pagination = new Pagination(recordUrl, "page", function (data) {
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
    var username = $.trim($("#userName").val());
    var phoneNum = $.trim($("#telNum").val());
    var  _pageSize = +$('.pageSize_switch').val();
    var params = {
        'pageSize':_pageSize,
        'username':username,
        'phoneNum':phoneNum
             
        };
    return params;
};

/** table数据 */
function fillTableData(data){
    console.log(data);
    if (data== null) {
        $("#pic_no").show();
        $("#table_data").hide();
        $(".leftBottom").hide();
        
    }else{
        $("#pic_no").hide();
        $("#table_data").show();
        $(".leftBottom").show();
    var tr = "tr";
    var content = $("#table_data tbody");
    content.html("");
    var doc = '';
    for (var i = 0; i < data.length; i++) {
            doc+='<tr>'
            doc+='<td>'+data[i].agreementName+'</td>'
            doc+='<td>'+data[i].type+'</td>'
            doc+='<td>'+data[i].contractNum+'</td>'
            // doc+='<td>'+regRef(data[i].regRef)+'</td>'
            doc+='<td>'+data[i].username+'</td>'
            doc+='<td>'+data[i].phoneNum+'</td>'
            doc+='<td>'+data[i].createTime+'</td>' //状态
            doc+='<td data-id="'+data[i].id +'"><a href="./recordsLook.html?id=' +data[i].id + '" >查看</a></td></tr>'
       
    }
    content.append(doc)
    }}


$("#searchBtn").click(function(){
    searchNowPage();
    searchPage(_nowPage);
})





