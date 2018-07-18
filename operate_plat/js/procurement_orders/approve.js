
var renameFlag = false;
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
$.sidebarMenu($('.sidebar-menu'));
//模拟按钮事件绑定
$('.yycon').on('click','.approve_success',function(){
    let html = template('test_mask_catch',{});
    $.popwin(html,{
        title: '确定要同意本次采购吗',
        fixed: true,
        drag: false, //是否可拖拽
    });
    $("#popwin_Out").addClass("mask_control");
    // $.popwin.setPosition(410,460);
})
//弹窗中取消按钮事件绑定
$('body').on('click','.mask_false',function(){
    $("#popwin_Blank").remove();
    $("#popwin_Out").remove();
})

// 取消绑定事件二
$(".approve_false").click(function(){
        $(".mask_two").show();
   })
   $(".approve_closebtn").click(function(){
        $(".mask_two").hide();
   })
$(function () {
    //模拟按钮事件绑定
    searchPage();
});


var _nowPage = 1

/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */
//分页 
var localhost = 'http://172.16.39.70:8005';
var approve = localhost+'/purchase/order/manager/list';

var pagination = new Pagination(approve, "page", function (data) {
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
   var purchase_num = $("#purchase_num").val();//获取订单编号
   var proudce_name = $("#proudce_name").val();//获取商品名称
   var params = {
        'pageSize': 2,
        'orderNum':purchase_num,
        'goodsName':proudce_name,
        'type':0
        };
    return params;
};


/** table数据 */
function fillTableData(data){
    console.log(data);
            var tr = "tr";
            var content = $("#table_data tbody");
            content.html("");
            var doc = '';
            for (var i = 0; i < data.length; i++) {
                if (data[i].flag!=0) {
                    var purchaseOrderGoods = data[i].purchaseOrderGoods;
                    //console.log(bashChecksLen.length)
                    //订单顶层id信息，订单编号
                    doc +='<tr>'+'<td colspan="11" style="text-align:left;line-height:35px">'+'订单编号'+':'+data[i].orderNum + '</td>' +'</tr>';
                    doc +='<tr>'
                    doc+='<td>'
                    for (var j = 0; j < purchaseOrderGoods.length; j++) {
                        //左侧图片区域
                        doc+='<span>'+' <img src="'+purchaseOrderGoods[j].picture +'"/>'+ purchaseOrderGoods[j].goodsType+'</span>'; 
                    }
                    doc +='</td>';

                    doc +='<td colspan="3">'
                    for (var z = 0; z < purchaseOrderGoods.length; z++) {
                        var pps = purchaseOrderGoods[z].purchaseOrderSuppliers;
                         for (var h = 0; h < pps.length; h++) {
                             //蓝翔家居，价格，数量
                              doc+='<span>'+'<i style="display:inline-block;width:151px;margin-left:-6px">'+pps[h].supplier +'</i> '+'<i style="width:81px;display:inline-block">*'+pps[h].count+'</i>'+'<i style="display:inline-block;width:84px">¥'+pps[h].price +'</i>'+'</span>'
                         }
                    }
                    doc +='</td>'
                    doc+='<td colspan="2">'
                    for(var g=0;g<purchaseOrderGoods.length; g++){
                        //左侧图片对应的数量，价格
                         doc+='<span>'+'<i style="display:inline-block;width:65px;margin-left:-33px">'+purchaseOrderGoods[g].totalCount+'</i>'+'*'+purchaseOrderGoods[g].totalPrice+'</span>'

                    }
                    doc+='</td>'
                    // doc+='<td>'+data[i].totalCount+'</td>'
                    // doc+='<td>'+data[i].totalPrice+'</td>'
                    //下单时间
                    doc+='<td>'+data[i].createTime+'</td>'
                    //店铺地址，店铺名称
                    doc+='<td>'+data[i].shopAddress+data[i].shopName+'</td>'
                    doc+='<td>'+data[i].creator+'</td>'//采购人员
                    doc+='<td>'+data[i].region+'</td>'//所属区域
                    doc+='<td>' + '<a class="approve_agree" data-id="' + data[i].id + '" data-status="0" data-orderNum ="'+ data[i].orderNum+'">同意操作</a> '+ '<a class="approve_refuse" data-id="' + data[i].id + '" data-status="1" data-orderNum ="'+ data[i].orderNum+'">拒绝操作</a> '+'</td>'
                    doc+='</tr>'
                }
               
            }
            content.append(doc)
}
 //点击否关闭遮罩层
    $('body').on('click','.mask_false',function(){
        $("#popwin_Blank").remove();
        $("#popwin_Out").remove();
    })
     
     // 取消绑定事件二
       $(".approve_false").click(function(){
            $(".mask_two").show();
       })
       $(".approve_closebtn").click(function(){
            $(".mask_two").hide();
            
       })

    //点击同意审核弹出第一个遮罩层
    $("#table_data").delegate(".approve_agree",'click',function(){
            let html = template('test_mask_catch',{});
            $.popwin(html,{
                title: '确定要同意本次采购吗',
                fixed: true,
                drag: false, //是否可拖拽
            });
            $("#popwin_Out").addClass("mask_control");
            $(".mask_ok").click(function(){
                var url= "http://172.16.39.70:8005/purchase/order/manager/auditing";
                var orderNum =  $('.approve_agree').attr('data-orderNum') //获取当前订单编号
                console.log(orderNum)
                //var orderNum = $.trim($("#purchase_num").val()); //获取当前订单编号
                var status = $('.approve_agree').attr('data-status'); //获取状态
                var params = {orderNum: orderNum,status:status}
                    $.ajax({

                        type: "post",
                        url:url,
                        dataType: "json",
                        data:params,
                        success:function(data){
                               debugger;
                              //console.log(data);                   
                                alert('审核通过了哦!');
                                $("#popwin_Blank").remove();
                                $("#popwin_Out").remove();
                                $("#purchase_num").val('');
                                searchNowPage(_nowPage)
                                searchPage();

                        }

                    })
                
            })
    })

    // 点击拒绝弹出第二个遮罩层
    $("#table_data").delegate(".approve_refuse",'click',function(){
            var url= "http://172.16.39.70:8005/purchase/order/manager/auditing";
            var orderNum =  $('.approve_agree').attr('data-orderNum') //获取当前订单编号
            var status = $('.approve_refuse').attr('data-status'); //获取状态
            $(".mask_two").show();
            $(".approve_decision span:nth-of-type(2)").click(function(){
                var reason = $.trim($('#approve_reason').val()); //拒绝原因;
                //console.log(reason)
                var params = {orderNum:orderNum,status:status,reason:reason};
                if (reason=='') {
                    $(".error").text('拒绝原因不能为空，请重新填写！')
                }else{
                    $(".error").text('');
                    $.ajax({
                         type:'post',
                         url:url,
                         dataType: "json",
                         data:params,
                         success:function(data){
                            alert('拒绝审核通过！');
                            $(".mask_two").hide();
                            searchNowPage(_nowPage)
                            searchPage();
                         }
                    })
                }
            })
            
     })   

// 点击查询 
$("#approve_search").click(function(){
    searchNowPage(_nowPage)
    searchPage();
})

