var regex_reName = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,32}$/;
var _id = +$.getUrlParam("id");//本行数据id
var _isLeaf = $.getUrlParam("isLeaf");//是否是叶子节点
var _levelSign = $.getUrlParam("level");//本行数据id

var _state;
var _nowPage = 1;
var _name;
//前缀地址变量
// var localHtttp = 'http://172.16.41.23:8007';
var localHtttp = getBaseUrl('w');
//id名拉取顶部详情地址
var everyGradeInfo_Url = localHtttp + '/goods/GoodsClassificationFront/findByIdCh';
//关闭开启按钮请求地址
var attr_switchUrl = localHtttp + '/goods/GoodsClassificationFront/openClose';
//删除函数
var attr_delUrl = localHtttp + '/goods/GoodsClassificationFront/del';
//改名函数
var attr_renameUrl = localHtttp + '/goods/GoodsClassificationFront/change';
//品牌交互url
// var brand_pageUrl = localHtttp + '/goods/brand/findByClassId';
//属性交互url
// var attr_pageUrl = localHtttp + '/goods/attribute/findByClassId';
//每一级详情【分页】
var everyGrade_url = localHtttp + '/goods/GoodsClassificationFront/showSonPage';
//行上移
var upUrl = localHtttp + '/goods/GoodsClassificationFront/upClass';
//行置顶
var topUrl = localHtttp + '/goods/GoodsClassificationFront/topClass';
//行下移
var downUrl = localHtttp + '/goods/GoodsClassificationFront/downClass';
//行置底
var bottomUrl = localHtttp + '/goods/GoodsClassificationFront/bottomClass';
var url_page_input;//输入url参数。
var pagination;
var searchPage;
var getParams;
var fillTableData;
$.sidebarMenu($('.sidebar-menu'));
// var _selfUrl = window.location.href;
$('.sky').click(function () {
    self.location = document.referrer;
});
$(function () {
    //拉取id对应详细信息
    //根据id拉取顶部信息
    top_InfoPull();
    //switch开关控制事件
    $('.everyGrade_switch').on('click', function () {
        debugger;
        if (_state == 0) {
            _up_State = 1;
        } else {
            _up_State = 0;
        }
        var params = {
            id: _id,
            state: _up_State
        };
        switch_runFun_top(params);
    });
    //删除触发
    $('.everyGrade_dele').on('click', function () {
        var params = {
            id: _id
        };
        delete_runFun_top(params);
    });
    //更改名称触发函数事件
    // $('.everyGrade_rename').on('click', function () {
    //     var html = template('test_mask_catch', {});
    //     $.popwin(html, {
    //         title: '更改名称',
    //         fixed: true,
    //         drag: false, //是否可拖拽
    //     });
    //     $("#popwin_Out").addClass("grade_RenameStyle");
    //     $.popwin.setPosition(410,460);
    //
    //     var _oldName = $(".everyGrade_name").text();//旧名称返回参数好像没有啊
    //     $(".grade_RenameStyle .grade_nowName_address").html(_oldName);
    //     var _newName = $('.grade_newName_input').val();
    //     var rename_sureDom = $('.rename_sure');
    //     $(".grade_newName_input").blur(function () {
    //         var _newName = $('.grade_newName_input').val();
    //         if (regex_reName.test(_newName)) {
    //             $('.grade_newName_tip').hide();
    //             renameFlag = true;
    //         } else {
    //             $('.grade_newName_tip').html('不可空置/支持中英文，最多32个字符').show();
    //             renameFlag = false;
    //         }
    //     });
    //     rename_sureDom.on('click', function () {
    //         var _newName = $('.grade_newName_input').val(),
    //             renameFlag = regex_reName.test($('.grade_newName_input').val());
    //         param = {
    //             id: _id,
    //             name: _newName
    //         };
    //         if (renameFlag) {
    //
    //             grade_Rename_link_top(param);
    //         } else {
    //             $('.everyGradeTip').html('不可空置/支持中英文，最多32个字符').show();
    //         }
    //     })
    // });

    // 渲染分页
    if (_levelSign != 3) {

        pageRun(_levelSign, everyGrade_url);
    } else {
        debugger;
        pageRun(_levelSign);
    }
    //抓取首屏分页列表
    searchPage();
    //事件触发有五个。【添加按钮为页面跳转行为控制】
    //品牌和属性点击切换事件
    $(".switch_page_con").on('click', 'li', function () {
        var index = $(this).index();
        $(this).addClass("switch_active").siblings().removeClass("switch_active");
        var urlFlag = $(this).data('id');//detail_brand//detail_attr
        if (urlFlag == 'detail_brand') {
            url_page_input = brand_pageUrl;
        } else {
            url_page_input = attr_pageUrl;
        }
        pageRun(_levelSign, url_page_input)//首参传入地址,二参传入级别
        // $(".exam_help .content").hide();
        // $(".exam_help .content").eq(index).show();

    });
    //调节分页行数执行事件
    $('.pageSize_switch').on('change', function () {

        searchPage();
    });
});

