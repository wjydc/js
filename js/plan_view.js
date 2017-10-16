$(function() {
  var API = {
    getComment: VM.rootPath + "/plan/goods/commentList.do", //获取评论接口
    submitComment: VM.rootPath + "/plan/goods/savePlanComment.do", //提交评论接口
    deleteComment: VM.rootPath + "/plan/goods/deletePlanComment.do" //删除评论接口
  };

  /*分页工具条 Pagination.init({})*/
  var Pagination = {
    info: {
      cPage: 1,
      totalPage: 1,
      totalCount: 1,
      container: $(".pagination")
    },
    init: function(op) {
      var self = this;
      $.extend(self.info, op);
      // console.log(self.info);
      self.render();
    },
    render: function() {
      var o = this.info,
        pageArr = [];
      pageArr.push('<div class="pagination alternate text-right"><div class="count">');
      pageArr.push('<span>共 ' + o.totalCount + ' </span>条记录 (第 <span>' + o.cPage + '</span> 页,共<span> ' + o.totalPage + ' </span>页)');
      pageArr.push('</div><ul>');
      if (o.cPage == 1) {
        pageArr.push('<li class="disabled" id="prev" data-cur-page=' + o.cPage + '><a href="javascript:;">上一页</a></li>')
      } else {
        pageArr.push('<li id="prev" data-cur-page=' + o.cPage + '><a href="javascript:;">上一页</a></li>');
      }
      for (var i = 1; i < o.totalPage + 1; i++) {
        if (i == o.cPage) {
          pageArr.push('<li class="active"><a href="javascript:;">' + i + '</a></li>');
        } else {
          pageArr.push('<li class="js-paged"><a href="javascript:;">' + i + '</a></li>');
        }
      }

      if (o.cPage == o.totalPage) {
        pageArr.push('<li class="disabled" id="next" data-cur-page=' + o.cPage + '><a href="javascript:;">下一页</a></li>')
      } else {
        pageArr.push('<li id="next" data-cur-page=' + o.cPage + '><a href="javascript:;">下一页</a></li>');
      }

      pageArr.push('</ul></div>')

      o.container.html(pageArr.join(''));
    }
  }
  var page = {
    info: {
      vm: VM,
      doc: $(document.body),
      commentDIV: $('ul.comment')
    },
    init: function() {
      var o = page.info;
      o.doc.on('click', '.js-view-support', page.showSupportCompoent); //绑定查看支持组件详情弹窗
      o.doc.on('click', '.js-view-custom', page.showCustomCompoent); //绑定查看定制组件详情弹窗
      o.doc.on('click', '.js-comment-del', page.deleteComment); //绑定点击删除
      o.doc.on('click', '.js-comment-reply', page.reply); //绑定点击回复
      o.doc.on('click', '.js-comment-cancel', page.cancel); //绑定评论取消按钮
      o.doc.on('click', '.js-comment-submit', page.comment); //绑定评论取消按钮
      //绑定点击上一页
      o.doc.on('click', '#prev', function() {
        if ($(this).is('.disabled')) return false;
        var p = $(this).data('cur-page') - 1;
        page.getComment(p);
      });

      o.doc.on('click', '#next', function() {
        if ($(this).is('.disabled')) return false;
        var p = $(this).data('cur-page') + 1;
        page.getComment(p);
      });

      o.doc.on('click', '.js-paged', function() {
        if ($(this).is('.active')) return false;
        var p = Number($(this).text());
        page.getComment(p);
      });

      //加载第一页评论列表
      page.getComment(1);
    },
    /*显示支持组件详情弹窗*/
    showSupportCompoent: function() {
      var sid = $(this).data("sid")
      $("#supportModal").modal("show");
      $("#support-" + sid).show().siblings().hide();
      var _spec = $(".specs:visible"),
        _ul = _spec.find('ul'),
        htmlArr = [];
      if (_spec.length) {
        var specs = _spec.data("specs");
        $.each(specs, function() {
          htmlArr.push('<li><dl>');
          $.each(this.spec, function() {
            htmlArr.push('<dt>' + this.key + '</dt><dd>' + this.value + '</dd>');
          })
          htmlArr.push('</dl></li>');
        })
        _ul.html(htmlArr.join(''))
      }
    },
    /*显示定制组件详情弹窗*/
    showCustomCompoent: function() {
      var cid = $(this).data("cid");
      $("#customModal").modal("show");
      $("#custom-" + cid).show().siblings().hide();

    },
    /*请求接口获取指定页数评论*/
    getComment: function(p) {
      var o = page.info,
        params = {
          planId: o.vm.planId,
          page: p
        }
      Matrix.JSON({
        url: API.getComment,
        val: params,
        fun: function(res) {
          if (res.success) {
            // console.log(res);
            page.showComment(res);
          }
        }
      });
    },
    /*重新加载评论列表第一页*/
    reloadCommentList: function() {
      var o = page.info;
      o.commentDIV.html("");
      page.getComment(1);
    },
    /*显示评论列表*/
    showComment: function(data) {
      var o = page.info,
        list = data.data.data;
      if (list.length == 0) {
        o.commentDIV.html("暂无评论~");
        return;
      }
      var arr = [],
        pagaArr = [];
      $.each(list, function() {
        var comment = this;
        var memberInfo = comment.fromMember;
        var nickName = memberInfo.memberId == 0 ? '妈妈好小助手' : memberInfo.nickName
        arr.push('<li data-comment-id=' + comment.commentId + '>');
        arr.push('<div class="user-avatar"> <img alt="User" src="' + (memberInfo.headPortrait || 'http://s.mamhao.cn/common/images/avatar.png') + '"> </div>');
        arr.push('<div class="article-post" data-comment-id=' + comment.commentId + ' data-member-id=' + memberInfo.memberId + '>');
        arr.push('<span class="user-info">' + (nickName || '') + '</span><span class="time mr1x">' + (new Date(comment.commentDate)).format("yyyy-MM-dd hh:mm:ss") + '</span>');
        arr.push('<span class="opt"><button class="btn btn-mini btn-danger mr1x js-comment-del">删除</button>')
        if (memberInfo.memberId != 0) {
          arr.push('<button class="btn btn-mini btn-success js-comment-reply">回复</button>');
        }
        arr.push('</span>');
        arr.push('<p>' + comment.commentContent + '</p>');
        arr.push('</div>');
        //回复评论列表
        if (comment.planCommentViewObjects) {
          $.each(comment.planCommentViewObjects, function() {
            var reply = this;
            var fromNickName = reply.fromMember.memberId == 0 ? '妈妈好小助手' : reply.fromMember.nickName;
            var toNickName = reply.toMember && (reply.toMember.memberId == 0 ? '妈妈好小助手' : reply.toMember.nickName);
            arr.push('<div class="article-post" data-comment-id=' + reply.commentId + ' data-member-id=' + reply.fromMember.memberId + '>');
            arr.push('<span class="user-info">' + (fromNickName || '') + '</span>')
            if(toNickName){
              arr.push('回复<span class="user-info">' + toNickName + '</span>')
            }
            arr.push('<span class="time mr1x">' + (new Date(reply.commentDate)).format("yyyy-MM-dd hh:mm:ss") + '</span>');
            arr.push('<span class="opt"><button class="btn btn-mini btn-danger mr1x js-comment-del">删除</button>');
            if (reply.fromMember.memberId != 0) {
              arr.push('<button class="btn btn-mini btn-success js-comment-reply">回复</button>');
            }
            arr.push('</span>');
            arr.push('<p>' + reply.commentContent + '</p>');
            arr.push('</div>');
          });
        }
        arr.push('</li>');
      });
      o.commentDIV.html(arr.join(''));
      //展示分页
      Pagination.init({
        cPage: data.page,
        totalPage: data.pageCount,
        totalCount: data.allRecords,
        container: $("#pagination")
      });
    },
    /*回复*/
    reply: function() {
      var _this = $(this),
        o = page.info,
        _comment = _this.closest('.article-post'),
        _parentComment = _this.closest('li');
      if ($('.js-reply').length) {
        //改变参数
        $('.js-reply').remove();
      }
      //创建新的回复文本框
      var arr = ['<div class="article-post js-reply">',
        '<div class="reply">',
        '<textarea id="replyCtn" name="" rows="3" class="span12" maxlength="200"></textarea>',
        '<p><button class="btn btn-mini btn-success mr1x js-reply-submit">提交</button><button class="btn btn-mini js-comment-cancel">取消</button></p>',
        '</div></div>'];
      _comment.after(arr.join(''));
      $("#replyCtn").focus();
      $('.js-reply-submit').on('click', function() {
        var ctn = $("#replyCtn").val();
        if (!page.validate(ctn)) {
          $("#replyCtn").focus();return false
        }
        ;
        page.submitCommentReq({
          parentPlanCommentId: _parentComment.data('comment-id'),
          toMemberId: _comment.data('member-id'),
          commentContent: ctn
        });
      });
    },
    /*添加评论*/
    comment: function() {
      var ctn = $("#commentCtn").val();
      if (!page.validate(ctn)) {
        $("#commentCtn").focus();return false;
      }
      page.submitCommentReq({
        commentContent: ctn
      });
      $("#commentCtn").val("")
    },
    validate: function(content) {
      var isValid = true;
      if (isForm.isTrim(content)) {
        Toast.show('评论不能为空');
        isValid = false;
      }
      if (isForm.isCheck(content)) {
        Toast.show('评论内容中有特殊字符无法提交');
        isValid = false;
      }
      return isValid;
    },
    /*取消评论回复*/
    cancel: function() {
      $(this).closest('.article-post').remove();
      $(this).closest('.reply').remove();
    },
    /*提交评论/回复评论请求*/
    submitCommentReq: function(params) {

      var o = page.info;
      params.planId = o.vm.planId;
      params.fromMemberId = 0;
      console.log(params);
      Matrix.JSON({
        url: API.submitComment,
        val: params,
        fun: function(res) {
          if (res.success) {
            page.reloadCommentList();
          }
        }
      });
    },
    /*删除评论*/
    deleteComment: function() {
      var o = page.info,
        comment = $(this).closest('.article-post'),
        index = $(this).index(comment.find('.js-comment-del'));
      var params = {
        planId: o.vm.planId,
        planCommentId: comment.data('comment-id')
      };

      if (index == 0) {
        if (confirm("删除该条评论,将同时删除该评论下的所有回复.确定要删除吗?")) {
          Matrix.JSON({
            url: API.deleteComment,
            val: params,
            fun: function(res) {
              if (res.success) {
                comment.closest('li').fadeOut('slow', function() {
                  comment.closest('li').remove();
                  Toast.show('删除成功~');
                  page.reloadCommentList();
                });
              }
            }
          });
        }
      } else {
        if (confirm("确定要删除该条评论吗?")) {
          Matrix.JSON({
            url: API.deleteComment,
            val: params,
            fun: function(res) {
              if (res.success) {
                comment.fadeOut('slow', function() {
                  comment.remove();
                  Toast.show('删除成功~');
                });
              }
            }
          });

        }
      }
    }
  };
  page.init();
});