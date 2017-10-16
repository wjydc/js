/**
 * sales-audit.js
 * 促销审核
 * by wml
 */
;
(function() {
  var page = {
    config: {},
    eles: {},
    init: function() {
      var self = this,
        c = self.config,
        o = self.eles;
      o.detailModal = $('#salesDetail');  // 促销详情弹窗
      o.auditBtn = $('.js-audit');        // 审核按钮
      o.delBtn = $('.js-del');            // 删除按钮
      o.detailBtn = $('.js-detail');      // 查看详情按钮
      
      o.auditBtn.on('click', function() {
        var status = $(this).data('option'),
          pid = $(this).closest('tr').data('id');
        $('#modal-confirm').modal('show').find('.modal-body p').html(status == 1?'是否确定通过该促销活动':'是否拒绝该促销活动');
        $('.btn-confirm').off('click').on('click',function(){
          self.audit(pid, status);
        });
      });
      o.delBtn.on('click', function() {
        var id = $(this).closest('tr').data('id');
        $('#modal-confirm').modal('show');
        $('.btn-confirm').off('click').on('click',function(){
          self.delPromotion(id);
        });
      });
      o.detailBtn.on('click', function() {
        self.showDialog($(this).closest('tr').data('id'));
      });
    },
    /**
     * 审核促销政策
     * @param  {[string]} promotionId [促销政策ID]
     * @param  {[string]} status      [操作 1:通过,2:拒绝]
     */
    audit: function(promotionId, status) {
      Matrix.JSON({
        showLoad: true,
        type: "POST",
        url: root + "/promotion/approvalPromotion.do",
        val: {
          "reservedNo": promotionId,
          "approval": status
        },
        fun: function(res) {
          if (res.success) {
            Toast.show(res.msg);
            setTimeout(function() {
              location.reload();
            }, 1000);
          }
        }
      });
    },
    /**
     * 删除促销政策
     * @param  {[string]} promotionId [促销政策ID]
     */
    delPromotion: function(promotionId) {
      Matrix.JSON({
        showLoad: true,
        type: "POST",
        url: root + "/promotion/deletePromotion.do",
        val: {
          "reservedNo": promotionId
        },
        fun: function(res) {
          if (res.success) {
            Toast.show(res.msg);
            setTimeout(function() {
              location.reload();
            }, 1000);
          }
        }
      });
    },
    createGoodsDom: function(goodsArr,type) {
      var domArr = [];
      for (i = 0; i < goodsArr.length; i++) {
        var goodsHtmlArr = [];
        goodsHtmlArr.push('<tr class="style-' + goodsArr[i].styleNumId + '">');
        goodsHtmlArr.push('<td>' + goodsArr[i].styleNumId + '</td>');
        goodsHtmlArr.push('<td>' + goodsArr[i].styleId + '</td>');
        if (goodsArr[i].sku) {
          var sku = goodsArr[i].sku;
          goodsHtmlArr.push('<td class="sku"><ul>');
          for (j = 0; j < sku.length; j++) {
            goodsHtmlArr.push('<li>' + sku[j].itemId + '(￥' + (sku[j].price || '') + ')</li>');
          }
          goodsHtmlArr.push('</ul></td>');
        } else {
          goodsHtmlArr.push('<td>' + goodsArr[i].itemId + '(￥' + (goodsArr[i].price || '') + ')</td>');
        }
        goodsHtmlArr.push('<td>' + goodsArr[i].styleTitle + '</td>');
        goodsHtmlArr.push('<td>' + goodsArr[i].count + '</td>');
        if (type == 4) {
          goodsHtmlArr.push('<td>' + goodsArr[i].discountAmount / 100 + '</td>');
        }
        goodsHtmlArr.push('</tr>');
        domArr.push(goodsHtmlArr.join(''));
      }
      return domArr;
    },
    /**
     * 获取促销详情
     * @param  {[type]} id [description]
     */
    showDialog: function(id) {
      var self = this,
        c = self.config,
        o = self.eles;
      Matrix.JSON({
        showLoad: true,
        type: "POST",
        url: root + "/promotion/detailApproval.do",
        val: {
          "reservedNo": id
        },
        fun: function(res) {
          console.log(JSON.stringify(res));
          o.detailModal.css({
            "width": "720px",
            "marginLeft": "-360px"
          }).modal('show');
          $('#giftTable, #goodsTable').hide();
          o.detailModal.find('.form-horizontal .js-prop').each(function() {
            $(this).html(res[$(this).attr('name')]);
          });
          if(res.citys){
            $('[name="area"]').html(res.cityNames.toString());
          }else{
            $('[name="area"]').html('全国参与');
          }
          var promotionType = res.promotionType;
          if(promotionType == 3){
            $('#goodsTable table tbody').html(self.createGoodsDom(res.fullFree.fullFreeGoods,promotionType));
            $('#goodsTable').show();
          }else if(promotionType == 4){
            $('#goodsTable .widget-title h5').html('已选组合');
            if($('#goodsTable table thead tr th').length < 6) $('#goodsTable table thead tr').append('<th>优惠金额</th>');
            $('#goodsTable table tbody').html(self.createGoodsDom(res.comboPromotion.comboPromotionGoods,promotionType));
            $('#goodsTable').show();
          }else if(promotionType == 6){
            $('#goodsTable .widget-title h5').html('已选主商品');
            $('#goodsTable table tbody').html(self.createGoodsDom([res.giftPromotion],promotionType));
            $('#giftTable table tbody').html(self.createGoodsDom(res.giftPromotion.giftPromotionGoods,promotionType));
            $('#goodsTable').show();
            $('#giftTable').show();
          }
        }
      });
    }
  };
  page.init();
})();