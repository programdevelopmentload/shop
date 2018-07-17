var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
var _id = +$.getUrlParam("id");//本行数据id
var _typeinput = $.getUrlParam("typeinput");//本行数据id
debugger;
// var _level;
//前缀地址变量
var localHtttp = getBaseUrl('w');
//拉取所有复选
var bianji_category_threeUrl = localHtttp + '/goods/serviceDetails/findClassByDetailsId';

// var attr_belongTypeUrl = "dibusanji.json";
$.sidebarMenu($('.sidebar-menu'));
var _name;//品牌名称
var _updateTime;//创建时间
var _state;//分类状态
var _brandLogo;//品牌图标
$(function () {
    $(".everyGrade_name").html(_typeinput);
    //底部信息抓取
    attr_belongInfoPull(bianji_category_threeUrl);

});

//依据id拉取底部详细信息函数
//依据id拉取底部详细信息函数
function attr_belongInfoPull(attr_belongTypeUrl){
    var params = {
        detailsId:_id
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
                            debugger;
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
                $(".index_mask",parent.document).show();
                var html = template('ajax_alert', {});
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
                $(".attr_manag_add .mask_tip").html("出现错误");
                // alert("出现错误")

            }
        },
        error: function () {
        }
    });

}
