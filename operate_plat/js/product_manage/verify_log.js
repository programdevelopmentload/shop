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
var verify_log = localhost +'/goods/check/showAll'
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
    var key = $("#keyword").val();
    var dates_start1 = $("#dates_start1").val();
    var dates_end1 = $("#dates_end1").val();
    if (dates_start1 != '' &&  dates_end1 =='' ) {
         alert("日期请填写完整！")
         return false;
    }
    var params = {
        'pageSize': 2,
        'key':key,
        "dates_start1":dates_start1,
        "dates_end1":dates_end1
             
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
        if (data[i].flag!=0) {
            var bashChecksLen = data[i].baseChecks;
            //console.log(bashChecksLen.length)
            doc +='<tr>'+'<td colspan="5" style="text-align:left;line-height:35px">'+ data[i].brandName +'-'+data[i].leafClassName + '-'+data[i].model+ '</td>' +'</tr>';
            doc +='<tr>'
            doc +='<td>'
            for (var j = 0; j < bashChecksLen.length; j++) {
                var attributeLen = bashChecksLen[j].attribute;
               doc+='<span>'
               doc+='<img src="'+bashChecksLen[j].pics[0]+'"/>'
               for (var z  = 0; z < attributeLen.length; z++) {

                    doc+=attributeLen[z].value;
               }
               doc+='</span>'
            }
            doc +='</td>'
            doc+='<td>'+data[i].publisher+'</td>'
            doc+='<td>'+getNowFormatDate(data[i].releaseTime)+'</td>'
            doc+='<td>'+ctr_Switch(data[i].state)+'</td>'
            doc+='<td>' + '<a href="./verify_log_Info.html?id=' +data[i].id + '&state=' + data[i].state+'" >查看</a> '+ '</td>'
            doc+='</tr>'
        }
       
    }
    content.append(doc)
}

/*判断审核状态*/
function ctr_Switch(params) {
    console.log(params)
    var str = "";
    if (params == 0) {//0是开启
        str += '草稿';
    } else if (params == 1) {
        str += '待审核';
    }else if(params == 2){
        str += '审核未通过';
    }else if (params == 3){
        str += '审核通过';
    }else{
        str += '已整合'
    }
    return str;
}
// 点击查询获取数据
$(".verifyLog_queryBtn").click(function(){
    searchNowPage(_nowPage) 
    searchPage();
})







