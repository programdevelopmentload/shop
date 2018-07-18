var _id = +$.getUrlParam("id");//本行数据id
var _edit = $.getUrlParam("edit");//本行数据id
var _goodtype = $.getUrlParam("goodtype");//本行数据id
var _send = $.getUrlParam("send");//本行数据id
var _measure = $.getUrlParam("measure");//本行数据id
var _install = $.getUrlParam("install");//本行数据id
var _self = $.getUrlParam("self");//本行数据id

$.sidebarMenu($('.sidebar-menu'));
//分页地址变量
var localUrl = getBaseUrl('w');
//添加服务属性地址
var service_addUrl = localUrl + '/goods/service/add';
//编辑服务属性地址
var service_editUrl = localUrl + '/goods/service/changeService';
//回填复选框勾选
var return_checkUrl = localUrl + '/goods/service/findById';

var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
$(function () {
    debugger;
    var nameflag = false;
    var leafClassIdFlag = false;
    var checkFlag = false;

    if (_edit) {
        // category_checkPull(params,category_hascheckUrl);
        $(".goodsType_input").val(_goodtype);
        $(".goodsType_input").attr('disabled', 'disabled');
        $(".send").val(_send);
        $(".send").attr('disabled', 'disabled');
        $(".messure").val(_measure);
        $(".messure").attr('disabled', 'disabled');
        $(".install").val(_install);
        $(".install").attr('disabled', 'disabled');
        // $(".self").val(_self);
        // $(".send").attr('disabled','disabled');

        //回填选中状态
        var return_checkPram = {
            id: _id//_id###此处要写成变量，注意下
        }
        debugger;
        $.ajax({
            type: "post",
            catch: false,
            async: false,
            url: return_checkUrl,
            dataType: "json",
            data: return_checkPram,
            success: function (data) {
                if (data.success == true) {
                    debugger;
                    // var res = data.data;
                    var inputReturnData = data.data.details;
                    // var useArr = [];
                    // useArr = data.data;
                    var measureStr = "";
                    var installStr = "";
                    var str = "";
                    $(inputReturnData).each(function (i, v) {
                        if (v.type == 0) {
                            measureStr += "<input checked class='measure_checkbox' type='checkbox'>" + v.serviceDetailsName;
                        } else {
                            installStr += "<input checked class='install_checbox' type='checkbox'>" + v.serviceDetailsName;
                        }
                    })
                    $(".measure_checkbox_box").html(measureStr);
                    $(".install_checbox_box").html(installStr);
                    $("input").attr("disabled", "disabled");
                }
                $(".relation_tip3 input[type='checkbox']").each(function (jj, kk) {
                    $(useArr).each(function (ii, vv) {
                        if ($(kk).val() == vv) {
                            debugger;
                            $(kk).prop('checked', true);
                            $(kk).attr("disabled", "disabled");
                        }
                    })
                })
                $(".relation_tip3 input").attr("disabled", "disabled");
            },
            error: function () {
            }
        });
    }
    var addDom = $(".attr_manag_con_right .sure_xsBtn");
    //属性名称输入失焦事件
    $(".goodsType_input").blur(function () {
        if (regex_reName.test($('.goodsType_input').val())) {
            $('.type_input_tip').hide();
            nameflag = true;
        } else {
            $('.type_input_tip').html('不可空置/支持中英文，最多10个字符').show();
            nameflag = false;
        }
    });
    //主按钮提交数据事件
    addDom.on('click', function () {
        debugger;
        //_name,属性名称获取
        var _type = $('.goodsType_input').val();//@属性名称
        var _leafClassId = "";
        if ($(".relation_tip3")) {
            $(".relation_tip3 input[type='checkbox']:checked").each(function (i) {
                // _leafClassId.push(+$(this).attr("value"));
                if (i == 0) {
                    _leafClassId += $(this).attr("value");
                } else {
                    _leafClassId += "," + $(this).attr("value");
                }
                // _leafClassId.push(+$(this).attr("value"));
            });
            // _leafClassId.toString();
        }
        ;
        // flag = regex_reName.test($('.type_input_tip').val());
        var _type = $.trim($(".goodsType_input").val());
        var _send = +$(".send").val();
        var _messure = +$(".messure").val();
        var _install = +$(".install").val();
        var selfLiftingService = +$(".self").val();
        debugger;
        param_btn_push = {
            goodsType: _type,//类型
            sendService: _send,//配送
            measureService: _messure,//测量
            installService: _install,//安装
            leafClassId: _leafClassId,//叶子集合
            selfLiftingService: selfLiftingService// selfLiftingService该字段被去掉
        };
        debugger;
        if (_edit == 1) {
            service_addUrl = service_editUrl;
            param_btn_push = {
                id: _id,
                goodsType: _type,//类型
                sendService: _send,//配送
                measureService: _messure,//测量
                installService: _install,//安装
                leafClassId: _leafClassId,//叶子集合·
                // value:_value,//这个字段是干啥的
                selfLiftingService: selfLiftingService// selfLiftingService该字段被去掉吗？
            }
        } else {
            debugger;
            // _leafClassId = JSON.stringify(_leafClassId);
            param_btn_push = {
                goodsType: _type,//类型
                sendService: _send,//配送
                measureService: _messure,//测量
                installService: _install,//安装
                leafClassId: _leafClassId,//叶子集合
                // value:_value,//这个字段是干啥的
                selfLiftingService: selfLiftingService
            }
        }
        if (!nameflag || !_type) {
            nameflag = false;
            $(".index_mask",parent.document).show();
            var html = template('test_mask_catch', {});
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
            $(".attr_manag_add .mask_tip").html("请填写商品类型");
            $('.type_input_tip').html('不可空置/支持中英文，最多10个字符').show();
            return false;
        } else {
            nameflag = true;
            $('.type_input_tip').html('不可空置/支持中英文，最多10个字符').hide();
        }
        if (nameflag && _leafClassId.length > 0) {
            leafClassIdFlag = true;
            $('.relation_cate_tip ').hide();
        }
        if (nameflag && leafClassIdFlag) {
            checkFlag = true;
        }
        ;
        debugger;
        if (checkFlag) {
            debugger;
            $.ajax({
                url: service_addUrl,
                type: 'post',
                dataType: 'json',
                data: param_btn_push,
                success: function (data) {
                    debugger;
                    if (data.success == true) {
                        $(".index_mask",parent.document).show();
                        var html = template('test_mask_catch', {});
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
                        var html = template('test_mask_catch', {});
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
                        // alert(msg);
                    }
                }
            });
        }
        ;
    });
    $(".attr_manag_con_right .cancle_xsBtn").on('click', function () {
        window.history.back(-1);
    })

})

function category_checkPull(params, category_hascheckUrl) {
    // var dataJson = {};
    $.ajax({
        type: "post",
        catch: false,
        async: false,
        url: category_hascheckUrl,
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
                debugger;
                var html = template("belong_box", dataJson);
                $('.relation_table').html(html);
            } else {

            }
        },
        error: function () {
        }
    });

}