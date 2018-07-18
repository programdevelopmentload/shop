//分页地址变量
var localUrl = getBaseUrl('w');
//型号管理分页地址
var mode_pageUrl = localUrl + '/goods/spu/showAll';
// var mode_pageUrl = "./shuxingguanli.json";
//顶部后台叶子所有分类地址【只有型号管理的顶部才走这个接口，采购管理等先不管】
var backLeaf_AllUrl = localUrl + '/goods/spu/showSpuClass';
//顶部后台叶子所有分类地址
// var backLeaf_AllUrl = localUrl + '/goods/GoodsClassification/showAllLeafClass';
//顶部所有品牌的地址【只有型号管理的顶部才走这个接口，采购管理等先不管】
var brand_AllUrl = localUrl + '/goods/spu/showSpuBrand';
//顶部所有品牌的地址
// var brand_AllUrl = localUrl + '/goods/brand/showBrandLeafClass';

var renameFlag = false;
var _nowPage = 1;
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    backLeaf_AllFun(backLeaf_AllUrl);//后台叶子筛选列表
    brand_AllFun(brand_AllUrl);//品牌筛选列表渲染
    // goods_ModelFun();
    // judgeSwitch_ishave();//
    topArea_active();//
    searchPage();//
    //品牌激活事件
    $('.moldBrand_switch').on('click', 'span', function () {

        var _index = $(this).index();
        $(this).addClass("moldBrand_switch_active").siblings().removeClass("moldBrand_switch_active");
        $("#self_table tbody").html("");
        searchPage();//此处传参数1
    });
    //分类激活事件
    $('.moldKind_switch').on('click', 'span', function () {
        var _index = $(this).index();
        $(this).addClass("moldKind_switch_active").siblings().removeClass("moldKind_switch_active");
        $("#self_table tbody").html("");
        searchPage();//此处传参数1
    });
    $('.pageSize_switch').on('change', function () {
        searchPage();
    });

});

/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */

var pagination = new Pagination(mode_pageUrl, "page", function (data) {
    fillTableData(data)
});

function searchPage(page) {//首次两参进入
    pagination.search(getParams(), page);
}

/** 得到搜索条件的json对象 */
function getParams() {
    _pageSize = $('.pageSize_switch').val();
    _lcid = $(".moldKind_switch_active").data("lcid");
    _brandId = $(".moldBrand_switch_active").data("bcid");
    
    var params = {
        'pageSize': _pageSize//容积页码数
        // 'lcid': _lcid,//分类id
        // 'brandId': _brandId,//品牌id
        // 'type': _type//完成品，定制品
        // 'pageNum': _pageNum//当前页
    };
    
    if (_lcid != 'lcidAll' && _lcid != undefined) {
        params.leafClassId = _lcid;
    };
    if (_brandId != 'bcidAll' && _lcid != undefined) {
        params.brandId = _brandId;
    };
    return params;
    debugger;
};

/** table数据 */
function fillTableData(data) {
    
    if (data.length == 0) {   //没有资源时
        $(".moldMerge").hide();
        $("#pic_no").show();
        $("#table_data").hide();
        $(".leftBottom").hide();
    } else {
        
        $(".moldMerge").show();
        $("#pic_no").hide();
        $("#table_data").show();
        $(".leftBottom").show();
        var tr = "tr";
        var content = $("#table_data tbody");
        var content1 = $(".sky");
        content.html("");
        for (var i = 0; i < data.length; i++) {
            content.append(
                // '<a>跳转到'+data[i].param+'这里</a>'
                '<tr data-id="' + '">' +
                '<td>' + data[i].model + '</td>' +       //属性名称
                '<td>' + data[i].leafClassName + '</td>' +       //属性类型
                '<td>' + data[i].brandName + '</td>' +       //是否必填
                '<td>' + timeDraw(data[i].createTime) + '</td>' +       //开关状态汉字渲染
                '</tr>'
            );
        }
        ;
    }
};

function timeDraw(param) {
    return getNowFormatDate(param);
}


function searchNowPage() {//首次两参进入
    var a;
    a = pagination.returnParams();
    _nowPage = a.currentPageNo;
};
