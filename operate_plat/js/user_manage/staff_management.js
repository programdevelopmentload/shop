
// $(function () {
//     //nav_Common_fun("员工列表","员工分配");
//     //searchPage();
// });




  //获取id
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

//var localhost = "http://172.16.41.184:8002/user";
//var staff_allot_url = local_y + '/platForm/selectAllInfo';


var local = 'http://172.16.38.206:8008'; //元帅
var area_province_url = local+'/region/findSelectServerRegion';
var selectedCity= local+'/region/findSelectServerCity';


var localhost_z= 'http://172.16.44.118:8009'; //张名扬
var shopCity_Url =localhost_z+'/shop/findStartStateShopByShopCity';

//var local_l = 'http://172.16.41.184:8003';
var localhost='http://172.16.44.200:8002/user';
var accountType = localhost+'/platForm/allAccountType';


var staff_allot_url = localhost + '/platForm/selectAllInfo';

// 点击确认提交的按钮

var staff_btn_url= localhost + '/platForm/setStaff';


//渲染所在区域报包括省和市
function area_province_html(){
	$.ajax({
		type:'post',
		url:area_province_url,
		dataType:'json',
	    success:function(res){
           var data= res.data;
          	var html='';
          	for (var i = 0; i < data.length; i++) {
          		 html+='<option data-provinceId= "'+data[i].provinceId+'" value="'+data[i].provinceName+'">'+data[i].provinceName+'</option>';
          	}
          	$('.area_province').html(html)
	    },
	    error:function(){
	    	console.log(123243453)
	    }
	})
}
area_province_html();

//渲染所在的市
$('.area_province').blur(function(){
	//获取省份 ID
	$('.area_city').html('')
	var  provinceId = $(this).find('option:selected').attr('data-provinceId');
	$.ajax({
		type:'post',
		url:selectedCity,
		dataType:'json',
		data:{provinceId:provinceId},
	    success:function(res){
	    	//console.log(res)
           var data= res.data;
          	var html='';
          	for (var i = 0; i < data.length; i++) {
          		 html+='<option data-id= "'+data[i].id+'" value="'+data[i].name+'">'+data[i].name+'</option>';
          	}
          	$('.area_city').html(html);

	    },
	    error:function(){
	    	console.log(123243453)
	    }
	})

})


//关联店铺渲染shopCity_Url

$('.area_city').blur(function(){
	ass_store();

})
function ass_store(){
	var cityName =$('.area_city').find('option:selected').val();
	console.log(cityName)
	$.ajax({
		type:'post',
		url:shopCity_Url,
		dataType:'json',
		data:{ shopCity:cityName},
	    success:function(res){
	       console.log(res)
           var data= res.data;
          	var html='';
          	for (var i = 0; i < data.length; i++) {
          		  html+='<li data-value="'+data[i].shopName+'" data-id= "'+data[i].shopId+'">';
          		  html+='<input type="checkbox"  data-id="'+data[i].shopId+'"/>'
          		 html+='<label data-id= "'+data[i].shopId+'" data-value="'+data[i].shopName+'">'+data[i].shopName+'</label>';
          		 html+='</li>'
          	}
          	$('.ass_store').html(html)
	    },
	    error:function(){
	    	console.log(123243453)
	    }
	})

}



//渲染身份类型 accountType
function identity_Type() {
	$.ajax({
		type:'post',
		url:accountType,
		dataType:'json',
	    success:function(res){
	       //console.log(res);
           var data= res.data;
          	var html='';
          	for (var i = 0; i < data.length; i++) {
          		 html+='<span data-id= "'+data[i].roleId+'" value="'+data[i].roleName+'">'+data[i].roleName+'</span>';
          	}
          	$('.identity_type').html(html)
	    },
	    error:function(){
	    	console.log(12324)
	    }
	})
}
identity_Type()

