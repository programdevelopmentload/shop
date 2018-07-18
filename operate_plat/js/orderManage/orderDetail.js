

// 渲染页面
var localHtttp = 'http://172.16.39.168:8005';
//分页
 var orderService = localHtttp + "/orderserviceinfo/select";

var updatebyUrl= localHtttp+'/orderserviceinfo/updatebyid'
//点击查询商品接口
var goods =localHtttp+'/orderserviceinfo/selectbygoodsname';


$.sidebarMenu($('.sidebar-menu'));
$(function () {
    searchPage();
});

/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */


var _nowPage = 1;
var pagination = new Pagination(orderService, "page", function (data) {
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
   
    var params = {
        'pageSize':2,
             
        };
    return params;
};

// /** table数据 */
function fillTableData(data) {
	console.log(data);
   var tr = "tr";
    var content = $("#table_data tbody");
    content.html("");
    var doc = '';
    for (var i = 0; i < data.length; i++) {
    	var goodsInfo = data[i].goodsInfo
    		doc+='<tr><td colspan="7">'+data[i].code+'</td></tr>'
            doc+='<tr data-id="'+data[i].id+'" class="byId">'        
            doc+='<td class="td_right">'+data[i].shopName+'</td>';
            doc+='<td colspan="5">'
            for (var z = 0; z < goodsInfo.length; z++) {
            	doc+='<div class="spc_div">'
            	doc+='<p>'
            	// doc+='<img src="goodsInfo[z].picurl">'
            	doc+='<span>'+goodsInfo[z].goodsInfo+'</span>'
            	doc+='</p>'
            	doc+='<p>'
            	doc+='<span>'+goodsInfo[z].goods_service+'</span>'
            	doc+='</p>'
            	doc+='<p>'
            	doc+='<span>'+goodsInfo[z].skuId+'</span>'
            	doc+='</p>'
            	doc+='<p>'
            	doc+='<a download>'+goodsInfo[z].xlsFile+'</a>'
            	doc+='</p>'
            	doc+='<p><img src="'+goodsInfo[z].picFiles+'"></p>'
            	doc+='</div>'
            }
            doc+='</td>'
            doc+='<td data-id="'+data[i].id+'" class="spc_true" > 已确认</td>';
            doc+='</tr>'
       
    }
    content.append(doc)
};


var url_page_input;//输入url参数。
var pagination;
var searchPage;
var getParams;
var fillTableData;

function pageRun(pageUrl){
	var pageUrl = pageUrl || orderService;
	if (pageUrl ==orderService ) {
		var pagination = new Pagination(orderService, "page", function (data) {
    		fillTableData(data)
		});
		searchPage = function (page) {//首次两参进入
		    pagination.search(getParams(), page);
		}

		function searchNowPage() {//首次两参进入
	    	var a;
		    a = pagination.returnParams();
		    _nowPage = a.currentPageNo;
		    debugger;
		};

		/** 得到搜索条件的json对象 */
		 getParams = function() {  
		   var order_Num= $('.orderVal').val();
		    var params = {
		        'pageSize':2,
		        'code':order_Num
		             
		        };
		    return params;
		};
      /** table数据 */
	 	fillTableData =function fillTableData(data) {
		console.log(data);
		   var tr = "tr";
		    var content = $("#table_data tbody");
		    content.html("");
		    var doc = '';
		    for (var i = 0; i < data.length; i++) {
		    	var goodsInfo = data[i].goodsInfo
		    		doc+='<tr><td colspan="6">'+data[i].shopName+'</td></tr>'
		            doc+='<tr data-id="'+data[i].id+'" class="byId">'        
		            doc+='<td class="td_right">'+data[i].shopName+'</td>';
		            doc+='<td colspan="5">'
		            for (var z = 0; z < goodsInfo.length; z++) {
		            	doc+='<div class="spc_div">'
		            	doc+='<p>'
		            	// doc+='<img src="goodsInfo[z].picurl">'
		            	doc+='<span>'+goodsInfo[z].goodsInfo+'</span>'
		            	doc+='</p>'
		            	doc+='<p>'
		            	doc+='<span>'+goodsInfo[z].goods_service+'</span>'
		            	doc+='</p>'
		            	doc+='<p>'
		            	doc+='<span>'+goodsInfo[z].skuId+'</span>'
		            	doc+='</p>'
		            	doc+='<p>'
		            	doc+='<a download>'+goodsInfo[z].xlsFile+'</a>'
		            	doc+='</p>'
		            	doc+='<p class="img_up" onclick="img_pic(this)" data-id="'+goodsInfo[z].id+'">上传图纸</p>'
		            	doc+='</div>'
		            }
		            doc+='</td>'
		            doc+='<tr><td colspan="6" data-id="'+data[i].id+'" class="spc_btn" ><button type="button" class="btn btn-primary"" id="btn_sumit" onclick="submitClick(this)" >提交</button></td></tr>';
		            doc+='</tr>'
		       
		}
		    content.append(doc)
	};

	}else{
		var pagination = new Pagination(goods, "page", function (data) {
    		fillTableData(data)
		});
		searchPage = function (page) {//首次两参进入
		    pagination.search(getParams(), page);
		}

		function searchNowPage() {//首次两参进入
	    	var a;
		    a = pagination.returnParams();
		    _nowPage = a.currentPageNo;
		    debugger;
		};

		/** 得到搜索条件的json对象 */
		 getParams = function() {  
		    var goodsVal= $('.goodsVal').val();
		    var params = {
		        'pageSize':2,
		        'name':goodsVal
		             
		        };
		    return params;
		};
      /** table数据 */
	 	fillTableData =function fillTableData(data) {
		   var tr = "tr";
		    var content = $("#table_data tbody");
		    content.html("");
		    var doc = '';
		    for (var i = 0; i < data.length; i++) {
		    	var goodsInfo = data[i].goodsInfo
		    		doc+='<tr><td colspan="6">'+data[i].shopName+'</td></tr>'
		            doc+='<tr data-id="'+data[i].id+'" class="byId">'        
		            doc+='<td class="td_right">'+data[i].shopName+'</td>';
		            doc+='<td colspan="5">'
		            for (var z = 0; z < goodsInfo.length; z++) {
		            	doc+='<div class="spc_div">'
		            	doc+='<p>'
		            	// doc+='<img src="goodsInfo[z].picurl">'
		            	doc+='<span>'+goodsInfo[z].goodsInfo+'</span>'
		            	doc+='</p>'
		            	doc+='<p>'
		            	doc+='<span>'+goodsInfo[z].goods_service+'</span>'
		            	doc+='</p>'
		            	doc+='<p>'
		            	doc+='<span>'+goodsInfo[z].skuId+'</span>'
		            	doc+='</p>'
		            	doc+='<p>'
		            	doc+='<a download>'+goodsInfo[z].xlsFile+'</a>'
		            	doc+='</p>'
		            	doc+='<p class="img_up" onclick="img_pic(this)" data-id="'+goodsInfo[z].id+'">上传图纸</p>'
		            	doc+='</div>'
		            }
		            doc+='</td>'
		            doc+='<tr><td colspan="6" data-id="'+data[i].id+'" class="spc_btn" ><button type="button" class="btn btn-primary"" id="btn_sumit" onclick="submitClick(this)" >提交</button></td></tr>';
		            doc+='</tr>'
		       
		}
		    content.append(doc)
	};
	}
}


// 订单查询
$('.keyBtn').click(function(){
	// 获取订单编号和商品名称
	var order_Num= $('.orderVal').val();
	var googs_Num = $('.goodsVal').val();
	if (order_Num !='') {
		url_page_input = orderService;
    	pageRun(url_page_input)//首参传入地址,二参传入级别
        searchPage();

	}else{
         debugger;
		url_page_input = goods;
    	pageRun(goods)//首参传入地址,二参传入级别
        searchPage();
	}
})





