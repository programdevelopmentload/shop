var localHtttp = getBaseUrl('yy')
//获取商家审核详情的数据【拉取数据】
var qualification_pullUrl = localHtttp + "/user/seller/selectRecordInfo";
//提交审核处理结果【提交数据】
var qualification_resPushUrl = localHtttp + "/user/seller/submitExamineAndVerify";
//获取url中的公司id
var _companyId = $.getUrlParam("id");
var _log = $.getUrlParam("log");
var _type;
var _isImage = 0;//url中获取吗
var _dismissReason;
var _userId = '1011884059619491840';
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    var resData;
    var params = {
        recordId: _companyId//此处不能写死
    };
    //拉取数据
    $.ajax({
        type: "post",
        catch: false,
        url: qualification_pullUrl,
        dataType: "json",
        data: params,
        success: function (data) {
            if (data.success == true) {
                debugger;
                resData = data.data;
                var html = template("rig_con_ajax", resData);
                $('.right_con_box').append(html);
                $('.qualification_level').html('认证审核');

                if (_log == 1) {
                    $('.verify_btm_operateBox').hide();
                } else {
                    $('.verify_btm_operateBox').show();
                }
            } else {
                debugger;
                // alert("未请求到数据")

            }
        },
        error: function () {
        }
    });

    $(".qualification_detail_radio").change(function () {
        var value = $("input[name='qualification_detail_operation']:checked").val();
        if (value == 0) {
            $('.reason_area').hide();
        } else if (value == 1) {
            $('.reason_area').show();
        }
    });

    $('.qualification_sureBtn').on('click', function () {
        var value = $('input:radio[name="qualification_detail_operation"]:checked').attr("value");
        _type = value;
        _dismissReason = $.trim($('.reason_area').val());
        var params = {
            companyId: _companyId,
            type: _type,
            isImage: _isImage,
            dismissReason: _dismissReason,
            userId: _userId
        };
        var reasonFlag = false;
        debugger;
        if (_type == 1) {
            if (_dismissReason != "请填写拒绝通过的具体理由." && _dismissReason.length > 1) {
                reasonFlag = true;
            } else {
                reasonFlag = false;
            }
            ;
        } else {
            reasonFlag = true;
        }

        if (!reasonFlag) {
            $(".index_mask",parent.document).show();
            var html = template('test_mask_catch', {});
            $.popwin(html, {
                title: '未填写完全',
                fixed: true,
                drag: false, //是否可拖拽
            });
            $("#popwin_Out").addClass("attr_manag_add");
            $.popwin.setPosition(410, 560);
            $("#popwin_Close").on("click", function () {
                $("#popwin_Blank").remove();
                $("#popwin_Out").remove();
                $(".index_mask",parent.document).hide();
            })
            $(".attr_manag_add .mask_tip").html("请填写拒绝理由");
            $(".hide_ctr").show();
        } else {
            $(".hide_ctr").hide();
            $.ajax({
                type: "post",
                catch: false,
                url: qualification_resPushUrl,
                dataType: "json",
                data: params,
                success: function (data) {
                    if (data.success == true) {
                        $(".index_mask",parent.document).show();
                        var html = template('ajax_alert', {});
                        $.popwin(html, {
                            title: '提示',
                            fixed: true,
                            drag: false, //是否可拖拽
                        });
                        $("#popwin_Out").addClass("attr_manag_add");
                        $.popwin.setPosition(410, 560);
                        $("#popwin_Close").on("click", function () {
                            $("#popwin_Blank").remove();
                            $("#popwin_Out").remove();
                            $(".index_mask",parent.document).hide();
                        })
                        $(".attr_manag_add .mask_tip").html(data.message);
                    } else {
                        $(".index_mask",parent.document).show();
                        var html = template('ajax_alert', {});
                        $.popwin(html, {
                            title: '提示',
                            fixed: true,
                            drag: false, //是否可拖拽
                        });
                        $("#popwin_Out").addClass("attr_manag_add");
                        $.popwin.setPosition(410, 560);

                        $("#popwin_Close").on("click", function () {
                            $("#popwin_Blank").remove();
                            $("#popwin_Out").remove();
                            $(".index_mask",parent.document).hide();
                        })
                        $(".attr_manag_add .mask_tip").html(data.message);

                    }
                },
                error: function () {
                }
            });
        }

    })
});


