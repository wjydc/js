/*
 * 安全购banner配置
 * by xqs
 * 20151231
 * */

;
(function () {
    var page = {
        ele: {
            doc: $(document.body),
            modal: $('#js-banner-pop'), //模态框
            address: $(".js-address"),
            areaList: $(".js-address-list"),
            selectCity: $(".js-select-city")
        },
        info: {
            vm: VM,
            uploadImgSize: [628, 200], //图片上传默认限制尺寸
            api: {
                'saveBannerConf': '/purchase/baseConf/saveBannerConf.do',
                'deleteBanner': '/purchase/baseConf/deleteBanner.do',
                'offLine': '/purchase/baseConf/offLine.do'
            },
            nolink: [1, 4, 6, 7]  //落地页
        },
        init: function () {
            var c = page.info, o = page.ele;
            o.doc.on('click', '.js-add', page.addBanner); //新建
            o.doc.on('click', '.js-edit', page.editBanner); //编辑
            o.doc.on('click', '.js-view', page.editBanner); //查看
            o.doc.on('click', '.js-submit', page.submit); //保存
            o.doc.on('click', '.js-del', page.del); //删除
            o.doc.on('click', '.js-offline', page.offline); //下线
            o.doc.on('change', '.js-ad-type', page.formScreening); //筛选广告类型
            o.doc.on('click', '.option input:checkbox', page.setStatus); //推荐对象
            o.doc.on('click', '.js-city-radio', page.selectArea); //选择地区

            // 选择落地类型;
            o.modal.on("change", "select[name=linkType]", page.selectLinkType);

            page.bindEvents();
        },
        bindEvents: function () {
            var c = page.info, o = page.ele;

            //文件上传
            $(".up-btn").each(function () {
                var c = page.info;
                var thas = $(this);
                thas.children().uploadify({
                    uploader: c.vm.rootPath + '/oss/uploadFiles.do',
                    swf: c.vm.rootPath + '/res/uploadify/uploadify.swf',
                    formData: {type: 4},
                    queueID: 'null', // 上传进度列表;
                    fileTypeDesc: "jpg",
                    fileTypeExts: '*.jpg;*.png', //控制可上传文件的扩展名，启用本项时需同时声明fileTypeDesc
                    multi: false,
                    wmode: "transparent",
                    buttonText: '选择图片',
                    width: "100%",
                    height: "100%",
                    onUploadStart: function () {
                    },
                    onUploadSuccess: function (file, data, response) {
                        //上传完成时触发（每个文件触发一次）;
                        //console.log([file,data,response]);
                        var data = JSON.parse(data), id = this.button.parents(".up-btn").data("id");
                        if (!data.success) {
                            Toast.show(data.msg);
                            $("#" + id + "-pic").html('<img src="' + c.vm.defaultPic + '"/>');
                        } else {
                            var img = new Image();
                            img.src = c.vm.imgpath + data.fileName;
                            // 不校验尺寸;

                            /*校验尺寸*/
                            img.onload = function () {
                                var _item = $("#" + id + "-pic").find('img');
                                var upload_size = thas.data('size');
                                upload_size = upload_size ? upload_size.split('x') : c.uploadImgSize ? c.uploadImgSize : null;
                                if (upload_size && (img.width != upload_size[0] || img.height != upload_size[1])) {
                                    var tips = '图片尺寸不符合要求，应该为' + upload_size[0] + 'px*' + upload_size[1] + 'px！';
                                    Toast.show(tips);
                                } else {
                                    _item.attr('src', img.src).data('src', data.fileName);
                                }
                            };
                        }
                    },
                    onSelectError: function (file, errorCode, errorMsg) {
                        if (errorCode == -100) {
                            Toast.show("上传的文件数量已经超出系统限制的文件！");
                            return false;
                        } else if (errorCode == -110) {
                            Toast.show("文件 [" + file.name + "] 大小超出系统限制的大小！");
                            return false;
                        } else if (errorCode == -120) {
                            Toast.show("文件 [" + file.name + "] 大小异常！");
                            return false;
                        } else {
                            Toast.show("文件 [" + file.name + "] 类型不正确！");
                            return false;
                        }

                    }
                });
            });

            // 选择推荐地区;
            Matrix.address.init({
                selects: ["prv", "city"],
                button: o.address,
                callblock: o.areaList,
                val: []
            });
        },
        formScreening: function () {
            var c = page.info, o = page.ele;
            var _this = $(this), _form = $('#frm');
            _form.find('input[name="valide"]').val(_this.val());
            _form.submit();
        },
        setStatus: function () {
            var c = page.info, o = page.ele;
            $.each(o.modal.find('.option'), function () {
                var _this = $(this), _checkbox = _this.find(':checkbox'), _target = _this.find('input:text');
                if (_checkbox.is(":checked")) {
                    _target.removeClass('unnecessary').attr('disabled', false);
                } else {
                    _target.addClass('unnecessary').attr('disabled', true);
                }
            });
        },
        selectArea: function () {
            var c = page.info, o = page.ele;
            var _this = $(this);
            if (_this.val() === 'true') {
                o.selectCity.hide();
            } else {
                o.selectCity.show();
            }
        },
        /*删除banner*/
        del: function () {
            var c = page.info, o = page.ele;
            var _this = $(this);
            if (confirm('确认要删除？')) {
                page.ajax({
                    url: 'deleteBanner',
                    data: {
                        bannerId: +_this.closest('tr').data('id')
                    },
                    success: function (res) {
                        console.log(res)
                        if (res.success) {
                            Toast.show({
                                template: '删除成功',
                                callback: page.refresh
                            });
                        } else {
                            Toast.show(res.msg);
                        }
                    }
                });
            }
        },
        /*下线banner*/
        offline: function () {
            var c = page.info, o = page.ele;
            var _this = $(this);
            if (confirm('确认要下线？')) {
                page.ajax({
                    url: 'offLine',
                    data: {
                        bannerId: +_this.closest('tr').data('id')
                    },
                    success: function (res) {
                        console.log(res)
                        if (res.success) {
                            Toast.show({
                                template: '下线成功',
                                callback: page.refresh
                            });
                        } else {
                            Toast.show(res.msg);
                        }
                    }
                });
            }
        },
        addBanner: function () {
            //if($("#bannerSize").val() >= 5){
            //   return Toast.show("最多只能发布5条Banner信息");
            //}
            var o = page.ele, c = page.info;
            var info = {
                title: "添加Banner",
                mode: 'addMode' //添加
            };
            page.showModal(info); 
        },
        editBanner: function () {
            var o = page.ele, c = page.info;
            var _this = $(this), index = _this.closest('tbody').find('tr').index(_this.closest('tr')), jsonData = JSON.parse(c.vm.jsonData);
            var info = {
                title: (_this.is('.js-view') ? "查看" : "编辑") + "Banner",
                mode: 'editMode', //编辑
                readonly: _this.is('.js-view'),
                data: jsonData[index]
            };


            page.showModal(info);

        },
        /*呼出模态框*/
        showModal: function (info) {
            var o = page.ele, c = page.info;
            var modal = o.modal;
            modal.find('.modal-header h3').text(info.title);
            if (info.mode === 'addMode') {
                modal.removeClass('editMode');
            } else {
                modal.removeClass('addMode');
            }

            modal.addClass(info.mode).modal('show');

            /*渲染数据*/
            if (info.data) {
                /*编辑*/
                console.log(JSON.stringify(info.data))
                modal.find(':radio').attr('disabled', false);  //先解除禁用，使其可以出发click事件
                var modalData = info.data;
                modal.data('info', modalData);

                $.each(modalData, function (i, v) {
                    modal.find('.' + i).val(v);
                    if (i === 'pic') {
                        /*图片*/
                        modal.find('.up-pic img').attr('src', c.vm.imgpath + v).data('src', v);
                    }

                    $('input:radio[name="' + i + '"][value="' + v + '"]').trigger('click');
                });
								// 落地;
								if(modalData.linkType != 1){
									$('.linkContainer').show();
								}

                /*推荐对象*/
                if (modalData.wantPregnent) {
                    modal.find('.pgWantPregnent').attr("checked", true);
                }else{
                    modal.find('.pgWantPregnent').attr("checked", false);
                }
								// console.log(modalData.pregnentBeginDays);
                //孕妈
                if (modalData.pregnentBeginDays != undefined){
                    modal.find('.pgPregnant').attr("checked", true);
                    var pgPregnant = modal.find('.js-pgPregnant');
                    var preAgeBegin = Matrix.DayToAge(modalData.pregnentBeginDays);
                    var preAgeEnd = Matrix.DayToAge(modalData.pregnentEndDays);
                    pgPregnant.find("input[data-name=BeginMs]").val(preAgeBegin.mm);
                    pgPregnant.find("input[data-name=EndMs]").val(preAgeEnd.mm);
                }
                //宝妈
                if (modalData.babyBeginDays != undefined) {
                    modal.find('.pgBaby').attr("checked", true);
                    var pgBaby = modal.find('.js-pgBaby');
                    var babyAgeBegin = Matrix.DayToAge(modalData.babyBeginDays);
                    var babyAgeEnd = Matrix.DayToAge(modalData.babyEndDays);
                    pgBaby.find("input[data-name=BeginYs]").val(babyAgeBegin.yy);
                    pgBaby.find("input[data-name=BeginMs]").val(babyAgeBegin.mm);
                    pgBaby.find("input[data-name=EndYs]").val(babyAgeEnd.yy);
                    pgBaby.find("input[data-name=EndMs]").val(babyAgeEnd.mm);
                }

                // 选择推荐地区;
                if (modalData.applyCityArea) {
                    var areaArr = [];
                    $.each(modalData.applyCityArea, function (i, v) {
                        if (v.cityNumId && v.cityName) {
                            areaArr.push('<span data-id="' + v.cityNumId + '">' + v.cityName + '<del>x</del></span>');
                        }
                    });
                    o.areaList.empty().append(areaArr.join(''));
                }


            } else {
                /*新增*/
                modal.find('form')[0].reset();
                modal.data('info', {});
                modal.find('.pgPregnant,.pgBaby').attr("checked", false);
                modal.find('[name="allCountry"][value="true"]').trigger('click');
                o.areaList.empty();
                /*图片*/
                $('.up-pic img').attr('src', c.vm.defaultPic);
            }


            /*readonly
             * $.each(info, function (i, v) {...}))操作的时候，未执行完时可能会已经触发disabled下面的代码
             * 导致trigger('click')无法执行
             * */
            if (info && info.readonly) {
                modal.addClass('readonly').find('.modal-body').find(':input,textarea').attr({
                    'readonly': true,
                    "disabled": true
                }).end().find('.btn').attr('disabled', true);
            } else {
                modal.removeClass('readonly').find('.modal-body').find(':input,textarea').attr({
                    'readonly': false,
                    "disabled": false
                }).end().find('.btn').attr('disabled', false);
            }


            /*设置input状态*/
            page.setStatus();

        },
        /*选择落地类型*/
        selectLinkType: function () {
            var c = page.info, o = page.ele;
            var _this = $(this), linkContainer = $('.linkContainer');
            if ($.inArray(+_this.val(), c.nolink) != -1) {
                linkContainer.hide();
            } else {
                linkContainer.show();
            }
        },
        /*表单校验*/
        validate: function (container) {
            var c = page.info, o = page.ele;
            var check_res = true;
            var _container = container;
            var _validate_ele = _container.find('input:text:visible,textarea:visible,select:visible').not('.unnecessary');
            $.each(_validate_ele, function () {
                var _this = $(this), this_val = _this.val();
                var tips = _this.closest('.control-group').find('.control-label').text().replace(/[*：:]/g, '');

                if (!$.trim(this_val)) {
                    if (!_this.is('.beginTime') && !_this.is('.endTime'))_this.focus();
                    Toast.show(tips + '不能为空！');
                    return check_res = false;
                }

                if (_this.data('type') === 'integer' && !/^\d*$/.test(this_val)) {
                    if (!_this.is('.beginTime') && !_this.is('.endTime'))_this.focus();
                    Toast.show(tips + '只允许输入正整数！');
                    return check_res = false;
                }

                if (_this.data('type') === 'CN' && !/^[\u4e00-\u9fa5]+$/.test(this_val)) {
                    if (!_this.is('.beginTime') && !_this.is('.endTime'))_this.focus();
                    Toast.show(tips + '只允许输入中文，不允许特殊字符！');
                    return check_res = false;
                }

            });

            /*如果表单元素校验通过，则继续校验图片数量*/
            if (check_res) {
                var _uploadImg = _container.find('.up-pic').not('.unnecessary');
                if (!_uploadImg.find('img').data('src')) {
                    var tips = _uploadImg.closest('.item').find('.h4').text().replace(/[*：:]/g, '');
                    Toast.show(tips + '图片不能为空！');
                    return check_res = false;
                }
            }

            if (check_res) {
                if(!$('.js-age-condition :checkbox:checked')[0]){
                    Toast.show('推荐对象不能为空！');
                    return check_res = false;
                }
            }

            return check_res;
        },
        submit: function () {
            var o = page.ele, c = page.info;
            var modal = o.modal, hasData = modal.data('info') || {};

            if (!page.validate(modal)) return false;   //校验

            var data = {
                "bannerId": hasData.bannerId || null,
                "bannerTitle": modal.find('.bannerTitle').val(),
                "pic": modal.find('.up-pic img').data('src'), // 图片
                "linkType": +modal.find('.linkType').val(), //1:无 2:商品id  3:url
                "linkTo": modal.find('.linkTo').val(), //1:空 2:商品id 3:url
                "beginTime": modal.find('.beginTime').val(),
                "endTime": modal.find('.endTime').val(),
                "wantPregnent": modal.find('.pgWantPregnent').is(':checked') ? true : false,      //true代表备孕  false代表没有选择备孕
                "pregnentBeginDays": null,
                "pregnentEndDays": null,
                "babyBeginDays": null,
                "babyEndDays": null,
                "babySex": 0, //0:不限 1:男 2:女
                "allCountry": modal.find('[name="allCountry"]:checked').val() === 'true' ? true : false, //true:全国 false：没有选择全国
                "areas": null,
                "orderBy": modal.find('[name="orderBy"]').val(),
            };
            //城市
            if (!data.allCountry) {
                data.areas = (function () {
                    var arr = [];
                    $.each(o.areaList.children(), function () {
                        arr.push({
                            cityNumId: $(this).data('id'),
                            cityName: $(this).text().replace(/x/, '')
                        });
                    });
                    return JSON.stringify(arr);
                })()
            }

            /*推荐对象*/
            //孕妈
            if (modal.find('.pgPregnant').is(':checked')) {
                var pgPregnant = modal.find('.js-pgPregnant');
                data.pregnentBeginDays = Matrix.AgeToDay({
                    mm: pgPregnant.find("input[data-name=BeginMs]")
                });
                data.pregnentEndDays = Matrix.AgeToDay({
                    mm: pgPregnant.find("input[data-name=EndMs]")
                });

                if(data.pregnentBeginDays >= data.pregnentEndDays){
                    return Toast.show('孕妈状态结束月份必须大于开始月份！');
                }

                if(data.pregnentEndDays > 300){
                    pgPregnant.find("input[data-name=EndMs]").focus();
                    return Toast.show('月份不能大于10！');
                }
            }
            //宝妈
            if (modal.find('.pgBaby').is(':checked')) {
                var pgBaby = modal.find('.js-pgBaby');
                data.babySex = +modal.find('.babySex').val();//0:不限 1:男 2:女
                data.babyBeginDays = Matrix.AgeToDay({
                    yy: pgBaby.find("input[data-name=BeginYs]"),
                    mm: pgBaby.find("input[data-name=BeginMs]")
                });
                data.babyEndDays = Matrix.AgeToDay({
                    yy: pgBaby.find("input[data-name=EndYs]"),
                    mm: pgBaby.find("input[data-name=EndMs]")
                });

                if(data.babyBeginDays >= data.babyEndDays){
                    return Toast.show('宝妈状态结束时间必须大于开始时间！');
                }

                if(pgBaby.find("input[data-name=BeginMs]").val() > 12){
                    pgBaby.find("input[data-name=BeginMs]").focus();
                    return Toast.show('月份不能大于12！');
                }
                if(pgBaby.find("input[data-name=EndMs]").val() > 12){
                    pgBaby.find("input[data-name=EndMs]").focus();
                    return Toast.show('月份不能大于12！');
                }
            }

            /*ajax*/
            page.ajax({
                url: 'saveBannerConf',
                data: data,
                success: function (res) {
                    console.log(res)
                    if (res.success) {
                        o.modal.modal('hide');
                        Toast.show({
                            template: '保存成功',
                            callback: page.refresh
                        });
                    } else {
                        Toast.show(res.msg);
                    }
                }
            });
        },
        ajax: function (params) {
            var c = page.info, o = page.ele;
            Matrix.JSON({
                url: c.vm.rootPath + c.api[params.url],
                val: params.data,
                type: 'POST',
                fun: function (res) {
                    //回调
                    if (params.success && typeof params.success === 'function') {
                        params.success.call(null, res);
                    }
                }
            });
        },
        refresh: function () {
            window.location.reload();
        }
    };

    page.init();

})();