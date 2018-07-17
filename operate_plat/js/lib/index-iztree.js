/**
 * 设置树节点字体样式
 *
 * jhzhang修改
 */
var selectFlag;
var hasCheckObj;
var noBottomFlag = "";
var noBottomFlagPosition = "";
var setting = {
    view: {
        addHoverDom: null,
        removeHoverDom: null,
        dblClickExpand: dblClickExpand,
        selectedMulti: true,
        fontCss: getFontCss,
        // showLine: false,
        expandSpeed:""
    },
    edit: {
        enable: true,
        editNameSelectAll: true,
        showRemoveBtn: showRemoveBtn,
        showRenameBtn: showRenameBtn,
        removeTitle: "删除该节点",
        renameTitle: "编辑该节点"
    },
    data: {
        simpleData: {
            enable: true
        }
    },
    check: {
        enable: true,
        chkStyle: "checkbox",
        chkboxType: { "Y": "p", "N": "ps" }
    },
    callback: {
        beforeDrag: beforeDrag,
        beforeEditName: beforeEditName,
        beforeRemove: beforeRemove,
        beforeRename: beforeRename,
        onRemove: onRemove,
        onRename: onRename,
        // onExpand: onExpand,
        onAsyncSuccess:onAsyncSuccess,
        onCheck: onCheck
    }
};

var iname, entitySeqUrl, saveOrUpdateUrl, deleteUrl, phaseId, subjectId, className = "dark";

function getFontCss(treeId, treeNode) {
    return (!!treeNode.highlight) ? {color: "#A60000", "font-weight": "bold"} : {color: "#333", "font-weight": "normal"};
}

function beforeDrag(treeId, treeNodes) {
    return false;
}
//【标记】
function onExpand(event, treeId, treeNode) {
    for (var i = 0; i < $(window.parent.document).find("#" + treeNode.tId).find("ul li").children("span.switch").length; i++) {
        if ($(window.parent.document).find("#" + treeNode.tId).find("ul li").children("span.switch").eq(i).css("background-positionX") == "-84px") {
            if (!$(window.parent.document).find("#" + treeNode.tId).find("ul li").eq(i).children().last().hasClass("select")) {
                var selectDom;
                if(selectFlag.length > 0){
                    for(var j = 0;j < selectFlag.length;j++){
                        if(selectFlag[j][0] == treeNode.children[i].id){
                            if((selectFlag[j][1] == "undefined") || (selectFlag[j][1] == "1") || (selectFlag[j][1] == undefined) ){
                                selectDom = '<select style="position:absolute;top:0;right:0" class="select" data-id="'+treeNode.children[i].id+'">' +
                                    '<option value="1" selected>请选择认知能力</option>' +
                                    '<option value="2">掌握</option>' +
                                    '<option value="3">精通</option>' +
                                    '</select>';
                                break;
                            }else if(selectFlag[j][1] == "2"){
                                selectDom = '<select style="position:absolute;top:0;right:0" class="select" data-id="'+treeNode.children[i].id+'">' +
                                    '<option value="1">请选择认知能力</option>' +
                                    '<option value="2" selected>掌握</option>' +
                                    '<option value="3">精通</option>' +
                                    '</select>';
                                break;
                            }else if(selectFlag[j][1] == "3"){
                                selectDom = '<select style="position:absolute;top:0;right:0" class="select" data-id="'+treeNode.children[i].id+'">' +
                                    '<option value="1">请选择认知能力</option>' +
                                    '<option value="2">掌握</option>' +
                                    '<option value="3" selected>精通</option>' +
                                    '</select>';
                                break;
                            }
                        }else {
                            selectDom = '<select style="position:absolute;top:0;right:0" class="select" data-id="'+treeNode.children[i].id+'">' +
                                '<option value="1" selected>请选择认知能力</option>' +
                                '<option value="2">掌握</option>' +
                                '<option value="3">精通</option>' +
                                '</select>';
                        }
                    }
                }else{
                    selectDom = '<select style="position:absolute;top:0;right:0" class="select" data-id="'+treeNode.children[i].id+'">' +
                        '<option value="1" selected>请选择认知能力</option>' +
                        '<option value="2">掌握</option>' +
                        '<option value="3">精通</option>' +
                        '</select>';
                };
                $(window.parent.document).find("#" + treeNode.tId).find("ul li").children("a").eq(i).after(selectDom);
            }
        }
    }
}

