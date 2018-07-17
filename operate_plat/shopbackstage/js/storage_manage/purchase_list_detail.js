var _orderNum = $.getUrlParam("orderNum");//本行数据id
var localHtttp = 'http://172.16.39.70:8005';//蒋磊
//详情地址
var purchase_detailUrl = localHtttp + '/purchase/order/info';
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    var params = {
        'orderNum': _orderNum
    };
    debugger;
    $.ajax({
        type: "post",
        url: purchase_detailUrl,
        dataType: "json",
        data: params,
        success: function (data) {
            if (data.success == true) {//判断返回参数中某个数据，不是这个
                var res = data.data;
                var html = template("model_con_ajax", res);
                $('.model_box').append(html);
                fillTableData(res);
                $(".detail_remark").html(res.comment);
            } else {
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410, 460);
                $(".attr_manag_add .mask_tip").html("网络连接错误");
            }
        },
        error: function () {
        }
    });
})

/** table数据 */
function fillTableData(data) {
    console.log(data);
    var content = $("#self_table tbody");
    content.html("");
    var doc = '';
    var purchaseOrderGoods = data.purchaseOrderGoods;
    for (var i = 0; i < purchaseOrderGoods.length; i++) {
        doc += '<tr>'

        doc += '<td class="td1 ">';
        doc += '<div class="goods_img_box">' + ' <img class="goods_img" src="' + purchaseOrderGoods[i].picture + '"/></div>';
        doc += '<div class="goods_info_box"><div>' + purchaseOrderGoods[i].goodsType + '</div><div>' + purchaseOrderGoods[i].attribute + '</div></div>';
        doc += '</td>';

        doc += '<td class="td2" colspan="3">'
        var pps = purchaseOrderGoods[i].purchaseOrderSuppliers;
        for (var h = 0; h < pps.length; h++) {
            doc += '<div class="td2_son">';
            doc += '<span class="td2_son_son1">' + pps[h].supplier + '</span> <span class="td2_son_son2">X' + pps[h].count + '</span><span class="td2_son_son3">￥' + pps[h].price + '</span>';
            doc += '</div>';
        }
        doc += '</td>';
        doc += '<td>'+purchaseOrderGoods[i].totalCount+'</td>';
        doc += '</tr>'
    }
    content.append(doc)
}




