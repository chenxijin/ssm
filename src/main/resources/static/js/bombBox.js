var clk = 'click',
	bBox = $('.bombBox');
$(document).off(clk, '.cancel,.bombBox h2 .icon-guanbi1').on(clk, '.cancel,.bombBox h2 .icon-guanbi1', function() { //关闭弹框
	$('.curtain').hide();
	$(this).parents('.bombBox').hide();
});

function mtk(els, target, bBox) { //打开弹框
	$(document).off('click', els).on('click', els, function(e) {
		e.stopPropagation();
		bBox.hide();
		target.show();
		$('.curtain').show();
	})
}
$(document).off(clk, '.subOpt .plus').on(clk, '.subOpt .plus', function() { //录入薄弱科目
	$('.subOptWrapIn').append('<div class="fl subOpt positionR weakSubject"><select class="select subject"><option value="">请选择</option></select><select class="select goal"><option value="">请选择满分制</option><option value="200满分">200满分</option><option value="160满分">160满分</option><option value="150满分">150满分</option><option value="120满分">120满分</option><option value="110满分">110满分</option><option value="100满分">100满分</option><option value="90满分">90满分</option></select><select class="select"><option value="">区间</option><option value="10±10">10±10</option><option value="20±10">20±10</option><option value="30±10">30±10</option><option value="40±10">40±10</option><option value="50±10">50±10</option><option value="60±10">60±10</option><option value="70±10">70±10</option></select><div class="plus positionA"><i class="iconfont icon-jiahao"></i></div></div>');
	$('.subOptWrapIn  .plus').hide();
	$.ajax({
		url: 'student/queryParam', //参数表学科
		dataType: 'json',
		type: 'post',
		data: {
			para: 'SUBJECT'
		},
		success: function(d) {
			var s = d.data,
				ss = '';
			for(var j = 0; j < s.length; j++) {
				ss += '<option value="' + s[j].paramtext + '">' + s[j].paramtext + '</option>';
			}
			$('.subject').append(ss);
		}
	});
	setTimeout(function() {
		$('.subOptWrapIn .plus').last().show();
	}, 1);
})
$(document).off(clk, '.radio input[type="radio"]').on(clk, '.radio input[type="radio"]', function() { //单选按钮
	$('.radio').removeClass('radioClk');
	$('.radio input[type=radio]:checked').parent('.radio').addClass('radioClk');
})