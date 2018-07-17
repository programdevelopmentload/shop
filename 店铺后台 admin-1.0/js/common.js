//点击导航
$(".header li").click(function () {
    var text=$(this).find("span").html();
    console.log(text)
    if(text=="店铺管理"){
        window.location.href="../store management/store_infor.html"
    }
    if(text=="商品管理"){
        window.location.href="../product_manage/new_product_list.html"
    }
    if(text=="仓储管理") {
        // sessionStorage.setItem("orderStatus","");
        // sessionStorage.setItem("orderName","订单管理");
        window.location.href = "../order_control/order_list.html"
    } if(text=="订单管理") {
        // sessionStorage.setItem("orderStatus","");
        // sessionStorage.setItem("orderName","订单管理");
        window.location.href = "../order_control/order_list.html"
    }
});
$(".left ul ul li").click(function () {
    var text=$(this).html();
    if(text=="店铺资料"){
        window.location.href="../store management/store_infor.html"
    }
    if(text=="测量模板"){
        window.location.href="../store management/template.html"
    }
    if(text=="收货地址"){
        window.location.href="../store management/goods_adress.html"
    }
    if(text=="新品陈列"){
        window.location.href="../product_manage/new_product_list.html"
    }
    if(text=="陈列记录"){
        window.location.href="../product_manage/list_record.html"
    }
    if(text=="商品上架"){
        window.location.href="../product_manage/putaway.html"
    }
    if(text=="上架记录"){
        window.location.href="../product_manage/putaway_record.html"
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


// token验证
function rewriteAjax(obj,callback){
    if(obj.data==undefined){
        obj.data="";
    }
    $.ajax({
        url:obj.url,
        data:obj.data,
        dataType:'json',
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

// console.log($(window).height()-60 )
// 背景图自适应
// console.log($('.banner').height($(document.body).height()-60-101))

$("#box>.right").css("min-height",$(window).height());
$("#box>.left").css("min-height",$(window).height());

