var renameFlag = false;
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    //nav_Common_fun("用户列表");
     searchPage();
     setDateTime();
    $('.pageSize_switch').on('change', function () {
        searchPage();
    })
});
var _nowPage = 1;

/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */
// 分页 
//var localhost = 'http://172.16.41.184:8002';
//var localhost ='http://172.16.40.134:8002/user'
var localhost = getBaseUrl('lh')
var user_management= localhost + '/user/platForm/selUserList';
var freezeAccount = localhost +'/user/platForm/freezeAccount';
//店铺解锁
var freeAccountUrl = localhost+'/user/platForm/freeAccount';


var pagination = new Pagination(user_management, "page", function (data) {
    fillTableData(data)
});

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
    var keyWord = $.trim($("#formGroupInputLarge").val());
    var  _pageSize = +$('.pageSize_switch').val();
    var _isFrozen = $('.isFrozen option:selected').attr('data-id');
    var _startDate = $('#dates_start1').val();
    var _endDate = $('#dates_end1').val();
    console.log(_isFrozen)
    var params = {
        'pageSize':_pageSize,
        'inWords':keyWord,
        'isFrozen':_isFrozen,
        'startDate':_startDate,
        'endDate':_endDate
             
        };
    return params;
};

/** table数据 */
function fillTableData(data){
    console.log(data);
    if (data.length==0) {
         $("#pic_no").show();
        $("#table_data").hide();
        $(".leftBottom").hide();
        return false;
    }else{
        $("#pic_no").hide();
        $("#table_data").show();
        $(".leftBottom").show();

    var tr = "tr";
    var content = $("#table_data tbody");
    content.html("");
    var doc = '';
    for (var i = 0; i < data.length; i++) {
            doc+='<tr>'
            doc+='<td>'+'<img src="'+data[i].headPic+'" class="headPic">' +data[i].username +'</td>'
            doc+='<td>'+data[i].phoneNumber+'</td>'
            // doc+='<td>'+regRef(data[i].regRef)+'</td>'
            doc+='<td>消费者</td>'
            doc+='<td>'+data[i].regTime+'</td>'
            doc+='<td class="freeze_state">'+ctr_Switch(data[i].isFrozen)+'</td>' //状态
            doc+='<td data-id="'+data[i].id +'">'+ '<a href="./user_management_user.html?id=' +data[i].id + '&isFrozen=' + data[i].isFrozen+'" >查看</a> '+ '<a href="javascript:void(0);" onclick="freeze(this)" class="isFreeze">'+userState(data[i].isFrozen)+'</a> '+'</td></tr>'
       
    }
    content.append(doc)
    }
}

// 判断账户来源
function account_Id(params){
    var str = '';
    if(params == 0) {
        str += '未分配';
    }else if(params == 1){
        str += '商家';
    }else if (params == 2) {
        str += '供应商';
    }else if (params == 3) {
        str += '消费者';
    }else if (params == 4) {
        str += '运营';
    }else if (params == 5) {
        str += '导购';
    }else if (params == 6) {
        str += '店长';
    }else if (params == 7) {
        str += '采购';
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


$("#searchBtn").click(function(){
    searchNowPage();
    searchPage(_nowPage);
})



 function freeze(obj){
    var $this = $(obj);
    var id = $this.parent().attr('data-id');
    var closeShop = $this.text();
    console.log(closeShop)
    //console.log(id);
    // searchNowPage();
    // searchPage(_nowPage);
       if (closeShop=="解锁") {
        $(".index_mask", parent.document).show();
        var html = template('ajax_alert', {});
        $.popwin(html, {
            title: '解锁后用户将恢复登陆权限，可再次使用平台应用，是否确认该操作？',
            fixed: true,
            drag: false, //是否可拖拽
        });
           $("#popwin_Close").on("click", function () {
               $("#popwin_Blank").remove();
               $("#popwin_Out").remove();
               $(".index_mask", parent.document).hide();

           })

           $("#popwin_Out").addClass("attr_manag_add");
            $.popwin.setPosition(410, 560);
            $(".mask_ok").click(function(){
                $.ajax({
                    type:"post",
                    url: freeAccountUrl,
                    dataType: "json",
                    data:{id:id},
                    success: function (data) {
                        console.log(data);
                        if (data.success==true) {
                             alert('解冻成功')
                             $("#popwin_Blank").remove();
                             $("#popwin_Out").remove();
                             $(".index_mask", parent.document).hide();                
                             window.location.reload();
                             
                        }else{
                            alert("解冻失败")
                        }
                
                    },
                    error: function () {
                        console.log(12334)
                    }
                })
                    
            })

           }else{
               $(".index_mask", parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '锁定后，改用户将无法登陆平台应用，是否确认该操作？',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410, 560);

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
                                
                                 window.location.reload();
                            }else{
                                alert("锁定失败！")
                            }
                    
                        },
                        error: function () {
                            console.log(23354654)
                        }
                       
                    })
                     
                })
           }
 }

function clickFalse(){
     $("#popwin_Blank").hide();
     $("#popwin_Out").hide();
     $(".index_mask", parent.document).hide();
}





