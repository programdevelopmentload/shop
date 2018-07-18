//http://172.16.38.142:8010/messageserver/toAddUpgrades

http://172.16.38.142:8010/messageserver/Channel
var localHttp = 'http://172.16.36.131:8010';
var toAddUp = localHttp +'/messageserver/toAddUpgrades';
var channel= localHttp+'/messageserver/Channel';



//更新渠道获取到 渠道和地址
var obj ={};
var downloadChanneel =[];
var version;
var osType;
var forcee;
$('input[name="ios"]').click(function(){
    osType = Number($(this).val());
	obj.osType = osType;
	console.log(obj.osType +'客户端');
	$.ajax({
        url:channel,
		dataType:'json',
		type:'post',
		data:{osType:osType},
		success:function (data) {
            if(osType ==1){
            	console.log(data);
            	var data = data.data;
            	console.log(data)
            	var html =''
            	for (var i= 0;i<data.length;i++){
 					html+="<div class='mt'><label>"+data[i].downloadChannel+"</label><input type='text'  placeholder='请输入渠道url地址' class='form-control url'></div>";

				}

				$('.qd').html(html);
			}else if(osType ==2){
                console.log(data);
                var data = data.data;
                console.log(data)
                var html =''
                for (var i= 0;i<data.length;i++){
                    html+="<div class='mt'><label>"+data[i].downloadChannel+"</label><input type='text'  placeholder='请输入渠道url地址' class='form-control url'></div>";

                }

                $('.qd').html(html);
			}
        }

	})
})
//获取更新
$('input[name="update"]').click(function(){ 
	console.log($(this).val())
	obj.forcee = Number($(this).val());
	if (forcee == 1) {
		 $('.tipsred').show();
	}else{
		$('.tipsred').hide();
	}
})

//判断版本id
$('.versionID').change(function () {
    var appType = $('.versionID').val();
    var rex = /^[0-9]*$/;
    console.log(appType)
    if (rex.test(appType) == false){
        alert('请输入正确的版本ID号！');
        return false
    }
})
//获取downloadChannel

function addBtn(){
	//获取版本号
	//获取版本号id
	 var appType = $('.versionID').val();
     var version = $('.version').val();
	 obj.version = version;
	 obj.appType = appType;
	//获取更新说明
	 obj.remarks = $('.remarks').val();
	// var mtLength =$('qd').find($('.mt'));
	$('.mt label').each(function(){
		// console.log($(this).text())
		var urlObj ={}; 
	  	 urlObj.downloadChannel = $(this).text();
	  	 urlObj.url = $(this).siblings('input').val();
        downloadChanneel.push(urlObj)

	  }) 
	    obj.downloadChanneel = downloadChanneel
		console.log(obj)

		console.log(version);
		var reg = /^[0-9]\d?(\.(0|[1-9]\d?)){2}$/;
		//reg.test(version);
		//console.log(reg.test(version))
		if (reg.test(version) == false){
			alert('请输入正确的版本号！');
			return false
		}else{
            $.ajax({
                headers:{
                    'Accept':'application/json',
                    'Content-Type':'application/json'
                },
                type:'post',
                dataType:'json',
                url:toAddUp,
                data:JSON.stringify(obj),
                success:function(data){
                	alert(data.message);
                    console.log(data.message)
                },
                error:function(){
                    console.log(34242)
                }

            })
		}


}
