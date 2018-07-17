
// // 分页管理
$(function () {
    searchPage();
    $('.pageSize_switch').on('change', function () {
        searchPage();
    });
});
// var userId = userId_getIem();
// console.log(userId)
/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */

// 分页地址
var localhost = 'http://172.16.44.85:8007';
//var localHttp = 'http://172.16.40.153:8007';
var verify_log = localhost +'/goods/draft/operator/draftListGroup';
//点击删除
//http://172.16.34.227:8007/goods/draft/operator/draftDelete
var draftUrl = localhost +'/goods/draft/operator/draftDelete';
var pagination = new Pagination(verify_log, "page", function (data) {
    fillTableData(data)
});
var _nowPage = 1

function searchPage(page) {//首次两参进入
    pagination.search(getParams(), page);
}

function searchNowPage() {//首次两参进入
    var a;
    a = pagination.returnParams();
    _nowPage = a.currentPageNo;
    debugger;
};

/** 得到搜索条件的json对象 */
function getParams() { 
    var  _pageSize = $('.pageSize_switch').val();
    var goodsName = $('.goodsName').val();
    if (typeof(goodsName) == "number" ) {
        var params = {
            'pageSize':_pageSize,
            'number':goodsName,
            'userId':'12321312312312131'
        }
    }else{
        var params = {
            'pageSize':_pageSize,
            'keyWord':goodsName,
            'userId':'12321312312312131'
        }
    }
    
    return params;
};

/** table数据 */
function fillTableData(data){
    //console.log(data)
    //var data =data.data.items;
    console.log(data)
    if (data.length=="undefind") {
        $("#pic_no").show();
        $("#table_data").hide();
        $(".leftBottom").hide();
        return false;
     }else{
        $("#pic_no").hide();
        $("#table_data").show();
        $(".leftBottom").show();
    var tr = "tr";
    var content = $("#table_data tbody");
    content.html("");
    var doc = '';
    for (var i = 0; i < data.length; i++) {
        doc+='<tr data-id="'+data[i].draftNumber+'" class="trTrue"><td colspan="4">'+data[i].brandName+'</td></tr>';
         var goodsDrafts = data[i].goodsDrafts;
         doc+='<tr >'
         doc+='<td>'
         doc+='<div class="standa_borderRight">'
         for(var z= 0;z<goodsDrafts.length;z++){
            doc+='<div class="standard_spc">'
            var attributes = goodsDrafts[z].attributes;
            doc+='<p class="standard_left"><img src="'+goodsDrafts[z].pics[0].pic+'"><p>'
            doc+='<p class="standard_right">'
            doc+='<span>'+goodsDrafts[z].model+'</span>'
            for(var x= 0;x<attributes.length;x++){
                doc+='<span>'+attributes[x].value+'</span>'
            }
            doc+='</p>'
            doc+='</div>'
         }
         doc+='</div>'
         doc+='</td>'
         doc+='<td>'+getNowFormatDate(data[i].createTime)+'</td>'
         doc+='<td>草稿</td>'
         doc+='<td><a href="./draft_editor.html?draftNumber='+data[i].draftNumber+'&leafClassId='+data[i].leafClassId+'">编辑</a>  <a href="javascript:;" onclick="deleteTr(this)" data-id="'+data[i].draftNumber+'" class="trTwo">删除</a></td>'

    }
    content.append(doc);
    } 
}

//点击删除
function deleteTr(obj){  
    var  draftNumber = $(obj).attr('data-id');
    console.log(draftNumber)
    $.ajax({
        type:"post",
        url:draftUrl,
        dataType:"json",
        data:{draftNumber:draftNumber},
        success:function(data){
            console.log(data);
            $(obj).parents('tr').prev().remove();
            $(obj).parents('tr').remove();
            alert('数据删除成功！')
        },
        error:function(){
            console.log('未知错误')
        }
    })
    searchPage(_nowPage);
    searchNowPage();

}
$('#goodsbtn').click(function(){
    searchPage(_nowPage);
    searchNowPage();
})