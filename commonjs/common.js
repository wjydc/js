//console.log();
// 取消点击模态对话框的外部区域不会将其关闭;
$.fn.modal.defaults.backdrop = "static";
// 删除前后空格;
$.fn.delBlank = function(){
	return this.each(function(){
		$(this).val($.trim($(this).val()));
	});
};
//时间对象的格式化 Date.format("yyyy-MM-dd hh:mm:ss");
Date.prototype.format = function(b){var c={"M+":this.getMonth()+1,"d+":this.getDate(),"h+":this.getHours(),"m+":this.getMinutes(),"s+":this.getSeconds(),"q+":Math.floor((this.getMonth()+3)/3),S:this.getMilliseconds(),Z:this.getDay()};if(/(y+)/.test(b)){b=b.replace(RegExp.$1,(this.getFullYear()+"").substr(4-RegExp.$1.length))}for(var a in c){if(new RegExp("("+a+")").test(b)){b=b.replace(RegExp.$1,RegExp.$1.length==1?c[a]:("00"+c[a]).substr((""+c[a]).length))}}return b};
// Array 扩展;
Array.prototype.getIndex=function(c){var b=0,a=this.length;for(;b<a;b++){if(this[b]==c){return b}}return -1};
Array.prototype.remove=function(b){var a=this.getIndex(b);return a!==-1?this.splice(a,1):null};
Array.prototype.replaceArr=function(c,b){var a=this.getIndex(c);return a!==-1?this.splice(a,1,b):null};

$(document).ready(function(){``
	// 左侧主导航展开;
	$('.submenu > a').on("click", function(e){
		e.preventDefault();
		var submenu = $(this).siblings('ul');
		var li = $(this).parents('li');
		var submenus = $('#sidebar li.submenu ul');
		var submenus_parents = $('#sidebar li.submenu');
		if(li.hasClass('open')){
			submenu.stop().slideUp();
			li.removeClass('open');
		}else{
			submenus.stop().slideUp();			
			submenu.stop().slideDown();
			submenus_parents.removeClass('open');		
			li.addClass('open');	
		}
	});
	
	$("#sidebar").height($(window).height() - $("#header").height());
	// 启用日期选择控件;
	//$('.datepicker').datepicker();
	
	// 上下左右提示;
	$('.tip-left').tooltip({ placement: 'left' });	
	$('.tip-right').tooltip({ placement: 'right' });	
	$('.tip-top').tooltip({ placement: 'top' });	
	$('.tip-bottom').tooltip({ placement: 'bottom' });
	$("[data-toggle=popover]").popover(); // 带标题的提示;
	// 重置表单;
	$(":reset").on("click", function(){
		var form = $(this).parents("form");
		form.find(":text").val("");
		form.find("input[type=tel]").val("");
		form.find("input[type=email]").val("");
		form.find("input[type=date]").val("");
		form.find(":checkbox").attr("checked", false);
		form.find(":selected").attr("selected", false);
		return false;
	});
});

// scroll;
/*$(window).scroll(function(){
	var win = $(this), top = win.scrollTop(), nav = $("#matrix-nav");
	// 固定左侧导航;
	top > 0 ? nav.addClass("sidebar-fixed") : nav.removeClass("sidebar-fixed");
});
*/