/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */


function pageRun(levelFlag, pageUrl) {

    var pageUrl = pageUrl || brand_pageUrl;
    // if (levelFlag == 3) {
    //
    //     if (pageUrl == brand_pageUrl) {
    //         pagination = new Pagination(pageUrl, "page", function (data) {
    //             fillTableData(data)
    //         });
    //
    //         searchPage = function (page) {//首次两参进入
    //             pagination.search(getParams(), page);
    //         };
    //
    //         /** 得到搜索条件的json对象 */
    //         getParams = function getParams() {
    //             var pageSize = $('.pageSize_switch').val();
    //             var params = {
    //                 'classId': _id,
    //                 'pageSize': pageSize
    //                 // 'currentPage': 1,
    //
    //             };
    //             return params;
    //         };
    //
    //         /** table数据 */
    //         fillTableData = function fillTableData(data) {
    //             //
    //             if (data.length == 0) {   //没有资源时
    //                 $("#pic_no").show();
    //                 $(".pageSize_switch_con").hide();
    //                 $("#table_data").hide();
    //                 $(".leftBottom").hide();
    //             } else {
    //                 var th_table_All = '<th class="th_table1">序号</th>' +
    //                     '<th class="th_table2">品牌名称</th>' +
    //                     '<th class="th_table3">品牌图片</th>';
    //                 $('.th_table_con').html(th_table_All);
    //                 $("#pic_no").hide();
    //                 $("#table_data").show();
    //                 $(".leftBottom").show();
    //                 var tr = "tr";
    //                 var content = $("#table_data tbody");
    //                 var content1 = $(".sky");
    //                 content.html("");
    //                 for (var i = 0; i < data.length; i++) {
    //                     if (data[i].flag != 0) {
    //                         content.append(
    //                             // '<a>跳转到'+data[i].param+'这里</a>'
    //                             '<tr data-id="' + '">' +
    //                             '<td>' + data[i].name + '</td>' +       //分类名称
    //                             '<td>' + data[i].level + '</td>' +       //分类等级
    //                             '<td>' + data[i].state + '</td>' +       //分类状态
    //                             '<td >' + ' <a class="_look sm btn-sm btn-primary" href="./backstage_everyGrade_detail.html?id=' + data[i].id + '&name=' + data[i].name + '&updateTime=' + data[i].updateTime + '&state=' + data[i].state + '&isLeaf=' + data[i].isLeaf + '&level=' + data[i].level + '">查看</a><button class="_change btn-sm btn-warning">更改名称</button><button class="_open btn-sm btn-success">开启</button><button class="_close sm btn-danger btn-sm">删除</button>' + '</td>' +       //操作
    //                             '</tr>'
    //                         );
    //                     }
    //                 }
    //                 ;
    //
    //             }
    //         }
    //     } else {
    //         pagination = new Pagination(pageUrl, "page", function (data) {
    //             fillTableData(data)
    //         });
    //
    //         searchPage = function (page) {//首次两参进入
    //             pagination.search(getParams(), page);
    //         };
    //
    //         /** 得到搜索条件的json对象 */
    //         getParams = function getParams() {
    //             var pageSize = $('.pageSize_switch').val();
    //             var params = {
    //                 'classId': _id,
    //                 'pageSize': pageSize
    //                 // 'currentPage': 1,
    //
    //             };
    //             return params;
    //         };
    //
    //         /** table数据 */
    //         fillTableData = function fillTableData(data) {
    //             //
    //             if (data.length == 0) {   //没有资源时
    //                 $("#pic_no").show();
    //                 $(".pageSize_switch_con_son1").hide();
    //                 $("#table_data").hide();
    //                 $(".leftBottom").hide();
    //             } else {
    //                 var th_table_All = '<th class="th_table1">序号</th>' +
    //                     '<th class="th_table2">属性名称</th>' +
    //                     '<th class="th_table3">属性类型</th>';
    //                 $('.th_table_con').html(th_table_All);
    //                 $("#pic_no").hide();
    //                 $("#table_data").show();
    //                 $(".leftBottom").show();
    //                 var tr = "tr";
    //                 var content = $("#table_data tbody");
    //                 var content1 = $(".sky");
    //                 content.html("");
    //                 for (var i = 0; i < data.length; i++) {
    //                     if (data[i].flag != 0) {
    //                         content.append(
    //                             // '<a>跳转到'+data[i].param+'这里</a>'
    //                             '<tr data-id="' + '">' +
    //                             '<td>' + data[i].name + '</td>' +       //分类名称
    //                             '<td>' + data[i].level + '</td>' +       //分类等级
    //                             '<td>' + data[i].state + '</td>' +       //分类状态
    //                             '<td >' + ' <a class="_look sm btn-sm btn-primary" href="./backstage_everyGrade_detail.html?id=' + data[i].id + '&name=' + data[i].name + '&updateTime=' + data[i].updateTime + '&state=' + data[i].state + '&isLeaf=' + data[i].isLeaf + '&level=' + data[i].level + '">查看</a><button class="_change btn-sm btn-warning">更改名称</button><button class="_open btn-sm btn-success">开启</button><button class="_close sm btn-danger btn-sm">删除</button>' + '</td>' +       //操作
    //                             '</tr>'
    //                         );
    //                     }
    //                 }
    //                 ;
    //
    //             }
    //         }
    //     }
    //     return searchPage;
    // }
    if (levelFlag == '1') {
        debugger;
        pageUrl = everyGrade_url;
        pagination = new Pagination(pageUrl, "page", function (data) {
            fillTableData(data)
        });

        searchPage = function (page) {//首次两参进入
            pagination.search(getParams(), page);
        };

        /** 得到搜索条件的json对象 */
        getParams = function getParams() {
            var pageSize = $('.pageSize_switch').val();
            var params = {
                'id': _id,
                'pageSize': pageSize
                // 'currentPage': 1,

            };
            return params;
        };

        /** table数据 */
        fillTableData = function fillTableData(data) {
            debugger;
            if (data.length == 0) {   //没有资源时
                $("#pic_no").show();
                $(".pageSize_switch_con_son1").hide();
                $("#table_data").hide();
                $(".leftBottom").hide();
            } else {
                // var th_table_All = '<th class="th_table1">分类名称</th>' +
                //     '<th class="th_table2">分类等级</th>' +
                //     '<th class="th_table3">分类状态</th>'+
                //     '<th class="th_table4">操作</th>';
                // $('.th_table_con').html(th_table_All);
                $("#pic_no").hide();
                $("#table_data").show();
                $(".leftBottom").show();
                var tr = "tr";
                var content = $("#table_data tbody");
                var content1 = $(".sky");
                content.html("");
                for (var i = 0; i < data.length; i++) {
                    if (data[i].flag != 0) {
                        content.append(
                            // '<a>跳转到'+data[i].param+'这里</a>'
                            '<tr data-id="' + '">' +
                            '<td>' + data[i].name + '</td>' +       //分类名称
                            '<td>' + levelDraw(data[i].level) + '</td>' +       //分类等级
                            '<td data-id="' + data[i].id + '"><span class="moveTop icon iconfont top_arrow" onclick="moveTop(this)"></span><span class="moveUp icon iconfont up_arrow" onclick="moveUp(this)"></span><span class="moveDown icon iconfont down_arrow" onclick="moveDown(this)"></span><span class="moveBottom icon iconfont bottom_arrow" onclick=" moveBottom(this)"></span></td>' +       //移动
                            '<td>' + stateDraw(data[i].state) + '</td>' +       //图片
                            '<td>' + stateDraw(data[i].state) + '</td>' +       //分类状态
                            // '<td data-id="' + data[i].id + '" data-state="' + data[i].state + '" data-name="' + data[i].name + '">' + ' <a class="_look sm btn-sm btn-primary" href="'+lookHref() + data[i].id + '&name=' + data[i].name + '&updateTime=' + data[i].updateTime + '&state=' + data[i].state + '&isLeaf=' + data[i].isLeaf + '&level=' + data[i].level + '">查看</a><button class="_change btn-sm btn-warning" onclick="grade_Rename(this)">更改名称</button><button class="_open btn-sm btn-success" onclick="grade_Switch(this,attr_switchUrl)">'+ ctr_Switch(data[i].state)+'</button><button class="_close sm btn-danger btn-sm" onclick="grade_Delete(this,attr_delUrl)">删除</button>' + '</td>' +       //操作
                            // '<td data-id="' + data[i].id + '" data-state="' + data[i].state + '" data-name="' + data[i].name + '">' + ' <a class="_look sm btn-sm btn-primary" href="'+lookHref() + data[i].id + '&name=' + data[i].name + '&updateTime=' + data[i].updateTime + '&state=' + data[i].state + '&isLeaf=' + data[i].isLeaf + '&level=' + data[i].level + '">查看</a><a class="_change btn-sm btn-warning" href="'+lookHref() + data[i].id + '&name=' + data[i].name + '&updateTime=' + data[i].updateTime + '&state=' + data[i].state + '&isLeaf=' + data[i].isLeaf + '&level=' + data[i].level + '">编辑</a><button class="_open btn-sm btn-success" onclick="grade_Switch(this,attr_switchUrl)">'+ ctr_Switch(data[i].state)+'</button><button class="_close sm btn-danger btn-sm" onclick="grade_Delete(this,attr_delUrl)">删除</button>' + '</td>' +       //操作
                            '<td data-id="' + data[i].id + '" data-statetab="' + data[i].state + '" data-name="' + data[i].name + '">' + ' <a class="_look page_miniBtn" href="' + lookHref() + data[i].id + '&name=' + data[i].name + '&updateTime=' + data[i].updateTime + '&state=' + data[i].state + '&isLeaf=' + data[i].isLeaf + '&level=' + data[i].level + '">查看</a><button class="_open page_miniBtn" onclick="grade_Switch(this,attr_switchUrl)">' + ctr_Switch(data[i].state) + '</button><button class="_close page_miniBtn" onclick="grade_Delete(this,attr_delUrl)">删除</button>' + '</td>' +       //操作
                            '</tr>'
                        );
                    }
                }
                ;

            }
        }
        return searchPage;
    } else if (levelFlag == '2') {
        pageUrl = everyGrade_url;
        pagination = new Pagination(pageUrl, "page", function (data) {
            fillTableData(data)
        });

        searchPage = function (page) {//首次两参进入
            pagination.search(getParams(), page);
        };

        /** 得到搜索条件的json对象 */
        getParams = function getParams() {
            var pageSize = $('.pageSize_switch').val();
            var params = {
                'id': _id,
                'pageSize': pageSize
                // 'currentPage': 1,

            };
            return params;
        };

        /** table数据 */
        fillTableData = function fillTableData(data) {
            debugger;
            if (data.length == 0) {   //没有资源时
                $("#pic_no").show();
                $(".pageSize_switch_con_son1").hide();
                $("#table_data").hide();
                $(".leftBottom").hide();
            } else {
                // var th_table_All = '<th class="th_table1">分类名称</th>' +
                //     '<th class="th_table2">分类等级</th>' +
                //     '<th class="th_table3">分类状态</th>'+
                //     '<th class="th_table4">操作</th>';
                // $('.th_table_con').html(th_table_All);
                $("#pic_no").hide();
                $("#table_data").show();
                $(".leftBottom").show();
                var tr = "tr";
                var content = $("#table_data tbody");
                var content1 = $(".sky");
                content.html("");
                for (var i = 0; i < data.length; i++) {
                    debugger;
                    if (data[i].flag != 0) {
                        content.append(
                            // '<a>跳转到'+data[i].param+'这里</a>'
                            '<tr data-id="' + '">' +
                            '<td>' + data[i].name + '</td>' +       //分类名称
                            '<td>' + levelDraw(data[i].level) + '</td>' +       //分类等级
                            '<td data-id="' + data[i].id + '"><span class="moveTop icon iconfont top_arrow" onclick="moveTop(this)"></span><span class="moveUp icon iconfont up_arrow" onclick="moveUp(this)"></span><span class="moveDown icon iconfont down_arrow" onclick="moveDown(this)"></span><span class="moveBottom icon iconfont bottom_arrow" onclick=" moveBottom(this)"></span></td>' +       //移动
                            '<td><img class="brand_img" src="' + data[i].picUrl + '" alt=""></td>' +       //图片+       //分类状态
                            '<td>' + stateDraw(data[i].state) + '</td>' +       //分类状态
                            // '<td data-id="' + data[i].id + '" data-state="' + data[i].state + '" data-name="' + data[i].name + '">' + ' <a class="_look sm btn-sm btn-primary" href="'+lookHref() + data[i].id + '&name=' + data[i].name + '&updateTime=' + data[i].updateTime + '&state=' + data[i].state + '&isLeaf=' + data[i].isLeaf + '&level=' + data[i].level + '">查看</a><a class="_change btn-sm btn-warning" href="'+lookHref() + data[i].id + '&name=' + data[i].name + '&updateTime=' + data[i].updateTime + '&state=' + data[i].state + '&isLeaf=' + data[i].isLeaf + '&level=' + data[i].level + '">编辑</a><button class="_open btn-sm btn-success" onclick="grade_Switch(this,attr_switchUrl)">'+ ctr_Switch(data[i].state)+'</button><button class="_close sm btn-danger btn-sm" onclick="grade_Delete(this,attr_delUrl)">删除</button>' + '</td>' +       //操作
                            '<td data-id="' + data[i].id + '" data-statetab="' + data[i].state + '" data-name="' + data[i].name + '">' + ' <a class="_look page_miniBtn" href="' + lookHref() + data[i].id + '&name=' + data[i].name + '&updateTime=' + data[i].updateTime + '&state=' + data[i].state + '&isLeaf=' + data[i].isLeaf + '&level=' + data[i].level + '">查看</a><button class="_open page_miniBtn" onclick="grade_Switch(this,attr_switchUrl)">' + ctr_Switch(data[i].state) + '</button><button class="_close page_miniBtn" onclick="grade_Delete(this,attr_delUrl)">删除</button>' + '</td>' +       //操作
                            '</tr>'
                        );
                    }
                }
                ;

            }
        }
        return searchPage;
    }
}

