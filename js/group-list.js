/*
* 群列表、添加、编辑、删除等群操作
* by xqs
* 20151222
* */
;
(function () {
    var page = {
        ele: {
            doc: $(document.body)
        },
        info: {
            vm: VM,
            uploadImgSize: null
        },
        init: function () {
            var o = page.ele, c = page.info;
            var zodiacArr = ["鼠","牛","虎","兔","龙","蛇","马","羊","猴","鸡","狗","猪"];

            /*events*/
            o.doc.on('click', '.js-add-group', page.addGroup);
            o.doc.on('click', '.js-edit-group', page.editGroup);
            o.doc.on('click', '.js-remove-group', page.removeGroup);
            o.doc.on('click', '.js-modal-submit', page.modalSubmit);
            o.doc.on('click','.js-sort',page.sort);

            getPrv(null, $("#prv,#modal-prv")); //省市区初始化
            /*生肖日期选择*/
            $('.datepicker').on('focus', function () {
                WdatePicker({
                    dateFmt:'yyyy',
                    onpicked: function (dp) {
                        var year = dp.cal.date.y;
                        if(year > 1900){
                            var index = (year-1900) % 12, zodiac = zodiacArr[index];
                            $('.zodiac').text(zodiac + '年');
                        }
                    },
                    oncleared: function () {
                        $('.zodiac').text('');
                    }
                })
            });

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
                        _target.empty().append('<li data-index="' + file.index + '"></li>');
                    },
                    onUploadSuccess: function (file, data, response) {
                        console.log(file,data)
                        //上传完成时触发（每个文件触发一次）;
                        var data = JSON.parse(data);
                        if (!data.success) {
                            Toast.show(data.msg || '上传失败');
                        } else {
                            var imgUrl = c.vm.topicImagePath + '0/' + data.fileName;
                            console.log(imgUrl)
                            var imgObj = new Image();     //校验图片尺寸
                            imgObj.src = imgUrl;
                            imgObj.onload = function () {
                                var _item = _target.find('li[data-index=' + file.index + ']');
                                var upload_size = thas.data('size');
                                upload_size = upload_size ? upload_size.split('x') : c.uploadImgSize ? c.uploadImgSize : null;
                                console.log(upload_size)
                                if (upload_size && (imgObj.width < upload_size[0] || imgObj.height < upload_size[1] || imgObj.height !== imgObj.width)) {
                                    var tips = '图片尺寸不符合要求，至少为' + upload_size[0] + 'px*' + upload_size[1] + 'px！';
                                    Toast.show(tips);
                                    _item.fadeOut(function () {
                                        _item.remove();
                                    });
                                } else {
                                    var html = '<img class="groupIcon uploaded" alt="group icon" src="' + imgUrl + '" data-filename="' + data.fileName + '">';
                                    _item.empty().append(html);
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
            var _this = $(this);
            var _form = $('#frm');
            _form.find('#sort').val(_this.data('sort'));
            _form.submit();
        },
        removeGroup: function () {
            var o = page.ele, c = page.info;
            if(confirm("确定要删除该群？")){
                var _this = $(this);
                var data = _this.closest('tr').data('info');
                page.ajax({
                    url: c.vm.rootPath + '/mmq/group/deleteGroup.do',
                    data: {groupId:data.groupId},
                    success: function (res) {
                        if(res.code === 0){
                            Toast.show({
                                template:'删除成功',
                                callback: page.refresh
                            });
                        }else{
                            Toast.show(res.message);
                        }
                    }
                });
            }
        },
        addGroup: function () {
            var o = page.ele, c = page.info;
            var info = {
                title: c.vm.isAuto ? '添加同城同龄自动加入群' : '添加推荐用户自主加入群',
                mode: 'addMode' //添加
            };
            page.showModal(info);
        },
        editGroup: function () {
            var o = page.ele, c = page.info;
            var _this = $(this);
            var info = {
                title: c.vm.isAuto ? '编辑同城同龄自动加入群' : '编辑推荐用户自主加入群',
                data: _this.closest('tr').data('info'),
                mode: 'editMode' //编辑
            };
            page.showModal(info);
        },
        showModal: function (info) {
            var o = page.ele, c = page.info;
            var modal = $('#groupModal');
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
                $.each(info.data, function (i, v) {
                    if (i === 'groupIcon') {
                        modal.find('.' + i).attr('src', c.vm.topicImagePath + '0/' + v).data('filename', v);
                    } else {
                        if(i === 'cityName'){
                            modal.find('#cityName').empty().append('<option selected>' + v + '</option>')
                        }
                        modal.find('.' + i).val(v);
                    }

                });

                if(c.vm.isAuto){
                    modal.find('.breedStep,.integralLevelLimit').attr('disabled',true);
                }else{
                    modal.find('.breedStep,.integralLevelLimit').attr('disabled',false);
                }

                $('#modal-prv,#modal-city').attr('disabled',true);
                modal.data('info', info.data);
            } else {
                /*新增*/
                modal.find('form')[0].reset();
                modal.data('info', {});
                modal.find('.groupIcon').attr('src', c.vm.topicImagePath + '0/' + c.vm.defaultGroupIcon).data('filename', c.vm.defaultGroupIcon);
                modal.find('.breedStep,.integralLevelLimit').attr('disabled',false);
                $('#modal-prv,#modal-city').attr('disabled',false);
            }
        },
        modalSubmit: function () {
            var o = page.ele, c = page.info;
            var modal = $('#groupModal'), hasData
                = modal.data('info') || {};

            if (!page.validate(modal)) return false;   //校验

            var data = {
                "groupName": modal.find('.groupName').val(),
                "groupDesc": modal.find('.groupDesc').val(),
                "groupIcon": modal.find('.groupIcon').data('filename'),
                "breedStep": modal.find('.breedStep').val(),
                "integralLevelLimit": modal.find('.integralLevelLimit').val(),
                "proviceId": modal.find('.proviceId').val(),
                "cityId": modal.find('.cityId').val() || hasData.cityId,
                "isAuto": c.vm.isAuto,
                "platformType": modal.find('#platformType').val()
            };
            if(isForm.isCheck(data.groupDesc)){
              modal.find('.groupDesc').focus();
              return Toast.show('群简介中有无法识别的字符');  
            }
            data = $.extend({}, hasData, data);
            console.log(data)
            page.ajax({
                url: c.vm.rootPath + '/mmq/group/' + (modal.hasClass('editMode') ? 'updateGroup.do' : 'addGroup.do'),
                data: data,
                success: function (res) {
                    if(res.code === 0){
                        Toast.show({
                            template:'保存成功',
                            callback: page.refresh
                        });
                    }else{
                        Toast.show(res.message);
                    }
                }
            });
        },
        /*表单校验*/
        validate: function (container) {
            var check_res = true;
            var _container = container;
            var _validate_ele = _container.find('input:text:visible,textarea:visible,select:visible').not('.unnecessary');
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
                if (_uploadImg[0] && !_uploadImg.children()[0]) {
                    var tips = _uploadImg.closest('.control-group').find('.control-label').text().replace(/[*：:]/g, '');
                    Toast.show(tips + '不能为空！');
                    return check_res = false;
                }
            }

            return check_res;
        },
        ajax: function (params) {
            Matrix.JSON({
                url: params.url,
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