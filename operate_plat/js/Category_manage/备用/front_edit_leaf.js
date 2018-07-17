var localHtttp = 'http://172.16.41.23:8007';
var everyGrade_Url = localHtttp +'/goods/GoodsClassification/add';
var regexAdd = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
var allFlag = false;
var nameFlag = false;
var relationFlag = false;

$.sidebarMenu($('.sidebar-menu'));
var _parentId = $.getUrlParam("parentId");
var _isLeaf = $.getUrlParam("isLeaf");//是否是叶子节点

var _id = $.getUrlParam("id");//本行数据id
var _level = $.getUrlParam("level");//分类等级
$(function () {
    debugger;
    if(_level == 1){
        $(".blongFlag").hide();
        $(".everyGrade_level").text('一级分类')
    }else {
        $(".blongFlag").show();
    };

    var addDom = $(".cate_everyAdd_con_right .btn_sure"),
        addUrl = everyGrade_Url;


    $(".everyAdd_input").blur(function(){
        if (regexAdd.test($('.everyAdd_input').val())) {
            $('.everyGradeNameTip').hide();
            nameFlag=true;
        }else{
            $('.everyGradeNameTip').html('不可空置/支持中英文，最多32个字符').show();
            nameFlag=false;
        }
    });
    addDom.on('click',function () {
        var name = $('.everyAdd_input').val(),
            state = +$('input:radio[name="addSwitch"]:checked').attr("value"),
            _isLeaf = 0,
            _parentId = 0;
        debugger;
        nameFlag = regexAdd.test($('.everyAdd_input').val());
        if(!nameFlag){
            leafClassIdFlag = false;
            var html = template('test_mask_catch', {});
            $.popwin(html, {
                title: '未填写完全',
                fixed: true,
                drag: false, //是否可拖拽
            });
            $("#popwin_Out").addClass("attr_manag_add");
            $.popwin.setPosition(410,460);
            $(".attr_manag_add .mask_tip").html("请填写分类名称");
            $('.everyGradeNameTip ').html('请填写分类名称').show();
        }else {
            $('.everyGradeNameTip ').html('请填写分类名称').hide();
        };
        // param = {
        //     name:name,
        //     state:state,
        //     isLeaf:_isLeaf,
        //     parentId:_parentId
        // };
        //此处留出三级联动的验证【还有登录的问题】
        if(nameFlag && relationFlag){
            allFlag = true;
        }else {
            allFlag = false;
        }
        if(allFlag) {
            $.ajax({
                type: "post",
                url: everyGrade_Url,
                dataType: "json",
                data: param,
                success: function (data) {
                    debugger;
                    if (data.success == true) {//判断返回参数中某个数据，不是这个
                        alert("添加成功")
                    } else {
                        alert('该分类名已经存在')
                    }
                },
                error: function () {
                }
            });
        }else {
        }
    })
})