
//渲染品牌分类
//var localUrl = getBaseUrl('w');
//var localhost = 'http://172.16.40.153:8002/goods';
//var localhost = 'http://172.16.34.37:8007';
var localhost = getBaseUrl('w');
//var localHttp = getBaseUrl('t');
var localHttp = 'http://172.16.44.85:8007'
//var localHttp='http://172.16.44.85:8007'
//叶子分类
var backLeaf_AllUrl = localhost + '/goods/GoodsClassification/showAllLeafClass';
//顶部所有品牌的
var brand_AllUrl = localhost + '/goods/brand/showBrandLeafClassOpenClose';
//商品类型
var goodsType_url = localhost+'/goods/service/showAll';
//  $('.area').click(function(){
//  $(".mask").show() 
// })
//品牌类型
function BrandModel() {
    $.ajax({
        type: "post",
        catch: false,
        sync: false,
        url:brand_AllUrl,
        dataType: "json",
        success: function (data) {
            console.log(data)
            if (data.success == true) {
                $('.moldBrand_switch_box').show();
                var str = "<span data-bcid='bcidAll' class='moldClass_all moldBrand_switch_active col-xs-2'>全部</span>";
                $(data.data).each(function (j, k) {
                    str += " <span data-bcid='" + k.id + "' class='col-xs-2'>" + k.nameCh + "</span>"
                });
                $('.moldBrand_switch>div').html(str);
                var length = $('.moldBrand_switch').find('span').length;
                if (length>6){
                    $(".moldKind_click").show();
                }else {
                    $(".moldKind_click").hide();

                }
                console.log(length)

            }
        },
        error: function () {
            $('.moldBrand_switch_box').hide();
        }
    });

}

//商品类型
function goodsType(){
     $.ajax({
        type: "post",
        catch: false,
        sync: false,
        url:goodsType_url,
        dataType: "json",
        success: function (data) {
            console.log(data)
            //debugger;
            if (data.success == true) {
                $('.moldClass_cates_box').show();
                var str = "<span data-modeid='modelidAll' class='moldClass_all moldType_switch_active col-xs-2'>全部</span>";
                $(data.data).each(function (j, k) {
                    str += " <span data-modeid='" + k.id + "' class='col-xs-2'>" + k.goodsType + "</span>"

                });
                $('.moldClass_types_con').html(str);
                var length = $('.moldClass_types_con').find('span').length;
                console.log(length)
                if (length>6){
                    $(".moldType_click").show();
                }else {
                    $(".moldType_click").hide();

                }
            }
        },
        error: function () {
            $('.moldBrand_switch_box').hide();
        }
    });
}
//型号列表后台分类列表渲染
function backLeaf_AllFun() {
    $.ajax({
        type: "post",
        catch: false,
        sync: false,
        url: backLeaf_AllUrl,
        dataType: "json",
        success: function (data) {
            if (data.success == true) {
                if (data.data.length > 0) {
                    $('.moldKind_switch_box').show();
                    var str = "<span data-lcid='lcidAll' class='moldClass_all moldKind_switch_active col-xs-2'>全部</span>";
                    $(data.data).each(function (i, v) {
                        str += " <span data-lcid='" + v.id + "' class='col-xs-2'>" + v.name + "</span>"

                    });
                    $('.moldKind_switch_box').show();
                    $('.moldKind_switch>div').html(str);
                    var length = $('.moldKind_switch').find('span').length;
                    console.log(length)
                    if (length>6){
                        $(".moldBrand_click").show();
                    }else {
                        $(".moldBrand_click").hide();

                    }

                } else {
                    $('.moldKind_switch_box').hide();
                }

            }
        },
        error: function () {
            $('.moldKind_switch_box').hide();

        }
    });

}



 $(function () {
 // 	if ($('.province').html()==='' && $('.city').html()==='') {
	
	//      alert('请先选择区域！')
	// 	$('#test').hide();
	// }
	searchPage();
    backLeaf_AllFun();//后台叶子筛选列表
    BrandModel();
    goodsType();
    topArea_active();
     $('.pageSize_switch').on('change', function () {
         searchPage();
     })
     //品牌激活事件
    $('.moldBrand_switch').on('click', 'span', function () {
        var _index = $(this).index();
        $(this).addClass("moldBrand_switch_active").siblings().removeClass("moldBrand_switch_active");
        $("#self_table tbody").html("");
        searchPage();//此处传参数1
    });

    //分类激活事件
    $('.moldKind_switch').on('click', 'span', function () {
        var _index = $(this).index();
        $(this).addClass("moldKind_switch_active").siblings().removeClass("moldKind_switch_active");
        $("#self_table tbody").html("");

        searchPage();//此处传参数1
    });
     //商品类型
     $('.moldClass_types_con').on('click', 'span', function () {
        var _index = $(this).index();
        $(this).addClass("moldType_switch_active").siblings().removeClass("moldType_switch_active");
        $("#self_table tbody").html("");
        searchPage();//此处传参数1
    });
    $('.pageSize_switch').on('change', function () {
        searchPage();
    });

});