//根据id拉取顶部信息
function top_InfoPull() {
    debugger;
    var param = {
        id: _id
    }
    $.ajax({
        type: "post",
        url: everyGradeInfo_Url,
        sync: false,
        cache: false,
        dataType: "json",
        data: param,
        success: function (data) {
            debugger;
            if (data.success == true) {
                var res = data.data;
                _state = res.state;
                var _level = res.level;
                var res = data.data;
                _name = res.name;
                var _updateTime = getNowFormatDate(res.updateTime);
                var blongType = res.path;
                level_word(_level);
                attr_nameDraw(_name);
                attr_switchDraw(_state);
                everyGrade_switch(_state);
                blongDraw(blongType);
                attr_timeDraw(_updateTime);
                everyGrade_switch(_state);
                if (_levelSign == '3') {
                    $(".evg_msg_middle").show();
                    $(".switch_page_con").show();
                    $('.everyGradeAdd').html().hide();//
                    $('.guide_content').html('关联信息');
                } else if (_levelSign == '2') {

                    $(".evg_msg_middle").show();
                    $(".switch_page_con").hide();
                    $('.everyGradeAdd').html("添加叶子分类");//
                    // $('.everyGradeAdd').attr('href','./front_everyGrade_add.html?selfId='+_id+'&isLeaf=1&editSign=0')
                    $('.everyGradeAdd').off("click").on("click", function () {
                        debugger;
                        if (_state == 0) {
                            debugger;
                            window.location.href = "../../html/Category_manage/front_everyGrade_add.html?selfId=" + _id + "&isLeaf=1&editSign=0&level=3";
                            // window.location.href = "https://www.baidu.com/";
                            window.event.returnValue = false;
                        } else {
                            alert("分类状态目前关闭，请打开后添加")
                            window.location.reload();
                        }
                    });
                    $('.everyGrade_rename').attr('href', './front_everyGrade_edit.html?selfId=' + _id + '&isLeaf=0&editSign=1&level=2&name=' + _name);
                    $('switch_page_con').hide();
                    $('.guide_content').html('下级分类');
                } else {
                    //一级详情进入
                    $(".evg_msg_middle").hide();
                    $(".switch_page_con").hide();
                    $('.everyGrade_rename').attr('href', './front_everyGrade_edit.html?selfId=' + _id + '&isLeaf=0&editSign=1&level=2&name=' + _name);
                    $('.everyGradeAdd').html("添加二级分类");//
                    // $('.everyGradeAdd').attr('href','./front_everyGrade_add.html?selfId='+_id+'&isLeaf=0&editSign=0')
                    $('.guide_content').html('下级分类');
                }
                ;
            } else {
                $(".index_mask",parent.document).show();
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
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html("连接失败");
                // alert('失败')
            }
        },
        error: function () {
            debugger;
        }
    });
};

