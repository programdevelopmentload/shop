// var localHtttp = 'http://172.16.41.23:8007';//王喧
var localHtttp = getBaseUrl('w');//王喧
//分页
var backstage_dividePageUrl = localHtttp + '/goods/GoodsClassificationFront/findByLevel';
// var backstage_dividePageUrl = "http://172.16.38.207:8007//goods/GoodsClassificationFront/findByLevel";
var switch_runUrl = localHtttp + '/goods/GoodsClassificationFront/openClose';
//删除函数
var delete_runUrl = localHtttp + '/goods/GoodsClassificationFront/del';
//改名函数
var rename_runUrl = localHtttp + '/goods/GoodsClassificationFront/change';
//行上移
var upUrl = localHtttp + '/goods/GoodsClassificationFront/upClass';
//行置顶
var topUrl = localHtttp + '/goods/GoodsClassificationFront/topClass';
//行下移
var downUrl = localHtttp + '/goods/GoodsClassificationFront/downClass';
//行置底
var bottomUrl = localHtttp + '/goods/GoodsClassificationFront/bottomClass';
var _nowPage = 1;

var renameFlag = false;
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    //测试前进回退
    // $('.moon').click(function () {
    //     window.location.href="http://localhost:63342/operate_plat/html/Category_manage/backstage_everyGrade_detail.html";
    //     // window.location.href='www.baidu.com';
    // })
    //模拟按钮事件绑定

    searchPage();
    checkAll("show");//测试代码
    /**点击批量整合测试按钮*/
    $(".ceshi").on("click", function () {
        var idArr = new Array();
        if ($("#table_data tbody tr input:checked").length == 0) {
            // $window.find("#jumpBox2").show().find("span").html("请至少选择一项");
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
            $(".attr_manag_add .mask_tip").html("请至少选择一项");
        } else {
            $("#table_data tbody tr input:checked").each(function (i, e) {
                idArr.push($(e).parent().parent().data("id"));
            });
            if (idArr.length === $("#table_data tbody tr input:checked").length) {
                console.log(idArr);
            }
        }
    });
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

var pagination = new Pagination(backstage_dividePageUrl, "page", function (data) {
    fillTableData(data)
});

function searchPage(page) {//首次两参进入
    pagination.search(getParams(), page);
};

function searchNowPage() {//首次两参进入
    var a;
    a = pagination.returnParams();
    _nowPage = a.currentPageNo;
};

/** 得到搜索条件的json对象 */
function getParams() {
    var pageSize = $('.pageSize_switch').val();
    var params = {
        'level': 1,
        'pageSize': pageSize,//当前每页有多少行
        'currentPage': 2
    };
    return params;
};

