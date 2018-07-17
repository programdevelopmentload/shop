var renameFlag = false;
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    //
    //nav_Common_fun("商家列表");
    searchPage();
    setDateTime();
    $('.pageSize_switch').on('change', function () {
        searchPage();
    })
});

//循环所在区域
var localhost = getBaseUrl('ys');
var find = localhost +'/region/findAllProvince'
function area(){
    $.ajax({
        type:'post',
        url:find,
        dataType:'json',
        success:function(data){
            console.log(data);
            var data= data.data;
            var str ='';
            str='<option data-id="selectAll" val="请选择">请选择</option>';
            for(var i = 0;i<data.length;i++){
                str+='<option data-id = "'+data[i].id+'" val="'+data[i].name+'">'+data[i].name+'</option>';
            }
            $('.area').html(str);
        }
    })
}
area();

/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */
//http://172.16.41.23:8001//goods/check/showAllCheck
//
//var localHtttp = 'http://172.16.41.184:8003';
//var localHtttp = 'http://172.16.41.184:8002/user';
//var localHtttp='http://172.16.40.134:8002/user';
var localHtttp =  getBaseUrl('lh');
//分页路径
var platForm= localHtttp + '/user/platForm/supM';

var freezeAccount = localHtttp +'/user/platForm/freezeAccount';
//店铺解锁
var freeAccountUrl = localHtttp+'/user/platForm/freeAccount';
var pagination = new Pagination(platForm, "page", function (data) {
    fillTableData(data)
});


var _nowPage = 1;

function searchPage(page) {//首次两参进入
    pagination.search(getParams(), page);
}

function searchNowPage() {//首次两参进入
    var a;
    a = pagination.returnParams();
    _nowPage = a.currentPageNo;
    debugger;
};




/** 得到搜索条件的json对象 */
function getParams() {  
    var  _pageSize = +$('.pageSize_switch').val();
    console.log(_pageSize)
    var  keyWord = $.trim($("#formGroupInputLarge").val());; 
    var  companyName =$.trim($(".companyName").val());
    var  companyArea = $('.area option:selected').val();
    var  state = $('.isFrozen option:selected').attr('data-id');
    var  startDate = $('#dates_start1').val();
    var  endDate = $('#dates_end1').val();
    console.log(keyWord)

    var params = {
        'pageSize':_pageSize,
        'inWords':keyWord,
        'companyName': companyName,
        'startDate': startDate,
        'endDate': endDate
  
        };
        if(companyArea !='请选择') {
            params.companyArea =companyArea
        }else if(state !='all'){
            params.state =state
        }
    return params;
};

/** table数据 */
function fillTableData(data){
    console.log(data);
    if (!data){
        $("#pic_no").show();
        $(".pageSize_switch_con").hide();
        $("#table_data").hide();
        $(".leftBottom").hide();
    } else{
        $("#pic_no").hide();
        $("#table_data").show();
        $(".leftBottom").show();

    var tr = "tr";
    var content = $("#table_data tbody");
    content.html("");
    var doc = '';
    for (var i = 0; i < data.length; i++) {
            doc+='<tr>'
            doc+='<td>'+data[i].userInfo.username +'</td>'  //商家名称
            doc+='<td>'+data[i].userInfo.phoneNumber+'</td>'
            doc+='<td>'+data[i].companyName+'</td>' //商家名称
            // doc+='<td>'+account_Id(data[i].userInfo.accountType)+'</td>'//商家类型 
            // doc+='<td>'+data[i].managementType+'</td>' //经营类型
            doc+='<td>'+data[i].companyArea+'</td>' //所在地区
            doc+='<td>'+account_Id(data[i].userInfo.accountType)+'</td>' //商家身份
            doc+='<td>'+data[i].userInfo.regTime+'</td>' //商家注册时间 
            doc+='<td>'+ctr_Switch(data[i].userInfo.isFrozen)+'</td>'  //商家身份
            doc+='<td data-id="'+data[i].userInfo.id +'">'+ '<a href="./business_info_detail.html?id=' +data[i].userInfo.id +'&isFrozen=' + data[i].userInfo.isFrozen+'&iscompanyId=' + data[i].id+'"  >查看</a> '+ '<a href="javascript:void(0);" onclick="freeze(this)" class="isFreeze">'+userState(data[i].userInfo.isFrozen)+'</a> '+'</td>'
            doc+='</tr>'
       
    }
     content.append(doc)
    }

}

