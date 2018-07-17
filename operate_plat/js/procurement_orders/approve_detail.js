
var renameFlag = false;
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    //模拟按钮事件绑定
    searchPage();
});

/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */

var localhost = 'http://172.16.39.70:8005';
var approve_detail = localhost +'/purchase/order/manager/list'

var pagination = new Pagination(approve_detail, "page", function (data) {
    fillTableData(data)
});

function searchPage(page) {//首次两参进入
    pagination.search(getParams(), page);
}

/** 得到搜索条件的json对象 */
function getParams() { 
   var purchase_num = $("#purchase_num").val();//获取订单编号
   var proudce_name = $("#proudce_name").val();//获取商品名称
    var params = {
        'pageSize': 2,
        'orderNum':purchase_num,
        'goodsName':proudce_name,
        'type':1
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
                    doc +='<tr>'+'<td colspan="11" style="text-align:left;line-height:35px">'+'订单编号'+':'+data[i].orderNum + '</td>' +'</tr>';
                    doc +='<tr>'
                    doc+='<td>'
                    for (var j = 0; j < purchaseOrderGoods.length; j++) {                  
                        doc+='<span>'+' <img src="'+purchaseOrderGoods[j].picture +'"/>'+ purchaseOrderGoods[j].goodsType+'</span>'; 
                    }
                    doc +='</td>';

                    doc +='<td colspan="3">'
                    for (var z = 0; z < purchaseOrderGoods.length; z++) {
                        var pps = purchaseOrderGoods[z].purchaseOrderSuppliers;
                         for (var h = 0; h < pps.length; h++) {
                              doc+='<span>'+'<i style="display:inline-block;width:151px;margin-left:-6px">'+pps[h].supplier +'</i> '+'<i style="width:81px;display:inline-block">*'+pps[h].count+'</i>'+'<i style="display:inline-block;width:84px">¥'+pps[h].price +'</i>'+'</span>'
                         }
                    }
                    doc +='</td>'
                    doc+='<td colspan="2">'
                    for(var g=0;g<purchaseOrderGoods.length; g++){
                         doc+='<span>'+'<i style="display:inline-block;width:65px;margin-left:-33px">'+purchaseOrderGoods[g].totalCount+'</i>'+'*'+purchaseOrderGoods[g].totalPrice+'</span>'

                    }
                    doc+='</td>'
                    // doc+='<td>'+data[i].totalCount+'</td>'
                    // doc+='<td>'+data[i].totalPrice+'</td>'
                    doc+='<td>'+data[i].createTime+'</td>'
                    doc+='<td>'+data[i].shopAddress+data[i].shopName+'</td>'
                    doc+='<td>'+data[i].creator+'</td>'//采购人员
                    doc+='<td>'+data[i].region+'</td>'//所属区域
                    doc+='<td>' + '<a class="approve_agree" data-id="' + data[i].id +'" data-status="' + data[i].managerIsPass +'"  > '+data[i].managerIsPass+'</a>' + '<a class="approve_agree_detail"   title="'+data[i].managerReason+' ">查看原因</a>'+'</td>'
                    doc+='</tr>'
                }
               
            }
            content.append(doc)
              //获取操作的状态值
            var  dataStatus = $(".approve_agree").attr("data-status");
            console.log(dataStatus)
            if (dataStatus == "false") {
                $(".approve_agree").text('已拒绝').addClass("approve_refuse").removeClass("approve_agree");
                $(".approve_agree_detail").show();
            }else if (dataStatus == 1) {
                 $(".approve_agree").text('已通过').addClass("approve_agree").removeClass("approve_refuse")
            }
}

  



