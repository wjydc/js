/**
 * Created by xqs on 2016/3/28.
 * voucher-create.js
 * 优惠券创建页面
 * 备注: 创建、编辑、详情均公用同一个js文件（voucher-create.js）,根据isCreate和canUpdate字段来区分
 */
(function ($) {
    var page = {
        info: {
            vm: VM,  //页面VM对象
            isCreate: VM.tid ? false : true,  //当前操作，创建或更新
            canUpdate: VM.canUpdate === 'true' ? true : false,  //当前是否可修改，查看详情或者是编辑
            voucherType: +VM.voucherType  //优惠券类型 0=单面额券，1=组券，3=卡券
        },
        /*初始化*/
        init: function () {
            page.bindEvents(); //绑定事件

            page.optimize();    //页面部分元素编辑状态下需要调整
        },
        /*调整页面部分元素*/
        optimize: function () {
            /*需要js特殊处理*/

            /*1.查看模式下需要禁用所用可用表单元素*/
            var c = page.info;
            if (!c.isCreate && !c.canUpdate) {  //查看模式
                var _form = $('.form-voucher');
                _form.find(':text,textarea').attr('readonly', true);
                _form.find(':radio,:checkbox').attr('disabled', true);
            }

            /*2.计算礼包优惠券的总金额*/
            page.calcVoucherMoney();  //计算礼包优惠券总金额

            /*3.指定品牌和类目时需要ajax请求item*/
            if (!c.isCreate) {  //查看或编辑模式
                /*更新列表*/
                $.each($('.applyType :radio:checked'), function () {
                    var _this = $(this), applyType = +_this.val();
                    if (applyType === 1 || applyType === 2) {
                        page.getScopeList(_this);
                    }
                });
            }

        },
        /*绑定事件*/
        bindEvents: function () {
            var c = page.info;
            $('.js-save').on('click', page.save);  //提交表单数据
            $('.js-addTpl').on('click', page.addTpl);  //增加优惠券模板


            /*优惠券使用场景*/
            $(document.body).on("change", ".scopeChannel :radio", function () {
                if (+$(this).val() === 0 || +$(this).val() === 1) {
                    $(".scopeChannelOptions").hide();
                } else {
                    $(".scopeChannelOptions").show();
                }

                /*更新列表*/
                $.each($('.applyType :radio:checked'), function () {
                    var _this = $(this);
                    page.getScopeList(_this);
                });
            });

            $(document.body).on('change', '.scopeChannelOptions :checkbox', function () {
                /*更新列表*/
                $.each($('.applyType :radio:checked'), function () {
                    var _this = $(this);
                    page.getScopeList(_this);
                });
            });

            /*发放时间*/
            $(document.body).on("change", ".grantType :radio", function () {
                if (+$(this).val() === 1) {
                    $(".grantTime").show();
                } else {
                    $(".grantTime").hide();
                }
            });

            /*优惠券有效期，0=固定日期内，1=周期*/
            $(document.body).on("change", ".voucherValidType :radio", function () {
                var _this = $(this), _parent = _this.closest(".controls");
                if (+$(this).val() === 1) {
                    _parent.find('.voucherLimitDay').hide().siblings('.voucherDelayDay').show();
                } else {
                    _parent.find('.voucherLimitDay').show().siblings('.voucherDelayDay').hide();
                }
            });

            /*删除优惠券模板*/
            $(document.body).on('click', '.ticket-block .close', function () {
                var item = $(this).closest('.ticket-block');
                item.remove();
                page.calcVoucherMoney();  //计算礼包优惠券总金额
            });

            /*input失去焦点，计算礼包优惠券总金额*/
            $(document.body).on('blur', ':text', function () {
                page.calcVoucherMoney();  //计算礼包优惠券总金额
            });

            /*全选使用范围*/
            $(document.body).on('change', ':checkbox[name="allapplyValue"]', function () {
                var _this = $(this), _target = $('.applyValue').find(':checkbox:enabled');
                if (_this.is(':checked')) {
                    _target.attr('checked', true);
                } else {
                    _target.attr('checked', false);
                }
            });

            /*优惠券适用范围
             * 0=不限，1=指定品牌，2=指定类目，3=指定商品
             * */
            $(document.body).on("change", ".applyType :radio", function () {
                var _this = $(this);
                page.getScopeList(_this);
            });

        },
        /*获取可选范围列表*/
        getScopeList: function (obj) {
            var c = page.info;
            var _this = $(obj), applyType = +_this.val();
            var apiURL, boxContext = '';
            if (applyType === 1) apiURL = '/app/coupon/brand/list.do';  //1=指定品牌
            if (applyType === 2) apiURL = '/app/coupon/category/list.do';    //2=指定类目
            var box = _this.closest('.applyType').siblings('.box');

            /*编辑或查看时*/
            var ids = box.data('ids') && box.data('ids').split(',') || [];  //转成数组

            switch (applyType) {
                case 0:
                    box.empty();
                    break;
                case 1:
                case 2:
                    Matrix.JSON({
                        type: 'post',
                        url: c.vm.rootPath + apiURL,
                        val: {scopeChannel: $('[name="scopeChannel"]:checked').val()}, //{scopeChannel: page.getScopeChannel()},
                        fun: function (res) {
                            var html = [], data = res;
                            html.push('<div class="checkall"><label><input type="checkbox" name="allapplyValue"/>全选</label></div>');
                            html.push('<div class="applyValue">');
                            $.each(data, function (i, item) {
                                html.push('<label class="help-inline"><input type="checkbox" name="applyValue" value="' + item.id + '" data-id="' + item.id + '"/>' + item.name + '</label>');
                            });
                            html.push('</div>');
                            box.empty().append(html.join(''));

                            /*选中checkbox*/
                            if (ids.length) {
                                $.each(ids, function (i, v) {
                                    box.find(':checkbox[name="applyValue"][value="' + v + '"]').attr('checked', true);
                                });
                                (!c.isCreate && !c.canUpdate) && box.find(':checkbox').attr('disabled', true); //查看模式禁用checkbox
                            }
                        }
                    });
                    break;
                case 3:
                    boxContext = '<textarea name="applyValue" placeholder="请填写商品ID,以“,”分隔" ></textarea>';
                    box.empty().append(boxContext);
                    break;
            }
        },
        /*增加优惠券模板*/
        addTpl: function () {
            var c = page.info;
            var index = $('.ticket-block').length;
            var tpl = $('.ticket-block').eq(0).clone();
            /*改变radio的name属性*/
            $.each(tpl.find(':radio'), function () {
                var _this = $(this), _name = _this.attr('name');
                _this.attr('name', _name + index);
            });
            /*改变datepicker的id属性,限制日期范围选择*/
            $.each(tpl.find('.datepicker'), function () {
                var _this = $(this), _id = _this.attr('id');
                _this.attr('id', _id + index);
                var _target = 'voucherBeginDay', limit = 'minDate';
                if (_this.is('.voucherBeginDay')) {
                    _target = 'voucherEndDay';
                    limit = 'maxDate';
                }
                _this.attr('onfocus', "WdatePicker({dateFmt:'yyyy-MM-dd HH:mm:ss'," + limit + ":'#F{$dp.$D(\\'" + _target + index + "\\',{s:-1});}'});");
            });

            tpl.find('.ticket-box').prepend('<a href="javascript:;" class="close">x</a>');     //增加关闭按钮
            $('.voucher-list').append(tpl[0].outerHTML);

            /*重置*/
            var _box = $('.voucher-list .ticket-block').eq(index);
            _box.find(':text').attr('value', '');
            _box.find(':checkbox').attr('checked', false);
            $.each(_box.find('.controls'), function () {
                $(this).find(':radio').eq(0).trigger('click');
            });
						_box.find(".voucherLimitDay").show();
						_box.find(".voucherDelayDay").hide();

            page.calcVoucherMoney();  //计算礼包优惠券总金额

        },
        /*计算礼包优惠券总金额*/
        calcVoucherMoney: function () {
            var c = page.info;
            if (c.voucherType === 1) { //礼包券

                var check_res = true;

                /*提前校验*/
                if ($.trim($('#groupVoucherCount').val()) && !/^[1-9]\d*$/.test($('#groupVoucherCount').val())) {
                    check_res = false;
                    Toast.show('发行量只允许输入正整数！');
                    return $('#groupVoucherCount').focus();
                }

                /*计算*/
                var amount = 0, count = +$('#groupVoucherCount').val();
                $.each($(".ticket-box"), function () {
                    var _this = $(this);
                    if ($.trim(_this.find("input.amount").val()) && !/^[1-9]\d*$/.test(_this.find("input.amount").val())) {
                        check_res = false;
                        Toast.show('单张面额只允许输入正整数！');
                        return _this.find("input.amount").focus();
                    }
                    amount += +_this.find("input.amount").val();
                });

                if (check_res) $("#groupVoucherMoney").val(amount);   //礼包金额
            }
        },

        /*校验表单元素*/
        validate: function (container) {
            var check_res = true;
            var _validate_ele = $(container).find('input:text:visible,textarea:visible,select:visible').not('.unnecessary');
            $.each(_validate_ele, function () {
                var _this = $(this), this_val = _this.val();
                var tips = _this.data('tips') || _this.closest('.control-group').find('.control-label').text().replace(/[*：:]/g, '');
                if (!$.trim(this_val)) {
                    Toast.show(tips + '不能为空！');
                    !_this.hasClass('datepicker') && _this.focus();
                    return check_res = false;
                }

                if (_this.data('type') === 'integer' && !/^[1-9]\d*$/.test(this_val)) {
                    !_this.hasClass('datepicker') && _this.focus();
                    Toast.show(tips + '只允许输入正整数！');
                    return check_res = false;
                }

                if (_this.data('type') === 'CN' && !/^[\u4e00-\u9fa5]+$/.test(this_val)) {
                    Toast.show(tips + '只允许输入中文，不允许特殊字符！');
                    !_this.hasClass('datepicker') && _this.focus();
                    return check_res = false;
                }

            });

            /*校验输入商品id的格式*/
            if (check_res) {
                var apply_value = $('textarea[name="applyValue"]');
                if (apply_value[0] && !/^\d+(,\d+)*$/gi.test(apply_value.val())) {
                    Toast.show('请输入正确的格式');
                    apply_value.focus();
                    return check_res = false;
                }
            }

            /*适用范围为指定品牌或类目时，选项不能为空*/
            if (check_res) {
                $.each($('.ticket-block'), function () {
                    var _this = $(this), index = $('.ticket-block').index(_this) + 1, applyType = +_this.find('.applyType :radio:checked').val();
                    if (applyType === 1 || applyType === 2) {
                        if (!_this.find('.applyValue :checkbox:checked:enabled')[0]) {
                            Toast.show('请选择第' + index + '个模板的优惠券适用范围！');
                            return check_res = false;
                        }
                    }
                });
            }

            return check_res;
        },
        getScopeChannel: function () {
            //优惠券使用场景   //0=全部，1=APP，2=所有POS，3=门店POS，4=特卖会POS
            var v_scopeChannel = $('[name="scopeChannel"]:checked').val();
            if (v_scopeChannel === '0' || v_scopeChannel === '1') {
                v_scopeChannel = +v_scopeChannel;
            } else {
                v_scopeChannel = 2;
                if ($('[name="c_shop"]').is(":checked") && $('[name="c_sale"]').is(":checked")) {
                    v_scopeChannel = 2;
                } else {
                    if ($('[name="c_shop"]').is(":checked")) {
                        v_scopeChannel = 3;
                    }
                    if ($('[name="c_sale"]').is(":checked")) {
                        v_scopeChannel = 4;
                    }
                }
            }
            return v_scopeChannel;
        },
        /*获取表单数据*/
        getFormData: function () {
            var c = page.info;

            var extData = {},  //data_ext:扩展数据，根据优惠券类型不同，最终提交的表单数据结构也不同
                baseData = {
                    "type": c.voucherType, //0=单面额券，1=组券，3=卡券
                    "name": $('.voucherName').val(), //名称
                    "publishTimeType": +$('[name="grantType"]:checked').val(), //发行时间类型：0=不限，1=固定时间
                    "circulation": +$('[name="groupVoucherCount"]').val(), //发行量
                    "perLimit": +$('.limitCount').val(), //每人限领
                };

            /*发行时间为固定时间区间*/
            if (baseData.publishTimeType === 1) {
                baseData.publishStartTime = +new Date($('.grantBeginTime').val());  //开始发券时间，时间戳
                baseData.publishEndTime = +new Date($('.grantEndTime').val());   //结束发券时间，时间戳
            }


            /*优惠券类型*/
            switch (c.voucherType) {
                case 0:
                case 1:   //优惠券相同数据部分

                    extData = {
                        "groupUnits": [],
                        "userType": +$('[name="userType"]:checked').val(), //可领取用户身份，0=全部，1=老用户，2=新用户
                        "useWithGroupPro": $('[name="useWithGroupPro"]').is(":checked") ? true : false, //是否能与集团促销叠加
                        "costChargedType": +$('[name="voucherCost"]:checked').val(), //成本承担方：0=好孩子集团，1=妈妈好
                    };


                    //优惠券使用场景   //0=全部，1=APP，2=所有POS，3=门店POS，4=特卖会POS
                    // extData.scopeChannel = page.getScopeChannel();
                    extData.scopeChannel = $('[name="scopeChannel"]:checked').val();

                    /*优惠券设置*/
                    $.each($('.ticket-block'), function () {
                        var _this = $(this);
                        var itemData = {
                            "denominationAmount": _this.find('.amount').val() * 100, //面额（分）
                            "consumptionAmount": _this.find('.money').val() * 100, //消费额
                            "scope": +_this.find('.applyType :radio:checked').val(), //使用范围：0=不限，1=指定品牌，2=指定类目，3=指定商品
                            "scopeDesc": _this.find('.applyText').val(), //适用范围文案
                            "effectiveType": +_this.find('.voucherValidType :radio:checked').val(), //生效类型：0=固定日期内，1=周期
                        };
                        if (itemData.effectiveType === 0) {      //固定日期内
                            itemData.effectiveStartTime = +new Date(_this.find('.voucherBeginDay').val());    //有效期开始，时间戳
                            itemData.effectiveEndTime = +new Date(_this.find('.voucherEndDay').val());     //有效期结束，时间戳
                        } else {  //周期
                            itemData.effectiveDelayDays = +_this.find('#voucherDelayDay').val();   //延后天数
                        }

                        /*选择使用范围*/
                        if (itemData.scope !== 0) {
                            //1=指定品牌，2=指定类目
                            if (itemData.scope === 1 || itemData.scope === 2) {
                                itemData.scopeList = [];
                                $.each(_this.find(':checkbox[name="applyValue"]:checked'), function () {
                                    itemData.scopeList.push($(this).data('id'));
                                });
                            }

                            //3=指定商品
                            if (itemData.scope === 3) {
                                itemData.scopeList = _this.find('textarea[name="applyValue"]').val().split(',');
                            }
                        }

                        extData.groupUnits.push(itemData);
                    });

                    break;
                case 3:   //卡券数据
                    extData = {
                        "cardTitle": $('.mainTitle').val(),  //卡券主标题
                        "cardSubTitle": $('.subTitle').val(),  //卡券副标题
                        "cardDetailDesc": $('.detailDesc').val(), //卡券详细描述
                        "cardTicketId": $('.ticketId').val(), //卡券规则编码
                        "groupUnits": []
                    };

                    var itemData = {
                        "scopeDesc": $('.applyText').val(), //适用范围文案
                        "effectiveType": +$('[name="voucherValidType"]:checked').val(), //生效类型：0=固定日期内，1=周期
                    };

                    if (itemData.effectiveType === 0) {      //固定日期内
                        itemData.effectiveStartTime = +new Date($('.voucherBeginDay').val());    //有效期开始，时间戳
                        itemData.effectiveEndTime = +new Date($('.voucherEndDay').val());     //有效期结束，时间戳
                    } else {  //周期
                        itemData.effectiveDelayDays = +$('#voucherDelayDay').val();   //延后天数
                    }

                    extData.groupUnits.push(itemData);
                    break;
            }

            return $.extend({}, baseData, extData);   //合并数据
        },
        /*提交表单*/
        save: function () {
            var c = page.info;
            if (!page.validate('.form-voucher')) return false;

            var data = page.getFormData(); //表单数据
            var apiURL = c.isCreate ? '/app/coupon/create/start.do' : '/app/coupon/update.do';  //api接口地址

            var ajaxData = {data: JSON.stringify(data)};
            !c.isCreate && (ajaxData.tid = c.vm.tid);    //编辑状态下需要传模板ID

            Matrix.JSON({
                type: 'post',
                url: c.vm.rootPath + apiURL,
                val: ajaxData,
                fun: function (res) {
                    if (res.success) {
                        Toast.show({
                            template: c.isCreate ? "创建成功" : "更新成功",
                            second: 1000,
                            callback: function () {
                                window.location.href = c.vm.rootPath + "/app/coupon/list.do?type=" + c.voucherType + "&page=1";
                            }
                        });
                    } else {
                        res.msg && Toast.show(res.msg);
                    }
                }
            })

        }

    };

    page.init();
})(window.jQuery);
