var localHtttp = 'http://172.16.40.134:8003';
//分页
var uMverify_PageUrl = localHtttp + "/seller/examineAndVerifyRecord";
$.sidebarMenu($('.sidebar-menu'));
var _applyType = $.getUrlParam("applyType");
_applyType = 0;
$(function () {
    function grade_Rename(obj) {
        $this = $(obj);
        console.log($this.data("id"));
    };
    initPage();
    $(".vwait_queryBtn").on("click",function () {
        initPage();
    })
    function initPage(){
        var _keyword = $('.uMverify_wait_keyWord').val();
        var arr2= [{
            field: 'account',
            title: '商家账号',
            width: '15%',
            valign: "middle",
            align: "center"
        }, {
            field: 'phoneNum',
            title: '手机号',
            width: '15%',
            valign: "middle",
            align: "center"
        }, {
            field: 'applyType',
            title: '申请类型',
            width: '20%',
            align: "center",
            valign: "middle"

        }, {
            field: 'applyTime',
            title: '申请时间',
            width: '20%',
            align: "center",
            valign: "middle"

        }, {
            field: 'applyState',
            title: '审核状态',
            width: '20%',
            align: "center",
            valign: "middle"

        }, {
            field: 'companyId',
            title: '操作',
            width: '40%',
            align: "center",
            valign: "middle",
            formatter: function (value, row, index){ // 单元格格式化函数
                var text = '<a href=' + value + '"../../html/seller_verify/qualifications_verify_detail.html?id=">立即审核</a>';
                return text;
            }
        }];
        $.ajax({
            type: "POST",
            url: uMverify_PageUrl,
            data:{
                applyType:_applyType,
                currentPage:1,
                keyword:_keyword
                // pageSize:8
            },
            dataType:'json',
            success:function (res){
                var arr =[];
                var data=res.data.items;
                for(var i=0;i<data.length;i++){
                    var obj={};
                    obj.account=data[i].userName;
                    obj.phoneNum=data[i].phoneNumber;
                    obj.applyType=data[i].applyType;
                    obj.applyTime=data[i].applyTime;
                    obj.applyState=data[i].evaState;
                    obj.companyId=data[i]. companyId;
                    arr.push(obj);
                };
                table(arr2,arr);
            }
        });
    }
    function table(str,arr){
        $('#qua_noLog_box').bootstrapTable('destroy').bootstrapTable({
            url: '',
            method: 'post',
            contentType: "application/x-www-form-urlencoded",//必须要有！！！！
            striped: true, //是否显示各行变色
            /* pageSize: "5",*/
            pagination: true, // 是否分页
            pageNumber: 1,  //如果设置了分页，首页页码
            paginationPreText: '上一页',
            paginationNextText: '下一页',
            showPaginationSwitch: false,//是否显示数据条数选择框
            queryParams: '',//请求服务器时所传的参数
            clickToSelect: true,//是否启用点击选中行
            pageSize: 2,///如果设置了分页，页面数据条数
            pageList: [5, 15, 20, 25],//如果设置了分页，设置可供选择的页面数据条数。设置为All 则显示所有记录 ,这个接口需要处理bootstrap table传递的固定参数,并返回特定格式的json数据
            paginationHAlign: 'right',// //设置分页条的位置
            sidePagination: "client",
            sortName: 'start_time', // 要排序的字段
            sortOrder: 'asc',
            cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            columns:str,
            data:arr
        });
    };
});














/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */

// var pagination = new Pagination(uMverify_PageUrl, "page", function (data) {
//     fillTableData(data)
// });
//
// function searchPage(page) {//首次两参进入
//     pagination.search(getParams(), page);
// }
//
// /** 得到搜索条件的json对象 */
// function getParams() {
//     var _pageSize = +$('.pageSize_switch').val();
//     var _keyword = $('.uMverify_wait_keyWord').val();
//     var params = {
//         'applyType': 0,
//         'keyword':_keyword,
//         'pageSize': _pageSize
//         // 'currentPage': 1,
//     };
//     return params;
// };
//
// /** table数据 */
// function fillTableData(data) {
//     debugger;
//     if (data.length == 0) {   //没有资源时
//         $("#pic_no").show();
//         $(".pageSize_switch_con").hide();
//         $("#table_data").hide();
//         $(".leftBottom").hide();
//     } else {
//         $("#pic_no").hide();
//         $("#table_data").show();
//         $(".leftBottom").show();
//         var tr = "tr";
//         var content = $("#table_data tbody");
//         var content1 = $(".sky");
//         content.html("");
//         for (var i = 0; i < data.length; i++) {
//             debugger;
//             content.append(
//                 // '<a>跳转到'+data[i].param+'这里</a>'
//                 '<tr data-id="' + '">' +
//                 '<td>' + data[i].userName + '</td>' +       //商家账户
//                 '<td>' + data[i].phoneNumber + '</td>' +       //手机号
//                 '<td>' + data[i].applyType + '</td>' +       //申请类型
//                 '<td>' + data[i].applyTime + '</td>' +       //申请时间
//                 '<td>' + data[i].evaState + '</td>' +       //申请时间
//                 '<td data-id="' + data[i].id + '" data-state="' + data[i].state + '" data-name="' + data[i].name + '">' + ' <a class="_look sm btn-sm btn-primary" href="./qualifications_verify_detail.html?id=' + data[i].companyId + '">立即审核</a></td>' +       //操作
//                 '</tr>'
//             );
//         }
//         ;
//     }
// };
