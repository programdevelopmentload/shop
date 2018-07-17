/*circle*/
const imgUrl="";
$(".header ul li span").click(function () {

	$(".header ul li span").attr("class","head_no")
	$(this).attr("class","head_active")
});
function circle(index){
  for (var i=0;i<index+1;i++){
      $('.mess_cont__circle li .mess_circle').eq(i).css({'background':'#5ba1c1','color':'#fff'}).next().css('color','#5ba1c1');
      $(".mess_cont__circle li").eq(i+1).css("background-image","url(image/line-hover.png)");
  }
}
$(".header li").click(function () {
    if($(this).html()=="退出"){
        sessionStorage.clear();
        window.location.href="../login.html";
    }
})
/*验证码*/
// var canvasStr;
// var boo=true;
// $("canvas").click(function(){
//     console.log(boo)
//     if(boo){
//         canvas();
//         boo=false;
//         setTimeout(function(){
//             boo=true;
//         },1000)
//     }
// });
//获取图形验证码
// function rn(min,max){
//     return  parseInt(Math.random()*(max-min)+min);
// }
// function rc(min,max){
//     var r=rn(min,max);
//     var g=rn(min,max);
//     var b=rn(min,max);
//     return `rgb(${r},${g},${b})`;
// }
// function canvas(){;
//     canvasStr="";
//     var w=80;
//     var h=34;
//     var ctx=c1.getContext("2d");
//     ctx.fillStyle=rc(180,230);
//     ctx.fillRect(0,0,w,h);
//     //4.随机产生字符串
//     var pool="ABCDEFGHIJKLIMNOPQRSTUVWSYZqwertyuiopasdfghjklmnbvcxz1234567890";
//     for(var i=0;i<4;i++){
//         var c=pool[rn(0,pool.length)];//随机的字
//         canvasStr+=c;
//         var fs=rn(18,40);//字体的大小
//         var deg=rn(-30,30);//字体的旋转角度
//         ctx.font=fs+'px Simhei';
//         ctx.textBaseline="top";
//         ctx.fillStyle=rc(80,150);
//         ctx.save();
//         ctx.translate(20*i+15,15);
//         ctx.rotate(deg*Math.PI/180);
//         ctx.fillText(c,-15+5,-15);
//         ctx.restore();
//     }
//     //5.随机产生5条干扰线,干扰线的颜色要浅一点
//     for(var i=0;i<5;i++){
//         ctx.beginPath();
//         ctx.moveTo(rn(0,w),rn(0,h));
//         ctx.lineTo(rn(0,w),rn(0,h));
//         ctx.strokeStyle=rc(180,230);
//         ctx.closePath();
//         ctx.stroke();
//     }
//     //6.随机产生40个干扰的小点
//     for(var i=0;i<40;i++){
//         ctx.beginPath();
//         ctx.arc(rn(0,w),rn(0,h),1,0,2*Math.PI);
//         ctx.closePath();
//         ctx.fillStyle=rc(150,200);
//         ctx.fill();
//     }
// }
// //点击获取按钮
//     $('.mess_con_form .login_hqyzm').click(function(){
//         new Countdown($(".mess_con_form .login_hqyzm")[0],60)
//     })
    
 /* 验证码倒计时*/
	var Countdown = function(obj,time,className){
	    this.obj = obj;
	    this.initTime = time;
	    this.time = time;
	    this.className = className ? className : 'current';//默认不传递为current
	    this.init();
	};

	Countdown.prototype.init = function(){
	    var clearTimeout; 	
	    var self = this;
	    if (this.time == 0) {
	        this.obj.removeAttribute("disabled");
	        this.obj.classList.remove(this.className);
	        this.obj.value="发送验证码";
	        this.time = this.initTime;
	
	    } else {
	        this.obj.setAttribute("disabled", true);
	        $(this.obj).addClass(this.className);
	        this.obj.value="" + this.time +"s";
	        this.time--;
	        clearTimeout = setTimeout(function() {
	                self.init();
	            },
	            1000)
	    }
	}
	
    /*获取焦点*/
    $('.mess_con_form input').focus(function(){
      $(this).siblings('span').hide();
    })
	/*用户名*/
	$('#userName').blur(function(){
		if($(this).val()==""){
		   $(this).next().show().html('支持中文、字母、数字,4-32位');
		   $(this).next().show().css('color','red');
		   return false;
		}/*else if('($(this).val()).length < 4|| ($(this).val()).length > 32'){
		   $(this).next().show().html('请输入4-32位数字或字母');
		   $(this).next().show().css('color','red');
		   return false;
		}*/
	})
	/*邮箱*/
	$('.mess_con_form div .email').blur(function(){
		if($(this).val()==""){
		   $(this).next().show().html('请输入常用邮箱地址，用于保护账户安全及接收重要通知');
		   $(this).next().show().css('color','red');
		   return false;
		}else if(/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test($(this).val()) == false){
		   $(this).next().show().html('请输入正确的邮箱格式');
		   $(this).next().show().css('color','red');
		  /* $(this).focus();*/
		}
	})
		//手机号验证
	$(".mess_con_form div .phone").blur(function(){
		if($(this).val() == ""){
			$(this).next().show().html("手机号不能为空");
			$(this).next().show().css('color','red');
			return false;
		}else if(($(this).val()).length != 11){
			$(this).next().show().html("手机号不正确");
			$(this).next().show().css('color','red');
			return false;
		}else if (!$(this).val().match(/^[1][3,4,5,7,8,9][0-9]{9}$/)) { 
			$(this).next().show().html("手机号码格式不正确");
			$(this).next().show().css('color','red');
			return false; 
		} 
	});

	//密码验证
	$(".mess_con_form div .password").blur(function(){
		if($(this).val() == ""){
			$(this).next().show().html("密码不能为空");
			$(this).next().show().css('color','red');
			return false;
		}else if(($(this).val()).length < 6 || ($(this).val()).length > 18 ){
			$(this).next().show().html("密码长度在6-18位之间");
			$(this).next().show().css('color','red');
			return false;
		}
	});	
	//再次输入密码
	$(".mess_con_form div .passwords").blur(function(){
		if($(this).val() == ""){
			$(this).next().show().html("密码不能为空");
			$(this).next().show().css('color','red');
			return false;
		}else if(($(this).val()).length < 6 || ($(this).val()).length > 18 ){
			$(this).next().show().html("密码长度在6-18位之间");
			$(this).next().show().css('color','red');
			return false;
		}else if($(this).val() != $("#password").val()){
			console.log($(this).val())
			console.log($("password").val())
			$(this).next().show().html("两次密码不一致");
			$(this).next().show().css('color','red');
			return false;
		}
	});

      /*公司名称*/
	$('#company_name').blur(function(){
		if($(this).val()==""){
		   $(this).next().show().html('请输入公司名称');
		   $(this).next().show().css('color','red');
		   return false;
		}
	})
	  /*公司地址*/
	$('#com_adress').blur(function(){
		if($(this).val()==""){
		   $(this).next().show().html('请填写公司详细地址');
		   $(this).next().show().css('color','red');
		   return false;
		}
	})
     /*联系电话*/
    /*成立日期*/
	/*传真号码*/
	$('#fax_number').blur(function(){
		var reg=/(^[0-9]…{3,4}-[0-9]…{3,8}$)|(^[0-9]…{3,8}$)|(^([0-9]…{3,4})[0-9]…{3,8}$)|(^0…{0,1}13[0-9]…{9}$)/;
		if($(this).val()==""){
		   $(this).next().show().html('请填写传真号码');
		   $(this).next().show().css('color','red');
		   return false;
		}else if(reg.test($(this).val())==false){
		   $(this).next().show().html('传真有误，请重新填写');	
		   $(this).next().show().css('color','red');
		    return false;
		}
	})
	/*公司人数*/
	var re = /^-?\\d+$/;
	$('#com_people').blur(function(){
		if($(this).val()==""){
		  $(this).next().show().html('请填写公司人数');
		  $(this).next().show().css('color','red');
		   return false;
		} else if(re.test($(this).val())==false){
		   $(this).next().show().html('请输入正确的人数');
		   $(this).next().show().css('color','red');
		    return false;
		}
	})
	/*法人代表*/
	$('#fr_repre').blur(function(){
		if($(this).val()==""){
		  $(this).next().show().html('请填写法人代表');
		  $(this).next().show().css('color','red');
		  return false;
		}
	})

	/*主要销售范围*/
	$('#sales').blur(function(){
		if($(this).val()==""){
		  $(this).next().show().html('请输入销售地区信息，不同地区用逗号间隔');	
		   $(this).next().show().css('color','red');
		   return false;
		}
	});
