/**
 *
 * @authors SDK (you@example.org)
 * @date    2016-12-12 11:44:58
 * @version $Id$
 */
;
(function() {
    var page = {
        config: {
            api: {
                save: root + '/monsp/cover/editCover.do'
            },
            pic_size: {
                backgroundImg: '889x1334',
                longImg: '540x180',
                circleImg: '110x110',
                titleText: '310x86'
            }
        },
        init: function() {
            var c = page.config;

            $(".up-btn").each(function() {
                var o = this,
                    thas = $(o),
                    thas_up_pic = thas.closest('.up-photo').children('.up-pic'),
                    thas_label = thas.closest('.control-group').children('.js-pic-size');
                img_type = thas_label.data('img-type');
                thas_up_pic.css('min-height', 0).css('min-height', thas_up_pic.height() + 'px'); // 使图片边框适配图片高度
                thas_label.append('(尺寸：' + c.pic_size[img_type].replace('x', '*') + 'px)'); // 显示提示图片大小的文案
                page.bindUpload(o); // 绑定图片上传
            });

            page.bindEvents();
        },
        bindEvents: function() {
            var c = page.config;

            $('#js-save').on('click', page.save);
            // 预览
            $(".js-cove-preview").on("click", page.preview);
        },
        save: function () {
            var data = {},
                access = true;

            var cdc_val = $('[name=countDownColor]').val();
            if (cdc_val) {
                if (/[0-9a-fA-F]{6}/.test(cdc_val)) {
                    data['countDownColor'] = cdc_val.toUpperCase();
                } else {
                    return Toast.show("请填写正确的颜色数值");
                }
            } else {
                return Toast.show("倒计时颜色不能为空");
            }
            $('.coverImg').each(function() {
                var thas = $(this),
                    c_name = thas.attr('name'),
                    c_val = thas.val();
                var alert_text = thas.closest('.control-group').find('.js-pic-size em').text();
                if (!c_val) {
                    Toast.show(alert_text + "不能为空");
                    access = false;
                    return false;
                }
                data[c_name] = c_val;
            });
            var cid = $('.coverId').val(),
                mealType = $('.mealType').val(),
                activityTime = $('.activityTime').val();
            access && Matrix.JSON({
                type: "POST",
                val: $.extend(data, {
                    id: cid,
                    mealType: mealType,
                    activityTime: activityTime
                }),
                url: root + '/monsp/cover/editCover.do',
                fun: function(data) {
                    if (data.success) {
                        Toast.show("操作成功");
                        setTimeout(function() {
                            location.href = root + "/monsp/cover/toCoverInfo.do?activityTime=" + activityTime;
                        }, 1000);
                    } else {
                        Toast.show(data.msg);
                    }
                }
            });
        },
        bindUpload: function(obj) {
            var c = page.config, thas = $(obj);
            thas.children().uploadify({
                uploader: root + '/oss/uploadFiles.do?type=15',
                swf: root + '/res/uploadify/uploadify.swf',
                queueID: 'null', // 上传进度列表;
                fileTypeDesc: "jpg",
                fileTypeExts: '*.jpg;*.png', //控制可上传文件的扩展名，启用本项时需同时声明fileTypeDesc
                multi: false,
                wmode: "transparent",
                buttonText: '选择图片',
                width: "100%",
                height: "100%",
                onUploadStart: function() {
                    var id = this.button.parents(".up-btn").data("id");
                    $("#" + id + "-pic").html('');
                },
                'overrideEvents': ['onSelectError', 'onDialogClose'],
                //返回一个错误，选择文件的时候触发
                onSelectError: function(file, errorCode, errorMsg) {
                    switch (errorCode) {
                        case -130:
                            alert("请上传jpg或者png格式的图片");
                            break;
                    }
                    return false;
                },
                onUploadSuccess: function(file, data, response) {
                    //上传完成时触发（每个文件触发一次）;
                    var data = JSON.parse(data),
                        id = this.button.parents(".up-btn").data("id");
                    if (!data.success) {
                        Toast.show(data.msg);
                        $("#" + id + "-pic").html('<img src="' + root + '/res/images/photo-default.png"/>');
                    } else {
                        var img = new Image();
                        img.src = "http://bgo.mamhao.cn/" + data.fileName;
                        var picSize = c.pic_size[thas.closest('.control-group').find('.js-pic-size').data('img-type')].split('x');
                        $(img).load(function() {
                            if (picSize[0] != this.width || picSize[1] != this.height) {
                                Toast.show("请上传正确尺寸的图片");
                                $("#" + id + "-hidden").val("");
                                $("#" + id + "-pic").html('<img src="' + root + '/res/images/photo-default.png"/>').css('min-height', '142px');
                            } else {
                                deleteFileByName($("#" + id + "-hidden").val());
                                $("#" + id + "-pic").html('<img src="http://bgo.mamhao.cn/' + data.fileName + '"/>').css('min-height', 0).css('min-height', $("#" + id + "-pic").height() + 'px');
                                $("#" + id + "-hidden").val(data.fileName);
                            }
                        });
                    }
                }
            });
        },
        // 预览
        preview: function () {
            var pop = $("#cover-preview-qrcode"), c = page.config;
            pop.modal();
            var url = root ? "http://m.mamhao.com/sale/cover/?" : "http://m.mamahao.com/sale/cover/?",
                params = {
                    login: VM.mealType == 0 ? false : true, // 登录状态
                    bg: $("#backgroundImg-pic img").attr("src"), // 背景图
                    long: $("#longImg-pic img").attr("src"),    // 长条图
                    title: $("#titleText-pic img").attr("src"), // 文字内容
                    circle: $("#circleImg-pic img").attr("src"), // 圆形图
                    color: $("input[name=countDownColor]").val()  // 倒计时色值
                };
            if(!c.oQRCode){
                c.oQRCode = new QRCode("qrcode", {
                    text : url + $.param(params),
                    width : 300,
                    height : 300
                });
            }else{
                c.oQRCode.clear();
                c.oQRCode.makeCode(url + $.param(params));
            }
        }
    }
    page.init();
})();