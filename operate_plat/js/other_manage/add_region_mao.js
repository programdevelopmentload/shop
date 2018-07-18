//分页地址变量
var localUrl = 'http://172.16.40.215:8008';
//全国区域-获取所有省份
// var provinceUrl = localUrl + '/region/findAllProvince';
var provinceUrl = '../../html/other_manage/huoqu_shengAll.json';
//获取省份对应的所有城市
// var cityUrl = localUrl + '/region/findAllCityByProvince';
var cityUrl = '../../html/other_manage/pull_city.json';
//获取省份对应的所有区
// var areaUrl = localUrl + '/region/findAllAreaByCity';
var areaUrl = '../../html/other_manage/area_pull.json';

var _provinceId;
var _cityId;
//删除函数
// var attr_delUrl = localUrl + '/goods/attribute/del';
$.sidebarMenu($('.sidebar-menu'));
$(function () {
    province_pull();
    _provinceId = 140000;
    var city_params = {
        provinceId:_provinceId
    }
    city_pull(city_params);
    _cityId = 140100;
    var area_params = {
        cityId:_cityId
    };
    area_pull(area_params);
});
function province_pull() {
    $.ajax({
        type:'post',
        url:provinceUrl,
        dataType:'json',
        // async: false,
        // cache:false,
        success:function(data){
            console.log(data)
            debugger;
        }
    });
};
function city_pull(city_params) {
    $.ajax({
        type:'post',
        url:cityUrl,
        dataType:'json',
        // async: false,
        // cache:false,
        data:city_params,
        success:function(data){
            console.log(data)
            debugger;
        }
    });
}
function area_pull(city_params) {
    $.ajax({
        type:'post',
        url:areaUrl,
        dataType:'json',
        // async: false,
        // cache:false,
        data:city_params,
        success:function(data){
            console.log(data)
            debugger;
        }
    });
}