// 点击左侧 克隆到右边
var addIndex;
var removeIndex;
var addArr = [];
var addId;
$('body').on('click','.identity_type span',function(){
	 $(this).addClass('activite').siblings().removeClass('activite');
      addText = $(this).addClass('activite').text();
      addIndex = $(this).index();
      addId = $(this).attr('data-id');
})
$('#addRight').click(function(){
	 if(addArr.indexOf(addIndex) != -1){
	 	alert('添加过了');
	 	console.log($('.identity_ul li').eq(addArr.indexOf(addIndex)));
	 }else{
	 	addArr.push(addIndex);
	 	$('.identity_ul').append('<li data-id = "'+addId+'">'+addText+'</li>');
	 	$('.identity_ul').on('click','li',function(){
	 		removeIndex = $(this).index();
	 	});
	 }
})
$('body').on('click','.identity_ul li',function(){
	 $(this).addClass('activited').siblings().removeClass('activited');
      data_id = $(this).addClass('activited').attr('data-id');
})
$('#removeRight').click(function(){
	if(!$('.identity_ul li').hasClass('activited')){
		alert('请选择要删除的选项');
	}else{
		$('.identity_ul li').eq(removeIndex).remove();
		addArr.splice(removeIndex,1);
		 //console.log(addArr,addArr[removeIndex])
	}
	 
})

function staff_manage(){
	var Request = new Object();
    Request = GetRequest();
	var id = Request['id'];
	console.log(id);
	$.ajax({
		type:"post",
	    url:staff_allot_url,
	    dataType: "json",
	    data:{id:id},
	    success:function (res) {
	        //console.log(res);
	        if (res.success ==true) {
	        	var html = template("staff_manage",res);
        		$('.staff_allot').append(html);
	        }else{
	        	$('.staff_allot').html('暂无数据');
	        }
        	
	    },
	    error: function () {
	    	console.log(3445)
	    }
	})

}
staff_manage();






//点击确认按钮
 var txt ='' ;
 var txt_html='';
 var roleIds = '';
 var roleName = '';
$('.staff_btn').click(function(){
	 //获取选中的名称
	 
	//获取店铺名称
    $.each($('.ass_store li'),function(i,v){
        if($(this).find('input').is(':checked')){
            // txt_html+=$(this).attr('data-value')+',';
            txt_html+='<p>'+$(this).attr("data-value")+'</p>'
            txt +=$(this).attr('data-id')+',';
        }

    });
    //获取身份类型
    $.each($('.identity_ul li'),function(i,v){
        roleName+='<p> 身份类型:'+$(this).text()+'</p>'  
        roleIds+=$(this).attr('data-id')+',';
    });
       roleIds = roleIds.substring(0,roleIds.length-1);
       txt = txt.substring(0,txt.length-1);

    //获取ID roleIds  shops
    var Request = new Object();
    Request = GetRequest();
	var id = Request['id'];
	console.log(id);
	var html = template('ajax_alert', {});
        $.popwin(html, {
            title: '您准备将员工分配到以下店铺，请确认该操作',
            fixed: true,
            drag: false, //是否可拖拽
        });
        $("#popwin_Out").addClass("attr_manag_add");
        $.popwin.setPosition(410,460);
        $(".attr_manag_add .mask_tip").append(txt_html);
        $(".attr_manag_add .mask_tip").append(roleName);
        $('.mask_ok').click(function(){

        	console.log(roleIds);

     		console.log(txt);
           
        	$.ajax({
        		
				type:"post",
			    url:staff_btn_url,
			    dataType: "json",
			    //data:param,
			    data:{id:id,roleIds:roleIds,shops:txt },
			    success:function(data){
			    	debugger;
		 			 console.log(data);
		 			 if (data.success == true) {
		 			 	window.location.href='./staff_add.html'
		 			 }
		 			
		 			
			    },
			    error:function(){
			    	console.log(34353);
			    }
			})
        	 
        })
	//var accountType = $('.identity_type').find('option:selected').attr('data-id');
	//console.log(accountType);
	
   
})



function clickFalse(){
     $("#popwin_Blank").hide();
     $("#popwin_Out").hide();
}