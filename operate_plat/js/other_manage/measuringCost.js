

var localHttp ='http://172.16.38.185:8002';
var selectUrl = localHttp+'/order/measurecost/select';
var saveUrl= localHttp+'/order/measurecost/save';

function fillTableData(){
    $.ajax({
        url:selectUrl,
        type:'post',
        dataType:'json',
        success:function(data){
            console.log(data.data);
            var data = data.data
            var html='';
            for (var i = 0; i < data.length; i++) {
            	var dataVal =data[i].value;
            	html+='<tr>';
            	html+='<td style="border-right: 1px solid #ccc;">'+data[i].key+'</td>';
            	html+='<td colspan="3">';
            	for (var j = 0; j < dataVal.length; j++) {
            		 html+='<p>';
            		 html+='<span data-cityId = "'+dataVal[j].cityId+'" class="cityId">'+dataVal[j].cityName+'</span>'
                     if (dataVal[j].value!=undefined) {
                         html+='<span ><input type="text" value="'+dataVal[j].value+' " class="form-control"></span>'
                     }else{
                        html+='<span ><input type="text" value=" " class="form-control"></span>'
                     }
                    if (dataVal[j].id !=undefined) {
                        html+='<span data-id="'+dataVal[j].id+'"  onclick="addSave(this)">保存</span>'
                    }else{
                        html+='<span data-id="" onclick="addSave(this)">保存</span>'
                    }
            		 
            		 html+='</p>'
            	}
            	html+='</td>';
            	html+='</tr>'
            }

           $('.counts').html(html)
        }
    })
}
fillTableData();
function addSave(obj){
    var $this = $(obj);
    var id = $this.attr('data-id');
      var regionId =$this.siblings('.cityId').attr('data-cityId');
      var value=$this.siblings().find('input').val();
      console.log(id + '  '+regionId + '  '+value);

            $.ajax({
             url:saveUrl,
             dataType:'json',
             type:'post',
             data:{
                id:id,
                value:value,
                regionId:regionId
             },
             success:function(data){
               alert(data.message)
               window.location.reload();
               console.log(data)

             },
             error:function(data){
                console.log(data);
             }
        })

      
}