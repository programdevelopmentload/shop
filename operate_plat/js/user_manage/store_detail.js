//点击选中 所属区域和审核状体啊

 	$(".aui-screen-list-item a ").on("click", function() {
	    var text = $(this).text();  //获得所属区域


	    $(this).addClass("selected").siblings().removeClass("selected");
	    searchPage();

	    console.log(text)
	    $(this).addClass("selected").siblings().removeClass("selected"); 
	    searchPage();  

	});



var renameFlag = false;
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    searchPage();
});
var _nowPage = 1
/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */

//分页路径 
var localhost = 'http://172.16.40.153:8009';
var  store_detail =localhost + '/shop/findPageShop'

//点击锁定路径
var closeShop_url = localhost+'/shop/closeShop'

//点击解锁路径 
var startShop_url = localhost + '/shop/startShop'

var pagination = new Pagination(store_detail, "page", function (data) {
    fillTableData(data)
});

function searchPage(page) {//首次两参进入
    pagination.search(getParams(), page);
}
function searchNowPage() {//首次两参进入
    var a;
    a = pagination.returnParams();
    _nowPage = a.currentPageNo;
};


/** 得到搜索条件的json对象 */
function getParams() {
    var params = {
        'pageSize':5
             
    };
    return params;
};

/** table数据 */
function fillTableData(data){
    //console.log(data);
    var tr = "tr";
    var content = $("#table_data tbody");
    content.html("");
    var doc = '';
    for (var i = 0; i < data.length; i++) {
            doc+='<tr>'          
            doc+='<td>'+data[i].shopName+'</td>'
            doc+='<td>'+data[i].shopCity+'---'+data[i].shopArea+'</td>'
            doc+='<td>'+data[i].shopCreatetime+'</td>'
            doc+='<td>'+ctr_Switch(data[i].shopState)+'</td>'
            doc+='<td data-id="' + data[i].shopId + '">'+ '<a href="./store_info_detail.html?shopId=' +data[i].shopId + '&shopState='+ data[i].shopState+'" >查看</a> '+'<a href="javascript:void(0);" class="closeShop"  >'+shopState(data[i].shopState)+'</a> '+'</td>'
            doc+='</tr>'
       
    }
    content.html(doc)
}


/*判断审核状态*/
function ctr_Switch(params) {
    var str = "";
    if (params == 0) {//0是开启
        str += '已锁定';
    } else if (params == 1) {
        str += '正常经营';
    }
    return str;
}



//判断是否锁定或着解锁 
function shopState(params) {
    var str = "";
    if (params == 0) {//0是开启
        str += '解锁';
    } else if (params == 1) {
        str += '锁定';
    }
    return str;
}


//点击判断是否锁定
$("#table_data tbody").delegate(".closeShop","click",function(){
	var shopId = $(this).parent().attr("data-id");
	//console.log(shopId);
	var closeShop = $(this).text();
	console.log(closeShop)
	if (closeShop =="解锁") {
		var html = template('ajax_alert', {});
            $.popwin(html, {
                title: '解锁后店铺内的商品将恢复上架权利，并在平台内开始交易，是否确认该操作？',
                fixed: true,
                drag: false, //是否可拖拽
            });
            $("#popwin_Out").addClass("attr_manag_add");
            //判断锁定店铺或者交易
            $('.close_deal').click(function(){
                 var index= $(this).index();
                 $('.info_deal').eq(index).show().siblings('.info_deal').hide();
                 var state = $(this).attr('data-state');
            })
            $(".mask_ok").click(function(){
            	$.ajax({
				    type:"post",
				    url: startShop_url,
				    dataType: "json",
				    data:{shopId:shopId, state: state},
				    success: function (data) {
				        console.log(data);
				        if (data.success==true) {
				        	 alert(data.message);
				        	 $("#popwin_Blank").remove();
            				 $("#popwin_Out").remove();
            				 searchNowPage(_nowPage)
            				 searchPage()
				        	 
				        }else{
				        	alert("锁定失败！")
				        }
			    
				    },
				    error: function () {
                        console.log(12334)
				    }
				})
				    
            })
	}else{
			var html = template('ajax_alert', {});
            $.popwin(html, {
                title: '锁定后店铺商品将无法交易，是否确认操作？',
                fixed: true,
                drag: false, //是否可拖拽
            });
            $("#popwin_Out").addClass("attr_manag_add");

             $(".mask_ok").click(function(){
            	$.ajax({
				    type:"post",
				    url: closeShop_url,
				    dataType: "json",
				    data:{ shopId:shopId},
				    success: function (data) {
				        console.log(data);
				        if (data.success==true) {
				        	 alert(data.message);
				        	 $("#popwin_Blank").remove();
            				 $("#popwin_Out").remove();
            				  searchNowPage(_nowPage)
            				  searchPage()
				        }else{
				        	alert("锁定失败！")
				        }
			    
				    },
				    error: function () {
                        console.log(23354654)
				    }
				   
				})
				 
            })
	    }
})
	

function clickFalse(){
     $("#popwin_Blank").hide();
     $("#popwin_Out").hide();
}