/*查看按钮地址渲染函数*/
function lookHref() {

    var lookUrl;
    if (_levelSign == 1) {
        lookUrl = './front_twoGrade_detail.html?editSign=1&id=';
    } else if (_levelSign == 2) {
        lookUrl = './front_leafGrade_detail.html?editSign=1&id=';
    }
    return lookUrl;
}

/*开关后台交互执行函数[顶部区域]*/
function switch_runFun_top(params) {
    debugger;
    var switch_runUrl = attr_switchUrl;

    $.ajax({
        type: "post",
        url: switch_runUrl,
        sync: false,
        dataType: "json",
        data: params,
        success: function (data) {
            debugger;
            if (data.success == true) {//判断某个数

                top_InfoPull();
            } else {

                $(".index_mask",parent.document).show();
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
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html("有子类挂载，解除所有挂载才能关闭");
                // alert('有子类挂载，阻止关闭')
            }
        },
        error: function () {
            debugger;

        }
    });
}

/*开关后台交互执行函数【分页区域】*/
function switch_runFun_page(params) {
    var switch_runUrl = attr_switchUrl;

    $.ajax({
        type: "post",
        url: switch_runUrl,
        sync: false,
        dataType: "json",
        data: params,
        success: function (data) {
            if (data.success == true) {//判断某个数
                searchNowPage();
                searchPage(_nowPage);
            } else {

                $(".index_mask",parent.document).show();
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
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html("有子类挂载，解除所有挂载才能关闭");
                // alert('有子类挂载，阻止关闭')
            }
        },
        error: function () {

        }
    });
}

