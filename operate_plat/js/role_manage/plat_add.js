var localHtttp = getBaseUrl('lh');
//添加平台提交地址
var platAdd_Url = localHtttp + '/user/permission/addPlatform';

var regexAdd = /^[\s\S]{1,32}$/;
var regexSign = /^[0-9]{1,3}$/;
var regexDesc = /^[\s\S]{1,200}$/;
var nameflag = false;
var signflag = false;
var descflag = false;

$(function () {
    var addDom = $(".btn_sure");
    $(".platAdd_input").blur(function () {
        debugger;
        if (regexAdd.test($.trim($('.platAdd_input').val()))) {
            $('.platAddTip').hide();
            nameflag = true;
        } else {
            $('.platAddTip').html('不可空置/支持中英文，最多32个字符').show();
            nameflag = false;
        }
    });
    $(".platSign_input").blur(function () {
        if (regexSign.test($.trim($('.platSign_input').val()))) {
            $('.platSign_tip').hide();
            signflag = true;
        } else {
            $('.platSign_tip').html('不可空置/支持数字输入，最多3个数字').show();
            signflag = false;
        }
    });
    $(".platDesc_area").blur(function () {
        if (regexDesc.test($.trim($('.platDesc_area').val())) && $('.platDesc_area').val() != "此处输入平台描述.") {
            $('.platDesc_tip').hide();
            descflag = true;
        } else {
            $('.platDesc_tip').html('不可空置/支持中英文，最多200个字符').show();
            descflag = false;
        }
    });
    addDom.on('click', function () {
        debugger;
        var _platformName = $.trim($('.platAdd_input').val());
        var _platformId = $.trim($('.platSign_input').val());
        var _platformDesc = $.trim($('.platDesc_area').val());

        nameflag = regexAdd.test(_platformName);
        signflag = regexSign.test(_platformId);
        descflag = regexDesc.test(_platformDesc);
        if (!nameflag) {
            $('.platAddTip').html('不可空置/支持中英文，最多32个字符').show();
            nameflag = false;
            return false;
        } else {
            $('.platAddTip').html('不可空置/支持中英文，最多32个字符').hide();
            nameflag = true;
        }
        if (!signflag) {
            $('.platSign_tip').html('不可空置/支持数字输入，最多3个数字').show();
            signflag = false;
            return false;
        } else {
            $('.platSign_tip').html('不可空置/支持数字输入，最多3个数字').hide();
            signflag = true;
        }
        if (!descflag || _platformDesc == "此处输入平台描述.") {
            $('.platDesc_tip').html('不可空置/支持中英文，最多200个字符').show();
            descflag = false;
            return false;
        } else {
            $('.platDesc_tip').html('不可空置/支持中英文，最多200个字符').hide();
            descflag = true;
        }
        param = {
            platformName: _platformName,
            platformId: _platformId,
            platformDesc: _platformDesc,
        };
        if (nameflag && signflag && descflag) {
            addInteract(param);
        } else {

        }
    });
});

function addInteract(paramsPlat) {
    $.ajax({
        url: platAdd_Url,
        type: 'post',
        dataType: 'json',
        data: paramsPlat,
        success: function (data) {
            debugger;
            if (data.success == true) {
                $(".index_mask", parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
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
                $(".attr_manag_add .mask_tip").html("添加成功");
            } else {

            }
        },
        error: function () {

        }
    });
}