/**
 * home-config.js 首页广告资源位配置
 * 1.icon增加背景图设置
 * 2.icon增加大图上传
 * 3.增加广告类型 弹窗广告27
 * 4.一级导航增加宽度配置
 * by wml 2016.9.23
 * 1.增加广告类型 会员购(29) 可以手动排序
 */
// 数组去重
Array.prototype.unique = function() {var a = []; for (var i = 0; i < this.length; i++) {if (a.indexOf(this[i]) == -1) a.push(this[i]); } return a; };
(function($) {
  var HOME_CONFIG = {
    config: {
      adsData: [], // 投放结果数据,由服务端返回
      srcData: [], // 资源位配置数据,由服务端返回
      srcTypes: [], // 资源位配置类型, 根据服务端返回的moduleType从sourceTypes获取 moduleType{0:首页;1:一级导航页面;2:二级导航页面}
      /* { "bannerType": 资源位类型, "limit": 资源位可添加上线, "sort": 在投放页是否可移动排序, "name": 资源位名称, "picSize": ["广告图尺寸限制"] }, */
      sourceTypes: {
        "0":[
          {"bannerType":2,"limit":0,"sort":0,"name":"闪屏广告","picSize":["1000x1334"]},
          {"bannerType":27,"limit":0,"sort":0,"name":"弹窗广告","picSize":["600x600"]},
          {"bannerType":3,"limit":20,"sort":0,"name":"一级导航","picSize":["x80"]},
          {"bannerType":14,"limit":10,"sort":0,"name":"顶部Banner","picSize":["750x330"]},
          {"bannerType":5,"limit":10,"sort":0,"name":"图标ICON","picSize":["105x105","150x100"]},
          {"bannerType":6,"limit":20,"sort":1,"name":"黄金坑位（组合三宫格）","picSize":["375x400","375x200"]},
          {"bannerType":7,"limit":20,"sort":1,"name":"黄金坑位（组合五宫格）","picSize":["375x470","188x235"]},
          {"bannerType":9,"limit":50,"sort":1,"name":"黄金坑位（并列两宫格）","picSize":["375x200"]},
          {"bannerType":10,"limit":20,"sort":1,"name":"黄金坑位（并列三宫格）","picSize":["250x300"]},
          {"bannerType":18,"limit":50,"sort":1,"name":"文字导航（活动横幅Banner）","picSize":["750x110"]},
          {"bannerType":11,"limit":50,"sort":1,"name":"黄金坑位（并列四宫格）","picSize":["375x375"]},
          {"bannerType":16,"limit":20,"sort":1,"name":"钻展（活动大型Banner）","picSize":["750x400"]},
          {"bannerType":19,"limit":20,"sort":1,"name":"吊顶栏","picSize":["750x400","190x280"]},
          {"bannerType":20,"limit":20,"sort":1,"name":"横排广告展示（图片）","picSize":["200x250","190x280"]},
          {"bannerType":24,"limit":20,"sort":1,"name":"横排广告展示（商品）","picSize":["190x280"]},
          {"bannerType":15,"limit":20,"sort":1,"name":"钻展（活动Banner）","picSize":["750x330"]},
          {"bannerType":17,"limit":50,"sort":1,"name":"小蛮腰","picSize":["750x200"]},
          {"bannerType":12,"limit":20,"sort":1,"name":"黄金坑位（并列六宫格）","picSize":["250x300"]},
          {"bannerType":8,"limit":20,"sort":1,"name":"黄金坑位（组合七宫格）","picSize":["375x470","188x235","375x200"]},
          {"bannerType":13,"limit":50,"sort":1,"name":"黄金坑位（并列九宫格）","picSize":["250x250"]},
          {"bannerType":22,"limit":20,"sort":1,"name":"商品列表","picSize":["750x110"]},
          {"bannerType":0,"limit":1,"sort":1,"name":"附近门店"},
          {"bannerType":1,"limit":1,"sort":0,"name":"为您优选"},
          {"bannerType":29,"limit":1,"sort":0,"name":"会员购"}
        ],
        "1":[
          {"bannerType":25,"limit":10,"sort":1,"name":"活动轮播Banner","picSize":["750x330"]},
          {"bannerType":4,"limit":20,"sort":0,"name":"二级导航"},
          {"bannerType":18,"limit":50,"sort":1,"name":"文字导航（活动横幅Banner）","picSize":["750x110"]},
          {"bannerType":19,"limit":20,"sort":1,"name":"吊顶栏","picSize":["750x400","190x280"]},
          {"bannerType":20,"limit":20,"sort":1,"name":"横排广告展示（图片）","picSize":["200x250","190x280"]},
          {"bannerType":24,"limit":20,"sort":1,"name":"横排广告展示（商品）","picSize":["190x280"]},
          {"bannerType":11,"limit":50,"sort":1,"name":"黄金坑位（并列四宫格）","picSize":["375x200"]},
          {"bannerType":9,"limit":50,"sort":1,"name":"黄金坑位（并列两宫格）","picSize":["375x430"]},
          {"bannerType":21,"limit":20,"sort":1,"name":"商品楼层","picSize":["750x110"]},
          {"bannerType":10,"limit":50,"sort":1,"name":"黄金坑位（并列三宫格）","picSize":["250x300"]},
          {"bannerType":16,"limit":20,"sort":1,"name":"钻展（活动大型Banner）","picSize":["750x400"]},
          {"bannerType":22,"limit":20,"sort":1,"name":"商品列表","picSize":["750x110"]},
          {"bannerType":17,"limit":50,"sort":1,"name":"小蛮腰","picSize":["750x200"]}
        ],
        "2":[
          {"bannerType":16,"limit":20,"sort":1,"name":"钻展（活动大型Banner）","picSize":["750x330"]},
          {"bannerType":18,"limit":20,"sort":1,"name":"文字导航（活动横幅Banner）","picSize":["750x110"]},
          {"bannerType":19,"limit":20,"sort":1,"name":"吊顶栏","picSize":["750x400","190x280"]},
          {"bannerType":20,"limit":20,"sort":1,"name":"横排广告展示（图片）","picSize":["200x250","190x280"]},
          {"bannerType":24,"limit":20,"sort":1,"name":"横排广告展示（商品）","picSize":["190x280"]},
          {"bannerType":11,"limit":50,"sort":1,"name":"黄金坑位（并列四宫格）","picSize":["375x200"]},
          {"bannerType":9,"limit":20,"sort":1,"name":"黄金坑位（并列两宫格）","picSize":["375x430"]},
          {"bannerType":21,"limit":20,"sort":1,"name":"商品楼层","picSize":["750x110"]},
          {"bannerType":10,"limit":20,"sort":1,"name":"黄金坑位（并列三宫格）","picSize":["250x300"]},
          {"bannerType":15,"limit":20,"sort":1,"name":"钻展（活动Banner）","picSize":["750x330"]},
          {"bannerType":22,"limit":20,"sort":1,"name":"商品列表","picSize":["750x110"]},
          {"bannerType":17,"limit":50,"sort":1,"name":"小蛮腰","picSize":["750x200"]}
        ]
      },
      reqUrl: {
        saveSource: '/homeAdConf/saveSource.do', // 保存资源位配置请求接口 请求参数 moduleType bannerType bannerId bannerGroup
        deleteSource: '/homeAdConf/deleteSource.do', // 删除资源位配置请求接口  请求参数 bannerId
        updateStatus: '/homeAdConf/updateOnline.do', // 更新资源位类型的状态
        saveConfig: '/homeAdConf/saveBanner.do', // 投放管理 保存广告配置
        updatePosition: '/homeAdConf/refreshSort.do', // 投放管理 移动广告资源位
        getConfig: '/homeAdConf/queryAd.do', // 投放管理 获取广告配置信息
        getMbeanGoods: '/homeAdConf/getMbeanGoods.do', // 获取妈豆商品规格
        moveAds: '/homeAdConf/refreshSort.do', // 重新排序
        adsConfUrl: ['/homeAdConf/index.do', '/homeAdConf/firstGuideConf.do', '/homeAdConf/secondGuideConf.do'], // 首页投放页地址
        reSort: '/homeAdConf/cloneSort.do', // 参考排序接口
        spacePx: '/homeAdConf/alterSpacePx.do', // 修改客户端显示行间距 默认20
        setIconBG: '/homeAdConf/saveIconBgImage.do' // 设置icon背景图
      }
    },
    eles: {
      srcContainer: $('.js-src-container'), // 资源位管理容器
      saveSourceBtn: '.js-leafs-save', // 资源位管理 保存资源类型配置按钮
      addSourceBtn: '.js-leafs-new', // 资源位管理 增加资源位按钮
      deleteSourceBtn: '.js-leafs-del', // 资源位管理 删除资源位按钮
      updateStatusBtn: '.js-update-status', // 资源位管理 更新显示状态
      uploadPicBtn: '.js-upload-pic', // 资源位管理 上传图片按钮
      uploadPic2Btn: '.js-upload-pic2', // 资源位管理 上传图片按钮

      adsContainer: $('.MA-putin-item .MA-putin-block'), // 投放管理容器
      nextPageBtn: $('.js-have-next'), // 投放页 下一个三天按钮
      prevPageBtn: $('.js-have-prev'), // 投放页 上一个三天按钮
      saveConfigBtn: $('.js-have-save'), // 弹窗 保存广告配置按钮
      showConfigBtn: '.js-show-config', // 投放管理页 添加按钮
      previewBtn: $('.MA-putin-item .title time'), // 预览按钮
      reSortBtn: $('.js-sort'),
      previewQrcode: $("#home-preview-qrcode") // 二维码预览
    },
    init: function(op) {
      var self = this,
          o = self.eles,
          c = self.config;
      $.extend(c, op);
      c.srcTypes = c.sourceTypes[c.moduleType];
      console.log({
        "当前页面可配资源位": c.srcTypes
      });
      self.event(); // 绑定时间
      self.render(); // 渲染页面
    },
    /* 绑定所有事件 */
    event: function() {
      var self = this,
          o = self.eles,
          c = self.config;
      o.srcContainer.on('click', o.addSourceBtn, self.fn_addSource); // 绑定添加资源位配置点击
      o.srcContainer.on('click', o.deleteSourceBtn, self.fn_deleteSource); // 绑定删除资源位配置点击
      o.srcContainer.on('click', o.saveSourceBtn, function() {
        self.fn_saveSource(this);
      }); // 绑定保存资源位配置点击
      o.srcContainer.on('click', o.updateStatusBtn, self.fn_updateStatus); // 绑定更新资源位显示状态点击
      // 配置导航图片
      o.srcContainer.on('click', o.uploadPicBtn, function() {
        var _td = $(this).closest('td'),oldPic = '',picModal = $('#modal-pic');
        _td.find('[name="navPic"]').length && (oldPic = _td.find('[name="navPic"]').val());
        picModal.find('.js-pic-size').data('size', 'x80').html('(高80px)');
        if(oldPic){
          picModal.find('img').attr('src',c.imgurl + oldPic);
          picModal.find('[name="pic"]').val(oldPic);
        }else{
          picModal.find('img').attr('src',c.imgurl + '/res/images/photo-default.png');
          picModal.find('[name="pic"]').val('');
        }
        picModal.modal('show');
        $('.js-save-pic').off('click').on('click', function() {
          var pic = picModal.find('[name="pic"]').val();
          if (pic === "") return Toast.show("没有选择图片");

          if (_td.find('.js-delete-pic').length) {

          } else {
            _td.find('.js-upload-pic').text('修改图片');
            _td.append(' <a href="javascript:;" class="btn btn-warning  btn-mini js-delete-pic">清除</a>');
          }
          if (_td.find('[name="navPic"]').length) {
            _td.find('[name="navPic"]').val(pic);
          } else {
            _td.append('<input type="hidden" name="navPic" value=' + pic + '>');
          }
          picModal.modal('hide');
        });
      });
      o.srcContainer.on('click', o.uploadPic2Btn, function() {
        var _td = $(this).closest('td'),oldPic = '',picModal = $('#modal-pic');
        _td.find('[name="navPic"]').length && (oldPic = _td.find('[name="navPic"]').val());

        picModal.find('.js-pic-size').data('size', 'x120').html('(高120px)');
        if(oldPic){
          picModal.find('img').attr('src',c.imgurl + oldPic);
          picModal.find('[name="pic"]').val(oldPic);
        }else{
          picModal.find('img').attr('src',c.imgurl + '/res/images/photo-default.png');
          picModal.find('[name="pic"]').val('');
        }
        picModal.modal('show');
        $('.js-save-pic').off('click').on('click', function() {
          var pic = picModal.find('[name="pic"]').val();
          if (pic === "") return Toast.show("没有选择图片");
          if (_td.find('.js-delete-pic').length) {

          } else {
            _td.find('.js-upload-pic').text('修改图片');
            _td.append(' <a href="javascript:;" class="btn btn-warning  btn-mini js-delete-pic">清除</a>');
          }
          if (_td.find('[name="navPic2"]').length) {
            _td.find('[name="navPic2"]').val(pic);
          } else {
            _td.append('<input type="hidden" name="navPic2" value=' + pic + '>');
          }
          picModal.modal('hide');
        });
      });

      // 清除图片配置
      o.srcContainer.on('click', '.js-delete-pic', function() {
        var _td = $(this).closest('td');
        if (_td.find('input').length) {
          _td.find('input').val('');
        }
      });
      o.srcContainer.on('click', '.js-module-online', function() {
        self.fn_upModule(this);
      }); // 二级导航 选择模块

      o.adsContainer.on('click', o.showConfigBtn, function() {
        self.fn_showConfig(this);
      }); // 投放页 绑定显示具体广告配置点击
      $('select[name="linkType"]').on('change', self.fn_changeLinkType); // 切换落地类型

      // 填写妈豆商品后
      $('input[name="linkTo"]').on('change', function() {
        var _modal = $(this).closest('.modal');
        if (_modal.find('select[name="linkType"]').val() != 5 || $(this).val() == "") return;
        self.fn_getMbeanGoods({
          id: _modal.data('id'),
          linkTo: $(this).val()
        }, _modal.find('.beans-table tbody'));
      });
      o.saveConfigBtn.on('click', function() {
        self.fn_saveConfig(this);
      }); // 保存具体广告配置
      o.adsContainer.on('click', '.js-up', function() {
        self.fn_move(0, this);
      }); // 上移资源位
      o.adsContainer.on('click', '.js-down', function() {
        self.fn_move(1, this);
      }); // 下移资源位
      // 切换轮播banner
      o.adsContainer.on('click', '.js-item ol li', function() {
        $(this).closest('.js-item').find('ul li').eq($(this).index()).addClass('in').siblings().removeClass('in');
        $(this).closest('.js-item').find('ol li').removeClass('hover').eq($(this).index()).addClass('hover');
      });

      // 切换区域定向
      $('[name="isAll"]').on('click', function() {
        if ($(this).val() == "") {
          $('.js-area').removeClass('hide');
        } else {
          $('.js-area').addClass('hide');
        }
      });

      // 切换日期
      o.nextPageBtn.on('click', function() {
        var redirectUrl = '',
            params = '';
        redirectUrl = root + c.reqUrl.adsConfUrl[c.moduleType];
        params = '&beginDate=' + new Date(+new Date(c.beginDate) + 24 * 60 * 60 * 1000 * 3).format('yyyy-MM-dd') + '&endDate=' + new Date(+new Date(c.endDate) + 24 * 60 * 60 * 1000 * 3).format('yyyy-MM-dd');
        c.navId && (params += '&bannerId=' + c.navId);
        redirectUrl += '?' + params;
        location.href = redirectUrl;
        // self.fn_nextPage(params)
      });

      // 
      o.prevPageBtn.on('click', function() {
        var redirectUrl = '',
            params = '';
        redirectUrl = root + c.reqUrl.adsConfUrl[c.moduleType];
        params = '&beginDate=' + new Date(+new Date(c.beginDate) - 24 * 60 * 60 * 1000 * 3).format('yyyy-MM-dd') + '&endDate=' + new Date(+new Date(c.endDate) - 24 * 60 * 60 * 1000 * 3).format('yyyy-MM-dd');
        c.navId && (params += '&bannerId=' + c.navId);
        redirectUrl += '?' + params;
        location.href = redirectUrl;
        // self.fn_nextPage(params)
      });

      // 资源位管理页 绑定上下线
      o.srcContainer.on('click', '.js-leafs-online', function() {
        var _this = $(this);
        var reqData = {
          moduleType: c.moduleType,
          bannerType: _this.closest('.item').data('banner-type'),
          updateType: 2,
          srcId: c.navId
        };
        Matrix.JSON({
          showLoad: true,
          type: "POST",
          url: root + c.reqUrl.updateStatus,
          val: reqData,
          fun: function(res) {
            if (res.success) {
              location.reload();
            } else {
              alert(JSON.stringify(res));
            }
          }
        });
      });

      // 预览
      o.previewBtn.on('click', function() {
        self.fn_preview(this)
      });
      // 排序
      o.reSortBtn.on('click', function() {
        self.fn_reSort(this)
      });

      o.adsContainer.on('click', '.js-px', function() {
        self.fn_setSpacePx(this);
      });
      o.adsContainer.on('click', '.js-bg', function() {
        self.fn_setIconBG(this);
      });

      // 上传图片
      $(".up-btn").each(function() {
        var thas = $(this);
        thas.children().uploadify({
          uploader: root + '/oss/uploadFiles.do',
          swf: root + '/res/uploadify/uploadify.swf',
          queueID: 'null', // 上传进度列表;
          fileTypeDesc: "jpg",
          fileTypeExts: '*.png;*.jpg', //控制可上传文件的扩展名，启用本项时需同时声明fileTypeDesc
          multi: false,
          wmode: "transparent",
          buttonText: '选择图片',
          width: "100%",
          height: "100%",
          onUploadStart: function() {
            var id = this.button.parents(".up-btn").data("id");
            $("#" + id + "-pic").html('');
          },
          onUploadSuccess: function(file, data, response) {
            //上传完成时触发（每个文件触发一次）;
            //console.log([file,data,response]);
            var data = JSON.parse(data),
                id = this.button.parents(".up-btn").data("id");
            if (!data.success) {
              Toast.show(data.msg);
              $("#" + id + "-pic").html('<img src="' + root + '/res/images/photo-default.png"/>');
            } else {
              var img = new Image();
              img.src = "http://bgo.oss-cn-hangzhou.aliyuncs.com/" + data.fileName;
              // 不校验尺寸;
              // $("#" + id + "-pic").html('<img src="http://bgo.oss-cn-hangzhou.aliyuncs.com/' + data.fileName + '"/>');
              // $("#" + id + "-hidden").val(data.fileName);
              // 校验尺寸;
              $(img).load(function() {
                var size = thas.closest('.control-group').find('.js-pic-size').data('size');
                size = size && size.split('x') || ['', ''];
                if ((size[0] != "" && size[0] != this.width) || (size[1] != "" && size[1] != this.height)) {
                  Toast.show("请上传指定尺寸图片：" + size.join("x"));
                  $("#" + id + "-pic").html('<img src="' + root + '/res/images/photo-default.png"/>');
                } else {
                  $("#" + id + "-pic").html('<img src="http://bgo.oss-cn-hangzhou.aliyuncs.com/' + data.fileName + '"/>');
                  $("#" + id + "-hidden").val(data.fileName);
                }
              });
            }
          }
        });
      });

    },
    /* 页面渲染 */
    render: function() {
      var self = this,
          o = self.eles,
          c = self.config;
      if (c.adsData.length) {
        // 投放页广告配置数据
        var sDate = c.adsData[0].colDate,
            eDate = c.adsData[2].colDate;
        c.startDate = sDate;
        c.endDate = eDate;
        $('.js-have-title').text(new Date(sDate).format('yyyy年MM月dd日') + ' ~ ' + new Date(eDate).format('yyyy年MM月dd日'));
        $.each(c.adsData, function(i, json) {
          $(o.adsContainer[i]).find('.title time').text(json.colDate + '（点击预览）');
          if (+new Date(json.colDate).format('yyyyMMdd') < +new Date().format('yyyyMMdd')) $(o.adsContainer[i]).addClass('expired');
          $.each(json.groups, function(j, obj) {
            if (obj.bannerType == 23 && obj.banners[0].id) {
              // H5投放特殊处理
              $(o.adsContainer[i]).find('.js-h5 .tools').data('id', obj.banners[0].id);
              $(o.adsContainer[i]).find('.js-h5 .tools').html('<span class="label label-info js-show-config"><s class="icon-edit"></s>编辑</span>');
            } else {
              $(o.adsContainer[i]).append(self.UIShot.buildItem(obj.bannerType, obj)).data('date', json.colDate);
            }

          });
        });
      } else {
        // 资源位管理配置页面, 遍历需要显示的资源位类型列表
        $.each(c.srcTypes, function(i, Type) {
          // 1. 先渲染所有资源位类型
          // var obj = Type;
          // o.srcContainer.append(self.UIShot.buildItem('CONFIG', obj));
          o.srcContainer.append(self.UIShot.buildSourceItem(Type));
        });

        if (c.srcData && c.srcData.length) {
          // 2. 渲染资源位配置数据填充
          var groupList = c.srcData;
          /* 遍历数据数组,判断bannerType在[3,4,5,14,25]中的 将batchId放在 item#type_的data中,获取bannerGroup 再遍历插入到对应 id'#type_'下的table中
           * {bannerType:4,{bannerId:1,orderBy:1,isValid:0,bannerName:'童装童鞋'}}
           * 其他类型 直接插入到对应 id '#type_'+bannerType
           * {bannerType:4,{batchId:1,bannerName:'童装童鞋'}}
           */
          $.each(groupList, function(i, group) {
            var _item = $('#type_' + group.bannerType);
            if (_item.length) {
              if ([3, 4, 5, 14, 25].indexOf(group.bannerType) > -1) {
                bannerGroup = group.bannerGroup;
                var _table = $('#type_' + group.bannerType).data('batch-id', group.batchId).find('table'),
                    _tbody = _table.find('tbody');
                $.each(bannerGroup, function(j, banner) {
                  if (banner.linkType == 10) {
                    // 3. 门店特殊处理
                    var _nav0 = _table.find('tbody tr').eq(0);
                    var nav0Html = [];
                    nav0Html.push('<td><span>门店</span></td> <td><span>999</span></td> <td><a href="javascript:;" class="btn btn-info btn-mini js-update-status">' + (banner.isValid ? '隐藏' : '显示') + '</a></td><td></td><td></td><td></td>');
                    /*if (banner.pic) {
                     nav0Html.push('<a href="javascript:;" class="btn btn-inverse btn-mini js-upload-pic"><span><img src="' + c.imgurl + banner.pic + '"></span>修改图片</a> <a href="javascript:;" class="btn btn-warning  btn-mini js-delete-pic">清除</a>');
                     nav0Html.push('<input type="hidden" name="navPic" value="' + banner.pic + '">');
                     } else {
                     nav0Html.push('<a href="javascript:;" class="btn btn-inverse btn-mini js-upload-pic">配置图片</a>');
                     }
                     nav0Html.push('</td>');*/

                    _nav0.data('banner-id', banner.bannerId).html(nav0Html.join(''));
                  } else {
                    banner.bannerType = group.bannerType;
                    _tbody.append(self.UIShot.buildSourceItem(banner));
                  }
                });
                if (c.moduleType != 2 && [2, 3, 4, 5, 14].indexOf(group.bannerType) < 0) {
                  _item.find('.js-online').html('<a href="javascript:;" class="btn ' + (group.isOnline ? 'btn-danger' : 'btn-success') + ' js-leafs-online" data-isonline="' + group.isOnline + '">' + (group.isOnline ? '下线' : '上线') + '</a><span class="help-inline">(该功能当前为：<span class="label ' + (group.isOnline ? 'label-success' : 'label-important') + '">' + (group.isOnline ? '上线' : '下线') + '状态</span>)</span>');
                }
              } else {
                var _tbody = $('#type_' + group.bannerType).find('table tbody');
                _tbody.append(self.UIShot.buildSourceItem(group));
              }

              // 当前页面是二级导航时 判断 group.isOnline 修改功能开关的值
              if (c.moduleType == 2) {
                if (group.isOnline && group.isOnline == 1) {
                  _item.addClass('disabled');
                  _item.find('.widget-title .js-module-online').removeClass('btn-success').addClass('btn-danger').data('isonline', 1).text('撤销该模块');
                } else {
                  _item.find('.widget-title .js-module-online').removeClass('btn-danger').addClass('btn-success').data('isonline', 0).text('选择该模块');
                }
              } else if ([2, 3, 4, 5, 14].indexOf(group.bannerType) < 0) {
                if (group.isOnline && group.isOnline == 1) {
                  _item.find('.js-online').html('<a href="javascript:;" class="btn btn-danger js-leafs-online" data-isonline="' + group.isOnline + '">下线</a><span class="help-inline">(该类型当前为：<span class="label label-success">上线状态</span>)</span>');
                } else {
                  _item.find('.js-online').html('<a href="javascript:;" class="btn btn-success js-leafs-online" data-isonline="' + group.isOnline + '">上线</a><span class="help-inline">(该类型当前为：<span class="label label-important">下线状态</span>)</span>');
                }
              }
            }
          });
        }
      }
    },
    /* 预览 */
    fn_preview: function(obj) {
      var self = this,
          c = self.config,
          _this = $(obj),
          arr = [],
          items = [],
          date = _this.closest('.MA-putin-block').data('date');
      if ($('.modal-preview').length) {
        if ($('.modal-preview').data('date') == date) {
          return $('.modal-preview').modal('show');
        } else {
          $('.modal-preview').find('.modal-body').html('');
        }
      } else {
        arr.push('<div class="modal modal-lg modal-preview hide">');
        arr.push('<div class="modal-header"><button type="button" class="close" data-dismiss="modal">×</button><h3>' + date + '</h3></div>');
        arr.push('<div class="modal-body nopadding">');
        arr.push('</div>');
        $('body').append(arr.join(''));
      }
      _container = $('.modal-preview .modal-body');
      $.each(c.adsData[_this.index('time')].groups, function() {
        var isComplete = true;
        for (var i = 0; i < this.banners.length; i++) {
          if (this.bannerType != 14 && this.banners[i].id == undefined) {
            isComplete = false;
            break;
          } else if (this.bannerType == 14 && this.banners[i].id) {
            isComplete = true;
            break;
          } else if (this.bannerType == 14) {
            isComplete = false;
          } 
        }
        if (this.bannerType != 2 && this.status == 1 && this.size == this.banners.length && isComplete) {
          items.push('<div class="item"> <img src="http://s.mamhao.cn/admin/bootstrap/img/type_' + this.bannerType + '.png" alt=""> </div> ');
        }
      });
      _container.append($(items.join('')));
      //$('.modal-preview').modal('show');
      if(self.eles.previewQrcode.length){
        // 通过微商城预览权每月购版本之后支持;
        var url = root ? "http://m.mamhao.com/?" : "http://m.mamahao.com/?",
            params = {date: date};
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
        console.log(url + $.param(params));
        self.eles.previewQrcode.modal();
      }else{
        // 旧版预览
        if ($('.modal-preview').length) {
          if ($('.modal-preview').data('date') == date) {
            return $('.modal-preview').modal('show');
          } else {
            $('.modal-preview').find('.modal-body').html('');
          }
        } else {
          arr.push('<div class="modal modal-lg modal-preview hide">');
          arr.push('<div class="modal-header"><button type="button" class="close" data-dismiss="modal">×</button><h3>' + date + '</h3></div>');
          arr.push('<div class="modal-body nopadding">');
          arr.push('</div>');
          $('body').append(arr.join(''));
        }
        _container = $('.modal-preview .modal-body');
        $.each(c.adsData[_this.index('time')].groups, function() {
          var isComplete = true;
          for (var i = 0; i < this.banners.length; i++) {
            if (this.bannerType != 14 && this.banners[i].id == undefined) {
              isComplete = false;
              break;
            } else if (this.bannerType == 14 && this.banners[i].id) {
              isComplete = true;
              break;
            } else if (this.bannerType == 14) {
              isComplete = false;
            }
          }
          if (this.bannerType != 2 && this.status == 1 && this.size == this.banners.length && isComplete) {
            items.push('<div class="item"> <img src="http://s.mamhao.cn/admin/bootstrap/img/type_' + this.bannerType + '.png" alt=""> </div> ');
          }
        });
        _container.append($(items.join('')));
        $('.modal-preview').modal('show');
      }
      return;
    },
    /* 参考前一天排序 */
    fn_reSort: function(obj) {
      var self = this,
          c = self.config,
          _this = $(obj),
          toDate = _this.closest('.MA-putin-block').data('date'),
          fromDate = new Date(new Date(toDate) - 24 * 60 * 60 * 1000).format('yyyy-MM-dd'),
          reqData = {
            'moduleType': c.moduleType,
            'fromDate': fromDate,
            'toDate': toDate
          };
      c.navId && (reqData.srcId = c.navId);
      // return console.log(reqData);
      if (confirm('点击确定将按 ' + fromDate + ' 的顺序对资源位重新排序')) {
        Matrix.JSON({
          showLoad: true,
          type: "POST",
          url: root + c.reqUrl.reSort,
          val: reqData,
          fun: function(res) {
            if (res.success) {
              Toast.show('排序更新成功~');
              setTimeout('location.reload()', 1000);
            } else {
              Toast.show(res.msg);
            }
          }
        });
      }
    },
    /* 设置间隔 */
    fn_setSpacePx: function(obj) {
      var self = this,
          c = self.config,
          o = self.eles,
          _this = $(obj),
          _item = _this.closest('.js-item');

      if ($('#spacePx').length == 0) {
        o.adsContainer.append(['<div class="modal hide" id="spacePx">',
          '<div class="modal-header">',
          '<button type="button" class="close" data-dismiss="modal">×</button>',
          '<h3>设置资源位间隔像素值</h3>',
          '</div>',
          '<div class="modal-body ">',
          '<input type="number" name="px" min=0 max=20 id="px" placeholder="请输入小于等于20的正整数">',
          '</div>',
          '<div class="modal-footer">',
          '<a href="javascript:;" class="btn btn-primary" id="ok">确定</a> <a href="javascript:;" class="btn" data-dismiss="modal">关闭</a> </div>',
          '</div>'
        ].join(''));
      }

      var $spacePxModal = $('#spacePx');
      $spacePxModal.modal('show');
      $('[name="px"]').focus();
      reqData = {
        'batchId': _item.data('batch-id')
      };
      $spacePxModal.find('#ok').off('click').on('click', function() {
        reqData.px = +$('#px').val();
        if (reqData.px > 20) {
          $('#px').val(20);
          return Toast.show('值太大了,会很丑');
        }
        if (!isForm.isImp(reqData.px)) {
          $('#px').val('');
          return Toast.show('请输入小于等于20的正整数');
        }
        Matrix.JSON({
          showLoad: true,
          type: "POST",
          url: root + c.reqUrl.spacePx,
          val: reqData,
          fun: function(res) {
            if (res.success) {
              Toast.show('设置间隔成功~');
              setTimeout('location.reload()', 1000);
            } else {
              Toast.show(res.msg);
            }
          }
        });
      });
    },
    /* 设置icon背景 */
    fn_setIconBG: function(obj) {
      var self = this,
          c = self.config,
          o = self.eles,
          _this = $(obj),
          _item = _this.closest('.js-item');
      var $iconBGModal = $('#modal-iconBG');
      if(_item.data('bg-image-id')){
        Matrix.JSON({
          showLoad: true,
          type: "POST",
          url: root + c.reqUrl.getConfig,
          val: {id: _item.data('bg-image-id') },
          fun: function(res) {
            var bgObj = res.data;
            //bannerType : 28 beginTime : "2016-09-22"checkGoodValidId : 0 endTime : "2016-09-23"id : 23031 pic : "2183d50e-be33-4008-bfc1-0e003fa69143.png
            $iconBGModal.find('[name="beginTime"]').val(bgObj.beginTime);
            $iconBGModal.find('[name="endTime"]').val(bgObj.endTime);
            $iconBGModal.find('.up-pic img').attr('src', c.imgurl + bgObj.pic);
            $iconBGModal.find('input[name="iconBG"]').val(bgObj.pic);
          }
        });
      }

      $iconBGModal.modal('show');

      $iconBGModal.find('#ok').off('click').on('click', function() {
        var reqData = {
          'id': _item.data('bg-image-id'),
          'pic': $iconBGModal.find('[name="iconBG"]').val(),
          'beginTime': $iconBGModal.find('[name="beginTime"]').val(),
          'endTime': $iconBGModal.find('[name="endTime"]').val()
        };
        // return console.log(reqData);
        Matrix.JSON({
          showLoad: true,
          type: "POST",
          url: root + c.reqUrl.setIconBG,
          val: {'json': JSON.stringify(reqData) },
          fun: function(res) {
            console.log(res);
            if (res.success) {
              Toast.show('设置背景成功~');
              setTimeout('location.reload()', 1000);
            } else {
              Toast.show(res.msg);
            }
          }
        });
      });
    },
    /* 二级导航 选中模块 */
    fn_upModule: function(obj) {
      if (confirm('选择该类型后将在APP端隐藏所有其他类型资源位,是否确认选择')) {
        var self = this,
            c = self.config;
        var reqData = {
          moduleType: c.moduleType,
          bannerType: $(obj).closest('.item').data('banner-type'),
          srcId: c.navId,
          updateType: 2
        };
        Matrix.JSON({
          showLoad: true,
          type: "POST",
          url: root + c.reqUrl.updateStatus,
          val: reqData,
          fun: function(res) {
            if (res.success) {
              if (res.data == 1) {
                Toast.show('选择模块成功~');
              } else {
                Toast.show('撤销模块成功~');
              }
              setTimeout('location.reload()', 1000);
            } else {
              alert(JSON.stringify(res));
            }
          }
        });
      }
    },
    /* 1.增加一个资源位配置 */
    fn_addSource: function() {
      var _this = $(this),
          m = $(_this.data('for')),
          type = $(_this.data('for')).data('banner-type');
      if (m.find('tbody tr').length >= m.data('limit')) return Toast.show('该资源位数量已达最大上限!');
      m.find('table tbody').append(HOME_CONFIG.UIShot.buildSourceItem({
        bannerType: +type
      }));
      m.find('input[name="bannerName"]').focus();
    },
    /* 2.删除一个资源位配置 */
    fn_deleteSource: function() {
      var _this = $(this).closest('tr');
      if (!_this.data('banner-id') && !_this.data('batch-id')) {
        _this.remove();
      } else {
        if (confirm('是否确定删除该资源位')) {
          var reqData = {
            moduleType: HOME_CONFIG.config.moduleType,
            bannerId: _this.data('banner-id'),
            batchId: _this.data('batch-id'),
            bannerType: _this.closest('.item').data('banner-type')
          };
          // if([3,14,5,4,25].indexOf(reqData.bannerType) > -1){

          // }
          // console.log(reqData);
          Matrix.JSON({
            showLoad: true,
            type: "POST",
            url: root + HOME_CONFIG.config.reqUrl.deleteSource,
            val: reqData,
            fun: function(res) {
              if (res.success) {
                Toast.show('删除成功~');
                _this.remove();
                //setTimeout('location.reload()', 1000);
              } else {
                Toast.show(res.msg);
              }
            }
          });
        }
      }
    },
    /* 3. 资源位显示隐藏 */
    fn_updateStatus: function() {
      var _this = $(this).closest('tr');
      if (!_this.data('banner-id')) return;
      var reqData = {
        moduleType: HOME_CONFIG.config.moduleType,
        bannerType: _this.closest('.item').data('banner-type'),
        bannerId: _this.data('banner-id'),
        batchId: _this.data('batchId'),
        updateType: 1,
        srcId: HOME_CONFIG.config.navId
      };
      // console.log(reqData);
      Matrix.JSON({
        showLoad: true,
        type: "POST",
        url: root + HOME_CONFIG.config.reqUrl.updateStatus,
        val: reqData,
        fun: function(res) {
          if (res.success) {
            location.reload();
          } else {
            alert(JSON.stringify(res));
          }
        }
      });
    },
    /* 4. 保存一种资源位类型的配置 */
    fn_saveSource: function(obj) {
      var self = this,
          c = self.config,
          isValidate = true,
          toastText = '填写的内容中有无法保存的字符',
          _this = $(obj),
          bannerGroup = [],
          m = $(_this.data('for')).find('table tbody'),
          type = $(_this.data('for')).data('banner-type');
      $.each(m.find('tr'), function(i, o) {
        var batchId = _this.closest('.item').data('batch-id');
        if (!batchId)
          batchId = $(this).data('batch-id');
        var bannerId = $(this).data('banner-id'),
            bannerName = $(this).find('input[name="bannerName"]').val(),
            orderBy = +$.trim($(this).find('input[name="orderBy"]').val()),
            isValid = $(this).data('isvalid') || '';

        if (isForm.isCheck(bannerName)) {
          isValidate = false;
          toastText = '资源位名称不能为空';
          $(this).find('input[name="bannerName"]').focus();
          return false;
        }

        if ([3, 4, 5, 14, 25].indexOf(type) > -1) {
          if (type == 3 && i == 0) {} else {
            if (orderBy == '') {
              isValidate = false;
              $(this).find('input[name="orderBy"]').focus();
              toastText = '排序值不能为空~';
              return Toast.show(toastText);
            }
            if (!isForm.isNUM(orderBy)) {
              isValidate = false;
              toastText = '排序值必须为数字';
              return false;
            }
          }
        }

        if ($.trim(bannerName).length > 20) {
          isValidate = false;
          toastText = '填写的内容中有超出20个字符的,不能保存';
          return false;
        }

        var group = {
          'bannerName': bannerName,
          'orderBy': orderBy,
          'bannerId': bannerId,
          'batchId': batchId,
          'isValid': isValid,
          'pic': $(this).find('[name="navPic"]').val() || '',
          'pic2': $(this).find('[name="navPic2"]').val() || ''
        };
        if (type == 3 && i == 0) {
          // 一级导航门店添加参数linkType=10
          group.bannerName = '门店';
          group.linkType = 10;
          group.isValid = 1;
          group.orderBy = 999;
        }
        if(type == 3 && i !== 0){
          group.navLevelWidth = $(this).find('[name="navLevelWidth"]').val();
          if(!isForm.isImp(group.navLevelWidth) || group.navLevelWidth > 300){
            isValidate = false;
            toastText = '请填写不超过300的正整数!';
            return false;
          }
        }
        if ($.trim(group.bannerName) == "") return;
        if (type == 4) {
          group.isValid = 1;
        }
        bannerGroup.push(group);
      });

      if (!isValidate) return Toast.show(toastText); // 各种校验
      var reqData = {
        'moduleType': c.moduleType,
        'bannerType': type,
        'bannerGroup': JSON.stringify(bannerGroup)
      };
      c.navId && (reqData.bannerId = c.navId);
      Matrix.JSON({
        showLoad: true,
        type: "POST",
        url: root + c.reqUrl.saveSource,
        val: reqData,
        fun: function(res) {
          if (res.success) {
            Toast.show('添加成功~');
            setTimeout('location.reload()', 1000);
          } else {
            alert(JSON.stringify(res));
          }
        }
      });
    },
    /* 5. 获取妈豆商品规格 */
    fn_getMbeanGoods: function(params, _tbody) {
      var self = this,
          c = self.config;
      Matrix.JSON({
        showLoad: true,
        type: "POST",
        url: root + c.reqUrl.getMbeanGoods,
        val: params,
        fun: function(res) {
          // alert(JSON.stringify(res));
          // UIShot.buildTable({keys:[],data:[]});
          if (res.success) {
            var htmlArr = [];
            $.each(res.data, function() {
              htmlArr.push('<tr data-itemnumid="' + this.itemNumId + '" data-itemid="' + this.itemId + '" data-color="" data-size=""><td>/</td><td>/</td><td>' + this.itemId + '</td><td>/</td><td><input type="text" placeholder="妈豆" name="beans" value="">妈豆 <input type="text" placeholder="元" name="money" value="">元 </td><td><input type="text" placeholder="可用库存" name="stock" value=""></td></tr>');
            });
            _tbody.html(htmlArr.join(''));
          } else {
            Toast.show(res.msg);
          }
        }
      });
    },
    /* 6. 投放页 上下移动
     choice 上移/下移 0: 上移;1:下移
     * */
    fn_move: function(choice, obj) {
      var self = this,
          c = self.config,
          _item = $(obj).closest('.js-item'),
          _anotherItem = null;
      if (choice == 0 && _item.prev().length && [2, 5, 23].indexOf(_item.prev().data('banner-type')) == -1) {
        _anotherItem = _item.prev();
      } else if (choice == 1 && _item.next().length && _item.next().data('banner-type') != 1) {
        _anotherItem = _item.next();
      } else {
        return Toast.show('不能这样移');
      }
      var json = [],
          orderBy = _item.data('root-order'),
          orderBy1 = _anotherItem.data('root-order');
      json.push({
        'orderBy': (orderBy == "" || orderBy == null) ? 0 : orderBy,
        'up': choice == 0 ? 1 : 0,
        'orderKey': _item.data('batch-id')
      });
      json.push({
        'orderBy': (orderBy1 == "" || orderBy1 == null) ? 0 : orderBy1,
        'up': choice == 1 ? 1 : 0,
        'orderKey': _anotherItem.data('batch-id')
      });
      var reqData = {
        date: _item.closest('.MA-putin-block').data('date'),
        moduleType: c.moduleType, // 页面类型 0:首页 1:一级页面 2:二级页面
        srcId: c.navId || '', // 上一级导航bannerId
        json: JSON.stringify(json)
      };
      // console.log(reqData);
      Matrix.JSON({
        showLoad: true,
        type: "POST",
        url: root + c.reqUrl.moveAds,
        val: reqData,
        fun: function(res) {
          if (res.success) {
            location.reload();
          } else {
            alert(JSON.stringify(res));
          }
        }
      });
    },
    /* 7. 切换落地类型 */
    fn_changeLinkType: function() {
      var _this = $(this),
          linkType = +_this.val(),
          _modal = _this.closest('.modal');
      _linkTo = _this.closest('.control-group').find('input[name="linkTo"]');
      _linkTo.val('');
      if (linkType == 1 || linkType == 6 || linkType == 7 || linkType == '') {
        // 落地类型 空/'无'/'类目主页'/'众筹' 不需要填写落地页
        _linkTo.attr('disabled', 'disabled');
      } else {
        _linkTo.removeAttr('disabled');
      }

      if (linkType == 5) { // 落地类型为妈豆商品
        _modal.find('.js-beans-block').removeClass('none');
      } else {
        _modal.find('.js-beans-block').addClass('none');
      }
    },
    /* 8. 清空模态窗口数据 */
    fn_cleanModal: function(modal) {
      var self = this,
          c = self.config,
          bannerType = modal.data('banner-type');
      modal.data('');
      modal.find('input[name="name"]').val('');
      modal.find('input[name="pic"]').val('');
      modal.find('.up-pic img').attr('src', root + '/res/images/photo-default.png');
      modal.find('input[name="beginTime"]').val('');
      modal.find('input[name="endTime"]').val('');
      modal.find('input[name="buyBeginTime"]').val('');
      modal.find('input[name="buyEndTime"]').val('');
      modal.find('textarea[name="styleNumIds"]').val('');
      modal.find('.js-beans-block').addClass('none');
      if (bannerType == 23) { // H5页面投放
        modal.find('input[name="linkTo"]').removeAttr('disabled');
      } else {
        modal.find('select[name="linkType"]').val('');
        modal.find('input[name="linkTo"]').attr('disabled', 'disabled');
      }
      if (bannerType == 14) {
        //modal.find('input[name="isAll"]').val(1);
        modal.find('.js-area').addClass('hide');
        if (modal.find('input[name="isAll"]:checked').val() == 1) {} else {
          modal.find('input[name="isAll"]:checked').removeAttr('checked');
          modal.find('input[name="isAll"]').eq(0).attr('checked', 'checked');
        }
        getPrv();
      }
    },
    /* 9. 回填数据 */
    fn_fillModal: function(data) {

    },
    getSrcObjById: function(id) {
      var self = this,
          c = self.config,
          srcObj = {};
      for (var i = 0; i < c.srcTypes.length; i++) {
        if (c.srcTypes[i].bannerType == id) {
          srcObj = c.srcTypes[i];
          break;
        }
      }
      return srcObj;
    },
    /**
     * [投放页 弹出窗口显示广告配置信息]
     * @param  {[json]} obj [description]
     * @return {[type]}     [description]
     */
    fn_showConfig: function(obj) {
      var self = this,
          c = self.config;
      var _this = $(obj).closest('.tools'),
          _item = $(obj).closest('.js-item'),
          id = _this.data('id') || '',
          bannerName = _this.data('banner-name'),
          type = _item.data('banner-type'),
          _modal = $('#modal-defult'),
          weight = _this.data('weight') || 0,
          bannerId = _this.data('banner-id'),
          params = {
            batchId: _item.data('batch-id'),
            rootDefOrder: _item.data('root-order'),
            bannerId: bannerId,
            weight: weight,
          };
      if (type == 14) {
        // 顶部banner 配置时有人群定向
        _modal = $('#modal-type-14');
      } else if (type == 6 || type == 7 || type == 8) {
        // 组合三宫格 组合五宫格 有妈豆配置
        _modal = $('#modal-type-67');
      } else if (type == 19) {
        // 吊顶栏
        _modal = $('#modal-type-19');
      } else if (type == 24) {
        _modal = $('#modal-type-24');
      } else if (type == 20) {
        _modal = $('#modal-type-20');
      } else if (type == 21 || type == 22) {
        if ($('#modal-type-21').length) {
          _modal = $('#modal-type-21');
        } else {
          _modal = $('#modal-type-24');
        }
      } else if (type == 23) {
        _modal = $('#modal-type-23');
      } else if (type == 27){
        _modal = $('#modal-type-27');
      } else if (type == 5){
        _modal = $('#modal-type-5');
      }
      // 获取图片尺寸
      var picSizeArr = self.getSrcObjById(type).picSize || [];
      if (type == 19) {
        _modal.find('.js-pic-size').eq(0).data('size', picSizeArr[0]).text(picSizeArr[0] + '像素');
        _modal.find('.js-pic-size').eq(1).data('size', picSizeArr[1]).text(picSizeArr[1] + '像素');
      } else if (type == 20) {
        $.each(_modal.find('.js-pic-size'), function() {
          $(this).data('size', picSizeArr[0]).text(picSizeArr[0] + '像素');
        });
      } else if (type == 6 && weight > 1) {
        // 组合 3宫格 小
        _modal.find('.js-pic-size').data('size', picSizeArr[1]).text(picSizeArr[1] + '像素');
      } else if (type == 7 && weight > 1 && weight <= 5) {
        // 组合 5宫格 右小
        _modal.find('.js-pic-size').data('size', picSizeArr[1]).text(picSizeArr[1] + '像素');
      } else if (type == 8 && weight > 1 && weight <= 5) {
        // 组合 7宫格 右小
        _modal.find('.js-pic-size').data('size', picSizeArr[1]).text(picSizeArr[1] + '像素');
      } else if (type == 8 && weight > 5) {
        // 组合 7宫格 下
        _modal.find('.js-pic-size').data('size', picSizeArr[2]).text(picSizeArr[2] + '像素');
      } else if (type == 5){
        _modal.find('.js-pic-size').eq(0).data('size', picSizeArr[0]).text(picSizeArr[0] + '像素');
        _modal.find('.js-pic-size').eq(1).data('size', picSizeArr[1]).text(picSizeArr[1] + '像素');
      } else {
        _modal.find('.js-pic-size').data('size', picSizeArr[0]).text(picSizeArr[0] + '像素');
      }

      _modal.find('.modal-header h3').html(bannerName); // 该广告位名称

      _modal.data({
        'banner-type': type,
        'save-params': JSON.stringify(params),
        'id': id
      }).modal('show');
      self.fn_cleanModal(_modal);

      // 方便测试填充的数据
      /*if(type == 13 || !id){
       var picarr = ['13dda670-8d19-49c7-af3c-dde4315ea172.png','aa328e45-9781-4b2f-bf65-ca85da950608.png',"8923da0d-f4d7-4d9f-94a6-1be3e270ebe0.png","cb0faa7d-1bf8-41e0-9e9c-6ac98d118732.png","50675155-5eba-4c1e-8a11-1ca3c43568ac.png","33213df6-e3fd-4271-8970-909db18ce045.png","1c0baf43-5720-452d-8c82-433a05c61864.png","d2cc531a-934f-40bb-9def-946170db2b09.png","2f87c33b-39c5-4a25-a5a7-fe9e9fbcc2e4.png","01fb0679-772a-4df4-b12a-d276fe1ec623.png"];
       var typearr = [1,2,3,6,7,8,9,1,1,1,1];
       var toarr = ['','180821','http://www.baidu.com','','',1,266,'','','',''];
       _modal.find('input[name="name"]').val(bannerId + '-' + weight);
       _modal.find('select[name="linkType"]').val(typearr[weight]);
       _modal.find('input[name="linkTo"]').val(toarr[weight]);
       _modal.find('input[name="pic"]').val(picarr[weight]);
       _modal.find('.up-pic img').attr('src', c.imgurl + picarr[weight]);
       }
       _modal.find('input[name="beginTime"]').val(new Date().format('yyyy-MM-dd'));
       _modal.find('input[name="endTime"]').val(new Date('2016/5/18').format('yyyy-MM-dd'));*/

      /*  有id 获取具体广告配置信息 */
      if (id) {
        Matrix.JSON({
          showLoad: true,
          type: "POST",
          url: root + HOME_CONFIG.config.reqUrl.getConfig,
          val: {
            id: id
          },
          fun: function(res) {
            console.log(res);
            if (res.success) {
              var data = res.data;
              _modal.find('input[name="name"]').val(data.name);
              _modal.find('input[name="beginTime"]').val(data.beginTime);
              _modal.find('input[name="endTime"]').val(data.endTime);

              if (type == 20) {
                $.each(data.horizonAds, function(i) {
                  var _horizonAd = _modal.find('.js-horizonAds').eq(i);
                  _horizonAd.find('.up-pic img').attr('src', c.imgurl + this.pic);
                  _horizonAd.find('input[name="pic"]').val(this.pic);
                  _horizonAd.find('select[name="linkType"]').val(this.linkType);
                  _horizonAd.find('input[name="linkTo"]').val(this.linkTo);
                  if ([1, 6, 7, ''].indexOf(this.linkType) > -1) {
                    _horizonAd.find('input[name="linkTo"]').attr('disabled', 'disabled');
                  } else {
                    _horizonAd.find('input[name="linkTo"]').removeAttr('disabled');
                  }
                });
                _modal.find('.up-pic img').eq(0).attr('src', c.imgurl + data.pic);
                _modal.find('input[name="pic"]').eq(0).val(data.pic);
                _modal.find('select[name="linkType"]').eq(0).val(data.linkType);
                _modal.find('input[name="linkTo"]').eq(0).val(data.linkTo);
                if ([1, 6, 7, ''].indexOf(data.linkType) > -1) {
                  _modal.find('input[name="linkTo"]').eq(0).attr('disabled', 'disabled');
                } else {
                  _modal.find('input[name="linkTo"]').eq(0).removeAttr('disabled');
                }
              } else if (type == 19) {
                _modal.find('.up-pic img').eq(0).attr('src', c.imgurl + data.pic);
                _modal.find('input[name="pic"]').eq(0).val(data.pic);
                _modal.find('select[name="linkType"]').eq(0).val(data.linkType);
                _modal.find('input[name="linkTo"]').eq(0).val(data.linkTo);
                if ([1, 6, 7, ''].indexOf(data.linkType) > -1) {
                  _modal.find('input[name="linkTo"]').eq(0).attr('disabled', 'disabled');
                } else {
                  _modal.find('input[name="linkTo"]').eq(0).removeAttr('disabled');
                }

                var _ceilMore = _modal.find('.js-ceilMore');
                if (data.ceilMore) {
                  _ceilMore.find('.up-pic img').attr('src', c.imgurl + data.ceilMore.pic);
                  _ceilMore.find('input[name="pic"]').val(data.ceilMore.pic);
                  _ceilMore.find('select[name="linkType"]').val(data.ceilMore.linkType);
                  _ceilMore.find('input[name="linkTo"]').val(data.ceilMore.linkTo);
                  if ([1, 6, 7, ''].indexOf(data.ceilMore.linkType) > -1) {
                    _ceilMore.find('input[name="linkTo"]').attr('disabled', 'disabled');
                  } else {
                    _ceilMore.find('input[name="linkTo"]').removeAttr('disabled');
                  }
                }
              } else if (type == 27){
                _modal.find('select[name="linkType"]').val(data.linkType);
                _modal.find('input[name="linkTo"]').val(data.linkTo);
                _modal.find('.up-pic img').attr('src', c.imgurl + data.pic);
                _modal.find('input[name="pic"]').val(data.pic);
                // _modal.find('[name="popUpDirectTo"]').val(data.popUpDirectTo);
                if ([1, 6, 7, ''].indexOf(data.linkType) > -1) {
                  _modal.find('input[name="linkTo"]').attr('disabled', 'disabled');
                } else {
                  _modal.find('input[name="linkTo"]').removeAttr('disabled');
                }
                _modal.find('input[name="popUpDirectTo"][value="' +data.popUpDirectTo +'"]').attr('checked','checked');
              } else if(type == 5){
                _modal.find('.up-pic img').eq(0).attr('src', c.imgurl + data.pic);
                _modal.find('input[name="pic"]').eq(0).val(data.pic);
                if(data.iconAllViewPic){
                  _modal.find('.up-pic img').eq(1).attr('src', c.imgurl + data.iconAllViewPic);
                  _modal.find('input[name="pic"]').eq(1).val(data.iconAllViewPic);
                }
                _modal.find('select[name="linkType"]').val(data.linkType);
                _modal.find('input[name="linkTo"]').val(data.linkTo);
                if ([1, 6, 7, ''].indexOf(data.linkType) > -1) {
                  _modal.find('input[name="linkTo"]').attr('disabled', 'disabled');
                } else {
                  _modal.find('input[name="linkTo"]').removeAttr('disabled');
                }
              }else {
                _modal.find('select[name="linkType"]').val(data.linkType);
                _modal.find('input[name="linkTo"]').val(data.linkTo);
                _modal.find('.up-pic img').attr('src', c.imgurl + data.pic);
                _modal.find('input[name="pic"]').val(data.pic);
                if ([1, 6, 7, ''].indexOf(data.linkType) > -1) {
                  _modal.find('input[name="linkTo"]').attr('disabled', 'disabled');
                } else {
                  _modal.find('input[name="linkTo"]').removeAttr('disabled');
                }
              }



              if (data.linkType == 5) {
                _modal.find('.js-beans-block').removeClass('none');
                var mbean = data.mbean;
                _modal.find('input[name="limitBuy"]').val(mbean.limitBuy);
                var htmlArr = [];
                $.each(mbean.items, function() {
                  htmlArr.push('<tr data-itemnumid="' + this.itemNumId + '" data-itemid="' + this.itemId + '" data-color="" data-size=""><td>/</td><td>/</td><td>' + this.itemId + '</td><td>/</td><td><input type="text" placeholder="妈豆" name="beans" value="' + this.beans + '">妈豆 <input type="text" placeholder="元" name="money" value="' + this.money + '">元 </td><td><input type="text" placeholder="可用库存" name="stock" value="' + this.stock + '"></td></tr>');
                });
                _modal.find('.beans-table tbody').html(htmlArr.join(''));
                _modal.find('input[name="buyBeginTime"]').val(data.buyBeginTime);
                _modal.find('input[name="buyEndTime"]').val(data.buyEndTime);
              }

              if (type == 14) {
                if (data.applyScope && data.applyScope.prvId) {
                  getPrv(data.applyScope.prvId);
                  showCity(data.applyScope.prvId, data.applyScope.cityId); //市
                  showArea(data.applyScope.cityId, data.applyScope.areaId); //区
                  _modal.find('#assign').trigger('click');
                } else {
                  _modal.find('#all').trigger('click');
                  getPrv('');
                  showCity('');
                  showArea('');
                }
              }

              data.styleNumIds && _modal.find('[name="styleNumIds"]').val(data.styleNumIds);

            }
          }
        });
      } else if (type == 14) {
        getPrv();
        showCity('');
        showArea('');
      }
    },
    /* 10. 保存广告配置信息 */
    fn_saveConfig: function(obj) {
      var self = this,
          c = self.config,
          _frm = $(obj).closest('.modal');
      var bannerType = _frm.data('banner-type'), // 资源位类型
          id = _frm.data('id'),
          reqData = JSON.parse(_frm.data('save-params')),
          name = _frm.find('input[name="name"]').val(),
          linkType = _frm.find('select[name="linkType"]').eq(0).val(), // 落地类型
          linkTo = _frm.find('input[name="linkTo"]').eq(0).val(),
          pic = _frm.find('input[name="pic"]').eq(0).val(),
          beginTime = _frm.find('input[name="beginTime"]').val(),
          endTime = _frm.find('input[name="endTime"]').val();
      $.extend(reqData, {
        'moduleType': c.moduleType,
        'bannerType': bannerType,
        'name': name,
        'title': name,
        'beginTime': beginTime,
        'endTime': endTime,
        'linkType': linkType,
        'pic': pic,
        'linkTo': $.trim(linkTo)
      });

      id && (reqData.id = id); // 已经有广告id的, 一定要传id
      var validate = true;
      if (linkType == 5) { // 落地类型为妈豆商品
        var items = [];
        _frm.find('.beans-table tbody tr').each(function() {
          var _item = $(this);
          items.push({
            'itemNumId': _item.data('itemnumid'),
            'colorName': '',
            'sizeName': '',
            'itemId': _item.data('itemid'),
            'beans': _item.find('input[name="beans"]').val(),
            'money': _item.find('input[name="money"]').val(),
            'stock': _item.find('input[name="stock"]').val()
          });
        });
        reqData.buyBeginTime = _frm.find('input[name="buyBeginTime"]').val();
        reqData.buyEndTime = _frm.find('input[name="buyEndTime"]').val();
        reqData.mbean = {
          limitBuy: _frm.find('input[name="limitBuy"]').val(),
          items: items
        };

        // 校验妈豆商品填写状态 数量及价格的合法性  待写
        if (isForm.isTrim(reqData.mbean.limitBuy)) {
          Toast.show("限购数不能为空");
          _frm.find('input[name="limitBuy"]').focus();
          return false;
        } else if (isForm.isTrim(reqData.buyBeginTime)) {
          Toast.show("开抢时间不能为空");
          _frm.find('input[name="buyBeginTime"]').focus();
          return false;
        } else if (isForm.isTrim(reqData.buyEndTime)) {
          Toast.show("抢购结束时间不能为空");
          _frm.find('input[name="buyEndTime"]').focus();
          return false;
        } else if (new Date("2015/01/01 " + reqData.buyBeginTime) > new Date("2015/01/01 " + reqData.buyEndTime)) {
          Toast.show("开始时间不能大于结束时间!");
          return false;
        }
      }

      if (bannerType == 19 || bannerType == 21 || bannerType == 22) { // 资源位类型为吊顶栏19   ceilMore{linkType,linkTo,pic}
        reqData.styleNumIds = $.trim(_frm.find('[name="styleNumIds"]').val());
        reqData.styleNumIds = reqData.styleNumIds.split(',').unique().toString();
        if (!/^(\,?\d+\,?)+$/.test(reqData.styleNumIds)) {
          Toast.show('商品ID只能为数字,并以英文“,”隔开!');
          validate = false;
        }
        var maxlen = 9999; // 最大商品数量;
        // if(bannerType == 19 || bannerType == 24){
        // 	maxlen = 100; // 吊顶栏允许填写100个商品id;
        // }
        //   if(bannerType == 22){
        //     maxlen = 200; // 吊顶栏允许填写100个商品id;
        //   }
        if (reqData.styleNumIds.split(',').length > maxlen) {
          return Toast.show('最多只能输入' + maxlen + '个商品');
          //validate = false;
        }
        _ceilMore = _frm.find('.js-ceilMore');
        if (_ceilMore.length && _ceilMore.find('[name="linkType"]').val() != "") {
          var ceilMore = {};
          ceilMore.linkType = _ceilMore.find('[name="linkType"]').val();
          ceilMore.linkTo = _ceilMore.find('[name="linkTo"]').val();
          ceilMore.pic = _ceilMore.find('[name="pic"]').val();
          reqData.ceilMore = ceilMore; // 吊顶栏小广告
        }
        // 校验商品IDs是否为空 以及合法性  待写
        if (reqData.styleNumIds == "") {
          _frm.find('[name="styleNumIds"]').focus();
          return Toast.show('商品ID不能为空');
        }
        if (ceilMore && ceilMore.linkType == 3 && !isForm.isURL(ceilMore.linkTo)) {
          return Toast.show('请填写正确的URL地址');
        }
      }

      if (bannerType == 24) { // 商品广告横排
        reqData.styleNumIds = $.trim(_frm.find('[name="styleNumIds"]').val());
        reqData.styleNumIds = reqData.styleNumIds.split(',').unique().toString();
        if (reqData.styleNumIds == "") {
          _frm.find('[name="styleNumIds"]').focus();
          return Toast.show('商品ID不能为空');
        }
        if (!/^(\,?\d+\,?)+$/.test(reqData.styleNumIds)) {
          Toast.show('商品ID只能为数字,并以英文“,”隔开!');
          validate = false;
        }
        if (reqData.styleNumIds.split(',').length > 20) {
          Toast.show('最多只能输入20个商品');
          validate = false;
        }
      }

      if (bannerType == 20) { // 图片广告横排  horizonAds [{linkType,linkTo,pic}]
        var horizonAds = [];
        $.each(_frm.find('.js-horizonAds'), function(i, o) {
          if ($(o).find('[name="linkType"]').val() != "") {
            if ($(o).find('[name="pic"]').val() == '') {
              Toast.show('有落地类型对应的广告图没有上传哦~');
              validate = false;
              return false;
            }
            if ([1, 6, 7, ''].indexOf(+$(o).find('[name="linkType"]').val()) == -1 && $(o).find('[name="linkTo"]').val() == '') {
              Toast.show('有落地类型对应的落地页没有填写哦~');
              validate = false;
              return false;
            }
            horizonAds.push({
              linkType: $(o).find('[name="linkType"]').val(),
              linkTo: $(o).find('[name="linkTo"]').val(),
              pic: $(o).find('[name="pic"]').val()
            });
          }
        });
        reqData.horizonAds = horizonAds;
        reqData.linkType = _frm.find('.js-ceil-more [name="linkType"]').val() || '';
        reqData.linkTo = _frm.find('.js-ceil-more [name="linkTo"]').val() || '';
        reqData.pic = _frm.find('.js-ceil-more [name="pic"]').val() || '';
      }

      if (bannerType == 14) { // 人群定向 applyScope {isAll,prvId,cityId,areaId}
        var applyScope = {};
        if (_frm.find('[name="isAll"]:checked').val() == "") {
          if (_frm.find('[name="prvId"]').val() == '') {
            Toast.show('请选择指定区域');
            validate = false;
          }
          applyScope = {
            prvId: _frm.find('[name="prvId"]').val(),
            cityId: _frm.find('[name="cityId"]').val(),
            areaId: _frm.find('[name="areaId"]').val()
          };
        } else {
          applyScope = {
            isAll: 1
          };
        }
        reqData.applyScope = applyScope;
      }

      if(bannerType == 27){
        reqData.popUpDirectTo = _frm.find('[name="popUpDirectTo"]:checked').val();
      }

      if(bannerType == 5){
        reqData.iconAllViewPic = _frm.find('[name="pic"]').eq(1).val();

      }
      reqData.srcId = HOME_CONFIG.config.navId;

      // 校验
      if (reqData.beginTime == "") {
        _frm.find('input[name="beginTime"]').focus();
        return Toast.show('开始时间不能为空~');
      }
      if (reqData.endTime == "") {
        _frm.find('input[name="endTime"]').focus();
        return Toast.show('结束时间不能为空~');
      }
      if (new Date(reqData.beginTime) > new Date(reqData.endTime)) {
        Toast.show("开始时间不能大于结束时间!");
        return false;
      }
      if (linkType == 3 && reqData.linkTo && !isForm.isURL(reqData.linkTo)) {
        return Toast.show('请填写正确的URL地址');
      }
      if ([20, 21, 22, 24].indexOf(+bannerType) == -1 && linkType == '') {
        Toast.show('请选择落地类型');
        validate = false;
      }
      if (linkType !== '' && reqData.pic == '') {
        Toast.show('请选择广告图片');
        validate = false;
      }
      if(bannerType == 5 && reqData.iconAllViewPic === ''){
        return Toast.show('请上传icon大图');
      }
      if (['1', '6', '7', ''].indexOf(linkType) == -1 && linkTo === '') {
        Toast.show('请填写落地类型对应的落地页');
        validate = false;
      }
      if (!validate) return false;
      if (name === "") {
        Toast.show('广告名称不能为空');
        _frm.find('input[name="name"]').focus();
        return;
      }
      // return console.log(JSON.stringify(reqData));
      Matrix.JSON({
        showLoad: true,
        type: "POST",
        url: root + HOME_CONFIG.config.reqUrl.saveConfig,
        val: {
          'json': JSON.stringify(reqData)
        },
        fun: function(res) {
          if (res.success) {
            Toast.show('保存成功');
            $('.modal:visible').modal('hide');
            setTimeout('location.reload()', 1000);
          } else {
            alert(JSON.stringify(res));
          }

        }
      });
    },
    /**
     * 校验
     */
    validate: function(data) {
      var flag = true;
      return flag;
    },

    /**
     * [UIShot description]
     * @type {Object}
     */
    UIShot: {
      container: {
        AD_Container: $('.MA-putin-block'),
      },
      config: {
        noStatusArr: [2, 3, 4, 5, 14, 23], // 没有上下线功能资源位类型
        noAddArr: [0, 1, 2, 23], // 不能增加资源位的类型
      },
      /**
       * [buildItem 动态创建配置资源位的结构]
       * @param  {[number]} type  [UI类型,'CONFIG':资源位类型配置模块,'ADD_CONFIG':资源位配置添加模块,number:投放页资源位类型值]
       * @param  {[obj]} data     [type = "ADD_CONFIG"    {bannerType: 1,groupName:'顶部banner',isOnline:1,bannerGroup:[]}  banners没有时表示新增,不需要填充数据
       *                           type = "CONFIG"        {bannerType: 2,limit:1,name="闪屏广告"}
       *                           type = number(资源位类型)   {id:1112,bannerId:3123,bannerName:'爆款推荐',weight:'位置'}]
       * @return {[dom obj]}      [单项 html dom]
       */
      buildItem: function(type, data) {
        var self = this,
            c = self.config,
            htmlArr = [],
            dom = null,
            item = null,
            banners = data.banners,
            groupName = data.groupName,
            isOnline = data.status,
            px = data.px == undefined ? 20 : data.px;
        if (banners && banners.length === 1) {
          var banner = banners[0];
        }
        // <div class="flash">    2  闪屏
        // <div class="swiper">   14 轮播图模块
        // <ul class="icon">      5  icon模块
        // <div class="move">     并列两宫格 并列三宫格 并列六宫格 并列九宫格 并列四宫格 组合三宫格 组合五宫格 组合七宫格 通栏 吊顶栏 横排广告展示 附近门店 轮播banner
        var typeObj = HOME_CONFIG.getSrcObjById(type);
        if (type == 3 || type == 4) {
          // 不显示
        } else if (type == 1 || type == 2 || type == 27) {
          htmlArr.push('<div class="flash"></div>');
        } else if (type == 5) {
          htmlArr.push('<ul class="icon">');
          htmlArr.push('<div class="move-title"><h2>' + (groupName || typeObj.name) + '- 间隔' + px + 'px</h2><div class="move-btn"><span class="up js-bg">背景</span> <span class="up js-px">间隔</span></div></div>');
          htmlArr.push('</ul>');
        } else if (type == 14) {
          htmlArr.push('<div class="swiper"></div>');
        } else {
          htmlArr.push('<div class="move">');
          htmlArr.push('<div class="move-title"><h2>' + (groupName || typeObj.name) + '- 间隔' + px + 'px</h2><div class="move-btn"><span class="up js-px">间隔</span> <span class="up js-up">上移</span> <span class="down js-down">下移</span></div></div>');
          htmlArr.push('</div>');
        }

        dom = $(htmlArr.join(''));
        dom.addClass('js-item').data({
          'banner-type': type,
          'root-order': data.rootOrder,
          'batch-id': data.batchId || '',
          'bg-image-id': data.bgImageId || ''
        });
        var itemArr = [];
        switch (type) {
          case 0: // 0,"附近门店"
            itemArr.push('<div class="banner"></div>');
            break;
          case 1: // 1,"为您优选"
            itemArr.push('<strong class="name">为您优选</strong>');
            break;
          case 2: // 2,"闪屏广告"
            itemArr.push('<div class="tools"></div><strong class="name">闪屏广告</strong>');
            break;
          case 3: // 一级导航 不显示
            break;
          case 4: // 二级导航 不显示
            break;
          case 5: // 图标icon
            $.each(banners, function(i, o) {
              itemArr.push('<li><a href="javascript:;"><div class="tools"></div><strong class="name">' + (o.bannerName || 'icon' + (i + 1)) + '</strong></a></li>')
            });
            break;
          case 6: // 组合 3宫格
            itemArr.push('<div class="group">');
            itemArr.push('<div class="max"><div class="tools"></div><strong class="name">' + (banners[0].bannerName || '坑位1') + '</strong></div>');
            itemArr.push('<ul>');
            for (i = 1; i <= 2; i++) {
              itemArr.push('<li> <div class="tools"></div><strong class="name">' + (banners[i].bannerName || '坑位' + (i + 1)) + '</strong> </li>');
            }
            itemArr.push('</ul></div>');
            break;
          case 7: // 组合 5宫格
            itemArr.push('<div class="group group-fives">');
            itemArr.push('<div class="max"><div class="tools"></div><strong class="name">' + (banners[0].bannerName || '坑位1') + '</strong></div>');
            itemArr.push('<ul>');
            for (i = 1; i <= 4; i++) {
              itemArr.push('<li> <div class="tools"></div><strong class="name">' + (banners[i].bannerName || '坑位' + (i + 1)) + '</strong> </li>');
            }
            itemArr.push('</ul></div>');
            break;
          case 8: // 组合 7宫格
            itemArr.push('<div class="group-seven">');
            itemArr.push('<div class="fives">');
            itemArr.push('<div class="max"><div class="tools"></div><strong class="name">' + (banners[0].bannerName || '坑位1') + '</strong></div>');
            itemArr.push('<ul>');
            for (i = 1; i <= 4; i++) {
              itemArr.push('<li> <div class="tools"></div><strong class="name">' + (banners[i].bannerName || '坑位' + (i + 1)) + '</strong> </li>');
            }
            itemArr.push('</ul></div>');
            itemArr.push('<ol class="and">');
            for (i = 5; i <= 6; i++) {
              itemArr.push('<li> <div class="tools"></div><strong class="name">' + (banners[i].bannerName || '坑位' + (i + 1)) + '</strong> </li>');
            }
            itemArr.push('</ol>');
            itemArr.push('</div>');
            break;
          case 9: // 并列 2宫格
          case 10: // 并列 3宫格
          case 11: // 并列 4宫格
          case 12: // 并列 6宫格
          case 13: // 并列 9宫格
            if (type == 9 || type == 10) {
              itemArr.push('<ul class="and">');
            } else if (type == 12 || type == 13) {
              itemArr.push('<ul class="and and-69">');
            } else if (type == 11) {
              itemArr.push('<ul class="and and-four">');
            }
            $.each(banners, function(i, o) {
              itemArr.push('<li><div class="tools"></div><strong class="name">' + (o.bannerName || '坑位' + (i + 1)) + '</strong></li>');
            });
            itemArr.push('</ul>');
            break;
          case 14: // 首页顶部轮播banner
            itemArr.push('<ul>');
            $.each(banners, function(i, o) {
              itemArr.push('<li ' + (i === 0 ? 'class="in"' : '') + '"><strong class="name">' + o.bannerName + '</strong><div class="tools"></div></li>');
            });
            itemArr.push('</ul>');
            itemArr.push('<ol>');
            for (var j = 1; j <= banners.length; j++) {
              itemArr.push('<li ' + (j == 1 ? 'class="hover"' : '') + '>' + j + '</li>');
            }
            itemArr.push('</ol>');
            break;
          case 15: // 活动banner（非轮播）
          case 16: // 大型活动banner
          case 17: // 小蛮腰
          case 18: // 文字导航banner
          case 21: // 单楼层
          case 22: // 双楼层
            itemArr.push('<div class="banner"><div class="tools"></div><strong class="name">' + (banner.bannerName || groupName) + '</strong></div>');
            break;
          case 19: // 吊顶栏
            itemArr.push('<div class="basket"><dl><dt><div class="tools"></div></dt><dd><s></s><s></s><s></s><s></s><s></s></dd></dl><strong class="name">' + (banner.bannerName || groupName) + '</strong></div>');
            break;
          case 20: // 横排广告
          case 24: // 横排商品
            itemArr.push('<div class="items"><s></s><s></s><s></s><s></s><s></s><div class="tools"></div><strong class="name">' + (banner.bannerName || groupName) + '</strong></div>');
            break;
          case 23: // H5页面投放
            // itemArr.push('');
            break;
          case 25: // 一级页面轮播banner
            itemArr.push('<div class="swiper"><ul>');
            $.each(banners, function(i, o) {
              itemArr.push('<li ' + (i === 0 ? 'class="in"' : '') + '"><strong class="name">' + o.bannerName + '</strong><div class="tools"></div></li>');
            });
            itemArr.push('</ul>');
            itemArr.push('<ol>');
            for (var j = 1; j <= banners.length; j++) {
              itemArr.push('<li ' + (j == 1 ? 'class="hover"' : '') + '>' + j + '</li>');
            }
            itemArr.push('</ol></div>');
            break;
          case 27:
            itemArr.push('<div class="tools"></div><strong class="name">弹窗广告</strong>');
            break;
          default:
            break;
        }
        dom.append(itemArr.join(''));
        $.each(dom.find('.tools'), function(i, o) {
          var b = banners[i],
              _this = $(o),
              bannerName = b.bannerName;
          if (!bannerName) {
            // 用于弹窗显示
            bannerName = banners.length > 1 ? groupName + ' - 坑位' + (i + 1) : groupName;
          }
          // 用于保存具体广告时获取
          _this.data({
            'id': b.id || '',
            'banner-id': b.bannerId,
            'banner-name': bannerName,
            'weight': b.weight
          });
          // 判断上下线状态
          if (isOnline) {
            // 判断是否已配置具体广告
            if (b.id) {
              _this.append('<span class="label label-info js-show-config"><s class="icon-edit"></s>编辑</span>');
            } else {
              _this.append('<span class="label label-success js-show-config"><s class="icon-plus"></s>添加</span>');
            }
          } else {
            if (b.id) {
              _this.append('<span class="label js-show-config"><s class="icon-edit"></s>未上线</span>');
            } else {
              _this.append('<span class="label js-show-config"><s class="icon-plus"></s>添加</span>');
            }
          }
        });

        return dom;
      },
      /**
       * [buildSourceItem 资源位管理页面渲染]
       * @param  {[json]} srcObj [description]
       * @return {[dom obj]}     [description]
       */
      buildSourceItem: function(srcObj) {
        var htmlArr = [],
            dom = null,
            srcType = srcObj.bannerType,
            data = srcObj || null,
            limit = srcObj.limit;
        var colspan = 2,
            moduleType = HOME_CONFIG.config.moduleType;
        var typeObj = HOME_CONFIG.getSrcObjById(srcType);
        if (limit == undefined) {
          if (data.linkType == 10) {
            // 门店
          } else if (data.bannerId || data.batchId) {
            htmlArr.push('<tr data-banner-id="' + (data.bannerId || '') + '" data-batch-id="' + (data.batchId || '') + '" data-isvalid="' + (data.isValid || '') + '">');
            htmlArr.push('<td><input type="text" maxlength="20" value="' + data.bannerName + '" placeholder="资源位名称" name="bannerName"></td>');
            if ([14, 3, 4, 5, 25].indexOf(srcType) > -1) {
              htmlArr.push('<td><input type="text" maxlength="2" value="' + (data.orderBy) + '" placeholder="排序" class="span5" name="orderBy"></td>');
            }
            if (srcType == 3) {
              // 一级导航可以配置图片
              htmlArr.push('<td><a href="javascript:;" class="btn btn-danger btn-mini js-leafs-del">删除</a> <a href="javascript:;" class="btn btn-info btn-mini js-update-status">' + (data.isValid ? '隐藏' : '显示') + '</a></td>');
              htmlArr.push('<td>');
              if (data.pic) {
                htmlArr.push('<a href="javascript:;" class="btn btn-inverse btn-mini upload-pic js-upload-pic"><span><img src="' + VM.imgurl + data.pic + '"></span>修改图片</a> <a href="javascript:;" class="btn btn-warning  btn-mini js-delete-pic">清除</a>');
                htmlArr.push('<input type="hidden" name="navPic" value="' + data.pic + '">');
              } else {
                htmlArr.push('<a href="javascript:;" class="btn btn-inverse btn-mini upload-pic js-upload-pic">配置图片</a>');
              }
              htmlArr.push('</td>');
              htmlArr.push('<td>');
              if (data.pic2) {
                htmlArr.push('<a href="javascript:;" class="btn btn-inverse btn-mini upload-pic js-upload-pic2"><span><img src="' + VM.imgurl + data.pic2 + '"></span>修改图片</a> <a href="javascript:;" class="btn btn-warning  btn-mini js-delete-pic">清除</a>');
                htmlArr.push('<input type="hidden" name="navPic2" value="' + data.pic2 + '">');
              } else {
                htmlArr.push('<a href="javascript:;" class="btn btn-inverse btn-mini upload-pic js-upload-pic2">配置图片</a>');
              }
              htmlArr.push('</td>');
              htmlArr.push('<td><input type="text" maxlength="300" value="' + (data.navLevelWidth || 0) + '" placeholder="宽度" class="span5" name="navLevelWidth"></td>');
            } else {
              htmlArr.push('<td><a href="javascript:;" class="btn btn-danger btn-mini js-leafs-del">删除</a></td>');
            }
            htmlArr.push('</tr>');
          } else {
            htmlArr.push('<tr>');
            htmlArr.push('<td><input type="text" maxlength="20" value="' + typeObj.name + '" placeholder="资源位名称" name="bannerName"></td>');
            if ([14, 3, 4, 5, 25].indexOf(srcType) > -1) {
              htmlArr.push('<td><input type="text" maxlength="2" value="" placeholder="排序" class="span5" name="orderBy"></td>');
            }
            htmlArr.push('<td><a href="javascript:;" class="btn btn-danger btn-mini js-leafs-del">删除</a> ');

            // if (srcType == 3) {
            //   htmlArr.push('<a href="javascript:;" class="btn btn-info btn-mini js-update-status">隐藏</a>');
            // }
            htmlArr.push('</td>');

            if (srcType == 3) {
              // 一级导航可以配置图片
              htmlArr.push('<td><a href="javascript:;" class="btn btn-inverse btn-mini upload-pic js-upload-pic">配置图片</a></td>');
              htmlArr.push('<td><a href="javascript:;" class="btn btn-inverse btn-mini upload-pic js-upload-pic2">配置图片</a></td>');
              htmlArr.push('<td><input type="text" maxlength="300" value="" placeholder="宽度" class="span5" name="navLevelWidth"></td>');
            }
            htmlArr.push('</tr>');
          }
          dom = $(htmlArr.join(''));
          if (data) {
            dom.data({
              'banner-id': data.bannerId,
              'batch-id': data.batchId,
              'isvalid': data.isValid
            });
          }
          // console.log(htmlArr.join(''));

        } else if (srcObj.limit > 0) {
          // 初始化资源位
          htmlArr = [
            '<div class="item">',
            '<div class="widget-title">',
            '<a data-parent="#MA-have-leafs" data-toggle="collapse" href="#collapse-' + srcType + '" class="">',
            '<span class="icon"><i class="icon-arrow-right"></i></span><h5>' + srcObj.name + '-' + srcType + '</h5>',
            '</a>'
          ];
          // 二级导航资源位有 [选择该模块]按钮
          if (moduleType == 2) {
            htmlArr.push('<a href="javascript:;" class="btn btn-mini btn-success js-module-online" data-isonline="">选择该模块</a>');
          }
          htmlArr.push('</div>');

          htmlArr.push('<div id="collapse-' + srcType + '" class="widget-content nopadding in collapse">');
          htmlArr.push('<div class="form-horizontal">');
          if (moduleType != 2 && [2, 3, 4, 5, 14, 23].indexOf(srcType) < 0) {
            // 部分资源位类型 和 二级导航下的资源位类型没有 "上下线" 按钮
            htmlArr.push('<div class="control-group">');
            htmlArr.push('<label class="control-label">功能开关：</label>');
            htmlArr.push('<div class="controls js-online">');
            htmlArr.push('<a href="javascript:;" class="btn btn-danger js-leafs-online">下线</a>');
            htmlArr.push('<span class="help-inline">(该功能当前为：<span class="label label-success">上线状态</span>)</span>');
            htmlArr.push('</div>');
            htmlArr.push('</div>');
          }
          if ([0, 1, 2, 23, 29].indexOf(srcType) > -1) {
            // 附近门店/为您优选/闪屏广告 只可上下线
          } else {
            htmlArr.push('<div class="control-group">');
            htmlArr.push('<label class="control-label">附属位置：</label>');
            htmlArr.push('<div class="controls row-fluid">');
            htmlArr.push('<div class="span7"><table class="table table-text-center MA-have-leafs">');
            if (srcType == 3) {
              // 一级导航/二级导航可配置图片/排序
              htmlArr.push('<thead> <tr> <th width="220">名称</th> <th width="100">排序</th> <th>操作</th> <th>图片配置</th><th>6p图片配置</th><th width="100">宽度</th></tr> </thead>');
              colspan = 6;
            } else if ([5, 14, 4, 25].indexOf(srcType) > -1) {
              // 图标ICON/顶部轮播banner可配置排序
              htmlArr.push('<thead> <tr> <th width="220">名称</th> <th width="100">排序</th> <th>操作</th> </tr> </thead>');
              colspan = 3;
            } else {
              htmlArr.push('<thead> <tr> <th width="220">名称</th> <th>操作</th> </tr> </thead>');
            }
            htmlArr.push('<tbody>');
            if (srcType == 3) {
              htmlArr.push('<tr> <td><span>门店</span></td> <td><span>999</span></td> <td><a href="javascript:;" class="btn btn-info btn-mini js-update-status">显示</a></td> <td></td><td></td><td></td> </tr>');
            }
            htmlArr.push('</tbody> <tfoot> <tr>');
            htmlArr.push('<td colspan="' + colspan + '">');
            htmlArr.push('<button data-for="#type_' + srcType + '" class="btn btn-info js-leafs-new">增加</button> ');
            htmlArr.push('<button data-for="#type_' + srcType + '" class="btn btn-success js-leafs-save">保存</button>');
            htmlArr.push('</td> </tr> </tfoot> </table></div>');
            htmlArr.push('<div class="span5">  <img src="http://s.mamhao.cn/admin/bootstrap/img/type_' + srcType + '.png"></div>');
            htmlArr.push('</div> </div>');
          }
          htmlArr.push('</div></div></div>');
          dom = $(htmlArr.join(''));
          dom.data({
            'limit': srcObj.limit,
            'banner-type': srcType
          }).attr('id', 'type_' + srcType);
        }
        return dom;
      },
      /**
       * [buildModal 动态创建配置广告内容的模态窗口]
       * @param  {[type]} type [description]
       * @param  {[type]} data [description]
       * @return {[type]}      [description]
       */
      buildModal: function(type, data) {
        return null;
      }
    }
    // 效果预览
  };

  window.HOME_CONFIG = HOME_CONFIG;
})(jQuery);
