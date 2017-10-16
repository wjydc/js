/*
* 话题列表、添加、编辑、删除等话题操作
* by xqs
* 20151222
* */
;(function () {
    var page = {
        ele: {
            doc: $(document.body)
        },
        info: {
            vm: VM,
            uploadImgSize: null,
            api: {
                "addTopic": "/mmq/topic/addTopic.do",   //添加话题
                "updateTopic": "/mmq/topic/updateTopic.do",   //更新话题内容
                "delTopic": "/mmq/topic/batchDeleteTopic.do",  //删除话题
                "topicDetail": "/mmq/topic/editTopic.do",   //获取话题详情
                "batchUpdateTopic": "/mmq/topic/batchUpdateTopic.do",   //批量审核
            }
        },
        init: function () {
            var o = page.ele, c = page.info;
            o.doc.on('click', '.js-sort', page.sort); //排序
            o.doc.on('click', '.js-set-top,.js-cancel-top', page.setOrCancelTop); //设置或取消置顶
            o.doc.on('click', '.js-set-recommend,.js-cancel-recommend', page.setOrCancelRecommend); //设置或取消推荐
            o.doc.on('click', '.js-del,.js-del-batch', page.delTopic);  //删除、批量删除话题
            o.doc.on('click', '.js-add', page.addTopic); //添加话题
            o.doc.on('click', '.js-edit', page.editTopic);   //编辑话题
            o.doc.on('click', '.js-modal-submit', page.modalSubmit); //保存模态框话题内容
            o.doc.on('click', '.js-allow,.js-refuse', page.checkTopic); //审核（不）通过

            // 删除图片
            $(".thumbnails").on("click", ".js-remove", page.removePic);

            page.uploadFile();   //上传图片操作
        },
        /*删除商品图片*/
        removePic: function () {
            var o = page.ele, c = page.info;
            var _this = $(this), _target = _this.closest('li');
            _target.fadeOut(function () {
                _target.remove();
            });
        },
        uploadFile: function () {
            var o = page.ele, c = page.info;
            //文件上传
            $(".mult-up-btn").each(function () {
                var thas = $(this), _target = thas.closest('.controls').find('.up-load-img');
                thas.children().uploadify({
                    uploader: c.vm.rootPath + '/oss/uploadTopicFiles.do',
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
                        if (_target.find('li').length >= 18) {
                            Toast.show("最多只能上传18张图片");
                            thas.children().uploadify('cancel');
                        } else {
                            _target.append('<li data-index="' + file.index + '"></li>');
                        }
                    },
                    onUploadSuccess: function (file, data, response) {
                        //上传完成时触发（每个文件触发一次）;
                        var data = JSON.parse(data);
                        if (!data.success) {
                            Toast.show(data.msg || '上传失败');
                        } else {
                            var imgUrl = c.vm.topicImagePath + '0/' + data.fileName;
                            var imgObj = new Image();     //校验图片尺寸
                            imgObj.src = imgUrl;
                            imgObj.onload = function () {
                                var _item = _target.find('li[data-index=' + file.index + ']');
                                var upload_size = thas.data('size');
                                upload_size = upload_size ? upload_size.split('x') : c.uploadImgSize ? c.uploadImgSize : null;
                                if (upload_size && (imgObj.width < upload_size[0] || imgObj.height < upload_size[1])) {
                                    var tips = '图片尺寸不符合要求，应该为' + upload_size[0] + 'px*' + upload_size[1] + 'px！';
                                    Toast.show(tips);
                                    _item.fadeOut(function () {
                                        _item.remove();
                                    });
                                } else {
                                    var html = '<img alt="topic image" src="' + imgUrl + '"><div class="actions"><a class="js-remove" href="javascript:;" fileName="' + data.fileName + '"><i class="icon-remove"></i></a></div>';
                                    _item.append(html);
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
        sort: function () {
            var o = page.ele, c = page.info;
            var _this = $(this);
            var _form = $('#frm');
            if (c.vm.sort === 1) {
                c.vm.sort = 0;
            } else {
                c.vm.sort = 1;
            }
            _form.find('#sortType').val(_this.data('sort-type'));
            _form.find('#sort').val(c.vm.sort);
            _form.submit();
        },
        setOrCancelTop: function () {
            var o = page.ele, c = page.info;
            var _this = $(this), _topic = _this.closest('tr');
            var data = {
                "topicId": _topic.data('id'),
                "topicIsHost": _this.is('.js-set-top') ? 1 : 0,
                "topicType": c.vm.topicType
            };
            if(data.topicIsHost === 1){
                data.operType = 1;
            }
            page.ajax({
                url: 'updateTopic',
                data: data,
                success: function (res) {
                    if (res.success === 1) {
                        Toast.show({
                            template: (_this.is('.js-set-top') ? '设置' : '取消') + '置顶成功',
                            callback: page.refresh
                        });
                    } else {
                        Toast.show(res.msg);
                    }
                }
            });
        },
        /*设置或取消推荐*/
        setOrCancelRecommend: function () {
            var o = page.ele, c = page.info;
            var _this = $(this), _topic = _this.closest('tr');
            var data = {
                "topicId": _topic.data('id'),
                "recommend": _this.is('.js-set-recommend') ? 1 : 0,
                "topicType": c.vm.topicType
            };
            if(data.recommend === 1){
                data.operType = 2;
            }
            page.ajax({
                url: 'updateTopic',
                data: data,
                success: function (res) {
                    if (res.success === 1) {
                        Toast.show({
                            template: (_this.is('.js-set-recommend') ? '设置' : '取消') + '推荐成功',
                            callback: page.refresh
                        });
                    } else {
                        Toast.show(res.msg);
                    }
                }
            });
        },
        /*审核话题*/
        checkTopic: function () {
            var _this = $(this), _topList = $('.topic-list');
            var info = {
                tips: '设置成功',
                data: {
                    topicIds: (function () {
                        var arr = [];
                        $.each(_topList.find(':checkbox:checked'), function () {
                            arr.push($(this).closest('tr').data('id'));
                        });
                        return arr.join(',');
                    })()
                }
            }
            if (_this.is('.js-refuse')) {
                info.data.status = 2; //审核不通过
            } else if (_this.is('.js-allow')) {
                info.data.status = 1; //审核通过
            }
            page.ajax({
                url: 'batchUpdateTopic',
                data: info.data,
                success: function (res) {
                    if (res.success === 1) {
                        Toast.show({
                            template: info.tips,
                            callback: page.refresh
                        });
                    } else {
                        Toast.show(res.msg);
                    }
                }
            });

        },
        delTopic: function () {
            var o = page.ele, c = page.info;
            var _this = $(this), _topic = _this.closest('tr');
            var arr = [];
            if (_this.is('.js-del')) {
                arr.push(_topic.data('id'));
            } else {
                var itemArr = _this.closest('.widget-content').find('.tab-pane :checkbox:checked').closest('tr');
                $.each(itemArr, function () {
                    arr.push($(this).data('id'));
                });
            }
            page.ajax({
                url: 'delTopic',
                data: {
                    "topicIds": arr.join(',')
                },
                success: function (res) {
                    if (res.success === 1) {
                        Toast.show({
                            template: '删除话题成功',
                            callback: page.refresh
                        });
                    } else {
                        Toast.show(res.msg);
                    }
                }
            });
        },
        addTopic: function () {
            var o = page.ele, c = page.info;
            var info = {
                title: "添加话题",
                mode: 'addMode' //添加
            };
            page.showModal(info);
        },
        editTopic: function () {
            var o = page.ele, c = page.info;
            var _this = $(this);
            var info = {
                title: "编辑话题",
                mode: 'editMode' //编辑
            };

            /*获取话题详情json数据*/
            page.ajax({
                url: 'topicDetail',
                data: {
                    topicId: _this.closest('tr').data('id')
                },
                success: function (res) {
                    info.data = res;
                    page.showModal(info);
                }
            });

        },
        showModal: function (info) {
            var o = page.ele, c = page.info;
            var modal = $('#topicModal');
            modal.find('.modal-header h3').text(info.title);
            if (info.mode === 'addMode') {
                modal.removeClass('editMode');
            } else {
                modal.removeClass('editMode');
            }

            modal.addClass(info.mode).modal('show');

            if (info.data) {
                /*编辑*/
                console.log(info.data)
                var modalData = info.data;
                modal.data('info', modalData);

                $.each(modalData, function (i, v) {
                    modal.find('.' + i).val(v);
                    $('input:radio[name="' + i + '"][value="' + v + '"]').trigger('click');
                });

                /*图片*/
                if (modalData.picsList && modalData.picsList.length) {
                    var imgArr = [];
                    $.each(modalData.picsList, function (i, v) {
                        imgArr.push('<li><img src="' + c.vm.topicImagePath + '0/' + v.pic + '">');
                        imgArr.push('<div class="actions"><a class="js-remove" href="javascript:;" filename="' + v.pic + '">');
                        imgArr.push('<i class="icon-remove"></i></a></div></li>');
                    });
                    modal.find('.up-load-img').empty().append(imgArr.join(''));
                } else {
                    modal.find('.up-load-img').empty();
                }

            } else {
                /*新增*/
                modal.find('form')[0].reset();
                modal.data('info', {});
                modal.find('.up-load-img').empty();
            }

        },
        modalSubmit: function () {
            var o = page.ele, c = page.info;
            var modal = $('#topicModal'), hasData = modal.data('info') || {};

            if (!page.validate(modal)) return false;   //校验

            var data = {
                topicTitle: modal.find('[name="topicTitle"]').val(), //话题名称
                channelId: modal.find('[name="channelId"]').val(),  //频道ID
                content: modal.find('[name="firstTopicComment"]').val(),   // 文字描述
                thumbnail: '',    // 缩略图
                topicIsHost: modal.find('[name="hot"]:checked').val(),  // 是否置顶   默认为0 不置顶  1 置顶
                topicIsPush: modal.find('[name="topicPush"]:checked').val(),   //  是否推送   默认为0 不推送  1 推送
            };

            /*置顶*/
            if(data.topicIsHost == 1){
                data.operType = 1;
            }

            /*图片*/
            var uploadImg = modal.find('.up-load-img li');
            if (uploadImg[0]) {
                var picArr = [];
                $.each(uploadImg, function (i, v) {
                    var _this = $(this);
                    picArr.push(_this.find('.js-remove').attr('filename'));
                });
                data.thumbnail = picArr.join(',');
            }

            data = $.extend({}, hasData, data);
            page.ajax({
                url: modal.hasClass('editMode') ? 'updateTopic' : 'addTopic',
                data: data,
                success: function (res) {
                    if (res.success === 1) {
                        Toast.show({
                            template: "保存成功",
                            callback: page.refresh
                        });
                    } else {
                        Toast.show(res.msg);
                    }
                }
            });
        },
        /*表单校验*/
        validate: function (container) {
            var o = page.ele, c = page.info;
            var check_res = true;
            var _container = container;
            var _validate_ele = _container.find('input:text:visible,textarea:visible').not('.unnecessary');
            $.each(_validate_ele, function () {
                var _this = $(this), this_val = _this.val();
                var tips = _this.closest('.control-group').find('.control-label').text().replace(/[*：:]/g, '');
                if (!$.trim(this_val)) {
                    _this.focus();
                    Toast.show(tips + '不能为空！');
                    return check_res = false;
                }

                if (_this.data('type') === 'integer' && !/^[1-9]\d*$/.test(this_val)) {
                    _this.focus();
                    Toast.show(tips + '只允许输入正整数！');
                    return check_res = false;
                }

                if (_this.data('type') === 'CN' && !/^[\u4e00-\u9fa5]+$/.test(this_val)) {
                    _this.focus();
                    Toast.show(tips + '只允许输入中文，不允许特殊字符！');
                    return check_res = false;
                }

            });

            /*如果表单元素校验通过，则继续校验图片数量*/
            if (check_res) {
                var _uploadImg = _container.find('.up-load-img').not('.unnecessary');
                var firstTopicComment = _container.find('.firstTopicComment').val();
                if (!$.trim(firstTopicComment) && _uploadImg[0] && !_uploadImg.children()[0]) {
                    var tips = _uploadImg.closest('.control-group').find('.control-label').text().replace(/[*：:]/g, '');
                    Toast.show(tips + '和话题文字不能全为空！');
                    return check_res = false;
                }
            }

            return check_res;
        },
        ajax: function (params) {
            var o = page.ele, c = page.info;
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
