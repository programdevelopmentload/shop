var localHtttp = getBaseUrl('lh');
var _editSign = +$.getUrlParam("editSign");//编辑还是增加，编辑是1，增加是0

//添加菜单地址url
var roleMenuAdd_Url = localHtttp + '/user/menu/addMenu';
//拉取每一级的菜单地址
var roleMenuEvery_Url = localHtttp + '/user/menu/getLevelMenu';
var _parentId = 0;


var regex_reName = /^[\s\S]{1,32}$/;
var flag = false;
var nameflag = false;
var hrefFlag = false;
$(function () {
    //菜单名称输入失焦事件
    $(".roleMenu_Add_input").blur(function () {
        debugger;
        var _name = $.trim($(".roleMenu_Add_input").val());
        if (regex_reName.test(_name)) {
            $('.model_name_tip').hide();
            nameflag = true;
        } else {
            $('.model_name_tip').html('不可空置/支持中英文，最多32个字符').show();
            nameflag = false;
        }
    });
    //
    var addDom = $(".attr_manag_con_right .btn_sure");
    $(".roleMenu_level").change(function () {
        if ($(this).val() != 0) {
            $(".roleMenu_father_level_con").show();
            var _menuLevel = 0;
            if ($(this).val() == 2) {
                _menuLevel = 1;
            } else if ($(this).val() == 3) {
                _menuLevel = 2;
            }
            var params = {
                menuLevel: _menuLevel
            }
            roleMenuEveryfun(params)
            // if($(this).val() == 1 ){
            //     $(".roleMenu_father_level").html("<option value='0'>一级</option>");
            // }else if($(this).val() == 2) {
            //     $(".roleMenu_father_level").html("<option value='1'>二级</option>");
            // }
        } else {
            $(".roleMenu_father_level_con").hide();
            _parentId = 0;
            $(".roleMenu_father_level").html("");
        }
    })
    //提交按钮
    addDom.on('click', function () {
        debugger;
        if ($(".roleMenu_Add_input").val().length > 0) {
            var _name = $.trim($(".roleMenu_Add_input").val());
            nameflag = regex_reName.test(_name);
        } else {
            nameflag = false;
        }
        debugger;
        if (!nameflag) {
            $(".roleMenu_input_tip").show();
            return false;
        } else {
            $(".roleMenu_input_tip").hide();
        }
        // hrefFlag
        if ($(".role_Menu_href").val().length > 0) {
            var _menuUrl = $.trim($(".role_Menu_href").val());
            hrefFlag = regex_reName.test(_menuUrl);
        } else {
            hrefFlag = false;
        }
        if (!hrefFlag) {
            $(".menu_href_tip").show();
            return false;
        } else {
            $(".menu_href_tip").hide();
        }
        var _parentId = $(".roleMenu_father_level").val();
        var _menuLevel = $(".roleMenu_level").val();
        if (nameflag && hrefFlag) {
            var param = {
                menuName: _name,
                menuUrl: _menuUrl,
                parentId: _parentId,
                menuLevel: _menuLevel,
            };
            roleMenuAdd_fun(param);
        }
    });
})

//添加菜单交互函数【目前还不全】
function roleMenuAdd_fun(param) {
    $.ajax({
        type: "post",
        url: roleMenuAdd_Url,
        dataType: "json",
        data: param,
        success: function (data) {
            debugger;
            if (data.success == true) {//判断返回参数中某个数据，不是这个
                $(".index_mask",parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '提示',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410, 560);
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html(data.message);

                $("#popwin_Close").on("click", function () {
                    self.location = document.referrer;
                })
            } else {
                $(".index_mask",parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '提示',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410, 560);
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html(data.message);
                // alert('该分类名已经存在')
            }
        },
        error: function () {
        }
    });
}

//获取每一级菜单交互函数【目前还不全】
function roleMenuEveryfun(param) {
    $.ajax({
        type: "post",
        url: roleMenuEvery_Url,
        dataType: "json",
        data: param,
        success: function (data) {
            debugger;
            if (data.success == true) {//判断返回参数中某个数据，不是这个
                var res = data.data;
                var str = '';
                $(res).each(function (i, v) {
                    str += "<option value='" + res.id + "'>" + res.menuName + "</option>";
                })
            } else {
                $(".index_mask",parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '提示',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410, 560);
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html(data.message);
                // alert('该分类名已经存在')
            }
        },
        error: function () {
        }
    });
}




