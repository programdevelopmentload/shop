(function($) {
  var WRAP = '<div id="popwin_Blank" onselectstart="return false;"></div>' + 
		'<div class="popwin_out" id="popwin_Out">' +
			'<div class="popwin_in" id="popwin_In">' +
				'<div id="popwin_Bar" class="popwin_bar" onselectstart="return false;">' +
					'<h4 id="popwin_Title" class="popwin_title"></h4>' +
					'<div class="popwin_close"><a href="javascript:void(0)" id="popwin_Close" title="关闭"></a></div>' +	
				'</div>' +
				'<div class="popwin_body" id="popwin_Body"></div>' +
			'</div>' +
		'</div>';
	
	$.fn.popwin = function(options) {	
		options = options || {};
		var s = $.extend({}, popwinDefault, options);
		return this.each(function() {		
			var node = this.nodeName.toLowerCase();
			if (node === "a" && s.ajaxTagA) {
				$(this).click(function() {
					var href = $.trim($(this).attr("href"));
					if (href && href.indexOf("javascript:") != 0) {
						if (href.indexOf('#') === 0) {
							$.popwin($(href), options);
						} else {
							//加载图片
							$.popwin.loading();
							var myImg = new Image(), element;
							myImg.onload = function() {
								var w = myImg.width, h = myImg.height;
								if (w > 0) {
									var element = $('<img src="'+ href +'" width="'+ w +'" height="'+ h +'" />');
									options.protect = false;
									$.popwin(element, options);
								}
							};
							myImg.onerror = function() {
								//显示加载图片失败
								$.popwin.ajax(href, {}, options);
							};
							myImg.src = href;
						}
					}	
					return false;
				});
			} else {
				$.popwin($(this), options);	
			}
		});				
	};
	
	$.popwin = function(elements, options) {
		if (!elements) {
			return;	
		}

		var s = $.extend({}, popwinDefault, options || {});

		//弹框的显示
		//blank为遮罩DOM，out为容器DOM
		var eleOut = $("#popwin_Out"), eleBlank = $("#popwin_Blank");
					
		if (eleOut.length) {
			eleOut.show();
			eleBlank[s.bg? "show": "hide"]();
		} else {
			$("body").append(WRAP);	
		}
		
		if (typeof(elements) === "object") {
			elements.show();
		} else {
			elements = $(elements);
		}
		//一些元素对象
		$.o = {
			s: s,
			ele: elements,
			//bg为DOM元素
			bg: eleBlank.length? eleBlank: $("#popwin_Blank"), 
			out: eleOut.length? eleOut: $("#popwin_Out"),
			tit: $("#popwin_Title"),
			bar: $("#popwin_Bar"), 
			clo: $("#popwin_Close"),
			bd: $("#popwin_Body")
		};
		
		// 标题以及关闭内容
		$.o.tit.html(s.title);
		$.o.clo.html(s.shut);
		
		//装载元素
		$.o.bd.empty().append(elements);

		if ($.isFunction(s.onshow)) {
			s.onshow();
		}
		//尺寸
		$.popwin.setSize();
		//定位
		$.popwin.setPosition();

		if (s.fix) {
			$.popwin.setFixed();
		}
		if (s.drag) {
			$.popwin.drag();	
		} else {
			$(window).resize(function() {
				$.popwin.setPosition();					  
			});	
		}
		if (!s.bar) {
			$.popwin.barHide();		
		} else {
			$.popwin.barShow();
			/*12-20 update*/
			$(".popwin_remind:visible").addClass("popwin_remindb");
			$(".popwin_con:visible").addClass("popwin_remindb");
			
		}
		if (!s.bg) {
			$.popwin.bgHide();
		} else {
			$.popwin.bgShow();
		}
		if (!s.btnclose) {
			$.popwin.closeBtnHide();	
		} else {
			$.o.clo.click(function() {
				$("#popwin_Blank").remove();
        $("#popwin_Out").remove();
				return false;
			});
		}
		if (s.bgclose) {
			$.popwin.bgClickable();	
		}
		if (s.delay > 0) {
			setTimeout($.popwin.hide, s.delay);	
		}
	};
	$.extend($.popwin, {
		setSize: function() {
			if (!$.o.bd.length || !$.o.ele.length || !$.o.bd.length) {
				return;	
			}
			//主体内容的尺寸
			$.o.out.css({
				"width": $.o.s.width,
				"height:": $.o.s.height
			});
						
			return $.o.out;
		},
		setPosition: function(y,x,flag) {
			flag = flag || false;
			if (!$.o.bg.length || !$.o.ele.length || !$.o.out.length) {
				return;	
			}
			//w为可视区宽度，h为可视区高度，st为滚动条距离，ph为body高度
			var w = $(window).width(), h = $(window).height(), st = $(window).scrollTop(), ph = $("body").height();
			//如果body小于可视区高度，将ph拉高为可视区高度
			if (ph < h) {
				ph = h;	
			}
			//设置宽度和高度
			$.o.bg.width(w).height(ph).css("opacity", $.o.s.opacity);
			//主体内容的位置
			//获取当前主体元素的尺寸
			var xh = $.o.out.outerHeight(), xw = $.o.out.outerWidth();
			if(x){//覆写宽度
				xw = x;
			};
			if(y){//覆写高度
				xh = y;
			};
			var t = st + (h - xh)/2, l = (w - xw)/2;
			
			if ($.o.s.fix && window.XMLHttpRequest) {
				t = (h - xh)/2;
			}
			if (flag === true) {
				$.o.out.animate({
					top: t,
					left: l
				});
			} else {
				$.o.out.css({
					top: t,
					left: l,
					zIndex: $.o.s.index
				});
			}
			return $.o.out;
		},
		//定位
		setFixed: function() {
			if (!$.o.out || !$.o.out.length) {
				return;	
			}
			if (window.XMLHttpRequest) {
				$.popwin.setPosition().css({
					position: "fixed"			
				});
			} else {
				$(window).scroll(function() {
					$.popwin.setPosition();						  
				});
			}
			return $.o.out;
		},
		//背景可点击
		bgClickable: function() {
			if ($.o.bg && $.o.bg.length) {
				$.o.bg.click(function() {
					$.popwin.hide();
				});
			}
		},
		//背景隐藏
		bgHide: function() {
			if ($.o.bg && $.o.bg.length) {
				$.o.bg.hide();
			}
		},
		//背景层显示
		bgShow: function() {
			if ($.o.bg && $.o.bg.length) {
				$.o.bg.show();
			} else {
				$('<div id="popwin_Blank"></div>').prependTo("body");	
			}
		},
		//标题栏隐藏
		barHide: function() {
			if ($.o.bar && $.o.bar.length) {
				$.o.bar.hide();
			}
			
			
			
		},
		//标题栏显示
		barShow: function() {
			if ($.o.bar && $.o.bar.length) {
				$.o.bar.show();
			}
		},
		//关闭按钮隐藏
		closeBtnHide: function() {
			if ($.o.clo && $.o.clo.length) {
				$.o.clo.hide();
				$(".popwin_close").hide();
			}
		},
		//弹框隐藏
		hide: function() {
			if ($.o.ele && $.o.out.length && $.o.out.css("display") !== "none") {
				$.o.out.fadeOut(1, function() {
					if ($.o.s.protect && (!$.o.ele.hasClass("popwin_remind") || $.o.ele.attr("id"))) {
						$.o.ele.hide().appendTo($("body"));
					}
					$(this).remove();
					if ($.isFunction($.o.s.onclose)) {
						$.o.s.onclose();
					}
				});
				if ($.o.bg.length) {
					$.o.bg.fadeOut(1, function() {
						$(this).remove();								
					});
				}
			}
			return false;
		},
		//拖拽
		drag: function() {
			if (!$.o.out.length || !$.o.bar.length) {
				$(document).unbind("mouseover").unbind("mouseup");
				return;
			}
			var bar = $.o.bar, out = $.o.out;
			var drag = false;
			var currentX = 0, currentY = 0, posX = out.css("left"), posY = out.css("top");
			bar.mousedown(function(e) {
				drag = true;
				currentX = e.pageX;
				currentY = e.pageY;							 
			}).css("cursor", "move");	
			$(document).mousemove(function(e) {
				if (drag) {
					var nowX = e.pageX, nowY = e.pageY;
					var disX = nowX - currentX, disY = nowY - currentY;
					out.css("left", parseInt(posX) + disX).css("top", parseInt(posY) + disY);
				}					   
			});
			$(document).mouseup(function() {
				drag = false;
				posX = out.css("left");
				posY = out.css("top");
			});
		},
		//预载
		loading: function() {
			var element = $('<div class="popwin_remind">加载中...</div>');
			$.popwin(element, { bar: false });
		},
		//ask询问方法
		ask: function(message, sureCall, cancelCall, options) {
			var element = $('<div class="popwin_remind">'+message+'<p class="popwin_pbn"><input type="button" id="popwin_Surebtn" class="popwin_subbtn"/><input type="button" id="popwin_Cancelbtn" class="popwin_cancelbtn" /></p></div>');
			$.popwin(element, options);
			//回调方法
			$("#popwin_Surebtn").click(function() {
				if ($.isFunction(sureCall)) {
					sureCall.call(this);
				}						
			});
			$("#popwin_Cancelbtn").click(function() {
				if (cancelCall && $.isFunction(cancelCall)) {
					cancelCall.call(this);
				}
				$.popwin.hide();						  
			});	
		},
		//remind提醒方法
		remind: function(message, callback, options) {
			var element = $('<div class="popwin_remind">'+message+'<p class="popwin_pbn"><input type="button" id="popwin_Submtn" class="popwin_subbtn"/></p></div>');
			$.popwin(element, options);
			$("#popwin_Submtn").click(function() {
				//回调方法
				if (callback && $.isFunction(callback)) {
					callback.call(this);	
				}
				$.popwin.hide();							  
			});
				
		},
		//uri Ajax方法
		ajax: function(uri, params, options) {
			if (uri) {
				$.popwin.loading();
				options = options || {};
				options.protect = false;
				$.ajax({
					url: uri,
					data: params || {},
					success: function(html, other) {
						$.popwin(html, options);
					},
					error: function() {
						$.popwin.remind("加载出了点问题。");	
					}
				});	
			}
		}
	});
	var popwinDefault = {
		title: "对话框",
		shut: "",
		index: 2000,
		opacity: 0.5,
		// opacity: 1,

		width: "auto",
		height: "auto",
		
		bar: true, //是否显示标题栏
		bg: true, //是否显示半透明背景
		btnclose:true, //是否显示关闭按钮
		
		fix: false, //是否弹出框固定在页面上
		bgclose: false, //是否点击半透明背景隐藏弹出框
		drag: true, //是否可拖拽
		
		ajaxTagA: true, //是否a标签默认Ajax操作
		
		protect: "auto", //保护装载的内容
		
		onshow: $.noop, //弹窗显示后触发事件
		onclose: $.noop, //弹窗关闭后触发事件
		
		delay: 0 //弹窗打开后关闭的时间, 0和负值不触发
	};
})(jQuery);