function beforeEditName(treeId, treeNode) {
    className = (className === "dark" ? "" : "dark");
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    zTree.selectNode(treeNode);
    setTimeout(function () {
        if (confirm("进入节点 -- " + treeNode.name + " 的编辑状态吗？")) {
            setTimeout(function () {
                zTree.editName(treeNode);
            }, 0);
        }
    }, 0);
    return false;
}
function onAsyncSuccess() {
}
function onCheck() {
    emptyTempPosition();
    catchTree();
    treeHasCheckPositon();
    if(mainKnowFlag && (tempMainKnowledgePosition.length === 0)){
        $window.find("#jumpBox5 .show_kl").css("display","block").html("");
    }else if(mainKnowFlag && (tempMainKnowledgePosition.length != 0)){
        mainKnowledgeSelectPosition = getSelect(mainKnowledgeSelectPosition,$window.find("#treeDemo select"),tempMainCodePosition);
        $window.find("#jumpBox5 .show_kl").css("display","block").html("").append(knowAddP(tempMainKnowledgePosition,tempMainCodePosition,2,mainKnowledgeSelectPosition));
    }
    if(secKnowFlag &&(tempSecKnowledgePosition.length ===0)){
        $window.find("#jumpBox5 .show_kl").css("display","block").html("");
    }else if(secKnowFlag &&(tempSecKnowledgePosition.length !=0)){
        secKnowledgeSelectPosition = getSelect(secKnowledgeSelectPosition,$window.find("#treeDemo select"),tempSecCodePosition);
        $window.find("#jumpBox5 .show_kl").css("display","block").html("").append(knowAddP(tempSecKnowledgePosition,tempSecCodePosition,2,secKnowledgeSelectPosition));
    }
}

function getChildNodes(treeNode, str,noBottomFlag) {
    //str为已经拼接到的字符串，treeNode为当前正遍历到的节点
    var pstr = str;
    if (treeNode.isParent || eval(noBottomFlag)) {
        var childrenNodes = treeNode.children;
        if (childrenNodes) {
            for (var i = 0; i < childrenNodes.length; i++) {
                str += '->' + childrenNodes[i].name + '\n';
                str +=  getChildNodes(childrenNodes[i], pstr);
            }
        }
    } else {
        return pstr;
    }
    return str;
}

function getChildNodesCode(treeNode, code) {
    var pcode = code;
    if (treeNode.isParent) {
        var childrenNodes = treeNode.children;
        if (childrenNodes) {
            for (var i = 0; i < childrenNodes.length; i++) {
                code += ',' + childrenNodes[i].id + '\n';
                code +=  getChildNodesCode(childrenNodes[i], pcode);
            }
        }
    } else {
        return pcode;
    }
    return code;
}

function beforeRemove(treeId, treeNode) {
    className = (className === "dark" ? "" : "dark");
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    zTree.selectNode(treeNode);
    return confirm("确认删除该属性 -- " + treeNode.name + " 吗？");
}

function onRemove(e, treeId, treeNode) {
    var id = treeNode.id;
    $.post(deleteUrl, {id: id}, function (returnData) {
        var rtn = eval("(" + returnData + ")");
        if (rtn.result == 0) {
            alert("该属性节点--" + treeNode.name + "已成功删除");
        }
    });
}

function beforeRename(treeId, treeNode, newName, isCancel) {
    className = (className === "dark" ? "" : "dark");
    if (newName.length == 0) {
        setTimeout(function () {
            var zTree = $.fn.zTree.getZTreeObj(treeId);
            zTree.cancelEditName();
            alert("名称不能为空.");
        }, 0);
        return false;
    }
    iname = treeNode.name;
    return true;
}

