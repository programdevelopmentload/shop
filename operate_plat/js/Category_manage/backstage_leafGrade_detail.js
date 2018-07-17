var regex_reName = /^[\u4e00-\u9fa5_a-zA-Z0-9]{1,32}$/;
var _id = +$.getUrlParam("id");//本行数据id
var _levelSign = $.getUrlParam("level");//本行数据等级//叶子的时候是3

var _state;
//前缀地址变量
// var localHtttp = 'http://172.16.41.23:8007';
var localHtttp = getBaseUrl('w');
//每一级详情
var everyGrade_url = localHtttp + '/goods/GoodsClassification/showBackClass';
//id名拉取详情地址
var everyGradeInfo_Url = localHtttp +'/goods/GoodsClassification/showClass';
//关闭开启按钮请求地址
var attr_switchUrl = localHtttp + '/goods/GoodsClassification/backCloseOpen';
//改名函数
var attr_renameUrl = localHtttp + '/goods/GoodsClassification/changeName';
//删除函数
var attr_delUrl = localHtttp + '/goods/GoodsClassification/backDelClass';
//品牌交互url
var brand_pageUrl = localHtttp + '/goods/brand/findByClassId';
//属性交互url
var attr_pageUrl = localHtttp + '/goods/attribute/findByClassId';

