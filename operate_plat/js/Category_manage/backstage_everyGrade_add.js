// var localHtttp = 'http://172.16.41.23:8007';
var localHtttp = getBaseUrl('w');
var everyGradeAdd_Url = localHtttp +'/goods/GoodsClassification/add';
//id名拉取顶部详情地址
var everyGradeInfo_Url = localHtttp +'/goods/GoodsClassification/showClass';
var regexAdd = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,32}$/;
var flag = false;

$.sidebarMenu($('.sidebar-menu'));
var _isLeaf = +$.getUrlParam("isLeaf");//是否是叶子节点
var _selfId = +$.getUrlParam("selfId");//本行数据id
var _levelSign = $.getUrlParam("level");//本页展示的分类级别
$(function () {
    if(_selfId == 0){
        $(".blongFlag").hide();
        $(".everyGrade_level").text('一级分类')
    }else {
        $(".blongFlag").show();
        top_InfoPull();
    };

    var addDom = $(".cate_everyAdd_con_right .btn_sure");
    $(".everyAdd_input").blur(function(){
        debugger;
        if (regexAdd.test($('.everyAdd_input').val())) {
            $('.everyGradeTip').hide();
            flag=true;
        }else{
            $('.everyGradeTip').html('不可空置/支持中英文，最多32个字符').show();
            flag=false;
        }
    });
    addDom.on('click',function () {
        debugger;
        var name = $.trim($('.everyAdd_input').val());
        var state = +$('input:radio[name="addSwitch"]:checked').attr("value");

        flag = regexAdd.test(name);
        param = {
            name:name,
            state:state,
            isLeaf:_isLeaf,
            parentId:_selfId
        };
        if(flag) {
            addInteract(param);
        }else {
            $('.everyGradeTip').html('不可空置/支持中英文，最多32个字符').show();
        }
    });
});
function  addInteract(param) {
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
                $.popwin.setPosition(410,560);
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask",parent.document).hide();
                    self.location = document.referrer;
                })
                $(".attr_manag_add .mask_tip").html(data.message);
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
                $(".attr_manag_add .mask_tip").html("该分类名已经存在");
                // alert('该分类名已经存在')
            }
        },
        error: function () {
        }
    });
}
//根据id拉取顶部信息
function top_InfoPull() {
    var param = {
        id:_selfId
    }
    $.ajax({
        type: "post",
        url: everyGradeInfo_Url,
        sync:false,
        cache: false,
        dataType: "json",
        data: param,
        success: function (data) {

            if (data.success == true) {

                var res = data.data;
                _state = res.state;
                var _level = res.level;
                var res = data.data;
                var _name = res.name;//上一级的名称
                // var blongType = res.path;//总体拼接
                if(_level == 1){
                    //分类等级二级
                    $(".everyGrade_level").html("二级分类")
                }else if(_level == 2){
                    //分类等级叶子
                    $(".everyGrade_level").html("叶子分类")
                };
                $(".blong_faherName").html(_name);
            } else {
                alert('失败')
            }
        },
        error: function () {
        }
    });
};