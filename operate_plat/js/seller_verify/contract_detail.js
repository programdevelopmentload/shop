var localHtttp = 'http://172.16.40.134:8003';
//获取商家审核详情的数据【拉取数据】
var qualification_pullUrl = localHtttp + "/seller/companyExamineAndVerify";
//根据合同id查询合同信息
var contract_infoUrl = localHtttp + '/seller/selectByContractId';
//合同确认地址
var contract_confirmUrl = localHtttp + "/seller/updateComtractState";
//获取url中的公司id
var _contractId = $.getUrlParam("id");
var _contractIdState = $.getUrlParam("contractstate");
var _type;
var _isImage = 0;//url中获取吗
var _dismissReason;
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    var resData;
    var params={
        companyId:_contractId,//此处不能写死
        applyType:1//此处的值根据具体情况修改[合同就是走1]
    };
    $.ajax({
        type: "post",
        catch: false,
        url: qualification_pullUrl,
        dataType: "json",
        data: params,
        success: function (data) {
            if (data.success == true) {
                resData = data.data;
                var html = template("rig_con_ajax", resData);
                $('.right_con_box').append(html);
               //回填合同各种信息
                contractId_infoLink();
            } else {
                alert("未请求到数据")

            }
        },
        error: function () {
        }
    });

    $('.qualification_sureBtn').on('click',function () {
        confirm_func();
    })
});
function contractId_infoLink() {
    var params = {
        contractId:_contractId
    }
    $.ajax({
        type: "post",
        catch: false,
        url: contract_infoUrl,
        dataType: "json",
        data: params,
        success: function (data) {
            if (data.success == true) {
                debugger;
                $(".contract_state").html(contract_stateDraw(data.data.isEffective));
                $(".creat_time").html(data.data.creatTime);//发放
                if(data.data.effectiveTime){
                    $(".effective_time").html(data.data.effectiveTime).show();//生效
                }else {
                    $(".effective_time").hide();
                };
                if(data.data.uneffectiveTime){
                    $(".uneffective_time").html(data.data.uneffectiveTime).show();//失效
                }else {
                    $(".uneffective_time").hide();
                };
                if(data.data.isEffective){
                    $(".qualification_sureBtn ").hide();
                }else {
                    $(".qualification_sureBtn ").show();
                }


            } else {
                alert("该等级下有挂载，不可关闭")

            }
        },
        error: function () {
        }
    })
};
function contract_stateDraw(param) {
    if(param == 0){
        return "待确认"
    }else if(param == 1){
        return "已确定"
    }
};
//合同确认按钮的执行
function confirm_func(obj) {
    var params = {
        contractId: _contractId
    };
    var html = template('distribution_bubble', {});
    $.popwin(html, {
        title: '操作确认',
        fixed: true,
        drag: false, //是否可拖拽
    });
    $("#popwin_Out").addClass("distribution_store");
    $.popwin.setPosition(410, 460);
    $('body').off('click').on('click','.cancle_xsBtn',function(){
        $("#popwin_Blank").remove();
        $("#popwin_Out").remove();
    });
    $(document).off('click').on('click','.sure_xsBtn',function(){
        $.ajax({
            type: "post",
            catch: false,
            url: contract_confirmUrl,
            dataType: "json",
            data: params,
            success: function () {
                $("#popwin_Blank").remove();
                $("#popwin_Out").remove();
            },
            error: function () {
                alert("连接错误");
            }
        })
    });
};