/** table数据 */
function fillTableData(data) {
    debugger;
    if (data.length == 0 || !data.length) {   //没有资源时
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
                '<tr data-id="' + data[i].id + '">' +
                // '<td><input type="checkbox" name="front_top" class="item-check" id=' + data[i].id + '/></td>' +
                '<td>' + data[i].name + '</td>' +       //分类名称
                '<td>' + levelDraw(data[i].level) + '</td>' +      //分类等级
                '<td data-id="' + data[i].id + '"><span class="moveTop icon iconfont top_arrow" onclick="moveTop(this)"></span><span class="moveUp icon iconfont up_arrow" onclick="moveUp(this)"></span><span class="moveDown icon iconfont down_arrow" onclick="moveDown(this)"></span><span class="moveBottom icon iconfont bottom_arrow" onclick=" moveBottom(this)"></span></td>' +       //移动
                '<td>' + stateDraw(data[i].state) + '</td>' +       //分类状态
                // '<td data-id="' + data[i].id + '" data-state="' + data[i].state + '" data-name="' + data[i].name + '">' + ' <a class="_look sm btn-sm btn-primary" href="./front_everyGrade_detail.html?id=' + data[i].id + '&name=' + data[i].name + '&updateTime=' + data[i].updateTime + '&state=' + data[i].state + '&isLeaf=' + data[i].isLeaf + '&level=' + data[i].level + '">查看</a><button class="_change btn-sm btn-warning" onclick="grade_Rename(this)">更改名称</button><button class="_open btn-sm btn-success" onclick="grade_Switch(this,switch_runUrl)">' + ctr_Switch(data[i].state) + '</button><button class="_close sm btn-danger btn-sm" onclick="grade_Delete(this,delete_runUrl)">删除</button>' + '</td>' +       //操作
                '<td data-id="' + data[i].id + '" data-state="' + data[i].state + '" data-name="' + data[i].name + '">' + ' <a class="_look page_miniBtn" href="./front_everyGrade_detail.html?id=' + data[i].id + '&name=' + data[i].name + '&updateTime=' + data[i].updateTime + '&state=' + data[i].state + '&isLeaf=' + data[i].isLeaf + '&level=' + data[i].level + '">查看</a><a class="_change page_miniBtn" href="./front_everyGrade_edit.html?selfId=' + data[i].id + '&editSign=1' + '&name=' + data[i].name + '&updateTime=' + data[i].updateTime + '&state=' + data[i].state + '&isLeaf=' + data[i].isLeaf + '&level=' + data[i].level + '">编辑</a><button class="_open page_miniBtn" onclick="grade_Switch(this,switch_runUrl)">' + ctr_Switch(data[i].state) + '</button><button class="_close page_miniBtn" onclick="grade_Delete(this,delete_runUrl)">删除</button>' + '</td>' +       //操作
                // '<td data-id="' + data[i].id + '" data-state="' + data[i].state + '" data-name="' + data[i].name + '">' + ' <a class="_look sm btn-sm btn-primary" href="./front_everyGrade_detail.html?id=' + data[i].id + '&name=' + data[i].name + '&updateTime=' + data[i].updateTime + '&state=' + data[i].state + '&isLeaf=' + data[i].isLeaf + '&level=' + data[i].level + '">查看</a><button class="_open btn-sm btn-success" onclick="grade_Switch(this,switch_runUrl)">' + ctr_Switch(data[i].state) + '</button><button class="_close sm btn-danger btn-sm" onclick="grade_Delete(this,delete_runUrl)">删除</button>' + '</td>' +       //操作
                '</tr>'
            );
        }
        ;
    }
};

/*分页分类状态中文汉字渲染函数*/
function stateDraw(params) {
    var str = '';
    if (params == 0) {
        str += '开启'
    } else {
        str += '关闭'
    }
    return str;
}

/*分页分类等级中文汉字渲染函数*/
function levelDraw(params) {
    var str = '';
    if (params == 1) {
        str += '一级'
    } else if (params == 2) {
        str += '二级'
    } else {
        str += '叶子分类'
    }
    return str;
}

/*单行删除按钮触发函数*/
function grade_Delete(obj, delete_runUrl) {
    //抓取该行数据id
    var $this = $(obj);
    var _id = $this.parent().data("id");
    var params = {
        id: _id
    };
    delete_runFun(params, delete_runUrl);
}

/*删除单行数据执行函数*/
function delete_runFun(params, delete_runUrl) {
    $.ajax({
        type: "post",
        url: delete_runUrl,
        dataType: "json",
        data: params,
        success: function (data) {
            if (data.success == true) {//判断返回参数中某个数据，不是这个
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
                $(".attr_manag_add .mask_tip").html(data.message);
                // alert('此分类下有挂载商品,请先删除商品')
            }
        },
        error: function () {
        }
    });
}

/*开关渲染控制函数*/
function ctr_Switch(params) {
    var str = "";
    if (params == 0) {//0是开启
        str += '关闭';
    } else {
        str += '开启';
    }
    return str;
}

/*开关控制函数*/
function grade_Switch(obj, switch_runUrl) {
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
    switch_runFun(params, switch_runUrl);
}

/*开关后台交互执行函数*/
function switch_runFun(params, switch_runUrl) {
    debugger;
    $.ajax({
        type: "post",
        catch: false,
        url: switch_runUrl,
        dataType: "json",
        data: params,
        success: function (data) {
            if (data.success == true) {
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
                $(".attr_manag_add .mask_tip").html("有子类挂载，解除所有挂载才能关闭");
                // alert("该等级下有挂载，不可关闭")

            }
        },
        error: function () {
        }
    });
}

