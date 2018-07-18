//分页地址变量
// var localUrl = 'http://172.16.10.117:8007';//陶帅江变量
var localUrl = getBaseUrl('t');//陶帅江变量
var localUrl_W = getBaseUrl('w');//陶帅江变量

//定价审核分页地址
var price_verifyUrl = localUrl + '/goods/draft/operator/pricingMaintainList';

// var price_verifyUrl = '../../html/purchase_manage/price_verify.json';
//通过
var price_passUrl = localUrl + '/goods/draft/operator/pass';
//拒绝
var price_rejectUrl = localUrl + '/goods/draft/operator/refuse';
//顶部后台叶子所有分类地址
var backLeaf_AllUrl = localUrl_W + '/goods/GoodsClassification/showAllLeafClass';
//顶部所有品牌的地址
var brand_AllUrl = localUrl_W + '/goods/brand/showBrandLeafClassOpenClose';
//顶部所有商品类型的请求地址
var goods_AllUrl = localUrl_W + '/goods/service/showAll';
// var _areaId = $.getUrlParam("_id");//
$.sidebarMenu($('.sidebar-menu'));
var storage_data;
var spu_page_arr = [];
var _nowPage = 1;
var check_arr = [];
var _checkedNum = 0;
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
    //模拟按钮事件绑定
    // checkAll("show");//测试代码
    //判断顶部是否显示更多更少按钮
    judgeSwitch_ishave();
    topArea_active();
    backLeaf_AllFun(backLeaf_AllUrl);//后台叶子列表
    brand_AllFun(brand_AllUrl);//品牌列表渲染
    goods_ModelFun(goods_AllUrl);//品牌列表渲染
    // 首屏加载【首次加载拉取10条】
    searchPage();
    //页码容积数调节器
    $('.pageSize_switch').on('change', function () {
        searchPage();
        searchTotalCount();
        draw_totalNum(_totalCount);
    });
    //品牌激活事件
    $('.moldBrand_switch').on('click', 'span', function () {
        var _index = $(this).index();
        $(this).addClass("moldBrand_switch_active").siblings().removeClass("moldBrand_switch_active");
        $("#table_data tbody").html("");
        searchPage();//此处传参数1
    });
    //分类激活事件
    $('.moldKind_switch').on('click', 'span', function () {
        var _index = $(this).index();
        $(this).addClass("moldKind_switch_active").siblings().removeClass("moldKind_switch_active");
        $("#table_data tbody").html("");
        searchPage();//此处传参数1
    });
    //商品类型激活事件
    if ($('.moldClass_types_con').length > 0) {
        $('.moldClass_types_con').on('click', 'span', function () {
            var _index = $(this).index();
            $(this).addClass("moldType_active").siblings().removeClass("moldType_active");
            $("#table_data tbody").html("");
            searchPage();
        });
    }
    ;
});
/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */
var pagination = new Pagination(price_verifyUrl, "page", function (data) {
    fillTableData(data)
});

function searchPage(page) {//首次两参进入
    pagination.search(getParams(), page);
}

/** 得到搜索条件的json对象 */
function getParams() {
    var _lcid = undefined, _brandId = undefined, _typeId = undefined;
    //形参将请求页码page传入，此处将形参变量承接
    _lcid = $(".moldKind_switch_active").data("lcid");
    _brandId = $(".moldBrand_switch_active").data("bcid");
    _typeId = $(".moldType_active").data("typeid");

    var params = {
        pageSize: _pageSize//容积页数
        // pageNum:_pageNum
        // lcid: _lcid,//分类id
        // brandId: _brandId,//品牌ID
        // type: _type,//完成品，定制品
    };
    if (_lcid != 'lcidAll' && _lcid != undefined) {
        params.lcids = _lcid;
    }
    ;
    if (_brandId != 'bcidAll' && _lcid != undefined) {
        params.brandId = _brandId;
    }
    ;
    if (_typeId != 'typeidAll' && _typeId != undefined) {
        params.type = _typeId;
    }
    return params;
};

