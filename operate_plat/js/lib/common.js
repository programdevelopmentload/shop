// var tokenStr = TOKEN_getIem()
var loginHttpURL = getBaseUrl('yy');
var top_navHttp = getBaseUrl('lh');
//更新token地址
var upDateToken = loginHttpURL + '/auth/auth/refresh';
debugger;

userNameDraw();

//全局ajax设置
$.ajaxSetup({
    dataType: "json",
    cache: false,
    // headers: {
    //     'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    //     "Authorization": TOKEN_getIem()
    // },
    beforeSend: function (request) {
        debugger;
        // var token_check_Time = (new Date()).getTime();
        // var atoken_check_Time_before = +token_issue_getIem();
        // var token_check_Flag = localtime_Diff(atoken_check_Time_before, token_check_Time);
        request.setRequestHeader("Authorization", TOKEN_getIem())
    },
    // xhrFields: {
    //     withCredentials: tokenStr
    // }
    // ,
    complete: function (data) {

        // console.log(xhr.getAllResponseHeaders());
        debugger;
        if (data.responseText) {
            var resData = JSON.parse(data.responseText);
            if (resData.errorCode == 9527 || resData.errorCode == 775) {
                TOKEN_setIem("");
                navTopMenu_setIem("");
                // window.location.href = loginHttpURL + "../../login.html";
                window.location.href = "../../login.html";
            }
        }
        //token过期，则跳转到登录页面
        // if (data == "expire_token") {
        //     window.location.href = loginHttpURL + 'login.html';
        // }
        // if (data == "refresh_token") {
        //     //过期重新签发
        //
        // }
    }
});

//点击获取按钮
$('.mess_con_form .login_hqyzm').click(function () {
    new Countdown($(".mess_con_form .login_hqyzm")[0], 60)
});

/* 验证码倒计时*/
var Countdown = function (obj, time, className) {
    this.obj = obj;
    this.initTime = time;
    this.time = time;
    this.className = className ? className : 'current';//默认不传递为current
    this.init();
};

Countdown.prototype.init = function () {
    var clearTimeout;
    var self = this;
    if (this.time == 0) {
        this.obj.removeAttribute("disabled");
        this.obj.classList.remove(this.className);
        this.obj.value = "发送验证码";
        this.time = this.initTime;

    } else {
        this.obj.setAttribute("disabled", true);
        $(this.obj).addClass(this.className);
        this.obj.value = "" + this.time + "s";
        this.time--;
        clearTimeout = setTimeout(function () {
                self.init();
            },
            1000)
    }
}

/*获取焦点*/
$('.mess_con_form input').focus(function () {
    $(this).siblings('span').hide();
})
/*用户名*/
$('#userName').blur(function () {
    if ($(this).val() == "") {
        $(this).next().show().html('支持中文、字母、数字,4-32位');
        $(this).next().show().css('color', 'red');
        return false;
    }
    /*else if('($(this).val()).length < 4|| ($(this).val()).length > 32'){
               $(this).next().show().html('请输入4-32位数字或字母');
               $(this).next().show().css('color','red');
               return false;
            }*/
})
/*邮箱*/
$('.mess_con_form div .email').blur(function () {
    if ($(this).val() == "") {
        $(this).next().show().html('请输入常用邮箱地址，用于保护账户安全及接收重要通知');
        $(this).next().show().css('color', 'red');
        return false;
    } else if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test($(this).val()) == false) {
        $(this).next().show().html('请输入正确的邮箱格式');
        $(this).next().show().css('color', 'red');
        /* $(this).focus();*/
    }
})
//手机号验证
$(".mess_con_form div .phone").blur(function () {
    if ($(this).val() == "") {
        $(this).next().show().html("手机号不能为空");
        $(this).next().show().css('color', 'red');
        return false;
    } else if (($(this).val()).length != 11) {
        $(this).next().show().html("手机号不正确");
        $(this).next().show().css('color', 'red');
        return false;
    } else if (!$(this).val().match(/^[1][3,4,5,7,8,9][0-9]{9}$/)) {
        $(this).next().show().html("手机号码格式不正确");
        $(this).next().show().css('color', 'red');
        return false;
    }
});
$("#imgCode").blur(function () {
    if ($(this).val().toLowerCase() == canvasStr.toLowerCase()) {
        $(".imagecode").css("display", "none");
    } else {
        $(".imagecode").css("display", "block");
        return false;
    }
});
//密码验证
$(".mess_con_form div .password").blur(function () {
    if ($(this).val() == "") {
        $(this).next().show().html("密码不能为空");
        $(this).next().show().css('color', 'red');
        return false;
    } else if (($(this).val()).length < 6 || ($(this).val()).length > 18) {
        $(this).next().show().html("密码长度在6-18位之间");
        $(this).next().show().css('color', 'red');
        return false;
    }
});
//再次输入密码
$(".mess_con_form div .passwords").blur(function () {
    if ($(this).val() == "") {
        $(this).next().show().html("密码不能为空");
        $(this).next().show().css('color', 'red');
        return false;
    } else if (($(this).val()).length < 6 || ($(this).val()).length > 18) {
        $(this).next().show().html("密码长度在6-18位之间");
        $(this).next().show().css('color', 'red');
        return false;
    } else if ($(this).val() != $("#password").val()) {
        console.log($(this).val())
        console.log($("password").val())
        $(this).next().show().html("两次密码不一致");
        $(this).next().show().css('color', 'red');
        return false;
    }
});

