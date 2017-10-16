/*
* 话题详情
* by wml
* 20151222
* */
;
(function(){
    var API = {
        getComment: VM.rootPath + '/mmq/comment/queryTopicCommentList.do'
    };
    /*分页工具条 Pagination.init({})*/
    var Pagination = {
        info: {
            cPage: 1,
            totalPage: 1,
            totalCount: 1,
            container: $("#pagination")
        },
        init: function(op) {
            var self = this;
            $.extend(self.info, op);
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
        info:{
            vm:VM,
            commentDIV:$(".comment"),
            doc:$(document.body)
        },
        init:function(){
            var o = page.info;
            o.doc.on('click', '.js-paged', function() {
                if ($(this).is('.active')) return false;
                var p = Number($(this).text());
                page.getComment(p);
            });
            //加载第一页评论列表
            page.getComment(1);
        },
        /*请求接口获取指定页数评论*/
        getComment: function(p) {
            var o = page.info,
                params = {
                    topicId: o.vm.topicId,
                    page: p
                }
            Matrix.JSON({
                url: API.getComment,
                val: params,
                fun: function(res) {
                    console.log(res);
                    if (res.code == 0) {
                        page.showComment(res.data.dataList);
                    }
                }
            });
        },
        /*显示评论列表*/
        showComment: function(data) {
            var o = page.info,
                list = data.data;
            if (list.length == 0) {
                o.commentDIV.html("暂无评论~");
                return;
            }
            var arr = [], pagaArr = [];
            if(o.vm.commentId && o.vm.commentId!=""){
                $.each(list, function() {
                    var comment = this;
                    if(comment.commentId == o.vm.commentId){
                        list = [comment];
                        return false;
                    }

                    //回复评论列表
                    if (comment.followComments) {
                        $.each(comment.followComments, function() {
                            if(this.commentId == o.vm.commentId){
                                list = [comment];
                            }
                        });
                    }
                });
            }else{
                $('#commentCount').text("(" + data.total + ")");
            }
            $.each(list, function() {
                var comment = this;
                var memberInfo = comment.fromMemberObject;
                var nickName = memberInfo.nickName || "";
                arr.push('<li data-comment-id=' + comment.commentId + '>');
                arr.push('<div class="user-avatar"> <img alt="User" src="' + (memberInfo.headPortrait || 'http://s.mamhao.cn/common/images/avatar.png') + '"> </div>');
                arr.push('<div class="article-post" data-comment-id=' + comment.commentId + ' data-member-id=' + memberInfo.memberId + '>');
                arr.push('<span class="user-info">' + nickName + '</span><span class="time mr1x">' + (new Date(comment.createDate)).format("yyyy-MM-dd hh:mm:ss") + '</span>');
                if(comment.commentId == o.vm.commentId){
                    arr.push('&nbsp;<i class="icon-error">!</i>');
                }
                arr.push('</span>');
                arr.push('<p>' + comment.comment + '</p>');
                arr.push('</div>');
                //回复评论列表
                if (comment.followComments) {
                    $.each(comment.followComments, function() {
                        var reply = this;
                        var fromNickName = reply.fromMemberObject.nickName;
                        arr.push('<div class="article-post" data-comment-id=' + reply.commentId + ' data-member-id=' + reply.fromMemberObject.memberId + '>');
                        arr.push('<span class="user-info">' + (fromNickName || '') + '</span>')
                        arr.push('<span class="time mr1x">' + (new Date(reply.createDate)).format("yyyy-MM-dd hh:mm:ss") + '</span>');
                        if(reply.commentId == o.vm.commentId){
                            arr.push('&nbsp;<i class="icon-error">!</i>');
                        }
                        arr.push('</span>');
                        arr.push('<p>' + reply.comment + '</p>');
                        arr.push('</div>');
                    });
                }
                arr.push('</li>');
            });
            o.commentDIV.html(arr.join(''));
            if(o.vm.commentId && o.vm.commentId ==""){
                Pagination.init({
                    cPage: data.page,
                    totalPage: data.pageCount,
                    totalCount: data.total,
                    container: $("#pagination")
                });
            }
        }
    }

    page.init();
})();