var url_page_input;//输入url参数。
var pagination;
var searchPage;
var getParams;
var fillTableData;
$(function () {
    //根据id拉取顶部信息
    top_InfoPull(everyGradeInfo_Url);
    // 渲染分页
    pageRun();
    //抓取首屏分页列表
    searchPage();
    //事件触发有五个。【添加按钮为页面跳转行为控制】
    //switch开关控制事件
    $('.everyGrade_switch').off("click").on('click', function () {

        if(_state == 0){
            _state = 1;
        }else{
            _state = 0;
        }
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
        $(".index_mask",parent.document).show();
        var html = template('test_mask_catch', {});
        $.popwin(html, {
            title: '更改名称',
            fixed: true,
            drag: false, //是否可拖拽
        });
        $("#popwin_Out").addClass("grade_RenameStyle");
        $.popwin.setPosition(410,560);
        $("#popwin_Close").on("click", function () {
            $("#popwin_Blank").remove();
            $("#popwin_Out").remove();
            $(".index_mask",parent.document).hide();
        })
        var _oldName = $(".everyGrade_name").text();//旧名称返回参数好像没有啊
        $(".grade_RenameStyle .grade_nowName_address").html(_oldName);
        var _newName = $('.grade_newName_input').val();
        var rename_sureDom = $('.rename_sure');
        $(".grade_newName_input").blur(function () {
            var _newName = $('.grade_newName_input').val();
            if (regex_reName.test(_newName)) {
                $('.grade_newName_tip').hide();
                renameFlag = true;
            } else {
                $('.grade_newName_tip').html('不可空置/支持中英文，最多32个字符').show();
                renameFlag = false;
            }
        });
        rename_sureDom.off('click').on('click', function () {
            debugger;
            var _newName = $('.grade_newName_input').val(),
                renameFlag = regex_reName.test($('.grade_newName_input').val());
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
    //调节分页行数执行事件
    $('.pageSize_switch').on('change', function () {
        searchPage();
    });
    //品牌和属性点击切换事件
    $(".switch_page_con").on('click', 'li', function () {
        var index = $(this).index();
        $(this).addClass("switch_active").siblings().removeClass("switch_active");
        var urlFlag = $(this).data('id');//detail_brand//detail_attr
        if (urlFlag == 'detail_brand') {
            url_page_input = brand_pageUrl;
            $(".everyGrade_rename").show();
            $(".everyGrade_dele").show();
        } else {
            url_page_input = attr_pageUrl;
            $(".everyGrade_rename").hide();
            $(".everyGrade_dele").hide();
        };
        //需要销毁这个表格吗？
        pageRun(url_page_input)//首参传入地址,二参传入级别
        searchPage();
        // $(".exam_help .content").hide();
        // $(".exam_help .content").eq(index).show();

    });
});

/**
 * 初始化分页对象
 * @params url 访问后台分页地址
 * @params pageId 页面上id="page"的div
 * @params callBack 自己定义的，拼接table数据的方法，data：callBack的参数：json格式的table数据
 */


function pageRun(pageUrl) {

    var pageUrl = pageUrl || brand_pageUrl;

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

            if (data.length == 0) {   //没有资源时
                $("#pic_no").show();
                $(".pageSize_switch_con").hide();
                $("#table_data").hide();
                $(".leftBottom").hide();
            } else {
                var th_table_All = '<th class="th_table1">品牌名称</th>' +
                    '<th class="th_table2">品牌图片</th>';
                    // '<th class="th_table3"></th>';
                $('.th_table_con').html(th_table_All);
                $(".pageSize_switch_con").show();
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
                            '<td>' + data[i].nameCh + '</td>' +       //分类名称
                            '<td><img class="leaf_logo" src="' + data[i].logo + '" alt=""></td>' +      //分类等级
                            // '<td>' + data[i].state + '</td>' +       //分类状态
                            // '<td >' + ' <a class="_look sm btn-sm btn-primary" href="./backstage_everyGrade_detail.html?id=' + data[i].id + '&name=' + data[i].name + '&updateTime=' + data[i].updateTime + '&state=' + data[i].state + '&isLeaf=' + data[i].isLeaf + '&level=' + data[i].level + '">查看</a><button class="_change btn-sm btn-warning">更改名称</button><button class="_open btn-sm btn-success">开启</button><button class="_close sm btn-danger btn-sm">删除</button>' + '</td>' +       //操作
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
            //
            if (data.length == 0) {   //没有资源时
                $("#pic_no").show();
                $(".pageSize_switch_con").hide();
                $("#table_data").hide();
                $(".leftBottom").hide();
            } else {
                var th_table_All = '<th class="th_table1">属性名称</th>' +
                    '<th class="th_table2">属性类型</th>';
                    // '<th class="th_table3"></th>';
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
                            '<td>' + data[i].name + '</td>' +       //属性名称
                            '<td>' + attrDraw(data[i].type) + '</td>' + //属性类型
                            // '<td>' + data[i].state + '</td>' +       //分类状态
                            // '<td >' + ' <a class="_look sm btn-sm btn-primary" href="./backstage_everyGrade_detail.html?id=' + data[i].id + '&name=' + data[i].name + '&updateTime=' + data[i].updateTime + '&state=' + data[i].state + '&isLeaf=' + data[i].isLeaf + '&level=' + data[i].level + '">查看</a><button class="_change btn-sm btn-warning">更改名称</button><button class="_open btn-sm btn-success">开启</button><button class="_close sm btn-danger btn-sm">删除</button>' + '</td>' +       //操作
                            '</tr>'
                        );
                    }
                }
                ;

            }
        }
    }
    return searchPage;
    //标记；
}
/*查看按钮地址渲染函数*/
function lookHref() {

    var lookUrl;
    if(_levelSign == 1){
        lookUrl = './backstage_everyGrade_detail_ceshi2.html?id=';
    }else if(_levelSign == 2){
        lookUrl = './attr_manag_keydetail.html?id=';
    }
    return lookUrl;
}
//依据id拉取顶部详细信息函数
function top_InfoPull(everyGradeInfo_Url){
    //拉取id对应详细信息
    var param = {
        id:_id
    };
    $.ajax({
        type: "post",
        url: everyGradeInfo_Url,
        sync:false,
        cache: false,
        dataType: "json",
        data: param,
        success: function (data) {
            if (data.success == true) {
                //判断返回参数中某个数据，不是这个

                var res = data.data;
                _state = res.state;
                var _level = res.level;
                var res = data.data;
                var _name = res.name;
                var _updateTime = getNowFormatDate(res.updateTime);
                var blongType = res.path;
                level_word(_level);
                attr_nameDraw(_name);
                attr_switchDraw(_state);
                everyGrade_switch(_state);
                blongDraw(blongType);
                attr_timeDraw(_updateTime);
                everyGrade_switch(_state)
            } else {
                $(".index_mask",parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410,560);
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html("网络错误");
                // alert('失败')
            }
        },
        error: function () {
        }
    });
}

