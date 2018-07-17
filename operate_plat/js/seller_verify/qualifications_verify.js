// var localHtttp = 'http://172.16.40.134:8003';
var localHtttp = getBaseUrl('yy');
//袁帅地区接口前缀
var local_areaHtttp = getBaseUrl('ys');
//分页
var uMverify_PageUrl = localHtttp + "/user/seller/examineAndVerifyList";
//获取所有的省
var open_provinceUrl = local_areaHtttp + '/region/findAllProvince';
// var open_provinceUrl = '../../html/other_manage/huoqu_shengAll.json';
var _companyArea = '';
$.sidebarMenu($('.sidebar-menu'));
$(function () {

    setDateTime();
    province_pull();

    searchPage();
    $('.pageSize_switch').on('change', function () {
        searchPage();
    })
    $(".vwait_queryBtn").on("click", function () {
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
    var _companyArea = $('.verify_area_con').val();//所在区域

    var _pageSize = +$('.pageSize_switch').val();
    var _username = $('.account_keyWord').val();
    var _phoneNumber = $('.phone_keyWord').val();
    var _companyName = $('.company_keyWord').val();

    var _startDate = $('#dates_start1').val();
    var _endDate = $('#dates_end1').val();
    debugger;
    var _state = 1;

    var params = {
        'applyType': 0,
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
        var str = '';
        for (var i = 0; i < data.length; i++) {
            str += '<tr data-id="' + data[i].id + '">';
            str += '<td>' + data[i].userInfo.username + '</td>';       //商家账号
            str += '<td>' + data[i].userInfo.phoneNumber + '</td>'; //手机号
            str += '<td>' + data[i].companyName + '</td>';     //公司名称
            if (data[i].companyArea) {
                str += '<td>' + data[i].companyArea + '</td>';//所在地区
            } else {
                str += '<td>--</td>';//所在地区
            }
            str += '<td>资质审核</td>';       //申请类型
            str += '<td>' + data[i].applyTime + '</td>';      //申请时间
            str += '<td>' + stateDraw(data[i].companyState) + '</td>';     //审核状态
            str += '<td data-id="' + data[i].id + '">' + ' <a class="_look page_miniBtn" href="./qualifications_verify_detail.html?id=' + data[i].id + '&log=0">立即审核</a></td>';      //操作
            str += '</tr>';
        }
        ;
        content.html(str);
    }
};

//绘制审核类型
function stateDraw(params) {
    var str = "";
    if (params = 1) {
        str = "待审核";
    } else if (params = 3) {
        str = "未通过";
    } else if (params = 2) {
        str = "已通过";
    }
    return str;
}

//拉取省
function province_pull() {
    $.ajax({
        type: 'post',
        url: open_provinceUrl,
        dataType: 'json',
        async: false,
        // cache:false,
        success: function (data) {
            var originData = data.data;

            var str = '<li data-id="" data-name="">全部</li>';
            $.each(originData, function (index, item) {
                str += '<li data-id="' + item.id + '" data-name="' + item.name + '">' + item.name + '</li>'
            });
            $(".verify_area_con").html(str);
        }
    });
}


