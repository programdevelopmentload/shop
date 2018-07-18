//分页地址变量
var localUrl = 'http://172.16.40.215:8008';
//spu分页地址
var spu_pageUrl = localUrl + '/goods/sku/listGroupSplit';
var _id = $.getUrlParam("_id");//
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
    getData();

});

//拉取数据函数
function getData() {
    var _pull_data = {
        currentPage: _currentPage,//当前页
        pageSize: _pageSize,//容积页数
        lcid: _lcid,//分类id
        brandId: _brandId,//品牌ID
        type: _type,//完成品，定制品
        sorts: _sorts,//
        ids: _ids,//
        state: _state
    };
    // 请求数据
    $.ajax({
        type: 'post',
        // url: spu_pageUrl,
        url: '../../html/purchase_manage/spu_fenye.json',
        // data: _pull_data,
        beforeSend: function () {
            // 加载状态
            $('.merge_throttle').text('正在加载...').addClass('loading');
        },
        success: function (info) {
            // 缓存页码
            $('.merge_throttle').attr('data-page', info.data.currentPage);
            //总条数注入
            debugger;
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
        doc += "<td>" + resData[i].brandName + resData[i].leafClassName + resData[i].model + "</td>>";
        doc += "<td>" + resData[i].brandName + resData[i].leafClassName + resData[i].model + "</td>>";
        doc += "<td><span>更改</span><span>预览</span><span>下载</span></td>>";
        doc += "</tr>";
    }
    content.append(doc);
};
function draw_updateTime(_updateTime) {
    return getNowFormatDate(_updateTime);
};








