var renameFlag = false;


//分页地址变量
var localUrl = 'http://172.16.41.23:8007';
//确认并提交地址
var submitUrl = localUrl + '/goods/sku/integration';
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
$.sidebarMenu($('.sidebar-menu'));
var _supId,
    _type,
    _goodsDetails,
    _buyInstructions,
    _pics=[],//主图区域
    _ids=[],//SKU ID
    _attributes=[],//规格属性名
    _parts=[],//配件清单
    _packings=[];//包装清单
$(function () {
    _buyInstructions = $('.res_merge_deta_explain').val();
    _goodsDetails = $('.re_merge_deta_detail').attr('src');
    $(".res_merge_deta_img").each(function () {
        _pics.push($(this).attr("src"));
    });
    $(".res_merge_deta_packlist").each(function (i) {
        _packings[i] = {};
        _packings[i]['partsName'] = $(this).find('.merge_partsName').text();
    });
    debugger;
    console.log(_packings);


    var submit_data = {};
    //以下数据自己动态抓取
    submit_data.supId = _supId;//直接量
    submit_data.type = _type;//类型直接量
    submit_data.goodsDetails = _goodsDetails;//图片直接量
    submit_data.buyInstructions = _buyInstructions;//说明说直接量
    submit_data.pics = _pics;
    submit_data.ids = _ids;
    submit_data.attributes = _attributes;
    submit_data.parts = _parts;
    submit_data.packings = _packings;













    //测试前进回退
    // $('.moon').click(function () {
    //     window.location.href="http://localhost:63342/operate_plat/html/Category_manage/backstage_everyGrade_detail.html";
    //     // window.location.href='www.baidu.com';
    // })
});







