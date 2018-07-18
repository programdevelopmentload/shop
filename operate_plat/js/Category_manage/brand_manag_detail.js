var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
var _id = +$.getUrlParam("id");//本行数据id
// var _level;
//前缀地址变量
var localHtttp = getBaseUrl('w');
//依据id抓取底部数据url
var brand_belongTypeUrl = localHtttp + '/goods/brand/showClassById';
// var attr_belongTypeUrl = "dibusanji.json";
//id名拉取顶部品牌详情地址
var everybrandInfo_Url = localHtttp + '/goods/brand/findById';
//删除函数
var brand_delUrl = localHtttp + '/goods/brand/deleteBrand';
//改名函数【暂时空缺】
var brand_renameUrl = localHtttp + '/goods/brand/changeName';
//开关函数【目前未经过真实数据测试】
var brand_switchUrl = localHtttp + '/goods/brand/openClose';
$.sidebarMenu($('.sidebar-menu'));
// var _selfUrl = window.location.href;
$('.sky').click(function () {
    self.location = document.referrer;
});
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
var _name;//品牌名称
var _updateTime;//创建时间
var _state;//分类状态
var _brandLogo;//品牌图标
$(function () {
    //底部信息抓取
    brand_belongInfoPull(brand_belongTypeUrl);
    //顶部信息渲染
    brand_InfoPull(everybrandInfo_Url);


    //事件触发有四个。【添加按钮为页面跳转行为控制】
    //switch开关控制事件
    $('.everyGrade_switch').on('click', function () {
        var newpushState;
        if(_state == 1){
            newpushState = 0;
        }else {
            newpushState = 1;
        }
        debugger;
        var params = {
            id: _id,
            state: newpushState
        };
        switch_runFun(params);
    });
    //删除触发
    $('.everyGrade_dele').on('click', function () {
        var params = {
            brandId: _id
        };
        delete_runFun(params);
    });
    //更改名称触发函数事件
    $('.everyGrade_rename').on('click', function () {
        $(".index_mask",parent.document).show();
        var html = template('test_mask_catch', {});
        $.popwin(html, {
            title: '更改名称',
            fixed: true,
            drag: false, //是否可拖拽
        });
        $("#popwin_Out").addClass("grade_RenameStyle");
        // $.popwin.setPosition(410,460);
        $("#popwin_Close").on("click", function () {
            $("#popwin_Blank").remove();
            $("#popwin_Out").remove();
            $(".index_mask",parent.document).hide();
        })

        var _oldName = _name;//旧名称返回参数好像没有啊
        $(".grade_RenameStyle .grade_nowName_address").html(_oldName);
        var _newName = $('.grade_newName_input').val();
        var rename_sureDom = $('.rename_sure');
        $(".grade_newName_input").blur(function () {
            var _newName = $('.grade_newName_input').val();
            if (regex_reName.test(_newName)) {
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
                newName: _newName
            };
            if (renameFlag) {
                grade_Rename_link(param);
            } else {
                $('.everyGradeTip').html('不可空置/支持中英文，最多32个字符').show();
            }
        })
    });
});

