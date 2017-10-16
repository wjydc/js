$(function () {

    var page = {
        ele: {
            doc: $(document.body)
        },
        info: {
            vm: VM,
            chineseCharacter: ['一', '二', '三', '四', '五', '六', '七'],
            uploadImgSize: [800, 800]   //图片上传默认限制尺寸
        },
        init: function () {
            var o = page.ele, c = page.info;

            /*初始化数据*/
            page.data = $.extend({}, page.data, c.vm.data);
            console.table(c.vm.data);

            /*绑定页面事件*/
            page.bindEvents();
        },
        bindEvents: function () {
            var o = page.ele, c = page.info;

            /*是否显示相关联的容器*/
            o.doc.on('click', '.js-showItemSpec,.js-showItemInput,.js-showCustom,.js-showPostage', page.showContainer);

            /*定制组件*/
            o.doc.on('click', '.js-addCustom', page.addCustom);
            o.doc.on('click', '.js-editCustom', page.editCustom);
            o.doc.on('click', '.js-delCustom', page.delCustom);

            /*支持组件*/
            o.doc.on('click', '.js-addSupport', page.addSupport);
            o.doc.on('click', '.js-editSupport', page.editSupport);
            o.doc.on('click', '.js-delSupport', page.delSupport);
            /*规格相关的交互*/
            o.doc.on('click', '.js-addItemSpec', page.addItemSpec);
            o.doc.on('click', '.js-delItemSpec', page.delItemSpec);
            o.doc.on('click', '.js-delTplItemSpec', page.delTplItemSpec);
            o.doc.on('click', '.js-addSpec', page.addSpec);

            /*模态框确认保存*/
            o.doc.on('click', '.js-custom-submit', page.customSubmit);
            o.doc.on('click', '.js-support-submit', page.supportSubmit);

            /*提交保存*/
            o.doc.on('click', '.js-submit', page.submit);
            o.doc.on('click', '.js-back', page.back);

            // 删除图片
            $(".thumbnails").on("click", ".js-remove", page.removePic);

            //文件上传  商品主图,可上传多张
            $(".mult-up-btn").each(function () {
                var thas = $(this), $target = thas.closest('.controls').find('.up-load-img');
                thas.children().uploadify({
                    uploader: c.vm.rootPath + '/oss/uploadFiles.do',
                    formData:{type: 1},
                    swf: c.vm.rootPath + '/res/uploadify/uploadify.swf',
                    queueID: 'null', // 上传进度列表;
                    fileTypeDesc: "jpg",
                    fileTypeExts: '*.jpg;*.png', //控制可上传文件的扩展名，启用本项时需同时声明fileTypeDesc
                    multi: true,
                    queueSizeLimit: 5,
                    wmode: "transparent",
                    buttonText: '选择图片',
                    width: "100%",
                    height: "100%",
                    overrideEvents: ['onSelectError'],
                    onUploadStart: function (file) {
                        // 进行中;
                        if ($target.find('li').length >= 5) {
                            Toast.show("最多只能上传5张图片");
                            thas.children().uploadify('cancel');
                        } else {
                            $target.append('<li data-index="' + file.index + '"></li>');
                        }
                    },
                    onUploadSuccess: function (file, data, response) {
                        //上传完成时触发（每个文件触发一次）;
                        var data = JSON.parse(data);
                        if (!data.success) {
                            Toast.show(data.msg || '上传失败');
                        } else {
                            var imgUrl = c.vm.imgpath + data.fileName;
                            var imgObj = new Image();     //校验图片尺寸
                            imgObj.src = imgUrl;
                            imgObj.onload = function () {
                                var $item = $target.find('li[data-index=' + file.index + ']');
                                var upload_size = thas.data('size');
                                upload_size = upload_size ? upload_size.split('x') : c.uploadImgSize;
                                if (imgObj.width != upload_size[0] || imgObj.height != upload_size[1]) {
                                    var tips = '图片尺寸不符合要求，应该为' + upload_size[0] + 'px*' + upload_size[1] + 'px！';
                                    Toast.show(tips);
                                    $item.fadeOut(function () {
                                        $item.remove();
                                    });
                                } else {
                                    var html = '<img alt="" src="' + imgUrl + '"><div class="actions"><a class="js-remove" href="javascript:;" fileName="' + data.fileName + '"><i class="icon-remove"></i></a></div>';
                                    $item.append(html);
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

        },
        /*删除商品图片*/
        removePic: function () {
            var o = page.ele, c = page.info;
            var $this = $(this), $target = $this.closest('li');
            var fileName = $this.attr("fileName");
            if (!fileName) return false;
            if ($this.closest('.up-load-img').hasClass('custom')) {
                var styleId = $this.data('style-id');
                styleId && page.data.deleteStyleIds.push(styleId);
                page.data.deleteStyleImgs.push(fileName);
            }
            $target.fadeOut(function () {
                $target.remove();
            });

            /*
             //临时移出dom节点
             Matrix.JSON({
             url: c.vm.rootPath + "/oss/deleteFileByName.do",
             val: {"fileName": fileName},
             fun: function (res) {
             if (res.success) {
             $target.remove();
             Toast.show("删除成功");
             } else {
             Toast.show(res.msg || '删除失败');
             }
             }
             });
             */
        },
        /*是否显示相关联的容器*/
        showContainer: function () {
            var $this = $(this), $container = $($this.data('target'));
            //console.log($this.val())
            var signature = $container.is('.showPostageContainer') ? 'false' : 'true';
            if ($this.val() == signature) {
                $container.removeClass('hidden');
            } else {
                $container.addClass('hidden');
            }
        },
        /*显示定制组件*/
        showCustom: function () {
            var $this = $(this), $container = $('.showCustomContainer,.checkCustomContainer');
            if ($this.val() == 'true') {
                $container.removeClass('hidden');
            } else {
                $container.addClass('hidden');
            }
        },
        /*是否增加商品规格*/
        showItemSpec: function () {
            var $this = $(this), $container = $('.showItemSpecContainer');
            if ($this.val() == 'true') {
                $container.removeClass('hidden');
            } else {
                $container.addClass('hidden');
            }
        },
        /*是否增加用户文本输入框*/
        showItemInput: function () {
            var $this = $(this), $container = $('.showItemInputContainer');
            if ($this.val() == 'true') {
                $container.removeClass('hidden');
            } else {
                $container.addClass('hidden');
            }
        },
        /*添加定制组件*/
        addCustom: function () {
            page.showCustomModal();
        },
        /*编辑定制组件*/
        editCustom: function () {
            var index = page.currCustomIndex = $(this).closest('.item').index();
            var args = {
                data: page.data.planCustomCompoents[index],
                readonly: $(this).is('.viewCustom')
            };
            page.showCustomModal(args);
        },
        /*删除定制组件*/
        delCustom: function () {
            if (confirm('确认删除该组件？')) {
                var $item = $(this).closest('.item'), index = $item.index();
                page.data.planCustomCompoents.splice(index, 1); //删除该元素
                var itemId = $item.data('id');
                itemId && page.data.deleteCustomCompoentIds.push(itemId);
                $item.remove();
            }
        },
        /*添加支持组件*/
        addSupport: function () {
            page.showSupportModal();
        },
        /*编辑支持组件*/
        editSupport: function () {
            var index = page.currSupportIndex = $(this).closest('.item').index();
            var args = {
                data: page.data.planSupportCompoents[index],
                readonly: $(this).is('.viewSupport')
            };
            page.showSupportModal(args);
        },
        /*删除支持组件*/
        delSupport: function () {
            if (confirm('确认删除该组件？')) {
                var $item = $(this).closest('.item'), index = $item.index();
                page.data.planSupportCompoents.splice(index, 1); //删除该元素
                var itemId = $item.data('id');
                itemId && page.data.deleteSupportCompoentIds.push(itemId);
                $item.fadeOut(function () {
                    $item.remove();
                });
            }
        },
        /*支持组件中的规格交互*/
        addItemSpec: function () {
            var $this = $(this), $item = $this.closest('.item');
            if ($this.hasClass('disabled')) return false;
            var arr = [];
            arr.push('<li class="fl"><input class="key" type="text" value=""><input class="val" type="text" value="">');
            if ($item.index() === 0) {
                arr.push('<div class="option"><button type="button" class="btn btn-danger js-delItemSpec">删除</button></div>');
            }
            arr.push('</li>');
            $item.find('.context ul').append(arr.join(''));
        },
        delItemSpec: function () {
            var $this = $(this), $item = $this.closest('li');
            if ($this.hasClass('disabled')) return false;
            $item.fadeOut(function () {
                $item.remove();
            });
        },
        delTplItemSpec: function () {
            var $this = $(this), $item = $this.closest('.item');
            if ($this.hasClass('disabled')) return false;
            $item.fadeOut(function () {
                $item.remove();
                page.updateFirstItemStatus();
            });
        },
        addSpec: function () {
            var $this = $(this), $container = $('.spec-item-list');
            if ($this.hasClass('disabled')) return false;
            if ($container.find('.spec-item')[0]) {
                var $target = $container.find('.spec-item').eq(0);
                var $item = $target.clone().find('li .option').remove().end().find('.js-addItemSpec').remove().end().find('input.val').val('').end();
                $container.append($item);
            }
            page.updateFirstItemStatus();
        },
        /*第一个item按钮置灰处理*/
        updateFirstItemStatus: function () {
            var $item = $('.spec-item'), itemSize = $item.length, $first_item = $item.eq(0);
            var input_key = $item.find('input.key');
            if (itemSize > 1) {
                $first_item.find('.btn').not('.js-delTplItemSpec').addClass('disabled');
                input_key.attr('readonly', true);
            } else {
                $first_item.find('.btn').removeClass('disabled');
                input_key.attr('readonly', false);
            }
            $first_item.find('li').eq(0).find('.btn').addClass('disabled');
        },
        /*展示定制组件modal*/
        showCustomModal: function (args) {
            var o = page.ele, c = page.info;
            var $modal = $('#customModal');

            var info = args ? args.data : false;
            $modal.data('info', info);
            $modal.modal('show');

            /*modal_header*/
            var modal_header = info ? args.readonly ? '查看' : '编辑' : '添加';
            $modal.find('.modal-header h3').text(modal_header + '定制组件');

            /*渲染数据*/
            if (info) {   //编辑
                console.log(JSON.stringify(info))
                $modal.find(':radio').attr('disabled',false);  //先解除禁用，使其可以出发click事件
                $.each(info, function (i, v) {
                    if (i == 'customPrice') v = v / 100;   //价格
                    $('input:text[name="' + i + '"]').val(v);
                    $('textarea[name="' + i + '"]').val(v);
                    $('input:radio[name="' + i + '"][value="' + v + '"]').trigger('click');
                });

                /*样式图片*/
                if (info.styles.length) {
                    var imgArr = [];
                    $.each(info.styles, function (i, v) {
                        imgArr.push('<li><img src="' + c.vm.imgpath + v.stylePic + '">');
                        imgArr.push('<div class="actions"><a class=" js-remove" href="javascript:;" filename="' + v.stylePic + '" data-style-id="' + v.styleId + '">');
                        imgArr.push('<i class="icon-remove"></i></a></div></li>');
                    });
                    $modal.find('.up-load-img').empty().append(imgArr.join(''));
                } else {
                    $modal.find('.up-load-img').empty();
                }
            } else {
                $modal.find('form')[0].reset();
                $modal.find('.up-load-img').empty();
            }

            /*readonly
            * $.each(info, function (i, v) {...}))操作的时候，未执行完时可能会已经触发disabled下面的代码
            * 导致trigger('click')无法执行
            * */
            if (args && args.readonly) {
                $modal.addClass('readonly').find('.modal-body').find(':input,textarea').attr({
                    'readonly': true,
                    "disabled": true
                }).end().find('.btn').attr('disabled', true);
            } else {
                $modal.removeClass('readonly').find('.modal-body').find(':input,textarea').attr({
                    'readonly': false,
                    "disabled": false
                }).end().find('.btn').attr('disabled', false);
            }

        },
        /*展示支持组件modal*/
        showSupportModal: function (args) {
            var o = page.ele, c = page.info;
            var $modal = $('#supportModal');

            var info = args ? args.data : false;
            $modal.data('info', info);
            $modal.modal('show');

            /*modal_header*/
            var modal_header = info ? args.readonly ? '查看' : '编辑' : '添加';
            $modal.find('.modal-header h3').text(modal_header + '支持组件');

            /*渲染数据*/
            var $specContainer = $('.spec-item-list');
            if (info) {     //编辑
                console.log(JSON.stringify(info))
                $modal.find(':radio').attr('disabled',false);  //先解除禁用，使其可以出发click事件
                $.each(info, function (i, v) {
                    if (i == 'supportPrice' || i == 'postageFee') v = v / 100;   //价格
                    $('input:text[name="' + i + '"]').val(v);
                    $('textarea[name="' + i + '"]').val(v);
                    $('input:radio[name="' + i + '"][value="' + v + '"]').trigger('click');
                });

                /*样式图片*/
                if (info.compoentPics) {
                    var imgArr = [];
                    $.each(info.compoentPics.split(','), function (i, v) {
                        imgArr.push('<li><img src="' + c.vm.imgpath + v + '">');
                        imgArr.push('<div class="actions"><a class="js-remove" href="javascript:;" filename="' + v + '">');
                        imgArr.push('<i class="icon-remove"></i></a></div></li>');
                    });
                    $modal.find('.up-load-img').empty().append(imgArr.join(''));
                } else {
                    $modal.find('.up-load-img').empty();
                }

                /*规格*/
                typeof info.specJson == 'string' && (info.specJson = JSON.parse(info.specJson));    //转json
                console.table(info.specJson)
                if (info.specJson.length) {
                    var specArr = [];
                    $.each(info.specJson, function (i, v) {
                        specArr.push('<div class="item spec-item"><div class="context">');
                        specArr.push('<ul class="clearfix">');
                        $.each(v.spec, function (m, n) {
                            specArr.push('<li class="fl"><input class="key" type="text" value="' + n.key + '"><input class="val" type="text" value="' + n.value + '">');
                            if (i === 0) {
                                specArr.push('<div class="option"><button type="button" class="btn btn-danger js-delItemSpec">删除</button></div>');
                            }
                            specArr.push('</li>');
                        });
                        specArr.push('</ul></div>');
                        specArr.push('<div class="item-option">');
                        if (i === 0) {
                            specArr.push('<button type="button" class="btn btn-success js-addItemSpec">添加</button>');
                        }
                        specArr.push('<button type="button" class="btn btn-danger js-delTplItemSpec">删除</button>');
                        specArr.push('</div></div>');
                    });
                    $specContainer.empty().append(specArr.join(''));
                }


            } else {
                /*初始化modal*/
                $modal.find('form')[0].reset();
                $modal.find('.up-load-img').empty();

                var specArr = [];
                specArr.push('<div class="item spec-item"><div class="context"><ul class="clearfix">');
                specArr.push('<li class="fl"><input class="key" type="text" value=""><input class="val" type="text" value="">');
                specArr.push('<div class="option"><button type="button" class="btn btn-danger js-delItemSpec disabled">删除</button></div></li></ul></div>');
                specArr.push('<div class="item-option"><button type="button" class="btn btn-success js-addItemSpec">添加</button>');
                specArr.push('<button type="button" class="btn btn-danger js-delTplItemSpec">删除</button></div></div>');
                $specContainer.empty().append(specArr.join(''));
            }

            /*readonly*/
            if (args && args.readonly) {
                $modal.addClass('readonly').find('.modal-body').find(':input,textarea').attr({
                    'readonly': true,
                    "disabled": true
                }).end().find('.btn').attr('disabled', true);
            } else {
                $modal.removeClass('readonly').find('.modal-body').find(':input,textarea').attr({
                    'readonly': false,
                    "disabled": false
                }).end().find('.btn').attr('disabled', false);
                page.updateFirstItemStatus();
            }
        },
        /*表单校验*/
        validate: function (container) {
            var check_res = true;
            var $container = container || $('#plan-form');
            var $validate_ele = $container.find('input:text:visible,textarea:visible').not('.unnecessary');
            $.each($validate_ele, function () {
                var $this = $(this), this_val = $this.val();
                var tips = $this.closest('.control-group').find('.control-label').text().replace(/[*：:]/g, '');
                if (!$.trim(this_val)) {
                    $this.focus();
                    Toast.show(tips + '不能为空！');
                    return check_res = false;
                }

                if ($this.data('type') === 'integer' && !/^[1-9]\d*$/.test(this_val)) {
                    $this.focus();
                    Toast.show(tips + '只允许输入正整数！');
                    return check_res = false;
                }

                if ($this.data('type') === 'CN' && !/^[\u4e00-\u9fa5]+$/.test(this_val)) {
                    $this.focus();
                    Toast.show(tips + '只允许输入中文，不允许特殊字符！');
                    return check_res = false;
                }

            });

            /*如果表单元素校验通过，则继续校验图片数量*/
            if(check_res){
                var $uploadImg = $container.find('.up-load-img').not('.unnecessary');
                if ($uploadImg[0] && !$uploadImg.children()[0]) {
                    var tips = $uploadImg.closest('.control-group').find('.control-label').text().replace(/[*：:]/g, '');
                    Toast.show(tips + '不能为空！');
                    return check_res = false;
                }
            }

            return check_res;
        },
        /*定制组件弹出层保存*/
        customSubmit: function () {
            var o = page.ele, c = page.info;
            var $modal = $('#customModal');

            if (!page.validate($modal)) return false;   //校验

            var hasData = $modal.data('info') || {};     //编辑或添加

            var modalInfo = {
                "customCompoentId": hasData.customCompoentId || '',    //定制组件编号
                "planId": page.data.planId || '',    //众筹计划编号
                //"customType": hasData.customType || '', //定制类型 （0： 我要刻字组件 1 ： 配件组件） /*暂时注释掉*/
                "customName": $modal.find('[name="customName"]').val(), //组件名称
                "desc": $modal.find('[name="desc"]').val(),//描述信息
                "styles": [], //样式图
                "showInput": $modal.find('[name="showInput"]:checked').val() == 'true' ? true : false, //是否显示输入框
                "limitWordNum": $modal.find('[name="limitWordNum"]').val(), //字数限制
                "customPrice": $modal.find('[name="customPrice"]').val() * 100 //定制价格 （分）
            };

            /*校验是否有同名定制组件*/
            var planCustomCompoentsLen = page.data.planCustomCompoents.length;
            if(planCustomCompoentsLen){
                for(var i = 0;i < planCustomCompoentsLen; i++){
                    var customObj = page.data.planCustomCompoents[i];
                    if(customObj.customName === modalInfo.customName){
                        $modal.find('[name="customName"]').focus();
                        Toast.show(modalInfo.customName + '已存在，不允许同名定制组件！');
                        return false;
                    }
                }
            }

            /*样式图片*/
            var $uploadImg = $modal.find('.up-load-img li');
            if ($uploadImg[0]) {
                $.each($uploadImg, function (i, v) {
                    var $this = $(this);
                    var styleItem = {
                        "styleId": hasData.styles && hasData.styles[i] && hasData.styles[i].styleId || '',
                        "customId": hasData.styles && hasData.styles[i] && hasData.styles[i].customId || '', //定制组件编号
                        "styleName": "样式" + c.chineseCharacter[i], //定制名称
                        "stylePic": $this.find('.js-remove').attr('filename'),
                        "createTime": hasData.styles && hasData.styles[i] && hasData.styles[i].createTime || ''
                    };
                    modalInfo.styles.push(styleItem);
                });
            }

            /*页面交互*/
            if ($modal.data('info')) {
                page.data.planCustomCompoents[page.currCustomIndex] = modalInfo; //修改

                var $item = $('.custom-item').eq(page.currCustomIndex);
                $item.find('.title').text(modalInfo.customName);
                $item.find('.price').text(modalInfo.customPrice / 100);
            } else {
                page.data.planCustomCompoents.push(modalInfo); //添加

                /*新插入一条*/
                var new_item = [];
                new_item.push('<div class="item custom-item" data-id="">');
                new_item.push('<div class="context">');
                new_item.push('<h4 class="title">' + modalInfo.customName + '</h4>');
                new_item.push('<p>定制价格：<strong>&yen;<span class="price">' + (modalInfo.customPrice / 100) + '</span>元</strong></p>');
                new_item.push('</div>');
                new_item.push('<div class="option">');
                new_item.push('<button type="button" class="btn btn-primary js-editCustom">编辑</button>');
                new_item.push('<button type="button" class="btn btn-danger js-delCustom">删除</button>');
                new_item.push('</div></div>');
                $('.custom-item-list').append(new_item.join(''));
            }

            $modal.modal('hide');
        },
        /*支持组件弹出层保存*/
        supportSubmit: function () {
            var o = page.ele, c = page.info;
            var $modal = $('#supportModal');

            if (!page.validate($modal)) return false;   //校验

            var hasData = $modal.data('info') || {};     //编辑或添加

            var modalInfo = {
                "supportCompoentId": hasData.supportCompoentId || '', //支持组件编号
                "planId": page.data.planId || '', //众筹计划编号
                "compoentDes": $modal.find('[name="compoentDes"]').val(), //支持组件文字描述
                "compoentType": $modal.find('[name="compoentType"]:checked').val(), // 支持类型 1：定制 2：抽奖 3：无偿（无偿的用户可以输入价格）
                "supportPrice": $modal.find('[name="supportPrice"]').val() * 100,     //支持金额（分）
                "limitPeopleNumberForBoolean": hasData.limitPeopleNumberForBoolean || true,  //是否限制人数
                "limitPeopleNumber": $modal.find('[name="limitPeopleNumber"]').val(),   //限制人数
                "postageFeeForBoolean": $modal.find('[name="postageFeeForBoolean"]:checked').val() == 'true' ? true : false,   //是否包邮
                "postageFee": $modal.find('[name="postageFee"]').val() * 100, //邮费（分）
                "itemSpecForBoolean": $modal.find('[name="itemSpecForBoolean"]:checked').val() == 'true' ? true : false, //是否增加商品规格
                "deliveryDelay": $modal.find('[name="deliveryDelay"]').val(), //发货时间在众筹成功多少天内
                "customCompoentForBoolean": hasData.customCompoentForBoolean || true, //是否有自定义组件
                "compoentPics": "", //支持组件描述图例，英文逗号分隔
                "specJson": "" //规格json
            };

            /*图片*/

            var $uploadImg = $modal.find('.up-load-img li');
            if ($uploadImg[0]) {
                var picArr = [];
                $.each($uploadImg, function (i, v) {
                    var $this = $(this);
                    picArr.push($this.find('.js-remove').attr('filename'));
                });
                modalInfo.compoentPics = picArr.join(',');
            }

            /*规格*/
            var specItems = $('.spec-item');
            var specArr = [];
            if (specItems[0] && modalInfo.itemSpecForBoolean) {
                $.each(specItems, function () {
                    var specItem = {"spec": []};
                    var $this = $(this);
                    $.each($this.find('.context ul li'), function (m, n) {
                        var $that = $(this);
                        var spec = {
                            "key": $.trim($that.find('input').eq(0).val()),
                            "value": $.trim($that.find('input').eq(1).val())
                        };
                        specItem.spec.push(spec);
                    });
                    specArr.push(specItem);
                });

            }
            modalInfo.specJson = JSON.stringify(specArr); //转成字符串存储

            var imgSrc = modalInfo.compoentPics.split(',')[0];  //第一张图片
            if ($modal.data('info')) {
                page.data.planSupportCompoents[page.currSupportIndex] = modalInfo; //修改

                var $item = $('.support-item').eq(page.currSupportIndex);
                $item.find('.title').text(modalInfo.compoentDes);
                $item.find('.price').text(modalInfo.supportPrice / 100);
                var imgObj = $item.find('.img-list img');
                if (imgObj[0]) {
                    imgObj.attr('src', c.vm.imgpath + imgSrc);
                } else {
                    var imgDom = '<img src="' + c.vm.imgpath + imgSrc + '" alt="">';
                    $item.find('.img-list').append(imgDom);
                }
            } else {
                page.data.planSupportCompoents.push(modalInfo);  //添加

                /*新插入一条*/
                var ifShowClass = $('.js-showCustom:checked').val() == 'true' ? '' : 'hidden';
                var new_item = [];
                new_item.push('<div class="item support-item" data-id="">');
                new_item.push('<div class="context">');
                new_item.push('<h4 class="title">' + modalInfo.compoentDes + '</h4>');
                new_item.push('<div class="img-list">');
                if (imgSrc) {
                    new_item.push('<img src="' + c.vm.imgpath + imgSrc + '" alt="">');
                }
                new_item.push('</div>');
                new_item.push('<p>支持：<strong>&yen;<span class="price">' + (modalInfo.supportPrice / 100) + '</span></strong></p>');
                new_item.push('</div>');
                new_item.push('<div class="option">');
                new_item.push('<button type="button" class="btn btn-primary js-editSupport">编辑</button>');
                new_item.push('<button type="button" class="btn btn-danger js-delSupport">删除</button>');
                new_item.push('<label class="dib ml1x checkCustomContainer ' + ifShowClass + '">');
                new_item.push('<input class="js-checkCustom" type="checkbox" name="customCompoentForBoolean">增加专属定制</label>');
                new_item.push('</div></div>');
                $('.support-item-list').append(new_item.join(''));
            }
            console.log('modalInfo', modalInfo)
            $modal.modal('hide');

        },
        /*提交*/
        submit: function () {
            var o = page.ele, c = page.info;

            /*处理主图*/
            var picArr = [];
            $.each($('#plan-form').find('.up-load-img li'), function () {
                var $this = $(this);
                picArr.push($this.find('.js-remove').attr('filename'));
            });
            page.data.planPics = picArr.join(',');

            /*单独处理支持组件中的是否选中专属定制选项*/
            $.each($('.support-item'), function (i, v) {
                var $this = $(this);
                var $checkbox = $this.find('[name="customCompoentForBoolean"]');
                var bool = $checkbox.is(':checked') ? true : false;
                page.data.planSupportCompoents[i].customCompoentForBoolean = bool;
            });

            /*一些input、textarea等表单元素*/
            page.extra = {
                "planGoodsTitle": $('[name="planGoodsTitle"]').val(), //商品标题
                "planGoodsDesc": $('[name="planGoodsDesc"]').val(), //商品简介
                "showPriceForBoolean": $('[name="showPrice"]:checked').val() == 'true' ? true : false, //是否显示价格1:显示 0：不显示
                "planPrice": $('[name="planPrice"]').val() * 100, //众筹价格（分）
                "martketPrice": $('[name="martketPrice"]').val() * 100, //市场价格（分）
                "planAllPrice": $('[name="planAllPrice"]').val() * 100, //众筹总金额（分）
                "planDays": $('[name="planDays"]').val(), //众筹天数
                "planGoodsDescHtml": $('[name="planGoodsDescHtml"]').val(),//图文详情的Html
                "customForBoolean": $('[name="customForBoolean"]:checked').val() == 'true' ? true : false, //是否专属定制
                "planRiskInfo": (function () {
                    var arr = [];
                    $.each($('.planRiskInfo p'), function () {
                        arr.push($(this).text());
                    });
                    return arr.join(String.fromCharCode(10));
                })() //定制商品风险说明
            };

            /*最终提交的ajax数据*/
            page.data = $.extend({}, page.data, page.extra);
            console.log(JSON.stringify(page.data))

            /*校验*/
            if (!page.validate()) return false;

            /*提交*/
            Matrix.JSON({
				showLoad: true,
                url: c.vm.rootPath + "/plan/goods/save.do",
                type: "POST",
                val: {
                    planStr: JSON.stringify(page.data),  //planJSONStr(众筹商品大json)
                    deleteStyleIds: page.data.deleteStyleIds.join(','),   //删除的自定义样式id，多个逗号分隔
                    deleteStyleImgs: page.data.deleteStyleImgs.join(','),  //删除的自定义样式物理图片名称，多个逗号分隔
                    deleteCustomCompoentIds: page.data.deleteCustomCompoentIds.join(','),  //删除的自定义组件ID，多个逗号分隔
                    deleteSupportCompoentIds: page.data.deleteSupportCompoentIds.join(',')  //删除的支持组件ID，多个逗号分隔
                },
                fun: function (res) {
                    if (res.success) {
                        Toast.show({
                            "template": "保存成功",
                            callback: function () {
                                var redirectURL = c.vm.rootPath + '/plan/goods/index.do';
                                if (page.data.choiceForBoolean) {
                                    redirectURL += '?choiceForBoolean=true';
                                }
                                location.href = redirectURL;
                            }
                        });
                    } else {
                        Toast.show(res.msg || '保存失败');
                    }
                }
            });


        },
        back: function () {
            window.history.go(-1);
        },
        data: {
            "planId": '',  //众筹编号（添加则不需要此属性）
            "planOnlineTime": '', //计划上架时间
            "planCreateTime": '', //众筹创建时间
            "planPics": "", //众筹主图，英文逗号分隔
            "planCompleteTime": '', //众筹完成时间
            "planGoodsHtmlUrl": '', //阿里云的链接
            "planPeoPleTotal": '', //已筹集总人数
            "planMoneyTotal": 0, //已筹集总金额
            "choiceForBoolean": false, //是否精选
            "priority": 1, //排序字段，
            "planCustomCompoents": [],       //定制组件
            "planSupportCompoents": [],       //支持组件
            "planStatus": 0, //
            "delForBoolean": false,
            "deleteStyleIds": [], //定制组件中的样式图片删除后的id保存
            "deleteStyleImgs": [], //定制组件中的样式图片删除后的文件名保存
            "deleteCustomCompoentIds": [],  //删除的自定义组件ID
            "deleteSupportCompoentIds": []  //删除的支持组件ID
        }
    };

    page.init();

});