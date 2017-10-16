/**
 * 自定义编辑器相关内容
 */
(function (window, $) {
    // 自定义插件 #1
    KindEditor.lang({
        Video: '插入视频',
        commodity : '插入商品',
        youku: '插入外部视频'
    });
    // 插入商品;
    KindEditor.plugin('commodity', function(K) {
        var self = this, name = 'commodity';
        self.clickToolbar(name, function() {
            var dialog = K.dialog({
                width : 500,
                title : '插入商品',
                body : '<div class="add-items"><input type="text" placeholder="请输入商品ID" autofocus maxlength="9" class="js-items-id"></div>',
                closeBtn : {
                    name : '关闭',
                    click : function(e) {
                        dialog.remove();
                    }
                },
                yesBtn : {
                    name : '确定',
                    click : function(e) {
                        var d = $(dialog.bodyDiv[0]), input = d.find(".js-items-id");
                        var _val = $.trim(input.val());
                        if(!/^\d+$/.test(_val)){
                            Toast.show("商品ID只能为数字！");
                            input.focus();
                            return false;
                        }

                        /*校验商品是否存在*/
                        Matrix.JSON({
                            url: VM.rootPath + '/appconf/getItemsByStyleNumId.do',
                            val: {styleNumId: _val},
                            fun: function(res){
                                if(res.success){
                                    if(res.count){
                                        Toast.show('添加商品成功！');
                                        self.insertHtml('<img class="ke-items" src="http://s.mamhao.cn/admin/editor/items.png" alt="' + _val + '">');
                                        dialog.remove();
                                    }else{
                                        Toast.show('该商品不存在！');
                                    }
                                }else{
                                    Toast.show(res.msg);
                                }
                            }
                        });

                    }
                },
                noBtn : {
                    name : '取消',
                    click : function(e) {
                        dialog.remove();
                    }
                }
            });
        });
    });
    // 插入外部视频
    KindEditor.plugin('youku', function(K) {
        var self = this, name = 'youku';
        self.clickToolbar(name, function() {
            var dialog = K.dialog({
                width : 500,
                title : '插入外部视频',
                body : '<div class="add-items"><input type="text" placeholder="外部视频链接地址" autofocus maxlength="500" class="js-youku-link span5"></div>',
                closeBtn : {
                    name : '关闭',
                    click : function(e) {
                        dialog.remove();
                    }
                },
                yesBtn : {
                    name : '确定',
                    click : function(e) {
                        var d = $(dialog.bodyDiv[0]), input = d.find(".js-youku-link");
                        var _val = $.trim(input.val());
                        if(_val.indexOf("iframe") == -1){
                            input.focus();
                            return Toast.show('请插入正确的外部视频链接地址');
                        }
                        self.insertHtml('<p class="u-video-youku">' + _val + '</p>');
                        dialog.remove();
                        Toast.show('添加成功！');
                    }
                },
                noBtn : {
                    name : '取消',
                    click : function(e) {
                        dialog.remove();
                    }
                }
            });
        });
    });
    // 插入视频
    KindEditor.plugin('Video', function(K) {
        var self = this, name = 'Video';
        self.clickToolbar(name, function() {
            //editor.insertHtml('<div>111</div>');
            $("#js-video-name").html('未选择视频文件');
            $(".js-video-schedule").html('');
            $(".js-insert-code").removeData("val");
            $('#up-video').modal();

        });
    });

// 选择视频文件
    var UPVIDEO = $(".js-up-video").children();
    UPVIDEO.uploadify({
        uploader: root + '/oss/uploadFileNoSize.do',
        swf: root + '/res/uploadify/uploadify.swf',
        queueID: 'null', // 上传进度列表;
        fileTypeDesc: "mp4",
        fileTypeExts: '*.mp4;*.mp4;', //控制可上传文件的扩展名，启用本项时需同时声明fileTypeDesc
        multi: false,
        auto: false,
        wmode: "transparent",
        buttonText: '选择视频文件',
        width: "100%",
        height: "100%",
        overrideEvents: ['onSelectError', 'onDialogClose'],
        onSelect: function (file) {
            $("#js-video-name").html(file.name);
            $(".js-video-schedule").html('');
        },
        onUploadStart: function(file){
            //console.log(file.name)
            //console.log('onUploadStart');
        },
        onUploadProgress: function (file, bytesUploaded, bytesTotal) {
            var k = parseInt(bytesUploaded / bytesTotal * 100, 10);
            if(k == 100) k = 99;
            $(".js-video-schedule").html(k + "%");
        },
        onSelectError: function (file, errorCode, errorMsg) {
            //返回一个错误，选择文件的时候触发
            console.log('onSelectError');
            Toast.show("上传失败，请检查");
        },
        onUploadSuccess: function(file,data,response) {
            //上传完成时触发（每个文件触发一次）;
            console.log(file,data,response);
            if(response){
                var res = JSON.parse(data);
                $('.js-insert-code').data("val", res.fileName);
                $(".js-video-schedule").html("100%");
                //console.log(res.fileName);
            }
        }
    });
    // 开始上传
    $(".js-up-video-start").on("click", function () {
        UPVIDEO.uploadify('upload');
    });
    // 插入视频代码;
    $(".js-insert-code").on("click", function () {
        var src = $(this).data("val");
        if(src){
            editor.insertHtml('<div class="ke-video"><video preload="preload" controls="controls" class="js-video"><source src="http://v.mamahao.com/'+ src +'" type="video/mp4" ></video></div>');
            $('#up-video').modal('hide');
        }else{
            Toast.show("请先选择视频并上传视频");
        }
    });


    // 富文本编辑器
    var editor;
    KindEditor.ready(function (K) {
        editor = K.create('textarea[name=form-content]', {
            uploadJson: root + '/oss/uploadFiles4Editor.do?type=0',
            fileManagerJson: 'kindeditor/jsp/file_manager_json.jsp',
            width: 800,
            height: 500,
            allowFileManager: true,
            allowImageRemote: false,
            readonlyMode: false, // 页面只读
            items:[ 'source', 'undo', 'redo', '|', 'cut', 'copy', 'paste', '|', 'justifyleft', 'justifycenter', 'justifyright', 'justifyfull', 'insertorderedlist', 'insertunorderedlist', 'indent', 'outdent', 'clearhtml', 'quickformat', '|', 'fullscreen', '/', 'fontsize', 'forecolor', 'hilitecolor', 'bold', 'italic', 'underline', 'removeformat', '|', 'image', 'multiimage', 'table', 'link', 'unlink', 'commodity', 'youku', 'Video'],
            afterBlur: function () {
                this.sync();
            },
            afterCreate: function () {
                this.sync();
            }
        });
    });

})(window, jQuery);