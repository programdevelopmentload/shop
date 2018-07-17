var _id = +$.getUrlParam("id");//本行数据id
var _type = $.getUrlParam("type");//本行数据id

$.sidebarMenu($('.sidebar-menu'));
//分页地址变量
var localUrl = getBaseUrl('w');
//更改属性提交地址
var attr_editUrl = localUrl + '/goods/attribute/changeClass';
//主副属性切换过滤底部的勾选状态
var categoryFilter_checkUrl = localUrl + '/goods/attribute/attrIsMainSide';
//回显属性复选框的选中状态
var return_AttrCheckUrl = localUrl + '/goods/attribute/findAllClassById';
//分类包含层级地址
var category_threeUrl = localUrl + '/goods/GoodsClassification/findAllBackClass';

var regex_reName = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,32}$/;
$(function () {
    //渲染三级分类包含
    category_threePull(category_threeUrl);
    //回填选中状态
    var return_checkPram = {
        id: _id
    };
    debugger;
    $.ajax({
        type: "post",
        catch: false,
        url: return_AttrCheckUrl,
        dataType: "json",
        data: return_checkPram,
        success: function (data) {
            debugger;
            var res = data.data;
            var useArr = [];
            if (data.success == true) {
                $(res).each(function (i, v) {
                    if (v.isLeaf == 1) {
                        useArr.push(v.id)
                    }
                });
                console.log(useArr);
            }
            $(".relation_tip3 input[type='checkbox']").each(function (jj, kk) {
                debugger;
                $(useArr).each(function (ii, vv) {
                    debugger;
                    if ($(kk).val() == vv) {
                        debugger;
                        $(kk).prop('checked', true);
                        $(kk).parent().addClass("editFilter_color");
                        $(kk).attr("disabled", "disabled");
                    }
                })
            })
            $('.edit_filter_tip').html("蓝色色为该服务勾选过的叶子分类，不可取消勾选").show();

        },
        error: function () {
        }
    });

    var main_lessParam = {
        type:_type
    }
    $.ajax({
        type: "post",
        catch: false,
        url: categoryFilter_checkUrl,
        data:main_lessParam,
        dataType: "json",
        success: function (data) {
            debugger;
            var res = data.data;
            var useArr = [];
            if (data.success == true) {
                useArr = data.data;
                console.log(useArr);
            }
            $(".relation_tip3 input[type='checkbox']").each(function (jj, kk) {
                $(useArr).each(function (ii, vv) {
                    if ($(kk).val() == vv) {
                        debugger;
                        $(kk).prop('checked', false);
                        $(kk).parent().addClass("addFilter_color");
                        $(kk).attr("disabled", "disabled");
                    }
                })
            })

            $('.add_filter_tip').html("红色为其他服务占用的叶子分类，不可勾选").show();

        },
        error: function () {
        }
    });




    var addDom = $(".attr_manag_con_right .btn_sure");

    //主按钮提交数据事件
    addDom.on('click', function () {
        var _leafClassId = "";
        if ($(".relation_tip3")) {
            $(".relation_tip3 input[type='checkbox']:checked").each(function (i) {
                if (i == 0) {
                    _leafClassId += $(this).attr("value");
                } else {
                    _leafClassId += "," + $(this).attr("value");
                }
                // _leafClassId.push(+$(this).attr("value"));
            });
        }
        ;

        var edit_paramPush = {
            attributeId: _id,
            leafClassIds: _leafClassId
        };
        debugger;
        $.ajax({
            url: attr_editUrl,
            type: 'post',
            dataType: 'json',
            data: edit_paramPush,
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
                    $(".attr_manag_add .mask_tip").html(data.message);
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
    })
})

//无传参拉取嵌套层级分类包含信息
function category_threePull(category_threeUrl) {
    var dataJson = {};
    $.ajax({
        type: "post",
        catch: false,
        async: false,
        url: category_threeUrl,
        dataType: "json",
        // data: params,
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
                debugger;
                var html = template("belong_box", dataJson);
                $('.relation_table').html(html);
                $(".relation_tip3 input[type='checkbox']").each(function (jjj, kkk) {
                    if ($(kkk).data("state") == 1) {
                        debugger;
                        $(kkk).parent().addClass("closeFilter_color");
                        $(kkk).attr("disabled", "disabled");
                    }
                })
            } else {

            }
        },
        error: function () {
        }
    });

}