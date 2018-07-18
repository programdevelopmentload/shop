
var localHost = "http://172.16.44.132:8002";
var regionUrl = localHost+'/order/measuretemplet/select';
var delbyid = localHost +'/order/measuretemplet/delbyid'; //删除本行
//var selectUrl = localHost+'/measurecost/select';

function type(prames){
    var str = '';
    if (prames == 1) {
         str +='橱柜' 
    }else if(prames == 2){
        str +='布艺'
    }else if(prames == 3){
        str +='家具'
    }else{
       str +='木门' 
    }
    return str;
}

function fillTableData(){
    $.ajax({
        url:regionUrl,
        type:'post',
        dataType:'json',
        success:function(data){
            console.log(data.data);
            var data = data.data
            var html='';
            for(var i = 0;i<data.length;i++){
                html+='<tr>';
                html+='<td>'+data[i].name+'</td>';
                html+='<td>'+type(data[i].name)+'</td>';
                html+='<td>'+data[i].createTime+'</td>';
                if(data[i].url==null){
                    html+='<td data-id="'+data[i].id+'"><a href="javascript:void(0);">预览</a>    <a href="javascript:void(0)" onclick="deleteList(this)">删除</a></td>'
                }else{
                    html+='<td data-id="'+data[i].id+'"><a href="'+data[i].url+'">预览</a>    <a href="javascript:void(0)" onclick="deleteList(this)">删除</a></td>'
                }

                html+='</tr>'
            }
            $('.counts').html(html)
        }
    })
}
fillTableData();







//删除
function deleteList(obj){
    var $this = $(obj);
    var id = $this.parent().attr('data-id');
    console.log(id)
    $.ajax({
        url:delbyid,
        dataType:'json',
        type:'post',
        data:{id:id},
        success:function(data){
             if (data.success==true) {
                 alert('删除成功！');
                 window.location.reload();
             }
        }
    })
}

