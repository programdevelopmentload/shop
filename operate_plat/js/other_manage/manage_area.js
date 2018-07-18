//分页地址变量
var localUrl = 'http://172.16.41.23:8007';
//属性分页地址
var attr_pageUrl = localUrl + '/goods/attribute/show';
// var attr_pageUrl = "./shuxingguanli.json";
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
                '<td>' + 1 + '</td>' +       //序号
                '<td>' + data[i].name + '</td>' +       //属性名称
                '<td>' + attrTypeDraw(data[i].type) + '</td>' +       //属性类型
                '<td>' + unitDraw(data[i].unit) + '</td>' +       //属性单位
                '<td>' + stateDraw(data[i].state) + '</td>' +       //开关状态汉字渲染
                '<td data-id="' + data[i].id + '" data-state="' + data[i].state + '" data-name="' + data[i].name + '"data-type="' + data[i].type + '">' + ' <a class="_look sm btn-sm btn-primary" href="./attr_manag_detail.html?id=' + data[i].id + '&name=' + data[i].name + '">查看</a><button class="_change btn-sm btn-warning" onclick="grade_Rename(this)">更改名称</button><button class="_open btn-sm btn-success" onclick="grade_Switch(this,attr_switchUrl)">' + ctr_Switch(data[i].state) + '</button><button class="_close sm btn-danger btn-sm" onclick="grade_Delete(this,attr_delUrl)">删除</button>' + '</td>' +       //操作
                '</tr>'
            );
        }
        ;
    }
};

/*属性类型渲染函数*/
function attrTypeDraw(params) {
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
function unitDraw(params) {
    var str = '';
    if (params) {
        str += '有';
    } else {
        str += '无';
    }
    return str;
}

/*属性状态渲染函数*/
function stateDraw(params) {
    var str = '';
    if (params == 0) {
        str += '正常';
    } else {
        str += '已关闭';
    }
    return str;
}

/*单行删除按钮触发函数*/
function grade_Delete(obj, attr_delUrl) {

    //抓取该行数据id
    var $this = $(obj);
    var _id = $this.parent().data("id");
    var params = {
        id: _id
    };

    delete_runFun(params, attr_delUrl);
}

/*删除单行数据执行函数*/
function delete_runFun(params, attr_delUrl) {
    $.ajax({
        type: "post",
        url: attr_delUrl,
        dataType: "json",
        data: params,
        success: function (data) {
            if (data.success == true) {//判断返回参数中某个数据，不是这个
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410,460);
                $(".attr_manag_add .mask_tip").html("删除成功");
                searchNowPage();
                searchPage(_nowPage);
            } else {
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410,460);
                $(".attr_manag_add .mask_tip").html("该属性目前不可删除");
                // alert('该属性目前不可删除')
            }
        },
        error: function () {
        }
    });
}

/*开关渲染控制函数*/
function ctr_Switch(params) {
    var str = "";
    // var $this = $(obj);
    // var _state = $this.parent().data("state");

    if (params == 0) {//0是开启
        str += '关闭';
    } else {
        str += '开启';
    }
    return str;
}

/*开关控制函数*/
function grade_Switch(obj, attr_switchUrl) {
    //抓取该行数据id
    var $this = $(obj);
    var _id = $this.parent().data("id");
    var old_state = parseInt($this.parent().data("state"));
    var _state;
    if (old_state == 0) {
        _state = 1
    } else {
        _state = 0;
    }
    var params = {
        id: _id,
        state: _state
    };
    switch_runFun(params, attr_switchUrl);
}

/*开关后台交互执行函数*/
function switch_runFun(params, attr_switchUrl) {
    $.ajax({
        type: "post",
        catch: false,
        url: attr_switchUrl,
        dataType: "json",
        data: params,
        success: function (data) {
            if (data.success == true) {
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410,460);
                $(".attr_manag_add .mask_tip").html("关闭成功");
                searchNowPage();
                searchPage(_nowPage);//当我完成交互，刷新分页的时候，目前并没有完成功能
            } else {
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410,460);
                $(".attr_manag_add .mask_tip").html("不可关闭");

            }
        },
        error: function () {
        }
    });
}

/*更改名称触发函数*/
function grade_Rename(obj) {
    var html = template('test_mask_catch', {});
    $.popwin(html, {
        title: '更改名称',
        fixed: true,
        drag: false, //是否可拖拽
    });
    $("#popwin_Out").addClass("grade_RenameStyle");
    // $.popwin.setPosition(410,460);

    var $this = $(obj);
    var _id = $this.parent().data("id");
    var _oldName = $this.parent().data("name");
    var _type = $this.parent().data("type");
    $(".grade_RenameStyle .grade_nowName_address").html(_oldName);
    var rename_sureDom = $('.rename_sure');
    $(".grade_newName_input").blur(function () {
        if (regex_reName.test($('.grade_newName_input').val())) {

            $('.grade_newName_tip').hide();
            renameFlag = true;
        } else {
            $('.grade_newName_tip').html('不可空置/支持中英文，最多32个字符').show();
            renameFlag = false;
        }
    });
    rename_sureDom.on('click', function () {

        var _newName = $('.grade_newName_input').val(),
            _name = $('.grade_nowName_address').html(),
            renameFlag = regex_reName.test($('.grade_newName_input').val());
        param = {
            id:_id,
            nameNew: _newName,
            type:_type
        };

        if (renameFlag) {
            grade_Rename_link(param, attr_renameUrl);
        } else {
            $('.grade_newName_tip').html('不可空置/支持中英文，最多32个字符').show();
        }
    })
}

/*更改名称交互函数*/
function grade_Rename_link(params, attr_renameUrl) {
    $.ajax({
        url: attr_renameUrl,
        type: 'post',
        dataType: 'json',
        data: params,
        success: function (data) {
            if (data.success == true) {
                $('#popwin_Close').click();//@此处思考下到底怎么处理
                searchNowPage();
                searchPage(_nowPage);
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410,460);
                $(".attr_manag_add .mask_tip").html("更改名称成功");
            } else {
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410,460);
                $(".attr_manag_add .mask_tip").html("不可更改");
            }
        }
    });
}

function searchNowPage() {//首次两参进入
    var a;
    a = pagination.returnParams();
    _nowPage = a.currentPageNo;
};