(function(window, $){
	MA = {};
	MA.extend = function(o){return o;}
	//主对象;
	Matrix = MA.extend({
		tools: {
			search: function(v){var value = location.search.match(new RegExp("[\?\&]" + v + "=([^\&]*)(\&?)", "i"));return value ? decodeURIComponent(value[1]) : "";}
		},
		// 定位左侧主导航		Matrix.Nav({"menu": 1, "cmenu": 5});
		Nav: function(val){
			for(key in val){
				$("#matrix-nav li[data-id=nav-"+ key +"-"+ val[key] +"]").addClass("active open");
			}
		},
		// ajax加载返回json;
		JSON: function(a){
			if(a.showLoad){
				$("body").append('<div id="ajax-loading" style="position:fixed; left:0; top:0; width:100%; height:100%; background:url(data:image/gif;base64,R0lGODlhEAALAPQAAAAAAP///yQkJC4uLhQUFPj4+P///9DQ0Hx8fJ6enkRERNzc3LS0tHR0dJqamkBAQNjY2Pr6+rCwsBgYGCYmJgoKCsbGxiIiIgwMDEhISF5eXjQ0NBAQEAAAAAAAAAAAACH+GkNyZWF0ZWQgd2l0aCBhamF4bG9hZC5pbmZvACH5BAALAAAAIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh+QQACwABACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQACwACACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh+QQACwADACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAALAAQALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkEAAsABQAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C+4FIIACH5BAALAAYALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkEAAsABwAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7AAAAAAAAAAAA) no-repeat center center #000; opacity:.8; z-index:9999999;"></div>');
			}
			$.ajax({
			  timeout: a.timeout || 6e4,
			  type: a.type || "GET",
			  dataType: a.dataType || "json",
			  url: $.isArray(a.url) ? [ a.url.join("/") ].join("/") : a.url,
			  data: a.val,
			  success: function(b) {
					a.showLoad ? $("#ajax-loading").remove() : null;
					if($.isFunction(a.fun)){
						a.fun.call(a.fun, b);
					}
			  },
			  error:function(e) {
					a.showLoad ? $("#ajax-loading").remove() : null;
					  if (e.statusText == "timeout") {
						  Toast.show("服务器繁忙，请稍后再试~");
					  } else {
						  Toast.show("出错啦，赶快联系我们的攻城狮~");
					  }
					//Toast.show({template: "AJAX请求错误"});
			    console.log(e);
			  },
				complete: function(){
					if($.isFunction(a.complete)){
						a.complete.call(a.complete);
					}
				}
			});
		},
		// 全选/反选;
		CheckedAll: function(elems, checkbox){
			if(elems.data("checked")){
				elems.data("checked", false).find((checkbox ? checkbox : ":checkbox") + ":enabled").removeAttr("checked");
			}else{
				elems.data("checked", true).find((checkbox ? checkbox : ":checkbox") + ":enabled").attr("checked", "checked");
			}
		},
		// 转换年龄至天;
		AgeToDay: function(op){
			var self = this, c = self.config, day = 0;
			// 年换算;
			if(op.yy != undefined && op.yy.length){
				var val = $.trim(op.yy.val());
				if($.trim(val) != "" && !isForm.isImp(val)){
					op.yy.focus();
					Toast.show('请输入正确的数值');
					return false;
				}
				day += Number(val) * 365;
			}
			// 月换算;
			if(op.mm != undefined && op.mm.length){
				var val = $.trim(op.mm.val());
				if($.trim(val) != "" && !isForm.isImp(val)){
					op.mm.focus();
					Toast.show('请输入正确的数值');
					return false;
				}
				day += Number(val) * 30;
			}
			// 天;
			if(op.dd != undefined && op.dd.length){
				var val = $.trim(op.dd.val());
				if($.trim(val) != "" && !isForm.isImp(val)){
					op.dd.focus();
					Toast.show('请输入正确的数值');
					return false;
				}
				day += Number(val);
			}
			//console.log(day);
			return day;
			//$.extend(c, options);
		},
		// 天换算成几年几月几日;
		DayToAge: function(d){
			return {
				yy: parseInt(d / 365),
				mm: parseInt(d % 365 / 30),
				dd: d % 365 % 30
			}
		},
		is: function(obj){
			return toString.call(obj).slice(8, -1).toLowerCase();
		},
		dateParse: function (string) {
			var reg = new RegExp("^\\d+(\\-|\\/)\\d+(\\-|\\/)\\d+$");
			if ("string" == typeof string) {
			  if (reg.test(string) || isNaN(Date.parse(string))) {
			    var d = string.split(/ |T/), d1 = d.length > 1 ? d[1].split(/[^\d]/) :[ 0, 0, 0 ], d0 = d[0].split(/[^\d]/);
			    return new Date(d0[0] - 0, d0[1] - 1, d0[2] - 0, d1[0] - 0, d1[1] - 0, d1[2] - 0);
			  } else {
			    return new Date(string);
			  }
			}
			return null;
    },
		diff: function (interval, date1, date2) {
			var objInterval = {
				'D': 1000 * 60 * 60 * 24,
				'H': 1000 * 60 * 60,
				'M': 1000 * 60,
				'S': 1000,
				'T': 1
			},
			dt1 = this.is(date1) === "date" ? date1 : this.dateParse(date1),
			dt2 = this.is(date2) === "date" ? date2 :  this.dateParse(date2);
      return Math.round((dt2 - dt1) / objInterval[interval.toUpperCase()]);
    },
		// 合并单元格  Matrix.rowspan($("table"), [1,3,4]);
		rowspan: function(table, td){
			// 组合tr数据;
			var id = [];
			table.find("tbody tr").each(function(i, e){
				var d = $(e).data("id");
				id.getIndex(d) == -1 && id.push(d);
			});
			// console.log(id);
			// 执行合并;
			for(var i = 0; i < id.length; i++){
				var tr = table.find("tbody tr[data-id="+ id[i] +"]"), first = $(), next = $();
				for(var j = 0; j < td.length; j++){
					$.merge(first, tr.first().children("td:nth-child("+ td[j] +")"));
					$.merge(next, tr.slice(1).children("td:nth-child("+ td[j] +")"));
				}
				//console.log(first);
				first.attr("rowspan", tr.length);
				next.remove();
				tr.attr('data-merge',tr.length);  //增加标识
			}
		}
	});
	
	// 省、市、区选择;
	/*$(".js-address").on("click", function(){
		var thas = $(this);
		Matrix.address.show({
			selects: ["prv", "city"],
			button: thas,
			callblock: $(".js-address-list")			// 要保存已选择的数据元素;
		});
	});*/
	// 密码强度;
	Matrix.password = {
		//判断输入密码的类型
		CharMode: function (iN) {
			if (iN >= 48 && iN <= 57) //数字
				return 1;
			if (iN >= 65 && iN <= 90) //大写
				return 2;
			if (iN >= 97 && iN <= 122) //小写
				return 4; else return 8;
		},
		//计算密码模式
		bitTotal: function (num) {
			modes = 0;
			for (i = 0; i < 4; i++) {
				if (num & 1) modes++;
				num >>>= 1;
			}
			return modes;
		},
		//返回强度级别
		checkStrong: function (sPW) {
			var self = this;
			if (sPW.length <= 5 || sPW.length > 16) return 0;
			//密码太短
			Modes = 0;
			for (i = 0; i < sPW.length; i++) {
				//密码模式
				Modes |= self.CharMode(sPW.charCodeAt(i));
			}
			return self.bitTotal(Modes);
		},
		init: function (pwd) {
			var self = this;
			if (pwd == null || pwd == "") {
				return 0;
			} else {
				return self.checkStrong(pwd);
			}
		}
	};

	// 地址;
	Matrix.address = {
		config: {
			selects: ["prv", "city", "area"],		// 下拉选框组
			api: {
				prv: root + "/activity/showPrv.do",
				city: root + "/activity/showCity.do",
				area: root + "/activity/showArea.do"
			},
			// 返回值的前缀字段名，因接口数据返回不统一，特殊处理一下;
			key: {
				prv: "prv",
				city: "city",
				area: "cityArea"
			},
			isShow: false,
			debug: false,
			width: 150,
			val: [],
			filter: [100000], // 要过滤的数据id;
			cityChecked: true, // 城市是否可选
			cityArea: false, // 选择后同时显示城市、区
		},
		data: {},				// 缓存数据;
		info: {},
		init: function(options){
			var self = this, o = self.info, c = self.config, arr = ['<div class="MA-address-pop">'];
			$.extend(c, options);
			for(var i = 0; i < c.selects.length; i++){
				arr.push('<ul class="'+ c.selects[i] +'" data-current="'+ c.selects[i] +'" data-next="'+ c.selects[i+1] +'"></ul>');
			}
			arr.push('</div>');
			$("body").append(arr.join(''));
			o.elems = $(".MA-address-pop");
			o.block = o.elems.children();
			// 点击冒泡隐藏;
			$(document).on("click", function(e){
				if(c.isShow && $(e.target).parents(".MA-address-pop").length == 0 && c.button.attr("class") != $(e.target).attr("class")){
					self.hide();
				}
			});
			// 事件绑定;
			c.button.on("click", function(){
				if(c.isShow){
					c.isShow = false;
					self.hide();
				}else{
					c.isShow = true;
					self.show();
				}
			});
			o.elems.on("click", "li", function(){
				var thas = $(this), parent = thas.parent(), nextAll = parent.nextAll();
				if(thas.hasClass("hover") || thas.data("id") == -1) return;
				parent.children().removeClass("hover");
				thas.addClass("hover");
				c.current = parent.data("current"); // 当前字段名;
				c.next = parent.data("next"); // 下一级字段名;
				// 如果后面多于1级，清空后面的内容;
				//if(nextAll.length > 1){
				//	nextAll.html('');
				//}
				if(c.next == "undefined") return;
				self.get(thas.data("id"));
			});
			// 选择城市;
			o.elems.on("change", "input", function(e){
				var thas = $(this), parent = thas.parent();
				// 全选操作;
				if(thas.val() == -1){
					var nextAll = thas.parent().nextAll();
					if(thas.attr("checked")){
						nextAll.each(function(){
							self.add($(this));
							$(this).find("input").attr("checked", "checked");
						});
					}else{
						nextAll.each(function(){
							self.del($(this));
							$(this).find("input").removeAttr("checked");
						});
					}
				}else{
				// 正常选择操作;
					var uls = thas.parents("ul");
					if(thas.attr("checked")){
						self.add(parent);
						//thas.attr("checked", "checked");
					}else{
						self.del(parent);
						//thas.removeAttr("checked");
					}
					// 是否全部选中了。
					self.isAll();
				}
			});
			// 已选中的进行删除;
			c.callblock.on("click", "del", function(){
				var par = $(this).parent(), id = par.data("id");
				c.val.remove(id);
				par.remove();
				c.callblock.data("val", c.val); // 更新元素上的保存的值;
				c.debug && console.log(c.val);
			});
		},
		del: function(lis){
			var self = this, c = self.config, id = lis.find("input").val();
			c.callblock.children("[data-id="+ id +"]").remove();
			c.val.remove(id);
			c.callblock.data("val", c.val); // 更新元素上的保存的值;
			c.debug && console.log(c.val);
		},
		add: function(lis){
			var self = this, o = self.info, c = self.config, id = lis.find("input").val();
			if(c.callblock.children("[data-id="+ id +"]").length == 0){
				c.callblock.append('<span data-id="'+ id +'" data-name="' + lis.find("em").text() + '">'+ (c.cityArea ? $('.MA-address-pop .city li.hover em').text() : '') + lis.find("em").text() +'<del>x</del></span>');
				c.val.push(id);
				c.callblock.data("val", c.val); // 更新元素上的保存的值;
			}
			c.debug && console.log(c.val);
		},
		show: function(){
			var self = this, o = self.info, c = self.config;
			//if(c.isShow) return;
			//$.extend(c, options);
			//!o.elems && self.init();
			//c.val = c.callblock.data("val") ? c.callblock.data("val") : [];
			o.elems.css("display", "flex").width(c.width * c.selects.length);
			c.isShow = true;
			c.debug && console.log(c.val);
			c.next = c.selects[0]; // 下一级字段名;
			self.get(); // 加载数据;
			self.place(); // 定位位置;
		},
		// 计算位置;
		place: function(){
			var self = this, o = self.info, c = self.config;
			var offset = c.button.offset(), dh = $(document).height(), wh = $(window).height();
			var maxh = wh, //dh > wh ? dh : wh
			top = offset.top + c.button.height();
			if(o.elems.height() + top > maxh){
				top = offset.top - o.elems.height() - 5;
			}
			//console.log(maxh);
			o.elems.css({left: offset.left, top: top});
		},
		hide: function(){
			var self = this, o = self.info, c = self.config;
			//c.debug && console.log("hide");
			o.elems.hide();
			c.isShow = false;
		},
		get: function(id){
			var self = this, o = self.info, c = self.config;
			c.debug && console.log(id);
			// 当前;
			o.current = o.elems.find("." + c.next);
			// 是否已有缓存的字段;
			if(self.data[c.next]){
				// 带id，查询此字段下相应id是否有数据;
				if(id && self.data[c.next][id]){
					return self.html(self.data[c.next][id]);
				}else if(!id && self.data[c.next]){
					return self.html(self.data[c.next]);
				}
			}
			var val = {};
			if(id){
				val[c.current + "Id"] = id;
			}
			//console.log(val);
			//return;
			Matrix.JSON({
				url: c.api[c.next],
				val: val,
				fun: function(res){
					// 缓存数据;
					if(id){
						if(!self.data[c.next]) self.data[c.next] = {}; // 如未创建此字段，新建为空对象;
						self.data[c.next][id] = res;
					}else{
						self.data[c.next] = res;
					}
					self.html(res);
					//console.log(self.data);
				}
			});
		},
		html: function(data){
			var self = this, o = self.info, c = self.config;
			var i = 0, l = data.length, arr = [];
			if(!l) return;
			if(c.next != "prv" && !(c.next == 'city' && !c.cityChecked)){arr.push('<li data-id="-1"><input type="checkbox" value="-1" /> <em>全选</em></li>');}
			for(; i < l; i++){
				var id = data[i][c.key[c.next] + "NumId"], name = data[i][c.key[c.next] + "Name"];
				if(c.filter.getIndex(id) != -1) continue; // 过滤不必要数据;
				arr.push('<li data-id="'+ id +'">');
				if(c.next != "prv" && !(c.next == 'city' && !c.cityChecked)){
					var checked = "";
					c.debug && console.log(c.val);
					if(c.val.getIndex(id) != -1){
						checked = 'checked="checked"';
					}
					arr.push('<input type="checkbox" value="'+ id +'" '+ checked +' />');
				}
				arr.push('<em>'+ name +'</em></li>');
			}
			o.current.html(arr.join(''));
			// 清除当前级后面的数据;
			o.current.nextAll().html("");
			self.isAll();
		},
		// 是否全选;
		isAll: function(){
			var self = this, o = self.info, c = self.config;
			var all = o.current.find("input[value=-1]"),
			alls = o.current.find("input[value!=-1]"),
			selec = o.current.find("input[value!=-1][checked=checked]");
			if(alls.length == selec.length){
				all.attr("checked", "checked");
			}else{
				all.removeAttr("checked");
			}
		}
	};
		
		
	
	// Form;
	var isForm = {
		// 特殊字符等验证;
		isCheck: function(val){
			//return /([`~!\$\^\&\+<>\?"\{\},\.\\\/;'；。…，、？！｛｝\=]|delete|inserte|null|update|select)/im.test(val);
			//console.log($.trim(val));
			return /([`~!@#\$\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]]|insert|update|delete|truncate|drop|select|alter|null)/im.test($.trim(val));
		},
		// 是否为空;
		isTrim: function(val){
			return $.trim(val) == "" ? true : false;
		},
		// 保留小数点后几位，默认验证两位，index为位数;
		isDecimal: function(val, index){
			var t = '^-?\\d+\\.?\\d{0,'+ (index||2) +'}$';
			return new RegExp(t).test(val);
		},
		// 正整数;
		isImp: function(val){
			return /^\d+$/.test($.trim(val));
		},
		// 负整数;
		isNmp: function(val){
			return /^-\d+$/.test($.trim(val));
		},
		// 数字与中横线;
		isPhone: function(val){
			return /^[\-\d]+$/.test(val);
		},
		// 正确的手机号;
		isMobile: function(val){
			return /^1{1,}[3,4,5,7,8]{1}\d{9}$/.test(val);
		},
		// 正确的电话号码支持格式：010-63580000 | 0571-63580000 | 01063580000 | 057163580000 | 4008517517;
		isTel: function(val){
			return /^(0\d{2,3}-?\d{7,8})|^(400\d{7})$/.test(val);
		},
		// 正确的Email;
		isMail: function(val){
			return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(val);
		},
		// 匹配中文字符;
		isCN: function(val){
			return /^[\u4e00-\u9fa5]+$/.test(val);
		},
		// 只允许中文、字母、数字、下划线;
		isName: function(val){
			return /^[\u4e00-\u9fa5\w]+$/.test(val);
		},
		// 正确的数值型;
		isNUM: function(val){
			return /^(\d+[\s,]*)+\.?\d*$/.test(val);
		},
		// 银行卡号验证;
		isBank: function(val){
			return this.isImp(val) && String(val).length >= 12 && String(val).length <= 21;
		},
		// 正确的QQ;
		isQQ: function(val){
			return /^[1-9][0-9]{4,9}$/.test(val);
		},
		//用户名/密码，只允许字母、数字、下划线
		//若要求以字母开头：/^[a-zA-Z]+[a-zA-Z0-9_]*$/
		isAccount: function (val) {
			return /^\w+$/.test(val);
		},
		// 钱;
		//正则：^(([1-9][0-9]*(.[0-9]{1,2})?)|([0]\.[0-9]([0-9]{1})?)|([0]{1}))$
		isMoney: function(obj){
			//先把非数字的都替换掉，除了数字和.
			obj.value = obj.value.replace(/[^\d.]/g,"");
			//必须保证第一个为数字而不是.
			obj.value = obj.value.replace(/^\./g,"");
			//保证只有出现一个.而没有多个.
			obj.value = obj.value.replace(/\.{2,}/g,".");
			//保证.只出现一次，而不能出现两次以上
			obj.value = obj.value.replace(".","$#$").replace(/\./g,"").replace("$#$",".");
			//只能输入两个小数
			obj.value=obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/,'$1$2.$3');
			//开头不能为0开头的无小数点的数字
			obj.value=obj.value.replace(/^[0][0-9]\d*$/,"");
		},
		// 金额补0;
		isZero: function(obj){
			obj.value = Number(obj.value).toFixed(2);
		},
		// 网址
		isURL: function(str){
			//return /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i.test(str); // 严谨一些的校验;
			return /^https?:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/.test(str);  // 简单校验;
		}

	};
	
	// Toast    Toast.show('TEXT');
	var Toast = {
		config: {
			template: "文本提示",
			second: 2000,
			auto: true,
			callback: false
		},
		info: {},
		init: function(){
			var self = this, o = self.info;
			$("body").append('<div class="modal-toast-block"><div class="mask"></div><div class="content"></div></div>');
			o.elems = $(".modal-toast-block");
			o.content = o.elems.find(".content");
			o.elems.on("click", function(){ self.hide(); });
		},
		show: function(op){
			var self = this, o = self.info, c = self.config;
			typeof op == "object" ? $.extend(c, op) : c.template = op;
			!o.elems ? self.init() : null;
			o.content.html( c.template );
			o.elems.fadeIn(200);
			self.size();
			clearInterval(c.time);
			// 自动定时隐藏;
			if(c.auto){
				c.time = setTimeout(function(){
					self.hide();
					if($.isFunction(c.callback)){
						c.callback.call(c.callback, self);
					}
				}, c.second);
			}
		},
		hide: function(){
			var self = this, o = self.info, c = self.config;
			clearInterval(c.time);
			o.elems.fadeOut(200);
		},
		size: function(){
			var self = this, o = self.info, c = self.config;
			o.elems.css({"margin-left": -o.elems.innerWidth() / 2, "margin-top": -o.elems.innerHeight() / 2});
		}
	};
	
	
	
	// 投放日历;
	MA.rili = {
		info : {
			week : ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
			more : new Date()
		},
		init : function(){
			var obj = this.info, urlDate = Matrix.tools.search("date");
			if(urlDate){
				obj.urlDate = new Date(urlDate.replace(/\-/g, '/'));
				$("#Calendar-list").html( MA.rili.Time( obj.urlDate ) );
				obj.more = new Date( obj.urlDate );
			}else{
				$("#Calendar-list").html( MA.rili.Time(new Date()) );
			}
			$("#Current").html(obj.more.format("yyyy年MM月dd日 ") + obj.week[obj.more.format("Z")]);
		},
		Time : function( data ){
			var obj = this.info, arr = ['<ul>'], date = new Date( data ), initDate = new Date( date.setDate( date.getDate() - 4 ) ), Today = new Date();
			if(obj.urlDate){ Today = obj.urlDate; }
			for(var i = 0; i < 7; i++){
				initDate.setDate( initDate.getDate() + 1 );
				var cla = initDate.format("yyyy-MM-dd") === Today.format("yyyy-MM-dd") ? ' class="hover"' : "";
				arr.push('<li' + cla + '><a title="' + initDate.format("yyyy年MM月dd日") + '" href="javascript:;"><b>' + initDate.format("MM月dd日") + '</b><i>' + obj.week[initDate.format("Z")] + '</i></a></li>');
			};
			arr.push('</ul>');
			return arr.join('');
		},
		moreWeek : function( val ){
			var obj = this.info, elems = $("#Calendar-list");
			if(val){
				obj.more = new Date(obj.more.setDate( obj.more.getDate() + 7 ));
				elems.append(this.Time(obj.more));
				var first = elems.children("ul").first();
				first.animate({
					marginLeft : -first.innerWidth()
				}, 500, function(){
					first.remove();
				});
			}else{
				obj.more = new Date(obj.more.setDate( obj.more.getDate() - 7 ));
				elems.prepend(this.Time(obj.more));
				var uls = elems.children("ul");
				uls.first().css("margin-left", -uls.first().innerWidth());
				uls.first().animate({
					marginLeft : 0
				}, 500, function(){
					uls.last().remove();
				});
			}
			
		}
	};
	




	// 手机模拟显示;
	Mobile = {
		config: {
			title: "妈妈好"
		},
		info: {},
		init: function(){
			var self = this, o = self.info, c = self.config;
			var arr = ['<div class="mobile-pop-mask"></div><div class="mobile-pop-all">'];
			arr.push('<div class="header"><a href="javascript:;" class="back icon-chevron-left">返回</a><h1></h1><a href="javascript:;" class="back close icon-remove">关闭</a></div>');
			arr.push('<div class="content"></div>');
			arr.push('<div class="footer"></div></div>');
			$("body").append(arr.join(""));
			o.mask = $(".mobile-pop-mask");
			o.elems = $(".mobile-pop-all");
			o.header = o.elems.find(".header");
			o.content = o.elems.find(".content");
			o.footer = o.elems.find(".footer");
			// 关闭;
			o.elems.on("click", ".back", function(){
				self.hide();
			});
		},
		show: function(op){
			var self = this, o = self.info, c = self.config;
			$.extend(c, op);
			!o.elems ? self.init() : null;
			o.header.find("h1").html(c.title);
			o.content.html( c.href ? self.iframe() : c.content );
			c.footer && o.footer.html(c.footer);
			o.elems.show();
			o.mask.show();
			self.size();
		},
		hide: function(){
			var self = this, o = self.info, c = self.config;
			o.mask.hide();
			o.elems.hide();
			o.content.html('');
		},
		size: function(){
			var self = this, o = self.info, c = self.config;
			c.width ? o.elems.width(c.width()).css("margin-left", -(c.width / 2)) : null;
			c.height ? o.elems.height(c.height()).css("margin-top", -(c.height / 2)) : null;
			o.content.height(o.elems.innerHeight() - o.header.innerHeight() - o.footer.innerHeight());
		},
		iframe: function(){
			var self = this, c = self.config;
			return '<iframe src="'+ c.href +'" frameborder="0" width="100%" height="100%" scrolling="auto"></iframe>';
		}
	};






	var Popover = function(element, options) {
			this.init("popover", element, options);
	};
	Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype, {
			constructor:Popover,
			setContent:function() {
					var $tip = this.tip(), title = this.getTitle(), content = this.getContent();
					$tip.find(".popover-title")[$.type(title) == "object" ? "append" :"html"](title);
					$tip.find(".popover-content > *")[$.type(content) == "object" ? "append" :"html"](content);
					$tip.removeClass("fade top bottom left right in");
			},
			hasContent:function() {
					return this.getTitle() || this.getContent();
			},
			getContent:function() {
					var content, $e = this.$element, o = this.options;
					content = $e.attr("data-content") || (typeof o.content == "function" ? o.content.call($e[0]) :o.content);
					content = content.toString().replace(/(^\s*|\s*$)/, "");
					return content;
			},
			tip:function() {
					if (!this.$tip) {
							this.$tip = $(this.options.template);
					}
					return this.$tip;
			}
	});
	$.fn.popover = function(option) {
			return this.each(function() {
					var $this = $(this), data = $this.data("popover"), options = typeof option == "object" && option;
					if (!data) $this.data("popover", data = new Popover(this, options));
					if (typeof option == "string") data[option]();
			});
	};
	$.fn.popover.Constructor = Popover;
	$.fn.popover.defaults = $.extend({}, $.fn.tooltip.defaults, {
			placement:"right",
			content:"",
			template:'<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'
	});




	
	window.Toast = Toast;
	window.isForm = isForm;
})(window, jQuery);

//console.log();