/*开关按钮内部文字渲染函数*/
function everyGrade_switch(_state) {
    if (_state == 0) {
        $('.everyGrade_switch').html('关闭')
    } else {
        $('.everyGrade_switch').html('开启')
    }
    ;
};

//回显父辈从属分类关系
function blongDraw(blongType) {
    $('.everyGrade_oneFatherName').html(blongType);
};

//回显分类名称
function attr_nameDraw(_name) {
    var str = '';
    if (!_name) {
        str += '无';
    } else {
        str += _name;
    }
    $('.everyGrade_name').html(str);
};

//回显顶部分类状态关闭开启
function attr_switchDraw(_state) {
    var str = '';
    if (_state == 0) {
        str += '正常';
    } else {
        str += '已关闭';
    }
    $('.everyGrade_state').html(str)
};

//回显创建时间
function attr_timeDraw(_updateTime) {
    var updateTimeRes = getNowFormatDate(_updateTime);
    var fisrtTime = updateTimeRes.substr(0, 10);
    var secondTime = updateTimeRes.substr(11);
    if (!_updateTime) {
        $('.everyGrade_ymd').parent().html('显示异常');
    } else {
        $('.everyGrade_ymd').html(fisrtTime);
        $('.everyGrade_hms').html(secondTime);
    }
    ;
};