/*开关后台交互执行函数*/
function switch_runFun(params) {
    var switch_runUrl = attr_switchUrl;
    $.ajax({
        type: "post",
        url: switch_runUrl,
        sync:false,
        dataType: "json",
        data: params,
        success: function (data) {

            if (data.success == true) {//判断某个数

                top_InfoPull(everyGradeInfo_Url);
            } else {
                $(".index_mask",parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410,560);
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
            _state = !_state;
            everyGrade_switch(_state);
            //

        }
    });
}

/*开关渲染函数*/
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
function attr_nameDraw(_name){
    var str = '';
    if (!_name) {
        str += '无';
    }else{
        str += _name;
    }
    $('.everyGrade_name').html(str);
};
//回显顶部分类状态关闭开启
function attr_switchDraw(_state){
    var str = '';
    if (_state == 0) {
        str += '正常';
    }else{
        str += '已关闭';
    }
    $('.everyGrade_state').html(str)
};
//回显创建时间
function attr_timeDraw(_updateTime){
    var updateTimeRes = getNowFormatDate(_updateTime);
    var fisrtTime = updateTimeRes.substr(0,10);
    var secondTime = updateTimeRes.substr(11);
    if (!_updateTime) {
        $('.everyGrade_ymd').parent().html('显示异常');
    } else{
        $('.everyGrade_ymd').html(fisrtTime);
        $('.everyGrade_hms').html(secondTime);
    };
};
//分类等级单词渲染
function level_word(_level){
    var str = "";
    if(_level == 1){
        str = "一级"
    }else if(_level == 2){
        str = "二级"
    }else{
        str = "叶子分类"
    };
    $(".everyGrade_level").html(str);
};
/*删除单行数据执行函数*/
function delete_runFun(params) {
    var delete_runUrl = attr_delUrl;
    $.ajax({
        type: "post",
        sync:false,
        url: delete_runUrl,
        dataType: "json",
        data: params,
        success: function (data) {
            if (data.success == true) {//判断返回参数中某个数据，不是这个
                // window.location.href = _selfUrl;
                window.location.href = document.referrer;
            } else {

                $(".index_mask",parent.document).show();
                var html = template('ajax_alert', {});
                $.popwin(html, {
                    title: '',
                    fixed: true,
                    drag: false, //是否可拖拽
                });
                $("#popwin_Out").addClass("attr_manag_add");
                $.popwin.setPosition(410,560);
                $("#popwin_Close").on("click", function () {
                    $("#popwin_Blank").remove();
                    $("#popwin_Out").remove();
                    $(".index_mask",parent.document).hide();
                })
                $(".attr_manag_add .mask_tip").html(data.message);
                // alert('此分类下有挂载商品,请先删除商品')
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
            $.popwin.setPosition(410,560);
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



/*更改名称交互函数*/
function grade_Rename_link(params) {
    $.ajax({
        url:attr_renameUrl,
        type: 'post',
        sync:false,
        dataType: 'json',
        data: params,
        success: function (data) {
            debugger;
            if (data.success == true) {

                top_InfoPull(everyGradeInfo_Url);
                // $('#popwin_Close').click();//@此处思考下到底怎么处理
            } else {
                alert('问下王喧')
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
            $.popwin.setPosition(410,560);
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
}
/*开关渲染控制函数*/
function ctr_Switch(params) {
    var str = "";
    if (params == 0) {//0是开启
        str += '关闭';
    } else {
        str += '开启';
    }
    return str;
}
/*开关控制函数*/
function grade_Switch(obj,switch_runUrl) {

    //抓取该行数据id
    var $this = $(obj);
    var _id = $this.parent().data("id");
    var old_state = parseInt($this.parent().data("state"));
    var _state;
    if (old_state == 0) {
        _state = 1
    } else {
        _state = 0;
    }
    var params = {
        id: _id,
        state: _state
    };
    switch_runFun(params,switch_runUrl);
}
/*单行删除按钮触发函数*/
function grade_Delete(obj,delete_runUrl) {
    //抓取该行数据id
    var $this = $(obj);
    var _id = $this.parent().data("id");
    var params = {
        id: _id
    };
    delete_runFun(params,delete_runUrl);
}
function attrDraw(params) {
    var str = "";
    if(params == 0){
        str = "主销售属性";
    }else if (params == 1){
        str = "副销售属性";
    }else {
        str = "关键属性";
    };
    return str;
}