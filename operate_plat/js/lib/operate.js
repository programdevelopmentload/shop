//顶部区域导航栏交互地址
var navId = $.getUrlParam("navId");//本行数据id
var selfHostPath = getHostPath();
var _usrId = userId_getIem();


//拉取缓存中navid或者是href中的id；
// function nav_Common_fun(left_activeFlag, edit_LeftNav) {
//
//     if (navId == null || navId == undefined) {
//
//         navId = navTopMenu_getIem();
//     } else {
//         navTopMenu_setIem(navId);
//     }
//     nav_top(_usrId, navId);
//     nav_left(_usrId, navId, left_activeFlag, edit_LeftNav)
// }


//拉取顶部地址注入dom
// function nav_top(_usrId, top_activeId) {
//     var selfHostPath = getHostPath();
//     var top_navHttp = getBaseUrl('lh')
//     var top_navUrl = top_navHttp + '/user/permission/getUserLevelOneMenu';
//     // var top_navUrl = '../huoqu_navMenuList.json';
//     if (top_activeId == undefined) {
//         top_activeId = 1;
//     }
//     var usrParms = {
//         userId: _usrId
//     }
//
//     $.ajax({
//         type: "post",
//         catch: false,
//         sync: false,
//         url: top_navUrl,
//         dataType: "json",
//         data: usrParms,
//         success: function (res) {
//
//             if (res.success == true) {
//                 var data = res.data;
//                 var str = "";
//                 $(data).each(function (i, v) {
//                     if (v.id == top_activeId) {
//                         str += "<li onclick='nav_jump(this)' class='active' data-ref='" + selfHostPath + data[i].menuUrl + "?&navId=" + data[i].id + "'><a href='#'>" + data[i].menuName + "</a></li>";
//                     } else {
//                         str += "<li onclick='nav_jump(this)' class='' data-ref='" + selfHostPath + data[i].menuUrl + "?&navId=" + data[i].id + "'><a href='#'>" + data[i].menuName + "</a></li>";
//                     }
//                 });
//                 $(".navbar-nav").html(str);
//
//                 //顶部导航点击切换事件
//                 function nav_jump(obj) {
//                     var $this = $(obj);
//                     var ref = $this.data("ref");
//                     window.location.href = ref;
//                 }
//             }
//         },
//         error: function () {
//
//         }
//     });
// }

//侧边栏dom注入
// function nav_left(_usrId, left_activeId, left_activeFlag, edit_LeftNav) {
//
//
//     var top_navHttp = getBaseUrl('lh')
//     var top_navUrl = top_navHttp + '/user/menu/getAllSonMenu';
//     // var top_navUrl = '../huoqu_navLeftList.json';
//     if (left_activeId == undefined) {
//         left_activeId = 1;
//     }
//     var usrParms = {
//         userId: _usrId,
//         id: navId
//     }
//
//     $.ajax({
//         type: "post",
//         catch: false,
//         sync: false,
//         url: top_navUrl,
//         dataType: "json",
//         data: usrParms,
//         success: function (res) {
//
//             if (res.success == true) {
//                 var left_str = buildMenu(res.data);
//                 $(".left").html(left_str);
//                 $(".leaf").each(function (i, v) {
//
//                     if ($(v).hasClass(left_activeFlag)) {
//                         if (edit_LeftNav) {
//                             $(v).html(edit_LeftNav)
//                         }
//                         $(v).addClass("leftNav_active");
//                         $(v).parent().show();
//                     }
//                 })
//                 $(".left ul li").click(function () {
//                     $(this).siblings().find("ul").css("display", "none"); //找到同一级的ul将其隐藏
//                     if ($(this).has("ul").length > 0) {
//                         $(this).children("ul").css("display", "block");   //如果是ul将其子项显示出来
//                     }
//                 });
//
//             }
//         },
//         error: function () {
//
//         }
//     });
// }

//顶部导航点击切换事件
// function nav_jump(obj) {
//
//     var $this = $(obj);
//     var ref = $this.data("ref");
//     window.location.href = ref;
// }

/** 退出登录 */
$(".loginUserOut").click(function () {
    TOKEN_setIem("");
    navTopMenu_setIem("");
    window.location.href = "./login.html";
});

//渲染左侧导航菜单逻辑
function buildMenu(obj) {
    var str = "<ul>";
    $.each(obj, function (index, item) {
        if (typeof (obj[index].childMenu) == "object") {
            str += "<li><span class='leaf' data-id='" + obj[index].id + "'>" + obj[index].menuName + "</span>";
            str += buildMenu(obj[index].childMenu); //递归判断是不是object,直到不是li
            str += "</li>";
        }
        else {
            //  alert(index + "--" + obj[index]);  //item == obj[index]
            str += "<li data-id='" + obj[index].id + "' onclick='navLeft_jump(this)' class='leaf " + obj[index].menuName + "' data-ref='" + selfHostPath + obj[index].menuUrl + "?&leftId=" + obj[index].id + "'>" + obj[index].menuName + "</li>"
        }
    });
    str += "</ul>";
    return str;
}

function navLeft_jump(obj) {
    var $this = $(obj);
    var ref = $this.data("ref");
    window.location.href = ref;
}

