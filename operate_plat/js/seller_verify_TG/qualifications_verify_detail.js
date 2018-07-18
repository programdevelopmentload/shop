var localHtttp = 'http://172.16.40.134:8003';
//获取商家审核详情的数据【拉取数据】
var qualification_pullUrl = localHtttp + "/seller/companyExamineAndVerify";
//提交审核处理结果【提交数据】
var qualification_resPushUrl = localHtttp + "/seller/submitExamineAndVerify";
//获取url中的公司id
var _companyId = $.getUrlParam("id");
var _type;
var _isImage = 0;//url中获取吗
var _dismissReason;
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    var resData;
    var _companyId = 8;
    var params={
        companyId:8,//此处不能写死
        applyType:1//此处的值根据具体情况修改
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
                // if($.trim($(".qualification_state").text()) == "已通过"){
                //     $(".verify_btm_operateBox").hide();
                // }else {
                //     $(".verify_btm_operateBox").show();
                // }
            } else {
                alert("未请求到数据")

            }
        },
        error: function () {
        }
    });
    $(".qualification_detail_radio").change(function() {
            var value = $("input[name='qualification_detail_operation']:checked").val();
            if (value == 0) {
                $('.reason_area').hide();
            }else if (value == 1){
                $('.reason_area').show();
            }
        });

    $('.qualification_sureBtn').on('click',function () {
        var value = $('input:radio[name="qualification_detail_operation"]:checked').attr("value");
        _type = value;
        _isImage;
        _dismissReason = $.trim($('.reason_area').val()) ;
        var params = {
            companyId:_companyId,
            type:_type,
            isImage:_isImage,
            dismissReason:_dismissReason
        };
        debugger;
        var reasonFlag = false;
        if(_dismissReason != "请填写拒绝通过的具体理由." || _dismissReason.length>1 ){
            reasonFlag = false;
        }else {
            true
        };
        if(!reasonFlag){
            var html = template('test_mask_catch', {});
            $.popwin(html, {
                title: '未填写完全',
                fixed: true,
                drag: false, //是否可拖拽
            });
            $("#popwin_Out").addClass("attr_manag_add");
            $.popwin.setPosition(410,460);
            $(".attr_manag_add .mask_tip").html("请填写拒绝理由");
            $(".hide_ctr").show();
        }else {
            $(".hide_ctr").hide();
            $.ajax({
                type: "post",
                catch: false,
                url: qualification_resPushUrl,
                dataType: "json",
                data: params,
                success: function (data) {
                    if (data.success == true) {
                        resData = data.data;
                        var html = template("rig_con_ajax", resData);
                        $('.right_con_box').append(html);
                    } else {
                        alert("该等级下有挂载，不可关闭")

                    }
                },
                error: function () {
                }
            });
        }

    })
});


