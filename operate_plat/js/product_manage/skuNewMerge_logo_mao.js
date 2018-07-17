//分页地址变量
var localUrl = 'http://172.16.41.23:8007';
//属性分页地址
var attr_pageUrl = localUrl + '/goods/attribute/show';
// var attr_pageUrl = "./shuxingguanli.json";
//删除函数
var attr_delUrl = localUrl + '/goods/attribute/del';
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    //判断顶部是否显示更多更少按钮
    judgeSwitch_ishave();
    topArea_active();

    $('.supplier_test').on('click',function () {
        var html = template('class_bubble', {});
        $.popwin(html, {
            title: '',
            fixed: true,
            drag: false, //是否可拖拽
        });
        $("#popwin_Out").addClass("attr_manag_add");
        $.popwin.setPosition(500, 1100);
    });

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

var pagination = new Pagination(attr_pageUrl, "page", function (data) {
    fillTableData(data)
});

function searchPage(page) {//首次两参进入
    pagination.search(getParams(), page);
}

/** 得到搜索条件的json对象 */
function getParams() {
    var pageSize = $('.pageSize_switch').val();
    var params = {
        'pageSize': pageSize
        // 'currentPage': 1,

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
                '<td>' + 1 + '</td>' +       //规格信息
                '<td>' + data[i].name + '</td>' +       //商品型号
                '<td>' + goodsTypeDraw(data[i].type) + '</td>' +       //商品类型[非标品]
                '<td>' + timeDraw(data[i].unit) + '</td>' +       //整合时间
                '<td data-id="' + data[i].id + '" data-state="' + data[i].state + '" data-name="' + data[i].name + '"data-type="' + data[i].type + '">' + ' <a class="_look sm btn-sm btn-primary" href="./attr_manag_detail.html?id=' + data[i].id + '&name=' + data[i].name + '">查看</a><button class="_close sm btn-danger btn-sm" onclick="supplier_Info(this,attr_delUrl)">删除</button>' + '</td>' +       //操作
                '</tr>'
            );
        }
        ;
    }
};

/*属性类型渲染函数*/
function goodsTypeDraw(params) {
    var str = '';
    if (params == 0) {
        str += '主销售属性';
    } else if (params == 1) {
        str += '副销售属性';
    } else {
        str += '副销售属性';
    }
    return str;
}

/*属性单位有无渲染函数*/
function timeDraw(params) {
    var str = '';
    if (params) {
        str += '有';
    } else {
        str += '无';
    }
    return str;
}

/*供应商信息按钮触发函数*/
function supplier_Info(obj, attr_delUrl) {
    //抓取该行数据id
    var $this = $(obj);
    var _id = $this.parent().data("id");
    var params = {
        id: _id
    };
    var html = template('ajax_alert', {});
    $.popwin(html, {
        title: '',
        fixed: true,
        drag: false, //是否可拖拽
    });
    $("#popwin_Out").addClass("attr_manag_add");
    $.popwin.setPosition(410, 460);
    $(".attr_manag_add .mask_tip").html("请至少选择2条");
}
