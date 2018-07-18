var regex_reName = /[\u4e00-\u9fa5_a-zA-Z0-9_]{1,10}/;
var _id = $.getUrlParam("id");//本行数据id
var _level;
var _state;
// var _name;
// var _isLeaf;
// var _parentId;
// var blongType;

//前缀地址变量
var localHtttp = 'http://172.16.41.23:8007';
//id名拉取详情地址
var everyGradeInfo_Url = localHtttp +'/goods/GoodsClassification/showClass';
//品牌交互url
var brand_pageUrl = localHtttp + '/goods/brand/findByClassId';
//属性交互url
var attr_pageUrl = localHtttp + '/goods/attribute/findByClassId';
//每一级详情
var everyGrade_url = localHtttp + '/goods/GoodsClassification/showBackClass';

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

//祖父和父亲的name目前都不知道
// var fisrtTime = _updateTime.substr(0,10);
// var secondTime = _updateTime.substr(11);

$(function () {
    //拉取id对应详细信息
    var param = {
        id:'2'
    }
    debugger;
    $.ajax({
        type: "post",
        url: 'http://172.16.41.23:8007/goods/GoodsClassification/showClass',
        sync:false,
        cache: false,
        dataType: "json",
        data: param,
        success: function (data) {
            debugger;
            if (data.success == true) {//判断返回参数中某个数据，不是这个
                var res = data.data;
                var _level = res.level;
                var _state = res.state;

                var res = data.data;
                var _name = res.name;
                var _updateTime = getNowFormatDate(res.updateTime);
                var _isLeaf = res.isLeaf;
                var _parentId = res.parentId;
                var blongType = res.path;
                var fisrtTime = _updateTime.substr(0,10);
                var secondTime = _updateTime.substr(11);

                $('.everyGrade_level').html(_name);//挂载本级分类级别名字
                $('.everyGrade_oneFatherName').html(blongType);//@此处挂载所属分类名字
                $('.everyGrade_oneFatherName').html(blongType);
                var _levelName;
                everyGrade_switch(_state)

                if (_level == '3') {
                    _levelName = '叶子分类';
                    $(".isHave_twoFather").show();
                    $('.everyGradeAdd').html().hide();//
                    $('.guide_content').html('关联信息');
                } else if (_level == '2') {
                    _levelName = '二级分类'
                    $(".isHave_twoFather").hide();
                    $('.everyGradeAdd').html("添加叶子分类");//
                    $('switch_page_con').hide();
                    $('.guide_content').html('关联叶子分类');
                } else {
                    _levelName = '一级分类'
                    $(".switch_page_con").hide();
                    $(".evg_msg_middle").hide();
                    $('.guide_content').html('关联二级分类');
                };
                $('.everyGrade_level').html(_levelName);

            } else {
                alert('失败')
            }
        },
        error: function () {
        }
    });


    everyGrade_switch(_state);//开关按钮状态渲染
    // 渲染分页
    if(_level != 3){
        debugger;
        pageRun(_level,everyGrade_url);
    }else{
        debugger;
        pageRun(_level);
    }
    //抓取首屏分页列表
    searchPage();
    //事件触发有五个。【添加按钮为页面跳转行为控制】
    //调节分页行数执行事件
    $('.pageSize_switch').on('change', function () {
        searchPage();
    })
    //switch开关控制事件
    $('.everyGrade_switch').on('click', function () {
        _state = !_state;
        var params = {
            id: _id,
            state: _state
        };
        switch_runFun(params);
    });
    //删除触发
    $('.everyGrade_dele').on('click', function () {
        var params = {
            id: _id
        };
        delete_runFun(params);
    });
    //更改名称触发函数事件
    $('.everyGrade_rename').on('click', function () {
        debugger;
        let html = template('test_mask_catch', {});
        $.popwin(html, {
            title: '更改名称',
            fixed: true,
            drag: false, //是否可拖拽
        });
        $("#popwin_Out").addClass("grade_RenameStyle");
        // $.popwin.setPosition(410,460);

        // var _oldName = $this.parent().data("name");//旧名称返回参数好像没有啊
        // $(".grade_RenameStyle .grade_nowName_address").html(_oldName);
        var _newName = $('.grade_newName_input').val();
        var rename_sureDom = $('.rename_sure');
        $(".grade_newName_input").blur(function () {
            if (regex_reName.test(_newName)) {
                debugger;
                $('.grade_newName_tip').hide();
                renameFlag = true;
            } else {
                $('.grade_newName_tip').html('不可空置/支持中英文，最多32个字符').show();
                renameFlag = false;
            }
        });
        rename_sureDom.on('click', function () {
            var _newName = $('.grade_newName_input').val(),
                renameFlag = regexAdd.test($('.grade_newName_input').val());
            param = {
                id: _id,
                name: _newName
            };
            if (renameFlag) {
                grade_Rename_link(param);
            } else {
                $('.everyGradeTip').html('不可空置/支持中英文，最多32个字符').show();
            }
        })
    });
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
        pageRun(_level,url_page_input)//首参传入地址,二参传入级别
        // $(".exam_help .content").hide();
        // $(".exam_help .content").eq(index).show();

    })
});

