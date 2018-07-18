//获取id 和state

// $(function () {
//     nav_Common_fun("商家列表","商家详情");
// })
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


//var localHtttp = 'http://172.16.41.184:8003';
//var localhost = 'http://172.16.41.184:8002/user';
//var localhost='http://172.16.40.134:8002/user';
//var user_management= localhost + '/platForm/selUserList';
var localhost = getBaseUrl('lh');
//详细路径
var seller= localhost +'/user/seller/getCompanyInfo';
var freezeAccount = localhost +'/user/platForm/freezeAccount';
//店铺解锁
var freeAccountUrl = localhost+'/user/platForm/freeAccount';
//详细路径
var applyInfo= localhost +'/user/seller/applyInfo';
//账户信息 
var userInfoUrl = localhost +'/user/platForm/selectAllInfo';

//账户信息
function uManage_uwb_acount() {
var Request = new Object();
 Request = GetRequest();
 var id = Request['id'];
 var isFrozen =  Request['isFrozen'];
	console.log(isFrozen)
	console.log(id)
$.ajax({
	type:"post",
	catch: false,
    url: userInfoUrl,
    dataType: "json",
    data:{id:id} ,
    success: function (data) {
        console.log(data);
        var html = template("uManage_uwb_acounts",data);
        $(".user_info").html(html);    
    },
    error: function () {
    }
})
}
uManage_uwb_acount();

//判断按钮
function btnFrozen() {
var Request = new Object();
 Request = GetRequest();
 var id = Request['id'];
 var isFrozen =  Request['isFrozen'];
	console.log(isFrozen)
	console.log(id)
$.ajax({
	type:"post",
	catch: false,
    url: userInfoUrl,
    dataType: "json",
    data:{id:id} ,
    success: function (data) {
        console.log(data);
        var html = template("fozen",data);
        $(".business_btn").html(html);    
    },
    error: function () {
    }
})
}
btnFrozen();
//基本信息 + 法人信息+经营信息+服务信息
function business_info_detai(){
	var Request = new Object();
        Request = GetRequest();
    var id = Request['iscompanyId'];
    console.log(id)
   	$.ajax({
		type:"post",
	    url: seller,
	    dataType: "json",
	    data:{companyId:id},
	    success: function (data) {
	        console.log(data);
	        var html = template("user_business", data);
            $('.business_detail').append(html);
	        
	    },
	    error: function () {
	    }
	})
}
business_info_detai()

function bigPic(e){
    	$(".index_mask",parent.document).show()
        $(".mask").show();
        var pic_src= $(e.target).prev(".business_pic").attr('src');//获取图片路径
         console.log(pic_src)
        $(".mask_pic").append("<img src=' "+pic_src+ "'>");
     }
      $(".mask_btn").click(function(){
        $(".mask").hide();
        $(".index_mask",parent.document).hide()
      })



//var localHtttp = 'http://172.16.41.184:8003';
//var localhost = 'http://172.16.41.184:8002/user';

//经营身份证明 等

function business_info_img(){
	var Request = new Object();
        Request = GetRequest();
    var id = Request['iscompanyId'];
    console.log(id);
   	$.ajax({
		type:"post",
	    url: applyInfo,
	    dataType: "json",
	    data:{companyId:id},
	    success: function (data) {
			console.log(data)
	    	if (data.success == true) {
	    		console.log(data);
                console.log(data.imageIdFront)
		        var html = template("business_idCard",data);
	            $('.business_imageIdFront').append(html);
	    	}else{
                $('.business_imageIdFront').html('暂无数据');
	    	}
	        
	        
	    },
	    error: function () {
	    }
	})
}

business_info_img();


function isFrozen(obj){
	var Request = new Object();
 	Request = GetRequest();
	var id = Request['id'];
	var isFrozen =  Request['isFrozen'];
	console.log(isFrozen)
 	console.log(id);
 	$.ajax({
		type:"post",
		catch: false,
	    url: freezeAccount,
	    dataType: "json",
	    data:{id:id} ,
	    success: function (data) {
	        console.log(data);
	        if (data.success == true) {
	        	 alert("账户冻结成功！")
	        	 window.location.href='./business_info.html';
	        	}else{
	        		 alert(data.message)
	        	}
	   },
	    error: function () {
	    }
	})
}
function frozen(obj){
	var Request = new Object();
 	Request = GetRequest();
	var id = Request['id'];
	var isFrozen =  Request['isFrozen'];
	console.log(isFrozen)
 	console.log(id);
 	$.ajax({
		type:"post",
		catch: false,
	    url: freeAccountUrl,
	    dataType: "json",
	    data:{id:id} ,
	    success: function (data) {
	        console.log(data);
	        if (data.success == true) {
	        	 alert("账户解冻成功！")
	        	window.location.href='./business_info.html';
	        	}else{
	        		 alert(data.message)
	        	}
	   },
	    error: function () {
	    }
	})
}


//下载图片
function download(src) {
    var $a = document.createElement('a');
    $a.setAttribute("href", src);
    $a.setAttribute("download", "");
    var evObj = document.createEvent('MouseEvents');
    evObj.initMouseEvent( 'click', true, true, window, 0, 0, 0, 0, 0, false, false, true, false, 0, null);
    $a.dispatchEvent(evObj);
};
