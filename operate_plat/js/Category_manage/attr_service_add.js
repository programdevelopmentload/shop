var _id = +$.getUrlParam("id");//本行数据id
var _edit = $.getUrlParam("edit");//本行数据id
var _goodtype = $.getUrlParam("goodtype");//本行数据id
var _send = $.getUrlParam("send");//本行数据id
var _measure = $.getUrlParam("measure");//测量服务
debugger;
var _install = $.getUrlParam("install");//安装服务
// var _self = $.getUrlParam("self");//本行数据id

$.sidebarMenu($('.sidebar-menu'));
//分页地址变量
var localUrl = getBaseUrl('w');
//添加服务属性地址
var service_addUrl = localUrl + '/goods/service/add';
//编辑服务属性地址
var service_editUrl = localUrl + '/goods/service/changeService';
//分类包含层级地址,新建时候用
var xinjian_category_threeUrl = localUrl + '/goods/GoodsClassification/findAllBackClassOpen';
//分类包含层级地址,编辑时候用
var bianji_category_threeUrl = localUrl + '/goods/GoodsClassification/findAllBackClass';
//根据id查询已经勾选的情况
var return_checkUrl = localUrl + '/goods/service/findLeafClassIdByServiceId';
//查询已经挂载过服务的后台叶子分类id集合
var addFilter_checkUrl = localUrl + '/goods/service/findServiceLeafClassIds';
//根据不同类型，拉取对应的集合【展示未占用的，同时可以用】
var checkboxType_pullUrl = localUrl + '/goods/serviceDetails/showDetailsByTypeNoUse';
//根据id拉取对应的集合【已经勾选过的】【自己勾选过的】
var checkboxHas_pullUrl = localUrl + '/goods/service/findById';
var measureHas = "";
var installHas = "";
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
$(function () {
    var nameflag = false;
    var leafClassIdFlag = false;
    var checkFlag = false;
    //渲染三级分类包含
    if (_edit == 1) {
        if(_measure ==1 && _install == 1){
            $(".sure_xsBtn").hide();
        }
        // edit_category_threePull(bianji_category_threeUrl);
        // category_checkPull(params,category_hascheckUrl);
        // $(".edit_filter_tip").show();
        // $(".close_filter_tip").show();
        // $(".goodsType_input").val(_goodtype);
        var goodsTypeOptionStr = "<option value='" + _id + "'>" + _goodtype + "</option>";
        $(".goodsType_input").html(goodsTypeOptionStr);
        $(".goodsType_input").attr('disabled', 'disabled');
        // $(".send").val(_send);
        debugger;
        $(".messure").val(_measure);
        $(".install").val(_install);
        $(".messure").attr('disabled', 'disabled');
        $(".install").attr('disabled', 'disabled');
        debugger;
        _messure = $(".messure").val();
        _install = $(".install").val();


        if (_messure == 0) {
            var installParams = {
                type: 0
            };
            var installParamsHas = {
                // type: 0,
                id: _id
            };
            checkboxHas_pull(installParamsHas, 0);//已选的
            var domMeasureFather = $(".measure_checbox_box");
            domMeasureFather.append(measureHas);
            $(".measure_checboxHas").prop('checked', true).attr("disabled","disabled");

            checkbox_pull(installParams, domMeasureFather);//未占用的可选
        }
        if (_install == 0) {
            var installParams = {
                type: 1
            };
            var installParamsHas = {
                // type: 1,
                id: _id
            };
            checkboxHas_pull(installParamsHas, 1);//已选的
            var domInstallFather = $(".install_checbox_box");
            domInstallFather.append(installHas);
            $(".install_checboxHas").prop('checked', true).attr("disabled","disabled");
            checkbox_pull(installParams, domInstallFather);
        }
    } else if (_edit == 0) {
        $(".messure").change(function () {
            var _type = $(this).val();
            if (_type == 1) {
                var installParams = {
                    type: 0
                }
                var domFather = $(".measure_checbox_box")

                checkbox_pull(installParams, domFather)
            } else {
                $(".measure_checbox_box").html("");
            }
        })
        $(".install").change(function () {
            var _type = $(this).val();
            if (_type == 1) {
                var installParams = {
                    type: 1
                }
                var domFather = $(".install_checbox_box");
                checkbox_pull(installParams, domFather)
            } else {
                $(".install_checbox_box").html("");
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
    addDom.off('click').on('click', function () {
        debugger;
        var _leafClassId = "";
        var push_res_arr = [];
        var measureCheckDom = $(".measure_checbox_box input[type='checkbox']:checked");
        var installCheckDom = $(".install_checbox_box input[type='checkbox']:checked");
        debugger;
        measureCheckDom.each(function (i, v) {
            push_res_arr.push($(v).val())
        })
        installCheckDom.each(function (i, v) {
            push_res_arr.push($(v).val())
        })
        _leafClassId = push_res_arr.toString();
        // flag = regex_reName.test($('.type_input_tip').val());
        var _type = $.trim($(".goodsType_input").val());
        debugger//@属性名称
        var _send = 1;
        var _messure = +$(".messure").val();
        var _install = +$(".install").val();
        // var selfLiftingService = +$(".self").val();
        if (_messure == 1 && _install == 1) {
            _leafClassId = ""
        }
        param_btn_push = {
            goodsType: _goodtype,//类型
            sendService: _send,//配送
            measureService: _messure,//测量
            installService: _install,//安装
            serviceDetailsIds: _leafClassId//叶子集合
            // selfLiftingService:selfLiftingService// selfLiftingService该字段被去掉
        };

        if (_edit == 1) {
            debugger;
            // var _messureFlag = false;//测量服务旗帜
            // var _installFlag = false;//安装服务旗帜
            // var doubleFlag = false;//两旗合并
            // if (_messure == 0) {
            //     if (measureCheckDom.length == 0) {
            //         _messureFlag = false;
            //         $('.messure_tip').html('没有勾选测量服务复选框').show();
            //     } else {
            //         _messureFlag = true;
            //         $('.messure_tip').hide();
            //     }
            // } else {
            //     _messureFlag = true;
            // }
            // if (_install == 0) {
            //     if (installCheckDom.length == 0) {
            //         _installFlag = false;
            //         $('.install_tip').html('没有勾选安装服务复选框').show();
            //     } else {
            //         _installFlag = true;
            //         $('.install_tip').hide();
            //     }
            // } else {
            //     _installFlag = true
            // }
            // if (_messureFlag && _installFlag) {
            //     doubleFlag = true;
            // }
            service_addUrl = service_editUrl;
            param_btn_push = {
                id: _id,
                goodsType: _goodtype,//类型
                sendService: _send,//配送
                measureService: _messure,//测量
                installService: _install,//安装
                serviceDetailsIds: _leafClassId//叶子集合
                // value:_value,//这个字段是干啥的
                // selfLiftingService:selfLiftingService// selfLiftingService该字段被去掉吗？
            };
            if (!nameflag && !_type) {
                debugger;
                nameflag = false;
                $(".index_mask", parent.document).show();
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
                    $(".index_mask", parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html("请填写商品类型");
                $('.type_input_tip').html('不可空置/支持中英文，最多10个字符').show();
                return false;
            } else {
                nameflag = true;
                $('.type_input_tip').hide();
            }
            if (nameflag) {
                checkFlag = true;
            }
            if (checkFlag) {
                debugger;
                $.ajax({
                    url: service_addUrl,
                    type: 'post',
                    dataType: 'json',
                    data: param_btn_push,
                    success: function (data) {

                        if (data.success == true) {
                            $(".index_mask", parent.document).show();
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
                                $(".index_mask", parent.document).hide();
                                self.location = document.referrer;
                            })
                            $(".attr_manag_add .mask_tip").html(data.message);
                        } else {
                            $(".index_mask", parent.document).show();
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
                                $(".index_mask", parent.document).hide();
                            })
                            $(".attr_manag_add .mask_tip").html(data.message);
                            // alert(msg);
                        }
                    }
                });
            }
        } else {
            // _leafClassId = JSON.stringify(_leafClassId);
            param_btn_push = {
                goodsType: _goodtype,//类型
                sendService: _send,//配送
                measureService: _messure,//测量
                installService: _install//安装
                // serviceDetailsIds: _leafClassId//叶子集合
                // value:_value,//这个字段是干啥的
                // selfLiftingService:selfLiftingService
            };
            if (measureCheckDom.length != 0 || installCheckDom.length != 0) {
                param_btn_push.serviceDetailsIds = _leafClassId
            }
            if (!nameflag || !_type) {
                nameflag = false;
                $(".index_mask", parent.document).show();
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
                    $(".index_mask", parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html("请填写商品类型");
                $('.type_input_tip').html('不可空置/支持中英文，最多10个字符').show();
                return false;
            } else {
                nameflag = true;
                $('.type_input_tip').html('不可空置/支持中英文，最多10个字符').hide();
            }

            if (nameflag) {
                debugger;
                $.ajax({
                    url: service_addUrl,
                    type: 'post',
                    dataType: 'json',
                    data: param_btn_push,
                    success: function (data) {

                        if (data.success == true) {
                            $(".index_mask", parent.document).show();
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
                                $(".index_mask", parent.document).hide();
                            })
                            $(".attr_manag_add .mask_tip").html(data.message);
                            $("#popwin_Close").on("click", function () {
                                self.location = document.referrer;
                            })
                        } else {
                            $(".index_mask", parent.document).show();
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
                                $(".index_mask", parent.document).hide();
                            })
                            $(".attr_manag_add .mask_tip").html(data.message);
                            // alert(msg);
                        }
                    }
                });
            }
        }

    });
    $(".attr_manag_con_right .cancle_xsBtn").on('click', function () {
        window.history.back(-1);
    })

})

