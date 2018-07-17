//分页地址变量
var localUrl = getBaseUrl('w');
//品牌分页地址
var brand_pageUrl = localUrl + '/goods/brand/showBrand';
//删除函数
var brand_delUrl = localUrl + '/goods/brand/deleteBrand';
//开关函数【目前空缺】
var brand_switchUrl = localUrl + '/goods/brand/openClose';
//改名函数【目前空缺】
var brand_renameUrl = localUrl + '/goods/brand/changeName';

var renameFlag = false;
var _nowPage = 1;
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    debugger;
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

var pagination = new Pagination(brand_pageUrl, "page", function (data) {
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
        var content1 = $(".sky");
        content.html("");
        var str = '';
        for (var i = 0; i < data.length; i++) {
            // '<a>跳转到'+data[i].param+'这里</a>'
            str += '<tr data-id="' + '">'
            str += '<td>' + data[i].nameCh + '</td>';      //分类名称
            str += '<td><img class="logo_img" src="' + data[i].logo + '" alt=""/></td>';      //分类等级
            str += '<td>' + stateDraw(data[i].state) + '</td>';      //分类状态
            str += '<td data-id="' + data[i].id + '" data-state="' + data[i].state + '" data-name="' + data[i].nameCh + '">' + ' <a class="_look page_miniBtn" href="./brand_manag_detail.html?id=' + data[i].id + '&name=' + data[i].name + '&updateTime=' + data[i].updateTime + '&state=' + data[i].state + '&isLeaf=' + data[i].isLeaf + '&level=' + data[i].level + '">查看</a>';
            str += '<a onclick="edit_Switch(this)" class="page_miniBtn">编辑关联分类</a>';

            // if (data[i].state = 0) {
            //     str += '<a onclick="edit_Switch(this)" class="edit_no_change btn-sm btn-warning">编辑关联分类</a>';
            //
            // } else {
            //     str += '<a onclick="edit_Switch(this)" class="edit_pass_change btn-sm btn-warning">编辑关联分类</a>';
            //
            // };
            debugger;
            str += '<button class="_open page_miniBtn" onclick="grade_Switch(this)">' + ctr_Switch(data[i].state) + '</button><button class="_close page_miniBtn" onclick="grade_Delete(this)">删除</button>' + '</td>';       //操作
            str += '</tr>'
            ;
        }
        content.html(str);
    }
};

/*分类状态中文汉字渲染函数*/
function stateDraw(params) {
    var str = '';
    if (params == 0) {

        str += '开启'
    } else {
        str += '关闭'
    }
    return str;
}

//编辑是否跳转控制
function edit_Switch(obj) {
    debugger;
    var a = $(obj).parent().data("state");//1为关闭
    var a_id = $(obj).parent().data("id");
    debugger;
    if (a == 1) {
        $(".index_mask",parent.document).show();
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
            $(".index_mask",parent.document).hide();
        })
        $(".attr_manag_add .mask_tip").html("请打开状态后编辑");
    } else {
        window.location.href = "../../html/Category_manage/brand_manag_edit.html?&id=" + a_id;
    }
}

/*单行删除按钮触发函数*/
function grade_Delete(obj) {

    //抓取该行数据id
    var $this = $(obj);
    var _id = $this.parent().data("id");
    var params = {
        brandId: _id
    };
    delete_runFun(params, brand_delUrl);
}

/*删除单行数据执行函数*/
function delete_runFun(params, brand_delUrl) {
    $.ajax({
        type: "post",
        url: brand_delUrl,
        dataType: "json",
        data: params,
        success: function (data) {

            if (data.success == true) {//判断返回参数中某个数据，不是这个
                $(".index_mask",parent.document).show();
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
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html(data.message);
                searchNowPage();
                searchPage(_nowPage);
            } else {
                $(".index_mask",parent.document).show();
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
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html(data.message);
                // alert('
                //
                //
                //
                // 此分类下有挂载商品,请先删除商品')
            }
        },
        error: function () {
        }
    });
}

/*开关渲染控制函数*/
function ctr_Switch(params) {
   var strs = '';
    if (params == 0) {//0是开启
        strs += '关闭';
    } else {
        strs += '开启';
    }
    return strs;
}

/*开关控制函数*/
function grade_Switch(obj) {
    debugger;
    //抓取该行数据id
    var $this = $(obj);
    var _id = $this.parent().data("id");
    var old_state = +$this.parent().data("state");
    var _push_state;
    if (old_state == 0) {
        _push_state = 1
    } else {
        _push_state = 0;
    }
    var params = {
        id: _id,
        state: _push_state
    };
    console.log(params);
    switch_runFun(params);
}

/*开关后台交互执行函数*/
function switch_runFun(params) {
    debugger;
    $.ajax({
        type: "post",
        catch: false,
        url: brand_switchUrl,
        dataType: "json",
        data: params,
        success: function (data) {
            debugger;
            if (data.success == true) {
                $(".index_mask",parent.document).show();
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
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html("操作成功");
                searchNowPage();
                searchPage(_nowPage);//当我完成交互，刷新分页的时候，目前并没有完成功能
            } else {
                $(".index_mask",parent.document).show();
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
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html("不可关闭");
            }
        },
        error: function () {
        }
    });
}

/*更改名称触发函数*/
function grade_Rename(obj, brand_renameUrl) {

    let html = template('test_mask_catch', {});
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
            renameFlag = regex_reName.test($('.grade_newName_input').val());
        param = {
            id: _id,
            newName: _newName
        };

        if (renameFlag) {
            grade_Rename_link(param, brand_renameUrl);
        } else {
            $('.grade_newName_tip').html('不可空置/支持中英文，最多32个字符').show();
        }
    })
}

/*更改名称交互函数*/
function grade_Rename_link(params, brand_renameUrl) {
    $.ajax({
        url: brand_renameUrl,
        type: 'post',
        dataType: 'json',
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
                $.popwin.setPosition(410, 460);
                $(".attr_manag_add .mask_tip").html("更改名称成功");
                searchNowPage()
                searchPage(_nowPage);
            } else {
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410, 460);
                $(".attr_manag_add .mask_tip").html("不可更改");
            }
        }
    });
};

function searchNowPage() {//首次两参进入
    var a;
    a = pagination.returnParams();
    _nowPage = a.currentPageNo;
};