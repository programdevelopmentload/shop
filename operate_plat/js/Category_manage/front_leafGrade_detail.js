var _id = $.getUrlParam("id");//本行数据id
var _levelSign = $.getUrlParam("level");//本行数据id
//前缀地址变量
// var localUrl = 'http://172.16.41.23:8007';
var localUrl = getBaseUrl('w');//名扬
//依据id抓取底部数据url
var attr_belongTypeUrl = localUrl + '/goods/GoodsClassificationFront/showLeaf';
// var attr_belongTypeUrl = "dibusanji.json";
//依据id抓取顶部信息
var attr_infoUrl = localUrl + '/goods/GoodsClassificationFront/findByIdCh';
//关闭开启按钮请求地址
var attr_switchUrl = localUrl + '/goods/GoodsClassificationFront/openClose';
//删除函数
var attr_delUrl = localUrl + '/goods/GoodsClassificationFront/del';
//改名函数
var attr_renameUrl = localUrl + '/goods/GoodsClassificationFront/change';

$.sidebarMenu($('.sidebar-menu'));
// var _selfUrl = window.location.href;
$('.sky').click(function () {
    self.location = document.referrer;
});
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
var _name;//分类名称
var _updateTime;//创建时间
var _necessary;//是否必填
var _state;//分类状态
var _type;//属性类型
var _unit;//属性单位

$(function () {
    debugger;
    attr_belongInfoPull(attr_belongTypeUrl);

    attr_InfoPull(attr_infoUrl);
    //事件触发有三个。【添加按钮为页面跳转行为控制】
    //switch开关控制事件
    $('.everyGrade_switch').on('click', function () {

        if(_state == 0){
            _up_State = 1;
        }else{
            _up_State = 0;
        }
        var params = {
            id: _id,
            state: _up_State
        };
        switch_runFun(params);
    });
    //删除触发
    $('.everyGrade_dele').on('click', function () {
        var params = {
            id: _id
        };
        delete_runFun(params);
    });
});

//依据id拉取底部详细信息函数
function attr_belongInfoPull(attr_belongTypeUrl){
    debugger;
    var params = {
        id:_id
    };
    var dataJson = {};
    $.ajax({
        type: "post",
        catch: false,
        async:false,
        url: attr_belongTypeUrl,
        dataType: "json",
        data: params,
        success: function (res) {
            debugger;
            if (res.success == true) {
                var arr = [];//空数组
                var data = res.data;//提取数组
                for (var i = 0; i < data.length; i++) {
                    if (data[i].parentId == 0) {
                        debugger;
                        var obj = {};//存储所有一级的键值对
                        obj.id = data[i].id;
                        obj.name = data[i].name;
                        var secondArr = [];
                        for (var j = 0; j < data.length; j++) {
                            debugger;
                            if (data[j].parentId == obj.id) {
                                var obj2 = {};
                                obj2.id = data[j].id;
                                obj2.name = data[j].name;
                                //存储新对象进入每一个一级目录中
                                secondArr.push(obj2);
                                var thirdArr = [];
                                for (var k = 0; k < data.length; k++) {
                                    var obj3 = {};
                                    if (data[k].parentId == obj2.id) {
                                        obj3.id = data[k].id;
                                        obj3.name = data[k].name;
                                        thirdArr.push(obj3);
                                    }

                                }
                                obj2.child = thirdArr;
                            }

                            //遍历3级菜单；
                        }
                        obj.child = secondArr;
                        arr.push(obj);
                        debugger;
                    }
                };
                debugger;
                dataJson.options = arr;
                var html = template("belong_box", dataJson);//模板引擎
                $('.belong_box_con').append(html);
            } else {
                $(".index_mask",parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410,560);
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask",parent.document).hide();
                })
                if(res.errorCode!=0){
                    $(".attr_manag_add .mask_tip").html(res.message);
                }
            }
        },
        error: function () {
        }
    });

}

