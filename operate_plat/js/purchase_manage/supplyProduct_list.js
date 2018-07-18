//分页地址变量
var localUrl = 'http://172.16.34.227:8007';
//供货清单分页地址
var supplyPD_pageUrl = localUrl + '/goods/sku/supplyList';
// var supplyPD_pageUrl = '../../html/purchase_manage/gonghuoqingdan.json';
var _ct_Id = $.getUrlParam("_id");
var _totalCount;
var _lcid,
    _brandId,
    _type,
    _area,
    _pageSize;
$(function () {
    //判断顶部是否显示更多更少按钮
    judgeSwitch_ishave();
    topArea_active();
    searchPage();
    searchTotalCount();
    draw_totalNum(_totalCount);
//品牌激活事件
    $('.moldBrand_switch').on('click', 'span', function () {
        var _index = $(this).index();
        $(this).addClass("moldBrand_switch_active").siblings().removeClass("moldBrand_switch_active");
        $("#self_table tbody").html("");
        searchPage();
        searchTotalCount();
        draw_totalNum(_totalCount);
    });
//分类激活事件
    $('.moldKind_switch').on('click', 'span', function () {
        var _index = $(this).index();
        $(this).addClass("moldKind_switch_active").siblings().removeClass("moldKind_switch_active");
        $("#self_table tbody").html("");
        searchPage();
        searchTotalCount();
        draw_totalNum(_totalCount);
    });
//商品类型激活事件
    if ($('.moldClass_types_con').length > 0) {
        $('.moldClass_types_con').on('click', 'span', function () {
            var _index = $(this).index();
            $(this).addClass("moldType_active").siblings().removeClass("moldType_active");
            searchPage();
            searchTotalCount();
            draw_totalNum(_totalCount);
        });
    }
    ;
    //页码容积数调节器
    $('.pageSize_switch').on('change', function () {
        searchPage();
        searchTotalCount();
        draw_totalNum(_totalCount);
    });
});
/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */
var pagination = new Pagination(supplyPD_pageUrl, "page", function (data) {
    fillTableData(data)
});

function searchPage(page) {//首次两参进入
    pagination.search(getParams(), page);
}

/** 得到搜索条件的json对象 */
function getParams() {
    _pageSize = $('.pageSize_switch').val();
    _lcid = $(".moldKind_switch_active ").data("lcid");
    _brandId = $(".moldBrand_switch_active  ").data("bcid");
    _type = $(".moldType_active").data("type");
    var params = {
        'pageSize': _pageSize,//容积页码数
        // 'lcid': _lcid,//分类id
        // 'brandId': _brandId,//品牌id
        // 'type': _type,//完成品，定制品
        'area': 1
    };
    return params;
};

/** table数据 */
function fillTableData(data) {
    debugger;
    var resData = data;
    var tr = "";
    var content = $("#table_data tbody");
    content.html("");
    var doc = "";
    for (var i = 0; i < resData.length; i++) {
        doc += "<tr>";
        doc += "<td class='goods_info'><span>" + resData[i].brandName + "</span><span>" + resData[i].leafClassName + "</span><span>" + resData[i].model + "</span></td>";
        debugger;
        doc += "<td>" + resData[i].service.goodsType + "</td>>";
        doc += "<td class='right_box' colspan='3'>";
        var skuInfo = resData[i].goodsSkus;
        for (var j = 0; j < skuInfo.length; j++) {
            debugger;
            doc += "<div class='clearfix'><div class='fl right_con clearfix'><div class='right_con_son1 fl'><img src='" + skuInfo[j].pics[0].pic + "'></div>";
            var attrval = skuInfo[j].attributes;
            doc += "<div class='right_con_son2 fl'>";
            for (var k = 0; k < attrval.length; k++) {
                doc += "<div>" + attrval[k].value + "</div>";
            }
            ;
            doc += "</div>";
            doc += "</div>";
            doc += "<div class='fl right_con'>" + skuInfo[j].sortNumber + "</div><div class='fl right_con'>" + draw_updateTime(skuInfo[j].createTime) + "</div></div>";
        }
        doc += "</td>";
        doc += "</tr>";
    }
    content.append(doc);
};

function searchTotalCount() {//首次两参进入
    var totalCount;
    totalCount = pagination.returnParams();
    _totalCount = totalCount.totalCount;
};

function draw_totalNum(_totalCount) {
    $(".total_num").text(_totalCount);
};

function draw_updateTime(_updateTime) {
    return getNowFormatDate(_updateTime);
}
