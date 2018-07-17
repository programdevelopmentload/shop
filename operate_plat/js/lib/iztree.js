/**
 * 设置树节点字体样式
 */
function getFontCss(treeId, treeNode) {
    return (!!treeNode.highlight) ? {color:"#A60000", "font-weight":"bold"} : {color:"#333", "font-weight":"normal"};
}
var setting = {
    view: {
        addHoverDom: addHoverDom,
        removeHoverDom: removeHoverDom,
        dblClickExpand: dblClickExpand,
        //showIcon: false,
        selectedMulti: false,
        fontCss: getFontCss
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
    callback: {
        beforeDrag: beforeDrag,
        beforeEditName: beforeEditName,
        beforeRemove: beforeRemove,
        beforeRename: beforeRename,
        onRemove: onRemove,
        onRename: onRename
    }
};
var iname,entitySeqUrl,saveOrUpdateUrl,deleteUrl, phaseId,subjectId,className = "dark";
function beforeDrag(treeId, treeNodes) {
    return false;
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
        data.phaseId =  phaseId;
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
    if(treeNode.level > 7) return;
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0) return;
    if(treeNode.level > 3)
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
            success : function(entitySeq){
                if(entitySeq != "" ){
                    treeNodes = zTree.addNodes(treeNode, {id:(entitySeq), pId:treeNode.id, name:"请输入名称" });
                }
                if (treeNodes) {
                    zTree.editName(treeNodes[0]);
                }
            },
            error : function(){
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
            success : function(entitySeq){
                if(entitySeq != "" ){
                    treeNodes = zTree.addNodes(treeNode, {id:(entitySeq), pId:treeNode.id, name:"请输入名称" });
                }
                if (treeNodes) {
                    zTree.editName(treeNodes[0]);
                }
            },
            error : function(){
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
    return treeNode.level > 4 ;
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

function initTree(id, url, isetting, param) {
    //
    $.ajax({
        type:"post",
        url:url,
        dataType:"json",
        // data:param,
        // async: false,
        success:function(rtnData,status) {
            debugger;
            if(rtnData.success == true){
                if(isetting != null) {
                    $.fn.zTree.init($("#" + id), isetting, rtnData.data);
                }else{
                    $.fn.zTree.init($("#" + id), setting, rtnData.data);
                }
                $("#selectAll").bind("click", selectAll);
            }else{
                if(rtnData.message != null) {
                    alert(rtnData.message);
                } else {
                    alert("加载失败");
                }
            }
        }
    });
}