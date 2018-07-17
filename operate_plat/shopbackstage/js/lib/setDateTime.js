/**
 * Created by mhp on 2017/3/22.
 */

function setDateTime(){
    //日期设置
    $('#dates_start1').datetimepicker({
        //yearOffset:222,
        lang:'ch',
        timepicker:false,
        format:'Y-m-d',
        formatDate:'Y-m-d',
        onShow:function( ct ) {
            this.setOptions({
                maxDate: $('#dates_end1').val() ? $('#dates_end1').val() : false
            })
        }
    });
    $('#dates_end1').datetimepicker({
        //yearOffset:222,
        lang:'ch',
        timepicker:false,
        format:'Y-m-d',
        formatDate:'Y-m-d',
        onShow:function( ct ) {
            this.setOptions({
                minDate: $('#dates_start1').val() ? $('#dates_start1').val() : false
            })
        }
    });
    $("#startDate").change(function () {
        var startDay = $("#startDate").datepicker("getDate");
        vm.startdate = getFormatDate(startDay);
        var endDay = $("#endDate").datepicker("getDate");
        if (vm.startdate && vm.startdate != '') {
            $("#endDate").datepicker("option", "minDate", vm.startdate);
        }
    });
    $("#endDate").change(function () {
        var startDay = $("#endDate").datepicker("getDate");
        var endDay = $("#endDate").datepicker("getDate");
        vm.enddate = getFormatDate(endDay);
        if (vm.enddate && vm.enddate != '') {
            $("#endDate").datepicker("option", "maxDate", vm.enddate);
        }
    });
}