/*公司名称*/
$('#company_name').blur(function () {
    if ($(this).val() == "") {
        $(this).next().show().html('请输入公司名称');
        $(this).next().show().css('color', 'red');
        return false;
    }
})
/*公司地址*/
$('#com_adress').blur(function () {
    if ($(this).val() == "") {
        $(this).next().show().html('请填写公司详细地址');
        $(this).next().show().css('color', 'red');
        return false;
    }
})
/*联系电话*/
/*成立日期*/
/*传真号码*/
$('#fax_number').blur(function () {
    var reg = /(^[0-9]…{3,4}-[0-9]…{3,8}$)|(^[0-9]…{3,8}$)|(^([0-9]…{3,4})[0-9]…{3,8}$)|(^0…{0,1}13[0-9]…{9}$)/;
    if ($(this).val() == "") {
        $(this).next().show().html('请填写传真号码');
        $(this).next().show().css('color', 'red');
        return false;
    } else if (reg.test($(this).val()) == false) {
        $(this).next().show().html('传真有误，请重新填写');
        $(this).next().show().css('color', 'red');
        return false;
    }
})
/*公司人数*/
var re = /^-?\\d+$/;
$('#com_people').blur(function () {
    if ($(this).val() == "") {
        $(this).next().show().html('请填写公司人数');
        $(this).next().show().css('color', 'red');
        return false;
    } else if (re.test($(this).val()) == false) {
        $(this).next().show().html('请输入正确的人数');
        $(this).next().show().css('color', 'red');
        return false;
    }
})
/*法人代表*/
$('#fr_repre').blur(function () {
    if ($(this).val() == "") {
        $(this).next().show().html('请填写法人代表');
        $(this).next().show().css('color', 'red');
        return false;
    }
})

/*主要销售范围*/
$('#sales').blur(function () {
    if ($(this).val() == "") {
        $(this).next().show().html('请输入销售地区信息，不同地区用逗号间隔');
        $(this).next().show().css('color', 'red');
        return false;
    }
});

//分页全选执行函数
function checkAll(elemId) {
    var that = $("#" + elemId);
    var itemClass = '.item-check';
    var allBtnClass = '.all-check';
    var unSelBtnClass = '.all-uncheck';
    // click select all
    $(that).on("click", allBtnClass, function () {
        var items = $(that).find(itemClass);
        for (var i = 0; i < items.length; i++) {
            if (!items[i].disabled) {
                items[i].checked = $(allBtnClass)[0].checked;
                toggleClass(items[i]);
            }
        }
        itemCheck();
        $(unSelBtnClass).prop("checked", false);
    });

    // click un-select all
    $(that).on("click", unSelBtnClass, function () {
        var items = $(that).find(itemClass);
        for (var i = 0; i < items.length; i++) {
            items[i].checked = !items[i].checked;
            toggleClass(items[i]);
        }
        itemCheck();//该函数在处理试题管理层面的选择
    });

    function itemCheck() {
        var items = $(that).find(itemClass);
        var checknum = items.length;
        //-----------特殊需要，改了一下-------------
        var checknum2 = 0;//资源管理中，待审核的不能选择，checknum2得到可以选择的checkbox的数量
        for (var i = 0; i < items.length; i++) {
            if (!items[i].disabled) {
                checknum2++;
            }
        }
        //------------如果checknum2不为0，是资源管理模块，而且存在不能选的checkbox，所以checknum需要等于checknum2，只得到能选择的总量-------------------------------
        if (checknum2 != 0) {
            checknum = checknum2;
        }
        //-------------到此改动结束---------------------
        var num = 0;
        items.each(function () {
            if (this.checked == true) {
                num++;
            }
        });
        if (num == checknum) {
            $(allBtnClass).prop("checked", true);
        } else {
            $(allBtnClass).prop("checked", false);
        }
    }

    function toggleClass(elem) {
        if ($(elem).is(':checked')) {
            $(elem).parents("tr").addClass("checkTrue");
        } else {
            $(elem).parents("tr").removeClass("checkTrue");
        }
    }

    // click item
    $(that).on("click", itemClass, function () {
        itemCheck();
        toggleClass(this);
        $(unSelBtnClass).prop("checked", false);
    });
};