//429517
   $("#box>.right").css("min-height",$(window).height());
   $("#box>.left").css("min-height",$(window).height());
   //导航
	//还需要在首次进入当前页面设置默认值
$(".header ul li").click(function () {
	var text=$(this).find("span").html();
	sessionStorage.setItem("classId1",text);
	var index=$(this).index();

        $(".left>ul").find("li li").eq(0).attr("class","first");
    sessionStorage.setItem("classId2",$(".left>ul").find("span").eq(0).html());
	sessionStorage.setItem("classId3",$(".left>ul").find("li li").eq(0).html());
    if(text=="基础设置"){
        window.location.href="../basis_setting/account_msg.html"
    }
    if(text=="商品管理"){
        window.location.href="../product_manage/sale-goods.html"
    }
    if(text=="订单管理") {
        window.location.href = "../order_control/order-list.html"
    }
console.log(sessionStorage.getItem("classId1"));
console.log(sessionStorage.getItem("classId2"));
console.log(sessionStorage.getItem("classId3"));
});

$(".left ul ul li").click(function () {
    var text=$(this).html();
    $(this).attr("class","first");
    sessionStorage.setItem("classId2",$(this).parent().prev().html());
    sessionStorage.setItem("classId3",text);
    // console.log(sessionStorage.getItem("classId1"));
    // console.log(sessionStorage.getItem("classId2"));
    // console.log(sessionStorage.getItem("classId3"));
    console.log(text);
    if(text=="基本信息"){
        window.location.href="../basis_setting/basis_msg.html"
    }
    if(text=="认证资料"){

        window.location.href="../basis_setting/cert-already.html"
    }
    if(text=="我的资料"){

        window.location.href="../basis_setting/account_msg.html"
    }
    if(text=="保证金"){
        window.location.href="../basis_setting/deposit.html"
    }
    if(text=="经营区域"){
        window.location.href="../basis_setting/operation_msg.html"
    }
    if(text=="我的合同"){
        window.location.href="../basis_setting/contract.html"
    }
    if(text=="在售商品"){
        window.location.href="../product_manage/sale-goods.html"
    }
    if(text=="待售商品"){
        window.location.href="../product_manage/forSale.html"
    }
    if(text=="草稿箱"){
        window.location.href="../product_manage/caogao.html"
    }
    if(text=="申请记录"){
        window.location.href="../product_manage/apply_record.html"
    }
    if(text=="订单管理"){
        window.location.href="../order_control/order-list.html"
    }
    if(text=="采购单管理"){
        window.location.href="../order_control/purch_list.html"
    }
    if(text=="验证取货码"){
        window.location.href="../order_control/verify_code.html"
    }



});

