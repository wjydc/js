var Setting = {
	config:{},
	info: {},
	init: function(){
		var self = this, o = self.info, c = self.config;
		
		
		o.stores = $(".js-stores-block");
		o.phoneInput = $(".js-add-phone");
		o.phoneBtn = $(".js-add-phone-btn");
		o.user = $(".js-user-list");
		o.receipt = $(".js-receipt-address");
		o.delivery = $(".js-delivery");
		o.area = $(".js-area-list");
		o.areaKilo = $(".js-area-kilo");
		o.addressName = $(".js-address-name");
		o.addressLo = $(".js-address-lo");
		o.addressLa = $(".js-address-la");
		o.addressKilo = $(".js-address-kilo");
		o.postmanInput = $(".js-postman-input");
		o.addPostman = $('.js-add-postman');
		o.save = $(".js-save");
		
		
		c.vm = VM.vm;
		c.subUnitNumId = VM.subUnitNumId; // 门店ID;
		// 数据;
		self.data = VM.Result != "" ? JSON.parse(VM.Result) : "";
		// 绑定事件
		self.event();
		// 填充数据;
		self.template();
	},
	event:function(){
		var self = this, o = self.info, c = self.config;
		
		// 会员转单;
		o.phoneBtn.on('click', function(){
			self.getPromoter(o.phoneInput, function(data){
				o.user.append(self.promoter([data]));
			});
		});
		// 删除推广员
		o.user.on('click','.js-delete',function(){
			$(this).closest('tr').remove();
		});

		// 添加配送员
		o.addPostman.on('click',function(){
			self.getPromoter(o.postmanInput, function(data){
				o.delivery.append(self.postman([data]));
			});
		});

		// 删除配送员
		o.delivery.on('click','.js-delete',function(){
			$(this).closest('.address').remove();
		});
		
		// 保存;
		o.save.on("click", function(){
			self.submit();
		});
	},
	template: function(){
		var self = this, o = self.info, d = self.data;
		// o.goodsId.val(d.DesignatedGoods.join(','));
		// o.goodsList.html( self.items() );
		//所在区集合;
		o.area.html( self.area() );
		//配送员;
		o.delivery.html( d && self.postman(d.peoples) );
		// 推广员;
		o.user.html(d && self.promoter(d.Promoter));

		if(d !== ""){
			o.stores.find("input[name=area]").eq(d.Area.type).attr("checked", true);
			// 区域转单（三选一）
			if(d.Area.type == 1){
				o.areaKilo.val(d.Area.kilo);
			}else if(d.Area.type == 2){
				o.addressLo.val(d.Area.lng);
				o.addressLa.val(d.Area.lat);
				o.addressKilo.val(d.Area.kilo);
				o.addressName.val(d.Area.address);
			}
			o.stores.find("dl").eq(d.Area.type);

			// 收货地址
			getPrv(d.Receipt.prvNumId); //省
			showCity(d.Receipt.prvNumId, d.Receipt.cityNumId);  //市
			showArea(d.Receipt.cityNumId, d.Receipt.areaNumId);	//区
			// o.receipt
			$(".js-rec-address").val(d.Receipt.detailAddress);
			$(".js-rec-lo").val(d.Receipt.lng);
			$(".js-rec-la").val(d.Receipt.lat);
			$(".js-rec-name").val(d.Receipt.name);
			$(".js-rec-phone").val(d.Receipt.phonenum);
		}else{
			getPrv();
		}
	},
	// 所在区集合;
	area: function(){
		var self = this, o = self.info, d = self.data, arr = [], c = self.config;
		for(var i = 0; i < c.vm.area.length; i++){
			var checked = "";
			if(d && d.Area.type == 0 && d.Area.areas.getIndex(c.vm.area[i].id) != -1){
				checked = "checked";
			}
			arr.push('<label for="area-'+ c.vm.area[i].id +'"><input type="checkbox" '+ checked +' value="'+ c.vm.area[i].id +'" id="area-'+ c.vm.area[i].id +'" /> '+ c.vm.area[i].name +'</label>');
		}
		return arr.join('');
	},
	// 推广员
	promoter: function(list){
		var self = this, o = self.info, d = self.data, arr = [];
		for(var i = 0; i < list.length; i++){
			var man = list[i];
			arr.push('<tr data-name="' + man.name + '" data-phone="' + man.phonenum + '"><td>' + man.name + '</td><td>' + man.phonenum + '</td><td><a class="btn btn-danger btn-mini js-delete" href="javascript:;">删除</a></td></tr>');
		}
		return arr.join('');
	},
	// 配送员
	postman: function(list){
		var self = this, o = self.info, d = self.data, arr = [];
		for(var i = 0; i < list.length; i++){
			var man = list[i];
			arr.push('<ul class="address" data-name="' + man.name + '" data-phone="' + man.phonenum + '"><li><strong>配送人：</strong><p>' + man.name + '</p></li> <li><strong>联系方式：</strong><p>' + man.phonenum + '</p></li> <li><button class="btn btn-danger btn-mini js-delete">删除</button></li> </ul>');
		}
		return arr.join('');
	},
	// 获取推广员信息;
	getPromoter: function(mobile, callback){
		var self = this, o = self.info, val = mobile.val();
		if(!isForm.isMobile(val)){
			return Toast.show('请输入正确的手机号');
		}
		Matrix.JSON({
			showLoad: true,
			type: "POST",
			val: {mobile: val},
			url: root + "/transformationSetting/getPromoter.do",
			fun: function(res){
				if(res.success){
					callback && callback.call(callback, res.data);
					Toast.show('添加成功');
					//o.user.append(self.promoter([res.data]));
				}else{
					Toast.show(res.data);
				}
				mobile.val('').focus();
			}
		});
	},
	// 提交审核
	submit:function(){
		var self = this, o = self.info, c = self.config;
		var val = {
			Area: {
				type: o.stores.find("input[name=area]:checked").val()
			},
			Promoter: [],
			Receipt: {
				prvNumId: $("#prv").val(),
				cityNumId: $("#city").val(),
				areaNumId: $("#area").val(),
				detailAddress: $(".js-rec-address").val().trim(),
				lng: $(".js-rec-lo").val().trim(),
				lat: $(".js-rec-la").val().trim(),
				name: $(".js-rec-name").val().trim(),
				phonenum: $(".js-rec-phone").val().trim(),
				gbAddressId: self.data && self.data.Receipt.gbAddressId || "",
				addressId: self.data && self.data.Receipt.addressId || ""
			},
			peoples: []
		};
		if(val.Area.type == 0){
			var checked = o.area.find(":checkbox:checked");
			val.Area.areas = [];
			if(checked.length){
				o.area.find(":checkbox:checked").each(function(i, v){
					val.Area.areas.push($(v).val());
				});
			}
			//if(!val.Area.areas.length){
			//	return Toast.show('请选择地区');
			//}
		}else if(val.Area.type == 1){
			val.Area.kilo = o.areaKilo.val().trim();
			if(!/^[\.\d]+$/.test(val.Area.kilo)){
				return Toast.show('请输入正确的公里数');
			}
		}else if(val.Area.type == 2){
			val.Area.lng = o.addressLo.val().trim();
			val.Area.lat = o.addressLa.val().trim();
			val.Area.kilo = o.addressKilo.val().trim();
			val.Area.address = o.addressName.val().trim();
			if(val.Area.address == "" || val.Area.lng == "" || val.Area.lat == "" || val.Area.kilo == ""){
				return Toast.show('请输入正确的值');
			}
		}else{
			return Toast.show('请选择区域类型');
		}
		// 推广员;
		o.user.find("tr").each(function(i, v){
			val.Promoter.push({name: $(v).data("name"), phonenum: $(v).data("phone")});
		});
		// 收货地址;
		var input = o.receipt.find(":input");
		for(var i = 0; i < input.length; i++){
			if(input.eq(i).val().trim() == ""){
				input.eq(i).focus();
				return Toast.show('请输入正确的值');
			}
		}
		// 配送人员;
		o.delivery.find("ul").each(function(i, v){
			val.peoples.push({name: $(v).data("name"), phonenum: $(v).data("phone")});
		});
		//return console.log( JSON.stringify(val) );
		//type 1 :表示总仓  2:表示门店配置

		Matrix.JSON({
			showLoad: true,
			type: "POST",
			val: {json: JSON.stringify(val), type: 2,subUnitNumId: c.subUnitNumId},
			url: root + "/transformationSetting/save.do",
			fun: function(res){
				if(res.success){
					Toast.show('保存成功');
					window.location.reload(); 
				}else{
					Toast.show(res.msg);
				}
			}
		});
	}
};