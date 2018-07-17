//分页地址变量
// var localUrl = 'http://172.16.10.117:8007';//陶帅江变量
var localUrl = getBaseUrl('t');//陶帅江变量
debugger;
//spu分页地址
// var xuanhuo_pageUrl = localUrl + '/goods/sku/selectionList';
var xuanhuo_pageUrl = '../../html/purchase_manage/xuanhuo_list.json';
// var _areaId = $.getUrlParam("_id");//
$.sidebarMenu($('.sidebar-menu'));
var storage_data;
var spu_page_arr = [];
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
    // 首屏加载【首次加载拉取10条】
    // getData(1);
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
        });
    };

    $(".fuck").on("click", function () {
        console.log(_brandId, _lcid);
    });
    //点击了确认并提交后的效果
    $('.go_merge_btn').off('click').on('click', function () {
        if (_checkedNum < 1) {
            var html = template('ajax_alert', {});
            $.popwin(html, {
                title: '',
                fixed: true,
                drag: false, //是否可拖拽
            });
            $("#popwin_Out").addClass("attr_manag_add");
            $.popwin.setPosition(410, 460);
            $(".attr_manag_add .mask_tip").html("请至少选择1条");
            return false;
        } else {
            // $("input[name='testManage']:checked").parent().parent().siblings().color("red");
            // $("input[name='testManage']").not("input:checked").parent().parent().hide();
            // $("input[name='testManage']:checked").hide();
            // $("#self_table thead tr th:first-child").hide();
            // $("#self_table tbody tr td:first-child").hide();
            // $(".two_common").text("")
            console.log(check_arr);
            console.log(storage_data);
            setItem();
            // window.open("./supplyProduct_subfmit.html?_id=" + _id);
            window.open("./supplyProduct_submit.html?_id=");
        }
    })
    //监听主分页列表选择了几条
    $('body').on('change', 'input[name="testManage"]', function () {
        var check_dom = $("input[name='testManage']:checked");
        check_arr = [];
        check_dom.each(function () {
            check_arr.push($(this).data("spuid"));

        });
        check_arr = JSON.stringify(check_arr);
        _checkedNum = check_dom.length;
        $('.merge_num span').text(_checkedNum);
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

//拉取数据函数
function getData() {
    debugger;
    //形参将请求页码page传入，此处将形参变量承接

    _currentPage = +$('.merge_throttle').data("page") + 1;//此处注意
    _lcid = $(".moldKind_switch_active ").data("lcid");
    _brandId = $(".moldBrand_switch_active  ").data("bcid");
    var _pull_data = {
        // pageNum: _currentPage,//当前页
        pageSize: _pageSize,//容积页数
        // lcid: _lcid,//分类id
        // brandId: _brandId,//品牌ID
        // type: _type,//完成品，定制品
        // sorts: _sorts,//
        // ids: _ids,//
        // state: _state
        // area:_areaId
        area:1
    };
    // 请求数据
    $.ajax({
        type: 'post',
        url: xuanhuo_pageUrl,
        // data: _pull_data,
        dataType : "json",
        beforeSend: function () {
            // 加载状态
            $('.merge_throttle').text('正在加载...').addClass('loading');
        },
        success: function (info) {
            debugger;
            // 缓存页码
            $('.merge_throttle').attr('data-page', info.data.currentPage);
            //总条数注入
            $('.total_num').text(info.data.totalCount);
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

/** table数据 */
function fillTableData(data) {
    var resData = data.data.items;
    spu_page_arr = spu_page_arr.concat(resData)
    storage_data = JSON.stringify(spu_page_arr);
    debugger;
    console.log(typeof (storage_data));

    var tr = "";
    var content = $("#self_table tbody");
    content.html("");
    var doc = "";
    for (var i = 0; i < resData.length; i++) {
        doc += "<tr>";
        doc += "<td><input type='checkbox' name='testManage' class='item-check' data-spuid='" + resData[i].spuId + "'></td>";
        doc += "<td>" + resData[i].brandName + resData[i].leafClassName + resData[i].model + "</td>>";
        debugger;
        doc += "<td>" + resData[i].service.goodsType + "</td>";
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
function draw_updateTime(_updateTime) {
     return getNowFormatDate(_updateTime);
};








