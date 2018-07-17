var _roleid = $.getUrlParam("roleid");//本行数据id;

var localUrl = getBaseUrl('lh');
//分配权限提交地址【最后提交分配权限】
var role_distributionUrl = localUrl + '/user/permission/allotMenu';
//分配权限拉取所有一二级菜单【渲染所有复选框】
var allMenu_Url = localUrl + '/user/menu/getAllMenu';
//分配权限拉取用户已有一二级菜单【回填复选框】
var userHasMenu_Url = localUrl + '/user/permission/toAllotMenu';

//提交旗帜
var checkFlag = true;
$(function () {
    pullAllMenu();
    $(".sure_smBtn ").on("click", function () {
        var $oneLevelCheck = $(".oneLevelCheck:checked");
        var pushArr = [];
        $(".item-check")
        $oneLevelCheck.each(function (i, v) {
            debugger;
            var a = $(v).parent().next().find("input:checked");
            if (a.length == 0) {
                checkFlag = false;
                $(v).parent().parent().find('.check_tip').show();
            } else {
                checkFlag = true;
                $(v).parent().parent().find('.check_tip').hide();
            }
        })
        $(".item-check:checked").each(function () {
            pushArr.push($(this).data("id"));
        });
        $(".all-check:checked").each(function () {
            pushArr.push($(this).data("id"));
        });
        // pushArr = JSON.stringify(pushArr);
        if (pushArr.length == 0) {
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
            $(".attr_manag_add .mask_tip").html("请至少勾选一个一级菜单");
            return false;
        }
        pushArr = pushArr.toString();
        if (checkFlag) {
            var params = {
                'roleId': _roleid,
                'list': pushArr
            }
            role_distributionFun(params);
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
            $(".attr_manag_add .mask_tip").html("请至少勾选一个二级菜单");
            return false;
        }
    });
    $(".oneLevelCheck").change(function () {
        debugger
        if ($(this).prop("checked") == true) {
            $(this).parent().next().show()
        } else {
            $(this).parent().next().find("input").prop("checked", false)
            $(this).parent().next().hide()
        }
    })

})


//拉取所有菜单
function pullAllMenu() {
    $.ajax({
        type: "post",
        catch: false,
        sync: false,
        url: allMenu_Url,
        dataType: "json",
        success: function (data) {
            if (data.success == true) {
                var res = data.data;
                var str = "";
                $(res).each(function (i, v) {
                    str += "<li>";
                    str += "<p><input data-id='" + v.id + "' class='oneLevelCheck all-check'" + v.id + "' type='checkbox'>" + v.menuName + "</p>";
                    str += "<ul class='clearfix hide_ctr'>";
                    if (v.childMenu != undefined) {
                        $(v.childMenu).each(function (j, k) {
                            var leafId = k.id.toString();
                            str += "<li class='col-xs-3'><input data-id='" + leafId + "' class='item-check item-check" + leafId + "' type='checkbox' name='item-check item-check" + leafId + "'>" + k.menuName + "</li>"
                        })
                    }
                    str += "</ul><div class='check_tip hide_ctr'>此处勾选了一级菜单，请选择二级菜单</div></li>";
                })
                $(".assign_ul").html(str);
                $(".oneLevelCheck").change(function () {
                    debugger
                    if ($(this).prop("checked") == true) {
                        $(this).parent().next().show()
                    } else {
                        $(this).parent().next().find("input").prop("checked", false)
                        $(this).parent().next().hide()
                    }
                    $(this).parent().parent().find(".item-check").change(function () {
                        debugger;
                        if ($(this).parent().find(".item-check:checked").length > 0) {
                            $(this).parent().parent().parent().find('.check_tip').hide();
                        } else {
                            $(this).parent().parent().parent().find('.check_tip').show();
                        }
                    })
                });
                userHasMenuFun();

            }
        },
        error: function () {
        }
    });
}

//回填分配角色权限提交函数
function userHasMenuFun() {
    var params = {
        roleId: _roleid
    };
    $.ajax({
        type: "post",
        catch: false,
        url: userHasMenu_Url,
        data: params,
        sync: false,
        dataType: "json",
        success: function (data) {
            if (data.success == true) {
                var res = data.data;
                $("input[type=checkbox]").each(function (e, f) {
                    $(res).each(function (g, h) {
                        if ($(f).data("id") == h) {
                            $(f).attr("checked", true)
                        }

                    })
                })
                $(".assign_ul>li").each(function () {
                    debugger
                    if ($(this).find(".item-check:checked").length > 0) {
                        $(this).find("ul").show();
                    }
                })
            }
        },
        error: function () {
        }
    });
}

//分配角色权限提交函数
function role_distributionFun(params) {
    $.ajax({
        type: "post",
        // headers: {
        //     'Accept': 'application/json',
        //     'Content-Type': 'application/json'
        // },
        catch: false,
        url: role_distributionUrl,
        data: params,
        dataType: "json",
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
                $.popwin.setPosition(410, 560);
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask", parent.document).hide();
                    self.location = document.referrer;
                })
                $(".attr_manag_add .mask_tip").html("保存成功");
            }
        },
        error: function () {
        }
    });
}



