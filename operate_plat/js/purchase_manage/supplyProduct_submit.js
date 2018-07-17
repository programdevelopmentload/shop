//分页地址变量
var localUrl = 'http://172.16.34.227:8007';
//spu分页地址
// var spu_pageUrl = localUrl + '/goods/sku/listGroupSplit';
// var spu_pageUrl = '../../html/purchase_manage/spu_fenye.json';
//提交选货地址【该接口仅有逻辑，没有实战检验】
var push_goodsUrl = localUrl + "/goods/sku/marketing";
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
    initLocalStorage();
    storage_data_jump = $.parseJSON(storage_data_jump);
    debugger;
    check_arr_jump = $.parseJSON(check_arr_jump);
    _type_total_num = check_arr_jump.length;
    debugger;
    fillTableData(storage_data_jump);
    var res_arr = [];
    $(storage_data_jump).each(function (i, v) {
        $(check_arr_jump).each(function (j, k) {
            if (k == v.spuId) {
                res_arr.push(v);
            }
        })
    });
    debugger;
    $(res_arr).each(function (h, z) {
        debugger;
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
        debugger;
        $(zz.service).each(function (xx, yy) {
            debugger;
            if (yy.goodsType == '标品') {
                _type_biao_numArr.push(yy);
            } else if (yy.goodsType == '非标1类') {
                _type_biaoNo1_numArr.push(yy);
            } else if(yy.goodsType == '非标2类') {
                _type_biaoNo2_numArr.push(yy);
            }else {
                _type_fix_numArr.push(yy)
            }
        })
    });
    _type_biao_num = _type_biao_numArr.length;
    _type_biaoNo1_num = _type_biaoNo1_numArr.length;
    _type_biaoNo2_num = _type_biaoNo2_numArr.length;
    _type_fix_num = _type_fix_numArr.length;
    console.log(submit_str);
    debugger;
    $(".type_total_num").text(_type_total_num);
    $(".type_biao_num").text(_type_biao_num);
    $(".type_biaoNo1_num").text(_type_biaoNo1_num);
    $(".type_biaoNo2_num").text(_type_biaoNo2_num);
    $(".type_fix_num").text(_type_fix_num);
    $(".go_merge_btn").on("click", function () {
        push_checkPD(submit_str);
    })
});

/** table数据 */
function fillTableData(data) {
    debugger;
    var resData = data;
    $("#self_table tbody").html("");
    var tr = "";
    var content = $("#self_table tbody");
    content.html("");
    var doc = "";
    for (var i = 0; i < resData.length; i++) {
        doc += "<tr>";
        // doc += "<td class='hide_ctr'><input type='checkbox' name='testManage' class='item-check' data-spuid='"+ resData[i].spuId +"'></td>";
        doc += "<td>" + resData[i].brandName + resData[i].leafClassName + resData[i].model + "</td>>";
        doc += "<td>" + resData[i].service.goodsType + "</td>>";
        doc += "<td class='right_box' colspan='3'>";
        var skuInfo = resData[i].goodsSkus;
        for (var j = 0; j < skuInfo.length; j++) {
            doc += "<div class='clearfix'><div class='fl right_con clearfix'><div class='right_con_son1 fl'><img src='" + skuInfo[j].pics[0] + "'></div>";
            var attrval = skuInfo[j].attributes;
            doc += "<div class='right_con_son2 fl'>";
            for (var k = 0; k < attrval.length; k++) {
                doc += "<div>" + attrval[k].value + "</div>";
            }
            ;
            doc += "</div>";
            doc += "</div>";
            doc += "<div class='fl right_con'>" + skuInfo[j].sortNumber + "</div>";
            // doc += "<div class='fl right_con'>" + skuInfo[j].createTime + "</div>";
            doc += "</div>";
        }
        doc += "</td>";
        doc += "</tr>";
    }
    content.append(doc);
};

//提交选货按钮
function push_checkPD() {
    debugger;
    var _push_data = {
        ids: submit_str,
        // city: _ct_Id
        city: 140100
    };
    $.ajax({
        type: 'post',
        url: push_goodsUrl,
        data: _push_data,
        success: function (info) {
            if (info.success == true) {
                alert("提交成功")
            }
        },
    });
}








