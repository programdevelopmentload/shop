var localHtttp = 'http://172.16.41.23:8007';
//分页
var backstage_dividePageUrl = localHtttp + '/goods/GoodsClassificationFront/showSon';
//删除
var delete_runUrl = localHtttp + '/goods/GoodsClassificationFront/del';
//开关
var switch_runUrl = localHtttp + '/goods/GoodsClassification/frontCloseOpen';
//更名
var rename_runUrl = localHtttp + '/goods/GoodsClassification/changeName';

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
}

/** 得到搜索条件的json对象 */
function getParams() {
    var pageSize = $('.pageSize_switch').val();
    var params = {
        'id': 1,
        'pageSize': pageSize
        // 'currentPage': 1,
    };
    return params;
};

/** table数据 */
function fillTableData(data) {
    // debugger;
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
            debugger;
            content.append(
                // '<a>跳转到'+data[i].param+'这里</a>'
                '<tr data-id="' + '">' +
                '<td>' + data[i].name + '</td>' +       //分类名称
                '<td>' + data[i].level + '</td>' +       //分类等级
                '<td>' + stateDraw(data[i].state) + '</td>' +       //分类状态
                '<td data-id="' + data[i].id + '" data-state="' + data[i].state + '" data-name="' + data[i].name + '">' + ' <a class="_look sm btn-sm btn-primary" href="./operate_oneGrade_detail.html?id=' + data[i].id + '&name=' + data[i].name + '&updateTime=' + data[i].updateTime + '&state=' + data[i].state + '&isLeaf=' + data[i].isLeaf + '&level=' + data[i].level + '">查看</a><button class="_change btn-sm btn-warning" onclick="grade_Rename(this)">更改名称</button><button class="_open btn-sm btn-success" onclick="grade_Switch(this,switch_runUrl)">' + ctr_Switch(data[i].state) + '</button><button class="_close sm btn-danger btn-sm" onclick="grade_Delete(this,delete_runUrl)">删除</button>' + '</td>' +       //操作
                '</tr>'
            );
        }
        ;
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

/*单行删除按钮触发函数*/
function grade_Delete(obj,delete_runUrl) {
    //抓取该行数据id
    var $this = $(obj);
    var _id = $this.parent().data("id");
    var params = {
        id: _id
    };
    delete_runFun(params,delete_runUrl);
}

/*删除单行数据执行函数*/
function delete_runFun(params,delete_runUrl) {
    $.ajax({
        type: "post",
        url: delete_runUrl,
        dataType: "json",
        data: params,
        success: function (data) {
            debugger;
            if (data.success == true) {//判断返回参数中某个数据，不是这个
                searchPage();
            } else {
                alert(data.message)
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
    debugger;
    if (params == 0) {//0是开启
        str += '关闭';
    } else {
        str += '开启';
    }
    return str;
}

/*开关控制函数*/
function grade_Switch(obj,switch_runUrl) {
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
    console.log(params);
    switch_runFun(params,switch_runUrl);
}

/*开关后台交互执行函数*/
function switch_runFun(params,switch_runUrl) {
    console.log(params);
    debugger;
    $.ajax({
        type: "post",
        catch: false,
        url: switch_runUrl,
        dataType: "json",
        data: params,
        success: function (data) {
            if (data.success == true) {
                console.log(data);
                searchPage();//当我完成交互，刷新分页的时候，目前并没有完成功能
            } else {
                alert("该等级下有挂载，不可关闭")

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
    $(".grade_RenameStyle .grade_nowName_address").html(_oldName);
    var rename_sureDom = $('.rename_sure');
    $(".grade_newName_input").blur(function () {
        if (regex_reName.test($('.grade_newName_input').val())) {
            debugger;
            $('.grade_newName_tip').hide();
            renameFlag = true;
        } else {
            $('.grade_newName_tip').html('不可空置/支持中英文，最多32个字符').show();
            renameFlag = false;
        }
    });
    rename_sureDom.on('click', function () {
        debugger;
        var _newName = $('.grade_newName_input').val(),
            renameFlag = regex_reName.test($('.grade_newName_input').val());
        param = {
            id: _id,
            name: _newName
        };
        debugger;
        if (renameFlag) {
            grade_Rename_link(param,rename_runUrl);
        } else {
            $('.grade_newName_tip').html('不可空置/支持中英文，最多32个字符').show();
        }
    })
}

/*更改名称交互函数*/
function grade_Rename_link(params,rename_runUrl) {
    $.ajax({
        url:rename_runUrl,
        type: 'post',
        dataType: 'json',
        data: params,
        success: function (data) {
            if (data.success == true) {
                $('#popwin_Close').click();//@此处思考下到底怎么处理
                searchPage();
                alert('更改名称成功');
            } else {
                alert('该名称已经存在')
            }
        }
    });
}