// 渲染商品区域 1.0 版本上 暂时不删
// var  localHttp = 'http://172.16.40.215:8008';
// var  findSelectServer_Url= localHttp+'/region/findSelectServerReg';

// function findArea(){
// 	$.ajax({
// 		type:'post',
// 		url:findSelectServer_Url,
// 		dataType:"json",
// 		success:function(res){
// 			var data=res.data;
// 			console.log(data);
// 			var html='';
// 			var doc = '';
// 			for (var i = 0; i < data.length; i++) {	
// 				var regionInfo = data[i].regionInfoList;
// 				html+='<li>'
// 				html+='<span class="mask_left" data-id="'+data[i].id+'">'+data[i].name+'</span>';
// 				for(var j = 0;j<regionInfo.length;j++){
// 					html+='<i class="mask_right">'+regionInfo[j].name+'</i>'
// 				}
// 				html+='</li>'
// 			}
// 			$('.mask_ul').html(html);
// 		}
// 	})
// }
// findArea();


// var _province;
// var _city;
// $('.mask_ul').delegate('.mask_left','click',function(){
// 	  $(this).addClass('tab_list_active').parent().siblings().find('.mask_left').removeClass('tab_list_active');
// 	_province = $(this).text();
// 	console.log(_province)
// 	$('.province').html(_province)
// })
// $('.mask_ul').delegate('.mask_right','click',function(){
// 	  $(this).addClass('tab_i_active').parent().siblings().find('.mask_right').removeClass('tab_i_active');
// 	   $(this).addClass('tab_i_active').siblings().removeClass('tab_i_active');
// 		_city = $(this).text();
// 	console.log(_city)
// 	$('.city').html(_city)
// })
// $('.btn-close').click(function(){
// 	$('.mask').hide();
// 	if ($('.province').html()!=='' && $('.city').html()!=='') {
// 		 $('#test').show();
// 	   searchPage();	
// 	}

// })




/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */
//var localhost = getBaseUrl('t');
//var localhost = 'http://172.16.34.227:8007';
var listSp_url = localHttp +'/goods/sku/operator/shelfList';
var lockStore= localHttp+'/goods/sku/operator/lock';
var unLockStore = localHttp+'/goods/sku/operator/unLock';

var pagination = new Pagination(listSp_url, "page", function (data) {
    fillTableData(data)
});
var _nowPage = 1;


function searchPage(page) {//首次两参进入
    pagination.search(getParams(), page);
}

function searchNowPage() {//首次两参进入
    var a;
    a = pagination.returnParams();
    _nowPage = a.currentPageNo;
    debugger;
};
var  reg=/^\+?[1-9][0-9]*$/;
/** 得到搜索条件的json对象 */
function getParams() {
    _pageSize = +$('.pageSize_switch').val();
    _lcid = $(".moldKind_switch_active ").data("lcid");
    //_brandId = $(".moldBrand_switch_active ").data("bcid");
    _brandId = $('.moldBrand_switch_active').data('bcid');
    _modeldId = $(".moldType_switch_active ").data("modeid");
    _keyWord = $('.number').val();
    console.log(_lcid)
    // _type = $(".moldType_active").data("type");
    var params = {
        'pageSize': _pageSize//容积页码
    };

    if (_lcid != 'lcidAll' &&_lcid != undefined ) {
        params.lcids = _lcid;
    }
    if (_brandId != 'bcidAll' && _brandId != undefined ) {
        params.brandId = _brandId;
    }
    if (_modeldId != 'modelidAll' && _modeldId != undefined){
        params.type = _modeldId;
    }
    if (reg.test($('.number').val()) == true && _modeldId != undefined && _lcid != undefined && _brandId != undefined ) {
        params.number=_keyWord;
    }else if(reg.test($('.number').val()) == false && _modeldId != undefined && _lcid != undefined && _brandId != undefined){
        params.keyWord=_keyWord
    }

    return params
}

