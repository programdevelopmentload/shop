var localHtttp = getBaseUrl('w');
var _idSKY = +$.getUrlParam("id");//本行数据id
var _editSign = +$.getUrlParam("editSign");//编辑还是增加，编辑是1，增加是0
//拉取品牌地址
var brand_Url = localHtttp + '/goods/brand/showBrandLeafClass';
//添加型号地址url
var modelAdd_Url = localHtttp + '/goods/spu/add';
//品牌关联三级
var categoriesUrl = localHtttp + '/goods/brand/findLeafClassByBrandId';


// ategoriesUrl = 'showall.json';
// var categoriesUrl = localHtttp + '/goods/GoodsClassification/findAllBackClass';
//拉取已有型号
var mode_AllUrl = localHtttp + '/goods/spu/findByClassIdBrandId';
// var regex_reName = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,32}$/;
var regex_reName = /^[\s\S]{1,32}$/;
var flag = false;
var nameflag = false;
var dataJson = {};
var brandSelect_has;
var dataOrigin;
var categoriesId1;
var categoriesId2;
var categoriesId3="";

$.sidebarMenu($('.sidebar-menu'));
var _isLeaf = +$.getUrlParam("isLeaf");//是否是叶子节点
var _selfId = +$.getUrlParam("selfId");//本行数据id
$(function () {
    brand_pullFun();//顶部品牌下拉渲染
    // categoriesAll();//三级联动数据源头
    // filterCategories();//三级联动
    $("#selectbox1").selectBox("removeAll");
    $("#selectbox2").selectBox("removeAll");
    $("#selectbox3").selectBox("removeAll");
    $("#selectbox1").css("background-color", "#eaecf2");
    $("#selectbox2").css("background-color", "#eaecf2");
    $("#selectbox3").css("background-color", "#eaecf2");
    $(".send").change(function () {
        brandSelect_has = $(".send").val();
        $("#selectbox1").selectBox("removeAll");
        $("#selectbox2").selectBox("removeAll");
        $("#selectbox3").selectBox("removeAll");
        $("#selectbox1").css("background-color", "#eaecf2");
        $("#selectbox2").css("background-color", "#eaecf2");
        $("#selectbox3").css("background-color", "#eaecf2");
        if(brandSelect_has != undefined){
            categoriesAll();
            filterCategories();
        }
    });
    debugger;
    var addDom = $(".attr_manag_con_right .sure_xsBtn");
    //属性名称输入失焦事件
    $(".everyAdd_input").blur(function () {
        debugger;
        var _name = $.trim($(".everyAdd_input").val());
        if (regex_reName.test(_name)) {
            $('.model_name_tip').hide();
            nameflag = true;
        } else {
            $('.model_name_tip').html('不可空置/支持中英文，最多32个字符').show();
            nameflag = false;
        }
    });
    //提交按钮
    addDom.on('click', function () {
        var _brandId = $(".send").val();
        debugger;
        if (categoriesId3.length < 1) {
            $(".cate_check_tip").show();
            return false;
        } else {
            $(".cate_check_tip").hide();
        }
        ;
        debugger;
        if($(".everyAdd_input").val().length>0){
            var _name = $.trim($(".everyAdd_input").val());
            flag = regex_reName.test(_name);
        }else {
            flag = false;
        }
        debugger;
        if (!flag) {
            $(".model_name_tip").show();
            return false;
        } else {
            $(".cate_check_tip").hide();
        }
        var param = {
            brandId: brandSelect_has,
            model: _name,
            leafClassId: categoriesId3
        };
        modelAdd_fun(param);
    });
});