function onRename(e, treeId, treeNode, isCancel) {
    if (iname == treeNode.name) {
        return;
    }
    var data = {id: treeNode.id, deep: treeNode.level, parentId: treeNode.pId, name: treeNode.name};
    if (phaseId != null) {
        data.phaseId = phaseId;
    }
    if (subjectId != null) {
        data.subjectId = subjectId;
    }
    $.ajax({
        async: false,
        type: "post",
        data: data,
        url: saveOrUpdateUrl,
        success: function (rtnData) {
            var rtnData = eval("(" + rtnData + ")");
            if (rtnData.result == 0) {
                alert('操作成功!');
            } else {
                alert('请检查网络是否有问题！');
            }
        },
        error: function () {
            alert('请检查网络是否有问题！');
        }
    });
}

function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.level > 7) return;
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
    if (treeNode.level > 3)
        var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
            + "' title='添加属性' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_" + treeNode.tId);
    if (btn) btn.bind("click", function () {
        var zTree = $.fn.zTree.getZTreeObj(treeId);
        var treeNodes;
        $.ajax({
            async: false,
            type: "post",
            url: entitySeqUrl,
            success: function (entitySeq) {
                if (entitySeq != "") {
                    treeNodes = zTree.addNodes(treeNode, {id: (entitySeq), pId: treeNode.id, name: "请输入名称"});
                }
                if (treeNodes) {
                    zTree.editName(treeNodes[0]);
                }
            },
            error: function () {
                alert('亲，网络有点不给力呀！');
            }
        });
        return false;
    });
}

function addHoverDomKnowledge(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    //if(treeNode.deep > 4) return;
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='添加属性' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_" + treeNode.tId);
    if (btn) btn.bind("click", function () {
        var zTree = $.fn.zTree.getZTreeObj(treeId);
        var treeNodes;
        $.ajax({
            async: false,
            type: "post",
            url: entitySeqUrl,
            success: function (entitySeq) {
                if (entitySeq != "") {
                    treeNodes = zTree.addNodes(treeNode, {id: (entitySeq), pId: treeNode.id, name: "请输入名称"});
                }
                if (treeNodes) {
                    zTree.editName(treeNodes[0]);
                }
            },
            error: function () {
                alert('亲，网络有点不给力呀！');
            }
        });
        return false;
    });
}

function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.tId).unbind().remove();
}
function showRemoveBtn(treeId, treeNode) {
    return treeNode.level > 4;
}
function showRenameBtn(treeId, treeNode) {
    return treeNode.level > 4;
}
function dblClickExpand(treeId, treeNode) {
    return treeNode.level > 0;
}

function selectAll(treeId) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    zTree.setting.edit.editNameSelectAll = $("#selectAll").attr("checked");
}

