var localHtttp = getBaseUrl('yy')
// var localHtttp = getBaseUrl('yy')
var localHtttp_load = getBaseUrl('loadimg')
//获取商家资质审核详情的上半部分的数据【拉取数据】
var qualification_pullUrl = localHtttp + "/user/seller/companyExamineAndVerify";
//获取商家资质审核详情的下半部分的数据【拉取数据】
var qualificationImg_pullUrl = localHtttp + "/user/seller/imagexamineAndVerify";
//提交审核处理结果【提交数据】
var qualification_resPushUrl = localHtttp + "/user/seller/submitExamineAndVerify";
//下载文件地址
var load_imgUrl = localHtttp_load + "/supplierOrder/downloadAndPreview";

//获取url中的公司id
var _companyId = $.getUrlParam("id");
var _log = $.getUrlParam("log");
var _type;
var _isImage = 1;//url中获取吗
var _dismissReason;
// var _userId = '1011884059619491840';
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    var resData;
    var params = {
        companyId: _companyId//此处不能写死
    };

    //拉取上半部分数据
    debugger;
    $.ajax({
        type: "post",
        catch: false,
        url: qualification_pullUrl,
        dataType: "json",
        catch: false,
        sync: false,
        data: params,
        success: function (data) {

            if (data.success == true) {

                resData = data.data;
                var html = template("rig_con_ajax1", resData);
                $('.right_con_box').append(html);
                $('.qualification_level').html('认证审核');

                if (_log == 1) {
                    $('.verify_btm_operateBox').hide();
                } else {
                    $('.verify_btm_operateBox').show();
                }
            } else {
                alert("未请求到数据")

            }
        },
        error: function () {
        },
        complete: function () {
            //拉取下半部分数据
            $.ajax({
                type: "post",
                catch: false,
                url: qualificationImg_pullUrl,
                dataType: "json",
                catch: false,
                sync: false,
                data: params,
                success: function (data) {
                    if (data.success == true) {
                        resData = data.data;
                        var html = template("rig_con_ajax2", resData);
                        $('.right_con_box').append(html);
                        $('.qualification_applyTime').html(resData.applyTime);
                        $(".flagDown").each(function (i, v) {
                            var b = localHtttp_load + $(v).attr("href");
                            $(v).attr("href", b);
                        })
                        if (_log == 1) {
                            $('.verify_btm_operateBox').hide();
                            $('.qualification_manTime_box').removeClass('hide_ctr');
                            $('.qualification_evaTime').html(resData.evaTime);
                            $('.qualification_man').html(resData.evaPerson);
                        } else {
                            $('.verify_btm_operateBox').show();
                            $('.qualification_manTime_box').addClass('hide_ctr');
                        }
                        if (resData.imageState == 3) {
                            $('.qualification_state').html('审核不通过').show();
                            $('.qualification_reson_box .qualification_reson').html(resData.dismissReason).show();
                            $('.qualification_reson_box').show();
                        } else if (resData.imageState == 2) {
                            $('.qualification_state').html('审核通过').show();
                            $('.qualification_reson_box').hide();
                        } else {
                            $('.qualification_state').html('待审核').show();
                            $('.qualification_reson_box').hide();
                        }
                        ;
                    } else {
                        // alert("未请求到数据")

                    }
                },
                error: function () {
                }
            });
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
        debugger;
        var value = $('input:radio[name="qualification_detail_operation"]:checked').attr("value");
        _type = value;
        _dismissReason = $.trim($('.reason_area').val());
        var params = {
            companyId: _companyId,
            type: _type,
            isImage: _isImage,
            dismissReason: _dismissReason
            // userId: _userId
        };
        var reasonFlag = false;

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
            $(".index_mask", parent.document).show();
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
                $(".index_mask", parent.document).hide();
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
                        $(".index_mask", parent.document).show();
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
                            $(".index_mask", parent.document).hide();
                            self.location = document.referrer;
                        })
                        $(".attr_manag_add .mask_tip").html(data.message);
                    } else {
                        $(".index_mask", parent.document).show();
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
                            $(".index_mask", parent.document).hide();
                        })
                        $(".attr_manag_add .mask_tip").html(data.message);

                    }
                },
                error: function () {
                }
            });
        }

    });

});

function jumpBigImg(obj) {
    $this = $(obj);
    var bigImg_src = $this.data('imgsrc');
    console.log(bigImg_src);
    $(".index_mask", parent.document).show();
    var html = template('class_bubble', {});
    $.popwin(html, {
        title: '',
        fixed: true,
        drag: false, //是否可拖拽
    });
    $("#popwin_Out").addClass("bigImg_bubble_add");
    $('.bigImg_bubble_add .jump_bigImg').attr('src', bigImg_src);
    $.popwin.setPosition(900, 1100);
    $('body').off('click').on('click', '.cancle_xsBtn', function () {
        $("#popwin_Blank").remove();
        $("#popwin_Out").remove();
        $(".index_mask", parent.document).hide();
    });
    $(document).off('click').on('click', '.sure_xsBtn', function () {
        $("#popwin_Blank").remove();
        $("#popwin_Out").remove();
        $(".index_mask", parent.document).hide();
        //此时开始ajax交互。
    });
}

function loadBigImg(obj) {
    $this = $(obj);
    var bigImg_src = $this.data('loadsrc');
    var paramms = {
        type: 1,
        downUrl: bigImg_src,
        fileName: '下载图片'
    };
    debugger;
    //拉取下半部分数据
    $.ajax({
        type: "post",
        catch: false,
        url: load_imgUrl,
        dataType: "json",
        catch: false,
        sync: false,
        data: paramms,
        success: function (data) {
            if (data.success == true) {
                debugger
            } else {
                // alert("未请求到数据")
            }
        },
        error: function () {
        }
    });


}