/*三级联动勾选逻辑*/
function filterCategories() {
    dataOrigin = dataJson.options;
    var str = "";
    debugger
    $.each(dataOrigin, function (index, item) {
        str += '<li data-id="' + item.id + '">' + item.name + '</li>'
    });
    $("#selectbox1 ul").html(str);
    $("#selectbox2").css("background-color", "#eaecf2");
    $("#selectbox3").css("background-color", "#eaecf2");
    $("#selectbox1 ul li").click(function () {
        $("#selectbox2").selectBox("removeAll");
        $("#selectbox3").selectBox("removeAll");
        var $this = $(this);
        categoriesId1 = $this.attr('data-id');//一级id抓取
        var str2 = "";
        $.each(dataOrigin, function (index, item) {
            if (item.id == categoriesId1) {
                $.each(item.child, function (index2, item2) {//匹配二级数据并渲染
                    str2 += '<li data-id="' + item2.id + '">' + item2.name + '</li>'
                })
            }
        });
        $("#selectbox2 ul").html(str2);
        $("#selectbox2").css("background-color", "#fff");
        $("#selectbox3").css("background-color", "#eaecf2");
        $("#selectbox2 ul li").click(function () {
            $("#selectbox3").selectBox("removeAll");
            var $this = $(this);
            categoriesId2 = $this.attr('data-id');
            var str3 = "";
            $.each(dataOrigin, function (index, item) {
                //一级遍历
                if (item.id == categoriesId1) {//抓取一级
                    $.each(item.child, function (index2, item2) {//遍历二级
                        if (item2.id == categoriesId2) {//抓取已选择二级
                            $.each(item2.child, function (index3, item3) {//三级遍历
                                str3 += '<li data-id="' + item3.id + '">' + item3.name + '</li>'
                            });
                        }
                    })
                }
            });
            $("#selectbox3 ul").html(str3);
            $("#selectbox3").css("background-color", "#fff");
            $("#selectbox3 ul li").click(function () {
                $(".model_name_con").html("");
                var _brandId = $(".send").val();
                var $this = $(this);
                categoriesId3 = $this.attr('data-id');
                debugger;
                var model_param = {
                    leafClassId: categoriesId3,
                    brandId: _brandId
                };
                $.ajax({
                    type: "post",
                    url: mode_AllUrl,
                    catch: false,
                    async: false,
                    data: model_param,
                    dataType: "json",
                    success: function (data) {
                        debugger;
                        if (data.success == true) {//判断返回参数中某个数据，不是这个
                            var str = "";
                            if(data.data.length>0){
                                $(data.data).each(function (i, v) {
                                    str += "<li class='model_name fl' data-id='" + v.spuId + "'>" + v.model + "</li>";
                                })
                                $(".model_name_con").html(str);
                                $(".model_name_box").show();
                            }else {
                                $(".model_name_box").hide();
                            }
                        } else {
                        }
                    },
                    error: function () {
                    }
                });
            })
        });
    });
}

//添加型号地址【目前还不全】
function modelAdd_fun(param) {
    $.ajax({
        type: "post",
        url: modelAdd_Url,
        dataType: "json",
        data: param,
        success: function (data) {
            debugger;
            if (data.success == true) {//判断返回参数中某个数据，不是这个
                $(".index_mask",parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '提示',
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

                $("#popwin_Close").on("click",function () {
                    self.location = document.referrer;
                })
            } else {
                $(".index_mask",parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '提示',
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
                // alert('该分类名已经存在')
            }
        },
        error: function () {
        }
    });
}

// 依据id拉取三级联动数据源
function categoriesAll() {
    debugger;
    var data = {
        brandId: brandSelect_has
    };
    $.ajax({
        type: "post",
        catch: false,
        async: false,
        data: data,
        url: categoriesUrl,
        dataType: "json",
        success: function (res) {
            debugger;
            if (res.success == true) {
                if(res.data && res.data.length>0){
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
                    // var html = template("belong_box", dataJson);
                    // $('.belong_box_con').append(html);
                }else {
                    $("#selectbox1").selectBox("removeAll");
                    $("#selectbox2").selectBox("removeAll");
                    $("#selectbox3").selectBox("removeAll");
                    $("#selectbox1").css("background-color", "#eaecf2");
                    $("#selectbox2").css("background-color", "#eaecf2");
                    $("#selectbox3").css("background-color", "#eaecf2");
                    $(".model_name_con").html("");
                    $(".model_name_box").hide();
                }
            } else {
                $(".index_mask",parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '提示',
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
                if(res.errorCode!=0){
                    $(".attr_manag_add .mask_tip").html(res.message);
                }
                // alert("出现错误")

            }
            $("#selectbox1").css("background-color", "#fff");
        },
        error: function () {
        }
    });

}

//拉取品牌地址【目前还不全】
function brand_pullFun() {
    $.ajax({
        type: "post",
        url: brand_Url,
        catch: false,
        // async: false,
        dataType: "json",
        success: function (data) {
            debugger;
            if (data.success == true) {//判断返回参数中某个数据，不是这个
                var str = "<option value='" + undefined + "'>--</option>";
                $(data.data).each(function (i, v) {
                    str += "<option value='" + v.brandId + "'>" + v.brandName + "</option>";
                })
                $(".send").html(str);
            } else {

            }
        },
        error: function () {
        }
    });
}