//根据type拉取不同服务对应的复选框的交互函数【展示未占用的，同时可以用】
function checkbox_pull(params, domFather) {
    $.ajax({
        type: "post",
        catch: false,
        async: false,
        url: checkboxType_pullUrl,
        dataType: "json",
        data: params,
        success: function (res) {
            if (res.success == true) {
                debugger;
                var data = res.data;
                var str = "";
                $(data).each(function (i, v) {
                    if (params.type == 0) {
                        str += "<span><input class='measure_checbox' data-type='" + data[i].type + "' type='checkbox' value='" + data[i].id + "'>" + data[i].serviceDetailsName + "</span>"
                    } else {
                        str += "<span><input class='install_checbox' data-type='" + data[i].type + "' type='checkbox' value='" + data[i].id + "'>" + data[i].serviceDetailsName + "</span>"

                    }
                })
                domFather.append(str);
            }
        },
        error: function () {
        }
    });
}

//根据id拉取不同服务对应的已经选择的交互函数
function checkboxHas_pull(params, domFatherHasFlag) {
    debugger;
    $.ajax({
        type: "post",
        catch: false,
        async: false,
        url: checkboxHas_pullUrl,
        dataType: "json",
        data: params,
        success: function (res) {
            debugger;
            if (res.success == true) {
                debugger;
                var data = res.data.details;
                measureHas = "";
                installHas = "";
                $(data).each(function (i, v) {
                    if (v.type == 0) {
                        measureHas += "<span><input class='measure_checbox measure_checboxHas' data-type='" + data[i].type + "' type='checkbox' value='" + data[i].id + "'>" + data[i].serviceDetailsName + "</span>"
                    } else {
                        installHas += "<span><input class='install_checbox install_checboxHas' data-type='" + data[i].type + "' type='checkbox' value='" + data[i].id + "'>" + data[i].serviceDetailsName + "</span>"
                    }
                })
                if (domFatherHasFlag == 0) {
                    debugger;
                    return measureHas;
                } else {
                    debugger;
                    return installHas;
                }
                // $(k).prop('checked', true);
            }
        },
        error: function () {
        }
    });
}