//var localHttp = 'http://172.16.41.60:8007';
//var localHttp = 'http://172.16.40.153:8007';
//var localHttp ='http://172.16.34.37:8007';
//var localHttp='http://172.16.40.153:8002/goods';//张名言
//var localHttp = getBaseUrl('w');
var localHttp = 'http://172.16.44.14:8007';
var findAllBackUrl =localHttp+'/goods/GoodsClassification/findAllBackClassOpen';

//var localURL = 'http://172.16.39.70:8003';
var localURL =getBaseUrl('y_jl');  //蒋磊
//var localURL = 'http://172.16.38.51:8002/user' //蒋磊
var goodsInfo = localURL +'/agreement/goods/info';
var create = localURL+'/agreement/record/create' ;
// $(function () {
//     nav_Common_fun("发布商品");
// })
// // var regexAdd = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;

//商品发布协议渲染
// var code;
// var username = userName_getIem();
// var phoneNum = userPhone_getIem();
// console.log(username)
// $('.agreementGoods').click(function(){
//     $(".index_mask", parent.document).show();
//     $('.mask').show();
//     $.ajax({
//        url:goodsInfo,
//        type:'post',
//        dataType:'json',
//        success:function(data){
//         console.log(data);
//         code = data.data.code;
//         console.log(code);
//         var html='';
//         html+='<p>协议名称：'+data.data.name+'</p>'
//         // html+='<p>协议类型：'+data.data.type+'</p>'
//         // html+='<p>创建时间：'+data.data.createTime+'</p>'
//         html+='<font><p>'+data.data.comment+'</p></font>'
//      $('.maskCont').html(html)
//        }
//     })
// })
// $('.btnClose').click(function(){
//      $('.mask').hide();
//      $(".index_mask", parent.document).hide();
// })

var flag = false;
var dataJson = {};
var dataOrigin;
var categoriesId1;
var categoriesId2;



var dataJson = {};

var dataJson = {};
getData();
function getData() {
    $.ajax({
        url: findAllBackUrl,
        type: "post",
        dataType: "json",
        success: function (res) {
            console.log(111)
            console.log(res)
            if (res.success) {
                var arr = [];
                var data = res.data;
                for (var i = 0; i < data.length; i++) {
                    if (data[i].parentId == 0) {
                        var obj = {};
                        obj.id = data[i].id;
                        obj.name = data[i].name;
                        var secondArr = [];
                        for (var j = 0; j < data.length; j++) {

                            if (data[j].parentId == obj.id) {
                                var obj2 = {};
                                obj2.id = data[j].id;
                                obj2.name = data[j].name;
                                secondArr.push(obj2);

                                var thirdArr = [];
                                for (var k = 0; k < data.length; k++) {
                                    var obj3 = {};
                                    if (data[k].parentId == obj2.id) {
                                        obj3.id = data[k].id;
                                        obj3.name = data[k].name;
                                        thirdArr.push(obj3);
                                    }

                                }
                                obj2.child = thirdArr;
                            }

                            //遍历3级菜单；
                        }
                        obj.child = secondArr
                        arr.push(obj);
                    }


                }
                dataJson.option = arr;
                console.log(arr);

                sanji();
            }
        },
        error: function (err) {
            console.log('数据暂时还没有获取')
        }
    });
}

getData();

