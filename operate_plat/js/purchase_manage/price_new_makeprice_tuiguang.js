//分页地址变量[新品定价页面]
var localUrl = getBaseUrl('t');//陶帅江
var localUrl_W = getBaseUrl('w');//陶帅江
//定价地址
var dingjiafenxiao_pageUrl = localUrl + '/goods/draft/operator/pricingList';
// var dingjiafenxiao_pageUrl = '../../html/purchase_manage/fenxiao_liebiao.json';

//顶部后台叶子所有分类地址
var backLeaf_AllUrl = localUrl_W + '/goods/GoodsClassification/showAllLeafClass';
//顶部所有品牌的地址
var brand_AllUrl = localUrl_W + '/goods/brand/showBrandLeafClassOpenClose';
//顶部所有商品类型的请求地址
var goods_AllUrl = localUrl_W + '/goods/service/showAll';
var _ct_id = $.getUrlParam("_id");//
var _area = "";
$.sidebarMenu($('.sidebar-menu'));
var storage_data = [];
var check_arr = [];
var checkSpu_arr = [];
var checkRight_dom;
var spu_page_arr = [];
var check_arrStr = [];
var shop_arrStr = [];
var _isMore = 1;
var _currentPage = 0,
    _pageSize = 10,//测试使用1，实战使用10
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
    getData(1);
    //品牌激活事件
    $('.moldBrand_switch').on('click', 'span', function () {
        var _index = $(this).index();
        $(this).addClass("moldBrand_switch_active").siblings().removeClass("moldBrand_switch_active");
        $("#self_table tbody").html("");
        getData();//此处传参数1
    });
    //分类激活事件
    $('.moldKind_switch').on('click', 'span', function () {
        var _index = $(this).index();
        $(this).addClass("moldKind_switch_active").siblings().removeClass("moldKind_switch_active");
        $("#self_table tbody").html("");
        getData();//此处传参数1
    });
    //商品类型激活事件
    if ($('.moldClass_types_con').length > 0) {
        $('.moldClass_types_con').on('click', 'span', function () {
            var _index = $(this).index();
            $("#self_table tbody").html("");
            $(this).addClass("moldType_active").siblings().removeClass("moldType_active");
            getData();//此处传参数1
        });
    }
    ;

    //点击去定价
    $('.go_merge_btn').off('click').on('click', function () {
        debugger;
        console.log(check_arr.length);
        if (check_arr.length < 1) {
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
            $(".attr_manag_add .mask_tip").html("至少选择1条");
            return false;
        } else {
            storage_data = [];
            $(spu_page_arr).each(function (i, v) {
                $(checkSpu_arr).each(function (j, k) {
                    if (v.spuId == k) {
                        storage_data.push(v);
                    }
                })
            });
            storage_data = JSON.stringify(storage_data);
            setItem_price_setNew(storage_data, check_arr);
            // window.open("./supplyProduct_subfmit.html?_id=" + _id);
            window.open("../../html/purchase_manage/price_report_list_tuiguang.html");
        }
    });
    //监听左侧表格选择了几条
    $('body').on('change', 'input[name="testManage"]', function () {
        var check_dom = $("input[name='testManage']:checked");
        check_arr = [];
        var checkSpu_arrOrigin = [];
        checkSpu_arr = [];
        var json = {};
        check_dom.each(function () {
            check_arr.push($(this).data("skuid"));
            checkSpu_arrOrigin.push($(this).data("leafspuid"));
        });
        debugger;
        check_arr = JSON.stringify(check_arr);
        checkSpu_arrOrigin.forEach(function (item, i) {
            if (!json[item]) {
                json[item] = 222;
            }
        });
        for (var name in json) {
            checkSpu_arr.push(Number(name));//类型发生变化了
        }
        console.log(checkSpu_arr);
        debugger;

    });
    // 滚动加载
    $(window).on('scroll', function () {

        var offsetTop = $('.self_table_box').offset().top;
        var height = $('.self_table_box').height();
        var scrollTop = $(this).scrollTop();
        var winHeight = $(this).height();
        // 计算滚动条的位置
        var offset = offsetTop + height - scrollTop - winHeight;
        // 判断滚动条位置并禁止重复加载
        if (offset <= 50 && !$('.merge_throttle').hasClass('loading') && _isMore) {
            // 获取下一页页码
            var page = $('.merge_throttle').attr('data-page');
            // 发起请求获取数据
            getData();//此处将页码变量page传进去
        }
    });
});


