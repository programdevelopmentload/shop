// var localHtttp = 'http://172.16.41.23:8007';
var localHtttp = getBaseUrl('w');
var localHtttpImg = getBaseUrl('img');
var _idSKY = +$.getUrlParam("id");//本行数据id
var _editSign = +$.getUrlParam("editSign");//编辑还是增加，编辑是1，增加是0
//图片上传地址
var everyGradeAddImg_Url = localHtttpImg + '/pic/upload';
//添加前台一二级分类地址
var everyGradeAdd_Url = localHtttp + '/goods/GoodsClassificationFront/add';
//添加前台叶子分类地址
var leafGradeAdd_Url = localHtttp + '/goods/GoodsClassificationFront/addleaf';
//编辑前台分类非叶子提交地址
var everyGradeEdit_Url = localHtttp + '/goods/GoodsClassificationFront/change';
//编辑前台分类叶子提交地址
var leafGradeEdit_Url = localHtttp + '/goods/GoodsClassificationFront/changeLeaf';
//id名拉取顶部详情地址
var everyGradeInfo_Url = localHtttp + '/goods/GoodsClassificationFront/findById';
//三级联动地址【目前是后台】
var categoriesUrl = localHtttp + '/goods/GoodsClassification/findAllBackClassOpen';
// var categoriesUrl = 'showall.json';
var regexAdd = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,32}$/;
var flag = false;
var dataJson = {};
var dataOrigin;
var categoriesId1;
var categoriesId2;
var _backLeafClassIds = "";
var _picUrl = "";
$.sidebarMenu($('.sidebar-menu'));
var _isLeaf = +$.getUrlParam("isLeaf");//是否是叶子节点
var _selfId = +$.getUrlParam("selfId");//本行数据id
var _levelSign = +$.getUrlParam("level");//本行数据id
var _editSign = +$.getUrlParam("editSign");//本行数据id
$('#multiselect').multiselect({
    buttonText: function (options) {
        var selected = "";
        if (options.length == 0) {
            return '请选择';
        }
        ;
    },
});
$(function () {
    if (_selfId == 0) {
        $(".blongFlag").hide();
        $(".everyGrade_level").text('一级分类');
        $(".up_img_box").hide();
    } else {
        if (_isLeaf == 1) {
            everyGradeAdd_Url = leafGradeAdd_Url;
            $(".blongFlag").show();
            $(".relation_con").show();
            $(".up_img_box").show();
            categoriesAll();//拉取数据源
            filterCategories();
            top_InfoPull();
        } else {
            debugger;
            $(".blongFlag").show();
            $(".relation_con").hide();
            $(".up_img_box").hide();
            top_InfoPull();
        }
        ;
    }
    ;

    var addDom = $(".cate_everyAdd_con_right .btn_sure");
    $(".everyAdd_input").blur(function () {
        if (regexAdd.test($.trim($('.everyAdd_input').val()))) {
            $('.name_input_tip').hide();
            flag = true;
        } else {
            $('.name_input_tip').html('不可空置/支持中英文，最多32个字符').show();
            flag = false;
        }
    });
    //提交按钮
    addDom.off('click').on('click', function () {
        var name = $('.everyAdd_input').val();
        var state = +$('input:radio[name="addSwitch"]:checked').attr("value");
        flag = regexAdd.test($('.everyAdd_input').val());
        var param = {};
        if (_isLeaf == 1) {
            debugger;
            var selected_res = [];
            $("#multiselect option:selected").each(function () {
                selected_res.push($(this).val());
            });
            _backLeafClassIds = selected_res.toString();
            console.log(selected_res);//此处获取第三级的id值的数组
            if (!flag) {
                $('.name_input_tip').html('不可空置/支持中英文，最多32个字符').show();
                return false;
            } else {
                $('.name_input_tip').hide();
            }
            debugger;
            if (!$('.img_con').attr("src")) {
                $("._upImg_tip").html("未添加图片").show();
                return false;
            } else {
                $("._upImg_tip").hide();
            }
            if (_backLeafClassIds.length == 0) {
                $("._backLeafClassIds_tip").html("请将三级关联分类勾选完全").show();
                return false;
            } else {
                $("._backLeafClassIds_tip").hide();
            }
            ;
            // var _picUrl = $('.img_con').attr("src");
            debugger;
            param = {
                name: name,
                state: state,
                picUrl: _picUrl,
                parentId: _selfId,
                backLeafClassIds: _backLeafClassIds
            };
            addInteract(param);
        } else {
            param = {
                name: name,
                state: state,
                // isLeaf:_isLeaf,
                parentId: _selfId
            }
            if (flag) {
                addInteract(param);
            } else {
                $('.name_input_tip').html('不可空置/支持中英文，最多32个字符').show();
            }
        }
        ;
    });
});

