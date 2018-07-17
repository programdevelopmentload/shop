var localHttp='http://172.16.38.137:8007';
var listUrl=localHttp+'/goods/pattern/operator/freight/list';
function  freightModel() {
    $.ajax({
        url:listUrl,
        dataType:'json',
        type:"post",
        success:function (data) {
            var data = data.data;
            console.log(data);
            var html='';
            for (var i=0;i<data.length;i++){
                var  goodsFreight = data[i].goodsFreightCostDetails;
                console.log(goodsFreight)
                html+='<tr>';
                html+='<td>'+data[i].orderPrice+'</td>';
                html+='<td>--</td>';
                html+='<td>'+isfree(data[i].isFree)+'</td>';
                html+='<td colspan="2" class="spc">';
                for (var j =0;j<goodsFreight.length;j++){
                     html+='<p>'
                     if(goodsFreight[j].cityName == undefined) {
                        html+='<span>暂无数据</span>'
                     }else{
                      html+='<span>'+goodsFreight[j].cityName+'</span>'
                     }
                     
                     html+='<span>'+goodsFreight[j].freightPrice+'</span>'
                    html+='</p>'
                }
                html+='</td>'
                html+='<td><a data-id="'+data[i].id+'" href="javascript:;">费用编辑</a></td>'
                html+='</tr>';
            }
            $('.count').html(html)
        }
    })
}
freightModel();
function  isfree(perams) {
   var str='';
   if (perams == 0){
       str+='全品类';
   }else if(perams == 1){
       str+='全品类（特殊商品除外)';
   }else if(perams == 2){
       str+='特殊商品';
   }
   return str
}