/** table数据 */
function fillTableData(data) {
    debugger;
    var data = data.data.items;
    spu_page_arr = spu_page_arr.concat(data)
    // storage_data = JSON.stringify(spu_page_arr);

    var tr = '';
    var content = $("#self_table tbody");
    // content.html('');
    var doc = "";
    for (var i = 0; i < data.length; i++) {
        // doc +='<div>';
        doc += "<tr class='order_num_tr'>" + "<td colspan='5' style='text-align:left;line-height:35px'>" + data[i].brandName + "&nbsp;&nbsp;" + data[i].leafClassName + "&nbsp;&nbsp;" + data[i].model + "</td></tr>";
        doc += "<tr>";
        //开始拼接左侧区域
        doc += "<td class='left_box' colspan='5'>";
        var purchaseOrderGoods = data[i].goodsDrafts;
        debugger;
        for (var j = 0; j < purchaseOrderGoods.length; j++) {
            var number_ctr = purchaseOrderGoods[j].number + "";
            debugger;
            doc += "<div class='clearfix left_items'><div class='td1 fl'><div class='td1_sonL fl'>";
            doc += "<img class='goods_img_box' src='" + purchaseOrderGoods[j].pics[0].pic + "'></div><div class='td1_sonR fl'>";
            var attrVol = purchaseOrderGoods[j].attributes;
            // debugger;
            for (var y = 0; y < attrVol.length; y++) {
                doc += "<dl class='pv_attrValue'>" + attrVol[y].value + "</dl>";
            }
            doc += "</div></div>";
            doc += "<div class='fl td2'>" + number_ctr + "</div>";
            debugger;
            if (purchaseOrderGoods[j].goodsService != undefined) {
                doc += "<div class='fl td3'>" + purchaseOrderGoods[j].goodsService.goodsType + "</div>";//
            } else {
                doc += "<div class='fl td3'>&nbsp;</div>";//
            }
            doc += "<div class='fl td4 text-center'>" + draw_updateTime(purchaseOrderGoods[j].createTime) + "</div>";
            debugger;
            doc += "<div class='fl td5'><input data-leafspuid='" + purchaseOrderGoods[j].spuId + "' data-skuid='" + purchaseOrderGoods[j].id + "' class='testManage' name='testManage' type='checkbox'></div>";

            doc += "</div>";
        }
        doc += "</td>";


        doc += "</tr>";
        // doc +="</div>";
    }
    content.append(doc);
};

function draw_updateTime(_updateTime) {
    return getNowFormatDate(_updateTime);
};

//滚轮拉取数据函数
function getData() {
    var _lcid = undefined, _brandId = undefined, _typeId = undefined;
    //形参将请求页码page传入，此处将形参变量承接
    _currentPage = +$('.merge_throttle').attr("data-page") + 1;//此处注意
    _lcid = $(".moldKind_switch_active").data("lcid");
    _brandId = $(".moldBrand_switch_active").data("bcid");
    _typeId = $(".moldType_active").data("typeid");

    var _pull_data = {
        pageNum: _currentPage,//当前页
        pageSize: _pageSize,//容积页数
        // lcid: _lcid,//分类id
        // brandId: _brandId,//品牌ID
        // type: _type,//完成品，定制品
    };
    debugger;
    if (_lcid != 'lcidAll' && _lcid != undefined) {
        _pull_data.lcids = _lcid;
    }
    ;
    if (_brandId != 'bcidAll' && _lcid != undefined) {
        _pull_data.brandId = _brandId;
    }
    ;
    if (_typeId != 'typeidAll' && _typeId != undefined) {
        _pull_data.type = _typeId;
    }
    // 请求数据
    debugger;
    $.ajax({
        type: 'post',
        url: dingjiafenxiao_pageUrl,
        data: _pull_data,
        beforeSend: function (request) {
            // 加载状态
            $('.merge_throttle').text('正在加载...').addClass('loading');
            request.setRequestHeader("Authorization", TOKEN_getIem())
        },
        success: function (info) {
            // 缓存页码
            // console.log(typeof (info.data.pageNum));
            // var throttle_con = info.data.pageNum + "";
            $('.merge_throttle').attr('data-page', info.data.pageNum);
            //缓存ismore状态
            _isMore = info.data.isMore;
            fillTableData(info);
        },
        complete: function () {
            if (_isMore) {
                $('.merge_throttle').text('往下滚动加载更多').removeClass('loading');
            } else {
                $('.merge_throttle').text('没有更多数据').addClass('loading');
            }
        }
    });
}
