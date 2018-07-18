// var localHtttp = 'http://172.16.40.134:8003';
var localHtttp = getBaseUrl('yy');
//分页
debugger;
var uMverify_PageUrl = localHtttp + "/user/seller/cautionMoneySettingList";
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

    var _username = $('.account_keyWord').val();
    var _phoneNumber = $('.phone_keyWord').val();
    var _companyName = $('.company_keyWord').val();
    var _companyArea = "";//@
    var _startDate = $('#dates_start1').val();
    var _endDate = $('#dates_end1').val();
    var _state = 1;
    debugger;
    var params = {
        'pageSize': _pageSize,
        // 'pageNum': 1,
        'username': _username,//用户名
        'phoneNumber': _phoneNumber,//手机号
        'companyName': _companyName,//公司名
        'companyArea': _companyArea,//公司所在省份
        'state': _state,//状态
        'startDate': _startDate,//起始时间
        'endDate': _endDate//结束时间
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
                '<td>' + data[i].userInfo.username + '</td>' +       //商家账号
                '<td>' + data[i].userInfo.phoneNumber + '</td>' +   //手机号
                '<td>' + data[i].companyName + '</td>' +       //公司名称
                '<td>' + data[i].companyArea + '</td>' + //所在地区
                '<td>' + data[i].sellerImage.evaTime + '</td>' +       //认证时间
                '<td data-id="' + data[i].id + '" data-name="' + data[i].companyName + '">' + ' <a class="_look sm btn-sm btn-primary" href="./bond_manag_detail.html?id=' + data[i].id + '&log=0">查看</a></td>' +       //操作
                '</tr>'
            );
        }
        ;
    }
};

