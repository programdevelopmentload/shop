var localHtttp = 'http://172.16.40.134:8003';
var localHtttp = 'http://172.16.40.134:8003';
//分页
var uMverify_PageUrl = localHtttp + "/seller/contractList";
//合同确认地址
var contract_confirmUrl = localHtttp + "/seller/updateComtractState";
$.sidebarMenu($('.sidebar-menu'));
var _nowPage = 1;
$(function () {
    searchPage();
    $('.pageSize_switch').on('change', function () {
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
        'keyword': _keyword,
        'pageSize': _pageSize,
        // 'pageNum': 1,
    };
    return params;
};

/** table数据 */
function fillTableData(data) {
    debugger;
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
            debugger;
            content.append(
                // '<a>跳转到'+data[i].param+'这里</a>'
                '<tr data-id="' + '">' +
                '<td>' + data[i].userName + '</td>' +       //商家账户
                '<td>' + data[i].companyName + '</td>' +   //公司名称
                '<td>' + data[i].telephone + '</td>' +       //联系电话
                '<td>' + data[i].creatTime + '</td>' + //发放时间
                '<td>' + data[i].effective + '</td>' +       //合同状态
                '<td data-id="' + data[i].contractId + '" class="clearfix">' + ' <a class="_look table_smBtn fl" href="./contract_detail.html?id=' + data[i].contractId + '&contractstate=' + data[i].effective + '">查看</a><dl class="confirm_func table_smBtn fl" onclick="confirm_func(this)">合同确认</dl></td>' +       //操作
                '</tr>'
            );
        }
        ;
    }
};

//合同确认按钮的执行
function confirm_func(obj) {
    _this = $(obj);
    var params = {
        contractId: _this.parent().data('id')
    };
    var html = template('distribution_bubble', {});
    $.popwin(html, {
        title: '操作确认',
        fixed: true,
        drag: false, //是否可拖拽
    });
    $("#popwin_Out").addClass("distribution_store");
    $.popwin.setPosition(410, 460);
    $('body').off('click').on('click','.cancle_xsBtn',function(){
        $("#popwin_Blank").remove();
        $("#popwin_Out").remove();
    });
    $(document).off('click').on('click','.sure_xsBtn',function(){
        $.ajax({
            type: "post",
            catch: false,
            url: contract_confirmUrl,
            dataType: "json",
            data: params,
            success: function () {
                $("#popwin_Blank").remove();
                $("#popwin_Out").remove();
                searchNowPage();
                searchPage(_nowPage);
            },
            error: function () {
                alert("连接错误");
            }
        })
    });
};

//获取当前页面
function searchNowPage() {//首次两参进入
    var a;
    a = pagination.returnParams();
    _nowPage = a.pageNum;
};
