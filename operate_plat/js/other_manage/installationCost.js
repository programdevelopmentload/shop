var localHttp = 'http://172.16.38.21:8007';
var showAllInstallCost =localHttp +'/goods/service/cost/showAllInstallCost';

var iden;
function InstallCost() {
	$.ajax({
		type:'post',
		dataType:'json',
		url:showAllInstallCost,
		success:function(data){
			
			var data = data.data;
			console.log(data);
		    var html='';
		    if(data != null){


		    for (var i = 0; i < data.length; i++) {
		    	var vos=data[i].vos;
		    	console.log(vos)
		    	html+='<tr>';
		    	html+='<td>'+data[i].cityName+'</td>';
		    	html+='<td>'+data[i].serviceDetailsName+'</td>';
		    	for (var j = 0; j < vos.length; j++) {
		    		 iden=vos[j].iden;
		    		 console.log(iden);
		    		var price = vos[j].leafClassIdAndPrice
		    		html+='<td>'+vos[j].secondClassName+'</td>';
		    		html+='<td>'+vos[j].unit+'</td>';
		    		html+='<td>'
 					for (var z = 0; z < price.length; z++) {
 						 html+='<p>'
 						 html+='<span style="margin-right:20px">'+price[z].leafClassName+'</span>'  
 						 html+='<span>'+price[z].price+'</span>'
 						 html+='</p>'
 					}
 					html+='</td>'
		    	}
		    	html+='<td><a href="./addCose_editor.html?id='+iden+' ">费用编辑</a></td>'
		    	html+='</tr>';
		    	}
                $('.count').html(html)
            }else{
                $('.count').html('暂无数据！')
			}
			

		}
	})
}

InstallCost()