function initTree(id, url, isetting, param,timeSign,SelectFlag) {
    if(SelectFlag){
        selectFlag = SelectFlag.concat();
    };
    $.ajax({
        type: "post",
        url: url + timeSign,
        dataType: "json",
        data: param,
        async: false,
        success: function (rtnData, status) {
            debugger;
            if (rtnData.status == 0) {
                if (isetting != null) {
                    $.fn.zTree.init($(window.parent.document).find("#" + id), isetting, rtnData.data);
                } else {
                    $.fn.zTree.init($(window.parent.document).find("#" + id), setting, rtnData.data);
                }
                $("#selectAll").bind("click", selectAll);
            } else {
                if (rtnData.message != null) {
                    alert(rtnData.message);
                } else {
                    alert("加载失败");
                }
            }
        }
    });
};
//【新增】销毁整棵树函数
function  treeDelAll() {
    $.fn.zTree.destroy("treeDemo");
};
//【新增】获取整棵树（并不是获取已经选中的节点的集合）
function catchTree() {
    hasCheckObj = $.fn.zTree.getZTreeObj("treeDemo");
}
//【新增】获取所有勾选节点的函数
function treeHasCheck() {
    if(hasCheckObj){
        var checkNodes = hasCheckObj.getCheckedNodes(true);
        $.each(checkNodes,function (i,v) {
            var childAll = v.children;
            noBottomFlag = "";
            if(childAll){//假如选择了非底层，肯定有子元素
                for(var m=0;m < childAll.length;m++){
                    if(childAll[m].checked){
                        if(m == 0){
                            noBottomFlag += "false";
                        }
                        //遍历勾选节点的子节点，每一个被选择过的，标记为false
                        noBottomFlag += "&& false";
                    }else {
                        if(m == 0){
                            noBottomFlag += "true";
                        }
                        //遍历勾选节点的子节点，每一个没有选择过的，标记为true
                        noBottomFlag += "&& true";
                    }
                }
            };
            //每一个子节点都没被选择的时候，将节点带入循环抓取数据
            if(!v.isParent || eval(noBottomFlag)){
                var nodes = v.getPath();
                var str = '';
                var code = '';
                //遍历下朔上数据流，当带着缓存的时候，我们得不到掌握程度的信息
                $.each(nodes, function (i, v) {
                    //遍历点击节点，将name使用-》进行拼接
                    if (i < nodes.length - 1) {//当数据未遍历至尾部时候，使用“->”进行间隔
                        str += v.name + "->";
                        code += v.id + ",";
                    } else {
                        str += v.name;
                        code += v.id;
                        // str += getChildNodes(v, str,eval(noBottomFlag));
                        // code += getChildNodesCode(v, code);
                    }
                });

                if(mainKnowFlag){//如果主知识点存在
                    tempMainKnowledge = addArr(tempMainKnowledge,sliceStr(str));
                    tempMainCode = addArr(tempMainCode,sliceStrCode(code));
                }
                if(secKnowFlag){//如果次知识点存在
                    tempSecKnowledge = addArr(tempSecKnowledge,sliceStr(str));
                    tempSecCode = addArr(tempSecCode,sliceStrCode(code));
                }
            }
        })
    }
}
//【新增】树的勾选回调函数，获取所有勾选节点的函数
function treeHasCheckPositon() {
    if(hasCheckObj){
        var checkNodes = hasCheckObj.getCheckedNodes(true);
        if(checkNodes.length > 0){
            $.each(checkNodes,function (i,v) {
                var childAll = v.children;
                noBottomFlagPosition = "";
                if(childAll){//假如选择了非底层，肯定有子元素
                    for(var m=0;m < childAll.length;m++){
                        if(childAll[m].checked){
                            if(m == 0){
                                noBottomFlagPosition += "false";
                            }
                            //遍历勾选节点的子节点，每一个被选择过的，标记为false
                            noBottomFlagPosition += "&& false";
                        }else {
                            if(m == 0){
                                noBottomFlagPosition += "true";
                            }
                            //遍历勾选节点的子节点，每一个没有选择过的，标记为true
                            noBottomFlagPosition += "&& true";
                        }
                    }
                };
                //每一个子节点都没被选择的时候，将节点带入循环抓取数据
                if(!v.isParent || eval(noBottomFlagPosition)){
                    var nodes = v.getPath();
                    var str = '';
                    var code = '';
                    //遍历下朔上数据流，当带着缓存的时候，我们得不到掌握程度的信息
                    $.each(nodes, function (i, v) {
                        //遍历点击节点，将name使用-》进行拼接
                        if (i < nodes.length - 1) {//当数据未遍历至尾部时候，使用“->”进行间隔
                            str += v.name + "->";
                            code += v.id + ",";
                        } else {
                            str += v.name;
                            code += v.id;
                            // str += getChildNodes(v, str,eval(noBottomFlagPosition));
                            // code += getChildNodesCode(v, code);
                        }
                    });
                    if(mainKnowFlag){//如果主知识点存在
                        tempMainKnowledgePosition = addArr(tempMainKnowledgePosition,sliceStr(str));
                        tempMainCodePosition = addArr(tempMainCodePosition,sliceStrCode(code));
                    }
                    if(secKnowFlag){//如果次知识点存在
                        tempSecKnowledgePosition = addArr(tempSecKnowledgePosition,sliceStr(str));
                        tempSecCodePosition = addArr(tempSecCodePosition,sliceStrCode(code));
                    }
                }
            })
        }else{
            if(mainKnowFlag){//如果主知识点存在
                tempMainKnowledgePosition = [];
                tempMainCodePosition = [];
            }
            if(secKnowFlag){//如果次知识点存在
                tempSecKnowledgePosition = [];
                tempSecCodePosition = [];
            }
        }
    }
}
//【新增】用于将树展开的函数
function openTreeAll() {
    if(hasCheckObj){
        hasCheckObj.expandAll(true);
    }
}
//【更正触发】展开树的第一级
function  openTreeTop() {
    if(hasCheckObj){
        var topNodes = hasCheckObj.getNodeByParam("id", 0, null);
        hasCheckObj.expandNode(topNodes, true, false, true,true);
    }
}
// function onCheck(e, treeId, treeNode, clickFlag) {
//     var nodes = treeNode.getPath();
//     var str = '';
//     var code = '';
//     //当带着缓存的时候，我们得不到掌握程度的信息
//     $.each(nodes, function (i, v) {
//         //遍历点击节点，将name使用-》进行拼接
//         if (i < nodes.length - 1) {
//             str += v.name + "->";
//             code += v.id + ",";
//         } else {
//             str += v.name;
//             code += v.id;
//             str += getChildNodes(v, str);
//             code += getChildNodesCode(v, code);
//         }
//     });
//
//     if(mainKnowFlag){//如果主知识点存在
//         tempMainKnowledge = addArr(tempMainKnowledge,sliceStr(str));
//         tempMainCode = addArr(tempMainCode,sliceStrCode(code));
//     }
//     if(secKnowFlag){//如果次知识点存在
//         tempSecKnowledge = addArr(tempSecKnowledge,sliceStr(str));
//         tempSecCode = addArr(tempSecCode,sliceStrCode(code));
//     }
// }



