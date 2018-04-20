//审核合同
function checkOrder(table){
 table.on('tool(test)', function(obj){//查看合同信息
    var c= obj.data;
    var str='';
	if(obj.event === 'checkOrder'){	
		html='<section action="" method="post"><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>姓名/年级</label><p class="orderUname fl">'+c.stuname+'</p><p class="orderGrade fl">'+(c.grade?c.grade:" ")+'</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>签约类型</label><p  class="fl"  >'+c.conkindtext+'</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>合同类型</label><p class="fl">'+c.contypetext+'</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>签约日期</label><div class=" fl">'+layui.util.toDateString(c.ctime, 'yyyy-MM-dd')+'</div></div><section class="clearfix orderMain"><form id="orderForm1" class="fl"><div class="orderDetail orderDetail1"><h3 class="orderType orderType1">'+c.contypetext+'</h3><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>合同编号</label><input type="hidden"  name="id" value="'+c.id+'" class="cid"><input type="text" class="fl CNull" name="cnumber" value="' + (c.cnumber?c.cnumber:"") + '" placeholder="请输入内容"></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>现单价</label><div class="fl"><p>'+c.perprice+'</p></div></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>原单价</label><div class="fl"><p>'+c.forprice+'</p></div></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>签约课时</label><input type="text" class="fl CNull num" name="couersum" value="' + c.couersum + '" placeholder="请输入内容"></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>赠送课时</label><input type="text" class="fl CNull num" name="freesum" value="' + c.freesum + '" placeholder="请输入内容"></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>总价</label><input type="text" class="fl CNull price" name="allprice" value="' + c.allprice + '" placeholder="请输入内容"></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>是否付定金</label><p class="fl">'+(c.isdeposit==="1"?"是":"否")+'</p><p style="margin-left:100px;">'+(c.paydate?timestampToData(c.paydate):"")+'</p><p style="margin-left:100px;">'+(c.deposit?c.deposit:"")+'</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>支付方式</label><div class="fl"><p class="fl">'+c.paytype+'</p><p>'+(c.accountnum?c.accountnum:"")+'</p></div></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>家长姓名</label><p>' + c.contact + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>家长电话</label><p>' + c.cphone + '</p></div></div></form></section></div></section>';
		$('.checkOrder .stuInfForm').html(html);
		$(document).off('change', '.contract input[name=perprice]:visible,.contract input[name=couersum]:visible');
	}
})
 
$(document).off('click','.checkOrder .save').on('click','.checkOrder .save',function(){//通过合同 
var  co=$('.checkOrder');
if(co.attr('review')==='1'){
	layer.load(2);	
	$.ajax({
        url:'/moneyManage/contract/passContract',
        type:'post',
        dataType:'json',
        data:{
        	cid:$('.checkOrder .cid').val()
        },
        success:function(d){
         	layer.close(layer.index);
            layer.msg(d.msg);      
            if(d.code===1){
            	co.hide();
            	co.attr('review','');
				$('.curtain').hide();
            	$('#mystu_tab .tab_current').trigger('click');
            }
        }
    })
}else{
	layer.msg('请先复审信息')
}
})

$(document).off('click','.checkOrder .review').on('click','.checkOrder .review',function(){//复审信息

	if(checkNull($('.CNull'))){
		if(isPositiveInteger($('.num'))){
			if(isPrice($('.price'))){
				layer.load(2);
				$.ajax({
			        url:'moneyManage/contract/confirmCousum',
			        type:'post',
			        dataType:'json',
			        data:{
			        	id:$('.checkOrder .cid').val(),
			        	csum:$('input[name=couersum]').val(),
			        	fsum:$('input[name=freesum]').val(),
			        	allprice :$('input[name=allprice]').val(),
			        	cnumber:$('input[name=cnumber]').val()
			        },
			        success:function(d){
			         	layer.close(layer.index);
			            layer.msg(d.msg);      
			            if(d.code===1){
			            	$('.checkOrder').attr('review','1');
			            }
			        }
			    });				
			}else{
				layer.msg('价格为最多俩位小数数字');
			}
		}else{
			layer.msg('课时请输入数字')
		}	
	}else{
		layer.msg('请填写必填内容')
	}
	
})

$(document).off('click','.checkOrder .cancel').on('click','.checkOrder .cancel',function(){//驳回合同-填写备注
        	var ror=$('.rejectOrderRemark'),
        	 co=$('.checkOrder'),
        	 cur=$('.curtain'),
        	 str='';
	layer.load(2);	
	 $.ajax({
        url:'/moneyManage/contract/checkContractList',
        data:{
        	cid:$('.checkOrder  .cid').val()
        },
        success:function(d){
        	layer.close(layer.index);
        	var da=d.data;
        	if(d.code===1){   		
        		for(var i=0;i<da.length;i++){
        			str+='<tr><td>'+layui.util.toDateString(da[i].checktime, 'yyyy-MM-dd')+'</td><td>'+da[i].content+'</td><td>'+da[i].username+'</td></tr>'
        		}
        		ror.show();
        		ror.find('table tbody').html(str);
        		co.hide();
        		cur.show();
        	}
        }
  })	
})

$(document).off('click','.rejectOrderRemark .save').on('click','.rejectOrderRemark .save',function(){//驳回合同-提交
var ror=$('.rejectOrderRemark'),
    co=$('.checkOrder'),
    cur=$('.curtain');
	layer.load(2);	
	var ta=$('.rejectOrderRemark textarea');
	 $.ajax({
        url:'/moneyManage/contract/refuseContract',
        data:{
        	cid:$('.checkOrder .cid').val(),
        	content:ta.val()
        },
        success:function(d){
        	layer.close(layer.index);
            layer.msg(d.msg);  
        	var da=d.data;
        	if(d.code===1){
        		ror.hide();
        		cur.hide();
        		$('#mystu_tab .tab_current').trigger('click');
        	}
        }
  })
})
}

