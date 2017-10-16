/**
 * Created by adang on 2016/8/25.
 * 扫码付后台生成门店二维码
 */

(function (window, $) {
    posCode = {
        config: {
            x: 629,
            y: 1248,
            codeSize: [1220, 1220], // 二维码大小，width, height
            printSize: [2480, 3508] // 打印图大小，width, height
        },
        info: {},
        init: function () {
            var self = this, o = self.info, c = self.config;
            o.pop = $("#show-code");
            o.btn = $(".js-show-code");
            o.save = $(".js-save-code");
            o.code = $("#modal-code");
            o.print = $("#print-background");
            o.printCode = $("#print-code");
            o.printBack = o.print.find("img");
            o.qrcode = new QRCode('modal-code', {
                text: 'http://www.mamahao.com/',
                width: c.codeSize[0],
                height: c.codeSize[1],
                correctLevel : QRCode.CorrectLevel.L
            });
            c.vm = VM;
            self.bind();
            self.initCanvas();
        },
        // 事件绑定;
        bind: function () {
            var self = this, o = self.info, c = self.config;
            // 查看二维码;
            o.btn.on("click", function () {
                c.name = $(this).data("name");
                self.show($(this).data("key"));
            });
            // 保存二维码;
            o.save.on("click", function () {
                if(c.isPrint) return;
                c.isPrint = true;
                o.save.html("正在生成二维码，请稍后!");
                self.print();
            });
        },
        // 初始化Canvas;
        initCanvas: function () {
            var self = this, o = self.info, c = self.config;
            o.printCanvas = document.createElement("canvas");
            o.printCanvasCtx = o.printCanvas.getContext("2d");
            o.printCanvas.width = c.printSize[0];
            o.printCanvas.height = c.printSize[1];
            var newImg = new Image();
            newImg.src = o.printBack.attr("src");
            newImg.onload = function () {
                o.printCanvasCtx.drawImage(newImg, 0, 0, c.printSize[0], c.printSize[1]);
                //console.log(o.printCanvas.toDataURL("image/png"));
            };
        },
        // 展示二维码;
        show: function (data) {
            var self = this, o = self.info, c = self.config;
            o.qrcode.makeCode(data);
            o.pop.modal();
            //console.log(data);
        },
        // 生成打印图;
        print: function () {
            var self = this, o = self.info, c = self.config;
            var newCode = new Image();
            o.printCanvasCtx.clearRect(c.x, c.y, c.codeSize[0], c.codeSize[1]); // 清除已有内容;
            newCode.src = o.code.find("img").attr("src");
            newCode.onload = function () {
                o.printCanvasCtx.drawImage(newCode, c.x, c.y, c.codeSize[0], c.codeSize[1]);
                // 设备名称;
                if(c.name){
                    o.printCanvasCtx.font = "60px Arial";
                    o.printCanvasCtx.fillStyle = "#666666";
                    var text = o.printCanvasCtx.measureText(c.name),
                        x = c.printSize[0] - text.width - 80,
                        y = c.printSize[1] - 70;
                    //console.log( text );
                    o.printCanvasCtx.fillText(c.name, x, y);
                }
                c.isPrint = false;
                Toast.show('生成成功！');
                o.save.html("生成打印二维码");
                o.pop.modal("hide");
                var src = o.printCanvas.toDataURL("image/png");
                o.printCode.find(".print-images").html('<img src="'+ src +'">');
                o.printCode.modal();
            };
        }
    };
})(window, jQuery);
