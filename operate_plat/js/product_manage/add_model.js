//渲染品牌分类

var localhost = 'http://172.16.41.23:8007'
var checkClass_url =localhost +'/goods/check/checkClass'
var checkBrand_url = localhost+'/goods/check/checkBrand'
var showPartByBrand_url = localhost+'/goods/GoodsClassification/showPartByBrandId';


//所属品牌
function checkBrand(){
    $.ajax({
        type: "post",
        url:checkBrand_url,
        dataType: "json",
        success:function(res){
            var data=res.data;
            console.log(data)
            var html = '';
            for(var i = 0; i<data.length;i++){
                html+='<option data-id="'+ data[i].id+' " value=" '+data[i].nameCh +'" >'+ data[i].nameCh+'</option>'
            }
            $('.add_brand').html(html)
        },
        error:function(){}
    })
}
checkBrand()


// // 渲染叶子分类
// function checkClass(){
//     $.ajax({
//         type: "post",
//         url:checkClass_url,
//         dataType: "json",
//         success:function(res){
//             console.log(res)
//             var data=res.data;
//             var html = '';
//             for(var i = 0; i<data.length;i++){
//                 html+='<option dataId = "'+ data[i].id+'" value=" '+data[i].name +'">'+ data[i].name+'</option>'
//             }
//             $('.add_checkClass').html(html)
//         },
//         error:function(){}
//     })
// }
// checkClass()

 var clickSure =localhost +'/goods/spu/add';


// 点击事件
$("#add_sure").click(function(){
      var model = $.trim($(".model_input").val());
      var brandId = $(".add_brand").find('option:selected').attr('data-id');
      var leafClassId  = $('.add_checkClass').find('option:selected').attr('dataId');
    
      $.ajax({
        type: "post",
        url:clickSure,
        dataType: "json",
        data:{model :model ,brandId :brandId ,leafClassId:leafClassId},
        success:function(data){
            debugger;
            if (data.success == true) {
                if (model!=='' && brandId && leafClassId) {
                    debugger;
                    console.log(data.message)
                }else{
                    alert('信息没有添完整哦！')
                }
            }
        },
        error:function(){
            console.log('没有数据了哦！')
        }
      })

})

var categoriesUrl = 'showall.json';
var regexAdd = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
var flag = false;
var dataJson = {};
var dataOrigin;
var categoriesId1;
var categoriesId2;

$.sidebarMenu($('.sidebar-menu'));

$(function () {
   
    categoriesAll();//拉取数据源
    filterCategories();
});

/*三级联动适配数据*/
function filterCategories() {
    dataOrigin = dataJson.options;
    var str = "";
    $.each(dataOrigin, function (index, item) {
        str += '<li data-id="' + item.id + '">' + item.name + '</li>'
    });
    $("#selectbox1 ul").html(str);
    // $("#selectbox1").css("background-color", "#fff");
    $("#selectbox1 ul li").click(function () {
        $("#selectbox2").selectBox("removeAll");
        $("#selectbox3").selectBox("removeAll");
        var $this = $(this);
        categoriesId1 = $this.attr('data-id');//一级id抓取
        var str2 = "";
        $.each(dataOrigin, function (index, item) {
            if (item.id == categoriesId1) {
                $.each(item.child, function (index2, item2) {//匹配二级数据并渲染
                    str2 += '<li data-id="' + item2.id + '">' + item2.name + '</li>'
                })
            }
        });
        $("#selectbox2 ul").html(str2);
        $("#selectbox2").css("background-color", "#fff");
        $("#selectbox2 ul li").click(function () {
            $("#selectbox3").selectBox("removeAll");
            var $this = $(this);
            categoriesId2 = $this.attr('data-id');
            var str3 = "";
            $.each(dataOrigin, function (index, item) {
                //一级遍历
                if (item.id == categoriesId1) {//抓取一级
                    $.each(item.child, function (index2, item2) {//遍历二级
                        if (item2.id == categoriesId2) {//抓取已选择二级
                            $.each(item2.child, function (index3, item3) {//三级遍历
                                str3 += '<option value="' + item3.id + '">' + item3.name + '</option>'
                            });
                        }
                    })
                }
            });
            $("#selectbox3 ul").html(str3);
        });
    });
}


// 依据id拉取底部三级联动数据源
function categoriesAll() {
    var brandId = $(".add_brand").find('option:selected').attr('data-id');
    $.ajax({
        type: "post",
        catch: false,
        async: false,
        url: showPartByBrand_url,
        dataType: "json",
        data:{brandId:22},
        success: function (res) {
            if (res.success == true) {
                var arr = [];//空数组
                var data = res.data;//提取数组
                for (var i = 0; i < data.length; i++) {
                    if (data[i].parentId == 0) {
                        var obj = {};//存储所有一级的键值对
                        obj.id = data[i].id;
                        obj.name = data[i].name;
                        var secondArr = [];
                        for (var j = 0; j < data.length; j++) {

                            if (data[j].parentId == obj.id) {
                                var obj2 = {};
                                obj2.id = data[j].id;
                                obj2.name = data[j].name;
                                //存储新对象进入每一个一级目录中
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
                        obj.child = secondArr;
                        arr.push(obj);
                    }
                }
                ;
                dataJson.options = arr;
                // var html = template("belong_box", dataJson);
                // $('.belong_box_con').append(html);
            } else {
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '未填写完全',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410,460);
                $(".attr_manag_add .mask_tip").html("连接错误");
                // alert("出现错误")

            }
        },
        error: function () {
        }
    });

}