//依据id拉取底部详细信息函数
function brand_belongInfoPull(brand_belongTypeUrl) {

    var params = {
        brandId: _id
    };
    var dataJson = {};
    $.ajax({
        type: "post",
        catch: false,
        async: false,
        url: brand_belongTypeUrl,
        dataType: "json",
        data: params,
        success: function (res) {
            debugger;
            if (res.success == true) {
                var arr = [];//空数组
                var data = res.data;//提取数组
                for (var i = 0; i < data.length; i++) {
                    if (data[i].parentId == 0) {
                        var obj = {};//存储所有一级的键值对
                        obj.id = data[i].id;
                        obj.name = data[i].name;
                        var secondArr = [];
                        for (var j = 0; j < data.length; j++) {

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
                    }
                }
                ;
                dataJson.options = arr;
                var html = template("belong_box", dataJson);
                $('.belong_box_con').append(html);
            } else {
                alert("出现错误")

            }
        },
        error: function () {
        }
    });

}

//依据id拉取顶部单个属性详细信息函数
function brand_InfoPull(everybrandInfo_Url) {
    debugger;
    var params = {
        id: _id
    };
    $.ajax({
        type: "post",
        catch: false,
        url: everybrandInfo_Url,
        dataType: "json",
        async: false,
        data: params,
        success: function (res) {
            debugger;
            if (res.success == true) {
                var data = res.data;
                _name = data.nameCh;//分类名称
                _updateTime = data.updateTime;//创建时间
                _state = data.state;//分类状态
                _brandLogo = data.logo;//属性单位
                //回显属性名称
                function attr_nameDraw(_name) {
                    var str = '';
                    if (!_name) {
                        str += '无';
                    } else {
                        str += _name;
                    }
                    $('.everyGrade_name').html(str);
                };

                //回显关闭状态
                function attr_switchDraw(_state) {
                    var str = '';
                    if (_state == 0) {
                        str += '正常';
                    } else {
                        str += '已关闭';
                    }
                    $('.everyGrade_switchState').html(str)
                };

                //回显创建时间
                function attr_timeDraw(_updateTime) {
                    var updateTimeRes = getNowFormatDate(_updateTime);
                    var fisrtTime = updateTimeRes.substr(0, 10);
                    var secondTime = updateTimeRes.substr(11);
                    if (!_updateTime) {
                        $('.everyGrade_ymd').parent().html('显示异常');
                    } else {
                        $('.everyGrade_ymd').html(fisrtTime);
                        $('.everyGrade_hms').html(secondTime);
                    }
                    ;
                };

                //回显关闭按钮内部文字
                function attr_switchDraw_btn(_state) {
                    var str = '';
                    if (_state == 0) {
                        str += '关闭';
                    } else {
                        str += '开启';
                    }
                    $('.everyGrade_switch').html(str)
                };
                //名字，开关，时间三连回显
                attr_nameDraw(_name);
                attr_switchDraw(_state);
                attr_timeDraw(_updateTime);
                attr_switchDraw_btn(_state);
                //回显logo图片
                $(".brand_log").attr("src", _brandLogo);
            } else {
                alert("该等级下有挂载，不可关闭")

            }
        },
        error: function () {
        }
    });

}

/*开关后台交互执行函数*/
function switch_runFun(params) {
    debugger;
    var switch_runUrl = brand_switchUrl;
    $.ajax({
        type: "post",
        url: brand_switchUrl,
        sync: false,
        dataType: "json",
        data: params,
        success: function (data) {
            if (data.success == true) {//判断某个数
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
                brand_InfoPull(everybrandInfo_Url);
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
            _state = !_state;
            everyGrade_switch(_state);

        }
    });
}

/*开关渲染函数*/
function everyGrade_switch(_state) {
    if (_state == 0) {
        $('.everyGrade_switch').html('开启')
    } else {
        $('.everyGrade_switch').html('关闭')
    }
    ;
};

/*删除单行数据执行函数*/
function delete_runFun(params) {
    var delete_runUrl = brand_delUrl;
    $.ajax({
        type: "post",
        sync: false,
        url: brand_delUrl,
        dataType: "json",
        data: params,
        success: function (data) {
            if (data.success == true) {//判断返回参数中某个数据，不是这个
                // window.location.href = _selfUrl;
                self.location = document.referrer;
                // 直接删除然后刷新数据
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
                $(".attr_manag_add .mask_tip").html("不可删除");
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
            $.popwin.setPosition(410, 560);
            $("#popwin_Close").on("click", function () {
                $("#popwin_Blank").remove();
                $("#popwin_Out").remove();
                $(".index_mask",parent.document).hide();
            })
            $(".attr_manag_add .mask_tip").html("未连接到数据库");
        }
    });
};

/*更改名称触发函数*/
function grade_Rename(obj) {
    $(".index_mask",parent.document).show();
    let html = template('test_mask_catch', {});
    $.popwin(html, {
        title: '更改名称',
        fixed: true,
        drag: false, //是否可拖拽
    });
    $("#popwin_Out").addClass("grade_RenameStyle");
    $("#popwin_Close").on("click", function () {
        $("#popwin_Blank").remove();
        $("#popwin_Out").remove();
        $(".index_mask",parent.document).hide();
    })
    // $.popwin.setPosition(410,460);
};

/*更改名称交互函数*/
function grade_Rename_link(params) {
    debugger;
    $.ajax({
        url: brand_renameUrl,
        type: 'post',
        sync: false,
        dataType: 'json',
        data: params,
        success: function (data) {
            if (data.message == '成功') {
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
                $(".attr_manag_add .mask_tip").html("更改名称成功");
                brand_InfoPull(everybrandInfo_Url);
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
                $(".attr_manag_add .mask_tip").html("该名称已经存在");
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
            $.popwin.setPosition(410, 560);
            $("#popwin_Close").on("click", function () {
                $("#popwin_Blank").remove();
                $("#popwin_Out").remove();
                $(".index_mask",parent.document).hide();
            })
            $(".attr_manag_add .mask_tip").html("连接错误");
        }
    });
}