/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */


function pageRun(levelFlag,pageUrl) {
    debugger;
    var pageUrl = pageUrl || brand_pageUrl;
    if (levelFlag == 3) {
        debugger;
        if (pageUrl == brand_pageUrl) {
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
                    'classId': _id,
                    'pageSize': pageSize
                    // 'currentPage': 1,

                };
                return params;
            };

            /** table数据 */
            fillTableData = function fillTableData(data) {
                // debugger;
                if (data.length == 0) {   //没有资源时
                    $("#pic_no").show();
                    $(".pageSize_switch_con").hide();
                    $("#table_data").hide();
                    $(".leftBottom").hide();
                } else {
                    var th_table_All = '<th class="th_table1">序号</th>' +
                        '<th class="th_table2">品牌名称</th>' +
                        '<th class="th_table3">品牌图片</th>';
                    $('.th_table_con').html(th_table_All);
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
                                '<td>' + data[i].level + '</td>' +       //分类等级
                                '<td>' + data[i].state + '</td>' +       //分类状态
                                '<td >' + ' <a class="_look sm btn-sm btn-primary" href="./backstage_everyGrade_detail.html?id=' + data[i].id + '&name=' + data[i].name + '&updateTime=' + data[i].updateTime + '&state=' + data[i].state + '&isLeaf=' + data[i].isLeaf + '&level=' + data[i].level + '">查看</a><button class="_change btn-sm btn-warning">更改名称</button><button class="_open btn-sm btn-success">开启</button><button class="_close sm btn-danger btn-sm">删除</button>' + '</td>' +       //操作
                                '</tr>'
                            );
                        }
                    }
                    ;

                }
            }
        } else {
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
                    'classId': _id,
                    'pageSize': pageSize
                    // 'currentPage': 1,

                };
                return params;
            };

            /** table数据 */
            fillTableData = function fillTableData(data) {
                // debugger;
                if (data.length == 0) {   //没有资源时
                    $("#pic_no").show();
                    $(".pageSize_switch_con").hide();
                    $("#table_data").hide();
                    $(".leftBottom").hide();
                } else {
                    var th_table_All = '<th class="th_table1">序号</th>' +
                        '<th class="th_table2">属性名称</th>' +
                        '<th class="th_table3">属性类型</th>';
                    $('.th_table_con').html(th_table_All);
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
                                '<td>' + data[i].level + '</td>' +       //分类等级
                                '<td>' + data[i].state + '</td>' +       //分类状态
                                '<td >' + ' <a class="_look sm btn-sm btn-primary" href="./backstage_everyGrade_detail.html?id=' + data[i].id + '&name=' + data[i].name + '&updateTime=' + data[i].updateTime + '&state=' + data[i].state + '&isLeaf=' + data[i].isLeaf + '&level=' + data[i].level + '">查看</a><button class="_change btn-sm btn-warning">更改名称</button><button class="_open btn-sm btn-success">开启</button><button class="_close sm btn-danger btn-sm">删除</button>' + '</td>' +       //操作
                                '</tr>'
                            );
                        }
                    }
                    ;

                }
            }
        }
        return searchPage;
    } else if (levelFlag == '1') {
        pageUrl = everyGrade_url;
        pagination = new Pagination(pageUrl, "page", function (data) {
            fillTableData(data)
        });

        searchPage = function (page) {//首次两参进入
            pagination.search(getParams(), page);
        };

        /** 得到搜索条件的json对象 */
        getParams =function getParams() {
            var pageSize = $('.pageSize_switch').val();
            var params = {
                'classId': _id,
                'pageSize': pageSize
                // 'currentPage': 1,

            };
            return params;
        };

        /** table数据 */
        fillTableData = function fillTableData(data) {
            // debugger;
            if (data.length == 0) {   //没有资源时
                $("#pic_no").show();
                $(".pageSize_switch_con").hide();
                $("#table_data").hide();
                $(".leftBottom").hide();
            } else {
                var th_table_All = '<th class="th_table1">分类名称</th>' +
                    '<th class="th_table2">分类状态</th>' +
                    '<th class="th_table3">分类状态</th>'+
                    '<th class="th_table4">操作</th>';
                $('.th_table_con').html(th_table_All);
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
                            '<td>' + data[i].level + '</td>' +       //分类等级
                            '<td>' + data[i].state + '</td>' +       //分类状态
                            '<td >' + ' <a class="_look sm btn-sm btn-primary" href="./backstage_everyGrade_detail.html?id=' + data[i].id + '&name=' + data[i].name + '&updateTime=' + data[i].updateTime + '&state=' + data[i].state + '&isLeaf=' + data[i].isLeaf + '&level=' + data[i].level + '">查看</a><button class="_change btn-sm btn-warning">更改名称</button><button class="_open btn-sm btn-success">开启</button><button class="_close sm btn-danger btn-sm">删除</button>' + '</td>' +       //操作
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
                'classId': _id,
                'pageSize': pageSize
                // 'currentPage': 1,

            };
            return params;
        };

        /** table数据 */
        fillTableData = function fillTableData(data) {
            // debugger;
            if (data.length == 0) {   //没有资源时
                $("#pic_no").show();
                $(".pageSize_switch_con").hide();
                $("#table_data").hide();
                $(".leftBottom").hide();
            } else {
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
                            '<td>' + data[i].level + '</td>' +       //分类等级
                            '<td>' + data[i].state + '</td>' +       //分类状态
                            '<td >' + ' <a class="_look sm btn-sm btn-primary" href="./backstage_everyGrade_detail.html?id=' + data[i].id + '&name=' + data[i].name + '&updateTime=' + data[i].updateTime + '&state=' + data[i].state + '&isLeaf=' + data[i].isLeaf + '&level=' + data[i].level + '">查看</a><button class="_change btn-sm btn-warning">更改名称</button><button class="_open btn-sm btn-success">开启</button><button class="_close sm btn-danger btn-sm">删除</button>' + '</td>' +       //操作
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
/*开关后台交互执行函数*/
function switch_runFun(params) {
    var switch_runUrl = 'http://172.16.41.23' + '/goods/GoodsClassification/backCloseOpen';
    $.ajax({
        type: "post",
        url: switch_runUrl,
        sync:false,
        dataType: "json",
        data: params,
        success: function (data) {
            if (data.success == true) {//判断某个数
                everyGrade_switch(_state);
                // debugger;直接删除然后刷新数据

            } else {
                alert('//提示有子类挂载，阻止删除【弹框有挂载】')

            }
        },
        error: function () {
            _state = !_state;
            everyGrade_switch(_state);
            // debugger;

        }
    });
}

/*开关渲染函数*/
function everyGrade_switch(_state) {
    if (_state == 0) {
        $('.everyGrade_switch').html('开启')
    } else {
        $('.everyGrade_switch').html('关闭')
    }
    ;
};

/*删除单行数据执行函数*/
function delete_runFun(params) {
    var delete_runUrl = 'http://172.16.41.23' + '/goods/GoodsClassification/backDelClass';
    $.ajax({
        type: "post",
        sync:false,
        url: delete_runUrl,
        dataType: "json",
        data: params,
        success: function (data) {
            if (data.success == true) {//判断返回参数中某个数据，不是这个
                // window.location.href = _selfUrl;
                self.location = document.referrer;
                // debugger;直接删除然后刷新数据
            } else {
                alert('阻止删除【弹框提示】')
            }
        },
        error: function () {
            alert('未连接到数据库')
        }
    });
};

/*更改名称触发函数*/
function grade_Rename(obj) {
    let html = template('test_mask_catch', {});
    $.popwin(html, {
        title: '更改名称',
        fixed: true,
        drag: false, //是否可拖拽
    });
    $("#popwin_Out").addClass("grade_RenameStyle");
    // $.popwin.setPosition(410,460);
};

/*更改名称交互函数*/
function grade_Rename_link(params) {
    $.ajax({
        url: 'http://172.16.41.23' + '/goods/GoodsClassification/changeName',
        type: 'post',
        sync:false,
        dataType: 'json',
        data: params,
        success: function (data) {
            if (data.message == '成功') {
                $('#popwin_Close').click();//@此处思考下到底怎么处理

                alert('更改名称成功');
            } else {
                alert('该名称已经存在')
            }
        },
        error: function () {
            alert('连接错误');
        }
    });
}