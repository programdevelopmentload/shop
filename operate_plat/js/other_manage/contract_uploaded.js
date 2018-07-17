//分页地址变量
var localUrl = 'http://172.16.40.134:8003';
//合同记录列表
var contract_listUrl = localUrl + '/seller/SelectContractTempletst';
var _id = $.getUrlParam("_id");//
$.sidebarMenu($('.sidebar-menu'));
var storage_data;
var spu_page_arr = [];
var check_arr = [];
var _checkedNum = 0;
var _keyword = "";
var _isMore = 1;
var _currentPage,
    _pageSize = 10,
    _type,
    _state;
$(function () {
    getData();

});

//拉取数据函数
function getData() {
    var _pull_data = {
        currentPage: _currentPage,//当前页
        pageSize: _pageSize,//容积页数
        keyword:_keyword
    };
    // 请求数据
    $.ajax({
        type: 'post',
        url: contract_listUrl,
        // data: _pull_data,
        success: function (info) {
            debugger;
            fillTableData(info);
        }
    });
}

/** table数据 */
function fillTableData(data) {
    var resData = data.data.items;
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








