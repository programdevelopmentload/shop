//分页地址变量[新品定价页面]
var localUrl = 'http://172.16.34.227:8007';//陶帅江
var localUrl = getBaseUrl('t');//陶帅江
// var zmy_localUrl = 'http://172.16.40.153:8009';//名扬
//定价地址
var dingjiafenxiao_pageUrl = localUrl + 'goods/draft/operator/pricingList';
var dingjiafenxiao_pageUrl = '../../html/purchase_manage/fenxiao_liebiao.json';
// var shop_listUrl = 'right_shop.json';
//底部分配到店功能
var toShop_Url = zmy_localUrl + '/shop/distributeGoodsToShop';
var _ct_id = $.getUrlParam("_id");//
var _area = "";
$.sidebarMenu($('.sidebar-menu'));
var storage_data;
var checkRight_dom;
var spu_page_arr = [];
var check_arrStr = [];
var shop_arrStr = [];
var _checkedNum = 0;
var _shop_Num = 0;
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
    // 首屏加载【首次加载拉取10条】
    // getData(1);
    //右侧店铺数据渲染
    pullShopData();

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
            $(this).addClass("moldType_active").siblings().removeClass("moldType_active");
            getData();//此处传参数1
        });
    }
    ;

    //点击分配到点
    $('.go_merge_btn').off('click').on('click', function () {
        if (_checkedNum < 1 || _shop_Num < 1) {
            var html = template('ajax_alert', {});
            $.popwin(html, {
                title: '',
                fixed: true,
                drag: false, //是否可拖拽
            });
            $("#popwin_Out").addClass("attr_manag_add");
            $.popwin.setPosition(410, 460);
            $(".attr_manag_add .mask_tip").html("SKU和店铺都要至少选择1条");
            return false;
        } else {
            var bubble_list = "";
            checkRight_dom.each(function () {
                bubble_list += "<div class='dis_bubble_listItems'><span>"+$(this).data('area')+"</span>" +
                    "<span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>" +
                    "<span>" + $(this).data('name')+"</span></div>";
            });
            var html = template('distribution_bubble', {});
            $.popwin(html, {
                title: '分配到店',
                fixed: true,
                drag: false, //是否可拖拽
            });
            $("#popwin_Out").addClass("distribution_store");
            $.popwin.setPosition(410, 460);
            $(".dis_bubble_num").html(_checkedNum);
            $(".dis_bubble_listItems").html(bubble_list);
            $('body').off('click').on('click','.cancle_xsBtn',function(){
                $("#popwin_Blank").remove();
                $("#popwin_Out").remove();
            });
            $(document).off('click').on('click','.sure_xsBtn',function(){
                jump_btn_link();
                //此时开始ajax交互。
            });
        }
    });
    //监听左侧表格选择了几条
    $('body').on('change', 'input[name="testManage"]', function () {
        var check_dom = $("input[name='testManage']:checked");
        check_arrStr = [];
        check_dom.each(function () {
            check_arrStr.push($(this).data("spuid"));

        });
        _checkedNum = check_dom.length;
        check_arrStr = check_arrStr.toString();
        console.log(check_arrStr);

        $('.merge_num span').text(_checkedNum);
    });
    //监听右侧表格选择了几条
    $(document).on('change', 'input[name="testManage_right"]', function () {
        checkRight_dom = $("input[name='testManage_right']:checked");
        shop_arrStr = [];
        checkRight_dom.each(function () {
            shop_arrStr.push($(this).data("shopid"));

        });
        debugger;
        _shop_Num = checkRight_dom.length;
        shop_arrStr = shop_arrStr.toString();
        console.log(shop_arrStr);

        $('.jump_shop_num span').text(_shop_Num);
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
        if (offset <= 150 && !$('.merge_throttle').hasClass('loading') && _isMore) {
            // 获取下一页页码
            var page = $('.merge_throttle').attr('data-page');
            // 发起请求获取数据
            getData();//此处将页码变量page传进去
        }
    });
});


