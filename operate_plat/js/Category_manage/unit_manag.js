//分页地址变量
var localUrl = getBaseUrl('w');
//单位分页地址
var unit_pageUrl = localUrl + '/goods/unit/showAll';
// var unit_pageUrl = "./shuxingguanli.json";
var add_unitUrl = localUrl + '/goods/unit//add';
var renameFlag = false;
var _nowPage = 1;
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    searchPage();
    $('.pageSize_switch').on('change', function () {
        searchPage();
    })
    //点击添加单位按钮
    $(".everyGradeAdd").off("click").on("click", function () {
        // var idArr = new Array();
        $(".index_mask",parent.document).show();
        var html = template('class_bubble', {});
        $.popwin(html, {
            title: '',
            fixed: true,
            drag: false, //是否可拖拽
        });
        $("#popwin_Out").addClass("attr_manag_add");
        $.popwin.setPosition(600, 450);
        $("#popwin_Close").on("click", function () {
            $("#popwin_Blank").remove();
            $("#popwin_Out").remove();
            $(".index_mask",parent.document).hide();
        })
        //点击加号，累加单位一栏
        $(".everyAdd_btn").on("click", function () {

            var _everyAdd_input = $.trim($(".everyAdd_unitInput").val());
            $(".everyAdd_unitInput").val("");
            if (_everyAdd_input.length >= 1) {
                $('.attr_add_unit').before($('<div><input data-push="' + _everyAdd_input + '" type="text" placeholder="' + _everyAdd_input + '" class="form-control already_unitInput"></div>'))
            }
            $(".already_unitInput").eq(-2).val(_everyAdd_input);
        });
        $('body').off('click').on('click', '.cancle_xsBtn', function () {
            $("#popwin_Blank").remove();
            $("#popwin_Out").remove();
            $(".index_mask",parent.document).hide();
        });
        $(document).off('click').on('click', '.sure_xsBtn', function () {
            //此时开始ajax交互。
            var push_unit = [];
            $(".already_unitInput").each(function () {
                if($.trim($(this).val()).length>0){
                    push_unit.push($.trim($(this).val()));
                }
            });
            push_unit = push_unit.toString();
            debugger
            if (push_unit.length > 0) {
                debugger;
                var param = {
                    units: push_unit
                }
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
                            $(".attr_manag_add .mask_tip").html("添加成功");
                            // alert('添加成功')
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
                            $(".attr_manag_add .mask_tip").html("您添加的单位名已存在");
                            // alert(msg);
                        }
                    }
                });
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

var pagination = new Pagination(unit_pageUrl, "page", function (data) {
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
                '<td>' + data[i].unit + '</td>' +       //属性名称
                '</tr>'
            );
        }
        ;
    }
};

function searchNowPage() {//首次两参进入
    var a;
    a = pagination.returnParams();
    _nowPage = a.currentPageNo;
};

