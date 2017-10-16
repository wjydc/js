/** 
 * sales-config.js
 * 促销管理
 * by wml 2016-06-07
 * 1.1 增加促销类型"多买促销","赠品促销"、"满赠促销"添加字段   by wml 2016-10-13
 */
;
(function($) {
	var page = {
		eles: {
			rulesContainer: $('.js-full-rules'), // 满减规则模块
			catagoryContainer: $('.js-catagory'), // 商品分类模块
			cityContainer: $('.js-select-city'), // 限定区域模块
			address: $('.js-address'), // 选择城市模块
			addressList: $('.js-address-list'), // 城市显示模块
			selectable: $('#queryResultTable'), // 查询结果列表
			selectedTable: $('#goodsTable'), // 已选商品列表
			dozenSalesContainer: $('.js-full-discount-rules')	// 多买促销规则模块
		},
		config: {
			chosenGoods: [],
			chosenStyle: {},
			idarr: []
		},
		init: function() {
			var self = this,
				o = self.eles,
				c = self.config;
			c.promotionType = VM.promotionType;

			if (VM.data) {
				self.fillForm(JSON.parse(VM.data));
				c.data = JSON.parse(VM.data);
			}
			// 切换是否限制区域
			$('[name="isCountrywide"]').on('change', function() {
				var val = $(this).val();
				if (val == 1) {
					o.cityContainer.hide();
				} else {
					o.cityContainer.show();
				}
			});
			// 切换是否限定商品
			$('[name="isFullCourt"]').on('change', function() {
				var val = $(this).val();
				if (val == 1) {
					o.catagoryContainer.hide();
				} else {
					o.catagoryContainer.show();
				}
			});
			// 切换是否限时
			$('[name="isTimeLimit"]').on('change', function() {
				var val = $(this).val();
				if (val == 1) {
					$('.grantTime').show();
				} else {
					$('.grantTime').hide();
				}
			});

			$('[name="landingType"]').on('change', function() {
				if ($(this).val() == 1) {
					$('[name="landingPage"]').attr('disabled', true);
				} else {
					$('[name="landingPage"]').removeAttr('disabled');
				}
			});

			$('[name="landingPage"]').on('blur', function() {
				var landingType = $('[name="landingType"]').val(),
					v = $(this).val();
				if (landingType == 3 && !isForm.isURL(v)) {
					$(this).focus();
					return Toast.show('请填写正确的URL地址');
				} else if ((landingType == 8 || landingType == 9) && !isForm.isImp(v)) {
					$(this).focus();
					return Toast.show('请填写正确的ID');
				}
			});

			// 增加满减规则
			o.rulesContainer.on('click', '.js-add-fullrules', function() {
				var thas = $(this);
				thas.remove();
				o.rulesContainer.append('<div class="controls"> 满 <input type="text" placeholder="" class="span2 m-wrap" name="full" value="" maxlength="10"> 减 <input type="text" placeholder="" class="span2 m-wrap" name="reduction" value="" maxlength="10"> 元 <a href="javascript:;" class="btn btn-danger js-del-fullrules">删除</a> <a href="javascript:;" class="btn btn-primary js-add-fullrules">增加</a> </div>');
			});
			// 删除满减规则
			o.rulesContainer.on('click', '.js-del-fullrules', function() {
				var thas = $(this).closest('.controls');
				if (thas.index() == $('.js-full-rules .controls').length - 1) {
					thas.prev().append('<a href="javascript:;" class="btn btn-primary js-add-fullrules">增加</a>');
				}
				thas.remove();
			});

			// 增加多买促销规则
			o.dozenSalesContainer.on('click', '.js-add-fulldiscount', function() {
				var thas = $(this);
				thas.remove();
				o.dozenSalesContainer.append('<div class="controls"> 买 <input type="text" placeholder="" class="span2 m-wrap" name="full" value="" maxlength="3"> 件打 <input type="text" placeholder="" class="span2 m-wrap" name="discount" value="" maxlength="3"> 折 <a href="javascript:;" class="btn btn-danger js-del-fullrules">删除</a> <a href="javascript:;" class="btn btn-primary js-add-fulldiscount">增加</a> </div>');
			});
			// 删除多买促销规则
			o.dozenSalesContainer.on('click', '.js-del-fullrules', function() {
				var thas = $(this).closest('.controls');
				if (thas.index() == $('.js-full-discount-rules .controls').length - 1) {
					thas.prev().append('<a href="javascript:;" class="btn btn-primary js-add-fulldiscount">增加</a>');
				}
				thas.remove();
			});

			// 查询
			$('#query_btn').on('click', function() {
				self.query();
			});
			$('#reset_btn').on('click', function() {
				$('[name="goodsId"]').val('');
				$('#queryResultTable tbody').html('');
			});
			// 选中一个款式
			$('table').on('click', '.label_check_style', function() {
				self.checkedStyle(this);
			});

			// 选中一个sku
			$('table').on('click', '.label_check_sku', function() {
				if ($(this).find(':checked').length) {
					$(this).closest('tr').find('.label_check_style [type="checkbox"]').attr('checked', 'checked');
				} else if ($(this).closest('td').find('.label_check_sku :checked').length == 0) {
					$(this).closest('tr').find('.label_check_style [type="checkbox"]').removeAttr('checked');
				}
				self.checkedSKU(this);
			});
			$('table').on('click', '.js-del', function() {
				$(this).closest('tr').remove();
			});

			// 设为主商品
			$('#js-setGoods').on('click', function() {
				$('#queryResultTable tbody tr .label_check_style').each(function() {
					if ($(this).find('[type=checkbox]:checked').length) {
						// self.appendStyle($(this).data('styleNumId'));
						self.appendToChosen();
					}
				});
			});
			// 设为赠品
			$('#js-setGift').on('click', function() {
				$('#queryResultTable tbody tr .label_check_style').each(function() {
					if ($(this).find('[type=checkbox]:checked').length) {
						// self.appendSKU($(this).data('styleNumId'), null, $('#giftTable tbody'));
						self.appendToChosen($('#giftTable tbody'));
					}
				});
			});

			$('#checkAll').remove();
			// 全选
			// $('#checkAll').on('click', function(e) {
			//   e.stopPropagation();
			//   if ($(this).is(':checked')) {
			//     $('[type=checkbox]').attr("checked", "checked");
			//   } else {
			//     $('[type=checkbox]').removeAttr('checked');
			//   }
			// });
			if (c.gtId1) {
				self.ch2(c.gtId1);
				if (c.gtId2) {
					self.ch3(c.gtId2);
				}
			}
			// 选择推荐地区;
			Matrix.address.init({
				selects: ["prv", "city"],
				button: o.address,
				callblock: o.addressList,
				val: c.idarr
			});

			$('#savePromotion').on('click', function() {
				self.submit();
			});
		},
		fillForm: function(data) {
			var self = this,
				c = self.config,
				o = self.eles;
			console.log(data);
			$('[name="promotionName"]').val(data.promotionName);
			if (data.isTimeLimit == 1) {
				$('[name="isTimeLimit"][value="1"]').attr('checked', 'checked');
				$('[name="isTimeLimit"][value="0"]').remove('checked');
				$('.grantTime').show();
				$('[name="promotionStartTime"]').val(data.promotionStartTime);
				$('[name="promotionEndTime"]').val(data.promotionEndTime);
			} else {
				$('[name="isTimeLimit"][value="0"]').attr('checked', 'checked');
				$('[name="isTimeLimit"][value="1"]').remove('checked');
				$('.grantTime').hide();
			}
			$('[name="landingType"]').val(data.landingType);
			$('[name="landingPage"]').val(data.landingPage);
			$('[name="limitCount"]').val(data.limitCount);
			$('[name="fullMoney"]').val(data.fullMoney / 100);
			$('[name="styleNumIds"]').val(data.styleNumIds);
			$('[name="giftShortName"]').val(data.fullFree && data.fullFree.giftShortName);
			$('[name="giftGiveType"]').val(data.giftPromotion && data.giftPromotion.giftGiveType);
			if (data.landingType != 1) {
				$('[name="landingPage"]').removeAttr('disabled');
			}
			// 满减规则
			if (data.fullReduction) {
				var fullReduction = data.fullReduction;
				for (i = 0; i < fullReduction.length; i++) {
					if (i == 0) {
						$('[name="full"]')[i].value = fullReduction[i].full / 100;
						$('[name="reduction"]')[i].value = fullReduction[i].reduction / 100;
					} else {
						$('.js-add-fullrules').remove();
						o.rulesContainer.append('<div class="controls"> 满 <input type="text" placeholder="" class="span2 m-wrap" name="full" value="' + fullReduction[i].full / 100 + '" maxlength="10"> 减 <input type="text" placeholder="" class="span2 m-wrap" name="reduction" value="' + fullReduction[i].reduction / 100 + '" maxlength="10"> 元 <a href="javascript:;" class="btn btn-danger js-del-fullrules">删除</a> <a href="javascript:;" class="btn btn-primary js-add-fullrules">增加</a> </div>');
					}
				}
			}
			if (data.fullDiscount) {
				var fullDiscount = data.fullDiscount;
				for (i = 0; i < fullDiscount.length; i++) {
					if (i == 0) {
						$('[name="full"]')[i].value = fullDiscount[i].full;
						$('[name="discount"]')[i].value = fullDiscount[i].discount;
					} else {
						$('.js-add-fulldiscount').remove();
						o.dozenSalesContainer.append('<div class="controls"> 买 <input type="text" placeholder="" class="span2 m-wrap" name="full" value="' + fullDiscount[i].full + '" maxlength="10"> 件打 <input type="text" placeholder="" class="span2 m-wrap" name="discount" value="' + fullDiscount[i].discount + '" maxlength="10"> 折 <a href="javascript:;" class="btn btn-danger js-del-fullrules">删除</a> <a href="javascript:;" class="btn btn-primary js-add-fulldiscount">增加</a> </div>');
					}
				}
			}
			// 指定商品
			if (data.designatedGoods) {
				$('[name="isFullCourt"][value=1]').removeAttr('checked');
				$('[name="isFullCourt"][value=0]').attr('checked', 'checked');
				$('.js-catagory').show();
				c.gtId1 = data.designatedGoods.fid || "";
				c.gtId2 = data.designatedGoods.sid || "";
				c.gtId3 = data.designatedGoods.tid || "";
				$('#t1').val(c.gtId1);
				if (data.designatedGoods.brands && data.designatedGoods.brands.length) {
					$('#brands [type=checkbox]').each(function() {
						if (data.designatedGoods.brands.indexOf(+$(this).val()) > -1) {
							$(this).attr('checked', true);
						}
					});
				}
				$('[name="styleNumIds"]').val(data.designatedGoods.styleNumIds);
			}
			// 限定区域
			if (data.isCountrywide == 0 && data.citys) {
				$('[name="isCountrywide"][value=0]').trigger('click');
				$('.js-select-city').show();
				c.idarr = data.citys;
				var areas = [];
				for (i = 0; i < data.citys.length; i++) {
					areas.push('<span data-id="' + data.citys[i] + '" data-name="' + (data.cityNames[i] || '') + '">' + (data.cityNames[i] || '') + '<del>x</del></span>');
				}
				o.addressList.html(areas.join('')).data('val', data.citys);
			}

			// 已选商品
			var promotion = {}, // 促销信息
				goodsArr = []; // 促销指定商品
			if (data.promotionType == 5) {

			} else {
				if (data.promotionType == 3) {
					promotion = data.fullFree;
					$('#goodsTable tbody').html(createGoodsDom(promotion.fullFreeGoods));
				} else if (data.promotionType == 4) {
					promotion = data.comboPromotion;
					goodsArr = promotion.comboPromotionGoods;
					$('#goodsTable tbody').html(createGoodsDom(goodsArr));
				} else if (data.promotionType == 6) {
					promotion = data.giftPromotion;
					goodsArr = [promotion];
					$('#goodsTable tbody').html(createGoodsDom(goodsArr));
					$('#giftTable tbody').html(createGoodsDom(promotion.giftPromotionGoods));
				}
				$('[name="stock"]').val(promotion.stock);
				if (promotion.isGeneralWarehouse) {
					$('[name="isGeneralWarehouse"][value=1]').trigger('click');
				} else {
					$('[name="isGeneralWarehouse"][value=0]').trigger('click');
				}
			}

			function createGoodsDom(goodsArr) {
				var domArr = [];
				for (i = 0; i < goodsArr.length; i++) {
					var goodsHtmlArr = [];
					goodsHtmlArr.push('<tr class="style-' + goodsArr[i].styleNumId + '">');
					goodsHtmlArr.push('<td>' + goodsArr[i].styleNumId + '</td>');
					goodsHtmlArr.push('<td>' + goodsArr[i].styleId + '</td>');
					if (goodsArr[i].sku) {
						var sku = goodsArr[i].sku;
						goodsHtmlArr.push('<td class="sku"><ul>');
						for (j = 0; j < sku.length; j++) {
							goodsHtmlArr.push('<li>' + sku[j].itemId + '(￥' + sku[j].price + ')</li>');
							$.extend(sku[j], {
								"styleNumId": goodsArr[i].styleNumId,
								"styleId": goodsArr[i].styleId,
								"styleTitle": goodsArr[i].styleTitle
							});
						}
						goodsHtmlArr.push('</ul></td>');
					} else {
						goodsHtmlArr.push('<td>' + goodsArr[i].itemId + '(￥' + goodsArr[i].price + ')</td>');
					}
					goodsHtmlArr.push('<td>' + goodsArr[i].styleTitle + '</td>');
					goodsHtmlArr.push('<td><input type="text" name="" class="js-count" value=' + goodsArr[i].count + ' maxlength="8"></td>');
					if (data.promotionType == 4) {
						goodsHtmlArr.push('<td><input type="text" name="" class="js-discount" value=' + goodsArr[i].discountAmount / 100 + ' maxlength="7"></td>');
					}
					goodsHtmlArr.push('<td><a href="javascript:;" class="btn btn-danger btn-mini js-del">删除</a></td>');
					goodsHtmlArr.push('</tr>');
					var dom = $(goodsHtmlArr.join(''));
					if (goodsArr[i].sku) {
						dom.find('.sku ul li').each(function(index, el) {
							$(el).data('goods-infos', JSON.stringify(sku[index]));
						});
					}
					dom.data('goods-infos', JSON.stringify(goodsArr[i]));
					domArr.push(dom);
				}
				return domArr;
			}
		},
		ch2: function(id) {
			var self = this,
				c = self.config;
			if (id == "") {
				return;
			}
			$.get("/mamahao-yy-admin/goods/queryId.do", {
				'id': id
			}, function(data) {
				var str = '<option value=\"\">请选择</option>';
				$.each(data, function(i, n) {
					if (c && c.gtId2 && c.gtId2 == n.gtId) {
						str += "<option value='" + n.gtId + "' selected >" + n.gtName + "</option>";
					} else {
						str += "<option value='" + n.gtId + "'>" + n.gtName + "</option>";
					}
				});
				$('#t2').html(str);
				$('#t3').val("");
			});
		},
		ch3: function(id) {
			var self = this,
				c = self.config;
			if (id == "") {
				return;
			}
			$.get("/mamahao-yy-admin/goods/queryId.do", {
				'id': id
			}, function(data) {
				var str = '<option value=\"\">请选择</option>';
				$.each(data, function(i, n) {
					// console.log(gtId3==n.gtId);
					if (c && c.gtId2 && c.gtId3 == n.gtId) {
						str += "<option value='" + n.gtId + "' selected >" + n.gtName + "</option>";
					} else {
						str += "<option value='" + n.gtId + "'>" + n.gtName + "</option>";
					}
				});
				$('#t3').html(str);
			});
		},
		/**
		 * 按商品ID查询 返回查询结果后显示在查询结果列表中
		 * @return {[type]} [description]
		 */
		query: function() {
			var self = this,
				c = self.config;
			var goodsId = $('[name="goodsId"]').val(),
				sku = $('[name="sku"]').val();
			if (($('[name="goodsId"]').length === 0 && sku == "") || (goodsId == "" && sku == "")) {
				$('[name="goodsId"]').focus();
				return Toast.show('请输入需要查询的商品ID或SKU编码');
			}
			Matrix.JSON({
				showLoad: true,
				type: "POST",
				url: root + "/promotion/promotionSearchGoods.do",
				val: {
					"goodsId": goodsId,
					"sku": sku
				},
				fun: function(res) {
					// console.log(res);
					var promotionSearchGoods = res.promotionSearchGoods,
						resultContainer = $('#queryResultTable tbody');
					resultContainer.html(''); // 清空原查询结果
					resultContainer.find('[type="checkbox"]').removeAttr('checked');
					c.chosenGoods = {};
					if (promotionSearchGoods.length) {
						for (i = 0; i < promotionSearchGoods.length; i++) {
							var htmlArr = [],
								goods = promotionSearchGoods[i];
							if (resultContainer.find('.style-' + goods.styleNumId).length) {
								var li = $('<li><label class="label_check_sku" data-infos=' + JSON.stringify(goods) + '> <input type="checkbox" value="' + goods.itemId + '">' + goods.itemId + '(￥' + goods.price + ') </label></li>');
								li.data('goods-infos', JSON.stringify(goods));
								resultContainer.find('.style-' + goods.styleNumId + ' .sku ul').append(li);
							} else {
								htmlArr.push('<tr class="style-' + goods.styleNumId + '">');
								htmlArr.push('<td><label class="label_check_style" data-style-num-id=' + goods.styleNumId + '><input type="checkbox" value="' + goods.styleNumId + '"></label></td>');
								htmlArr.push('<td>' + goods.styleNumId + '</td>');
								htmlArr.push('<td>' + goods.styleId + '</td>');
								htmlArr.push('<td class="sku"><ul><li><label class="label_check_sku" data-infos=' + JSON.stringify(goods) + '> <input type="checkbox" value="' + goods.itemId + '">' + goods.itemId + '(￥' + goods.price + ')</label></li></ul></td>');
								htmlArr.push('<td>' + goods.styleTitle + '</td>');
								htmlArr.push('</tr>');
								var dom = $(htmlArr.join(''));
								dom.find('.sku ul li').data('goods-infos', JSON.stringify(goods));
								resultContainer.append(dom);
							}
						}
					} else {
						Toast.show('查询结果为空,请检查商品ID/SKU编码是否有误');
					}
				}
			});
		},
		/**
		 * 选中1件sku
		 * @param  {[type]} obj [description]
		 * @return {[type]}     [description]
		 */
		checkedSKU: function(obj) {
			var self = this,
				c = self.config,
				thas = $(obj),
				isChecked = thas.find('[type="checkbox"]:checked').length,
				skuEle = thas.closest('li'),
				goodsInfo = JSON.parse(skuEle.data('goods-infos')),
				styleNumId = goodsInfo.styleNumId;
			if (isChecked) {
				thas.find('[type="checkbox"]').attr('checked', 'checked');
				if (c.chosenGoods[styleNumId] && c.chosenGoods[styleNumId].sku.length) {
					// 判断sku是否已存在
					self.indexOfChosenGoods(styleNumId, goodsInfo.itemId) == -1 && c.chosenGoods[styleNumId].sku.push(goodsInfo);
				} else {
					c.chosenGoods[styleNumId] = {
						'sku': [goodsInfo]
					};
				}
			} else {
				thas.find('[type="checkbox"]').removeAttr('checked');
				if (c.chosenGoods[styleNumId] && c.chosenGoods[styleNumId].sku.length) {
					// 判断sku是否已存在, 存在则删除
					var index = self.indexOfChosenGoods(styleNumId, goodsInfo.itemId);
					index > -1 && c.chosenGoods[styleNumId].sku.splice(index, 1);
				}
			}
			if (c.promotionType == 6) return;
			if (isChecked) {
				if (c.promotionType == 4) self.appendStyle(styleNumId);
				if (c.promotionType == 3) self.appendSKU(styleNumId);
			}
		},
		/**
		 * 选中一种款式的商品
		 * @param  {[type]} obj [description]
		 * @return {[type]}     [description]
		 */
		checkedStyle: function(obj) {
			var self = this,
				c = self.config,
				thas = $(obj),
				isChecked = thas.find('[type="checkbox"]:checked').length,
				skuEles = thas.closest('tr').find('.sku ul li'),
				styleNumId = thas.data('styleNumId');
			for (i = 0; i < skuEles.length; i++) {
				var goodsInfo = JSON.parse($(skuEles[i]).data('goods-infos'));
				// console.log(goodsInfo);
				if (isChecked) {
					$(skuEles[i]).find('[type="checkbox"]').attr('checked', 'checked');
					if (c.chosenGoods[styleNumId] && c.chosenGoods[styleNumId].sku.length) {
						// 判断sku是否已存在
						self.indexOfChosenGoods(styleNumId, goodsInfo.itemId) == -1 && c.chosenGoods[styleNumId].sku.push(goodsInfo);
					} else {
						c.chosenGoods[styleNumId] = {
							'sku': [goodsInfo]
						};
					}
				} else {
					$(skuEles[i]).find('[type="checkbox"]').removeAttr('checked');
					// if (c.chosenGoods[styleNumId]) {
					//   c.chosenGoods[styleNumId] = undefined;
					// }
				}
			}
			// console.log(c.chosenGoods);
			if (c.promotionType == 6) return;
			if (isChecked) {
				if (c.promotionType == 4) self.appendStyle(styleNumId);
				if (c.promotionType == 3) self.appendSKU(styleNumId);
			}
		},
		indexOfChosenGoods: function(styleNumId, itemId) {
			var self = this,
				c = self.config,
				index = -1;
			for (j = 0; j < c.chosenGoods[styleNumId].sku.length; j++) {
				if (c.chosenGoods[styleNumId].sku[j].itemId == itemId) {
					index = j;
					break;
				}
			}
			return index;
		},
		// 将选中商品添加到指定表格中,需过滤已选商品, 区分是否按赠品显示 container可不传 默认普通商品按款式展示
		appendToChosen: function(container) {
			var self = this,
				o = self.eles,
				c = self.config,
				ct = container || $('#goodsTable tbody');
			$.each(o.selectable.find('.sku [type="checkbox"]:checked'), function(index, ele) {
				var goods = JSON.parse($(ele).closest('li').data('goodsInfos'));
				// console.log(JSON.parse(goodsInfo).itemId);
				var htmlArr = [];
				
				if(container){
					if(!self.isChosen(goods.itemId,container)){
						// 赠品
						htmlArr.push('<tr class="style-' + goods.styleNumId + '">');
						htmlArr.push('<td>' + goods.styleNumId + '</td>');
						htmlArr.push('<td>' + goods.styleId + '</td>');
						htmlArr.push('<td>' + goods.itemId + '(￥' + goods.price + ')</td>');
						htmlArr.push('<td>' + goods.styleTitle + '</td>');
						htmlArr.push('<td><input type="text" name="" class="js-count" maxlength="8"></td>');
						if (c.promotionType == 4) {
							htmlArr.push('<td><input type="text" name="" class="js-discount" maxlength="7"></td>');
						}
						htmlArr.push('<td><a href="javascript:;" class="btn btn-danger btn-mini js-del">删除</a></td>');
						htmlArr.push('</tr>');
						var dom = $(htmlArr.join(''));
						dom.data('goods-infos', JSON.stringify(goods));
						ct.append(dom);
					}
				}else{
					if(!self.isChosen(goods.itemId) ){
						if(ct.find('.style-' + goods.styleNumId).length){
							htmlArr.push('<li>' + goods.itemId + '(￥' + goods.price + ')</li>');
							ct.find('.style-' + goods.styleNumId + ' .sku ul').append($(htmlArr.join('')).data('goods-infos', JSON.stringify(goods)));
						}else{
							htmlArr.push('<tr class="style-' + goods.styleNumId + '">');
							htmlArr.push('<td>' + goods.styleNumId + '</td>');
							htmlArr.push('<td>' + goods.styleId + '</td>');
							htmlArr.push('<td class="sku"><ul><li>' + goods.itemId + '(￥' + goods.price + ')</li></ul></td>');
							htmlArr.push('<td>' + goods.styleTitle + '</td>');
							htmlArr.push('<td><input type="text" name="" class="js-count" maxlength="8"></td>');
							if (c.promotionType == 4) {
								htmlArr.push('<td><input type="text" name="" class="js-discount" maxlength="7"></td>');
							}
							htmlArr.push('<td><a href="javascript:;" class="btn btn-danger btn-mini js-del">删除</a></td>');
							htmlArr.push('</tr>');
							var dom = $(htmlArr.join(''));
							dom.find('.sku ul li').data('goods-infos', JSON.stringify(goods));
							dom.data('goods-infos', JSON.stringify(goods));
							ct.append(dom);
						}
					}
				}
			});
		},
		isChosen: function(itemId, container) {
			// container不传, 默认为按款式显示的已选列表 
			var c = container || $('#goodsTable tbody'),
				flag = false,
				chosenEles = [];
			chosenEles = container ? c.find('tr') : c.find('.sku li');

			if (chosenEles.length) {
				$.each(chosenEles, function() {
					if(JSON.parse($(this).data('goodsInfos')).itemId == itemId){
						flag = true;
						return;
					}
				});
			}

			return flag;
		},
		/**
		 * 在已选商品列表中显示选中的商品,sku合并显示
		 * @param  {[type]} styleNumId [description]
		 * @return {[type]}            [description]
		 */
		appendStyle: function(styleNumId, itemId) {
			var self = this,
				c = self.config,
				chosenGoods = c.chosenGoods[styleNumId].sku,
				chosenContainer = $('#goodsTable tbody'),
				htmlArr = [];
			// console.log(c.chosenGoods);
			for (i = 0; i < chosenGoods.length; i++) {
				var goods = chosenGoods[i];
				if (chosenContainer.find('.style-' + goods.styleNumId).length) {
					// 判断已选列表中是否已存在
					var flag = true;
					$(chosenContainer.find('.style-' + goods.styleNumId).find('.sku ul li')).each(function(index, el) {
						if (JSON.parse($(el).data('goods-infos')).itemId == goods.itemId) {
							return flag = false;
						}
					});
					if (flag) {
						var li = $('<li>' + goods.itemId + '(￥' + goods.price + ') </li>');
						li.data('goods-infos', JSON.stringify(goods));
						chosenContainer.find('.style-' + goods.styleNumId + ' .sku ul').append(li);
					}
				} else {
					htmlArr.push('<tr class="style-' + goods.styleNumId + '">');
					htmlArr.push('<td>' + goods.styleNumId + '</td>');
					htmlArr.push('<td>' + goods.styleId + '</td>');
					htmlArr.push('<td class="sku"><ul><li>' + goods.itemId + '(￥' + goods.price + ')</li></ul></td>');
					htmlArr.push('<td>' + goods.styleTitle + '</td>');
					htmlArr.push('<td><input type="text" name="" class="js-count" maxlength="8"></td>');
					if (c.promotionType == 4) {
						htmlArr.push('<td><input type="text" name="" class="js-discount" maxlength="7"></td>');
					}
					htmlArr.push('<td><a href="javascript:;" class="btn btn-danger btn-mini js-del">删除</a></td>');
					htmlArr.push('</tr>');
					var dom = $(htmlArr.join(''));
					dom.find('.sku ul li').data('goods-infos', JSON.stringify(goods));
					dom.data('goods-infos', JSON.stringify(goods));
					chosenContainer.append(dom);
				}
			}
		},
		// 按1个sku一行显示
		appendSKU: function(styleNumId, itemId, container) {
			var self = this,
				c = self.config,
				chosenGoods = c.chosenGoods[styleNumId].sku,
				chosenContainer = container || $('#goodsTable tbody');
			if (itemId) chosenGoods = c.chosenGoods[styleNumId].sku[self.indexOfChosenGoods(styleNumId, itemId)];
			// console.log(c.chosenGoods);
			for (i = 0; i < chosenGoods.length; i++) {
				var goods = chosenGoods[i],
					flag = true,
					htmlArr = [];
				if (chosenContainer.find('tr').length) {
					// 判断已选列表中是否已存在
					$(chosenContainer.find('tr')).each(function(index, el) {
						if (JSON.parse($(el).data('goods-infos')).itemId == goods.itemId) {
							return flag = false;
						}
					});
				}
				if (flag) {
					htmlArr.push('<tr class="style-' + goods.styleNumId + '">');
					htmlArr.push('<td>' + goods.styleNumId + '</td>');
					htmlArr.push('<td>' + goods.styleId + '</td>');
					htmlArr.push('<td>' + goods.itemId + '(￥' + goods.price + ')</td>');
					htmlArr.push('<td>' + goods.styleTitle + '</td>');
					htmlArr.push('<td><input type="text" name="" class="js-count" maxlength="8"></td>');
					if (c.promotionType == 4) {
						htmlArr.push('<td><input type="text" name="" class="js-discount" maxlength="7"></td>');
					}
					htmlArr.push('<td><a href="javascript:;" class="btn btn-danger btn-mini js-del">删除</a></td>');
					htmlArr.push('</tr>');
					var dom = $(htmlArr.join(''));
					dom.data('goods-infos', JSON.stringify(goods));
					chosenContainer.append(dom);
				}
			}
		},
		/**
		 * 请求保存提交数据
		 * @return {[type]} [description]
		 */
		submit: function() {
			var self = this,
				o = self.eles,
				c = self.config,
				reservedNo = c.data && c.data.reservedNo,
				promotionType = c.promotionType,
				promotionName = $.trim($('[name="promotionName"]').val()),
				isTimeLimit = $('[name="isTimeLimit"]:checked').val(),
				landingType = $('[name="landingType"]').val(),
				landingPage = $('[name="landingPage"]').val(),
				isFullCourt = $('[name="isFullCourt"]:checked').val(),
				isCountrywide = $('[name="isCountrywide"]:checked').val(),
				styleNumIds = $('[name="styleNumIds"]').val();
			var params = {
				"promotionType": +promotionType, // 促销类型
				"promotionName": promotionName, // 促销名称
				"isTimeLimit": +isTimeLimit, // 是否限时 0否1是
			};
			if(promotionType != 7) params.isCountrywide = isCountrywide; //是否全国参与0否1是
			if (reservedNo) params.reservedNo = reservedNo;

			if ($.trim(promotionName) == "" || isForm.isCheck(promotionName)) {
				$('[name="promotionName"]').focus();
				return Toast.show('请填写合法的促销名称');
			}
			if (styleNumIds && !/^[\d+,*]+$/.test(styleNumIds)) {
				$('[name="styleNumIds"]').focus();
				return Toast.show('请填写正确的商品ID,并以“,”分隔');
			}
			// 限时
			if (isTimeLimit == 1) {
				params.promotionStartTime = $('[name="promotionStartTime"]').val(); // 促销开始时间
				params.promotionEndTime = $('[name="promotionEndTime"]').val(); // 促销结束时间
			}

			//if(promotionType == 6) params.giftGiveType = $('[name="giftGiveType"]').val();	// 赠品促销 赠送类型
			// if(promotionType == 3) params.giftShortName = $('[name="giftShortName"]').val(); // 满赠促销 赠品短名称

			// 落地类型不是"无"
			if (promotionType == 5 || promotionType == 3) {
				params.landingType = +landingType; // 落地类型
				if (landingType != 1) {
					params.landingPage = $('[name="landingPage"]').val(); // 落地页
				}
			}
			// 促销类型为 组合|赠品 有限购数量
			if (promotionType == 4 || promotionType == 6) {
				params.limitCount = +$('[name="limitCount"]').val(); // 限购数
			}
			// 促销类型为 满减|满赠 有指定商品
			if (promotionType == 5 || promotionType == 3 || promotionType == 7) {
				params.isFullCourt = +isFullCourt; // 是否全场参与 0否1是
				if (isFullCourt == 0) {
					var brands = [],
						brandsDom = $('#brands input:checked');
					for (i = 0; i < brandsDom.length; i++) {
						brands.push(+brandsDom[i].value);
					}

					var styleNumIdsArr = [];
					for (i = 0; i < styleNumIds.split(',').length; i++) {
						styleNumIdsArr.push(+styleNumIds.split(',')[i]);
					}
					params.designatedGoods = {
						"fid": $('[name="styleCatelogFirst"]').val() ? +$('[name="styleCatelogFirst"]').val() : undefined,
						"sid": $('[name="styleCatelogSec"]').val() ? +$('[name="styleCatelogSec"]').val() : undefined,
						"tid": $('[name="styleCatelogThird"]').val() ? +$('[name="styleCatelogThird"]').val() : undefined,
						"brands": brands.length ? brands : undefined,
						"styleNumIds": styleNumIds ? styleNumIdsArr : undefined
					};
				}

				// styleNumIds && (params.styleNumIds = styleNumIds);
			}
			// 指定区域不是全国
			if(promotionType != 7){
				if (isCountrywide == 0) {
					var cities = [],
						cityNames = [],
						cityDoms = o.addressList.find('span');
					for (i = 0; i < cityDoms.length; i++) {
						cities.push($(cityDoms[i]).data('id'));
						cityNames.push($(cityDoms[i]).data('name'));
					}
					if (cities.length == 0) {
						return Toast.show('请选择指定城市');
					}
					params.citys = cities;
					params.cityNames = cityNames;
				}
			}


			if (promotionType == 5) {
				// 满减促销
				var fullReduction = [],
					fullReductionDoms = $('.js-full-rules .controls');
				for (i = 0; i < fullReductionDoms.length; i++) {
					var full = $(fullReductionDoms[i]).find('input')[0].value,
						reduction = $(fullReductionDoms[i]).find('input')[1].value;
					if (!isForm.isImp(full) || !isForm.isImp(reduction)) {
						return Toast.show('满减金额必须为整数');
					}
					if (+full <= +reduction) {
						return Toast.show('满金额需大于减金额');
					}
					if (i > 0 && (+full <= +$(fullReductionDoms[i - 1]).find('input')[0].value || +reduction <= +$(fullReductionDoms[i - 1]).find('input')[1].value)) {
						return Toast.show('请填写递增的满减规则');
					}
					if (full && reduction) {
						fullReduction.push({
							"levelId": i + 1,
							"full": +full * 100,
							"reduction": +reduction * 100
						});
					}
				}
				if (fullReduction.length == 0) {
					return Toast.show('请填写满减规则');
				}
				params.fullReduction = fullReduction;
			} else if(promotionType == 7){
				params.isCountrywide = 1;
				// 多买促销
				// fullDiscount:[{full: discount:}]
				var fullDiscount = [], validate = true;
				$('.js-full-discount-rules .controls').each(function(i,o){
					var $this = $(o);
					var full = $this.find('[name="full"]').val(),
						discount = $this.find('[name="discount"]').val();
					if (!isForm.isImp(full) || !isForm.isDecimal(discount,2)) {
						validate = false;
						return false;
					}
					// 校验件数是否重复;
					if(fullDiscount.length){
						var j = 0, k = fullDiscount.length;
						for(; j < k; j++){
							if(fullDiscount[j].full == full){
								validate = false;
								return false;
							}
						}
					}
					if (full && discount) {
						fullDiscount.push({
							"full": +full,
							"discount": +discount
						});
					}
				});
				//console.log(validate);
				if(!validate) return Toast.show('请填写正确的数值');
				if (validate && fullDiscount.length === 0) {
					return Toast.show('请填写多买规则');
				}
				params.fullDiscount = fullDiscount;
			}else {
				// 满赠/组合/赠品促销 
				var isGeneralWarehouse = $('[name="isGeneralWarehouse"]:checked').val(), // 是否总仓发货 0否1是
					stock = $('[name="stock"]').val(), // 促销库存
					goodsEles = $('#goodsTable tbody tr'); // 已选商品 
				if (!stock || !isForm.isImp(stock)) {
					$('[name="stock"]').focus();
					return Toast.show('促销库存不能为空/数量填写有误');
				}

				if (promotionType == 3) {
					// 满赠促销
					if (goodsEles.length === 0) {
						return Toast.show('请选择赠品');
					}
					var fullMoney = $('[name="fullMoney"]').val();
					if (!isForm.isImp(fullMoney)) {
						$('[name="fullMoney"]').focus();
						return Toast.show('请填写正确的金额');
					}
					params.fullMoney = fullMoney * 100; // 满赠条件
					var fullFreeGoods = []; // 已选商品
					if (goodsEles.length) {
						for (i = 0; i < goodsEles.length; i++) {
							var thas = $(goodsEles[i]),
								goodsInfo = JSON.parse(thas.data('goods-infos')),
								count = thas.find('.js-count').val();
							if (count == "") return Toast.show('数量为必填项');
							fullFreeGoods.push($.extend(goodsInfo, {
								"count": +count, // 数量
							}));
						}
					}
					params.fullFree = {
						"isGeneralWarehouse": +isGeneralWarehouse,
						"fullFreeGoods": fullFreeGoods,
						"stock": +stock, // 库存
						"giftShortName":$('[name="giftShortName"]').val()
					};
				} else if (promotionType == 4) {
					// 组合促销
					if (goodsEles.length === 0) {
						return Toast.show('请选择商品');
					}
					var comboPromotionGoods = []; // 已选商品
					if (goodsEles.length) {
						for (i = 0; i < goodsEles.length; i++) {
							var thas = $(goodsEles[i]),
								count = thas.find('.js-count').val(),
								discount = thas.find('.js-discount').val(),
								goods = JSON.parse(thas.data('goods-infos'));
							if (count == "" || !isForm.isImp(count)) return Toast.show('请填写正确的数值');
							if (!/^\d+([.]\d{1,2})*$/.test(discount)) return Toast.show('请填写正确的金额');
							var sku = [];
							$(thas.find('.sku ul li')).each(function() {
								var obj = JSON.parse($(this).data('goods-infos'));
								sku.push({
									"itemId": obj.itemId,
									"itemNumId": obj.itemNumId,
									"price": obj.price
								});
							});
							// if (discount > JSON.parse(thas.find('.sku ul li').data('goods-infos')).price) {
							// 	return Toast.show('优惠金额不能高于商品价格');
							// }
							comboPromotionGoods.push({
								"styleNumId": goods.styleNumId,
								"styleId": goods.styleId,
								"styleTitle": goods.styleTitle,
								"discountAmount": Math.round(discount * 100), // 优惠金额
								"count": +count, // 数量
								"sku": sku
							});
						}
					}
					params.comboPromotion = {
						"isGeneralWarehouse": +isGeneralWarehouse,
						"stock": +stock, //库存
						"comboPromotionGoods": comboPromotionGoods
					};
				} else if (promotionType == 6) {
					// 赠品促销
					if (goodsEles.length > 1) return Toast.show('主商品只能选择一个');
					if (goodsEles.length) {
						var goodsEle = $(goodsEles[0]),
							count = goodsEle.find('.js-count').val(),
							goods = JSON.parse(goodsEle.data('goods-infos'));
						var sku = [];
						$(goodsEle.find('.sku ul li')).each(function() {
							var obj = JSON.parse($(this).data('goods-infos'));
							sku.push({
								"itemId": obj.itemId,
								"itemNumId": obj.itemNumId,
								"price": obj.price
							});
						});
					} else {
						return Toast.show('请选择一个主商品');
					}
					var giftEles = $('#giftTable tbody').find('tr'),
						giftPromotionGoods = []
					if (giftEles.length) {
						for (i = 0; i < giftEles.length; i++) {
							var giftEle = $(giftEles[i]),
								giftCount = giftEle.find('.js-count').val(),
								gift = JSON.parse(giftEle.data('goods-infos'));
							if (giftCount == "") return Toast.show('数量为必填项');
							giftPromotionGoods.push({
								"styleNumId": gift.styleNumId,
								"styleId": gift.styleId,
								"styleTitle": gift.styleTitle,
								"itemId": gift.itemId,
								"itemNumId": gift.itemNumId,
								"itemName": gift.itemName,
								"count": +giftCount, // 数量
								"price": gift.price
							});
						}
					} else {
						return Toast.show('请选择赠品');
					}
					params.giftPromotion = {
						"isGeneralWarehouse": +isGeneralWarehouse,
						"stock": +stock, //库存
						"styleNumId": goods.styleNumId,
						"styleId": goods.styleId,
						"styleTitle": goods.styleTitle,
						"count": +count,
						"sku": sku,
						"giftPromotionGoods": giftPromotionGoods,
						"giftGiveType" : $('[name="giftGiveType"]').val()
					};
				}
			}

			// return console.log(params);
			Matrix.JSON({
				showLoad: true,
				type: "POST",
				url: root + "/promotion/promotionSave.do",
				val: {
					"data": JSON.stringify(params)
				},
				fun: function(res) {
					if (res.success) {
						Toast.show('保存成功!');
						setTimeout(function() {
							location.href = root + '/promotion/promotionList.do';
						}, 1000);
					} else {
						Toast.show(res.msg);
					}
				}
			});
		}
	};

	page.init();
	window.ch2 = page.ch2;
	window.ch3 = page.ch3;
})(jQuery);