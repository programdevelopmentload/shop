// var localHtttp = 'http://172.16.40.134:8003';
var localHtttp = getBaseUrl('yy');
//分页
var uMverify_PageUrl = localHtttp + "/seller/examineAndVerifyList";
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    searchPage();
    $('.pageSize_switch').on('change', function () {
        searchPage();
    })
    $(".list_query").on("click", function () {
        searchPage();
    })
});

/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */

var pagination = new Pagination(uMverify_PageUrl, "page", function (data) {
    fillTableData(data)
});

function searchPage(page) {//首次两参进入
    pagination.search(getParams(), page);
}

/** 得到搜索条件的json对象 */
function getParams() {
    var _pageSize = +$('.pageSize_switch').val();
    var _keyword = $('.uMverify_wait_keyWord').val();
    var params = {
        'applyType': 0,
        'keyword': _keyword,
        'pageSize': _pageSize,
        // 'pageNum': 1,
    };
    return params;
};

/** table数据 */
function fillTableData(data) {
    debugger;
    if (!data) {   //没有资源时
        $("#pic_no").show();
        $(".pageSize_switch_con").hide();
        $("#table_data").hide();
        $(".leftBottom").hide();
    } else {
        $("#pic_no").hide();
        $("#table_data").show();
        $(".leftBottom").show();
        var tr = "tr";
        var content = $("#table_data tbody");
        var content1 = $(".sky");
        content.html("");
        for (var i = 0; i < data.length; i++) {
            debugger;
            content.append(
                '<tr data-id="' + '">' +
                '<td>' + data[i].userName + '</td>' +       //商家账号
                '<td>' + data[i].phoneNumber + '</td>' +   //手机号
                '<td>' + data[i].userName + '</td>' +       //公司名称
                '<td>' + data[i].managementType + '</td>' + //所在地区
                '<td>资质审核</td>' +       //申请类型
                '<td>' + data[i].applyTime + '</td>' +       //申请时间
                '<td>' + data[i].applyTime + '</td>' +       //审核状态
                '<td data-id="' + data[i].id + '" data-state="' + data[i].state + '" data-name="' + data[i].name + '">' + ' <a class="_look sm btn-sm btn-primary" href="./qualifications_verify_detail.html?id=' + data[i].companyId + '&log=0">立即审核</a></td>' +       //操作
                '</tr>'
                // '<a>跳转到'+data[i].param+'这里</a>'
                // '<tr data-id="' + '">' +
                // '<td>' + data[i].userName + '</td>' +       //商家账户
                // '<td>' + data[i].phoneNumber + '</td>' +   //手机号
                // '<td>' + data[i].userName + '</td>' +       //供应商
                // '<td>' + data[i].managementType + '</td>' + //经营类型
                // '<td>' + data[i].brand + '</td>' +       //主营品牌
                // '<td>' + data[i].applyTime + '</td>' +       //申请时间
                // '<td>' + data[i].Verify + '</td>' +       //审核状态
                // '<td data-id="' + data[i].id + '" data-state="' + data[i].state + '" data-name="' + data[i].name + '">' + ' <a class="_look sm btn-sm btn-primary" href="./qualifications_verify_detail.html?id=' + data[i].companyId + '&log=0">立即审核</a></td>' +       //操作
                // '</tr>'
            );
        }
        ;
    }
};

