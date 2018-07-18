$.sidebarMenu($('.sidebar-menu'));
//分页地址变量
var localUrl = getBaseUrl('w');
//添加属性地址
var attr_addUrl = localUrl + '/goods/attribute/add';
//分类包含层级地址
var category_threeUrl = localUrl + '/goods/GoodsClassification/findAllBackClassOpen';
//主副属性切换过滤底部的勾选状态
var categoryFilter_checkUrl = localUrl + '/goods/attribute/attrIsMainSide';

var regex_reName = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,32}$/;
$(function () {
    debugger;
    var nameflag = false;
    var leafClassIdFlag = false;
    var checkFlag = false;
    //渲染三级分类包含
    category_threePull(category_threeUrl);
    var $radiovalue = $("input[name='addtype']:checked").val();
    if($radiovalue == 0){
        $("input[name='addnecessary'][value='0']").prop("checked",true);
        $("input[name='addnecessary']").attr("disabled","disabled");
    }
    var main_lessParam = {
        type:$radiovalue
    };
    debugger;
    $.ajax({
        type: "post",
        catch: false,
        url: categoryFilter_checkUrl,//主副的占用概念
        data:main_lessParam,
        dataType: "json",
        success: function (data) {
            debugger;
            var res = data.data;
            var useArr = [];
            if (data.success == true) {
                useArr = data.data;
                console.log(useArr);
            };
            $(".relation_tip3 input[type='checkbox']").attr("disabled", false);
            $(".relation_tip3 input[type='checkbox']").each(function (jj, kk) {
                $(useArr).each(function (ii, vv) {
                    if ($(kk).val() == vv) {
                        debugger;
                        $(kk).parent().addClass("addFilter_color");
                        $(kk).prop('checked', false);
                        $(kk).attr("disabled", "disabled");
                    }
                })
            })

            $('.add_filter_tip').html("红色为其他服务占用的叶子分类，不可勾选").show();

        },
        error: function () {

        }
    });
    //控制主副属性切换带来的必选行的显示隐藏
    $("input[name='addtype']").change(function() {
        $(".relation_tip3 input[type='checkbox']").attr("disabled", false);
        $(".relation_tip3 input[type='checkbox']").prop("checked", false);
        $(".relation_tip3 input[type='checkbox']").parent().removeClass('addFilter_color');

        var $radiovalue = $("input[name='addtype']:checked").val();
        debugger;
        if ($radiovalue != 2) {//主副
            // $(".addnecessary_box").hide();
            $("input[name='addnecessary']").prop("checked",false);
            if($radiovalue == 0){
                $("input[name='addnecessary'][value='0']").prop("checked",true);
                $("input[name='addnecessary']").attr("disabled","disabled");

            }else if($radiovalue == 1){

                $("input[name='addnecessary'][value='0']").prop("checked",true);
                $("input[name='addnecessary']").attr("disabled","disabled");
            }
            var main_lessParam = {
                type:$radiovalue
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
        } else {//关键
            // $(".addnecessary_box").show();
            $("input[name='addnecessary']").prop("checked",false);
            $("input[name='addnecessary'][value='1']").prop("checked",true);
            $("input[name='addnecessary']").attr("disabled",false);
        }
    });

    var addDom = $(".attr_manag_con_right .btn_sure");
    //属性名称输入失焦事件
    $(".everyAdd_input").blur(function(){
        if (regex_reName.test($('.everyAdd_input').val())) {
            $('.attr_name_tip').hide();
            nameflag = true;
        }else{
            $('.attr_name_tip').html('不可空置/支持中英文，最多32个字符').show();
            nameflag = false;
        }
    });
    //主按钮提交数据事件
    addDom.on('click',function () {
        //_name,属性名称获取
        var _name = $('.everyAdd_input').val(),//@属性名称
            _necessary = $('input:radio[name="addnecessary"]:checked').attr("value"),//是否必填,0必填，1选填
            _type = $('input:radio[name="addtype"]:checked').attr("value"),
            _state = $('input:radio[name="addSwitch"]:checked').attr("value");
        var _leafClassId = "";
        if($(".relation_tip3")){
            $(".relation_tip3 input[type='checkbox']:checked").each(function(i){
                if(i == 0){
                    _leafClassId += $(this).attr("value");
                }else {
                    _leafClassId += "," + $(this).attr("value");
                }
                // _leafClassId.push(+$(this).attr("value"));
            });
        };
        flag = regex_reName.test($('.everyAdd_input').val());
        param = {
            name:_name,
            necessary:_necessary,
            type:_type,
            leafClassId:_leafClassId,
            state:_state
        };
        if(!nameflag || !_name){
            nameflag = false;
            $(".index_mask",parent.document).show();
            var html = template('test_mask_catch', {});
            $.popwin(html, {
                title: '未填写完全',
                fixed: true,
                drag: false, //是否可拖拽
            });
            $("#popwin_Out").addClass("attr_manag_add");
            $.popwin.setPosition(410,560);
            $(".attr_manag_add .mask_tip").html("请填写属性名称");
            $("#popwin_Close").on("click", function () {
                $("#popwin_Blank").remove();
                $("#popwin_Out").remove();
                $(".index_mask",parent.document).hide();
            })
            $('.attr_name_tip').html('不可空置/支持中英文，最多32个字符').show();
            return false;
        }else {
            nameflag = true;
            $('.attr_name_tip').html('不可空置/支持中英文，最多32个字符').hide();
        };

        if(nameflag && !_leafClassId ){
            leafClassIdFlag = false;
            $(".index_mask",parent.document).show();
            var html = template('test_mask_catch', {});
            $.popwin(html, {
                title: '未填写完全',
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
            $(".attr_manag_add .mask_tip").html("请勾选添加属性的关联分类");
            $('.relation_cate_tip ').html('请勾选添加属性的关联分类').show();
        }else if(nameflag && _leafClassId ){
            leafClassIdFlag = true;
            $('.relation_cate_tip ').hide();
        }
        if(nameflag && leafClassIdFlag){
            checkFlag = true;
        };
        debugger;
        if(checkFlag) {
            $.ajax({
                url: attr_addUrl,
                type: 'post',
                dataType: 'json',
                data: param,
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
                        $.popwin.setPosition(410,560);
                        $("#popwin_Close").on("click", function () {
                            $("#popwin_Blank").remove();
                            $("#popwin_Out").remove();
                            $(".index_mask",parent.document).hide();
                            self.location = document.referrer;
                        })
                        $(".attr_manag_add .mask_tip").html(data.message);

                        // $("#popwin_Close").on("click",function () {
                        //     self.location = document.referrer;
                        // })
                    } else {
                        $(".index_mask",parent.document).show();
                        var html = template('test_mask_catch', {});
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
                        // alert(msg);
                    }
                }
            });
        };
    })
})
//无传参拉取嵌套层级分类包含信息
function category_threePull(category_threeUrl){
    var dataJson = {};
    $.ajax({
        type: "post",
        catch: false,
        async:false,
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
                };
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