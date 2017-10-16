/*
 * 妈妈圈 频道管理
 * by wml
 * 20151223
 */
;(function() {
  var page = {
    config: {
      vm: VM,
      api: {
        addChannel: VM.rootPath + '/mmq/channels/addChannels.do', //添加频道
        // deleteChannel: VM.rootPath + '/mmq/channels/delChannels.do',
        // batchDelteteChannel: VM.rootPath + '/mmq/channels/batchDeleteChannelsByChannelId.do',
        updateChannelInfo: VM.rootPath + '/mmq/channels/updateChannels.do', //修改频道信息 修改信息及状态
        modifyChannelSort: VM.rootPath + '/mmq/channels/updateChannelsInfo.do', //修改频道排序
        getChannelInfo: VM.rootPath + '/mmq/channels/editChannels.do' //根据id获取频道信息
      }
    },
    ele: {
      doc: $(document.body),
      modal: $('#channelModal')
    },
    init: function() {
      var o = page.ele,
        c = page.config;
      //o.doc.on('click', '#checkAll', page.checkAll);  //绑定全选
      o.doc.on('click', '#js-add', function() { //绑定顶部添加按钮
        page.cleanModal();
        o.modal.modal('show');
      });
      o.doc.on('click', '.js-sort', function() { //绑定排序筛选
        var sortType = $(this).data('sort-type'),
          up = $(this).data('up');
        $('#sortType').val(sortType);
        $('#sort').val(up);
        $("#searchFrm").submit();
      });
      o.doc.on('click', '.js-edit', page.showChannel); //绑定编辑按钮
      o.doc.on('click', '.js-open', function() {
        var _this = $(this);
        page.modifyChannelStatus(_this.closest('tr').data('channel-id'), 1);
      });
      o.doc.on('click', '.js-close', function() {
        var _this = $(this);
        page.modifyChannelStatus(_this.closest('tr').data('channel-id'), 0);
      });

      o.doc.on('blur', '.js-order', page.modifySortSubmit); //绑定修改排序
      o.doc.on('click', '#js-save', page.addSubmit); //绑定弹窗提交按钮
      var oldImgUrl;
      //图片上传工具
      $(".up-btn").each(function() {
        var thas = $(this);
        thas.children().uploadify({
          uploader: c.vm.rootPath + '/oss/uploadTopicFiles.do',
          swf: c.vm.rootPath + '/res/uploadify/uploadify.swf',
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
            if ($("#" + id + "-pic").find('img').length) {
              oldImgUrl = $("#" + id + "-pic").find('img').attr('src');
              $("#" + id + "-pic").html('');
            }
          },
          onUploadSuccess: function(file, data, response) {
            //上传完成时触发（每个文件触发一次）;
            var data = JSON.parse(data),
              id = this.button.parents(".up-btn").data("id");
            if (!data.success) {
              Toast.show(data.msg);
              $("#" + id + "-pic").html('<img src=' + c.vm.rootPath + '"/res/images/photo-default.png"/>');
            } else {
              var imgUrl = c.vm.topicImagePath + '0/' + data.fileName;
              var imgObj = new Image(); //校验图片尺寸
              imgObj.src = imgUrl;
              imgObj.onload = function() {
                if (imgObj.width < 150 || imgObj.height < 150) {
                  $("#" + id + "-pic").html('<img src="' + oldImgUrl + '"/>');
                  var tips = '图片尺寸不符合要求，请上传至少150px*150px的图片！';
                  Toast.show(tips);
                } else {
                  $("#" + id + "-pic").html('<img src="' + c.vm.topicImagePath + '0/' + data.fileName + '"/>');
                  $("#" + id + "-hidden").val(data.fileName);
                }
              };

            }
          }
        });
      });
    },
    /*清空表单*/
    cleanModal: function() {
      var o = page.ele,
        c = page.config;
      o.modal.find('[type=text]').val("");
      $("#channelPic-hidden").val("");
      $("#channelPic-pic").html('<img src=' + c.vm.rootPath + '/res/images/photo-default.png>');
      $("input[name='isOfficial'][value='1']").attr('checked', 'checked');
    },
    /*添加频道*/
    addSubmit: function() {
      var c = page.config,
        channelName = $("input[name='channelName']").val(),
        channelDesc = $("input[name='channelDesc']").val(),
        thumbnail = $("input[name='channelPic']").val();
      if (isForm.isTrim(channelName)) {
        $("input[name='channelName']").focus();
        return Toast.show("频道名称不能为空");
      }
      if (isForm.isCheck(channelName)) {
        $("input[name='channelName']").focus();
        return Toast.show("频道名称中有特殊字符");
      }
      if (isForm.isTrim(channelDesc)) {
        $("input[name='channelDesc']").focus();
        return Toast.show("频道简介不能为空");
      }
      if (isForm.isCheck(channelDesc)) {
        $("input[name='channelDesc']").focus();
        return Toast.show("频道简介中有特殊字符");
      }
      if (isForm.isTrim(thumbnail)) {
        return Toast.show("频道图片必须上传");
      }
      var p = {
        "channelId": $("#channelId").val(), //添加时为空
        "name": channelName,
        "desc": channelDesc,
        "thumbnail": thumbnail,
        "isOfficial": Number($("input[name='isOfficial']:checked").val())
      };
      if ($("#channelId").val()) {
        page.ajaxReq(p, c.api.updateChannelInfo);
      } else {
        page.ajaxReq(p, c.api.addChannel);
      }
    },
    /*编辑频道弹窗*/
    showChannel: function() {
      var _this = $(this),
        c = page.config,
        o = page.ele;
      Matrix.JSON({
        url: c.api.getChannelInfo,
        val: {
          "channelId": _this.closest('tr').data('channel-id')
        },
        fun: function(res) {
          console.log(res);
          var channel = res;
          $("#channelId").val(channel.channelId);
          $("#channelName").val(channel.name);
          $("#channelDesc").val(channel.channelDesc);
          $("#channelPic-hidden").val(channel.thumbnail);
          $("#channelPic-pic").html('<img src="' + c.vm.topicImagePath + '0/' + channel.thumbnail + '">');
          $("input[name='isOfficial'][value=" + channel.isofficial + "]").attr('checked', 'checked');
          o.modal.modal('show');
        }
      });
    },
    /*修改排序*/
    modifySortSubmit: function() {
      var _this = $(this),
        c = page.config,
        sort = _this.val();
      if (!isForm.isImp(sort)) {
        _this.val(_this.data('sort'));
        return Toast.show('请输入正确的数字');
      }
      var p = {
        "channelId": _this.closest('tr').data('channel-id'),
        "sort": sort
      };
      page.ajaxReq(p, c.api.modifyChannelSort);
    },
    modifyChannelStatus: function(cid, status) {
      var c = page.config;
      var p = {
        "channelId": cid,
        "status": status
      };
      page.ajaxReq(p, c.api.updateChannelInfo);
    },
    /*ajax请求*/
    ajaxReq: function(params, url) {
      console.log(params);
      console.log(url);
      // return;
      Matrix.JSON({
        url: url,
        val: params,
        fun: function(res) {
          console.log(res.msg);
          if (res.success == 1) {
            Toast.show('操作成功');
            setTimeout('location.reload()', 1000);
          } else {
            Toast.show(res.msg);
          }
        }
      });
    }
  };
  page.init();
})();