//分类等级单词渲染
function level_word(_level) {
    var str = "";
    if (_level == 1) {
        str = "一级"
    } else if (_level == 2) {
        str = "二级"
    } else {
        str = "叶子分类"
    }
    ;
    $(".everyGrade_level").html(str);
};

/*删除数据执行函数[顶部]*/
function delete_runFun_top(params) {
    var delete_runUrl = attr_delUrl;
    $.ajax({
        type: "post",
        sync: false,
        url: delete_runUrl,
        dataType: "json",
        data: params,
        success: function (data) {
            debugger;
            if (data.success == true) {//判断返回参数中某个数据，不是这个
                debugger;
                // window.location.href = _selfUrl;
                // window.location.href = document.referrer;
                history.go(-1);
                // 直接删除然后刷新数据
            } else {
                $(".index_mask",parent.document).show();
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
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html(data.message);
                // alert('此分类有子类，请先删除子类')
            }
        },
        error: function () {
            $(".index_mask",parent.document).show();
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
                $(".index_mask",parent.document).hide();
            })
            $(".attr_manag_add .mask_tip").html("未连接到数据库");
            // alert('未连接到数据库')
        }
    });
};

/*删除单行数据执行函数[分页]*/
function delete_runFun_page(params) {
    debugger;
    var delete_runUrl = attr_delUrl;
    $.ajax({
        type: "post",
        sync: false,
        url: delete_runUrl,
        dataType: "json",
        data: params,
        success: function (data) {
            debugger;
            if (data.success == true) {//判断返回参数中某个数据，不是这个
                searchNowPage();
                searchPage(_nowPage);
                // 直接删除然后刷新数据
            } else {
                $(".index_mask",parent.document).show();
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
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html(data.message);
                // alert('此分类有子类，请先删除子类')
            }
        },
        error: function () {
            $(".index_mask",parent.document).show();
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
                $(".index_mask",parent.document).hide();
            })
            $(".attr_manag_add .mask_tip").html("未连接到数据库");
            // alert('未连接到数据库')
        }
    });
};

