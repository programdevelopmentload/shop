//分页地址变量
var localUrl = getBaseUrl('lh');
//平台列表地址
var plat_tabUrl = localUrl + '/user/permission/getAllPlatform';

var _nowPage = 1;
$(function () {
    $.ajax({
        url: plat_tabUrl,
        type: 'post',
        dataType: 'json',
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
            var va_platformName = data[i].platformName;//平台名称
            var va_platformDesc = data[i].platformDesc;//平台描述
            var va_platformId = data[i].platformId;//标识
            debugger;
            content.append(
                // '<a>跳转到'+data[i].param+'这里</a>'
                '<tr data-id="' + '">' +
                '<td>' + va_id + '</td>' +       //商品类型
                '<td>' + va_platformName + '</td>' +       //配送服务
                '<td>' + va_platformId + '</td>' +       //测量服务
                '<td>' + va_platformDesc + '</td>' +       //安装服务
                '<td class="operate_con" data-id="' + va_id + '"><a class="_change page_miniBtnm" href="./plat_edit.html?&edit=1&id=' + va_id + '">编辑</a></td>' +       //操作
                '</tr>'
            )
            ;
        }
        ;
    }
};



