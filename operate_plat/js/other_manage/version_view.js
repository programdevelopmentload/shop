
$(function () {
     searchPage();
});
var _nowPage = 1;

/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */
// 分页 http://172.16.38.142:8010/upgradeserver/queryPaging
var localhost = 'http://172.16.38.142:8010'; //郭斌磊
var recordUrl= localhost + '/upgradeserver/queryPaging';
//var UpgradeList = localhost +'/messageserver/findByUpgradeList';

var pagination = new Pagination(recordUrl, "page", function (data) {
    fillTableData(data)
});

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
    var  _pageSize = +$('.pageSize_switch').val();
    var params = {
        'pageSize':_pageSize,
             
        };
    return params;
};

/** table数据 */
function fillTableData(data){
    console.log(data);
    if (data==null) {
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
            doc+='<tr>'
            doc+='<td>'+data[i].version +'</td>'
            doc+='<td>'+isappType(data[i].appType)+'</td>'
            // doc+='<td>'+regRef(data[i].regRef)+'</td>'
            doc+='<td>'+data[i].createTime+'</td>'
            doc+='<td >'+versionState(data[i].versionState)+'</td>' //状态
            doc+='<td data-id="'+data[i].id +'" ><a href="./versionLook.html?id='+data[i].id+'&version='+data[i].version+'">查看</a></td></tr>'
            // if (data[i].forcee ==0) {
            //     doc+='<td data-id="'+data[i].id +'"  data-version="'+data[i].version+'" data-appType="'+data[i].appType+'"><a href="./versionLook.html?id='+data[i].id+'">查看</a> <a href="javascript:;" onclick="updateVersion(this)">强制更新</a></td></tr>'
            // }else{
            //      doc+='<td data-id="'+data[i].id +'" ><a href="./versionLook.html?id='+data[i].id+'">查看</a></td></tr>'
            // }
           
       
    }
    content.append(doc)
    }
}

function isappType(params){
    var str = '';
    if(params == 1){
        str +='客户端(ios)'
    }else if(params == 2){
        str +='客户端(Android)'
    }else if(params == 3){
        str +='导购端(PAD)'
    }else if (params == 4) {
        str +='服务端(ios)'
    }else if (params == 5) {
        str +='服务端(Android)'
    }
    return str;
}

function versionState(params){
    var str = '';
    if(params == 0){
        str +='正常'
    }else if(params == 1){
        str +='已过期'
    }
    return str;
}

$("#searchBtn").click(function(){
    searchNowPage();
    searchPage(_nowPage);
})

// function updateVersion(obj){
//    var $this = $(obj);
//    var id = $this.parent().attr('data-id');
//    var  version = $this.parent().attr('data-version');
//    var  appType = $this.parent().attr('data-appType');
//    console.log(id+ version+ appType)
//    $.ajax({
//      url:UpgradeList,
//      data:{id:id,version:version,appType:appType},
//      type:'post',
//      dataType:'json',
//      success:function(data){
//          console.log(data);
//          alert(data.success);
//          window.location.reload();
//      }
//    })
// }


