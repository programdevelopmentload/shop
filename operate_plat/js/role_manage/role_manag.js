//分页地址变量
var localHtttp = getBaseUrl('lh');
var _id = $.getUrlParam("id");//本行数据id
var regex_reName = /^[\s\S]{1,32}$/;
var regex_reNameEG = /^[A-Z]{1,32}$/;
var _nowPage = 1;
//新增角色地址
var role_addUrl = localHtttp + '/user/permission/addRole';

//角色列表分页地址
var role_pageUrl = localHtttp + '/user/permission/selectRoles';
//查看状态正常部门列表
var normalRoleGroupUrl = localHtttp + '/user/permission/selectDepts';
//获取所有平台
var normalPlatUrl = localHtttp + '/user/permission/getAllPlatform';
//开关
var switch_runUrl = localHtttp + '/goods/GoodsClassification/backCloseOpen';

//获取角色的所有信息地址
var return_roleInfoUrl = localHtttp + '/user/permission/selectByRoleId';
//编辑角色提交地址
var edit_role_pushUrl = localHtttp + '/user/permission/updateRole';

var renameFlag = false;
var _nowPage = 1;

$(function () {
    searchPage();
    $('.pageSize_switch').on('change', function () {
        searchPage();
    })
    $('.vwait_queryBtn').on('click', function () {
        searchPage();
    })
    //点击添加角色按钮
    $(".role_addBtn").off("click").on("click", function () {
        var renameFlag = false;
        var renameEGFlag = false;
        var renameDescFlag = false;
        var renamePlatFlag = false;
        var renameGropFlag = false;
        $(".index_mask", parent.document).show();
        var html = template('test_mask_catch', {});
        $.popwin(html, {
            title: '添加角色',
            fixed: true,
            drag: false, //是否可拖拽
        });
        $("#popwin_Out").addClass("role_Style");
        $.popwin.setPosition(610, 720);
        normalRoleGroupFun();
        normalPlatFun();
        $("#popwin_Close").on("click", function () {
            $("#popwin_Blank").remove();
            $("#popwin_Out").remove();
            $(".index_mask", parent.document).hide();
        })
        //角色名称输入框失焦事件
        $(".role_Name_input").blur(function () {
            if (regex_reName.test($.trim($('.role_Name_input').val()))) {
                $('.role_Name_tip').hide();
                renameFlag = true;
            } else {
                $('.role_Name_tip').show();
                $('.role_Name_tip').html('不可空置/支持中英文，最多32个字符').show();
                renameFlag = false;
            }
        });
        //角色英文标识输入框失焦事件
        $(".role_NameEG_input").blur(function () {
            if (regex_reNameEG.test($.trim($('.role_NameEG_input').val()))) {
                $('.role_NameEG_tip').hide();
                renameEGFlag = true;
            } else {
                $('.role_NameEG_tip').show();
                $('.role_NameEG_tip').html('不可空置，最多32个字符').show();
                renameEGFlag = false;
            }
        });
        //角色描述失焦事件
        $(".role_desc_input").blur(function () {
            if (regex_reName.test($.trim($('.role_desc_input').val()))) {
                $('.role_desc_tip').hide();
                renameDescFlag = true;
            } else {
                $('.role_desc_tip').show();
                $('.role_desc_tip').html('不可空置，最多32个字符').show();
                renameDescFlag = false;
            }
        });

        $('body').off('click').on('click', '.cancle_xsBtn', function () {
            $("#popwin_Blank").remove();
            $("#popwin_Out").remove();
            $(".index_mask", parent.document).hide();
        });
        $(document).off('click').on('click', '.sure_xsBtn', function () {
            var _roleName = $.trim($('.role_Name_input').val());
            var _roleDesc = $.trim($('.role_desc_input').val());
            var _engName = $.trim($('.role_NameEG_input').val());
            var _deptId = "";//角色组
            var _platforms = [];//平台
            $(".item-check:checked").each(function () {
                _platforms.push($(this).data("id"));//平台
            });
            _platforms = _platforms.toString();
            $(".item-checkRadio:checked").each(function () {//角色组
                _deptId = $(this).data("id");
            })
            //角色名
            if (!regex_reName.test(_roleName)) {
                $('.role_Name_tip').html('不可空置/支持中英文，最多32个字符').show();
                renameFlag = false;
                return false;
            } else {
                $(".role_Name_tip").hide();
                renameFlag = true;
            }
            //角色英文
            if (!regex_reNameEG.test(_engName)) {
                renameEGFlag = false;
                $('.role_NameEG_tip').html('请输入英文大写字母，最多32个字符').show();
                return false;
            } else {
                $(".role_NameEG_tip").hide();
                renameEGFlag = true;
            }
            //角色描述
            if (!regex_reName.test(_roleDesc)) {
                renameDescFlag = false;
                $('.role_desc_tip').html('不可空置/支持中英文，最多32个字符').show();
                return false;
            } else {
                $(".role_desc_tip").hide();
                renameDescFlag = true;
            }
            var platCheckbox = $(".item-check:checked");
            if (platCheckbox.length == 0) {
                $(".role_plat_tip").html("请选择所属平台").show();
                renamePlatFlag = false;
                return false;
            } else {
                $(".role_plat_tip").html("请选择所属平台").hide();
                renamePlatFlag = true;
            }
            var roleGroupCheckbox = $(".item-checkRadio:checked");
            if (roleGroupCheckbox.length == 0) {
                $(".role_group_tip").html("请选择角色组").show();
                renameGropFlag = false;
                return false;
            } else {
                $(".role_group_tip").html("请选择角色组").hide();
                renameGropFlag = true;
            }
            //此时开始ajax交互。

            if (renameFlag && renameEGFlag && renameDescFlag && renamePlatFlag && renameGropFlag) {
                var param = {
                    roleName: _roleName,
                    roleDesc: _roleDesc,
                    deptId: _deptId,
                    engName: _engName,
                    platforms: _platforms
                };
                debugger;
                role_addFun(param);
            }


        });
    });
});

