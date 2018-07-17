var localHttp = 'http://172.16.38.21:8007';
//var idenUrl = localHttp +'/goods/service/cost/findByIden';    //所有的回现
//var showUrl=localHttp +'/goods/service/cost/showServiceDetailsInstall';  //显示安装类型

var localHost ='http://172.16.38.206:8008';  //元帅
var areaUrl=localHost+'/region/findSelectServerReg'

function selected() {
     $.ajax({
         url:'../../html/other_manage/show.json',
         dataType:'json',
         type:'post',
         data:{type:1},//固定写死
         success:function(data){
             console.log(data)
             var html='';
             for (var i = 0; i < data.data.length; i++) {
                 html+='<option value="'+data.data[i].id+'">'+data.data[i].serviceDetailsName+'</option>'
             }
             $('.installType').html(html)

         }
     })
}

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
//      console.log('没有被选中的');
        $this.parents('.trigger_click').siblings().find('input').prop('checked',false);
        $this.parents('.trigger_click').siblings().find('input').prop('disabled',false);
    }else if(Icheck.length === Iput.length){
//      console.log('被全选了');
        $this.parents('.trigger_click').siblings().find('input').prop('checked',true);
        $this.parents('.trigger_click').siblings().find('input').prop('disabled',true);
    }else{
//      console.log('正常点选');
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


// $.each($("[area]"), function(i,v) {
//     for(var a=0;a<selected.length;a++){
//         if(selected[a].id  == $(v).attr('area')){
//             $(v).prop('checked',true).addClass('checked').addClass('checked1');
//             $(v).parents('.trigger_click').siblings().find('input').prop('checked',true);
//             $(v).attr('disabled',true);
//             checkedlength($(v));
//         }
//     };
// });

//回现页面
var flag =true;
function iden() {
        $.ajax({
            url:'../../html/other_manage/json.json',
            dataType:'json',
            type:'post',
            success:function(data){
                console.log(data)
                console.log(data.data.serviceDetailsName);
                //回现安装类型
                var options = '<option>'+data.data.serviceDetailsName+'</option>';
                $('.installType').html(options);
                $('.installType').on('click',function () {
                    if(flag)
                    {
                        selected()
                    }

                    flag =false;

                })
                //回现服务地区
                var cityId = data.data.cityCode;
                console.log(cityId);
                for(var i = 0;i<cityId.length;i++){

                }
            }
        })

    }

iden();