//分页全选执行函数
function checkAll_sky(elemId, sonClass, AllClass) {
    var that = $("#" + elemId);
    // var itemClass = '.item-check';
    var itemClass = sonClass;
    // var allBtnClass = 'all-check';
    var allBtnClass = AllClass;
    var unSelBtnClass = '.all-uncheck';
    // click select all
    $(that).on("click", allBtnClass, function () {
        var items = $(that).find(itemClass);
        for (var i = 0; i < items.length; i++) {
            if (!items[i].disabled) {
                items[i].checked = $(allBtnClass)[0].checked;
                toggleClass(items[i]);
            }
        }
        itemCheck();
        $(unSelBtnClass).prop("checked", false);
    });

    // click un-select all
    $(that).on("click", unSelBtnClass, function () {
        var items = $(that).find(itemClass);
        for (var i = 0; i < items.length; i++) {
            items[i].checked = !items[i].checked;
            toggleClass(items[i]);
        }
        itemCheck();//该函数在处理试题管理层面的选择
    });

    function itemCheck() {
        var items = $(that).find(itemClass);
        var checknum = items.length;
        //-----------特殊需要，改了一下-------------
        var checknum2 = 0;//资源管理中，待审核的不能选择，checknum2得到可以选择的checkbox的数量
        for (var i = 0; i < items.length; i++) {
            if (!items[i].disabled) {
                checknum2++;
            }
        }
        //------------如果checknum2不为0，是资源管理模块，而且存在不能选的checkbox，所以checknum需要等于checknum2，只得到能选择的总量-------------------------------
        if (checknum2 != 0) {
            checknum = checknum2;
        }
        //-------------到此改动结束---------------------
        var num = 0;
        items.each(function () {
            if (this.checked == true) {
                num++;
            }
        });
        if (num == checknum) {
            $(allBtnClass).prop("checked", true);
        } else {
            $(allBtnClass).prop("checked", false);
        }
    }

    function toggleClass(elem) {
        if ($(elem).is(':checked')) {
            $(elem).parents("tr").addClass("checkTrue");
        } else {
            $(elem).parents("tr").removeClass("checkTrue");
        }
    }

    // click item
    $(that).on("click", itemClass, function () {
        itemCheck();
        toggleClass(this);
        $(unSelBtnClass).prop("checked", false);
    });
};

//判断顶部更多更少按钮是否显示
function judgeSwitch_ishave() {
    debugger;
    //分类的判断
    var _moldKind_switch_length = $(".moldKind_switch .moldKind_span").length;
    var _moldBrand_switch_length = $(".moldBrand_switch .moldBrand_span").length;
    var _moldType_switch_length = $('.moldClass_types_con .moldType_span').length;

    if (_moldKind_switch_length > 6) {
        $(".moldKind_click").show();
    } else {
        $(".moldKind_click").hide();
    }
    ;
    if (_moldBrand_switch_length > 6) {
        $(".moldBrand_click").show();
    } else {
        $(".moldBrand_click").hide();
    }
    ;
    if (_moldType_switch_length > 6) {
        $(".moldType_click").show();
    } else {
        $(".moldType_click").hide();
    }
    ;
};

