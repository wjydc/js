;
(function () {
    var page = {
        config: {
            vipLevels: ['新人妈妈', '粉丝会员', '银粉会员', '金粉会员', '钻粉会员']
        },
        init: function () {
            var self = this, c = self.config;
            if (VM.jsonData) {
                self.renderData(JSON.parse(VM.jsonData));
            }

            //新增
            $(document.body).on('click','.js-add', function () {
                var $this = $(this);
                self.render($this.data('type'), $($this.data('target')));
            });

            //删除
            $('.js-container').on('click', '.js-remove', function () {
                $(this).closest('.js-item').remove();
            });

            //保存
            $('.js-save').on('click', function () {
                if (self.validate()) self.commit();
            });
        },
        /**/
        renderData: function (data) {
            var self = this, arr = $.merge(data.priceData, data.mbeanData);
            $('#date').val(data.date);
            $('#beginDay').val(data.beginDay);
            $('#endDay').val(data.endDay);

            $.each(arr, function (i, v) {
                var type = (typeof v.type === 'undefined' ) ? 2 : v.type,
                    containerType = (typeof v.type === 'undefined' ) ? 2 : 0;
                var $target = $('.js-container[data-type=' + containerType + ']');
                self.render(type, $target, v);
            });
        },
        /* 渲染页面 type 0:满减金额 1:满折 2:满赠妈豆 */
        render: function (type, container, data) {
            var self = this, c = self.config;
            var htmlArr = [], collIndex = container.find('.js-item').length + 1,desc= '(金额优惠)';
            switch (type) {
                case 0:
                    break;
                case 1:
                    desc = '(折扣优惠)';
                    break;
                case 2:
                    desc = '优惠';
                    break;
            }
            htmlArr.push('<div class="js-item" data-type="' + type + '"><div class="widget-title">');
            htmlArr.push('<a data-toggle="collapse" href="#discount' + collIndex + '" class="collapsed"> <span class="icon"><i class="icon-' + (type == 3 ? 'gift' : 'tag') + '"></i></span> <h5>' + desc + '</h5> </a>');
            htmlArr.push('<button class="btn btn-mini btn-danger js-remove">删除</button>');
            htmlArr.push('</div>');
            htmlArr.push('<div id="discount discount' + collIndex + '" class="in collapse"> <div class="widget-content" data-type=' + type + '> <div class="form-horizontal form-horizontal-inline">');
            htmlArr.push('<div class="row-fluid  item-title"> <div class="span4"> <label class="control-label">满足条件 :满</label><div class="controls"><input type="text" class="span8" data-type="integer" name="priceCondition" value="' + (data ? data.priceCondition / 100 : '') + '"> 元</div></div></div><hr>');
            // 表单
            $.each(c.vipLevels, function (index, el) {
                if (index % 3 === 0) {
                    htmlArr.push('<div class="row-fluid item-detail">');
                }
                switch (type) {
                    case 0:
                        htmlArr.push('<div class="span4"> <div class="control-group"> <label class="control-label">' + el + '：减</label> <div class="controls"> <input type="text" class="span8" data-type="integer" value="' + (data ? data.preferential[index] && data.preferential[index].value / 100 : '') + '"> 元 </div> </div> </div>');
                        break;
                    case 1:
                        htmlArr.push('<div class="span4"> <div class="control-group"> <label class="control-label">' + el + '：打</label> <div class="controls"> <input type="text" class="span8" data-type="discount" value="' + (data ? data.preferential[index] && data.preferential[index].value * 10 : '') + '"> 折 </div> </div> </div>');
                        break;
                    case 2:
                        htmlArr.push('<div class="span4"> <div class="control-group"> <label class="control-label">' + el + '：赠</label> <div class="controls"> <input type="text" class="span8" data-type="times" value="' + (data ? data.preferential[index] && data.preferential[index].value : '') + '"> 倍 </div> </div> </div>');
                        break;
                }
                if (index + 1 % 3 === 0 || index === c.vipLevels.length - 1) {
                    htmlArr.push('</div>');
                }

            });
            htmlArr.push('</div></div></div></div>');
            container.append(htmlArr.join(''))
            return container;
        },
        /* 校验 */
        validate: function () {
            var flag = true;

            if (!$('.js-item')[0]) {
                Toast.show('满减促销配置不能为空~');
                return flag = false;
            }

            var _container = $('.js-container'),
                _validate_ele = _container.find('input:text:visible,textarea:visible,select:visible').not('.unnecessary');
            $.each(_validate_ele.add($('input[data-type="date"]')), function () {
                var _this = $(this), this_val = _this.val();
                var tips = _this.closest('.control-group').find('.control-label').text().replace(/[*：:]/g, '').replace(/(满|赠|减|打)$/g, '选项');
                console.log(tips)
                if (!$.trim(this_val)) {
                    _this.data('type') !== 'date' && $(this).focus();
                    Toast.show(tips + '不能为空！');
                    return flag = false;
                }

                if (_this.data('type') === 'integer' && !/^[1-9]\d*$/.test(this_val)) {
                    _this.data('type') !== 'date' && $(this).focus();
                    Toast.show(tips + '只允许输入正整数！');
                    return flag = false;
                }

                if (_this.data('type') === 'discount' && !/^[1-9](\.\d)?$/.test(this_val)) {
                    _this.data('type') !== 'date' && $(this).focus();
                    Toast.show(tips + '折扣输入不合理！');
                    return flag = false;
                }
                if (_this.data('type') === 'times' && !/^[1-9]\d*(\.\d)?$/.test(this_val)) {
                    _this.data('type') !== 'date' && $(this).focus();
                    Toast.show(tips + '倍数输入不合理！');
                    return flag = false;
                }

                if (_this.data('type') === 'CN' && !/^[\u4e00-\u9fa5]+$/.test(this_val)) {
                    _this.data('type') !== 'date' && $(this).focus();
                    Toast.show(tips + '只允许输入中文，不允许特殊字符！');
                    return flag = false;
                }

            });

            if (!flag) return false;

            $.each(_container, function (i, v) {
                var title = $(v).prev().find('.alert-heading').text();
                var items = $(v).find('.js-item');
                $.each(items, function (j, k) {
                    if (items.length > 1) {
                        if ($(items[j + 1])[0] && +$(items[j]).find('.item-title input').val() >= +$(items[j + 1]).find('.item-title input').val()) {
                            flag = false;
                            $(items[j + 1]).find('.item-title input').focus();
                            Toast.show('当前满足条件不能比前一档小！');
                            return false;
                        }
                    }

                    if (!flag) return false;

                    var details = $(k).find('.item-detail input');
                    $.each(details, function (m, n) {
                        if ($(details[m + 1])[0]
                            && (($(k).data('type') == 1 && +$(details[m]).val() < +$(details[m + 1]).val())   //折扣
                            || ($(k).data('type') != 1 && +$(details[m]).val() > +$(details[m + 1]).val()))
                        ) {
                            flag = false;
                            $(details[m + 1]).focus();
                            Toast.show('当前优惠不能比前一项优惠小！');
                            return false;
                        }

                        var $prev = $(items[j-1]).find('.item-detail input').eq(m);
                        if(j > 0
                            && $(k).data('type') === $(items[j-1]).data('type')
                            && (($(k).data('type') == 1 && +$(details[m]).val() >= +$prev.val())  //折扣
                            || ($(k).data('type') != 1 && +$(details[m]).val() <= +$prev.val()))
                        ){
                            flag = false;
                            $(details[m]).focus();
                            Toast.show('当前优惠不能比前一档优惠小！');
                            return false;
                        }

                    });
                });
                if (!flag) return false;
            });

            return flag;
        },
        /* 保存提交 */
        commit: function () {
            var priceData = [], mbeanData = [];
            $('.js-item').each(function () {
                var $this = $(this), type = $this.data('type'), preferential = [];
                $.each($this.find('.item-detail input:text'), function (index, o) {
                    var val = +$(this).val();
                    type === 0 && (val = val * 100);
                    type === 1 && (val = val / 10);
                    preferential.push({
                        "levelId": index,
                        "value": +val
                    });
                });
                var p = {
                    "priceCondition": +$this.find('input[name="priceCondition"]').val() * 100,
                    "preferential": preferential
                };

                if (type === 2) {
                    mbeanData.push(p);
                } else {
                    p.type = type;
                    priceData.push(p);
                }
            });

            var params = {
                "msPmtNo": VM.msPmtNo,
                "type": +VM.type,
                "date": $('#date').val(),
                "beginDay": $('#beginDay').val(),
                "endDay": $('#endDay').val(),
                "status": 1,
                "priceData": priceData,
                "mbeanData": mbeanData,
                "areas": []
            };

            //城市选择
            var $city_radio = $('.js-city-radio'), city_radio_val = $('.js-city-radio:checked').val();
            if($city_radio[0]){
                  if(city_radio_val == 0){
                      params.areas = [1];
                  }else{
                      $.each($('.js-address-list span'), function (i, v) {
                          params.areas.push($(this).data('id'));
                      });
                  }
            }

            console.log('请求参数', JSON.stringify(params));
            Matrix.JSON({
                url: root + '/monsp/pmt/save.do',
                val: {jsonData: JSON.stringify(params)},
                type: 'POST',
                fun: function (res) {
                    //回调
                    if (res.success) {
                        Toast.show({
                            template: '保存成功！',
                            callback: function () {
                                location.href = root + '/monsp/pmt/index.do?type=' + VM.type;
                            }
                        })
                    } else {
                        Toast.show(res.msg);
                    }
                }
            });
        }
    };

    page.init();
})();