/**
 * 截取字符串(知识点：name)
 * */
// tempMainKnowledge = addArr(tempMainKnowledge,sliceStr(str));
function sliceStr(str){
    var temp = "";
    var arr = str.split("\n");
    if(arr.length === 1){
        temp = arr[0].slice(0,arr[0].length);
        arr[0] = temp;
    }else{
        var arrFirst = arr[0];
        var arrLast = arr[arr.length-1];
        arr[0] = arrFirst.slice(arrLast.length);
        arr.length = arr.length-1;
    }
    for(var i=0;i<arr.length;i++){
        arr[i] = arr[i].slice(arr[i].indexOf("->")+2);
    }
    return arr;
}

/**
 * 截取字符串(知识点：code)
 * */
function sliceStrCode(str){
    var temp = "";
    var arr = str.split("\n");
    if(arr.length === 1){
        temp = arr[0].slice(0,arr[0].length);
        arr[0] = temp;
    }else{
        var arrFirst = arr[0];
        var arrLast = arr[arr.length-1];
        arr[0] = arrFirst.slice(arrLast.length);
        arr.length = arr.length-1;
    }
    for(var i=0;i<arr.length;i++){
        arr[i] = arr[i].slice(arr[i].indexOf(",")+1);
    }
    return arr;
}

/**
 * 添加或者删除数组
 * */
// tempMainKnowledge = addArr(tempMainKnowledge,sliceStr(str));
//前面是可能性，后面是综合
function addArr(allArr,tempArr){
    var flag = true;
    if(allArr.length===0){
        allArr = allArr.concat(tempArr);
        flag = false;
    }else{
        for(var i=0;i<allArr.length;i++){
            for(var j=0;j<tempArr.length;j++){
                if(allArr[i]==tempArr[j]){
                    allArr.splice(i,1);
                    flag = false;
                }
            }
        }
    }
    if(flag){
        allArr = allArr.concat(tempArr);
    }
    return allArr;
}
