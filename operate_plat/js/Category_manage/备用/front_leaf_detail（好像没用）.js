var _id = $.getUrlParam("id");//本行数据id
//前缀地址变量
var localUrl = 'http://172.16.41.23:8007';
//依据id抓取底部数据url
var attr_belongTypeUrl = localUrl + '/goods/attribute/findAllClassById';
// var attr_belongTypeUrl = "dibusanji.json";
//依据id抓取顶部信息
var attr_infoUrl = localUrl + '/goods/attribute/findById';
//删除函数
var attr_delUrl = localUrl + '/goods/attribute/del';
//改名函数
var attr_renameUrl = localUrl + '/goods/attribute/updateName';
//开关函数【目前未经过真实数据测试】
var attr_switchUrl = localUrl + '/goods/attribute/openClose';
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
    attr_belongInfoPull(attr_belongTypeUrl);
    attr_InfoPull(attr_infoUrl);
    //事件触发有三个。【添加按钮为页面跳转行为控制】
    //switch开关控制事件
    $('.everyGrade_switch').on('click', function () {
        debugger;
        if(_state == 0){
            _state = 1;
        }else{
            _state = 0;
        }
        var params = {
            id: _id,
            state: _state
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
    //更改名称触发函数事件
    $('.everyGrade_rename').on('click', function () {
        var html = template('#test_mask_catch', {});
        $.popwin(html, {
            title: '更改名称',
            fixed: true,
            drag: false, //是否可拖拽
        });
        $("#popwin_Out").addClass("grade_RenameStyle");
        // $.popwin.setPosition(410,460);

        var _oldName = $(".everyGrade_name").text();//旧名称返回参数好像没有啊
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
            var _newName = $('.grade_newName_input').val(),
                renameFlag = regex_reName.test($('.grade_newName_input').val());
            param = {
                id: _id,
                nameNew: _newName,
                type:_type
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
function attr_belongInfoPull(attr_belongTypeUrl){
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
                };
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
function attr_InfoPull(attr_infoUrl){
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
                var data = res.data;
                _name = data.name;//分类名称
                _updateTime = data.updateTime;//创建时间
                _necessary = data.necessary;//是否必填
                _state = data.state;//分类状态
                _type = data.type;//属性类型
                _unit = data.unit;//属性单位
                //回显属性名称
                function attr_nameDraw(_name){
                    var str = '';
                    if (!_name) {
                        str += '无';
                    }else{
                        str += _name;
                    }
                    $('.everyGrade_name').html(str);
                };
                //回显属性单位
                function attr_unitDraw(_unit){
                    var str = '';
                    if (!_unit) {
                        str += '无';
                    }else{
                        str += _unit;
                    }
                    $('.everyGrade_unit').html(str);
                };
                //回显属性类型
                function attr_typeDraw(_type){
                    var str = '';
                    if (_type == 0) {
                        str += '主销售属性';
                        $('.everyGrade_necessary_box').hide();
                    } else if(_type == 1){
                        str += '副销售属性';
                        $('.everyGrade_necessary_box').hide();
                    }else {
                        str += '关键属性';
                        $('.everyGrade_necessary_box').show();
                    };
                    $('.everyGrade_type').html(str);//@此处挂载关键属性
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
                //回显关闭按钮内部文字
                function attr_switchDraw_btn(_state){
                    var str = '';
                    if (_state == 0) {
                        str += '关闭';
                    }else{
                        str += '开启';
                    }
                    $('.everyGrade_switch').html(str)
                };
                //回显是否必填
                function attr_necessaryDraw(_necessary){
                    var str = '';
                    if (_necessary == 0) {
                        str += '否';
                    } else{
                        str += '是';
                    }
                    $('.everyGrade_necessary').html(str);//@此处挂载关键属性
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
                attr_nameDraw(_name);
                attr_unitDraw(_unit);
                attr_typeDraw(_type);
                attr_switchDraw(_state);
                attr_switchDraw_btn(_state);
                attr_necessaryDraw(_necessary);
                attr_timeDraw(_updateTime);
            } else {
                alert("该等级下有挂载，不可关闭")

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
                alert('//提示有子类挂载，阻止删除【弹框有挂载】')

            }
        },
        error: function () {
            _state = !_state;
            everyGrade_switch(_state);

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
                alert('//提示有子类挂载，阻止删除【弹框有挂载】')

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
                self.location = document.referrer;
            } else {
                alert('阻止删除【弹框提示】')
            }
        },
        error: function () {
            alert('未连接到数据库')
        }
    });
};

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
                alert('更改名称成功');
                attr_InfoPull(attr_infoUrl);
            } else {
                alert('该名称已经存在')
            }
        },
        error: function () {
            alert('连接错误');
        }
    });
}

