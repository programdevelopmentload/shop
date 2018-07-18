$.sidebarMenu($('.sidebar-menu'));
//分页地址变量
var localUrl = getBaseUrl('w');
var localHtttpImg = getBaseUrl('img');
//添加品牌地址
var brand_addUrl = localUrl + '/goods/brand/add';
//分类包含层级地址
var category_threeUrl = localUrl + '/goods/GoodsClassification/findAllBackClassOpen';
//图片上传地址
var everyGradeAddImg_Url = localHtttpImg + '/pic/upload';
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
var nameflag = false;
var logoflag = false;
var relationflag = false;
var allflag = false;
var _picUrl = "";
$(function () {
    //渲染三级分类包含
    category_threePull(category_threeUrl);
    var addDom = $(".brandAdd_con_right .sure_xsBtn");
    //属性名称输入失焦事件
    $(".everyAdd_input").blur(function () {
        if (regex_reName.test($('.everyAdd_input').val())) {
            $('.brand_name_tip').hide();
            nameflag = true;
        } else {
            $('.brand_name_tip').html('不可空置/支持中英文，最多32个字符').show();
            nameflag = false;
        }
    });

    //主按钮提交数据事件
    addDom.on('click', function () {
        //_name,品牌名称获取
        var _name = $('.everyAdd_input').val(),//@品牌名称
            // _logofile = $("#logo_brand_file")[0].files[0];
            _state = +$('input:radio[name="addSwitch"]:checked').attr("value");
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
        nameflag = regex_reName.test($.trim($('.everyAdd_input').val()));
        if (!nameflag || !_name) {
            nameflag = false;
            $(".index_mask",parent.document).show();
            var html = template('ajax_alert', {});
            $.popwin(html, {
                title: '未填写完全',
                fixed: true,
                drag: false, //是否可拖拽
            });
            $("#popwin_Out").addClass("attr_manag_add");
            $.popwin.setPosition(410, 560);
            $(".attr_manag_add .mask_tip").html("请填写属性名称");
            $("#popwin_Close").on("click", function () {
                $("#popwin_Blank").remove();
                $("#popwin_Out").remove();
                $(".index_mask",parent.document).hide();
            })
            $('.attr_name_tip').html('不可空置/支持中英文，最多32个字符').show();
            return false;
        } else {
            nameflag = true;
            $('.attr_name_tip').hide();
        }
        ;

        if (!$('.img_con').attr("src")) {
            $("._upImg_tip").html("未添加图片").show();
            return false;
        } else {
            $("._upImg_tip").hide();
        }
        if (nameflag && logoflag && !_leafClassId) {
            leafClassIdFlag = false;
            $(".index_mask",parent.document).show();
            var html = template('ajax_alert', {});
            $.popwin(html, {
                title: '未填写完全',
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
            $(".attr_manag_add .mask_tip").html("请勾选添加属性的关联分类");
            $('.relation_cate_tip ').html('请勾选添加属性的关联分类').show();
        } else {
            leafClassIdFlag = true;
            $('.relation_cate_tip ').hide();
        }
        ;
        if (nameflag && logoflag && relationflag) {
            allflag = true;
        } else {
            allflag = true;
        }
        ;
        // var formData = new FormData();
        // formData.append("logo", $("#logo_brand_file")[0].files[0]);//图片
        // formData.append("nameCh",_name);//名字
        // formData.append("state",_state);//状态
        // formData.append("leafClassIds",_leafClassId);//叶子节点
        debugger;
        // var _logo = $('.img_con').attr("src");
        var paramaa = {
            nameCh: _name,
            state: _state,
            logo: _picUrl,
            leafClassIds: _leafClassId
        };
        if (allflag) {
            debugger;
            $.ajax({
                url: brand_addUrl,
                type: 'post',
                cache: false,
                dataType: 'json',
                data: paramaa,
                success: function (data) {
                    if (data.success == true) {
                        debugger;
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
                        })
                    } else {
                        var msg = "您添加的" + data.message;
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
                        $(".attr_manag_add .mask_tip").html(msg);
                    }
                }
            });
        } else {
            $('.everyGradeTip').html('不可空置/支持中英文，最多32个字符').show();
        }
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
            $("._upImg_tip").hide();
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
                $(img).prev().prev().attr("src", res.data);
            }
        },
        error: function (err) {
            console.log(err)
        }
    })
}