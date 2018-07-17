
//var localHost = "http://172.16.40.239:8008";
//var localHost='http://172.16.40.153:8002/area';
var localHost=getBaseUrl('ys');//袁帅
//var localHost='http://172.16.38.206:8008'
var regionUrl = localHost+'/region/findSelectToRegion';


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
      url:regionUrl,
      dataType:'json',
      success:function(data){
        console.log(data);
        var  regionInfo= data.data.regionInfo;
        var selected =data.data.selected;
        console.log(selected);
           var html='';
           html+=' <div class="area_line clearfix"> <div class="area_right fl"><ul class="clearfix listul">'
           for(var i=0;i<regionInfo.length;i++){
           html+='<li><label><input type="checkbox" area="'+regionInfo[i].id+'" class="inputs"> <span>'+regionInfo[i].name+'</span></label><i class="totle">(0)</i><p class="trigger" onclick="trigger(this)"></p><div class="trigger_click">'
            html+='<ul class="clearfix" class="uls">';
            for(var j=0;j<regionInfo[i].regionInfoList.length;j++){
             // console.log(regionInfo[i].regionInfoList[j].id)
                html+=' <p><label><input type="checkbox" area="'+regionInfo[i].regionInfoList[j].id+'">'+regionInfo[i].regionInfoList[j].name+'</label></p>'
            }
               html+='</ul><label class="close1">关闭</label></div></li>';
              
            
        }   
           html+=' </ul></div> ';
           $('#area').html(html);
           $('.close1').click(function(){
                $(this).parent().toggle();

           });

           $.each($("[area]"), function(i,v) {
                for(var a=0;a<selected.length;a++){
                    if(selected[a].id  == $(v).attr('area')){
                        $(v).prop('checked',true).addClass('checked').addClass('checked1');
                        $(v).parents('.trigger_click').siblings().find('input').prop('checked',true);
                        $(v).attr('disabled',true);
                        checkedlength($(v));
                    }
                };
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



//var localHost='http://172.16.40.239:8008';
var addSelectServerRegion = localHost+'/region/addSelectServerRegion';
$('#addBtn').click(function(){
        var regionInfoArr=[];
        var regionInfo=[];
        var arr = [];
        var Inx = 0; //这个是因为获取不到索引0 not.checked1 是从已有选项开始计算
        $.each($('.trigger_click').siblings('label').find('input:checked'), function(i,v) {
         if($(v).parent().siblings('.trigger_click').find('.checked').not('.checked1').length  > 0){
          console.log('带默认项与其他的添加  并且找到选择的市区',$(v).parent().text());
           regionInfo[Inx] = {  //省份
              'name':$(v).parent().text(),
              'id':$(v).attr('area'),
              'regionInfoList':[]
              };
          console.log(Inx)
          regionInfoArr = [];
           $.each($(v).parent().siblings('.trigger_click').find('.checked').not('.checked1'), function(x,y) {
            regionInfoArr[x] = {  //市区
             'name':$(y).parent().text(),
             'id':$(y).attr('area')
            };
            regionInfo[Inx]['regionInfoList'] = regionInfoArr;
           });
           Inx++;
           console.log(regionInfo)//这个是生成最终数据
          
         }else{
          console.log('只有默认项的省份不添加',$(v).parent().text());
         }
        });
         $.ajax({
               type:'post',
               contentType:'application/json;charest=UTF-8',
               url:addSelectServerRegion,
               data:JSON.stringify(regionInfo),
               dataType:'json',
               success:function(data){
                   console.log(data);
                   alert('新增区域成功！')
                   window.location.reload();
               },
               error:function(data){
                  //console.log(data);
                   alert('请选择正确的省和市！')
               }
           })
   })