//
function sanji() {
    var l1 = 0,
        l2 = 0;
    var cname1, cname2, cname3;
    var cid1, cid2, cid3;
    var canClick = !0;
    var canClose = !1;
    $('.select-box').css({
        left: $('.select-res').offset().left,
        top: $('.select-res').offset().top + $('.select-res').outerHeight(true)
    });
    $('span', $('.select-res')).on('click', function () {
        $('.select-box').show();
        if (canClick) {
            $('ul', $('.select-box')).html('');
            fillData();
            canClick = !1;
        }
    });
    $('span', $('.select-box')).on("click", function () {
        canClose ? $('.select-box').hide() : alert('请选择下级品类！');
        canClick = !0;
    });

    $('.select-res').on('click', 'a', function () {
        $(this).parent().remove();
        $('.select-box').css({
            top: $('.select-res').offset().top + $('.select-res').outerHeight(true)
        });
    })

    $('ul.first', $('.select-box')).on('click', 'li', function () {
        $(this).addClass('selected').siblings().removeClass('selected');
        $('ul.third').html('');
        fillData($(this).index());
        l1 = $(this).index();
        cname1 = $(this).text();
        cid1 = $(this).attr('val');
        canClose = !1;
        $('input.cid', $('.select-res')).val(cid1);
        sessionStorage.setItem("cid1", cid1);
        sessionStorage.setItem("cname1", cname1);

        sessionStorage.setItem("cid2", "");
        sessionStorage.setItem("cname2", "");
        sessionStorage.setItem("cid3", "");
        sessionStorage.setItem("cname3", "");
        $('input.cname', $('.select-res')).val(cname1);
    });
    $('ul.second', $('.select-box')).on('click', 'li', function () {
        $(this).addClass('selected').siblings().removeClass('selected');
        fillData(l1, $(this).index());
        l2 = $(this).index();
        cname2 = $(this).text();
        cid2 = $(this).attr('val');
        canClose = !1;
        $('input.cid', $('.select-res')).val(cid1 + ',' + cid2);
        $('input.cname', $('.select-res')).val(cname1 + ',' + cname2);
        sessionStorage.setItem("cid2", cid2);
        sessionStorage.setItem("cname2", cname2);
        sessionStorage.setItem("cid3", "");
        sessionStorage.setItem("cname3", "");
    });
    $('ul.third', $('.select-box')).on('click', 'li', function () {
        $(this).addClass('selected').siblings().removeClass('selected');
        cname3 = $(this).text();
        cid3 = $(this).attr('val');
        canClose = !0;
        var hasExist = !1;
        $('.select-res').find("p").each(function () {
            if ($(this).text().split(' > ')[2] == cname3) hasExist = !0;
        })

        $('.select-box').css({
            top: $('.select-res').offset().top + $('.select-res').outerHeight(true)
        });
        $('input.cid', $('.select-res')).val(cid1 + ',' + cid2 + ',' + cid3);
        $('input.cname', $('.select-res')).val(cname1 + ',' + cname2 + ',' + cname3);
        $('#hiddenText').val(cname1 + ',' + cname2 + ',' + cname3);
        sessionStorage.setItem("cid3", cid3);
        sessionStorage.setItem("cname3", cname3);
    });
    $(".fabu .shop_title1 a").click(function () {
        $(".left").css("display", "block");
        $(".fabu").css("display", "none");
        $(".select_classify").css("display", "block");
        $("#box").css("background", "#337ab7");
        $("#box").attr("class", "clearfix");
    })

}

//填充级联数据


function fillData(l1, l2) {
    var temp_html = "";
    if (typeof(dataJson.option) != 'undefined' && arguments.length == 0) {
        $.each(dataJson.option, function (i, pro) {
            temp_html += '<li val="' + pro.id + '">' + pro.name + '</li>';
        });
    } else if (typeof(dataJson.option[l1].child) != 'undefined' && arguments.length == 1) {
        $.each(dataJson.option[l1].child, function (i, pro) {
            temp_html += '<li val="' + pro.id + '">' + pro.name + '</li>';
        });
    } else if (typeof(dataJson.option[l1].child[l2].child) != 'undefined' && arguments.length == 2) {
        $.each(dataJson.option[l1].child[l2].child, function (i, pro) {
            temp_html += '<li val="' + pro.id + '">' + pro.name + '</li>';
        });
    }
    $('.select-box ul:eq(' + arguments.length + ')').html(temp_html);
}
    //getData();

 // 商品管理 选择分类  3级分类点击跳转
    $(".select_classify .form-control").click(function () {
          var classid = $('.third .selected').attr('val');
          var hiddenText = $('#hiddenText').val();
          console.log(classid);

        if ($('.first li').text()=="" && $('.second li').text()=="" && $('.third li').text()=="") {
            alert('请先选择分类')
            return false;
        }else if (hiddenText==''){
            alert('请先选择分类');
           return false
        }
         else if(classid!== undefined  && classid!== ""&& classid !== null){
            window.location.href="./publish_product.html?id="+classid;
        }
        // }else if(hiddenText=='') {
        //     alert('请先选择分类');
        //     return false
        // }else if ($('.first li').text()=="" && $('.second li').text()=="" && $('.third li').text()=="" ){
        //      alert('请先选择分类')
        // }else{
        //    alert('请勾选协议!')
        //      return false;
        // }
               

    });
    
    
    
    
    
    
    
    
    