//依据id拉取顶部单个属性详细信息函数
function attr_InfoPull(attr_infoUrl){
    debugger;
    var params = {
        id:_id
    };
    $.ajax({
        type: "post",
        catch: false,
        url: attr_infoUrl,
        dataType: "json",
        async:false,
        data: params,
        success: function (res) {
            if (res.success == true) {
                debugger;
                var data = res.data;
                _name = data.name;//分类名称
                //分类图片
                _level = data.level;//分类等级
                _path = data.path;//所属分类
                _state = data.state;//分类状态
                _imgUrl = data.picUrl;
                _updateTime = data.updateTime;//创建时间
                $(".everyGrade_unit img").attr("src",_imgUrl)
                //回显属性名称
                function nameDraw(_name){
                    var str = '';
                    if (!_name) {
                        str += '无';
                    }else{
                        str += _name;
                    }
                    $('.everyGrade_name').html(str);
                };
                //回显顶部信息关闭状态
                function attr_switchDraw(_state){
                    var str = '';
                    if (_state == 0) {
                        str += '正常';
                    }else{
                        str += '已关闭';
                    }
                    $('.everyGrade_switchState').html(str)
                };
                //回显分类等级
                function level_draw(_level) {
                    var str = "";
                    if(_level == 3){
                         str = "叶子分类"
                    }
                    $('.everyGrade_type').html(str);
                };
                //回显关闭按钮内部文字
                function switchDraw_btn(_state){
                    var str = '';
                    if (_state == 0) {
                        str += '关闭';
                    }else{
                        str += '开启';
                    }
                    $('.everyGrade_switch').html(str)
                };
                //回显创建时间
                function attr_timeDraw(_updateTime){
                    var updateTimeRes = getNowFormatDate(_updateTime);
                    var fisrtTime = updateTimeRes.substr(0,10);
                    var secondTime = updateTimeRes.substr(11);
                    if (!_updateTime) {
                        $('.everyGrade_ymd').parent().html('显示异常');
                    } else{
                        $('.everyGrade_ymd').html(fisrtTime);
                        $('.everyGrade_hms').html(secondTime);
                    };
                };
                //回显父辈从属分类关系
                function blongDraw(_path) {
                    $('.everyGrade_necessary').html(_path);
                };
                //回显从属分类
                blongDraw(_path);
                attr_switchDraw(_state);
                nameDraw(_name);
                level_draw(_level);
                switchDraw_btn(_state);
                attr_timeDraw(_updateTime);
                debugger;
                if (_levelSign == '3') {
                    $(".evg_msg_middle").show();
                    $(".switch_page_con").show();
                    $('.guide_content').html('关联信息');
                    debugger;
                    $('.everyGrade_rename').attr('href', './front_everyGrade_edit.html?selfId=' + _id + '&isLeaf=1&editSign=1&level=3&name=' + _name);

                }
            } else {
                $(".index_mask",parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410,560);
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

/*初始数据拉取交互函数*/
function initPage(_id,attr_detailUrl) {
    var param = {
        classId:_id
    };
    $.ajax({
        type: "post",
        url: attr_detailUrl,
        dataType: "json",
        data: params,
        success: function (data) {
            if (data.success == true) {//判断某个数
                everyGrade_switch(_state);
            } else {
                $(".index_mask",parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410,560);
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html(data.message);
                // alert('//提示有子类挂载，阻止删除【弹框有挂载】')

            }
        },
        error: function () {

        }
    });
}

/*开关后台交互执行函数*/
function switch_runFun(params) {
    var switch_runUrl = attr_switchUrl;
    $.ajax({
        type: "post",
        url: switch_runUrl,
        dataType: "json",
        data: params,
        success: function (data) {
            if (data.success == true) {//判断某个数
                // everyGrade_switch(_state);
                attr_InfoPull(attr_infoUrl);
            } else {
                $(".index_mask",parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410,560);
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html(data.message);
                // alert('//提示有子类挂载，阻止删除【弹框有挂载】')

            }
        },
        error: function () {

        }
    });
}

/*开关渲染函数*/
function everyGrade_switch(_state) {
    if (_state == 0) {
        $('.everyGrade_switch').html('关闭')
    } else {
        $('.everyGrade_switch').html('开启')
    }
    ;
};

/*删除单行数据交互函数*/
function delete_runFun(params) {
    var delete_runUrl = attr_delUrl;
    $.ajax({
        type: "post",
        url: delete_runUrl,
        dataType: "json",
        data: params,
        success: function (data) {
            if (data.success == true) {//判断返回参数中某个数据，不是这个
                // window.location.href = _selfUrl;
                window.location.href = document.referrer;
            } else {
                $(".index_mask",parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410,560);
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html(data.message);
                // alert('阻止删除【弹框提示】')
            }
        },
        error: function () {
            $(".index_mask",parent.document).show();
            var html = template('ajax_alert', {});
            $.popwin(html, {
                title: '',
                fixed: true,
                drag: false, //是否可拖拽
            });
            $("#popwin_Out").addClass("attr_manag_add");
            $.popwin.setPosition(410,560);
            $("#popwin_Close").on("click", function () {
                $("#popwin_Blank").remove();
                $("#popwin_Out").remove();
                $(".index_mask",parent.document).hide();
            })
            $(".attr_manag_add .mask_tip").html("未连接到数据库");
            // alert('未连接到数据库')
        }
    });
};

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

};

/*更改名称交互函数*/
function grade_Rename_link(params) {
    $.ajax({
        url: attr_renameUrl,
        type: 'post',
        dataType: 'json',
        data: params,
        success: function (data) {
            if (data.message == '成功') {
                $('#popwin_Close').click();//@此处思考下到底怎么处理
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410,460);
                $(".attr_manag_add .mask_tip").html("更改名称成功");
                // alert('更改名称成功');
                attr_InfoPull(attr_infoUrl);
            } else {
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410,460);
                $(".attr_manag_add .mask_tip").html("该名称已经存在");
                // alert('该名称已经存在')
            }
        },
        error: function () {
            var html = template('ajax_alert', {});
            $.popwin(html, {
                title: '',
                fixed: true,
                drag: false, //是否可拖拽
            });
            $("#popwin_Out").addClass("attr_manag_add");
            $.popwin.setPosition(410,460);
            $(".attr_manag_add .mask_tip").html("连接错误");
            // alert('连接错误');
        }
    });
}

