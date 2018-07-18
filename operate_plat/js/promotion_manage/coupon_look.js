//分页地址变量
// var localUrl = 'http://172.16.40.60:8011';
var localUrl = getBaseUrl('g');
//优惠券详情页面有分页的地址
var coupon_pageUrl = localUrl + '/promotionserver/findById';
//优惠券详情页顶部信息
var couponDetail_topUrl = localUrl + '/promotionserver/findBycouponId';
//优惠券使用数量拉取地址
var use_numLinkUrl = localUrl + '/promotionserver/findByReceiveStatus';

var _nowPage = 1,
    _totalCount = 1,
    _couponStatus = "";
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
var _couponId = $.getUrlParam("id");
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    detail_topLink();
    searchPage();
    //拉取已使用数量
    use_numLink_after();
    debugger;
    // $(".use_after_num").html(_use_after_num);
    //拉取未使用数量
    use_numLink_before();


    $('.pageSize_switch').on('change', function () {
        searchPage();
    });
    $('.use_state').off("click").on('click', function () {
        debugger;
        var _index = $(this).index();
        $(this).addClass("num_active").siblings().removeClass("num_active");
        _couponStatus = $(this).data('state');
        searchPage();
        // searchNowPage();
    });
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

    pagination.search(getParams(), page);
}

/** 得到搜索条件的json对象 */
function getParams() {
    var params = {
        'couponId': _couponId,//id
        'receiveStatus': _couponStatus,//状态标记
        'pageSize': 5
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
        var content1 = $(".sky");
        content.html("");
        for (var i = 0; i < data.length; i++) {

            content.append(
                // '<a>跳转到'+data[i].param+'这里</a>'
                '<tr data-id="' + '">' +
                '<td>' + data[i].couponNo + '</td>' +       //优惠券编号
                '<td>' + data[i].userPhone + '</td>' +       //会员号码
                '<td>' + data[i].orderNumber + '</td>' +//订单号
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
        str += '折抵价';
    } else if (params == 2) {
        str += '满减券';
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

function searchNowPage() {
    //首次两参进入
    var a = null;
    a = pagination.returnParams();
    debugger
    _nowPage = a.currentPageNo;
    _totalCount = a.totalCount;
};

// 详情页顶部数据拉取
function detail_topLink() {
    var params = {
        couponId: _couponId
    }
    $.ajax({
        type: "post",
        url: couponDetail_topUrl,
        dataType: "json",
        data: params,
        success: function (data) {

            var resData = data.data;
            if (data.success == true) {

                $(".coupon_name").html(resData.couponName);
                $(".cash_num").html(resData.couponMoney);
                $(".time_start").html(timeDraw(resData.couponStartPeriod));
                $(".time_end").html(timeDraw(resData.couponEndPeriod));
                $(".coupon_sendType").html(sendTypeDraw(resData.couponSendType));//1是注册发放
                $(".coupon_settingType").html(settingTypeDraw(resData.couponSettingType));//1是抵价券，2是满减券，3是折扣券，
            }
        },
        error: function () {

        }
    });
}

//回显创建时间
function timeDraw(params) {
    var updateTimeRes = getNowFormatDate(params);
    var fisrtTime = updateTimeRes.substr(0, 10);
    return fisrtTime;
};

//回显释放类型
function sendTypeDraw(param) {

    if (param == 1) {
        return "注册发放";
    }
};

//回显券类型
function settingTypeDraw(param) {
    if (param == 1) {
        return "抵价券";
    } else if (param == 2) {
        return "满减券";
    } else {
        return "折扣券";
    }
};

// 已使用，使用状况数量拉取
function use_numLink_after() {
    var params = {
        couponId: _couponId,
        receiveStatus: 1
    };
    var resultNum = 0;
    $.ajax({
        type: "post",
        url: use_numLinkUrl,
        dataType: "json",
        catch: false,
        sync: false,
        data: params,
        success: function (data) {
            debugger;
            if (data.success == true) {
                var res = "（ " + data.data + " ）";
                $(".use_after_num").text(res);//已使用是1
            }
        },
        error: function () {

        }
    });
}

// 未使用，使用状况数量拉取
function use_numLink_before() {
    var params = {
        couponId: _couponId,
        receiveStatus: 0
    };
    var resultNum = 0;
    $.ajax({
        type: "post",
        url: use_numLinkUrl,
        dataType: "json",
        catch: false,
        sync: false,
        data: params,
        success: function (data) {
            if (data.success == true) {
                var res = "（ " + data.data + " ）";
                $(".use_before_num").text(res);//未使用是0
            }
        },
        error: function () {

        }
    });
}
