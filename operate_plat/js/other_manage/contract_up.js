$.sidebarMenu($('.sidebar-menu'));
//分页地址变量
var localUrl = '172.16.40.134:8003';
//上传合同模板地址
var brand_addUrl = localUrl + '/seller/saveContractTempletUrl';
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
var nameflag = false;
var logoflag = false;
var relationflag = false;
var allflag = false;
$(function () {
    //渲染三级分类包含
    var addDom = $(".brandAdd_con_right .agree_add_btn");
    //属性名称输入失焦事件
    $(".everyAdd_input").blur(function(){
        if (regex_reName.test($('.everyAdd_input').val())) {
            $('.brand_name_tip').hide();
            nameflag=true;
        }else{
            $('.brand_name_tip').html('不可空置/支持中英文，最多32个字符').show();
            nameflag=false;
        }
    });

    //主按钮提交数据事件
    addDom.on('click',function () {
        console.log($("#logo_brand_file")[0].files[0]);
        //_name,品牌名称获取
        var _name = $('.everyAdd_input').val(),//@品牌名称
            _logofile = $("#logo_brand_file")[0].files[0];
        _state = +$('input:radio[name="addSwitch"]:checked').attr("value");
        var _leafClassId = "";
        if($(".relation_tip3")){
            $(".relation_tip3 input[type='checkbox']:checked").each(function(i){
                if(i == 0){
                    _leafClassId += $(this).attr("value");
                }else {
                    _leafClassId += "," + $(this).attr("value");
                }
                // _leafClassId.push(+$(this).attr("value"));
            });
        };
        nameflag = regex_reName.test($.trim($('.everyAdd_input').val()));
        if(!nameflag || !_name){
            nameflag = false;
            var html = template('ajax_alert', {});
            $.popwin(html, {
                title: '未填写完全',
                fixed: true,
                drag: false, //是否可拖拽
            });
            $("#popwin_Out").addClass("attr_manag_add");
            $.popwin.setPosition(410,460);
            $(".attr_manag_add .mask_tip").html("请填写属性名称");
            $('.attr_name_tip').html('不可空置/支持中英文，最多32个字符').show();
            return false;
        }else {
            nameflag = true;
            $('.attr_name_tip').hide();
        };
        if(nameflag && !_logofile){
            logoflag = false;
            var html = template('ajax_alert', {});
            $.popwin(html, {
                title: '未填写完全',
                fixed: true,
                drag: false, //是否可拖拽
            });
            $("#popwin_Out").addClass("attr_manag_add");
            $.popwin.setPosition(410,460);
            $(".attr_manag_add .mask_tip").html("未上传品牌logo的图片");
            $('.brand_logo_tip').html('请上传品牌logo的图片').show();
            return false;
        }else {
            logoflag = true;
            $('.brand_logo_tip ').hide();
        };
        if(nameflag && logoflag && !_leafClassId){
            leafClassIdFlag = false;
            var html = template('ajax_alert', {});
            $.popwin(html, {
                title: '未填写完全',
                fixed: true,
                drag: false, //是否可拖拽
            });
            $("#popwin_Out").addClass("attr_manag_add");
            $.popwin.setPosition(410,460);
            $(".attr_manag_add .mask_tip").html("请勾选添加属性的关联分类");
            $('.relation_cate_tip ').html('请勾选添加属性的关联分类').show();
        }else {
            leafClassIdFlag = true;
            $('.relation_cate_tip ').hide();
        };
        if(nameflag && logoflag && relationflag){
            allflag =true;
        }else {
            allflag =true;
        };
        var formData = new FormData();
        formData.append("logo", $("#logo_brand_file")[0].files[0]);//图片
        formData.append("nameCh",_name);//名字
        formData.append("state",_state);//状态
        formData.append("leafClassIds",_leafClassId);//叶子节点

        if(allflag) {
            alert("fuck")
            $.ajax({
                url: brand_addUrl,
                type: 'post',
                dataType: 'json',
                cache:false,
                contentType:false,
                processData:false,
                dataType: 'json',
                data: formData,
                success: function (data) {
                    if (data.success == true) {
                        var html = template('ajax_alert', {});
                        $.popwin(html, {
                            title: '',
                            fixed: true,
                            drag: false, //是否可拖拽
                        });
                        $("#popwin_Out").addClass("attr_manag_add");
                        $.popwin.setPosition(410,460);
                        $(".attr_manag_add .mask_tip").html("添加成功");
                    } else {
                        var msg = "您添加的"+data.message;
                        var html = template('ajax_alert', {});
                        $.popwin(html, {
                            title: '',
                            fixed: true,
                            drag: false, //是否可拖拽
                        });
                        $("#popwin_Out").addClass("attr_manag_add");
                        $.popwin.setPosition(410,460);
                        $(".attr_manag_add .mask_tip").html(msg);
                    }
                }
            });
        }else {
            $('.everyGradeTip').html('不可空置/支持中英文，最多32个字符').show();
        }
    })
})
