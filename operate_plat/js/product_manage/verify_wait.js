var renameFlag = false;
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    //测试前进回退
    // $('.moon').click(function () {
    //     window.location.href="http://localhost:63342/operate_plat/html/Category_manage/backstage_everyGrade_detail.html";
    //     // window.location.href='www.baidu.com';
    // })
    //模拟按钮事件绑定

    searchPage();
    // $('.pageSize_switch').on('change', function () {
    //     searchPage();
    // })
});

/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */
//http://172.16.41.23:8001//goods/check/showAllCheck
var localHttp=getBaseUrl('1');
    var listUrl =localHttp +'/goods/goods/check/showAllCheck';
var pagination = new Pagination(listUrl, "page", function (data) {
    fillTableData(data)
});

function searchPage(page) {//首次两参进入
    pagination.search(getParams(), page);
}

/** 得到搜索条件的json对象 */
function getParams() {
    var dates_end1 = $("#dates_end1").val();  //结束时间
    var dates_start1 = $("#dates_start1").val() //开始时间
    var vwait_text = $(".vwait_text").val();    //关键字
    //console.log(dates_end1 + dates_start1 + vwait_text);
    if (dates_start1 !="" && dates_end1=="") {
         alert("日期请填写完整");
         return false
    }
     
        var params = {
                // 'currentPage': 1,
                'pageSize': 3,
                 'state' : 0,
                 'key':vwait_text,
                 "startTime":dates_start1,
                 "endTime":dates_end1
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
            doc +='<tr>'+'<td colspan="5" style="text-align:left">'+ data[i].brandName +'-'+data[i].leafClassName + '-'+data[i].model+ '</td>' +'</tr>';
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
// function fillTableData(data) {
//         console.log(data)
//         var tr = "tr";
//         var content = $("#table_data tbody");
//         content.html("");
//         for (var i = 0; i < data.length; i++) {
//             if (data[i].flag != 0) {
//                 content.append(
//                     // '<a>跳转到'+data[i].param+'这里</a>'
//                     '<tr data-id="' + '">' +
//                     '<td>' + data[i].leafClassName + '</td>' +       //商家信息
//                     '<td>' + data[i].publisher + '</td>' +           //申请商家
//                     '<td>' + getNowFormatDate(data[i].createTime)+ '</td>' +           //申请时间
//                     '<td>' + ctr_Switch(data[i].state)+ '</td>' +           //审核状态
//                     '<td>' + '<a href="./verify_wait_detail.html?id=' +data[i].id + '&state=' + data[i].state+'" >立即审核</a> '+ '</td>' + //操作
//                     '</tr>'
//                 );
//             }
        
//     }
// };
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
$(".vwait_queryBtn").click(function(){
    searchPage();
})







