//分页地址变量
// var localUrl = 'http://172.16.40.60:8011';
var localUrl = getBaseUrl('g');
//优惠券分页地址
var coupon_pageUrl = localUrl + '/promotionserver/list';
var _nowPage = 1,
    _couponName="",
    _couponStartPeriod="",
    _couponEndPeriod="";
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    /**日历组件初始化代码*/
    setDateTime();
    searchPage();
    $('.pageSize_switch').on('change', function () {
        searchPage();
    });
    $('.vwait_queryBtn').on('click',function () {
        searchPage();
    })
});

/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */

var pagination = new Pagination(coupon_pageUrl, "page", function (data) {
    fillTableData(data)
});

function searchPage(page) {//首次两参进入
    debugger;
    pagination.search(getParams(), page);
}

/** 得到搜索条件的json对象 */
function getParams() {
    var pageSize = $('.pageSize_switch').val();
    _couponName = $(".couppn_name_keyWord").val();
    _couponStartPeriod = $("#dates_start1").val();
    _couponEndPeriod = $("#dates_end1").val();
    debugger;
    var params = {
        'couponName': _couponName,
        'couponStartPeriod': _couponStartPeriod,
        'couponEndPeriod': _couponEndPeriod,
        'pageSize': pageSize
        // 'currentPage': currentPage
    };
    return params;
};

/** table数据 */
function fillTableData(data) {

    if (data.length == 0) {   //没有资源时
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
        content.html("");
        for (var i = 0; i < data.length; i++) {
            content.append(
                // '<a>跳转到'+data[i].param+'这里</a>'
                '<tr data-id="' + '">' +
                '<td>' + data[i].couponName + '</td>' +       //名称
                '<td>' + sendTypeDraw(data[i].couponSendType) + '</td>' +       //发放类型
                '<td>' + couponTypeDraw(data[i].couponSettingType) + '</td>' +//结算类型
                '<td>' + data[i].couponMoney + '</td>' +       //优惠金额
                '<td><span>' + timeDraw(data[i].couponStartPeriod) + '</span><span class="zhi">至</span><span>' + timeDraw(data[i].couponEndPeriod) + '</span></td>' +       //有效期
                '<td>' + data[i].couponNumber + '</td>' +       //发放数量
                '<td>' +  data[i].couponAmount + '</td>' +       //使用数量
                '<td data-id="' + data[i].couponId + '">' + ' <a class="_look page_miniBtn" href="./coupon_look.html?id=' + data[i].couponId + '">查看</a></td>' +       //操作
                '</tr>'
            );
        }
        ;
    }
};

/*优惠券结算类型渲染函数*/
function couponTypeDraw(params) {
    var str = '';
    if (params == 1) {
        str += '抵价券';
    } else if (params == 2) {
        str += '满减券';
    }else if(params == 2){
        str += '折扣券';
    }
    return str;
}

/*优惠券发放类型渲染函数*/
function sendTypeDraw(params) {
    var str = '';
    if (params == 1) {
        str += '注册发放';
    } else {
        str += '其他发放';
    }
    return str;
}

function searchNowPage() {//首次两参进入
    var a;
    a = pagination.returnParams();
    _nowPage = a.currentPageNo;
};
//回显创建时间
function timeDraw(params){
    var updateTimeRes = getNowFormatDate(params);
    var fisrtTime = updateTimeRes.substr(0,10);
    return fisrtTime;
};