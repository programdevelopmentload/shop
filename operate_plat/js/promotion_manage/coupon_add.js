//地址变量
var localUrl = getBaseUrl('g');

var localUrl_W = getBaseUrl('w');
//分类包含层级地址
var category_threeUrl = localUrl_W + '/goods/GoodsClassification/findAllBackClassOpen';
//优惠券添加地址
var couponUrlAdd = localUrl + '/promotionserver/toAddCoupon';
var regex_Name = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,40}/;
var regex_explain = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,100}/;
// var regex_money = /^(([1-9][0-9])|(([0].\d{0,2}|[1-9][0-9].\d{0,2})))$/;
// var regex_money = /^((\d+\.\d*[1-9]\d{1})|(\d*[1-9]\d*\.\d{2}))$/;;
var regex_money = /^[0-9]+(.[0-9]{1,2})?$/;
var regex_num = /^([1-9]\d+|[1-9])$/;
$.sidebarMenu($('.sidebar-menu'));
var flag = false;
var couponName = '',//优惠券名称
    couponRemarks = '',//优惠券的说明
    couponSendType = '',//优惠券发放类型
    couponSettingType = '',//优惠券结算类型
    couponMoney = '',// 优惠金额
    couponNumber = '',//优惠券发放数量
    couponStartTime = '',//优惠券发放时间
    couponEndTime = '',//优惠券发放结束时间
    couponStartPeriod = '',//优惠券有效开始时间
    couponEndPeriod = '',//优惠券有效结束时间
    _leafClassId = '';

/**日历组件初始化代码*/
$(function () {
    debugger;
    //渲染三级分类包含
    checkAll('leaf_arr');
    category_threePull(category_threeUrl);
    // initTree("treeDemo",url,null,param,timeSign,mainKnowledgeSelect);
    // var timeSign = (new Date()).valueOf();
    // initTree("categoryTree", '../../html/Category_manage/showall.json',null,null,timeSign);
    // openTreeTop();//打开top目录
    layui.use('laydate', function(){
        var laydate = layui.laydate;

        //执行一个laydate实例
        laydate.render({
            elem: '#test5', //指定元素
            // max:'date',//超过当前时间
            // format:"yyyy-MM"
            type:"datetime"
        });
    });
    setDateTime();
    setDateTime2();
    $(".cop_name_input").blur(function () {
        if (regex_Name.test($('.cop_name_input').val())) {
            $('.cop_name_tip ').hide();
        } else {
            $('.cop_name_tip ').html('不可空置/支持中英文，最多40个字符').show();
        }
    });
    $(".use_explain").blur(function () {
        if ($('.use_explain').val() == "请填写优惠券使用说明." || !$('.use_explain').val()) {
            $('.use_explain_tip').html('不可空置/支持中英文，最多100个字符').show();
        } else if (regex_explain.test($('.use_explain').val())) {
            $('.use_explain_tip').hide();
        } else {
            $('.use_explain_tip').html('不可空置/支持中英文，最多100个字符').show();
        }
    });
    $(".cash_count_input").blur(function () {
        if (regex_money.test($('.cash_count_input').val())) {
            $('.cash_count_tip').hide();
        } else {
            $('.cash_count_tip').html('精确到小数点后两位的不小于1的数字').show();
        }
    });

    $(".grant_num_input").blur(function () {
        if (regex_num.test($('.grant_num_input').val())) {
            $('.grant_num_tip').hide();
        } else {
            $('.grant_num_tip').html('只能不小于1的整数').show();
        }
    });
    $(".coupon_addBtn").on("click", function () {
        couponStartTime = $("#dates_start1").val();//优惠券发放时间
        couponEndTime = $("#dates_end1").val();
        couponStartPeriod = $("#dates_start2").val();//优惠券有效开始时间
        couponEndPeriod = $("#dates_end2").val();
        couponName = $.trim($(".cop_name_input").val());
        couponRemarks = $.trim($(".use_explain").val());
        couponSendType = $.trim($("input[name='sendType']:checked").val());
        couponSettingType = $.trim($("input[name='accountType']:checked").val());
        couponMoney = $.trim($(".cash_count_input").val());
        couponNumber = $.trim($(".grant_num_input").val());
        if (couponNumber == "") {
            couponNumber = null
        }
        if (!couponName || !regex_Name.test(couponName)) {
            // bubble("优惠券名称输入错误");
            $('.cop_name_tip ').html('不可空置/支持中英文，最多40个字符').show();
            return false;
        } else {
            $('.cop_name_tip ').hide();
        }
        ;
        if (!couponRemarks || couponRemarks == "请填写优惠券使用说明." || !regex_explain.test(couponRemarks)) {
            $('.use_explain_tip').html('不可空置/支持中英文，最多100个字符').show();
            return false;
        } else {
            $('.use_explain_tip').hide();
        }
        ;
        if (!couponMoney || !regex_money.test(couponMoney)) {
            $('.cash_count_tip').html('精确到小数点后两位的不小于1的数字').show();
            return false;
        } else {
            $('.cash_count_tip').hide();
        }
        ;
        if (!couponNumber || !regex_num.test(couponNumber)) {
            $('.grant_num_tip').html('只能不小于1的整数').show();
            return false;
        } else {
            $('.grant_num_tip').hide();
        }
        if (!couponNumber || !regex_num.test(couponNumber)) {
            $('.grant_num_tip').html('只能不小于1的整数').show();
            return false;
        } else {
            $('.grant_num_tip').hide();
        }
        ;

        if (!couponStartTime || !couponEndTime) {
            $('.send_time_tip').html('发放时间未选择完全').show();
            return false;
        } else {
            $('.send_time_tip').hide();
        }
        if (!couponStartPeriod || !couponEndPeriod) {
            $('.effective_time_tip ').html('有效期时间未选择完全').show();
            return false;
        } else {
            $('.effective_time_tip ').hide();
        }
        ;
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
        var add_param = {
            'couponStartTime': couponStartTime,
            'couponEndTime': couponEndTime,
            'couponStartPeriod': couponStartPeriod,
            'couponEndPeriod': couponEndPeriod,
            'couponName': couponName,
            'couponRemarks': couponRemarks,
            'couponSendType': couponSendType,
            'couponSettingType': couponSettingType,
            'couponMoney': couponMoney,
            'couponNumber': couponNumber,
            'leafClassId': _leafClassId
        };
        debugger;
        $.ajax({
            url: couponUrlAdd,
            type: 'post',
            dataType: 'json',
            data: add_param,
            success: function (data) {
                debugger;
                if (data.success == true) {
                    $(".index_mask", parent.document).show();
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
                        $(".index_mask", parent.document).hide();
                    })
                    $(".attrAdd_container .mask_tip").html("添加成功");
                    // alert('添加成功')
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
                    $(".attrAdd_container .mask_tip").html("出现错误");
                    // alert(msg);
                }
            }
        });
    })
});

function bubble(params) {
    var str = params;
    $(".index_mask", parent.document).show();
    var html = template('ajax_alert', {});
    $.popwin(html, {
        title: '请填写完全',
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
    $(".attr_manag_add .mask_tip").html(str);
}

//无传参拉取嵌套层级分类包含信息
function category_threePull(category_threeUrl) {
    var dataJson = {};
    debugger;
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