/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */

var pagination = new Pagination(role_pageUrl, "page", function (data) {
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
    var _roleName = $(".role_name_keyWord").val();
    var pageSize = $('.pageSize_switch').val();
    var params = {
        'roleName': _roleName
        // 'pageSize': pageSize//当前每页有多少行
        // 'currentPage': 1
    };
    return params;
};

/** table数据 */
function fillTableData(data) {
    if (data.length == 0) {   //没有资源时
        $("#pic_no").show();
        $("#table_data").hide();
        $(".leftBottom").hide();
    } else {
        $("#pic_no").hide();
        $("#table_data").show();
        $(".leftBottom").show();
        var content = $("#table_data tbody");
        content.html("");
        var roleStr = "";
        for (var i = 0; i < data.length; i++) {
            // '<a>跳转到'+data[i].param+'这里</a>'
            roleStr += "<tr data-id='" + "'>";
            roleStr += "<td>" + data[i].id + "</td>";       //角色id
            roleStr += "<td>" + data[i].roleName + "</td>";     //角色名
            roleStr += "<td>" + data[i].roleDesc + "</td>";      //角色描述
            roleStr += "<td>" + data[i].userDept.deptName + "</td>";       //角色组
            roleStr += "<td>";

            for (var k = 0; k < data[i].userRolePlatforms.length; k++) {
                if (data[i].userRolePlatforms.length > 0) {
                    if (k == 0) {
                        roleStr += data[i].userRolePlatforms[k].userPlatform.platformName;
                    } else {
                        roleStr += "，" + data[i].userRolePlatforms[k].userPlatform.platformName;
                    }
                }
            }
            roleStr += "</td>";      //所属平台
            roleStr += "<td>" + roleStateDraw(data[i].roleState) + "</td>";      //当前状态
            roleStr += "<td class='caozuo_box' data-id='" + data[i].id + "' data-state='" + data[i].roleState + "' data-name='" + data[i].roleName + "'>" + "<span class='page_miniBtn' onclick='roloe_edit(this)'>编辑</span><button class='_change page_miniBtn' onclick='operate_distributionFun(this)'>分配权限</button></td>";      //操作
            roleStr += "</tr>"
        }
        content.html(roleStr)
    }
};

/*分页分类状态中文汉字渲染函数*/
function roleStateDraw(obj) {
    if (obj == 0) {
        return "开启"
    } else {
        return "关闭"
    }
}


// 分配权限执行函数
function operate_distributionFun(obj) {
    var $this = $(obj);
    debugger
    var jumpId = $this.parent().data("id");
    window.location.href = "./role_operate_distribution.html?roleid=" + jumpId;
}

//添加角色组交互
function role_addFun(params) {
    debugger;
    $.ajax({
        url: role_addUrl,
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
                searchNowPage()
                searchPage(_nowPage);
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

//获取所有正常状态部门列表
function normalRoleGroupFun() {
    debugger;
    $.ajax({
        url: normalRoleGroupUrl,
        type: 'post',
        dataType: 'json',
        catch: false,
        sync: false,
        success: function (data) {
            debugger;
            if (data.success == true) {
                var res = data.data;
                var resStr = "";
                $(res).each(function (j, k) {
                    resStr += "<li class='col-sm-3'><div class='row'>";
                    resStr += "<input data-id='" + k.id + "' class='item-checkRadio' type='radio' name='item-checkRadio'>" + k.deptName;
                    resStr += "</div></li>";
                })
                $(".role_group_con").html(resStr);
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

//获取所有平台列表
function normalPlatFun() {
    $.ajax({
        url: normalPlatUrl,
        type: 'post',
        dataType: 'json',
        catch: false,
        sync: false,
        success: function (data) {
            debugger;
            if (data.success == true) {
                var res = data.data;
                var resStr = "";
                $(res).each(function (j, k) {
                    resStr += "<li class='col-sm-3'><div class='row'>";
                    resStr += "<input data-id='" + k.platformId + "' class='item-check' type='checkbox' name='item-check'>" + k.platformName;
                    resStr += "</div></li>";
                })
                $(".role_plat_con").html(resStr);
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


/*点击角色列表中编辑触发函数*/
function roloe_edit(obj) {
    var renameFlag = false;
    var renameEGFlag = false;
    var renameDescFlag = false;
    var renamePlatFlag = false;
    var renameGropFlag = false;
    var $this = $(obj);
    var _roleId = $this.parent().data("id");
    $(".index_mask", parent.document).show();
    var html = template('test_mask_catch', {});
    $.popwin(html, {
        title: '编辑角色',
        fixed: true,
        drag: false, //是否可拖拽
    });
    $("#popwin_Out").addClass("role_Style");
    $.popwin.setPosition(610, 720);
    normalRoleGroupFun();
    normalPlatFun();
    $("#popwin_Close").on("click", function () {
        $("#popwin_Blank").remove();
        $("#popwin_Out").remove();
        $(".index_mask", parent.document).hide();
    })
    //回填用户数据
    $.ajax({
        url: return_roleInfoUrl,
        type: 'post',
        dataType: 'json',
        data: {
            roleId: _roleId
        },
        catch: false,
        sync: false,
        success: function (data) {
            if (data.success == true) {
                var role_name = data.data.roleName;
                var role_nameEG = data.data.engName;
                var role_nameDesc = data.data.roleDesc;
                var platformIdHas = [];
                var userGroupIdHas = data.data.userDept.id;
                debugger;
                $(data.data.userPlatforms).each(function (i, v) {
                    platformIdHas.push(v.platformId)
                })
                $(".role_Name_input").val(role_name)
                $(".role_NameEG_input").val(role_nameEG).attr("disabled","disabled");
                $(".role_desc_input").val(role_nameDesc)
                $(".item-checkRadio").each(function () {
                    debugger;
                    if ($(this).data("id") == userGroupIdHas) {
                        $(this).prop('checked', true);
                    }
                });
                $(".item-check").each(function (yy, zz) {
                    $(platformIdHas).each(function (y, z) {
                        if ($(zz).data("id") == z) {
                            $(zz).prop('checked', true);
                        }
                    })

                })
            } else {

            }
        }
    });
    //角色名称输入框失焦事件
    $(".role_Name_input").blur(function () {
        if (regex_reName.test($.trim($('.role_Name_input').val()))) {
            $('.role_Name_tip').hide();
            renameFlag = true;
        } else {
            $('.role_Name_tip').show();
            $('.role_Name_tip').html('不可空置/支持中英文，最多32个字符').show();
            renameFlag = false;
        }
    });
    //角色英文标识输入框失焦事件
    $(".role_NameEG_input").blur(function () {
        if (regex_reNameEG.test($.trim($('.role_NameEG_input').val()))) {
            $('.role_NameEG_tip').hide();
            renameEGFlag = true;
        } else {
            $('.role_NameEG_tip').show();
            $('.role_NameEG_tip').html('不可空置，最多32个字符').show();
            renameEGFlag = false;
        }
    });
    //角色描述失焦事件
    $(".role_desc_input").blur(function () {
        if (regex_reName.test($.trim($('.role_desc_input').val()))) {
            $('.role_desc_tip').hide();
            renameDescFlag = true;
        } else {
            $('.role_desc_tip').show();
            $('.role_desc_tip').html('不可空置，最多32个字符').show();
            renameDescFlag = false;
        }
    });
    //编辑提交按钮事件
    $(document).off('click').on('click', '.sure_xsBtn', function () {
        var _roleName = $.trim($('.role_Name_input').val());
        var _roleDesc = $.trim($('.role_desc_input').val());
        var _engName = $.trim($('.role_NameEG_input').val());
        var _deptId = "";//角色组
        var _platforms = [];//平台
        $(".item-check:checked").each(function () {
            _platforms.push($(this).data("id"));//平台
        });
        _platforms = _platforms.toString();
        $(".item-checkRadio:checked").each(function () {//角色组
            _deptId = $(this).data("id");
        })
        //角色名
        if (!regex_reName.test(_roleName)) {
            $('.role_Name_tip').html('不可空置/支持中英文，最多32个字符').show();
            renameFlag = false;
            return false;
        } else {
            $(".role_Name_tip").hide();
            renameFlag = true;
        }
        renameEGFlag = true;
        //角色描述
        if (!regex_reName.test(_roleDesc)) {
            renameDescFlag = false;
            $('.role_desc_tip').html('不可空置/支持中英文，最多32个字符').show();
            return false;
        } else {
            $(".role_desc_tip").hide();
            renameDescFlag = true;
        }
        var platCheckbox = $(".item-check:checked");
        if (platCheckbox.length == 0) {
            $(".role_plat_tip").html("请选择所属平台").show();
            renamePlatFlag = false;
            return false;
        } else {
            $(".role_plat_tip").html("请选择所属平台").hide();
            renamePlatFlag = true;
        }
        var roleGroupCheckbox = $(".item-checkRadio:checked");
        if (roleGroupCheckbox.length == 0) {
            $(".role_group_tip").html("请选择角色组").show();
            renameGropFlag = false;
            return false;
        } else {
            $(".role_group_tip").html("请选择角色组").hide();
            renameGropFlag = true;
        }
        //此时开始ajax交互。
        if (renameFlag && renameDescFlag && renamePlatFlag && renameGropFlag) {
            var param = {
                id: _roleId,
                roleName: _roleName,
                roleDesc: _roleDesc,
                deptId: _deptId,
                platforms: _platforms
            };
            debugger;
            role_editFun(param);
        }


    });
}

//编辑角色交互ajax
function role_editFun(params) {
    debugger;
    $.ajax({
        url: edit_role_pushUrl,
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
                $(".attr_manag_add .mask_tip").html("编辑成功");
                searchNowPage()
                searchPage(_nowPage);
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

function searchNowPage() {//首次两参进入
    var a;
    a = pagination.returnParams();
    _nowPage = a.currentPageNo;

};