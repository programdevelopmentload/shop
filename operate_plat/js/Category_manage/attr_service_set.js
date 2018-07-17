//分页地址变量
var localUrl = getBaseUrl('w');
//属性分页地址
var service_tabUrl = localUrl + '/goods/serviceDetails/showDetailsByType';
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
    var paramsMeasure = {
        'type': 0
    };
    var listMeasue = $("#show1 tbody");

    listPull_Link(paramsMeasure, listMeasue, 0);
    debugger;
    var paramsMeasure = {
        'type': 1
    };
    var listInstall = $("#show2 tbody");
    listPull_Link(paramsMeasure, listInstall, 1);

});

/** table数据 */
function fillTableDataTop(data, listMeasue) {
    debugger;
    if (data.length == 0 || !data.length || !data) {
        //没有资源时
        $("#show1 .pic_no").show();
        $("#show1 .self_table").hide();
    } else {
        var tr = "tr";
        var content = listMeasue;
        content.html("");
        for (var i = 0; i < data.length; i++) {
            debugger;
            var va_id = data[i].id;
            content.append(
                // '<a>跳转到'+data[i].param+'这里</a>'
                '<tr data-id="' + '">' +
                '<td>' + data[i].serviceDetailsName + '</td>' +       //商品类型
                '<td class="operate_con" data-id="' + va_id + '">' + ' <a class="_look page_miniBtnm" href="./attr_set_measureDetail.html?&id=' + va_id + '&typeinput=' + data[i].serviceDetailsName + '">查看</a><a class="_change page_miniBtnm" href="./attr_set_measureAdd.html?&edit=1&id=' + data[i].id + '&typeinput=' + data[i].serviceDetailsName + '">编辑</a></td>' +       //操作
                '</tr>'
            )
        }
    }
};

/** table数据 */
function fillTableDataBottom(data, listMeasue) {
    debugger;
    if (data.length == 0 || !data.length || !data) {
        //没有资源时
        $("#show2 .pic_no").show();
        $("#show2 .self_table").hide();
    } else {
        var tr = "tr";
        var content = listMeasue;
        content.html("");
        for (var i = 0; i < data.length; i++) {
            debugger;
            var va_id = data[i].id;
            content.append(
                // '<a>跳转到'+data[i].param+'这里</a>'
                '<tr data-id="' + '">' +
                '<td>' + data[i].serviceDetailsName + '</td>' +       //商品类型
                '<td class="operate_con" data-id="' + va_id + '">' + ' <a class="_look page_miniBtnm" href="./attr_set_installDetail.html?&id=' + va_id + '&typeinput=' + data[i].serviceDetailsName + '">查看</a><a class="_change page_miniBtnm" href="./attr_set_installAdd.html?&edit=1&id=' + data[i].id + '&typeinput=' + data[i].serviceDetailsName + '">编辑</a></td>' +       //操作
                '</tr>'
            )
        }
    }
};

/*属性类型渲染函数*/
function sendDraw(params) {
    var str = '';
    if (params == 0) {
        str += '无';
    } else if (params == 1) {
        str += '有';
    }
    return str;
}

/*属性单位有无渲染函数*/
function measureDraw(params) {
    var str = '';
    if (params == 0) {
        str += '无';
    } else {
        str += '有';
    }
    return str;
}

/*属性状态渲染函数*/
function installDraw(params) {
    var str = '';
    if (params == 0) {
        str += '无';
    } else {
        str += '有';
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

//参数：0是测量，1是安装
function listPull_Link(paramsMeasure, listMeasue, flag) {
    $.ajax({
        url: service_tabUrl,
        type: 'post',
        dataType: 'json',
        data: paramsMeasure,
        success: function (data) {
            debugger;
            if (data.success == true) {
                if (flag == 0) {
                    fillTableDataTop(data.data, listMeasue);
                } else {
                    fillTableDataBottom(data.data, listMeasue);
                }

            } else {

            }
        },
        error: function () {
            if (flag == 0) {
                $("#show1 .pic_no").show();
                $("#show1 .self_table").hide();
            } else if (flag == 1) {
                $("#show2 .pic_no").show();
                $("#show2 .self_table").hide();
            }

        }
    });
}


