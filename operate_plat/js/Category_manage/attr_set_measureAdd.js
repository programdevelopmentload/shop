var _id = +$.getUrlParam("id");//本行数据id
var _edit = $.getUrlParam("edit");//本行数据id
var _typeinput = $.getUrlParam("typeinput");//本行数据id

var _type = 0;
$.sidebarMenu($('.sidebar-menu'));
//分页地址变量
var localUrl = getBaseUrl('w');
//添加服务属性地址【修正】
var service_addUrl = localUrl + '/goods/serviceDetails/add';
//编辑服务属性地址【修正】
var service_editUrl = localUrl + '/goods/serviceDetails/change';
//分类包含层级地址,新建时候用
var xinjian_category_threeUrl = localUrl + '/goods/GoodsClassification/findAllBackClassOpen';
//分类包含层级地址,编辑时候用
var bianji_category_threeUrl = localUrl + '/goods/GoodsClassification/findAllBackClass';

//查询已经占用的后台叶子分类id集合【修正：占用】
var addFilter_checkUrl = localUrl + '/goods/serviceDetails/findUsedLeafClassIds';

//根据id拉取对应的集合【修正：编辑回填】
var checkboxHas_pullUrl = localUrl + '/goods/serviceDetails/showLeafClassIds';

var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
$(function () {
    var nameflag = false;
    var leafClassIdFlag = false;
    var checkFlag = false;
    //渲染三级分类包含
    if (_edit == 1) {
        $(".goodsType_input").val(_typeinput);
        //复选框地址拉取
        add_category_threePull(bianji_category_threeUrl);
        //占用拉取
        $.ajax({
            type: "post",
            catch: false,
            async: false,
            url: addFilter_checkUrl,
            data: {
                type: _type
            },
            dataType: "json",
            success: function (data) {
                var res = data.data;
                var useArr = [];
                if (data.success == true) {
                    useArr = data.data;
                    console.log(useArr);
                }
                $(".relation_tip3 input[type='checkbox']").each(function (jj, kk) {
                    $(useArr).each(function (ii, vv) {
                        if ($(kk).val() == vv) {
                            $(kk).prop('checked', false);
                            $(kk).parent().addClass("addFilter_color");
                            $(kk).attr("disabled", "disabled");
                        }
                    })
                })
                // $('.add_filter_tip').html("红色为其他服务占用的叶子分类，不可勾选").show();
            },
            error: function () {
            }
        });
        //编辑回填
        debugger;
        $.ajax({
            type: "post",
            catch: false,
            async: false,
            url: checkboxHas_pullUrl,
            data: {
                id: _id
            },
            dataType: "json",
            success: function (data) {
                var res = data.data;
                var useArr = [];
                if (data.success == true) {
                    useArr = data.data;
                    console.log(useArr);
                }
                $(".relation_tip3 input[type='checkbox']").each(function (jj, kk) {
                    $(useArr).each(function (ii, vv) {
                        if ($(kk).val() == vv) {
                            $(kk).prop('checked', true);
                            $(kk).parent().addClass("addFilter_color");
                        }
                    })
                })
            },
            error: function () {
            }
        });
    } else if (_edit == 0) {
        //复选框地址拉取
        add_category_threePull(xinjian_category_threeUrl);
        //占用拉取
        $.ajax({
            type: "post",
            catch: false,
            async: false,
            url: addFilter_checkUrl,
            dataType: "json",
            data: {
                type: _type
            },
            success: function (data) {
                var res = data.data;
                var useArr = [];
                if (data.success == true) {
                    useArr = data.data;
                    console.log(useArr);
                }
                $(".relation_tip3 input[type='checkbox']").each(function (jj, kk) {
                    $(useArr).each(function (ii, vv) {
                        if ($(kk).val() == vv) {

                            $(kk).prop('checked', false);
                            $(kk).parent().addClass("addFilter_color");
                            $(kk).attr("disabled", "disabled");
                        }
                    })
                })
                // $('.add_filter_tip').html("红色为其他服务占用的叶子分类，不可勾选").show();
            },
            error: function () {
            }
        });
    }
    var addDom = $(".attr_manag_con_right .btn_sure");
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
        var _serviceDetailsName = $.trim($(".goodsType_input").val());
        var _leafClassId = [];
        if ($(".relation_tip3")) {
            $(".relation_tip3 input[type='checkbox']:checked").each(function (i) {
                _leafClassId.push($(this).val());
            });
        }
        _leafClassId = _leafClassId.toString();

        param_btn_push = {
            serviceDetailsName: _serviceDetailsName,//类型输入框输入
            leafClassIds: _leafClassId,//叶子集合
            type: _type
        };

        if (_edit == 1) {
            service_addUrl = service_editUrl;
            param_btn_push = {
                detailsId: _id,
                serviceDetailsName: _serviceDetailsName,
                leafClassIds: _leafClassId//叶子集合
            };
        } else {
            param_btn_push = {
                serviceDetailsName: _serviceDetailsName,
                type: _type,//类型
                leafClassIds: _leafClassId//叶子集合
            };
        }
        if (!nameflag && !_serviceDetailsName) {
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
            $(".attr_manag_add .mask_tip").html("请填写测量类型");
            $('.type_input_tip').html('不可空置/支持中英文，最多10个字符').show();
            return false;
        } else {
            nameflag = true;
            $('.type_input_tip').html('不可空置/支持中英文，最多10个字符').hide();
        }
        if (_leafClassId.length < 1) {

            $('.messure_tip').html('请勾选关联分类').show();
            leafClassIdFlag = false;
        } else {
            $('.messure_tip').html('请勾选关联分类').hide();
            leafClassIdFlag = true;
        }
        if (nameflag && leafClassIdFlag) {
            checkFlag = true;
        }
        if (checkFlag) {
            $.ajax({
                url: service_addUrl,
                type: 'post',
                dataType: 'json',
                data: param_btn_push,
                success: function (data) {
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
                        $(".attr_manag_add .mask_tip").html(data.message);
                        $("#popwin_Close").on("click", function () {
                            self.location = document.referrer;
                        })
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
                    }
                }
            });
        }
    });
    $(".attr_manag_con_right .cancle_xsBtn").on('click', function () {
        window.history.back(-1);
    })

})

