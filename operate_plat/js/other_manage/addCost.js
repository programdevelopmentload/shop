//渲染安装类型
//var localHttp='http://172.16.44.127:8007'; //王宣
var localHttp='http://172.16.38.21:8007';
var showUrl=localHttp +'/goods/service/cost/showServiceDetailsInstall';
var showInitInstallPage = localHttp+'/goods/service/cost/showInitInstallPage';
var addInstallCost = localHttp+'/goods/service/cost/addInstallCost' //点击确认提交数据

var localHost ='http://172.16.38.206:8008';  //元帅
var areaUrl=localHost+'/region/findSelectServerReg'


function showAll() {
	$.ajax({
		url:showUrl,
		dataType:'json',
		type:'post',
		data:{type:1},//固定写死
		success:function(data){
			//console.log(data)
			var html='';
			html+='<option>请选择</option>'
			for (var i = 0; i < data.data.length; i++) {
				html+='<option value="'+data.data[i].id+'">'+data.data[i].serviceDetailsName+'</option>'
			}
            $('.installType').html(html)
           
		}
	})

}
$('.installType').change(function(){
	tableInstall();
})
showAll()

// 服务区域
function trigger(a){
      $(a).next().toggle();
   }
// 渲染页面 
function checkedlength(t){
    var $this = t;
    var Iput = $this.parent().parent().parent().find('p');
    var Icheck =  $this.parent().parent().parent().find('.checked');
    var parentName =  $this.parents('.trigger_click').siblings().find('span').text();
    var parentId = $this.parents('.trigger_click').siblings().find('input').attr('area');
    $this.parent().parents('li').find('i').css('color','red');
    $this.parent().parents('li').find('i').html('('+Icheck.length+')');

    //console.log(parentId + parentName)
    //console.log( $this.parents('.trigger_click').siblings().find('span').text(),Iput.length,Icheck.length);
            if(Icheck.length === 0){
//                          console.log('没有被选中的');
                $this.parents('.trigger_click').siblings().find('input').prop('checked',false);
                $this.parents('.trigger_click').siblings().find('input').prop('disabled',false);
            }else if(Icheck.length === Iput.length){
//                          console.log('被全选了');
                $this.parents('.trigger_click').siblings().find('input').prop('checked',true);
                $this.parents('.trigger_click').siblings().find('input').prop('disabled',true);
            }else{
//                          console.log('正常点选');
                $this.parents('.trigger_click').siblings().find('input').prop('checked',true);
                $this.parents('.trigger_click').siblings().find('input').prop('disabled',false);
            };
}


function jsonData() {
   $.ajax({
      type:'post',
      //url:regionUrl,
       url:areaUrl,
      dataType:'json',
      success:function(data){
        console.log(data);
        var  regionInfo= data.data;
        //var selected =data.data.selected;
       //console.log(selected);
           var html='';
           html+=' <div class="area_line clearfix"> <div class="area_right"><ul class="clearfix listul">'
           for(var i=0;i<regionInfo.length;i++){
           html+='<li><label><input type="checkbox" area="'+regionInfo[i].id+'" class="inputs"> <span>'+regionInfo[i].name+'</span></label><i class="totle">(0)</i><p class="trigger" onclick="trigger(this)"></p><div class="trigger_click">'
            html+='<ul class="clearfix" class="uls">';
            for(var j=0;j<regionInfo[i].regionInfoList.length;j++){
              //console.log(regionInfo[i].regionInfoList[j].id)
                html+=' <p><label><input type="checkbox" area="'+regionInfo[i].regionInfoList[j].id+'">'+regionInfo[i].regionInfoList[j].name+'</label></p>'
            }
               html+='</ul><label class="close1">关闭</label></div></li>';
        }   
           html+=' </ul></div> ';
           $('#area').html(html);
           $('.close1').click(function(){
                $(this).parent().toggle();

           });
           $('.trigger_click input').on('click',function(){
                    var $this = $(this);
                    
                    if($this.hasClass('checked')){
                        $this.removeClass('checked');
                    }else{
                        $this.addClass('checked');
                    };
                    checkedlength($this);
           });
      },
      error:function(){
        console.log('dadas')
      }
   })
           
}
jsonData();

// 费用设置渲染
function tableInstall(){
	var serviceDetailsId = $('.installType option:selected').val();
	console.log(serviceDetailsId)
	$.ajax({
		url:showInitInstallPage,
        //url:'../../html/other_manage/json.json',
		dataType:'json',
		type:'post',
		data:{serviceDetailsId:serviceDetailsId},
		success:function(data){
          console.log(data);
		  var data= data.data.vos;
		  //console.log(data);
          var html='';
          for (var i = 0; i < data.length; i++) {
          	var dataVos = data[i].leafClassIdAndPrice
          	 //console.log(dataVos)
          	 html+='<tr class="costTr">'
          	 html+='<td colspan="2" class="form-inline secondClass"><span data-id="'+data[i].secondClassId+'">'+data[i].secondClassName+'</span>   <input type="text" class="form-control"></td>';
          	 html+='<td class="form-inline leafClass">'
          	 for (var j = 0; j < dataVos.length; j++) {
                 html += '<p><span data-id="' + dataVos[j].leafClassId + '">' + dataVos[j].leafClassName + '</span><input type="text" class="form-control"></p>'
             }
          	 html+='</td>'
          	 html+='</tr>'
          }
          $('.count').html(html)
		}
	})
}
//tableInstall();

$('#addInstall').click(function(){
    var obj={};
    obj.serviceDetailsId = $('.installType option:selected').val();
    var regionInfo=[];
    var arr = [];
    var cityCode =[];
    var vos=[];

    var Inx = 0; //这个是因为获取不到索引0 not.checked1 是从已有选项开始计算
    $.each($('.trigger_click').siblings('label').find('input:checked'), function(i,v) {
        if($(v).parent().siblings('.trigger_click').find('.checked').not('.checked1').length  > 0){
           console.log('带默认项与其他的添加  并且找到选择的市区',$(v).parent().text());
           regionInfo[Inx] = {  //省份
              'name':$(v).parent().text(),
              'id':$(v).attr('area')
              };
           console.log(Inx)
          regionInfoArr = [];
           $.each($(v).parent().siblings('.trigger_click').find('.checked').not('.checked1'), function(x,y) {
            cityCode.push($(y).attr('area'))
           });
     		   console.log(cityCode)
			     Inx++;
         }else{
          console.log('只有默认项的省份不添加',$(v).parent().text());
         }
        });
        obj.cityCode=cityCode;
        $.each($('.costTr'),function (i,v) {
            var obj2={};
            var leafClassIdAndPrice =[];
            $.each($(v).find('.secondClass'),function () {

                obj2.secondClassId=$(this).find('span').attr('data-id');
                obj2.unit=$(this).find('input').val();

            })
            $.each($(v).find('.leafClass p'),function () {

                var leaf={};
                leaf.leafClassId= $(this).find('span').attr('data-id');
                leaf.price=$(this).find('input').val();
                console.log(leaf);
                leafClassIdAndPrice.push(leaf)

            })

            obj2.leafClassIdAndPrice=leafClassIdAndPrice;
            vos.push(obj2)

            obj.vos = vos;
            console.log(obj)
        })

	$.ajax({
        contentType:'application/json;charest=UTF-8',
		url:addInstallCost,
		type:'post',
		dataType:'json',
        data:JSON.stringify(obj),
		success:function(data){
			console.log(data)
		}
	})
})
