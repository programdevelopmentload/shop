//分页地址变量
var localUrl = getBaseUrl('lh');
// var _isLeaf = +$.getUrlParam("isLeaf");//是否是叶子节点
var _id = +$.getUrlParam("id");//本行数据id
var _edit = $.getUrlParam("edit");//本页展示的分类级别
//平台列表地址
var menu_Url = localUrl + '/user/menu/getASonMenu';

var _nowPage = 1;
$(function () {
    $(".everyRoleAdd").on("click", function () {

    });
    $.ajax({
        url: menu_Url,
        type: 'post',
        dataType: 'json',
        data: {
            id: _id
        },
        success: function (data) {
            debugger;
            if (data.success == true) {
                fillTableData(data.data);
            } else {

            }
        },
        error: function () {
            $("#pic_no").show();
            $(".pageSize_switch_con").hide();
            $(".self_table").hide();
            // $(".leftBottom").hide();
        }
    });
});

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
        var content = $(".self_table tbody");
        content.html("");
        for (var i = 0; i < data.length; i++) {
            debugger;
            var va_id = data[i].id;//序号
            var va_menuName = data[i].menuName;//菜单名称
            var va_menuLevel = data[i].menuLevel;//菜单等级
            var va_menuUrl = data[i].menuUrl;//菜单链接
            var va_orderNum = data[i].orderNum;//排序ID

            debugger;
            content.append(
                // '<a>跳转到'+data[i].param+'这里</a>'
                '<tr data-id="' + va_id + '">' +
                '<td>' + va_menuName + '</td>' +       //商品类型
                '<td>' + menuDraw(va_menuLevel) + '</td>' +       //配送服务
                '<td>' + va_menuUrl + '</td>' +       //测量服务
                '<td>' + va_orderNum + '</td>' +       //安装服务
                '<td class="operate_con" data-id="' + va_id + '"><a class="_change page_miniBtnm" href="./role_leafMenu_manag.html?&edit=0&id=' + va_id + '">查看</a><a class="_change page_miniBtnm" href="./role_menu_add.html?&edit=1&id=' + va_id + '">编辑</a><span class="_close page_miniBtn" onclick="role_Dele(this)">删除</span></td>' +       //操作
                '</tr>'
            )
            ;
        }
        ;
    }
};

function menuDraw(param) {
    if (param == '1') {
        return "一级"
    } else if (param == '2') {
        return "二级"
    } else {
        return "三级"
    }
}

function role_Dele() {
    alert(1)
}