/** table数据 */
function fillTableData(data){
    console.log(data);
    //判断没数据时 显示与隐藏
    if (data.length == 0) {   //没有资源时
        //$(".moldMerge").hide();
        $("#pic_no").show();
        $("#table_data").hide();
        $(".leftBottom").hide();
    } else {
        //$(".moldMerge").show();
        $("#pic_no").hide();
        $("#table_data").show();
        $(".leftBottom").show();
        console.log(data);
        var tr = "tr";
        var content = $("#table_data tbody");
        content.html("");
        var html = '';
        //<span>'+data[i].sysName+'</span>
        for (var i = 0; i < data.length; i++) {       	
            html+='<tr>'
            if (data[i].showName!='') {
                html+='<td><img src="'+data[i].pics[0].pic+'" class="pics"/><span>'+data[i].showName+'</span></td>'  //商品信息
            }else if (data[i].sysName!=''){
                 html+='<td><img src="'+data[i].pics[0].pic+'" class="pics"/><span>'+data[i].sysName+'</span></td>'  //商品信息
            }
            
            html+='<td>'+data[i].number+'</td>' //商品编码
            if(data[i].goodsService ==undefined){
                 html+='<td>暂无</td>'
            }else{
                html+='<td>'+data[i].goodsService.goodsType+'</td>'//商品类型
            }

            html+='<td>'+data[i].price+'</td>'//商品售价
            html+='<td>'+ getNowFormatDate(data[i].createTime)+'</td>' //上新时间
            html+='<td>'+Paramstate(data[i].state)+'</td>'//商品状态
            html+='<td class="fonze" data-id="'+data[i].id+'"><a href="./view_detail.html?id='+data[i].id+'">查看</a><span onclick="closeGoods(this)" style="color:#337ab7">'+State(data[i].state)+'</span></td>' //操作
            //html+='<td class="fonze" data-id="'+data[i].id+'"><a href="./view_detail.html?id='+data[i].id+'&city='+_city+'">查看</a><a href="./onSale_info.html?id='+data[i].id+'&city='+_city+'">在售信息</a><span onclick="closeGoods(this)">'+State(data[i].state)+'</span></td>' //操作
            html+='</tr>'
        }
         content.append(html)    
    }
        
}


function Paramstate(params){
   str='';
   if (params ==0) {
   	  str='在售'
   }else if (params ==1) {
   	   str+='锁定'
   }
   return str;
}
function State(params){
   str='';
   if (params ==0) {
   	  str='商品锁定'
   }else{
   	   str+='商品解锁'
   }
   return str;
}


function closeGoods(obj){
    var $this = $(obj);
    var id = $this.parent().attr('data-id');
    console.log(id); 
    var text = $this.text();
    console.log(text);
    if (text =='商品锁定') {
        $(".index_mask", parent.document).show();
        var html = template('ajax_alert', {});
        $.popwin(html, {
            title: '锁定后，商品将无法在应用平台进行交易，是否确认该操作？',
            fixed: true,
            drag: false, //是否可拖拽
        });
        $("#popwin_Close").on("click", function () {
            $("#popwin_Blank").remove();
            $("#popwin_Out").remove();
            $(".index_mask", parent.document).hide();

        })

        $("#popwin_Out").addClass("attr_manag_add");
        $.popwin.setPosition(410, 560);
        $(".mask_ok").click(function() {
            $.ajax({
                type: "post",
                url: lockStore,
                dataType: "json",
                data: {id: id},
                success: function (data) {
                    console.log(data);
                    if (data.success == true) {
                        //alert(data.message);
                        $("#popwin_Blank").remove();
                        $("#popwin_Out").remove();
                        $(".index_mask", parent.document).hide();
                        window.location.reload();
                        // searchNowPage(_nowPage)
                        // searchPage()

                    } else {
                        alert("锁定失败！")
                    }

                },
                error: function () {
                    console.log(12334)
                }

            })
        })
    }else{
        $(".index_mask", parent.document).show();
        var html = template('ajax_alert', {});
        $.popwin(html, {
            title: '解锁后将恢复商品在平台的交易权利，是否确认该操作？',
            fixed: true,
            drag: false, //是否可拖拽
        });
        $("#popwin_Out").addClass("attr_manag_add");
        $.popwin.setPosition(410, 560);
        $(".mask_ok").click(function(){
    	$.ajax({
    		type:"post",
		    url: unLockStore,
		    dataType: "json",
		    data:{id:id},
		    success: function (data) {
		        console.log(data);
		        if (data.success==true) {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask", parent.document).hide();
		        	 //alert(data.message);
		        	 window.location.reload();
    				 // searchNowPage(_nowPage)
    				 // searchPage()
		        	 
		        }else{
		        	alert("解锁失败！")
		        }
	    
		    },
		    error: function () {
                console.log(12334)
		    }

    	})
        })
    }
}

$('.addBtn').click(function () {
    getParams();
    searchNowPage();
    searchPage(_nowPage);

})
function clickFalse(){
    $("#popwin_Blank").hide();
    $("#popwin_Out").hide();
    $(".index_mask", parent.document).hide();
}