/*更改名称触发函数*/
function grade_Rename(obj) {
    $(".index_mask",parent.document).show();
    var html = template('test_mask_catch', {});
    $.popwin(html, {
        title: '更改名称',
        fixed: true,
        drag: false, //是否可拖拽
    });
    $("#popwin_Out").addClass("grade_RenameStyle");
    $.popwin.setPosition(410, 560);
    $("#popwin_Close").on("click", function () {
        $("#popwin_Blank").remove();
        $("#popwin_Out").remove();
        $(".index_mask",parent.document).hide();
    })

    var $this = $(obj);
    var _id = $this.parent().data("id");
    var _oldName = $this.parent().data("name");

    $(".grade_RenameStyle .grade_nowName_address").html(_oldName);
    var rename_sureDom = $('.rename_sure');
    $(".grade_newName_input").blur(function () {
        if (regex_reName.test($('.grade_newName_input').val())) {

            $('.grade_newName_tip').hide();
            renameFlag = true;
        } else {
            $('.grade_newName_tip').html('不可空置/支持中英文，最多32个字符').show();
            renameFlag = false;
        }
    });
    rename_sureDom.on('click', function () {

        var _newName = $('.grade_newName_input').val(),
            renameFlag = regex_reName.test($('.grade_newName_input').val());
        param = {
            id: _id,
            name: _newName
        };

        if (renameFlag) {
            grade_Rename_link_page(param, attr_renameUrl);
        } else {
            $('.grade_newName_tip').html('不可空置/支持中英文，最多32个字符').show();
        }
    })
}

/*更改名称交互函数[顶部区域]*/
function grade_Rename_link_top(params) {

    $.ajax({
        url: attr_renameUrl,
        type: 'post',
        sync: false,
        dataType: 'json',
        data: params,
        success: function (data) {
            if (data.message == '成功') {
                $('#popwin_Close').click();//@此处思考下到底怎么处理
                top_InfoPull();
                $(".index_mask",parent.document).show();
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
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html("更改名称成功");
                // alert('更改名称成功');
            } else {
                $(".index_mask",parent.document).show();
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
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html("该名称已经存在");
                // alert('该名称已经存在')
            }
        },
        error: function () {
            $(".index_mask",parent.document).show();
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
                $(".index_mask",parent.document).hide();
            })
            $(".attr_manag_add .mask_tip").html("连接错误");
            // alert('连接错误');
        }
    });
}

/*更改名称交互函数[顶部区域]*/
function grade_Rename_link_page(params) {

    $.ajax({
        url: attr_renameUrl,
        type: 'post',
        sync: false,
        dataType: 'json',
        data: params,
        success: function (data) {
            if (data.message == '成功') {
                $('#popwin_Close').click();//@此处思考下到底怎么处理
                searchNowPage();
                searchPage(_nowPage);
                $(".index_mask",parent.document).show();
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
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html("更改名称成功");
                // alert('更改名称成功');
            } else {
                $(".index_mask",parent.document).show();
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
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html("该名称已经存在");
                // alert('该名称已经存在')
            }
        },
        error: function () {
            $(".index_mask",parent.document).show();
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
                $(".index_mask",parent.document).hide();
            })
            $(".attr_manag_add .mask_tip").html("连接错误");
            // alert('连接错误');
        }
    });
}

/*分类状态中文汉字渲染函数*/
function stateDraw(params) {
    var str = '';
    if (params == 0) {
        str += '开启'
    } else {
        str += '关闭'
    }
    return str;
};

/*开关渲染控制函数*/
function ctr_Switch(params) {
    var str = "";
    // var $this = $(obj);
    // var _state = $this.parent().data("state");

    if (params == 0) {//0是开启
        str += '关闭';
    } else {
        str += '开启';
    }
    return str;
}

/*开关控制函数*/
function grade_Switch(obj, switch_runUrl) {

    //抓取该行数据id
    var $this = $(obj);
    var _id = $this.parent().data("id");
    var old_state = parseInt($this.parent().data("statetab"));
    var push_state;
    if (old_state == 0) {
        push_state = 1
    } else {
        push_state = 0;
    }
    var params = {
        id: _id,
        state: push_state
    };
    switch_runFun_page(params, switch_runUrl);
}