/*更改名称触发函数*/
function grade_Rename(obj) {
    $(".index_mask",parent.document).show();
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
            name: _newName
        };
        if (renameFlag) {
            grade_Rename_link(param, rename_runUrl);
        } else {
            $('.grade_newName_tip').html('不可空置/支持中英文，最多32个字符').show();
        }
    })
}

/*更改名称交互函数*/
function grade_Rename_link(params, rename_runUrl) {
    $.ajax({
        url: rename_runUrl,
        type: 'post',
        dataType: 'json',
        catch: false,
        sync: false,
        data: params,
        success: function (data) {
            if (data.success == true) {
                $('#popwin_Close').click();//@此处思考下到底怎么处理
                searchNowPage()
                searchPage(_nowPage);
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410, 460);
                $(".attr_manag_add .mask_tip").html("更改名称成功");
                // alert('更改名称成功');
            } else {
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410, 460);
                $(".attr_manag_add .mask_tip").html("该名称已经存在");
                // alert('该名称已经存在')
            }
        }
    });
}

//每行上移执行函数
function moveUp(obj) {
    $this = $(obj);
    var _id = $this.parent().data("id");
    var params = {
        id: _id
    };
    $.ajax({
        url: upUrl,
        type: 'post',
        catch: false,
        sync: false,
        dataType: 'json',
        data: params,
        success: function (data) {
            if (data.success == true) {
                $('#popwin_Close').click();//@此处思考下到底怎么处理

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
                $(".attr_manag_add .mask_tip").html("移动成功");
                searchNowPage();
                searchPage(_nowPage);
                // alert('更改名称成功');
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
                if (data.errorCode != 0) {
                    $(".attr_manag_add .mask_tip").html(data.message);
                }
                // alert('该名称已经存在')
            }
        }
    });
}

//每行置顶执行函数
function moveTop(obj) {
    $this = $(obj);
    var _id = $this.parent().data("id");
    var params = {
        id: _id
    };
    $.ajax({
        url: topUrl,
        type: 'post',
        catch: false,
        sync: false,
        dataType: 'json',
        data: params,
        success: function (data) {
            if (data.success == true) {
                $('#popwin_Close').click();//@此处思考下到底怎么处理
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
                $(".attr_manag_add .mask_tip").html("移动成功");
                searchNowPage();
                searchPage(_nowPage);//当我完成交互，刷新分页的时候，目前并没有完成功能
                // alert('更改名称成功');
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
                // alert('该名称已经存在')
            }
        }
    });
}

//每行下移执行函数
function moveDown(obj) {
    $this = $(obj);
    var _id = $this.parent().data("id");
    var params = {
        id: _id
    };
    $.ajax({
        url: downUrl,
        type: 'post',
        catch: false,
        sync: false,
        dataType: 'json',
        data: params,
        success: function (data) {
            if (data.success == true) {
                $('#popwin_Close').click();//@此处思考下到底怎么处理
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
                $(".attr_manag_add .mask_tip").html("移动成功");
                searchNowPage();
                searchPage(_nowPage);//当我完成交互，刷新分页的时候，目前并没有完成功能
                // alert('更改名称成功');
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
                if (data.errorCode != 0) {
                    $(".attr_manag_add .mask_tip").html(data.message);
                }
                // alert('该名称已经存在')
            }
        }
    });
}

//每行置底执行函数
function moveBottom(obj) {
    $this = $(obj);
    var _id = $this.parent().data("id");
    var params = {
        id: _id
    };
    $.ajax({
        url: bottomUrl,
        type: 'post',
        catch: false,
        sync: false,
        dataType: 'json',
        data: params,
        success: function (data) {
            if (data.success == true) {
                $('#popwin_Close').click();//@此处思考下到底怎么处理
                searchPage();
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
                $(".attr_manag_add .mask_tip").html("移动成功");
                searchNowPage();
                searchPage(_nowPage);//当我完成交互，刷新分页的时候，目前并没有完成功能
                // alert('更改名称成功');
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
                // alert('该名称已经存在')
            }
        }
    });
}