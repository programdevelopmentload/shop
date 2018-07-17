(function($){
	var currentSelectBox=null;
	function log(){
		if(window.console!=null && window.console.log!=null){
			window.console.log(arguments)
		}
	}

	function supportCss3(style) {
		var prefix = ['webkit', 'Moz', 'ms', 'o'],
			i,
			humpString = [],
			htmlStyle = document.documentElement.style,
			_toHumb = function (string) {
				return string.replace(/-(\w)/g, function ($0, $1) {
					return $1.toUpperCase();
				});
			};
		for (i in prefix)humpString.push(_toHumb(prefix[i] + '-' + style));
		humpString.push(_toHumb(style));
		for (i in humpString)if (humpString[i] in htmlStyle) return true;
		return false;
	}
	function getCssInt(_target,css){
		return isNaN(parseInt($(_target).eq(0).css(css)))?0:parseInt($(_target).eq(0).css(css));
	}
	$.fn.selectBox=function(_option){
		var option=Array.prototype.slice.call(arguments,0);//将slice方法用在形参上，转换为真数组
		if(_option!=null && fun[_option]!=null){
			return fun[_option].apply(this,option.slice(1));
		}else{
			return fun.init.call(this,_option);
		}
		return this;
	}
	//默认参数
	/*高度			data-height
	 宽度			data-width
	 边框宽度		data-border-width
	 边框颜色		data-border-color
	 边框焦点颜色	data-border-hover-color
	 子元素高度		data-node-height

	 */
	var options={
		width:null
		,height:null//高度  
		,nodeHeight:null//子元素行高
		,bodyWidth:null//下拉框的宽度
		,bodyHeight:150//下拉框的高度
		,borderWidth:null//边框大小
		,defaultValue:"请选择"//默认文本
		,boxSizing:null
		,callback:null//回调函数
		,arrawIcon:"▼"
		,arrawActiveIcon:"▲"
		,arrawFontSize:10
		,defaultSelectTouchEvent:false
	}
	//检测是否被初始化，没有初始化就先初始化
	function checkInit(obj){
		$(obj).each(function(index,element){
			if($(element).find(".selectbox_list").length==1 && $(element).find(".selectbox_value").length==1){
				$(element).selectBox();
			};
		})
	}
	function onNodeMouseover(event){
		var node=(($(event.target).parent().hasClass("selectbox_body")==false)?($(event.target).parentsUntil(".selectbox_body").last()):$(event.target))
		if(node.hasClass("selectbox_selected")==false)node.addClass("selectbox_nodebover");
	}
	function onNodeMouseout(event){
		(($(event.target).parent().hasClass("selectbox_body")==false)?($(event.target).parentsUntil(".selectbox_body").last()):$(event.target)).removeClass("selectbox_nodebover")
	}

	function bindMouseWheel(_fun){
		var element=$(this).find(".selectbox_list").get(0);
		if(element.addEventListener){
			element.addEventListener("mousewheel",_fun,false)
			element.addEventListener("DomMouseScroll",_fun,false)
			element.addEventListener("MozMousePixelScroll",_fun,false)
		}else{
			element.attachEvent("onmousewheel",_fun);
		}
	}

	function unBindMouseWheel(_fun){
		var element=$(this).find(".selectbox_list").get(0);
		if(element.removeEventListener){
			element.removeEventListener("mousewheel",_fun)
			element.removeEventListener("DomMouseScroll",_fun)
			element.removeEventListener("MozMousePixelScroll",_fun)
		}else{
			element.detachEvent("onmousewheel",_fun);
		}
	}

	function onMouseWheel(event){
		var orgEvent   = event || window.event
			,delta      = event.delta = (event.wheelDelta) ? event.wheelDelta / 120 : -(event.detail || 0) / 3
			,target		=event.currentTarget||event.srcElement
			,selectbox=$(target).parents(".selectbox:first")
			,selectbox_body=selectbox.find(".selectbox_body")
			,selectbox_list=selectbox.find(".selectbox_list")

		if(selectbox.find(".selectbox_body").is(":hidden"))return false;
		if(selectbox.find(".selectbox_scroll_body").is(":hidden"))return false;
		var diff=delta>0?15:-15
			,bodyTop=parseInt(selectbox_body.css("top"))||0
			,bodyHeight=parseInt(selectbox_body.height())+getCssInt(selectbox_body,"padding-bottom")+getCssInt(selectbox_body,"padding-top")||0
			,listHeight=parseInt(selectbox_list.height())+getCssInt(selectbox_list,"padding-bottom")+getCssInt(selectbox_list,"padding-top")||0;

		if (bodyTop+diff>0){
			bodyTop=0;
		}else if (listHeight-bodyHeight>=bodyTop+diff){
			bodyTop=-(bodyHeight-listHeight);
		}else{
			bodyTop=bodyTop+diff;
		}
		selectbox_body.css("top",bodyTop);
		selectbox.find(".selectbox_scroll_body>.selectbox_scroll").css("top",Math.floor((Math.abs(bodyTop)/bodyHeight)*100)+"%");
		if (event.preventDefault)event.preventDefault();
		event.returnValue = false;
	}

	function onscrollDown(event){
		var targetobj=this;
		var args={target:targetobj,pageX:event.pageX,pageY:event.pageY,top:parseInt($(targetobj).css("top"))||0}
		$("body").bind("mousemove",args,onMousemove).bind("mouseup",args,onMouseup).bind("selectstart",function(){return false});
		$(this).addClass("selectbox_scroll_hover");
		return false;
	}

	function onMousemove(event){
		var target=event.data.target
			,pageX=event.data.pageX
			,pageY=event.data.pageY
			,top=event.data.top
			,selectbox_body=$(target).parents(".selectbox_list").find(".selectbox_body")

		var diff=event.pageY - pageY
			,scrollHeight=$(target).parent().height()
			,bodyHeight=selectbox_body.height()+getCssInt(selectbox_body,"padding-top")+getCssInt(selectbox_body,"padding-bottom")
			,height=$(target).height();
		top=top+diff;

		if(top<0){top=0}else if(top>scrollHeight-height){top=scrollHeight-height}
		$(target).css("top",top);
		$(target).parents(".selectbox:first").find(".selectbox_body").css("top",(top/scrollHeight)*-bodyHeight);
	}

	function onMouseup(event){
		var target=event.data.target
			,pageX=event.data.pageX
			,pageY=event.data.pageY

		$(target).removeClass("selectbox_scroll_hover");
		$(document.body).unbind("mousemove",onMousemove);
		$(document.body).unbind("mouseup",onMouseup);
		$("body").unbind("selectstart");
	}

	function onWebBodyClick(event){
		$(".selectbox").each(function(index, element) {
			up.call(element,event);
			var showCallback=$(element).data("showCallback");
			if(typeof(showCallback) == "function"){
				showCallback.call($(element).find("input:first").get(0),false,"","",element,null);
			}
		});
	}

	function up(){
		currentSelectBox=null;
		$(this).removeClass("selectbox_hover").removeClass("selectbox_active");
		$(this).find(".selectbox_list").stop(true,true).animate({height:0,opacity:0},100);
		$(this).data("show",false);
		$("body").unbind("click",onWebBodyClick);
	}

	function down(){
		$(this).addClass("selectbox_hover").addClass("selectbox_active");
		$(this).find(".selectbox_list").stop(true,true).css("opacity",0).show(0).height(0);
		var selectbox_body=$(this).find(".selectbox_body")
			,body_h=selectbox_body.height()+getCssInt(selectbox_body,"padding-bottom")+getCssInt(selectbox_body,"padding-top")
			,bodyHeight=$(this).data("bodyHeight");
		if(body_h>bodyHeight){
			var scale=Math.round((bodyHeight/body_h)*100);
			$(this).find(".selectbox_scroll_body>.selectbox_scroll").css("height",scale+"%");
			$(this).find(".selectbox_scroll_body").fadeIn(100);
		}else{
			$(this).find(".selectbox_scroll_body").fadeOut(0);
		}
		$(this).find(".selectbox_list").animate({height:body_h>bodyHeight?bodyHeight:body_h,opacity:1},100);
		$(this).data("show",true);
		currentSelectBox=$(this).get(0);

		var showCallback=$(this).data("showCallback");
		if(typeof(showCallback) == "function"){
			var val=$(this).find("input:first").val();
			var target=$(this).find(".selectbox_body>.selectbox_selected");
			if(target.length==1){
				showCallback.call($(this).find("input:first").get(0),true,"","",this,null);
			}else{
				showCallback.call($(this).find("input:first").get(0),true,val,target.text(),this,target);
			}
		}
		$("body").bind("click",onWebBodyClick);
	}
	function onShow(event){
		event.stopPropagation();
		var element=$(this).hasClass(".selectbox")?$(this):(($(this).parent().hasClass(".selectbox"))?$(this).parent():$(this).parents(".selectbox:first"));
		if(element.hasClass("selectbox_disable"))return;
		if(element.find(".selectbox_body").children().length==0)return;
		if(currentSelectBox!=null  && element.get(0) != currentSelectBox){
			up.call(currentSelectBox)
		}
		if(element.data("show")==true){up.call(element)}else{down.call(element)}
	}

	function updateScroll(){
		var selectbox_body=$(this).find(".selectbox_body")
			,body_h=selectbox_body.height()+getCssInt(selectbox_body,"padding-bottom")+getCssInt(selectbox_body,"padding-top")
			,bodyHeight=parseInt(selectbox_body.height())+getCssInt(selectbox_body,"padding-bottom")+getCssInt(selectbox_body,"padding-top")||0
		if($(this).find(".selectbox_body").children().length==0){
			$(this).find(".selectbox_scroll_body").fadeOut(0);
		}else if(body_h>bodyHeight){
			var scale=Math.round((bodyHeight/body_h)*100);
			$(this).find(".selectbox_scroll_body>.selectbox_scroll").css("height",scale+"%");
			$(this).find(".selectbox_scroll_body").fadeIn(100);
		}else{
			$(this).find(".selectbox_scroll_body").fadeOut(0);
		}
	}

	//点击列表内容之后
	function onSelect(event){
		var target=$(event.target);
		if($(event.target).parent().hasClass("selectbox_body")==false){
			target=($(event.target).parentsUntil(".selectbox_body").last())
		}
		var selectBox=target.parents(".selectbox:first");
		if(target.length==1 && selectBox.length==1 && target.parent().children().length>0){
			var fun=selectBox.data("callback");
			var val=target.attr("data-value");
			var showCallback=selectBox.data("showCallback");
			if(typeof(showCallback) == "function"){
				showCallback.call(selectBox.find("input:first").get(0),false,val,target.text(),selectBox,target);
			}
			if(typeof(fun) == "function"){
				if(fun.call(selectBox.find("input:first").get(0),val,target.text(),selectBox,target)===false){
					up.call(selectBox);
					event.stopPropagation();
					return true;
				};
			}
			var val=target.attr("data-value");
			selectBox.find(".selectbox_value").text(target.text());
			selectBox.find("input:first").val(val).trigger("change");
			up.call(selectBox);
			target.parent().children().removeClass("selectbox_selected");
			target.addClass("selectbox_selected");
		}
		event.stopPropagation();
		return true;
	}

	var fun={
		init:function(_opt){
			this.each(function(index,_element){
				if($(_element).find(".selectbox_list").length==0 || $(_element).find(".selectbox_value").length==0)return;
				var element=_element
					,opt=(_opt instanceof Object)?_opt:{}
					,option=$.extend({},options,opt);
				option=$.extend({},option,{
					//默认文本
					defaultValue:$(element).attr("data-default-value")||option.defaultValue||"请选择"
					//高度
					,height:parseInt($(element).attr("data-height"))||parseInt(option.height)||parseInt($(element).css("height"))||30
					//宽度
					,width:parseInt($(element).attr("data-width"))||parseInt(option.width)||parseInt($(element).css("width"))||-1
					//子元素高度
					,nodeHeight:parseInt($(element).attr("data-node-height"))||parseInt(option.nodeHeight)||30
					//下拉框宽度
					,bodyWidth:parseInt($(element).attr("data-body-width"))||parseInt(option.bodyWidth)||parseInt($(element).find(".selectbox_list").css("width"))||(parseInt($(element).attr("data-width"))||parseInt(option.width)||parseInt($(element).css("width"))||100)
					//下拉框最大高度
					,bodyHeight:parseInt($(element).attr("data-body-height"))||parseInt(option.bodyHeight)||parseInt($(element).find(".selectbox_list").css("max-height"))||250
					//边框模式
					,boxSizing:($(element).attr("data-box-sizing"))||(option.boxSizing)||($(element).css("box-sizing"))||"content-box"
					//边框大小
					,borderWidth:parseInt($(element).attr("data-border-width"))||parseInt(option.borderWidth)||parseInt($(element).css("border-width"))||1
					//边框颜色
					,borderColor:($(element).attr("data-border-color"))||(option.borderColor)||($(element).css("border-color"))||"#c2c2c2"
					//焦点颜色
					,borderHoverColor:""
					,callback:(option.callback)
				})

				//边框高度设定
				option.diff=(option.boxSizing=="border-box" && supportCss3("box-sizing"))?0:0;

				$(element).data($.extend({},$(element).data(),option));

				//选择列表内容
				$(element).find(".selectbox_body").unbind("click").bind("click",onSelect);
				//展开下拉列表
				$(element).find(".selectbox_arraw,.selectbox_value").unbind("click").bind("click",onShow);

				//初始化样式
				if(option.width>0)$(element).width(option.width);
				if(option.height>0)$(element).height(option.height);
				$(element).css("border-width",option.borderWidth)
					.css("border-color",option.borderColor)
					.css("line-height",option.height+option.diff*option.borderWidth*2+"px")
					.hover(null,null)
					.hover(function(event){
						$(this).addClass("selectbox_hover")
					},function(event){
						$(this).removeClass("selectbox_hover");
					});

				$(element).find(".selectbox_list").width(option.bodyWidth+option.diff*option.borderWidth*2);
				$(element).find(".selectbox_value,.selectbox_arraw")
					.height(option.height+option.diff*option.borderWidth*2)
					.css("line-height",option.height+option.diff*option.borderWidth*2+"px");
				$(element).find(".selectbox_scroll_body>.selectbox_scroll").unbind("mousedown click").bind({mousedown:onscrollDown,click:function (event){event.stopPropagation()}});
				//绑定滚动条
				unBindMouseWheel.call(element,onMouseWheel);
				bindMouseWheel.call(element,onMouseWheel);
				//绑定子项焦点样式
				$(element).find(".selectbox_body").unbind("mouseover").unbind("mouseout").bind("mouseover",onNodeMouseover).bind("mouseout",onNodeMouseout);

				if(!($(element).data("selectboxInit"))){
					$(element).find(".selectbox_body>li[selected]:first").trigger("click");
				}
				$(element).data("selectboxInit",true);
			});
			return this;
		}
		//设置标题和值
		,setCaption:function(_value,_data){
			this.each(function(index,element){
				if($(element).data("selectboxInit")!=true)return;
				$(element).find(".selectbox_value").text(_value);
				$(element).find("input:hidden").val((_data?_data:""));
				$(element).find(".selectbox_body").children().removeClass("selectbox_selected");
			})
			return this;
		}
		//获取子元素长度
		,getLength:function(){
			var length=0
			this.each(function(index,element){
				length=$(element).find(".selectbox_body").children().length;
				return false;
			})
			return length;
		}
		//设置列表项目值
		,setDataValue:function(_index,_caption,_data){
			this.each(function(index,element){
				$(element).find(".selectbox_body").children().eq(_index).text(_caption).attr("data-value",_data);
			})
			return this;
		}
		//添加列表（内容，值，是否选择）
		,add:function(_value,_data,_select,_isTrigger){
			this.each(function(index,element){
				if($(element).data("selectboxInit")!=true)return;
				$(element).find(".selectbox_body").append("<li data-value=" +_data+ ">"+_value+"</li>");
				if(_select==true){
					if(_isTrigger===false){
						$(element).find("input:hidden").text($(element).find(".selectbox_body").children().eq(_index).attr("data-value"));
						$(element).find(".selectbox_value").text($(element).find(".selectbox_body").children().eq(_index).text());
					}else{
						$(element).find(".selectbox_body").children(":last").trigger("click");
					}
				}
				updateScroll.call(element);
			})
			return this;
		}
		//添加某一项索引前添加一项（索引，内容，值，是否选择）
		,addBeforeIndex:function(_index,_value,_data,_select,_isTrigger){
			this.each(function(index,element){
				if($(element).data("selectboxInit")!=true)return;
				$('<li data-value="' +_data+ '">'+_value+'</li>').insertBefore($(element).find(".selectbox_body").children().eq(_index).get(0));
				if(_select==true){
					if(_isTrigger===false){
						$(element).find("input:hidden").text($(element).find(".selectbox_body").children().eq(_index).attr("data-value"));
						$(element).find(".selectbox_value").text($(element).find(".selectbox_body").children().eq(_index).text());
					}else{
						$(element).find(".selectbox_body").children().eq(_index).trigger("click");
					}
				}
				updateScroll.call(element);
			})
			return this;
		}
		//添加某一项索引后添加一项（索引，内容，值，是否选择）
		,addAfterIndex:function(_index,_value,_data,_select,_isTrigger){
			this.each(function(index,element){
				if($(element).data("selectboxInit")!=true)return;
				$('<li data-value="' +_data+ '">'+_value+'</li>').insertAfter($(element).find(".selectbox_body").children().eq(_index).get(0));
				if(_select==true){
					if(_isTrigger===false){
						$(element).find("input:hidden").text($(element).find(".selectbox_body").children().eq(_index).attr("data-value"));
						$(element).find(".selectbox_value").text($(element).find(".selectbox_body").children().eq(_index).text());
					}else{
						$(element).find(".selectbox_body").children().eq(_index).next().trigger("click");
					}
				}
				updateScroll.call(element);
			})
			return this;
		}
		//显示隐藏回调函数
		,showCallback:function(_callback){
			this.each(function(index,element){
				if($(element).data("selectboxInit")!=true)return;
				$(element).data("showCallback",_callback);
			})
			return this;
		}
		//删除全部
		,removeAll:function(){
			this.each(function(index,element){
				if($(element).data("selectboxInit")!=true)return;
				$(element).find(".selectbox_body").children().remove();
				$(element).find("input:first").val("");
				$(element).find(".selectbox_value").text($(element).data("defaultValue"));
				updateScroll.call(element);
			})
			return this;
		}
		//显示下拉列表
		,showList:function(){
			this.each(function(index,element){
				if($(element).data("selectboxInit")!=true)return;
				down.call(element);
			})
			return this;
		}
		//隐藏下拉列表
		,hideList:function(){
			this.each(function(index,element){
				if($(element).data("selectboxInit")!=true)return;
				up.call(element);
			})
			return this;
		}
		//绑定回调事件
		,callback:function(calback){
			this.each(function(index,element){
				if($(element).data("selectboxInit")!=true)return;
				$(element).data("callback",calback);
			})
			return this;
		}
		//获取选中项目索引
		,getSelectIndex:function(){
			var _index=-1
			this.each(function(index,element){
				_index=$(element).find(".selectbox_body").children().filter(".selectbox_selected").index();
				return false
			})
			return _index;
		}
		//通过索引删除列表（索引）
		,removeForIndex:function(_index){
			this.each(function(index,element){
				if($(element).data("selectboxInit")!=true)return;
				$(element).find(".selectbox_body").children().eq(_index).remove();
				if($(element).hasClass("selectbox_selected")){
					//删除了当前选中项目
					$(element).find("input:first").val("");
					$(element).find(".selectbox_value").text($(element).data("defaultValue"));
				}
				updateScroll.call(element);
			})
			return this;
		}
		//通过值选中某个元素
		,selectForData:function(_data,_isTrigger){
			this.each(function(index,element){
				if($(element).data("selectboxInit")!=true)return;
				$(element).find(".selectbox_body").children().each(function(_index, _element) {
					if($(_element).attr("data-value")==String(_data)){
						if(_isTrigger===false){
							$(element).find("input:hidden").text($(element).find(".selectbox_body").children().eq(_index).attr("data-value"));
							$(element).find(".selectbox_value").text($(element).find(".selectbox_body").children().eq(_index).text());
							$(element).find(".selectbox_body").children().removeClass("selectbox_selected").eq(_index).addClass("selectbox_selected");
						}else{
							$(_element).trigger("click");
						}
					}
				});
				updateScroll.call(element);
			})
			return this;
		}
		//通过值删除列表（值，允许删除多项）
		,removeForData:function(_data,_more){
			this.each(function(index,element){
				if($(element).data("selectboxInit")!=true)return;
				$(element).find(".selectbox_body").children().each(function(index, element) {
					if($(element).attr("data-value")==_data){
						$(element).addClass("selectbox_delete");
						if($(element).hasClass("selectbox_selected")){
							//删除了当前选中项目
							$(element).find("input:first").val("");
							$(element).find(".selectbox_value").text($(element).data("defaultValue"));
						}
					}
				});
				$(element).find(".selectbox_delete").remove();
				updateScroll.call(element);
			})
			return this;
		}
		//用Index选中某个元素
		,selectForIndex:function(_index,_isTrigger){
			this.each(function(index,element){
				if($(element).data("selectboxInit")!=true)return;
				if(_isTrigger===false){
					$(element).find("input:hidden").text($(element).find(".selectbox_body").children().eq(_index).attr("data-value"));
					$(element).find(".selectbox_value").text($(element).find(".selectbox_body").children().eq(_index).text());
				}else{
					$(element).find(".selectbox_body").children().eq(_index).trigger("click");
				}
			});
			return this;
		}
		//获取当前选中值 {caption:"",data:""}
		,getForIndex:function(_index){
			var option={}
			this.each(function(index,element){
				if($(element).data("selectboxInit")!=true)return;
				option.caption=$(element).find(".selectbox_body").children().eq(_index).text();
				option.data=$(element).find(".selectbox_body").children().eq(_index).attr("data-value");
				return false;
			});
			return option;
		}
	}

	$(function(){
		$(".selectbox").selectBox();//初始化
	})
})(jQuery);