/** table数据 */
function fillTableData(data) {
    var data = data.data.items;
    var tr = '';
    var content = $("#self_table tbody");
    content.html('');
    var doc = '';
    for (var i = 0; i < data.length; i++) {
        doc += '<tr class="order_num_tr">' + '<td colspan="11" style="text-align:left;line-height:35px">' + data[i].brandName + '&nbsp;&nbsp;' +data[i].leafClassName + '&nbsp;&nbsp;'+data[i].model + '</td>' + '</tr>';
        doc += '<tr>';
        //开始拼接左侧区域
        doc += '<td class="left_box" colspan="7">';
        var purchaseOrderGoods = data[i].goodsSkus;
        for (var j = 0; j < purchaseOrderGoods.length; j++) {
            doc += '<div class="clearfix left_items">';

            doc += '<div class="fl td_son1 clearfix">';

            doc += '<div class="td_son1_son1 fl clearfix"><div class="td_son1_left fl clearfix"><img src="' + purchaseOrderGoods[j].pics[0].pic + '"/></div><div class="td_son1_right fl"><dl>'+ purchaseOrderGoods[j].goodsType +'</dl><dl>' + purchaseOrderGoods[j].attribute + '</dl></div></div>';

            doc += '<div class="td_son1_son2 fl">' + purchaseOrderGoods[j].goodsCode + '</div><div class="td_son1_son3 fl">' + purchaseOrderGoods[j].type + '</div>';
            doc += '<div class="td_son1_son4 fl">' + purchaseOrderGoods[j].goodsCode + '</div>';
            doc += '</div>';

            doc += '<div class="fl td_son2">';
            var pps = purchaseOrderGoods[j].publishers;
            for (var z = 0; z < pps.length; z++) {
                doc += '<span class="clearfix"><i class="td_son2_son1 fl">' + pps[z].supplier + '</i><i class="td_son2_son2 fl">X' + pps[z].count + '</i><i class="td_son2_son3 fl"><input class="supplier_check" name="supplier_check" type="checkbox"></i></span>';
            };
            doc += '</div>';

            doc += '</div>';
        }
        doc += '</td>';
        doc += '</tr>';
    }
    content.append(doc);
};

function draw_updateTime(_updateTime) {
    return getNowFormatDate(_updateTime);
};

//滚轮拉取数据函数
function getData() {
    //形参将请求页码page传入，此处将形参变量承接

    _currentPage = +$('.merge_throttle').data("page") + 1;//此处注意
    _lcid = $(".moldKind_switch_active ").data("lcid");
    _brandId = $(".moldBrand_switch_active  ").data("bcid");
    var _pull_data = {
        pageNum: _currentPage,//当前页
        pageSize: _pageSize,//容积页数
        // lcid: _lcid,//分类id
        // brandId: _brandId,//品牌ID
        // type: _type,//完成品，定制品
        area: 3
    };

    // 请求数据
    $.ajax({
        type: 'post',
        url: dingjiafenxiao_pageUrl,
        // data: _pull_data,
        beforeSend: function () {

            // 加载状态
            $('.merge_throttle').text('正在加载...').addClass('loading');
        },
        success: function (info) {
            debugger;
            // 缓存页码
            $('.merge_throttle').attr('data-page', info.data.currentPage);
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

//右侧店铺拉取数据函数
function pullShopData() {
    var _pull_shopData = {
        // shopCity: _ct_id
        shopCity: '北京市'
    };
    // 请求数据
    $.ajax({
        type: 'post',
        url: shop_listUrl,
        data: _pull_shopData,
        success: function (info) {
            var resInfo = info.data;

            var fatherBox = $(".shop_table ul");
            var resStr = "";
            $(resInfo).each(function (i, v) {
                resStr += ""
                resStr += "<li><input  data-area='" + v.shopArea + "' data-name='" + v.shopName + "' type='checkbox' name='testManage_right' class='item-check_right' data-shopid='" + v.shopId + "'>"
                resStr += "<span class='shop_area'>" + v.shopArea + "</span><span>&nbsp;-&nbsp;</span><span class='shop_name'>" + v.shopName + "</span></li>"
            })
            fatherBox.html(resStr);
        }
    });
};

//底部分配到店铺交互函数
function jump_btn_link() {
    debugger;
    var _jump_btnData = {
        shopIds: check_arrStr,
        goodsIds: shop_arrStr
    };
    // 请求数据
    $.ajax({
        type: 'post',
        url: toShop_Url,
        data: _jump_btnData,
        success: function (info) {
            if (info.success == true) {
                $("#popwin_Blank").remove();
                $("#popwin_Out").remove();
                debugger;
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410, 460);
                $(".attr_manag_add .mask_tip").html("分配到店成功");
            }
        }
    });
}