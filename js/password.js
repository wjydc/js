/**
 * Created by Adang on 2016/8/10.
 */
(function (window, $) {
    // 重置密码;
    var PA = {
        info: {},
        init: function (callback) {
            var self = this, o = self.info;
            if(callback){
                self.callback = callback;
            }
            o.oldpa = $(".js-old-password");
            o.password = $(".js-password-input");
            o.save = $("#js-password-save");
            o.oldpa.focus().attr("autocapitalize", "off");
            self.bind();
        },
        bind: function () {
            var self = this, o = self.info;
            // 提交保存;
            o.save.on("click", function () {
                self.save();
            });
        },
        save: function () {
            var self = this, o = self.info;
            var Ap = $.trim(o.password.eq(0).val()), Bp = $.trim(o.password.eq(1).val()), Op = $.trim(o.oldpa.val());
            if(Op == ""){
                o.oldpa.focus();
                return Toast.show("请输入您的旧密码!");
            }else if(Ap == ""){
                o.password.eq(0).focus();
                return Toast.show("请输入您的新密码!");
            }else if(Matrix.password.init(Ap) < 3){
                o.password.eq(0).focus();
                return Toast.show("您的密码强度不够，请尽量包含数字、大小写字母及特殊符号，长度6-16位!");
            }else if(Op === Ap){
                o.password.eq(0).focus();
                return Toast.show("新密码不能与旧密码一致!");
            }else if(Ap !== Bp){
                o.password.eq(1).focus();
                return Toast.show("您的两次新密码不一致，请检查!");
            }
            Matrix.JSON({
                showLoad : true,
                type : "POST",
                val : {
                    oldPwd: Op,
                    newPwd1: Ap,
                    newPwd2: Bp
                },
                url : root + '/platform/modifyMyPwd.do',
                fun : function(res) {
                    Toast.show(res.msg);
                    if(res.success){
                        // 成功后回调;
                        $.isFunction(self.callback) && self.callback.call(self.callback, res);
                    }else{
                        o.oldpa.val("");
                        o.password.val("");
                    }
                }
            });
        }
    };
    window.PA = PA;
})(window, jQuery);