//顶部的筛选区点击事件封装
function topArea_active() {
    // 顶部筛选点击事件
    $(".moldBrand_click").click(function () {
        if ($(".moldBrand_switch").css("height") == '46px') {
            $(".moldBrand_switch").css("height", "auto").css("overflow", "");
            $(".moldBrand_less").show();
            $(".moldBrand_more").hide();
        } else {
            $(".moldBrand_switch").css("height", "46px");
            $('.moldBrand_less').hide();
            $(".moldBrand_more").show();
        }
        // $(".moldBrand_switch").css("height", "auto").css("overflow", " ");
    });
    $(".moldKind_click").click(function () {
        if ($(".moldKind_switch").css("height") == '46px') {
            $(".moldKind_switch").css("height", "auto").css("overflow", "");
            $(".moldKind_less").show();
            $(".moldKind_more").hide();
        } else {
            $(".moldKind_switch").css("height", "46px");
            $('.moldKind_less').hide();
            $(".moldKind_more").show();
        }
        // $(".moldBrand_switch").css("height", "auto").css("overflow", " ");
    });
    $(".moldType_click").click(function () {
        if ($(".moldClass_cates_box").css("height") == '46px') {
            $(".moldClass_cates_box").css("height", "auto").css("overflow", "");
            $(".moldKind_less").show();
            $(".moldKind_more").hide();
        } else {
            $(".moldClass_cates_box").css("height", "46px");
            $('.moldKind_less').hide();
            $(".moldKind_more").show();
        }
        // $(".moldBrand_switch").css("height", "auto").css("overflow", " ");
    });
}

//后台叶子全部抓取
function backLeaf_AllFun(backLeaf_AllUrl) {
    $.ajax({
        type: "post",
        catch: false,
        sync: false,
        url: backLeaf_AllUrl,
        dataType: "json",
        success: function (data) {
            if (data.success == true) {
                if (data.data.length > 0) {
                    $('.moldKind_switch_box').show();
                    var str = "<span data-lcid='lcidAll' class='moldClass_all moldKind_switch_active col-xs-2'>全部</span>";
                    $(data.data).each(function (i, v) {
                        str += " <span data-lcid='" + v.id + "' class='col-xs-2 moldKind_span'>" + v.name + "</span>"

                    });
                    $('.moldKind_switch_box').show();
                    $('.moldKind_switch>div').html(str);
                    judgeSwitch_ishave();
                } else {
                    $('.moldKind_switch_box').hide();
                }

            }else{
                $('.moldKind_switch_box').hide();
            }
        },
        error: function () {
            $('.moldKind_switch_box').hide();

        }
    });

}

//品牌全部抓取
function brand_AllFun(brand_AllUrl) {

    $.ajax({
        type: "post",
        catch: false,
        sync: false,
        url: brand_AllUrl,
        dataType: "json",
        success: function (data) {
            console.log(data)

            if (data.success == true) {
                if(data.data.length){
                    $('.moldBrand_switch_box').show();
                    var str = "<span data-bcid='bcidAll' class='moldClass_all moldBrand_switch_active col-xs-2'>全部</span>";
                    $(data.data).each(function (j, k) {
                        str += " <span data-bcid='" + k.id + "' class='col-xs-2 moldBrand_span'>" + k.nameCh + "</span>"
                    });
                    $('.moldBrand_switch>div').html(str);
                    judgeSwitch_ishave();
                }else {
                    $(".moldBrand_switch_box").hide();
                }
            }else {
                $(".moldBrand_switch_box").hide();
            }
        },
        error: function () {
            $('.moldBrand_switch_box').hide();
            $(".moldBrand_switch_box").hide();
        }
    });

}

//商品类型全部抓取
function goods_ModelFun(goods_AllUrl) {

    $.ajax({
        type: "post",
        catch: false,
        sync: false,
        url: goods_AllUrl,
        dataType: "json",
        success: function (data) {
            if (data.success == true) {
                if(data.data.length>0){
                    $('.moldClass_cates_box').show();
                    var str = "<span data-typeid='typeidAll' class='moldClass_all moldType_active col-xs-2'>全部</span>";
                    $(data.data).each(function (jj, kk) {
                        str += " <span data-typeid='" + kk.id + "' class='col-xs-2 moldType_span'>" + kk.goodsType + "</span>"
                    });
                    $('.moldClass_types_con').html(str);
                    judgeSwitch_ishave();
                }else {
                    $('.moldClass_cates_box').hide();
                }
            }else {
                $('.moldClass_cates_box').hide();
            }
        },
        error: function () {
            $('.moldClass_cates_box').hide();
        }
    });

}

function localtime_Diff(before, after) {
    var stime = Date.parse(new Date(before));
    var etime = Date.parse(new Date(after));
    var usedTime = etime - stime;  //两个时间戳相差的毫秒数
    var seconds = Math.floor(usedTime / (1000));

    return seconds
}

function userNameDraw() {
    var userName = userName_getIem();
    $(".loginUserName").html(userName)
}

// function setIframeHeight(height){
//  height = height+20; 
//  $("#iframemainId").css("height",height);
//  $("#iframemainId body").css("height",height);
// }
// setIframeHeight(document.body.scrollHeight);