var Setting = {
	config: {
		priceDiy: true		// 是否自定义价格;
	},
	info: {},
	init: function(){
		var self = this, o = self.info, c = self.config;
		// 数据;
		self.data = VM.Result != "" ? JSON.parse(VM.Result) : false;
		o.tpl = $(".tpl-list");
		//o.goodsId = $(".js-goods-id");
		//o.goodsList = $(".js-goods-list");
		
		c.vm = JSON.parse(VM.vm);
		//c.length = self.data ? self.data.Items.length : 0;
		c.length = 0;
		//console.log(c.vm);
		
		// 事件绑定;
		self.event();
		//console.log(self.data);
		// 填充数据;
		self.template();
		
		
	},
	event: function(){
		var self = this, o = self.info, c = self.config;
		
		// 类目切换;
		o.tpl.on("change", ".js-goods-list select", function(){
			var thas = $(this), next = thas.parent().next().find("select"),  nextAll = thas.parent().nextAll().find("select");
			nextAll.html('<option value="-1">请选择</option>');
			if(next.length){
				var id = thas.val();
				if(id != -1){
					self.getCate(id, next);
				}
			}
		});
		// 删除模版;
		o.tpl.on("click", ".js-goods-list .js-del-item", function(){
			var thas = $(this), parent = thas.parent();
			parent.remove();
		});
		// 添加模版
		o.tpl.on("click", ".js-add-item", function(){
			var thas = $(this), template = thas.parents(".MA-goods-template"), goods = template.find(".js-goods-list");
			var length = goods.find(".item").length;
			goods.append( self.itemhtml(template.data("index") + "-" + length) );
		});
		// 选城市;
		o.tpl.on("change", ".js-order-address select", function(){
			var thas = $(this), next = thas.next("select"),  nextAll = thas.nextAll("select");
			nextAll.html('<option value="-1">请选择</option>');
			if(next.length){
				var id = thas.val();
				if(id != -1){
					next.data("parent", id);
					if(next.hasClass("city")){
						self.getCity(next);
					}else if(next.hasClass("area")){
						self.getArea(next);
					}
				}
			}
		});
		// 城市删除;
		o.tpl.on("click", ".js-address-del", function(){
			$(this).parent().remove();
		});
		o.tpl.on("click", ".js-order-address-add", function(){
			var np = $('<p><select class="prv"></select> <select class="city"></select> <select class="area"></select> <button class="btn btn-warning btn-mini js-address-del">删除</button></p>');
			$(this).closest('.item').find(".js-order-address").append(np);
			np.find("select").each(function(i, n){
				var thas = $(n);
				if(thas.hasClass("prv")){
					self.getPrv(thas);
				}else if(thas.hasClass("city")){
					self.getCity(thas);
				}else if(thas.hasClass("area")){
					self.getArea(thas);
				}
			});
			//console.log();
		});
	},
	// 初始化数据;
	template: function(){
		var self = this, o = self.info, d = self.data, c = self.config;
		for(var k = 0; k < d.length; k++){
			var dk = d[k], tpl = $("#tpl-" + k), goods = tpl.find(".js-goods-list");
			tpl.find(".js-goods-id").val(dk.DesignatedGoods.join(','));
			goods.html( self.items(dk, k) );
			if(VM.type == 6){
				// 订单区域;
				var address = tpl.find(".js-order-address");
				address.html( self.area(dk.deliveAreas));
				// 绑定数据;
				address.find("select").each(function(i, n){
					var thas = $(n);
					if(thas.data("id")){
						if(thas.hasClass("prv")){
							self.getPrv(thas);
						}else if(thas.hasClass("city")){
							self.getCity(thas);
						}else if(thas.hasClass("area")){
							self.getArea(thas);
						}
					}
				});
			}
			// 类目数据初始化;
			var items = goods.find(".item"), i = 0, l = items.length;
			if(l){
				for(; i < l; i++){
					var one = items.eq(i).find("select[name=one]");
					one.val(one.data("id"));
					// 二级;
					var two = items.eq(i).find("select[name=two]");
					self.getCate(two.data("parent"), two);
					// 三级;
					var three = items.eq(i).find("select[name=three]");
					self.getCate(three.data("parent"), three);
				}
			}
		}
	},
	// 区域列表;
	area: function(area){
		var self = this, o = self.info, c = self.config, arr = [];
		//console.log(area);
		for(var i = 0; i < area.length; i++){
			arr.push('<p><select class="prv" data-id="'+ area[i][0] +'"></select> <select class="city" data-id="'+ area[i][1] +'" data-parent="'+ area[i][0] +'"></select> <select class="area" data-id="'+ area[i][2] +'" data-parent="'+ area[i][1] +'"></select> <button class="btn btn-warning btn-mini js-address-del">删除</button></p>');
		};
		return arr.join('');
	},
	// 商品模版;
	items: function(d, k){
		var self = this, o = self.info, c = self.config, arr = [];
		for(var i = 0; i < d.Items.length; i++){
			arr.push(self.itemhtml(k+"-"+i, d.Items[i]));
		}
		return arr.join('');
	},
	// 组装商品模版;
	itemhtml: function(i, d){
		var self = this, o = self.info, c = self.config, arr = [];
		arr.push('<div class="item js-item-'+ i +'"><button class="btn btn-danger btn-mini js-del-item">删除</button>');
		arr.push('<dl><dt>商品品牌：</dt><dd class="js-brands">');
		if(d){
			arr.push(self.brands(i, d.Brands));
		}else{
			arr.push(self.brands(i));
		}
		arr.push('</dd></dl><dl><dt>商品类目：</dt><dd class="js-category">');
		if(d){
			arr.push('<span>一级类目 '+ self.category(i, d.Category[0]) +'</span>');
		}else{
			arr.push('<span>一级类目 '+ self.category(i) +'</span>');
		}
		arr.push('<span>二级类目<select name="two" data-parent="'+ (d ? d.Category[0] : '') +'" data-id="'+ (d ? d.Category[1] : '') +'" class="js-category-'+ i +'"><option value="-1">请选择</option></select></span>');
		arr.push('<span>三级类目<select name="three" data-parent="'+ (d ? d.Category[1] : '') +'" data-id="'+ (d ? d.Category[2] : '') +'" class="js-category-'+ i +'"><option value="-1">请选择</option></select></span>');
		arr.push('</dd></dl><dl><dt>商品价格：</dt><dd class="js-price">');
		if(d){
			arr.push(self.price(i, d.Price));
		}else{
			arr.push(self.price(i));
		}
		arr.push('<p><label for="price-' + i +'diy"><input type="radio" name="price-'+ i +'" value="-1" id="price-' + i +'diy" name="price" '+ (c.priceDiy ? "checked" : '') +' /> 自定义<input type="tel" style="width:50px;" value="'+ (d && c.priceDiy ? d.Price : '') +'" maxlength="5" />元以上</label></p>');
		arr.push('</dd></dl></div>');
		return arr.join('');
	},
	// 品牌;
	brands: function(k, val){
		var self = this, o = self.info, arr = [], c = self.config;
		for(var i = 0; i < c.vm.brands.length; i++){
			var checked = "", brands = c.vm.brands[i];
			if(val && val.getIndex(brands.id) != -1){
				checked = "checked";
			}
			arr.push('<label for="brands-' + k + brands.id +'"><input type="checkbox" '+ checked +' value="'+ brands.id +'" id="brands-' + k + brands.id +'" /> '+ brands.name +'</label>');
		}
		return arr.join('');
	},
	// 价格
	price: function(k, val){
		var self = this, o = self.info, c = self.config, arr = [];
		for(var i = 0; i < c.vm.price.length; i++){
			var checked = "", price = c.vm.price[i];
			if(val == price.id){
				checked = "checked"
				c.priceDiy = false;
			}
			arr.push('<label for="price-' + k + price.id +'"><input type="radio" '+ checked +' name="price-'+ k +'" value="'+ price.id +'" id="price-' + k + price.id +'" /> '+ price.name +'</label>');
		}
		return arr.join('');
	},
	// 一级类目;
	category: function(k, id){
		var self = this, o = self.info, c = self.config, arr = ['<select name="one" data-id="'+ id +'" class="js-category-'+ k +'"><option value="-1">请选择</option>'];
		for(var i = 0; i < c.vm.one.length; i++){
			arr.push('<option value="'+ c.vm.one[i].id +'">'+ c.vm.one[i].name +'</option>');
		}
		arr.push('</select>');
		return arr.join('');
	},
	// 添加模版;
	addItem: function(){
		var self = this, o = self.info, c = self.config;
		return;
		c.length++
		o.goodsList.append( self.itemhtml(c.length) );
		
	},
	// 返回类目数据;
	getCate: function(id, elems){
		var self = this, o = self.info, c = self.config;
		if (id != 'undefined') {
			console.log(id);
			new Matrix.JSON({
					val: {id: id},
					url: root + "/goods/queryId.do",
					fun: function (res) {
							var i = 0, l = res.length, arr = ['<option value="-1">请选择</option>'];
							for (; i < l; i++) {
									arr.push('<option value="' + res[i].gtId + '">' + res[i].gtName + '</option>');
							}
							elems.html(arr.join(''));
							if (elems.data("id")) {
									elems.val(elems.data("id"));
							}
					}
			});
		}
	},
	// 提交数据;
	save: function( goods ){
		var self = this, o = self.info, c = self.config;
		var $template = goods.closest('.template');
		// 指定商品 id;
		var goodsId = goods.find(".js-goods-id"), 
		goodsList = goods.find(".js-goods-list");
		var ids = goodsId.val().trim().replace(/\，/g, ',');
		ids = ids.split(",");
		if(ids != ""){
			if(ids[ids.length-1] == ""){
				ids.splice(ids.length-1, 1);
			}
			for(var i = 0; i < ids.length; i++){
				if(!isForm.isImp(ids[i])){
					goodsId.focus();
					return false;
				}
			}
		}else{
			ids = [];
		}
		self.data = {
			DesignatedGoods: ids,
			Items: []
		};
		var items = goodsList.find(".item"), i = 0;
		for(; i < items.length; i++){
			var it = items.eq(i);
			var obj = {
				Brands: [],
				Category: []
			};
			// 品牌;
			var brands = it.find(".js-brands :checkbox:checked");
			$.each(brands, function(i, v){
				obj.Brands.push($(v).val());
			});
			// 类目;
			var category = it.find(".js-category select");
			$.each(category, function(i, v){
				if($(v).val() != -1){
					obj.Category.push($(v).val());
				}
			});
			// 价格;
			var price = it.find(".js-price :radio:checked");
			if(price.val() == -1){
				obj.Price = price.next().val().trim();
				if(obj.Price == ""){ return false;}
			}else{
				obj.Price = price.val();
			}
			//console.log(obj.Price);
			if(obj.Brands.length || obj.Category.length || obj.Price){
				self.data.Items.push(obj);
			}
		}
		// 选择的区域值;
		var ap = $template.find(".js-order-address").children("p");
		var deliveAreas = [];
		for(var pi = 0; pi < ap.length; pi++){
			var select = ap.eq(pi).find("select"), arr = [];
			for(var si = 0; si < select.length; si++){
				if(select.eq(si).val() != -1 || !select.eq(si).val()){
					arr.push(select.eq(si).val());
				}
			}
			if(arr.length){
				//console.log(self.data.deliveAreas.getIndex(arr));
				deliveAreas.push(arr);
			}
		}
		self.data.deliveAreas = [];
		if(deliveAreas.length){
			var unique = [];
			// 去除重复的数据;
			$.each(deliveAreas, function(i, n){
				if(unique.getIndex(n.join("")) == -1){
					unique.push(n.join(""));
					self.data.deliveAreas.push(n);
				}
			});
			//console.log(unique);
		}
		//console.log(self.deliveAreas);
		
		
		//console.log(JSON.stringify(self.data));
		return self.data;
		//type 1 :表示总仓  2:表示门店配置
		/*Matrix.JSON({
			showLoad: true,
			type: "POST",
			val: {json: JSON.stringify(self.data), type: 1,subUnitNumId: c.subUnitNumId},
			url: root + "/transformationSetting/save.do",
			fun: function(res){
				if(res.success){
					Toast.show('保存成功');
					window.location.reload();
				}else{
					Toast.show(res.msg);
				}
			}
		});*/
	},
	getPrv: function(prv){
		Matrix.JSON({
			url: root + "/activity/showPrv.do",
			fun: function(res){
				var arr = [];
				arr.push('<option value="-1">选择省份</option>');
				$.each(res, function(i, n) {
					arr.push("<option value='"+n.prvNumId+"'>"+n.prvName+"</option>");
				});
				prv.html(arr.join('')).val(prv.data("id"));
			}
		});
	},
	getCity: function(city){
		var parent = city.data("parent"), arr = ['<option value="-1">请选择市</option>'];
		if(!parent){
			city.html(arr.join(''));
			return;
		}
		Matrix.JSON({
			val: {prvId: parent},
			url: root + "/activity/showCity.do",
			fun: function(res){
				$.each(res, function(i, n) {
					arr.push("<option value='"+n.cityNumId+"'>"+n.cityName+"</option>");
				});
				city.html(arr.join('')).val(city.data("id"));
			}
		});
	},
	getArea: function(area){
		var parent = area.data("parent"), arr = ['<option value="-1">请选择区</option>'];
		if(!parent){
			area.html(arr.join(''));
			return;
		}
		Matrix.JSON({
			val: {cityId: parent},
			url: root + "/activity/showArea.do",
			fun: function(res){
				$.each(res, function(i, n) {
					arr.push("<option value='"+n.cityAreaNumId+"'>"+n.cityAreaName+"</option>");
				});
				area.html(arr.join('')).val(area.data("id"));
			}
		});
	}
};
