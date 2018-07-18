//获取shopOd
function GetRequest() {   
 var url = location.search; //获取url中"?"符后的字串   
 var theRequest = new Object();   
    if (url.indexOf("?") != -1) {   
      var str = url.substr(1);   
      strs = str.split("&");   
      for(var i = 0; i < strs.length; i ++) {   
         theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);   
      }   
   }   
return theRequest;   
}

var localhost = 'http://172.16.40.153:8009';
var store_info_detail_url = localhost + '/shop/findShopByShopId'

//解锁店铺路径
var closeShop = localhost+'/shop/startShop'
//锁定店铺
var startShop_url = localhost+'/shop/closeShop'

function store_info_detail() {
	var Request = new Object();
        Request = GetRequest();
    var shopId = Request['shopId'];
   	$.ajax({
		type:"post",
	    url: store_info_detail_url,
	    dataType: "json",
	    data:{ shopId:shopId},
	    success: function (data) {
	        //console.log(data);
	        if (data.success==true) {
	        	var html = template("staff_managements", data);
            	$('.staff_management').append(html);
	        }else{
	        	alert("数据获取失败！")
	        }
	        
	        
	    },
	    error: function () {
	    }
	})
}
store_info_detail()



function startShop(){
	var Request = new Object();
        Request = GetRequest();
    var shopId = Request['shopId'];
    $.ajax({
		type:"post",
	    url: closeShop,
	    dataType: "json",
	    data:{ shopId:shopId},
	    success: function (data) {
	    	//console.log(data.message);
	    	alert(data.message);
	    	window.location.reload()	        
	    },
	    error: function () {
	    }
	})
}

function stopShop(){
	var Request = new Object();
        Request = GetRequest();
    var shopId = Request['shopId'];
    $.ajax({
		type:"post",
	    url: startShop_url,
	    dataType: "json",
	    data:{ shopId:shopId},
	    success: function (data) {
	    	//console.log(data.message);
	    	alert(data.message);
	    	window.location.reload()	        
	    },
	    error: function () {
	    }
	})
}
