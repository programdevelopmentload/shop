//分页地址变量
var localUrl = 'http://172.16.40.215:8008';
//已开通业务省份
var open_provinceUrl = localUrl + '/region/findSelectServerRegion';
//已开通业务城市
var open_cityUrl = localUrl + '/region/findSelectServerCity';
//通过城市名获取到该城市的id
var name_pullIdUrl = localUrl + '/region/findAllRegionByName';
//获取已开通业务省份列表
var open_provinceUrl = '../../html/other_manage/huoqu_shengAll.json';
//获取已开通省份对应的城市列表
var open_cityUrl = '../../html/other_manage/pull_city.json';
$.sidebarMenu($('.sidebar-menu'));
var cityData;
var A_arry = [];
var B_arry = [];
var C_arry = [];
var F_arry = [];
var G_arry = [];
var H_arry = [];
var J_arry = [];
var L_arry = [];
var N_arry = [];
var Q_arry = [];
var S_arry = [];
var T_arry = [];
var X_arry = [];
var Y_arry = [];
var Z_arry = [];
$(function () {
    // var _provinceId = '110000';
    // var _provinceName = '北京';
    // var params = {
    //     provinceId:_provinceId,
    //     provinceName:_provinceName
    // }
    province_pull();
    //点击省份名触发事件
    $('body').on('click','.province_name',function (event) {
        event.stopPropagation();
        if($('.person_account_tip') && $('.person_account_tip').length>0){
            $('.person_account_tip').remove();
        };
        var _this = $(this);
        var flag = $('.person_account_tip').length;
        // var _index = $(this).index();
        // var flag = _this.parent().find(".person_account_tip ").length;
        if(!flag){
            var link_id = _this.parent().data('id');//此处是后传参数
            city_pull(link_id);
            var linkHtml = "";
            $(cityData).each(function (ii,vv) {
                linkHtml+="<div class='city_name fl' data-id='"+ vv.id +"' onclick='jumpCaixao("+ vv.id +")'>"+vv.name+"</div>";
            });
            var bubble_html = "<div name='' class='person_account_tip clearfix'><div class='pac_tip_jiantou fl'></div>"+ linkHtml+"</div></div>";
            _this.after(bubble_html);
        }else {
            $('.person_account_tip').remove();
        }
    });
    $(document).click(function(){
        $(".person_account_tip ").hide();
    });
    //查询按钮事件
    $('.cityId_query').on('click',function () {
        var _nameWord = $(".quick_check_input").val();
        cityId_link(_nameWord);
    })
    // $(document).on('click',function () {
    //     $('.person_account_tip').remove();
    // })

});
//拉取省
function province_pull() {
    $.ajax({
        type:'post',
        url:open_provinceUrl,
        dataType:'json',
        async: false,
        // cache:false,
        success:function(data){
            debugger;
            var res = $(data.data);
            res.each(function (i,v) {
                var letter_num = v['id'];
                if(letter_num== 340000 || letter_num==820000){
                    A_arry.push(v);//安徽，澳门
                }else if(letter_num== 110000){
                    B_arry.push(v);//北京
                }else if(letter_num== 500000){
                    C_arry.push(v);//重庆
                }else if(letter_num== 350000){
                    F_arry.push(v);//福建
                }else if(letter_num== 620000||letter_num== 620000||letter_num== 440000||letter_num== 520000){
                    G_arry.push(v);//甘肃，广东
                }else if(letter_num== 460000||letter_num== 130000){
                    H_arry.push(v);//海南省，河北省
                }else if(letter_num== 320000||letter_num== 360000||letter_num== 220000){
                    J_arry.push(v);//江苏省，江西省，吉林省
                }else if(letter_num== 210000){
                    L_arry.push(v);//辽宁
                }else if(letter_num== 150000 ||letter_num== 640000){
                    N_arry.push(v);//内蒙古，宁夏回族自治区
                }else if(letter_num== 630000){
                    Q_arry.push(v);//青海省
                }else if(letter_num== 310000||letter_num== 610000||letter_num== 370000||letter_num== 140000||letter_num== 510000){
                    S_arry.push(v);//上海，陕西省，山东省，山西省，四川省
                }else if(letter_num== 120000||letter_num== 710000){
                    T_arry.push(v);//天津市，台湾省
                }else if(letter_num== 810000||letter_num== 650000||letter_num== 540000){
                    X_arry.push(v);//香港特别行政区，新疆维吾尔自治区，西藏自治区
                }else if(letter_num== 530000){
                    Y_arry.push(v);//云南省
                }else if(letter_num== 330000){
                    Z_arry.push(v);//浙江省
                }
            });
            switch_dom(A_arry,'.A_items');
            switch_dom(B_arry,'.B_items');
            switch_dom(C_arry,'.C_items');
            switch_dom(F_arry,'.F_items');
            switch_dom(G_arry,'.G_items');
            switch_dom(H_arry,'.H_items');
            switch_dom(J_arry,'.J_items');
            switch_dom(L_arry,'.L_items');
            switch_dom(N_arry,'.N_items');
            switch_dom(Q_arry,'.Q_items');
            switch_dom(S_arry,'.S_items');
            switch_dom(T_arry,'.T_items');
            switch_dom(X_arry,'.X_items');
            switch_dom(Y_arry,'.Y_items');
            switch_dom(Z_arry,'.Z_items');
        }
    });
}
//拉取市
function city_pull(_provinceId) {
    //此处参数仍然没有穿进去
    // var param = {
    //     provinceId:_provinceId
    // };
    $.ajax({
        type:'post',
        url:open_cityUrl,
        dataType:'json',
        async: false,
        // cache:false,
        success:function(data){
            var res = $(data.data);
            return cityData = res;
        }
    });
};

//封装字母对应函数渲染
function switch_dom(param_data,params){
    debugger;
    if(param_data.length>0){
        var a_resHtml = '';
        debugger;
        $(param_data).each(function (ia,va) {
            a_resHtml+='<div class="province_dom fl" data-id="'+va.id+'"><span class="province_name ">'+va.name+'</span></div>';
        });
        // $('.A_items').append(a_resHtml);
        $(params).append(a_resHtml);
    }else {
        return false;
    }
}
//
function jumpCaixao(params) {
    window.location.href="./distribution_manage_list.html?_id="+params;
}
function cityId_link(_nameWord) {
    var pull_data={
        name:_nameWord
    }
    $.ajax({
        type:'post',
        url:name_pullIdUrl,
        dataType:'json',
        async: false,
        // cache:false,
        data:pull_data,
        success:function(data){
           var resId = data.data;
           window.location.href="./distribution_manage_list.html?_id="+resId;
        }
    });
}

