var renameFlag = false;
var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
var _checkedNum=0;
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    //模拟按钮事件绑定
    // checkAll("show");//测试代码

    //判断顶部是否显示更多更少按钮
    judgeSwitch_ishave();
    topArea_active();
    /**点击批量整合测试按钮*/

    $(".class_test").on("click", classBubble);
    $(".detail_test").on("click",detailBubble);

    $("input[name='testManage']").change(function() {
        _checkedNum = $("input[name='testManage']:checked").length;
        $('.merge_num span').text(_checkedNum);
    });

    $('.go_merge_btn').off('click').on('click',function () {
        if(_checkedNum < 2){
            var html = template('ajax_alert', {});
            $.popwin(html, {
                title: '',
                fixed: true,
                drag: false, //是否可拖拽
            });
            $("#popwin_Out").addClass("attr_manag_add");
            $.popwin.setPosition(410, 460);
            $(".attr_manag_add .mask_tip").html("请至少选择2条");
            return false;
        }else if(_checkedNum > 5 ){
            var html = template('ajax_alert', {});
            $.popwin(html, {
                title: '',
                fixed: true,
                drag: false, //是否可拖拽
            });
            $("#popwin_Out").addClass("attr_manag_add");
            $.popwin.setPosition(410, 460);
            $(".attr_manag_add .mask_tip").html("最多只能勾选5条");
            return false;
        }else{
            window.open('../../html/product_manage/skuNewMerge_mergeCon_mao_funny.html')
        }
    })


    // 首屏加载【首次加载拉取10条】
    // getData(1);
    // 滚动加载
    // $(window).on('scroll', function () {
    //     var offsetTop = $('.self_table_box').offset().top;
    //     var height = $('.self_table_box').height();
    //     var scrollTop = $(this).scrollTop();
    //     var winHeight = $(this).height();
    //     // 计算滚动条的位置
    //     var offset = offsetTop + height - scrollTop - winHeight;
    //     // 判断滚动条位置并禁止重复加载
    //     if(offset <= 150 && !$('.merge_throttle').hasClass('loading')) {
    //         alert(1);
    //         // 获取下一页页码
    //         var page = $('.merge_throttle').attr('data-page');
    //         // 发起请求获取数据
    //         getData(page);
    //     }
    // });
});

/** table数据 */
function fillTableData(data) {
        console.log(data)
        var tr = "tr";
        var content = $("#table_data tbody");
        content.html("");
        for (var i = 0; i < data.length; i++) {
            if (data[i].flag != 0) {
                content.append(
                    // '<a>跳转到'+data[i].param+'这里</a>'
                    '<tr data-id="' + '">' +
                    '<td><input type="checkbox" name="merge_list_items" class="item-check" id=' + data[i].id + '/></td>' +
                    '<td>' + data[i].leafClassName + '</td>' +       //产品信息
                    '<td>' + data[i].publisher + '</td>' +           //整合人
                    '<td>' + getNowFormatDate(data[i].createTime)+ '</td>' +           //整合时间
                    '<td>' + '<a href="./verify_wait_detail.html?id=' +data[i].id + '&state=' + data[i].state+'" >立即审核</a> '+ '</td>' + //操作
                    '</tr>'
                );
            }
        
    }
};
//拉取数据函数
function getData(page) {
    // 请求数据
    $.ajax({
        type: 'post',
        url: 'data.php',
        data: {page: page},
        beforeSend: function () {
            // 加载状态
            $('.merge_throttle').text('正在加载...').addClass('loading');
        },
        success: function (info) {

            // 调用模板引擎
            var html = template('item', info);
            // 添加元素
            $('.items').append(html);

            // 瀑布流布局
            // $('.items').waterFall();

            // 缓存页码
            $('p.tips').attr('data-page', info.page);

        },
        complete: function () {
            $('.merge_throttle').text('点此加载更多').removeClass('loading');
        }
    });
}
//详情弹框
function detailBubble() {
    var html = template('detail_bubble', {});
    $.popwin(html, {
        title: '',
        fixed: true,
        drag: false, //是否可拖拽
    });
    $("#popwin_Out").addClass("attr_manag_add");
    $.popwin.setPosition(500, 1100);
};
//归档弹框
function classBubble() {
    // var idArr = new Array();
    var html = template('class_bubble', {});
    $.popwin(html, {
        title: '',
        fixed: true,
        drag: false, //是否可拖拽
    });
    $("#popwin_Out").addClass("attr_manag_add");
    $.popwin.setPosition(500, 1100);
    $('body').off('click').on('click','.cancle_xsBtn',function(){
        $("#popwin_Blank").remove();
        $("#popwin_Out").remove();
    });
    $(document).off('click').on('click','.sure_xsBtn',function(){
        $("#popwin_Blank").remove();
        $("#popwin_Out").remove();
        //此时开始ajax交互。
    });
}
//判断顶部更多更少按钮是否显示
// function judgeSwitch_ishave() {
//     var _moldKind_switch_length = $(".moldKind_switch>div>span").length;
//     var _moldBrand_switch_length = $(".moldBrand_switch>div>span").length;
//     debugger;
//     if(_moldKind_switch_length>6){
//         $(".moldKind_click").show();
//     }else {
//         $(".moldKind_click").hide();
//     };
//     if(_moldBrand_switch_length>6){
//         $(".moldBrand_click").show();
//     }else {
//         $(".moldBrand_click").hide();
//     };
// }







