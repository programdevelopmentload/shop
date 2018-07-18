//获取路径 
//
var localHttp = getBaseUrl('y_jl');
var listUrl =localHttp +'/agreement/list';
// $(function () {
//     nav_Common_fun("协议条款列表");
// })
function Agreelist(){
   $.ajax({
      type:"post",
      url:listUrl,
      dataType:"json",
      success:function(data){
        console.log(data);     
        if (data.success==true) {
           $("#pic_no").hide();
            var data = data.data;
            html='';
            for (var i = 0; i < data.length; i++) {
                html+='<li>';
                html+='<span>'+data[i].name+'</span>';
                html+='<span>'+data[i].code+'</span>';
                html+='<span>'+data[i].type+'</span>';
                html+='<span>'+data[i].createTime+'</span>';
                html+='<span><a href="./agreement_look.html?id='+data[i].code+'">查看</a>  <a href="./add_agremment_editor.html?id='+data[i].code+'">编辑</a></span>';
                html+='</li>'
            }
            $('.contUl').html(html)
        }else{
           $("#pic_no").show();
          
        }
      }
   })
}
Agreelist()