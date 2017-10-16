/*
* 群成员列表、搜索、编辑、删除等群操作
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
            uploadImgSize: null,
            isMobile: function (val) {
                return /^1[3,4,5,8]{1}\d{9}$/.test(val);
            },
            api: {
                "searchMember": "/mmq/group/searchMember.do",
                "removeFromGroup": "/mmq/group/removeFromGroup.do",
                "addMemberToGroup": "/mmq/group/addMemberToGroup.do",
                "setOrCancelManager": "/mmq/group/setOrCancelManager.do"
            }
        },
        init: function () {
            var o = page.ele, c = page.info;

            /*events*/
            o.doc.on('click', '.js-join-group', page.joinInGroup);//加入群
            o.doc.on('click', '.js-set-manager,.js-cancel-manager', page.setManager);//设为或取消管理员
            o.doc.on('click', '.js-remove-group', page.removeFromGroup);   //从群中移出
            o.doc.on('input', '.js-query', page.queryMember);   //查询群成员
        },
        queryMember: function () {
            var o = page.ele, c = page.info;
            var _this = $(this);
            var keywords = $.trim(_this.val());
            if (c.isMobile(keywords) && keywords !== _this.data('history')) {
                _this.data('history', keywords);
                var info = {
                    url: "searchMember",
                    data: {
                        groupId: c.vm.groupId,
                        memberPhone: keywords
                    },
                    success: function (res) {
                        if (res.code === 0) {
                            var resData = res.data;
                            _this.data('member-id', resData.memberId).data('member-name', resData.memberName);
                        } else {
                            _this.data('member-id', null).data('member-name', null).data('tips', res.message);
                            Toast.show(res.message);
                        }
                    }
                };
                page.ajax(info);
            }
        },
        joinInGroup: function () {
            var o = page.ele, c = page.info;
            var _this = $(this);
            var _input = _this.prev('input'),
                keywords = $.trim(_input.val()),
                tips = '确认将' + _input.data('member-name') + '加入到该群？';

            if (!c.isMobile(keywords)) {
                return Toast.show('用户手机号输入有误，请确认！');
            }

            if (!_input.data('member-id')) {
                return Toast.show(_input.data('tips'));
            }

            if (confirm(tips)) {
                var info = {
                    url: "addMemberToGroup",
                    data: {
                        groupId: c.vm.groupId,
                        memberId: _input.data('member-id')
                    },
                    success: function (res) {
                        if (res.code === 0) {
                            Toast.show({
                                template: '加入成功',
                                callback: page.refresh
                            });
                        } else {
                            Toast.show(res.message);
                        }
                    }
                };
                page.ajax(info);
            }
        },
        setManager: function () {
            var o = page.ele, c = page.info;
            var _this = $(this);
            var info = {
                url: "setOrCancelManager",
                data: {
                    groupId: c.vm.groupId,
                    memberId: _this.closest('tr').data('member-id'),
                    isSetAsManager: _this.is('.js-set-manager') ? 1 : 0 //0删除该群管理员 1设置成群管理员
                },
                success: function (res) {
                    if (res.code === 0) {
                        Toast.show({
                            template: _this.is('.js-set-manager') ? '成功设为群管理员！' : '成功取消群管理员身份！',
                            callback: page.refresh
                        });
                    } else {
                        Toast.show(res.message);
                    }
                }
            };
            page.ajax(info);

        },
        removeFromGroup: function () {
            var o = page.ele, c = page.info;
            var _this = $(this);
            var info = {
                url: "removeFromGroup",
                data: {
                    groupId: c.vm.groupId,
                    memberId: _this.closest('tr').data('member-id')
                },
                success: function (res) {
                    if (res.code === 0) {
                        Toast.show({
                            template: '移出成功',
                            callback: page.refresh
                        });
                    } else {
                        Toast.show(res.message);
                    }
                }
            };
						if(confirm("确认将此用户移除此群")){
							page.ajax(info);
						}
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