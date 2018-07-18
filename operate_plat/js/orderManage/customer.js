

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
    		doc+='<tr><td colspan="6">'+data[i].code+'</td></tr>'
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
//点击图片上传成功
var  arr_url=[];
function img_pic(obj){
	$('.mask-drawings').show();
	var id = $(obj).attr('data-id');
	$('#mask_btn').click(function(){
		$("#mask_btn").off('click');
		$(this).attr('data-id',id);
		var html='';
        for (var i = 0; i < arr_url.length-1; i++) {
        	 html+='<img src='+arr_url[i]+' class="Files">' 
        }
        $(obj).append(html)
       var picFiles = arr_url.join(' ');
       console.log(picFiles);
	    var params = {
	    	id:id,
	    	picFiles:picFiles
	    }
	    $.ajax({
	    	headers:{
	    		'Accept':'application/json',
	    		'Content-Type':'application/json'
	    	},
		    url:"http://172.16.39.168:8005/orderserviceinfo/updateitembyid",
		    type:"post",
		    dataType:'json',
		    cache: false,
		    data:JSON.stringify(params),
		    success:function (res) {
		       alert(res.message);
		       $(".mask-drawings").hide();
		    },
		    error:function (err) {
		        console.log(err)
		    }
		});

	})

}


$('.tit_close').click(function(){
    $('.mask-drawings').hide();
})
$('#mask_false').click(function(){
	$('.mask-drawings').hide();
})

function upImg(img){
	//that = $(img);
	var files= $(img).get(0).files;
	console.log(files);
    var fd =new FormData();
    fd.append('uploadFile',img.files[0]);
    $.ajax({
    	headers:{
    		'Accept':'application/json',
    		'Content-Type':'application/json'
	    },
	    url:"http://172.16.41.71:8010//pic/upload",
	    type:"post",
	    processData: false,     // jQuery不要去处理发送的数据
	    contentType: false,    // jQuery不要去设置Content-Type请求头
	    dataType:"json",
	    cache: false,
	    data:fd,
	    success:function (res) {
	     var data_url = res.data;  //获取img 的路径
	     arr_url.push(data_url);
	    },
	    error:function (err) {
	        console.log(err)
	    }   
	});
}

//点击提交的事件
function submitClick(obj){
	var $this = $(obj);
	var id = $this.parent().attr('data-id');
	params={id:id};
	console.log(id);
	$.ajax({
		headers:{
    		'Accept':'application/json',
    		'Content-Type':'application/json'
	    },
		type:'post',
		dataType:'json',
		url:updatebyUrl,
		data:JSON.stringify(params),
		success:function(data){
			console.log(data);
		},
        error:function(){

        }
	})
     
}

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





