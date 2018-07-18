//分页地址变量
var localUrl = getBaseUrl('t');
//spu分页地址
// var spu_pageUrl = localUrl + '/goods/sku/listGroupSplit';
// var spu_pageUrl = '../../html/purchase_manage/spu_fenye.json';
//提交选货地址【该接口仅有逻辑，没有实战检验】
var regex_money = /^[0-9]+(.[0-9]{1,2})?$/;
var report_price_pushUrl = localUrl + "/goods/draft/operator/updateSkuPrice";
var _ct_Id = $.getUrlParam("_id");
$.sidebarMenu($('.sidebar-menu'));
var storage_data_jump;
var check_arr_jump;
var _type_total_num = 0,
    _type_biao_num = 0,
    _type_biaoNo1_num = 0,
    _type_biaoNo2_num = 0,
    _type_fix_num = 0;
var submit_str = "";
var check_arr = [];
// var _checkedNum = 0;
var _isMore = 1;
var _currentPage,
    _pageSize = 10,
    _lcid,
    _brandId,
    _type,
    _sorts,
    _ids,
    _state;
$(function () {
    initPrice_setNew();

    // storage_data_jump = $.parseJSON(storage_data_jump);

    check_arr_jump = $.parseJSON(check_arr_jump);//已被选择的id
    storage_data_jump = $.parseJSON(storage_data_jump);//已被选择的id
    _type_total_num = check_arr_jump.length;//

    fillTableData(storage_data_jump);//表格数据
    var res_arr = [];

    $(storage_data_jump).each(function (i, v) {
        $(check_arr_jump).each(function (j, k) {
            if (k == v.spuId) {
                res_arr.push(v);
            }
        })
    });

    $(res_arr).each(function (h, z) {

        $(z.goodsSkus).each(function (x, y) {
            if (h == 0) {
                submit_str += y.id;
            } else {
                submit_str += "," + y.id
            }
        })
    });

    var _type_biao_numArr = [],
        _type_biaoNo1_numArr = [],
        _type_biaoNo2_numArr = [],
        _type_fix_numArr = [];
    $(res_arr).each(function (hh, zz) {

        $(zz.service).each(function (xx, yy) {

            if (yy.goodsType == '标品') {
                _type_biao_numArr.push(yy);
            } else if (yy.goodsType == '非标1类') {
                _type_biaoNo1_numArr.push(yy);
            } else if (yy.goodsType == '非标2类') {
                _type_biaoNo2_numArr.push(yy);
            } else {
                _type_fix_numArr.push(yy)
            }
        })
    });
    _type_biao_num = _type_biao_numArr.length;
    _type_biaoNo1_num = _type_biaoNo1_numArr.length;
    _type_biaoNo2_num = _type_biaoNo2_numArr.length;
    _type_fix_num = _type_fix_numArr.length;
    console.log(submit_str);

    $(".type_total_num").text(_type_total_num);
    $(".type_biao_num").text(_type_biao_num);
    $(".type_biaoNo1_num").text(_type_biaoNo1_num);
    $(".type_biaoNo2_num").text(_type_biaoNo2_num);
    $(".type_fix_num").text(_type_fix_num);
    var checkMoneyFlag = false;
    $(".go_merge_btn").off("click").on("click", function () {
        var checkMoney_dom = $(".everySku_input");
        checkMoney_dom.each(function (i, v) {
            var checkSign = regex_money.test($.trim($(v).val()))
            if (!checkSign) {
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
                debugger;
                // $(".attr_manag_add .mask_tip").html("请确保所有输入是两位小数点数字");
                return false;
            }
        })
        var pushObj = [];
        $(".everySku_input").each(function (ii, vv) {
            var a = {};
            a.id = $(vv).attr("data-skuid");
            debugger;
            a.price = +$(vv).val();
            pushObj.push(a);
        });
        console.log(pushObj);
        pushObj = JSON.stringify(pushObj);
        console.log(pushObj);
        debugger;
        // var html = template('ajax_alert', {});
        // $.popwin(html, {
        //     title: '',
        //     fixed: true,
        //     drag: false, //是否可拖拽
        // });
        // $("#popwin_Out").addClass("attr_manag_add");
        // $.popwin.setPosition(410, 460);
        // $(".attr_manag_add .mask_tip").html(info.message);
        push_checkPD(pushObj);
    })

});

/** table数据 */
function fillTableData(data) {

    $("#self_table tbody").html("");
    var content = $("#self_table tbody");
    content.html('');
    var doc = '';
    for (var i = 0; i < data.length; i++) {
        doc += '<tr class=""><td class="order_num_tr text-left" colspan="2">' + data[i].brandName + '&nbsp;&nbsp;' + data[i].leafClassName + '&nbsp;&nbsp;' + data[i].model + '</td> <td class="clearfix ope_report_box"><div class="row clearfix"><div class="col-xs-4"><div class="row">批量定价：</div></div><div class="col-xs-4"><div class="row"><input name="' + data[i].spuId + '" type="text" class="form-control everySku_input_ctr" placeholder="销售价"></div></div><span class="sure_supsBtn col-xs-3" data-spuid="' + data[i].spuId + '" onclick="allChange(this)">确认</span></div></td></tr>';
        //开始拼接左侧区域
        var purchaseOrderGoods = data[i].goodsDrafts;

        for (var j = 0; j < purchaseOrderGoods.length; j++) {
            for (var z = 0; z < check_arr_jump.length; z++) {

                if (check_arr_jump[z] == purchaseOrderGoods[j].id) {
                    doc += '<tr class="cler_fl_abs">';
                    doc += '<td class="td1 cler_fl_abs"><div class="goods_img_box">';
                    doc += '<img class="goods_img" src="' + purchaseOrderGoods[j].pics[0].pic + '"></div><div class="goods_info_box">';
                    var attrVol = purchaseOrderGoods[j].attributes;

                    for (var y = 0; y < attrVol.length; y++) {
                        doc += '<div class="pv_attrValue">' + attrVol[y].value + '</div>';
                    }
                    doc += '</div></td>';
                    doc += '<td class="text-center everySku_input_con">' + purchaseOrderGoods[j].number + '</td>';//商品编号
                    doc += '<td class=""><div class="col-xs-6 text-center everySku_input_con"><input data-skuid="' + purchaseOrderGoods[j].id + '" name="' + data[i].spuId + '" type="text" class="form-control everySku_input col-xs-3" placeholder="￥0.00"></div></td>';//销售定价
                    doc += '</tr>';
                }
            }
        }
    }
    content.append(doc);
};

//提交选货按钮
function push_checkPD(_push_data) {
    debugger;
    // var _push_data = {
    //     ids: submit_str,
    //     // city: _ct_Id
    //     city: 140100
    // };
    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        type: 'post',
        url: report_price_pushUrl,
        data: _push_data,
        success: function (info) {
            debugger;
            if (info.success == true) {
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
                $(".attr_manag_add .mask_tip").html(info.message);
            }
        },
        error: function (data) {
            debugger;
            console.log(data);
        }
    });
}

//批量定价确认按钮
function allChange(obj) {

    $this = $(obj);
    var namekey = $this.data('spuid');
    var valuekey = $.trim($("input[name=" + namekey + "]").val());
    if (valuekey.length > 0) {
        $("input[name=" + namekey + "]").val(valuekey);
    }
}