
function rewriteAjax(obj,callback){
    if(obj.data==undefined){
        obj.data="";
    }
    $.ajax({
        url:obj.url,
        data:obj.data,
        headers: {
            Authorization:localStorage.getItem("token"),
        },
        type:"post",
        success:function (res) {
            if(res.errorCode==9527){
                window.location.href="../login.html";
            }
            if(callback!=undefined){
                callback(res);
            }

        },
        error:function (err) {
            return err;
        }
    })
}

/**
 * 获取域名端口
 */
function getBaseUrl(param) {
    // if(param=='img'){
    //     return 'http://172.16.40.153:8015';
    // }else {
    //     return 'http://172.16.40.153:8002/goods';
    // }
    if(param=="t"){//陶帅江
        return 'http://172.16.34.227:8007';
    }else if(param=='g'){//郭斌磊
        return 'http://172.16.40.153:8015';
    }else if(param=='w'){//王喧
        return 'http://172.16.34.37:8007';
    }else if(param=='yy'){//岳禹成
        return 'http://172.16.44.45:8003';
    }else if (param=='ys'){ //ys
        return 'http://172.16.40.239:8008';
    }else if (param=='yyy'){
        return 'http://172.16.40.134:8015';
    }else if(param=="yuan"){
        return 'http://172.16.40.239:8008';
    }
}
/**
 * 获取base路径
 */
function getBasePath() {
    return getHostPath() + "";
}
/**
 * 获取主机url
 */
function getHostPath() {
    var curWwwPath=window.document.location.href;
    var pathName=window.document.location.pathname;
    var pos=curWwwPath.indexOf(pathName);
    var localhostPaht=curWwwPath.substring(0,pos);
    return localhostPaht;
}
/*circle*/


function circle(index){
    for (var i=0;i<index+1;i++){
        $('.mess_cont__circle li .mess_circle').eq(i).css({'background':'#5ba1c1','color':'#fff'}).next().css('color','#5ba1c1');
        $(".mess_cont__circle li").eq(i+1).css("background-image","url(image/line-hover.png)");
    }
}
$(".header li").click(function () {
    if($(this).html()=="退出"){
        sessionStorage.clear();
        localStorage.clear();
        window.location.href="../login.html";
    }
});

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
    }else if(($(this).val()).length < 4|| ($(this).val()).length > 32){
        $(this).next().show().html('请输入4-32位数字或字母');
        $(this).next().show().css('color','red');
        return false;
    }
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
var name=localStorage.getItem("username");
$(".header ol li").each(function () {
    if($(this).html()=="admin"){
        $(this).html(name);
    }
});
var imagesState=localStorage.getItem("imagesState");
console.log(imagesState);
if(imagesState!=2){
    $(".left span").each(function () {
        if($(this).html()=="经营管理"){
            $(this).parent("li").hide()
        }
    })
}else {
    $(".left span").each(function () {
        if($(this).html()=="经营管理"){
            $(this).parent("li").show()
        }
    })
}
$(".header li").click(function () {
    var text=$(this).find("span").html();
    console.log(text)
    if(text=="基础设置"){
        window.location.href="../basis_setting/basis_msg.html"
    }
    if(text=="首页"){
        window.location.href="../basis_setting/login_hasPro.html"
    }
    if(text==localStorage.getItem("username")){
        window.location.href="../basis_setting/account_msg.html"
    }
    if(text=="商品管理"){
        window.location.href="../product/product_agreement.html"
    }
    if(text=="订单管理") {
        sessionStorage.setItem("orderStatus","");
        sessionStorage.setItem("orderName","订单管理");
        window.location.href = "../order_control/order_list.html"
    }

});

$(".left ul ul li").click(function () {
    var text=$(this).html();
    $(this).attr("class","first");
    if(text=="基本信息"){
        window.location.href="../basis_setting/basis_msg.html"
    }
    if(text=="认证资料"){

        window.location.href="../basis_setting/cert-already.html"
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
    if(text=="商品模板"){
        window.location.href="../product/product_agreement.html"
    }
    if(text=="在售商品"){
        window.location.href="../product/sale.html"
    }
    if(text=="库存管理"){
        window.location.href="../product/cover_manage.html"

    }
    if(text=="草稿箱"){
        window.location.href="../product_manage/caogao.html"
    }
    if(text=="申请记录"){
        window.location.href="../product_manage/apply_record.html"
    }
    if(text=="账户管理"){
        window.location.href="../basis_setting/bank_manage.html";
    }
    if(text=="订单管理"||text=="待备货"||text=="待取货"||text=="已取货"
        ||text=="已完成"||text=="采购单管理"||text=="待确认"){
        sessionStorage.setItem("orderStatus","");
        sessionStorage.setItem("orderName",text);
        switch (text){
            case "待确认":
                sessionStorage.setItem("orderStatus",0);
                break;
            case "带备货":
                sessionStorage.setItem("orderStatus",1);
                break;
            case "待取货":
                sessionStorage.setItem("orderStatus",2);
                break;
            case "已取货":
                sessionStorage.setItem("orderStatus",3);
                break;
            case "已完成":
                sessionStorage.setItem("orderStatus",4);
                break;
        }


        if($(this).parent().prev().html()=="采购单"){
            sessionStorage.setItem("orderIndex",1)
            window.location.href="../order_control/purchase_list.html"
        }else{
            sessionStorage.setItem("orderIndex",0)
            window.location.href="../order_control/order_list.html"
        }


    }


});

