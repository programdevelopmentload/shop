////渲染身份类型 accountType

// var local_y = 'http://172.16.41.184:8003';
//var localhost = 'http://172.16.41.184:8002/user';
var localhost='http://172.16.44.200:8002/user';
var accountType = localhost+'/platForm/allAccountType';
var staffUrl = localhost+'/platForm/staffList';
function identity_Type() {
    $.ajax({
        type:'post',
        url:accountType,
        dataType:'json',
        success:function(res){
           //console.log(res);
           var data= res.data;
           console.log(data);
            var html='';
            html+='<option>全部</option>'
            for (var i = 0; i < data.length; i++) {
                 html+='<option data-id= "'+data[i].roleId+'" value="'+data[i].roleName+'">'+ data[i].roleName+'</option>';
            }
            $('.identity_type').html(html)
        },
        error:function(){
            console.log(12324)
        }
    })
}
identity_Type()

var renameFlag = false;
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    searchPage();
});

/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */
var pagination = new Pagination(staffUrl, "page", function (data) {
    fillTableData(data)
});

function searchPage(page) {//首次两参进入
    pagination.search(getParams(), page);
}


/** table数据 */
function fillTableData(data){
    console.log(data);
    if (data== null) {
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
        var shopStaff= data[i].shop;
        var roleName = data[i].roles;
            doc+='<tr style="border:1px solid #ccc">'
            doc+='<td style="border:1px solid #ccc">'+data[i].email+'</td>'   //邮箱
            doc+='<td style="border:1px solid #ccc">'+data[i].phoneNumber+'</td>' //手机号
            doc+='<td style="border:1px solid #ccc">'+data[i].realName+'</td>'  //姓名
            doc+='<td style="border:1px solid #ccc">'
            for(var z= 0;z<roleName.length;z++){
                doc+='<p>'+roleName[z].roleName+'</p>'
            }
            doc+='</td>'
           // doc+='<td >'+account_Id(data[i].accountType)+'</td>' // 身份类型
            
            //doc+='<td>'+data[i].realName+'</td>'
            doc +='<td style="border:1px solid #ccc">' //所属店铺
            for (var j = 0; j < shopStaff.length; j++) {
                doc+='<p>'+shopStaff[j].shopName+'</p>'
            }
            doc +='</td>'
            doc+='<td style="border:1px solid #ccc">'+data[i].regTime+'</td>' //添加时间
            doc+='<td style="border:1px solid #ccc">'+ctr_Switch(data[i].isFrozen)+'</td>'  //账户状态

            doc+='<td style="border:1px solid #ccc">'+ '<a href="./staff_detail_info.html?id=' + data[i].id + '" >查看</a> '+'</td>'

            doc+='</tr>'
       
    }
    content.append(doc)
   } 
}

/** 得到搜索条件的json对象 */
function getParams() {  
    var keyWord = $.trim($("#staff_key").val());
    var accountType = $('.identity_type').find('option:selected').attr('data-id');
   
    var params = {
        'pageSize':5,
        'inWords':keyWord,
        'roleId': accountType//这边不是固定的 
             
        };
    return params;
};

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

/*判断账户状态*/
function ctr_Switch(params) {
    var str = "";
    if (params == 0) {//0是开启
        str += '正常';
    } else if (params == 1) {
        str += '冻结';
    }
    return str;
}


$("#staff_sub").click(function(){
    searchPage();
})



