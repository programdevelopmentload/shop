var localHtttp = 'http://172.16.39.70:8005';//蒋磊
//分页地址
var purchase_listPageUrl = localHtttp + '/purchase/order/list';
// var purchase_listPageUrl = 'skytest.json';
$.sidebarMenu($('.sidebar-menu'));
var _name_input='';
var _num_input = '';
var _status = 'all';
$(function () {
    searchPage();
    $(".list_query").on("click", function () {
        _name_input = $(".goods_name_input").val();
        _num_input = $(".goods_num_input").val();
        _status = $(".order_status_switch").val();
        searchPage();
    })
    $('.pageSize_switch').on('change', function () {
        searchPage();
    })
})

/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */
var pagination = new Pagination(purchase_listPageUrl, "page", function (data) {
    fillTableData(data)
});

function searchPage(page) {//首次两参进入
    pagination.search(getParams(), page);
}

/** 得到搜索条件的json对象 */
function getParams() {
    var pageSize = +$('.pageSize_switch').val();
    var params = {
        'goodsName':_name_input,
        'goodsCode':_num_input,
        'status': _status,
        'pageSize': pageSize
    };
    return params;
};

/** table数据 */
function fillTableData(data) {
    var tr = "";
    var content = $("#table_data tbody");
    content.html("");
    var doc = '';
    for (var i = 0; i < data.length; i++) {
        if (data[i].flag != 0) {
            var purchaseOrderGoods = data[i].purchaseOrderGoods;
            doc += '<tr class="order_num_tr">' + '<td colspan="11" style="text-align:left;line-height:35px">' + '订单编号' + ':' + data[i].orderNum + '</td>' + '</tr>';
            doc += '<tr>';
            //开始拼接左侧区域
            doc += '<td class="left_box" colspan="6">';
            for (var j = 0; j < purchaseOrderGoods.length; j++) {
                doc += '<div class="clearfix left_items">';
                doc += '<div class="fl td_son1 clearfix">';
                doc += '<div class="td_son1_left fl"><img src="' + purchaseOrderGoods[j].picture + '"/></div><div class="td_son1_right fl"><dl>' + purchaseOrderGoods[j].goodsType + '</dl><dl>' + purchaseOrderGoods[j].attribute + '</dl></div>';
                doc += '</div>';
                doc += '<div class="fl td_son2">';
                var pps = purchaseOrderGoods[j].purchaseOrderSuppliers;
                for (var z = 0; z < pps.length; z++) {
                    doc += '<span class="clearfix"><i class="td_son2_son1 fl">' + pps[z].supplier + '</i><i class="td_son2_son2 fl">X' + pps[z].count + '</i><i class="td_son2_son3 fl">¥' + pps[z].price + '</i></span>';
                }
                ;
                doc += '</div>';
                doc += '<div class="fl td_son3 clearfix">';
                doc += '<span><i class="fl">X' + purchaseOrderGoods[j].totalCount + '</i><i class="fl">¥' + purchaseOrderGoods[j].totalPrice + '</i></span>';
                doc += '</div>';
                doc += '</div>';
            }
            doc += '</td>';
            //申请时间【7】
            doc += '<td>' + data[i].createTime + '</td>';
            //状态【8】
            
            doc += '<td>' + _stateDraw(data[i].status) + '</td>';
            //操作【9】
            doc += '<td><a href="./purchase_list_detail.html?orderNum=' + data[i].orderNum + '" class="approve_refuse" data-id="' + data[i].id + '" data-status="1" data-orderNum ="' + data[i].orderNum + '">订单详情</a></td>';
            doc += '</tr>';
        }
    }
    content.append(doc);
};
// 点击查询 
$("#approve_search").click(function () {
    searchPage();
})

function _stateDraw(params) {
    var str = '';
    switch (params) {
        case '0':
            str = '待审核';
            break;
        case '1':
            str = '未通过';
            break;
        case '2':
            str = '待出库';
            break;
        case '3':
            str = '待收货';
            break;
        case '4':
            str = '已完成';
            break;
        case '5':
            str = '已取消';
            break;
    }
    ;
    return str;
}

