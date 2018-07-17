//分页地址变量
var localUrl = getBaseUrl('lh');
//角色组表格页地址
var roleGroup_tabUrl = localUrl + '/user/permission/selectAllDepts';
//添加角色组
var roleGroup_addUrl = localUrl + '/user/permission/addDept';
//冻结解冻地址
var ice_openUrl = localUrl + '/user/permission/updateDeptState';
//编辑提交地址
var edit_roleUrl = localUrl + '/user/permission/updateDept';
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
var _deptName = "";
var renameFlag = false;
$(function () {
    searchPage();
    $('.pageSize_switch').on('change', function () {
        searchPage();
    })
    role_group_fun("");
    $(".vwait_queryBtn").on("click", function () {
        _deptName = $.trim($(".role_name_keyWord").val());
        searchPage();
    })
    //点击添加角色组按钮
    $(".role_groupAdd_btn").off("click").on("click", function () {
        $(".index_mask", parent.document).show();
        var html = template('test_mask_catch', {});
        $.popwin(html, {
            title: '添加角色组',
            fixed: true,
            drag: false, //是否可拖拽
        });
        $("#popwin_Out").addClass("role_groupStyle");
        $.popwin.setPosition(610, 720);
        $("#popwin_Close").on("click", function () {
            $("#popwin_Blank").remove();
            $("#popwin_Out").remove();
            $(".index_mask", parent.document).hide();
        })
        role_group_Dialogfun("");
        $(".role_groupName_input").blur(function () {
            if (regex_reName.test($.trim($('.role_groupName_input').val()))) {
                $('.role_groupName_tip').hide();
                renameFlag = true;
            } else {
                $('.role_groupName_tip').show();
                $('.role_groupName_tip').html('不可空置/支持中英文，最多32个字符').show();
                renameFlag = false;
            }
        });

        $('body').off('click').on('click', '.cancle_xsBtn', function () {
            $("#popwin_Blank").remove();
            $("#popwin_Out").remove();
            $(".index_mask", parent.document).hide();
        });
        $(document).off('click').on('click', '.sure_xsBtn', function () {
            //此时开始ajax交互。
            debugger;
            var _deptName = $.trim($('.role_groupName_input').val());
            var _deptDesc = "";
            renameFlag = regex_reName.test($('.role_groupName_input').val());
            var param = {
                deptName: _deptName,
                deptDesc: _deptDesc
            };

            if (renameFlag) {
                role_addGroup_fun(param);
            } else {
                $('.role_groupName_tip').html('不可空置/支持中英文，最多32个字符').show();
            }

        });
    });

})

/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */

var pagination = new Pagination(roleGroup_tabUrl, "page", function (data) {
    fillTableData(data)
});

function searchPage(page) {//首次两参进入
    pagination.search(getParams(), page);
}

function searchNowPage() {//首次两参进入
    var a;
    a = pagination.returnParams();
    _nowPage = a.currentPageNo;

};

/** 得到搜索条件的json对象 */
function getParams() {
    var pageSize = $('.pageSize_switch').val();
    var params = {
        'deptName': _deptName,
        'pageSize': pageSize//当前每页有多少行
        // 'currentPage': 1
    };
    return params;
};


function sky() {
    $.ajax({
        url: add_unitUrl,
        type: 'post',
        dataType: 'json',
        data: param,
        success: function (data) {
            debugger;
            if (data.success == true) {
                searchNowPage();
                searchPage(_nowPage);
                // $("#popwin_Blank").remove();
                // $("#popwin_Out").remove();
                $(".index_mask", parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410, 560);
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask", parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html("添加成功");
                // alert('添加成功')
            } else {
                $(".index_mask", parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410, 560);
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask", parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html("您添加的单位名已存在");
                // alert(msg);
            }
        }
    });
}

//填充表格交互
function role_group_fun(_deptName_params) {
    var params = {
        'pageNum': 1,
        'deptName': _deptName_params
    };
    debugger;
    $.ajax({
        url: roleGroup_tabUrl,
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
        error: function () {
            $("#pic_no").show();
            $(".pageSize_switch_con").hide();
            $(".self_table").hide();
            // $(".leftBottom").hide();
        }
    });
}

