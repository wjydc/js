/**
 * Created by xqs on 2016/3/28. Last modify on 2016/04/18
 * voucher-create.js
 * 优惠券创建页面
 * 备注: 创建、编辑、详情均公用同一个js文件（voucher-create.js）,根据isCreate和canUpdate字段来区分
 * 坑：日期格式如2016-04-29 15:35在取时间戳的时候尽量转成标准格式 replace(/-/g,'/')，避免在Safari等浏览器下调用失败的问题
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
                _form.find(':radio,:checkbox,select').attr('disabled', true);
            }

            /*2.计算礼包优惠券的总金额*/
            page.calcVoucherMoney();  //计算礼包优惠券总金额

            /*3.指定品牌和类目时需要ajax请求item*/
            if (!c.isCreate) {  //查看或编辑模式
                /*更新列表*/
                $.each($('.applyType :radio:checked'), function () {
                    var _this = $(this), applyType = +_this.val();
                    var _container = _this.closest('.ticket-box').find('.applyTypeContainer');
                    if (applyType === 4) {
                        _container.show();
                    } else {
                        _container.hide();
                    }
                });
            }

        },
        /*绑定事件*/
        bindEvents: function () {
            var c = page.info;
            $('.js-save').on('click', page.save);  //提交表单数据
            $('.js-addTpl').on('click', page.addTpl);  //增加优惠券模板
            $(document.body).on('click', '.js-search-shop', page.getShopList);  //获取门店列表
            $(document.body).on('click', '.js-addItem', page.addApplyItem);  //增加类目、品牌组合

            //获取省份初始化一次
            getPrv(''); //省

            /*获取类目和品牌列表*/
            page.getBrandList();

            $.each($('.categoryCon'), function () {
                var _this = $(this);
                var data = {
                    id: _this.data('id'),
                    level: _this.data('level'),
                    parent1: _this.data('parent1'),
                    parent2: _this.data('parent2')
                };
                if (!data.level) { //未选择任何类目
                    page.getCategoryList({
                        index: 0,
                        container: _this
                    });
                } else {
                    if (data.level == 1) { //以及类目
                        page.getCategoryList({
                            index: 0,
                            container: _this,
                            callback: function () {
                                _this.find('select').eq(0).find('option[value="' + data.id + '"]').attr('selected', true)
                            }
                        });
                        page.getCategoryList({
                            index: 1,
                            container: _this,
                            pid: data.id
                        });
                    } else if (data.level == 2) { //二级类目
                        page.getCategoryList({
                            index: 0,
                            container: _this,
                            callback: function () {
                                _this.find('select').eq(0).find('option[value="' + data.parent1 + '"]').attr('selected', true)
                            }
                        });
                        page.getCategoryList({
                            index: 1,
                            container: _this,
                            pid: data.parent1,
                            callback: function () {
                                _this.find('select').eq(1).find('option[value="' + data.id + '"]').attr('selected', true)
                            }
                        });
                        page.getCategoryList({
                            index: 2,
                            container: _this,
                            pid: data.id
                        });

                    } else if (data.level == 3) {    //三级类目
                        page.getCategoryList({
                            index: 0,
                            container: _this,
                            callback: function () {
                                _this.find('select').eq(0).find('option[value="' + data.parent1 + '"]').attr('selected', true)
                            }
                        });
                        page.getCategoryList({
                            index: 1,
                            container: _this,
                            pid: data.parent1,
                            callback: function () {
                                _this.find('select').eq(1).find('option[value="' + data.parent2 + '"]').attr('selected', true)
                            }
                        });
                        page.getCategoryList({
                            index: 2,
                            container: _this,
                            pid: data.parent2,
                            callback: function () {
                                _this.find('select').eq(2).find('option[value="' + data.id + '"]').attr('selected', true)
                            }
                        });
                    }
                }
            });

            /*优惠券使用场景*/
            $(document.body).on("change", ".scopeChannel [name='scopeChannel']", function () {
                //2、3、5 含有门店pos的需要选择门店
                var _type = +$(this).val();
                if (_type === 2 || _type === 3 || _type === 5) {
                    $(".scopeChannelOptions").show();
                } else {
                    $(".scopeChannelOptions").hide();
                }
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
            $(document.body).on('click', '.ticket-box .close', function () {
                var item = $(this).parent();
                item.remove();
                page.calcVoucherMoney();  //计算礼包优惠券总金额
            });

            /*input失去焦点，计算礼包优惠券总金额*/
            $(document.body).on('blur', ':text', function () {
                page.calcVoucherMoney();  //计算礼包优惠券总金额
            });

            /*全选*/
            $(document.body).on('change', '.checkAll', function () {
                var _this = $(this), _target = _this.closest('.shop-list').find('.list');
                if (_this.is('.checkShop')) {
                    _target = _this.closest('.shop-list').find('.list');
                } else if (_this.is('.checkBrand')) {
                    _target = _this.closest('.brand-list').find('.list');
                }
                if (_this.is(':checked')) {
                    _target.find(':checkbox:enabled').attr('checked', true);
                } else {
                    _target.find(':checkbox:enabled').attr('checked', false);
                }
            });

            /*优惠券适用范围
             * 0=不限，1=指定条件
             * */
            $(document.body).on("change", ".applyType :radio", function () {
                var _this = $(this), applyType = +_this.val();
                var _container = _this.closest('.ticket-box').find('.applyTypeContainer');
                if (applyType === 4) {
                    _container.show();
                } else {
                    _container.hide();
                }
            });

            /*落地类型*/
            $(document.body).on('change', 'select[name="landingType"]', function () {
                var _this = $(this), _thisVal = +_this.val();
                var _container = _this.closest('.ticket-box').find('.landingContainer');
                if (_thisVal === 0) {
                    _container.hide();
                } else {
                    _container.show();
                }
            });

            /*改变类目id*/
            $(document.body).on('change', '.categoryCon select', function () {
                var _this = $(this), thisVal = _this.val(), index = _this.index();
                _this.closest('.categoryCon').find('select:gt("' + index + '")').find('option:gt(0)').remove();
                if (!thisVal || index === 2) return false;
                page.getCategoryList({
                    index: index + 1,
                    container: _this.closest('.categoryCon'),
                    pid: +thisVal
                });
            });


        },
        /*获取门店列表*/
        getShopList: function () {
            var c = page.info;
            var apiURL = '/app/coupon/shop/list.do';
            Matrix.JSON({
                type: 'post',
                url: c.vm.rootPath + apiURL,
                val: {
                    provinceId: $("#prv").val(),    //省ID
                    cityId: $("#city").val(),     //市ID
                    areaId: $("#area").val()   //区县ID
                },
                fun: function (res) {
                    var data = res;
                    var arr = [];
                    if (data.length) {
                        arr.push('<div class="options"><label class="notepad-inline"><input class="checkAll checkShop" type="checkbox"> 全选</label></div>');
                        arr.push('<div class="list">');
                        $.each(data, function (i, v) {
                            arr.push('<label class="notepad-inline"><input type="checkbox" value="' + v.shopId + '">' + v.shopName + '</label>');
                        });
                        arr.push('</div>');
                    } else {
                        arr.push('<label class="notepad-inline">该区域暂无门店!</label>');
                    }
                    $('.shop-list').empty().append(arr.join(''));
                }
            });
        },
        /*获取类目列表*/
        getCategoryList: function (args) {
            var c = page.info;
            var apiURL = '/category/list.do';

            var params = typeof args === 'undefined' ? {} : args;
            var _container = params.container;
            Matrix.JSON({
                type: 'post',
                url: c.vm.rootPath + apiURL,
                val: typeof params.pid === 'undefined' ? {} : {pid: params.pid},
                fun: function (res) {
                    var data = res;
                    console.log(_container)
                    if (data.length) {
                        var levelArr = ['一', '二', '三'], char = levelArr[params.index];
                        var arr = [];
                        arr.push('<option value="">请选择' + char + '级类目</option>');
                        $.each(data, function (i, v) {
                            arr.push('<option value="' + v.id + '">' + v.name + '</option>');
                        });
                        _container.find('.cate-list select').eq(params.index).empty().append(arr.join(''));
                    } else {
                        console.log('获取类目失败！');
                    }

                    params.callback && params.callback();

                }
            });
        },
        /*获取品牌列表*/
        getBrandList: function () {
            var c = page.info;
            var apiURL = '/app/coupon/brand/list.do';
            Matrix.JSON({
                type: 'post',
                url: c.vm.rootPath + apiURL,
                val: {scopeChannel: $('[name="scopeChannel"]').val()},
                fun: function (res) {
                    var data = res;
                    var arr = [];
                    if (data.length) {
                        arr.push('<div class="options"><label class="notepad-inline"><input class="checkAll checkBrand" type="checkbox"> 全选</label></div>');
                        arr.push('<div class="list">');
                        $.each(data, function (i, v) {
                            arr.push('<label class="notepad-inline"><input type="checkbox" value="' + v.id + '">' + v.name + '</label>');
                        });
                        arr.push('</div>');
                    } else {
                        arr.push('<label class="notepad-inline">获取品牌列表失败!</label>');
                    }
                    $('.brand-list').empty().append(arr.join(''));

                    /*选中checkbox*/
                    $.each($('.brand-list'), function () {
                        var _this = $(this), ids = _this.data('ids') + '';
                        if (!ids) return false;
                        var idsArr = ids.split(',');
                        for (var i in idsArr) {
                            _this.find(':checkbox[value="' + idsArr[i] + '"]').attr('checked', true);
                        }
                    });
                }
            });
        },
        /*增加品牌、类目组合*/
        addApplyItem: function () {
            var c = page.info;
            var _container = $(this).closest('.applyTypeContainer'), tpl = _container.find('.item').eq(0).clone();
            var index = _container.find('.item').length;
            tpl.prepend('<a href="javascript:;" class="close">x</a>');     //增加关闭按钮
            _container.find('.item-list').append(tpl[0].outerHTML);
            /*重置*/
            var _box = _container.find('.item').eq(index);
            _box.find(':text').attr('value', '');
            _box.find(':checkbox').attr('checked', false);
        },
        /*增加优惠券模板*/
        addTpl: function () {
            var c = page.info;
            var index = $('.ticket-box').length;
            var tpl = $('.ticket-box').eq(0).clone();

            /*删除item-list*/
            tpl.find('.applyTypeContainer .item').not(':first').remove();

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

            tpl.prepend('<a href="javascript:;" class="close">x</a>');     //增加关闭按钮
            $('.voucher-list').append(tpl[0].outerHTML);

            /*重置*/
            var _box = $('.voucher-list .ticket-box').eq(index);
            _box.find(':text').attr('value', '');
            _box.find(':checkbox').attr('checked', false);
            $.each(_box.find('.controls'), function () {
                $(this).find(':radio').eq(0).trigger('click');
            });
            _box.find(".voucherLimitDay").show();
            _box.find('.voucherDelayDay,.applyTypeContainer,.landingContainer').hide();

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
                var _this = $(this), this_val = $.trim(_this.val());
                var tips = _this.data('tips') || _this.closest('.control-group').find('.control-label').text().replace(/[*：:]/g, '');

                /*特殊处理*/
                if (_this.is('.money')) {
                    if (!_this.parent().find(':radio').is(':checked')) {
                        return true; //跳过
                    }
                }

                if (_this.is('.voucherName')) {
                    if (/<|>/g.test(this_val)) {
                        Toast.show(tips + '不允许输入特殊字符！');
                        _this.focus();
                        return check_res = false;
                    }
                }
                if (_this.is('.amount')) {
                    if (+this_val > 99999) {
                        Toast.show(tips + '面额最大只能输入99999！');
                        _this.focus();
                        return check_res = false;
                    }
                }

                /*领取量不得大于发行量*/
                if (_this.is('.limitCount')) {
                    if (+this_val > +$("#groupVoucherCount").val()) {
                        Toast.show('用户可领取份数不得大于发行量');
                        _this.focus();
                        return check_res = false;
                    }
                }


                /*通用处理*/
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

            /*校验商品类目是否有重合*/
            if (check_res) {
                $.each($('.ticket-box'), function () {
                    var _this = $(this), index = _this.index(), hash = [];
                    if (_this.find('.applyType :radio:checked').val() == 4) {

                        if (!$.trim(_this.find('[name="applyValue"]').val())) {
                            $.each(_this.find('.item'), function () {
                                var _that = $(this), thatIndex = _that.index();
                                if (!_that.find('.cate-list select:eq(0)').val() && !_that.find('.brand-list :checkbox:checked').length) {
                                    Toast.show('第' + (index + 1) + '个优惠券模板中第' + (thatIndex + 1) + '个组合中未选择任何类目或品牌！');
                                    return check_res = false;
                                }
                            });
                        }

                        /* $.each(_this.find('.cate-list select'), function () {
                         var _val = $(this).val();
                         if (_val) {
                         if (hash[_val]) {
                         Toast.show('第' + (index + 1) + '个优惠券模板中类目选择有重合，请确认后重新选择！');
                         return check_res = false;
                         } else {
                         hash[_val] = _val;
                         }
                         }
                         });*/

                        _this.find('.cate-list').map(function(){
                            var _val = $.map($(this).find('select'),function(v){
                                return $(v).val()
                            }).join('-');

                            if (_val) {
                                if (hash[_val]) {
                                    Toast.show('第' + (index + 1) + '个优惠券模板中类目选择有重合，请确认后重新选择！');
                                    return check_res = false;
                                } else {
                                    hash[_val] = _val;
                                }
                            }
                        })
                    }

                    return check_res;

                });
            }

            /*校验输入商品id的格式*/
            if (check_res) {
                var apply_value = $('textarea[name="applyValue"]:visible');
                $.each(apply_value, function () {
                    var _this = $(this);
                    if (_this[0] && $.trim(_this.val()) && !/^\d+(,\d+)*$/gi.test(_this.val())) {
                        Toast.show('请输入正确的格式');
                        _this.focus();
                        return check_res = false;
                    }
                });
            }


            return check_res;
        },
        /*获取表单数据*/
        getFormData: function () {
            var c = page.info;

            var extData = {},  //data_ext:扩展数据，根据优惠券类型不同，最终提交的表单数据结构也不同
                baseData = {
                    "type": c.voucherType, //0=单面额券，1=组券，3=卡券
                    "name": $.trim($('.voucherName').val()), //名称
                    "publishTimeType": +$('[name="grantType"]:checked').val(), //发行时间类型：0=不限，1=固定时间
                    "circulation": +$('[name="groupVoucherCount"]').val(), //发行量
                    "perLimit": +$('.limitCount').val(), //每人限领
                };

            /*发行时间为固定时间区间*/
            if (baseData.publishTimeType === 1) {
                baseData.publishStartTime = +new Date($('.grantBeginTime').val().replace(/-/g, '/'));  //开始发券时间，时间戳
                baseData.publishEndTime = +new Date($('.grantEndTime').val().replace(/-/g, '/'));   //结束发券时间，时间戳
            }


            /*优惠券类型*/
            switch (c.voucherType) {
                case 0:
                case 1:   //优惠券相同数据部分

                    extData = {
                        scopeShopList: [], //适用的POS门店ID列表
                        "groupUnits": [],
                        "userType": +$('[name="userType"]:checked').val(), //可领取用户身份，0=全部，1=老用户，2=新用户
                        "useWithGroupPro": $('[name="useWithGroupPro"]').is(":checked") ? true : false, //是否能与集团促销叠加
                        "costChargedType": +$('[name="voucherCost"]:checked').val() //成本承担方：0=好孩子集团，1=妈妈好
                    };

                    //优惠券使用场景
                    extData.scopeChannel = $.trim($('[name="scopeChannel"]').val());

                    if (/^[2,3,5]{1}$/.test(extData.scopeChannel)) {
                        /*适用的POS门店ID列表*/
                        var shopLists = $('.scopeChannelOptions .list :checkbox:checked');
                        $.each(shopLists, function () {
                            extData.scopeShopList.push($(this).val());
                        });
                    }

                    /*优惠券设置*/
                    $.each($('.ticket-box'), function () {
                        var _this = $(this);
                        var itemData = {
                            "denominationAmount": _this.find('.amount').val() * 100, //面额（分）
                            "discountType": +_this.find('.discountType :radio:checked').val(), //优惠券面额类型，0=优惠券，1=代金券
                            "scope": +_this.find('.applyType :radio:checked').val(), //使用范围：0=不限，4=指定条件
                            "scopeDesc": $.trim(_this.find('.applyText').val()), //适用范围文案
                            "landingType": +_this.find('select[name="landingType"]').val(), //落地类型
                            "effectiveType": +_this.find('.voucherValidType :radio:checked').val(), //生效类型：0=固定日期内，1=周期
                        };

                        if (itemData.discountType === 0) {      //优惠券面额类型，0=优惠券，1=代金券
                            itemData.consumptionAmount = _this.find('.money').val() * 100; //消费额
                        }

                        if (itemData.landingType !== 0) { //落地类型
                            itemData.landingDesc = $.trim(_this.find('.landingDesc').val());      //落地文案
                            itemData.landingDetail = $.trim(_this.find('.landingDetail').val());    //落地详情
                        }

                        if (itemData.effectiveType === 0) {      //固定日期内
                            itemData.effectiveStartTime = +new Date(_this.find('.voucherBeginDay').val().replace(/-/g, '/'));    //有效期开始，时间戳
                            itemData.effectiveEndTime = +new Date(_this.find('.voucherEndDay').val().replace(/-/g, '/'));     //有效期结束，时间戳
                        } else {  //周期
                            itemData.effectiveDelayDays = +_this.find('#voucherDelayDay').val();   //延后天数
                        }

                        /*选择使用范围*/
                        if (itemData.scope === 4) {
                            //0=不限，4=指定条件

                            itemData.cbList = [];  //指定类目及品牌
                            $.each(_this.find('.applyTypeContainer .item'), function (i, v) {
                                var _this = $(this);

                                var cbItem = {
                                    "brandIdList": (function () {        //品牌列表
                                        var arr = [];
                                        $.each(_this.find('.brand-list .list :checkbox:checked'), function () {
                                            arr.push($(this).val());
                                        });
                                        return arr;
                                    })()
                                };

                                //选择类目
                                var categoryArr = [];
                                $.each(_this.find('.categoryCon select'), function () {
                                    var thisVal = $(this).val();
                                    if (thisVal) {
                                        categoryArr.push(thisVal);
                                    }
                                });

                                if (categoryArr.length) {
                                    if (categoryArr.length > 1) {
                                        cbItem.parentCategory1 = categoryArr[0];
                                    }
                                    if (categoryArr.length > 2) {
                                        cbItem.parentCategory2 = categoryArr[1];
                                    }
                                    cbItem.categoryId = categoryArr[categoryArr.length - 1];  //取最后一级类目的id
                                    cbItem.categoryLevel = categoryArr.length;  //类目级别，默认为0
                                }

                                /*如果类目和品牌均没有选，则跳过*/
                                if (!cbItem.brandIdList.length && !cbItem.categoryLevel) {
                                    return true;
                                }

                                itemData.cbList.push(cbItem);
                            });

                            //指定商品
                            var pds = _this.find('textarea[name="applyValue"]').val();
                            if ($.trim(pds)) {
                                itemData.styleNumIdList = pds.split(',');
                            }
                        }

                        extData.groupUnits.push(itemData);
                    });

                    break;
                case 3:   //卡券数据
                    extData = {
                        "cardTitle": $.trim($('.mainTitle').val()),  //卡券主标题
                        "cardSubTitle": $.trim($('.subTitle').val()),  //卡券副标题
                        "cardDetailDesc": $.trim($('.detailDesc').val()), //卡券详细描述
                        "cardTicketId": $.trim($('.ticketId').val()), //卡券规则编码
                        "groupUnits": []
                    };

                    var itemData = {
                        "scopeDesc": $.trim($('.applyText').val()), //适用范围文案
                        "effectiveType": +$('[name="voucherValidType"]:checked').val(), //生效类型：0=固定日期内，1=周期
                    };

                    if (itemData.effectiveType === 0) {      //固定日期内
                        itemData.effectiveStartTime = +new Date($('.voucherBeginDay').val().replace(/-/g, '/'));    //有效期开始，时间戳
                        itemData.effectiveEndTime = +new Date($('.voucherEndDay').val().replace(/-/g, '/'));     //有效期结束，时间戳
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

            //console.log(JSON.stringify(data));
            //return
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
