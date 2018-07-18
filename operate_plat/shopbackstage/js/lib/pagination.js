/**
 * Created by morehappen on 2018/5/17.
 * 分页
 */
function Pagination(_url, _pageId, _callBack){
    //目前只传参了地址，容器ID，回调函数
    var url = _url;//请求地址
    var callBack = _callBack;//回调函数
    var pageId = _pageId;//容器的id名称
    var pageSize;//每一页多少行，后传参。【抓取，三分一】
    var groupPage = 5;//底部的前面有多少个
    var params;//参数【抓取，当前页，id三分二】
    var sessionUserId = "";//定义当前登录人的userId，后台返回
    //返回页数
    var returnParams = {};


    var returnObj = {
        searchList : function (pageNo){
            searchList(pageNo, params);
        },
        search : function(_params, _page){
            //参数，跳转页码。
            search(_params, _page);
        },
        getsessionUserId : function(){
            return sessionUserId;
        },
        returnParams : function(){//
            return returnParams;
        }
    }

    function searchList(pageNo, params) {
        //跳转页码，
        // debugger;
        //参数params目前有，id，当前页码currentPage，pageSize每页行数
        params["currentPage"] = pageNo;//当前页码
        // params["pageSize"] = pageSize;//每页多少行，目前写死
        $.ajax({
            type : "post",
            catch:false,
            sync:false,
            url : url,
            dataType : "json",
            data : params,
            success:function(xhr,data) {

                if(data.success == true){
                    // debugger;
                    returnParams["currentPageNo"] = data.data.currentPage;//当前页码
                    returnParams["pageSize"] = data.data.pageSize;//
                    // sessionUserId = data.userId;
                    // debugger
                    fillData(data.data);//填充数据
                }else{
                    $(window.parent.document).find(".pText").html(data.message);
                    $(window.parent.document).find("#jumpBox3").show();
                }
            },
            error:function(){
                // debugger;
                $(window.parent.document).find(".pText").html("出错了");
                $(window.parent.document).find("#jumpBox3").show();
            }
        });
    }

    function search(_params, _page){
        params = _params;
        // var toPage = $("#toPage").val();//.replace(/\s/g, "")
        var toPage;
        if(_page){
            //我自己新加的，不跳页刷新逻辑
            toPage = _page;
        };
        if(toPage == null || toPage == "") {
            toPage = 1;
        }
        // else{
        //     toPage = toPage.replace(/\s/g, "");
        // }
        if(/^-?\d+$/.test(toPage)){
            var totalPage = $("#totalPage").html();
            if(parseInt(toPage) < 1) {
                toPage = 1;
            }
            if(parseInt(toPage) > parseInt(totalPage) && parseInt(totalPage) > 0){
                toPage = parseInt(totalPage);
            }
            searchList(toPage, params);
        }else{
            $("#toPage").val("");
        }
    }

    function fillData(data) {
        callBack.call(this, data.items);
        //1，总行数，2，有前一页，3，当前页，4，总页数，5，有下一页，
        fillPageData(data.totalCount,data.startIndex, data.currentPage, data.totalPage, data.isMore);
    }

    function fillPageData(totalCount,hasPreviousPage, currentPageNo, totalPageCount, hasNextPage){
        // debugger;
        $("#" + pageId).empty();
        var current = parseInt((currentPageNo - 1) / groupPage);
        var result = "<p>共"+totalCount+"条记录</p><div class=\"pageLft clearfix\">";
        // var result = "<p>共<span>"+totalCount+"</span>条记录</p><div class=\"pageLft clearfix\">";
        //有上一页
        if(hasPreviousPage){
            result += "<a href=\"javascript:void(0);\" onclick=\"javascript:pagination.searchList(" + (currentPageNo - 1) + ");\" class=\"prev\"></a>";
        }
        //前面的“...”
        if(Math.ceil(currentPageNo / groupPage) > 1){
            result += "<span>...</span>";
        }
        //中间的页数
        if(totalPageCount > 0){
            for(var i = current * groupPage; i < (current + 1) * groupPage && i < totalPageCount; i++){
                result += "<a href=\"javascript:void(0);\" onclick=\"javascript:pagination.searchList(" + (i + 1)  + ");\"";
                if(currentPageNo == i + 1){
                    result += " style=\"color: #fff;cursor: default;background-color: #3498da;border-color: #3498da;\"";
                }
                result += ">" + (i + 1) + "</a>";
            }
        }
        //后面的“...”//此处数字是0，
        if(Math.ceil(currentPageNo / groupPage) < Math.ceil(totalPageCount / groupPage)){
            result += "<span>...</span>";
        }
        //有下一页
        if(hasNextPage){
            result += "<a href=\"javascript:void(0);\" onclick=\"javascript:pagination.searchList(" + (currentPageNo + 1)  + ");\" class=\"next\"></a>";
        }
        //闭合
        result += "</div>";
        //确定按钮等
        result += "<div class=\"pageRht\">共<span id=\"totalPage\">" + totalPageCount + "</span>页</div>";
        //添加进页面
        $("#" + pageId).append(result);
    }
    return returnObj;
}