// 判断账户来源
// function account_Id(params){
//     var str = '';
//     if(params == 0) {
//         str += '未分配';
//     }else if(params == 1){
//         str += '商家';
//     }else if (params == 2) {
//         str += '供应商';
//     }else if (params == 3) {
//         str += '消费者';
//     }else if (params == 4) {
//         str += '运营';
//     }else if (params == 5) {
//         str += '导购';
//     }else if (params == 6) {
//         str += '店长';
//     }else if (params == 7) {
//         str += '采购';
//     }
//     return str;
// }


function account_Id(params){
    var str = '';
    if(params == 2) {
        str += '供应商';
    }else if(params == 3){
        str += '普通商家';
    }
    return str;
}

// 判断注册

function regRef(params){
    var str = '';
    if(params == 0) {
        str += '手机';
    }else if(params == 1){
        str += '导购';
    }
    return str;
}

/*判断审核状态*/
function ctr_Switch(params) {
    var str = "";
    if (params == 0) {//0是开启
        str += '正常';
    } else if (params == 1) {
        str += '冻结';
    }
    return str;
}

//判断是否锁定或着解锁 
function userState(params) {
    var str = "";
    if (params == 0) {//0是开启
        str += '锁定';
    } else if (params == 1) {
        str += '解锁';
    }
    return str;
}



 function freeze(obj){
    var $this = $(obj);
    var id = $this.parent().attr('data-id');
    var closeShop = $this.text();
    console.log(closeShop);
    console.log(id)
       if (closeShop=="解锁") {
        $(".index_mask", parent.document).show();
        var html = template('ajax_alert', {});
        $.popwin(html, {
            title: '解锁后商家将恢复登陆权限，可再次使用平台应用，是否确认该操作？',
            fixed: true,
            drag: false, //是否可拖拽
        });
        $("#popwin_Close").on("click", function () {
               $("#popwin_Blank").remove();
               $("#popwin_Out").remove();
               $(".index_mask", parent.document).hide();

           })
            $("#popwin_Out").addClass("attr_manag_add");
            $(".mask_ok").click(function(){
                $.ajax({
                    type:"post",
                    url: freeAccountUrl,
                    dataType: "json",
                    data:{id:id},
                    success: function (data) {
                        console.log(data);
                        if (data.success==true) {
                             alert('解锁成功')
                             $("#popwin_Blank").remove();
                             $("#popwin_Out").remove();
                              $(".index_mask", parent.document).hide();  
                             window.location.reload()
                             
                        }else{
                            alert(data.message)
                        }
                
                    },
                    error: function (data) {
                         alert(data.message)
                    }
                })
                    
            })

           }else{
               $(".index_mask", parent.document).show()
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '锁定后，该商家将无法登陆平台应用，是否确认该操作？',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");

                 $(".mask_ok").click(function(){
                    $.ajax({
                        type:"post",
                        url: freezeAccount,
                        dataType: "json",
                        data:{id:id},
                        success: function (data) {
                            console.log(data);
                            if (data.success==true) {
                                 alert("锁定成功！");
                                 $("#popwin_Blank").remove();
                                 $("#popwin_Out").remove();
                                  $(".index_mask", parent.document).hide();  
                                 window.location.reload()
                                 
                            }else{
                                alert(data.message)
                            }
                    
                        },
                        error: function (data) {
                            alert(data.message)
                        }
                       
                    })
                     
                })
           }
 }



$('#btnSearch').click(function(){
    console.log(getParams())
    searchPage()

})

function clickFalse(){
     $("#popwin_Blank").hide();
     $("#popwin_Out").hide();
      $(".index_mask", parent.document).hide();
}



