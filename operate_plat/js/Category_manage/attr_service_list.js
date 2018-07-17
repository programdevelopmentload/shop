//分页地址变量
var localUrl = getBaseUrl('w');
//属性分页地址
var service_tabUrl = localUrl + '/goods/service/showAll';
//删除函数
var attr_delUrl = localUrl + '/goods/attribute/del';
//改名函数
var attr_renameUrl = localUrl + '/goods/attribute/updateName';
//开关函数【目前空缺】
var attr_switchUrl = localUrl + '/goods/attribute/openClose';


var renameFlag = false;
var _nowPage = 1;
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    var params = {
        'pageNum': 1,
        'pageSize': 10000
    };
    debugger;
    $.ajax({
        url: service_tabUrl,
        type: 'post',
        dataType: 'json',
        data: params,
        success: function (data) {
            debugger;
            if (data.success == true) {
                fillTableData(data.data.items);
            } else {

            }
        },
        error:function () {
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
            var va_id = data[i].id;
            var va_goodsType = data[i].goodsType;
            var va_sendService = data[i].sendService;
            var va_measureService = data[i].measureService;
            var va_installService = data[i].installService;
            // var va_selfService = data[i].selfLiftingService;
            debugger;

            content.append(
                // '<a>跳转到'+data[i].param+'这里</a>'
                '<tr data-id="' + '">' +
                '<td>' + data[i].goodsType + '</td>' +       //商品类型
                '<td>' + sendDraw(data[i].sendService) + '</td>' +       //配送服务
                // '<td>' + selfDraw(data[i].selfLiftingService) + '</td>' +       //自提服务
                '<td>' + measureDraw(data[i].measureService) + '</td>' +       //测量服务
                '<td>' + installDraw(data[i].installService) + '</td>' +       //安装服务
                // '<td>' + guanlianDraw(data[i].installService) + '</td>' +       //关联分类
                '<td class="operate_con" data-id="' + va_id + '" data-type="' + va_goodsType + '" data-send="' + va_sendService + '"data-measure="' + va_measureService + '"data-install="' + va_installService + '">' + ' <a class="_look page_miniBtnm" href="./attr_service_detail.html?&edit=3&id=' + va_id + '&goodtype=' + va_goodsType + '&send=' + va_sendService + '&measure=' + va_measureService + '&install=' + va_installService + '&self=null">查看</a><a class="_change page_miniBtnm" href="./attr_service_add.html?&edit=1&id=' + va_id + '&goodtype=' + va_goodsType + '&send=' + va_sendService + '&measure=' + va_measureService + '&install=' + va_installService + '&self=null">编辑</a></td>' +       //操作
            '</tr>'
        )
            ;
        }
        ;
    }
};

/*配送渲染函数*/
function sendDraw(params) {
    var str = '';
    if (params == 0) {
        str += '有';
    } else if (params == 1) {
        str += '无';
    }
    return str;
}

/*测量有无渲染函数*/
function measureDraw(params) {
    var str = '';
    if (params == 0) {
        str += '有';
    } else {
        str += '无';
    }
    return str;
}

/*安装渲染函数*/
function installDraw(params) {
    var str = '';
    if (params == 0) {
        str += '有';
    } else {
        str += '无';
    }
    return str;
}

/*属性状态渲染函数*/
function selfDraw(params) {
    var str = '';
    if (params == 0) {
        str += '有';
    } else {
        str += '无';
    }
    return str;
}

/*更改名称触发函数*/
function guanlianDraw(params) {
    var str = '';
    if (params == 0) {
        str += '未设置';
    } else {
        str += '已设置';
    }
    return str;
}


