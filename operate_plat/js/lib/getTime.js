/**
 * 获取当前的日期时间 格式“yyyy-MM-dd HH:MM:SS”
 * */
function getNowFormatDate(params) {
    if(params){
        var date = new Date(params);
    }else {
        var date = new Date();
    }
    // var date = params;
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    //2018-06-22     14:41:38
    var _Minutes = date.getMinutes();
    if (_Minutes < 10) {
        _Minutes = "0" + _Minutes;
    }
    ;

    var _Seconds = date.getSeconds();
    if (_Seconds < 10) {
        _Seconds = "0" + _Seconds;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + _Minutes
        + seperator2 + _Seconds;
    return currentdate;
};