/*三级联动操作逻辑*/
function filterCategories() {
    dataOrigin = dataJson.options;
    var str = "";
    $.each(dataOrigin, function (index, item) {
        str += '<li data-id="' + item.id + '">' + item.name + '</li>'
    });
    $("#selectbox1 ul").html(str);
    // $("#selectbox1").css("background-color", "#fff");
    $("#selectbox2").css("background-color", "#eaecf2");
    $('.multiselect').css("background-color", "#eaecf2");
    $("#selectbox1 ul li").click(function () {
        $("#selectbox2").selectBox("removeAll");
        $('#multiselect').empty();
        // $("#multiselect").append("");
        $("#multiselect").multiselect("destroy").multiselect({
            nonSelectedText: '--请选择--',
            buttonText: function (str3) {
                var selected = "";
                if (str3.length == 0) {
                    return '请选择';
                } else {
                    str3.each(function () {
                        selected += $(this).text() + ',';
                    });
                    selected = selected.substr(0, selected.length - 1);
                    return selected.substr(0, selected.length);
                }
            }
        });
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
        $('.multiselect').css("background-color", "#eaecf2");
        $("#selectbox2 ul li").click(function () {
            $("#multiselect").multiselect("destroy");
            var $this = $(this);
            categoriesId2 = $this.attr('data-id');
            var str3 = "";
            $.each(dataOrigin, function (index, item) {
                //一级遍历
                if (item.id == categoriesId1) {//抓取一级
                    $.each(item.child, function (index2, item2) {//遍历二级
                        if (item2.id == categoriesId2) {//抓取已选择二级

                            $.each(item2.child, function (index3, item3) {//三级遍历
                                str3 += '<option class="leaf_option" value="' + item3.id + '" data-valuesid="' + item3.id + '">' + item3.name + '</option>'
                            });
                        }
                    })
                }
            });
            $('#multiselect').empty();
            $("#multiselect").append(str3);

            $("#multiselect").multiselect({
                nonSelectedText: '--请选择--',
                buttonText: function (str3) {
                    var selected = "";
                    if (str3.length == 0) {
                        return '请选择';
                    } else {
                        str3.each(function () {
                            selected += $(this).text() + ',';
                            // _backLeafClassIds += $(this).val() + ",";
                        });
                        selected = selected.substr(0, selected.length - 1);
                        // _backLeafClassIds = _backLeafClassIds.substr(0, _backLeafClassIds.length - 1);
                        return selected.substr(0, selected.length);
                    }
                }
            });

            // $('#multiselect').multiselect('select', ['32']);//默认赋值
            $("#multiselect").multiselect('refresh');
        });
    });
}

function addInteract(param) {
    debugger;
    $.ajax({
        type: "post",
        url: everyGradeAdd_Url,
        dataType: "json",
        data: param,
        success: function (data) {
            debugger;
            if (data.success == true) {//判断返回参数中某个数据，不是这个
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

                $("#popwin_Close").on("click", function () {
                    self.location = document.referrer;
                });
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
                $(".attr_manag_add .mask_tip").html(data.message);
                // alert('该分类名已经存在')
            }
        },
        error: function () {
            debugger;
        }
    });
};

//根据id拉取顶部信息
function top_InfoPull() {
    var param = {
        id: _selfId
    }
    $.ajax({
        type: "post",
        url: everyGradeInfo_Url,
        sync: false,
        cache: false,
        dataType: "json",
        data: param,
        success: function (data) {
            debugger;
            if (data.success == true) {
                var res = data.data;
                _state = res.state;
                var _level = res.level;
                var res = data.data;
                var _name = res.name;//上一级的名称
                if (_level == 1) {
                    //分类等级二级
                    $(".everyGrade_level").html("二级分类")
                } else if (_level == 2) {
                    //分类等级叶子
                    $(".everyGrade_level").html("叶子分类")
                }
                ;
                $(".blong_faherName").html(_name);
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
                $(".attr_manag_add .mask_tip").html("连接失败");
                // alert('失败')
            }
        },
        error: function () {
        }
    });
};

// 依据id拉取底部三级联动数据源获取
function categoriesAll() {
    $.ajax({
        type: "post",
        catch: false,
        async: false,
        url: categoriesUrl,
        dataType: "json",
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
                // var html = template("belong_box", dataJson);
                // $('.belong_box_con').append(html);
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
                $(".attr_manag_add .mask_tip").html(res.message);
                // alert("出现错误")

            }
        },
        error: function () {
        }
    });

};

//上传图片的交互函数
function upImg(img) {
    console.log(img.files[0]);
    var imgType = img.files[0].name.split(".");
    imgType = imgType[imgType.length - 1];
    console.log(imgType);
    if (imgType == "png" || imgType == "jpg" || imgType == "jpeg") {
    } else {
        alert("上传的图片格式仅为jpg、png、jpeg");
        return;
    }
    if (img.files[0].size > 3 * 1024 * 1024) {
        alert("上传的图片大小最多为3M");
        return;
    }
    var formData = new FormData();
    console.log(formData);
    formData.append('uploadFile', img.files[0]);
    debugger;
    $.ajax({
        url: everyGradeAddImg_Url,
        type: "post",
        processData: false,
        contentType: false,
        dataType: "json",
        cache: false,
        timeout: "10000",
        data: formData,
        success: function (res) {
            debugger;
            console.log(res);
            if (res.success == true) {
                // var imgUrl = "172.16.10.162:8888/" + res.data.url;
                var imgUrl = res.data.ip + res.data.url;
                _picUrl = res.data.url;
                $(".img_con").attr("src", imgUrl).removeClass("hide_ctr_absolute");
                $(".up_img_ope i").html("更改图片");
                // $(img).parent('.account_file').prev().prev().css("display", "block");
                // $(img).parent('.account_file').prev().find("img").attr("src", res.data);
                // $(img).parent('.account_file').css("display", "none");
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
};

//更改图片的交互函数
function change(img) {
    var formData = new FormData();
    formData.append('uploadFile', img.files[0]);
    $.ajax({
        url: everyGradeAddImg_Url,
        type: "post",
        processData: false,
        contentType: false,
        dataType: "json",
        cache: false,
        data: formData,
        success: function (res) {
            if (res.success == true) {
                // var imgUrl = res.data.ip + res.data.url;
                // $(".img_con").attr("src", imgUrl).removeClass("hide_ctr_absolute");
                $(img).prev().prev().attr("src", res.data);
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}