/** table数据 */
function fillTableData(data) {
    debugger;
    if (data.length == 0 || !data.length) {
        $("#pic_no").show();
        $("#table_data").hide();
        $(".leftBottom").hide();
    }
    ;
    $("#pic_no").hide();
    var resData = data;
    // var resData = data[z];
    debugger;
    var tr = "";
    var content = $("#table_data tbody");
    // content.html("");
    var doc = "";
    for (var i = 0; i < resData.length; i++) {
        debugger;
        doc += "<tr>";
        doc += "<td class='td1 clearfix'><div class='td1_sonL fl'><img class='goods_img_box' src='" + resData[i].pics[0].pic + "'></div>";
        doc += "<div class='td1_sonR fl'>";
        // doc += "<dl><span class='pv_brandName'>" + resData[i].brandName + "</span><span class='pv_leafName'>" + resData[i].leafClassName + "</span><span class='pv_model'>" + resData[i].model + "</span></dl>";
        doc += "<dl>";
        debugger;
        if (resData[i].sysName && resData[i].sysName.length > 1) {
            doc += "<span class='pv_attrValue'>" + resData[i].sysName + "</span>";
        } else {
            doc += "<span class='pv_attrValue'>" + resData[i].sysName + "</span>";
        }
        doc += "</dl></div></td>";
        doc += "<td>" + resData[i].number + "</td>";//商品编号
        if (resData[i].goodsService != undefined) {
            doc += "<td class=''>" + resData[i].goodsService.goodsType + "</td>";//
        } else {
            doc += "<td class=''>&nbsp;</td>";//
        }
        // doc += "<td>" + resData[i].goodsService.goodsType + "</td>";//商品类型
        doc += "<td>¥" + resData[i].price + "</td>";//销售定价
        doc += "<td data-id='" + resData[i].id + "'><span class='page_miniBtn' onclick='price_pass(this)'>通过</span><span class='page_miniBtn' onclick='price_reject(this)'>拒绝</span></td>";//操作

        doc += "</tr>";

    }
    content.html(doc);
};

function price_pass(obj) {
    var $this = $(obj);
    var _id = $this.parent().data("id");
    var pass_params = {
        id: _id
    }
    $(".index_mask",parent.document).show();
    var html = template('class_bubble', {});
    $.popwin(html, {
        title: '',
        fixed: true,
        drag: false, //是否可拖拽
    });
    $("#popwin_Out").addClass("attr_manag_add");
    $(".title_tip").html("确认后，商品将按照此定价执行，是否确认此操作?");
    $.popwin.setPosition(600, 450);
    $('body').off('click').on('click', '.cancle_xsBtn', function () {
        $("#popwin_Blank").remove();
        $("#popwin_Out").remove();
        $(".index_mask",parent.document).hide();
    });

    $("#popwin_Close").on("click", function () {
        $("#popwin_Blank").remove();
        $("#popwin_Out").remove();
        $(".index_mask",parent.document).hide();
    })
    $(document).off('click').on('click', '.sure_xsBtn', function () {
        //此时开始ajax交互。
        debugger;
        $.ajax({
            url: price_passUrl,
            type: 'post',
            dataType: 'json',
            data: pass_params,
            success: function (data) {
                debugger;
                if (data.success == true) {
                    searchNowPage();
                    searchPage(_nowPage);
                    // $("#popwin_Blank").remove();
                    // $("#popwin_Out").remove();
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
                }
            }
        });
    });
}

function price_reject(obj) {
    var $this = $(obj);
    var _id = $this.parent().data("id");
    var pass_params = {
        id: _id
    }

    $(".index_mask",parent.document).show();
    var html = template('class_bubble', {});
    $.popwin(html, {
        title: '',
        fixed: true,
        drag: false, //是否可拖拽
    });
    $("#popwin_Out").addClass("attr_manag_add");
    $(".title_tip").html("您拒绝了此商品的定价申请，该商品将被打回重新定价，是否确认此操作？");
    $.popwin.setPosition(600, 450);
    $('body').off('click').on('click', '.cancle_xsBtn', function () {
        $("#popwin_Blank").remove();
        $("#popwin_Out").remove();
        $(".index_mask",parent.document).hide();
    });
    $(document).off('click').on('click', '.sure_xsBtn', function () {
        //此时开始ajax交互。
        debugger;
        $.ajax({
            url: price_rejectUrl,
            type: 'post',
            dataType: 'json',
            data: pass_params,
            success: function (data) {

                if (data.success == true) {
                    searchNowPage();
                    searchPage(_nowPage);
                    // $("#popwin_Blank").remove();
                    // $("#popwin_Out").remove();
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
                }
            }
        });
    });
}

function searchNowPage() {//首次两参进入
    var a;
    a = pagination.returnParams();
    _nowPage = a.currentPageNo;

};






