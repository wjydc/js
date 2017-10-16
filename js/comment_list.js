/* 
 * 妈妈圈 评论管理
 * by wml
 * 20151223
 */
;(function() {
  var page = {
    config: {
      api: {
        updateComment: ROOTPATH + "/mmq/comment/updateCommentComplain.do", //删除评论接口
        examine: ROOTPATH + ""
      }
    },
    ele: {
      doc: $(document.body)
    },
    init: function() {
      var o = page.ele; //, c = page.config;
      o.doc.on('click', '#checkAll', page.checkAll); //绑定全选
      // o.doc.on('click', '', page.pass);
      // o.doc.on('click', '', page.refuse);
      o.doc.on('click', '#delete,#refuse,#pass', page.batchOption);
      o.doc.on('click', '.js-option', page.delete);
      o.doc.on('click', '.js-sort', function() {
        var sort = $(this).data('sort-type');
        $('#sort').val(sort);
        $("#listForm").submit();
      });

    },
    /*全选*/
    checkAll: function() {
      var _this = $(this);
      if (_this.attr('checked') == 'checked') {
        _this.closest('table').find('[type=checkbox]').attr('checked', 'checked');
      } else {
        _this.closest('table').find('[type=checkbox]').removeAttr('checked');
      }
    },
    /*查看评论详情*/
    toDetail: function() {},
    /*审核通过*/
    pass: function() {},
    /*审核不通过*/
    refuse: function() {},
    /*删除评论*/
    delete: function() {
      var c = page.config;
      if (confirm("是否确定要删除所选评论?")) {
        var commentIds = [$(this).closest('tr').data('comment-id')];
        page.ajaxReq({
          "complainIds": commentIds.join(),
          "status": 4
        }, c.api.updateComment);
      }
    },
    /*批量删除评论*/
    batchOption: function() {
      var c = page.config;
      if ($('.js-checkbox').length === 0) {
        return;
      }
      if ($('.js-checkbox:checked').length === 0) {
        return Toast.show('请选择一条评论后再操作~');
      }
      if ($(this).data('opt') == 4) {
        if (confirm("是否确定要删除所选评论?")) {
          var commentIds = [];
          $.each($('.js-checkbox:checked'), function() {
            commentIds.push($(this).closest('tr').data('comment-id'));
          });
          page.ajaxReq({
            "complainIds": commentIds.join(),
            "status": $(this).data('opt')
          }, c.api.updateComment);
        }
      } else {
        var commentIds = [];
        $.each($('.js-checkbox:checked'), function() {
          commentIds.push($(this).closest('tr').data('comment-id'));
        });
        page.ajaxReq({
          "complainIds": commentIds.join(),
          "status": $(this).data('opt')
        }, c.api.updateComment);
      }
    },
    /*ajax请求*/
    ajaxReq: function(params, url) {
      console.log(params);
      Matrix.JSON({
        url: url,
        val: params,
        fun: function(res) {
          console.log(res.msg);
          if (res.code == 0) {
            Toast.show('操作成功');
            setTimeout('location.reload()', 1000);
          }
        }
      });
    }
  };
  page.init();
})();