/*单行删除按钮触发函数*/
function grade_Delete(obj, delete_runUrl) {
    //抓取该行数据id
    var $this = $(obj);
    var _id = $this.parent().data("id");
    var params = {
        id: _id
    };
    delete_runFun_page(params, delete_runUrl);
}

/*分页分类等级中文汉字渲染函数*/
function levelDraw(params) {
    var str = '';
    if (params == 1) {
        str += '一级'
    } else if (params == 2) {
        str += '二级'
    } else {

        str += '叶子分类'
    }
    return str;
};

//每行上移执行函数
function moveUp(obj) {
    $this = $(obj);
    var _id = $this.parent().data("id");
    var params = {
        id: _id
    };
    $.ajax({
        url: upUrl,
        type: 'post',
        catch: false,
        sync: false,
        dataType: 'json',
        data: params,
        success: function (data) {
            if (data.success == true) {
                $('#popwin_Close').click();//@此处思考下到底怎么处理
                $(".index_mask",parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410, 560);
                $(".attr_manag_add .mask_tip").html("移动成功");
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask",parent.document).hide();
                })
                searchNowPage();
                searchPage(_nowPage);
                // alert('更改名称成功');
            } else {
                $(".index_mask",parent.document).show();
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
                    $(".index_mask",parent.document).hide();
                })
                if(data.errorCode!=0){
                    $(".attr_manag_add .mask_tip").html(data.message);
                }
                // alert('该名称已经存在')
            }
        }
    });
}

//每行置顶执行函数
function moveTop(obj) {
    $this = $(obj);
    var _id = $this.parent().data("id");
    var params = {
        id: _id
    };

    $.ajax({
        url: topUrl,
        type: 'post',
        catch: false,
        sync: false,
        dataType: 'json',
        data: params,
        success: function (data) {

            if (data.success == true) {
                $('#popwin_Close').click();//@此处思考下到底怎么处理
                $(".index_mask",parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410, 560);
                $(".attr_manag_add .mask_tip").html("移动成功");
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask",parent.document).hide();
                })
                searchNowPage();
                searchPage(_nowPage);//当我完成交互，刷新分页的时候，目前并没有完成功能
                // alert('更改名称成功');
            } else {
                $(".index_mask",parent.document).show();
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
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html("连接错误");
                // alert('该名称已经存在')
            }
        }
    });
}

//每行下移执行函数
function moveDown(obj) {
    $this = $(obj);
    var _id = $this.parent().data("id");
    var params = {
        id: _id
    };
    $.ajax({
        url: downUrl,
        type: 'post',
        catch: false,
        sync: false,
        dataType: 'json',
        data: params,
        success: function (data) {
            if (data.success == true) {
                $('#popwin_Close').click();//@此处思考下到底怎么处理
                $(".index_mask",parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410, 560);
                $(".attr_manag_add .mask_tip").html("移动成功");
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask",parent.document).hide();
                })
                searchNowPage();
                searchPage(_nowPage);//当我完成交互，刷新分页的时候，目前并没有完成功能
                // alert('更改名称成功');
            } else {
                $(".index_mask",parent.document).show();
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
                    $(".index_mask",parent.document).hide();
                })
                if(data.errorCode!=0){
                    $(".attr_manag_add .mask_tip").html(data.message);
                }
                // alert('该名称已经存在')
            }
        }
    });
}

//每行置底执行函数
function moveBottom(obj) {

    $this = $(obj);
    var _id = $this.parent().data("id");
    var params = {
        id: _id
    };
    $.ajax({
        url: bottomUrl,
        type: 'post',
        catch: false,
        sync: false,
        dataType: 'json',
        data: params,
        success: function (data) {
            if (data.success == true) {
                $('#popwin_Close').click();//@此处思考下到底怎么处理
                $(".index_mask",parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410, 560);
                $(".attr_manag_add .mask_tip").html("移动成功");
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask",parent.document).hide();
                })
                searchNowPage();
                searchPage(_nowPage);//当我完成交互，刷新分页的时候，目前并没有完成功能
                // alert('更改名称成功');
            } else {
                $(".index_mask",parent.document).show();
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
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html("连接错误");
                // alert('该名称已经存在')
            }
        }
    });
}

function searchNowPage() {//首次两参进入
    var a;
    a = pagination.returnParams();
    _nowPage = a.currentPageNo;

};