//填充遮罩层的交互
function role_group_Dialogfun(_deptName_params) {
    var params = {
        'pageNum': 1,
        'deptName': _deptName_params
    };
    debugger;
    $.ajax({
        url: roleGroup_tabUrl,
        type: 'post',
        dataType: 'json',
        data: params,
        success: function (data) {
            debugger;
            if (data.success == true) {
                var res = data.data.items;
                var dialogStr = "";
                $(res).each(function (ii, vv) {
                    dialogStr += "<div class='col-xs-4 hasAdd_group'>" + vv.deptName + "</div>";
                })
                $(".hasAdd_group_con").html(dialogStr)
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
}

//添加角色组交互
function role_addGroup_fun(params) {
    debugger;
    $.ajax({
        url: roleGroup_addUrl,
        type: 'post',
        dataType: 'json',
        data: params,
        success: function (data) {
            debugger;
            if (data.success == true) {
                $(".index_mask", parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410, 560);
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask", parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html("添加成功");
                searchPage();
            } else {
                $(".index_mask", parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410, 560);
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask", parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html("连接失败");
            }
        },
        error: function () {
            $("#pic_no").show();
            $(".pageSize_switch_con").hide();
            $(".self_table").hide();
            // $(".leftBottom").hide();
        }
    });
}

/** table数据 */
function fillTableData(data) {
    debugger;
    if (data.length == 0) {   //没有资源时
        $("#pic_no").show();
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
                '<td>' + data[i].id + '</td>' +       //角色组编号
                '<td>' + data[i].deptName + '</td>' +       //角色组名称
                '<td>' + role_stateDraw(data[i].state) + '</td>' +       //当前状态
                '<td class="caozuo_box" data-id="' + data[i].id + '" data-state="' + data[i].state + '" data-name="' + data[i].id + '"><button class=" page_miniBtn" onclick="grade_Switch(this)">' + ctr_Switch(data[i].state) + '</button><button onclick="edit_role(this)" class="_change page_miniBtn">编辑</button></td>' +       //操作
                '</tr>'
            );
        }
    }
};

function role_stateDraw(obj) {
    if (obj == 0) {
        return "正常"
    } else {
        return "冻结"
    }
}

/*开关渲染控制函数*/
function ctr_Switch(_state) {
    debugger;
    var str = "";
    if (_state == 0) {//0是开启
        str += '冻结';
    } else {
        str += '开启';
    }
    return str;
}

//打开关闭函数
/*开关控制函数*/
function grade_Switch(obj) {
    //抓取该行数据id
    var $this = $(obj);
    var _deptId = $this.parent().data("id");
    debugger;
    var paramss = {
        deptId: _deptId
    }
    switch_runFun(paramss);
}

/*开关后台交互执行函数*/
function switch_runFun(params) {
    $.ajax({
        type: "post",
        catch: false,
        url: ice_openUrl,
        dataType: "json",
        data: params,
        success: function (data) {
            if (data.success == true) {
                searchPage();
            } else {
                $(".index_mask", parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(380, 370);
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask", parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html("此分类下有商品正在使用，不能关闭");
                // alert("该等级下有挂载，不可关闭")

            }
        },
        error: function () {
        }
    });
}

/*编辑交互执行函数*/
function edit_runFun(params) {
    $.ajax({
        type: "post",
        catch: false,
        url: edit_roleUrl,
        dataType: "json",
        data: params,
        success: function (data) {
            if (data.success == true) {
                $(".index_mask", parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(380, 370);
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask", parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html("编辑成功");
                searchPage();
            } else {
                $(".index_mask", parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(380, 370);
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask", parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html("连接错误");
                // alert("该等级下有挂载，不可关闭")

            }
        },
        error: function () {
        }
    });
}

/*编辑角色组触发函数*/
function edit_role(obj) {
    var $this = $(obj);
    var _deptId = $this.parent().data("id");
    var _deptName = $this.parent().data("name");
    debugger;
    $(".index_mask", parent.document).show();
    var html = template('test_mask_catch', {});
    $.popwin(html, {
        title: '编辑角色组',
        fixed: true,
        drag: false, //是否可拖拽
    });
    $("#popwin_Out").addClass("role_groupStyle");
    $.popwin.setPosition(610, 720);
    $(".role_groupName_input").val(_deptName);
    role_group_Dialogfun("");
    $(".role_groupName_input").blur(function () {
        if (regex_reName.test($.trim($('.role_groupName_input').val()))) {
            $('.role_groupName_tip').hide();
            renameFlag = true;
        } else {
            $('.role_groupName_tip').show();
            $('.role_groupName_tip').html('不可空置/支持中英文，最多32个字符').show();
            renameFlag = false;
        }
    });

    $('body').off('click').on('click', '.cancle_xsBtn', function () {
        $("#popwin_Blank").remove();
        $("#popwin_Out").remove();
        $(".index_mask", parent.document).hide();
    });
    $(document).off('click').on('click', '.sure_xsBtn', function () {
        //此时开始ajax交互。
        debugger;
        var _deptName = $.trim($('.role_groupName_input').val());
        var _deptDesc = "";
        renameFlag = regex_reName.test($('.role_groupName_input').val());
        var param = {
            id: _deptId,
            deptName: _deptName,
            deptDesc: ""
        };

        if (renameFlag) {
            edit_runFun(param);
        } else {
            $('.grade_deptName_tip').html('不可空置/支持中英文，最多32个字符').show();
        }

    });

}