//渲染图表
function financeCharts(x,yo,yl,t,qf,m,n){
 // 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('eReport'));
option = {
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:qf
    },
    toolbox: {
        show : true
    },
    calculable : true,
    xAxis : [
        {
            type : 'category',
            data : x
        }
    ],
    yAxis : [
        {
            type : 'value',
            name:t,
            nameGap:25,
                 nameTextStyle: {
                    fontSize: 14,
                    color:'#707070'
                }
        }
    ],
    series : [
        {
            name:m,
            type:'bar',
            data:yo,
            color:['#FD625B']
        },
        {
            name:n,
            type:'bar',
            data:yl,
            color:['#FFD401']
        }
    ]
};
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(option);	 	
}

function refundCheckContent(table){//退费审核
	table.on('tool(test)',function(d){
		var layEvent=d.event;
		var str='';
		d=d.data;
		if(layEvent==='refundCheck'){
		str='<div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>姓名/年级</label><p class="orderUname fl">'+d.stuname+'</p><p class="orderGrade fl">'+d.grade+'</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>签约类型</label><p v="1" class="beOrderType">'+d.conkind+'</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>合同类型</label><p class="fl">'+d.contype+'</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>签约日期</label><p class="fl">'+timestampToData(d.ctime)+'</p></div><section class="clearfix orderMain"><form id="orderForm1" class="fl"><div class="orderDetail orderDetail1"><h3 class="orderType orderType1">'+d.contype+'</h3><input type="hidden" name="stuid" class="orderStuid"> <input type="hidden" name="conkind" class="orderConkind CNull"> <input type="hidden" name="contype" class="ordercontype CNull"> <input type="hidden" name="ctime" class="orderCtime"><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>合同编号</label><p class="fl">'+d.cnumber+'</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>现单价</label><p class="fl">'+d.perprice+'</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>签约课时</label><p class="fl">'+d.couersum+'</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>赠送课时</label><p class="fl">'+d.freesum+'</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>总价</label><p class="fl">'+d.allprice+'</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>支付方式</label><div class="fl"><p class="fl">'+d.paytype+'</p><br><p class="fl">'+d.accountnum+'</p></div></div></div></form><form id="orderForm2" class="fl"><div class="orderDetail orderDetail2" style="margin-left:50px"><h3 class="orderType orderType2">退费结算</h3><input type="hidden" name="stuid" class="orderStuid"> <input type="hidden" name="conkind" class="orderConkind CNull"> <input type="hidden" name="contype" class="ordercontype CNull"> <input type="hidden" name="ctime" class="orderCtime"><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>消耗课时</label><p class="fl">'+(Number(d.couersum)+Number(d.freesum)-Number(d.currentsum))+'</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>已消耗课时费</label><p class="fl">'+d.finishfee+'</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>承担税额</label><p class="fl">'+d.tax+'</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>手续费</label><p class="fl">'+d.stepfee+'</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>应退款</label><p class="fl">'+d.bmoney+'</p></div>'+
		'<div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>退款账户</label><div class="fl"><p class="fl">'+d.payment+'</p></div></div>'
		+'<div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>预计到账日期</label><div class="positionR fl achivClWrap" id="div_month_picker"><input type="text" class="layui-input achivClendar" id="achivClendarOrs" placeholder="请选择时间" value="'+timestampToData(d.btime)+'" ><i class="positionA iconfont icon-rili"></i></div></div></div></form></section><script>dateCLs();</script>';
		$('.refundCheck').attr('bid',d.bid);
		$('.refundCheck .stuInfForm>section').html(str);
		}
	})
	
$(document).off('click','.refundCheck .save').on('click','.refundCheck .save',function(e){//通过审核
	var t=$(e.target);
	layer.load(2);
	$.ajax({
		type:'post',
		url:'moneyManage/back/agreeBack',
		datype:'json',
		data:{
			id:$('.refundCheck').attr('bid'),  //列表返的bid
			remark:'预计到账日期 '+$('#achivClendarOrs').val() //（格式“预计到账yyyy-MM-dd”）
		},
		success:function(d){
			layer.close(layer.index);
			layer.msg(d.msg);
			if(d.code===1){
				$('.refundCheck').hide();
				$('.curtain').hide();
				$('#mystu_tab li:eq(1)').trigger('click');
			}
		}
	})
})

$(document).off('click','.refundCheck .cancel').on('click','.refundCheck .cancel',function(e){//驳回审核
	var t=$(e.target);
	$('.refundCheckLoseRemark').show();
	$('.refundCheck').hide();
$.ajax({
		url:"moneyManage/back/queryCheckBackContract",
		type:"post",
		dataType:"json",
		data:{
			id:$('.refundCheck').attr('bid')
		},
		success:function(d){
			var html='',
			d=d.data;
			for(var i=0;i<d.length;i++){
			html+='<tr><td>'+timestampToData(d[i].checktime)+'</td><td>'+d[i].content+'</td><td>'+d[i].user.username+'</td></tr>';			
		}
		$('.refundCheckLoseRemark  tbody').html(html);
		}
	})
})

$(document).off('click','.refundCheckLoseRemark .save').on('click','.refundCheckLoseRemark .save',function(e){//驳回审核备注-确认
	var t=$(e.target);
	$.ajax({
		type:'post',
		url:'moneyManage/back/disagreeBack',
		datype:'json',
		data:{
			id:$('.refundCheck').attr('bid'),  //列表返回的bid  
			content:$('.refundCheckLoseRemark textarea').val()//备注内容
		},
		success:function(d){
			layer.close(layer.index);
			layer.msg(d.msg);
			if(d.code===1){
				$('.refundCheckLoseRemark').hide();
				$('.curtain').hide();
				$('#mystu_tab li:eq(1)').trigger('click');
			}
		}
	})
})

$(document).off('click','.refundCheckLoseRemark .cancel').on('click','.refundCheckLoseRemark .cancel',function(e){//驳回审核备注-取消
	var t=$(e.target);
	$('.refundCheckLoseRemark').hide();
	$('.curtain').hide();
})

$(document).off('click','.refundSubmitBtn').on('click','.refundSubmitBtn',function(e){//确认退费-弹框
	var t=$(e.target);
	var stu=t.attr("stu");
	var str=	'<h2>请确认</h2><p>学员"'+stu+'"的合同退费工作已完成,请确认?</p><div class="clearfix positionA" style="bottom:20px;width: 340px;"><div class="fr clearfix"><button type="button" class="fl cancel OptBtn">取消</button><button type="button"  class="fl save OptBtn">确定</button></div></div>';
	$('.refundCheckSub,.curtain').show();
	$('.refundCheckSub').html(str).attr('bid',t.attr('bid'));
})

$(document).off('click','.refundCheckSub .save').on('click','.refundCheckSub .save',function(e){//确认退费-弹框-确定
	var t=$(e.target);
	layer.load(2);
$.ajax({
		type:'post',
		url:'moneyManage/back/confirmBack',
		datype:'json',
		data:{
			id:$('.refundCheckSub').attr('bid'),  //列表返回的bid  
		},
		success:function(d){
			layer.close(layer.index);
			layer.msg(d.msg);
			if(d.code===1){
				$('.refundCheckSub,.curtain').hide();
				$('#mystu_tab li:eq(2)').trigger('click');
			}
		}
	})
})
}