//新建时候，无传参拉取嵌套层级分类包含信息
function add_category_threePull(category_threeUrl) {
    var dataJson = {};
    $.ajax({
        type: "post",
        catch: false,
        async: false,
        url: category_threeUrl,
        dataType: "json",
        // data: params,
        success: function (res) {
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
                $('.relation_table').html(html);
            } else {

            }
        },
        error: function () {
        }
    });

}

//编辑时候，无传参拉取嵌套层级分类包含信息
function edit_category_threePull(category_threeUrl) {
    var dataJson = {};

    $.ajax({
        type: "post",
        catch: false,
        async: false,
        url: category_threeUrl,
        dataType: "json",
        // data: params,
        success: function (res) {
            if (res.success == true) {
                var arr = [];//空数组
                var data = res.data;//提取数组
                for (var i = 0; i < data.length; i++) {
                    if (data[i].parentId == 0) {
                        var obj = {};//存储所有一级的键值对
                        obj.id = data[i].id;
                        obj.name = data[i].name;
                        obj.state = data[i].state;
                        var secondArr = [];
                        for (var j = 0; j < data.length; j++) {

                            if (data[j].parentId == obj.id) {
                                var obj2 = {};
                                obj2.id = data[j].id;
                                obj2.name = data[j].name;
                                obj2.state = data[j].state;
                                //存储新对象进入每一个一级目录中
                                secondArr.push(obj2);
                                var thirdArr = [];
                                for (var k = 0; k < data.length; k++) {
                                    var obj3 = {};
                                    if (data[k].parentId == obj2.id) {
                                        obj3.id = data[k].id;
                                        obj3.name = data[k].name;
                                        obj3.state = data[k].state;
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
                $('.relation_table').html(html);
                // $(".relation_tip3 input[type='checkbox']").each(function (jjj, kkk) {
                //     if ($(kkk).data("state") == 1) {
                //
                //         $(kkk).parent().addClass("closeFilter_color");
                //         $(kkk).attr("disabled", "disabled");
                //     }
                // })
            } else {

            }
        },
        error: function () {
        }
    });

}

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
                $('.relation_table').html(html);
            } else {

            }
        },
        error: function () {
        }
    });

}


//根据id拉取不同服务对应的已经选择的交互函数
function checkboxHas_pull(params, domFatherHas) {

    $.ajax({
        type: "post",
        catch: false,
        async: false,
        url: checkboxHas_pullUrl,
        dataType: "json",
        data: params,
        success: function (res) {

            if (res.success == true) {

                var data = res.data;
                var str = "";
                $(data).each(function (i, v) {

                    domFatherHas.each(function (j, k) {

                        if (v.id == $(k).val()) {
                            $(k).prop('checked', true);
                        }
                    })
                })
            }
        },
        error: function () {
        }
    });
}