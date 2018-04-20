
function oaAjax(url,key,callback){//oaAjax
				$.ajax({
					type:'post',
					dataType:'json',
					url:url,
					data:key,
					success:function(d){
						callback(d);
					}
				})	
}
function scardTableRendering(parms){
				 parms.s.show();
				parms.sa.hide();
			    parms.s.html(parms.str);
			    setTimeout(function(){
				   parms.h=parms.s.children().height();
				if(parms.h>350&&parms.h<900){
					parms.c.height(parms.h+100);
				}else if(parms.h>=900){					
					parms.c.height('1000');
				}else{
					parms.c.height('500');
				}		    	
			    },100)

}
function dismissRecord(){
	$(document).off("click",".operation .DismissRecord").on("click",".operation .DismissRecord",function(e) {
	var t = $(e.currentTarget);
	layer.load(2);
	$.ajax({
		type: "post",
		dataType: "json",
		url: "moneyManage/contract/checkContractList",
		data: {
			cid: t.attr("cid")
		},
		success: function(d) {
			layer.close(layer.index);
			var da = d.data;
			var ror = $(".DismissRecordBox");
			var str = "";
			if (d.code === 1) {
				for (var i = 0; i < da.length; i++) {
					str += "<tr><td>" + timestampToData(da[i].checktime) + "</td><td>" + da[i].content + "</td><td>" + da[i].username + "</td></tr>"
				};
				ror.find("table tbody").html(str)
			}
		}
	});
});
}
//学生卡
function Scard(){
	this.options={//初始参数
	scardNav:'#scardLeftNav li',
	scardShow:'#studentCardShow',
	scardShowA:'#studentCardShowAnother',
	container:'#studentCard'
}	
};
Scard.prototype={
	closeScard:function(){
		$(document).off('click','#studentCardTbtn .icon-cuohao').on('click','#studentCardTbtn .icon-cuohao',function(){
			$('#studentCard').hide();
		})
	},
	topNav:function(){//顶导航
		$(document).off('click','.sctNavMain>li').on('click','.sctNavMain>li',function(e){
			var t=$(e.currentTarget),
				tl=$('.sctNavMain li'),
				tp=$('.teachingPlanDet li'),
				allLi=$('#scardLeftNav li'),
				key=t.attr('key');
				
				tl.removeClass('red');
				tl.find('ul').hide();
				t.addClass('red');
				allLi.removeClass('greyBc');
			switch(key){
				case 'addOrder'://添加合同
				$('.contractSetIn,.curtain').show();
				break;
				case	'upload'://上传附件
				break;
				case	'addGoals'://添加分数
				$('.recordEntry,.curtain').show();
				$('.recordEntry').html('<div class="stuInfTitle"><h2>录入成绩</h2></div><div class="stuInfForm recordEntryForm"><form action="" method="post"><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>姓名</label><p class="name" sid="'+$(".sctName").attr("sid")+'">'+$(".sctName").html()+'</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>考试名称</label><input type="text" class="fl examName" placeholder="请输入内容"></div><div class="clearfix gradeGoal"><label for="" class="fl required"><i class="xh">*</i>科目成绩</label><div class="clearfix gradeGoalItem"><div class="fl positionR"><ul class="clearfix fl"><li class="fl positionR"><select class="grade"><option value="">请选择</option><option value="语文">语文</option><option value="数学">数学</option><option value="英语">英语</option><option value="历史">历史</option><option value="地理">地理</option><option value="生物">生物</option><option value="政治">政治</option><option value="化学">化学</option><option value="物理">物理</option></select><input type="text" class="goals"><div class="plus positionA fl"><i class="iconfont icon-jiahao"></i></div></li></ul></div></div></div><div class="stuInfFoot clearfix"><div class="fr clearfix"><button type="button" class="fl cancel OptBtn">取消</button> <button type="button" class="fl save OptBtn">保存</button></div></div></form></div>');
				break;
				case	'remark'://联系备注
				$('.setInremark,.curtain').show();
				break;
				case	'transfer'://移交客服
				$('.toCustormService,.curtain').show();
				break;
				case	'editStuInfor'://编辑资料
				$('.editStuInfor,.curtain').show();
				break;
				case	'teachingPlan'://教学记录
				if(t.find('ul').is(':visible')){
					t.find('ul').hide();
					tp.removeClass('pink');
				}else{
					t.find('ul').show();					
				}
				break;
			}
		})
		   
		$(document).off('click','.gradeGoal .plus').on('click','.gradeGoal .plus',function(e){//添加分数-加号
		   $('.gradeGoalItem ul').append('<li class="fl positionR"><select class="grade"><option value="">请选择</option><option value="语文">语文</option><option value="数学">数学</option><option value="英语">英语</option><option value="历史">历史</option><option value="地理">地理</option><option value="生物">生物</option><option value="政治">政治</option><option value="化学">化学</option><option value="物理">物理</option></select><input type="text" class="goals"><div class="plus positionA fl"><i class="iconfont icon-jiahao"></i></div></li>');
		   $('.gradeGoalItem ul li').not(':last').find('.plus').remove();
		})
		
		$(document).off('click','.recordEntryForm .save').on('click','.recordEntryForm .save',function(e){//添加分数-提交
			var transcript=[],
			    ggLi=$('.gradeGoalItem li');
			for(var i=0;i<ggLi.length;i++){
				transcript.push({
					subject:ggLi.eq(i).find('select').val(),
					fraction:ggLi.eq(i).find('input').val()
				});
			}
			layer.load(2);
		   $.ajax({
		   	type:'post',
		   	dataType:'json',
		   	data:{
		   		examname:$('.examName').val(),
		   		stuid:$('.recordEntryForm .name').attr('sid'),
		   		transcript:JSON.stringify(transcript)
		   	},
		   	url:'student/insertAmination',
		   	success:function(d){
		   		layer.close(layer.index);
		   		layer.msg(d.msg);
		   		if(d.code===1){
				$('.recordEntry').html('<div class="stuInfTitle"><h2>录入成绩</h2></div><div class="stuInfForm recordEntryForm"><form action="" method="post"><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>姓名</label><p class="name" sid="'+$(".sctName").attr("sid")+'">'+$(".sctName").html()+'</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>考试名称</label><input type="text" class="fl examName" placeholder="请输入内容"></div><div class="clearfix gradeGoal"><label for="" class="fl required"><i class="xh">*</i>科目成绩</label><div class="clearfix gradeGoalItem"><div class="fl positionR"><ul class="clearfix fl"><li class="fl positionR"><select class="grade"><option value="">请选择</option><option value="语文">语文</option><option value="数学">数学</option><option value="英语">英语</option><option value="历史">历史</option><option value="地理">地理</option><option value="生物">生物</option><option value="政治">政治</option><option value="化学">化学</option><option value="物理">物理</option></select><input type="text" class="goals"><div class="plus positionA fl"><i class="iconfont icon-jiahao"></i></div></li></ul></div></div></div><div class="stuInfFoot clearfix"><div class="fr clearfix"><button type="button" class="fl cancel OptBtn">取消</button> <button type="button" class="fl save OptBtn">保存</button></div></div></form></div>');
				$('.recordEntry,.curtain').hide();
		   		}
		   	}
		   })
		})
		
		$(document).off('click','.recordEntryForm .cancel').on('click','.recordEntryForm .cancel',function(e){//添加分数-取消
		  $('.recordEntry').html('<div class="stuInfTitle"><h2>录入成绩</h2></div><div class="stuInfForm recordEntryForm"><form action="" method="post"><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>姓名</label><p class="name" sid="'+$(".sctName").attr("sid")+'">'+$(".sctName").html()+'</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>考试名称</label><input type="text" class="fl examName" placeholder="请输入内容"></div><div class="clearfix gradeGoal"><label for="" class="fl required"><i class="xh">*</i>科目成绩</label><div class="clearfix gradeGoalItem"><div class="fl positionR"><ul class="clearfix fl"><li class="fl positionR"><select class="grade"><option value="">请选择</option><option value="语文">语文</option><option value="数学">数学</option><option value="英语">英语</option><option value="历史">历史</option><option value="地理">地理</option><option value="生物">生物</option><option value="政治">政治</option><option value="化学">化学</option><option value="物理">物理</option></select><input type="text" class="goals"><div class="plus positionA fl"><i class="iconfont icon-jiahao"></i></div></li></ul></div></div></div><div class="stuInfFoot clearfix"><div class="fr clearfix"><button type="button" class="fl cancel OptBtn">取消</button> <button type="button" class="fl save OptBtn">保存</button></div></div></form></div>');
				$('.recordEntry,.curtain').hide();
		})
		
		$(document).off('click','.teachingPlanDet li').on('click','.teachingPlanDet li',function(e){//教学记录
			var t=$(e.currentTarget);
			var tp=$('.teachingPlanDet li'),
				sinfor=$('.sctName'),
				sc=$('#studentCard'),
				key=t.attr('key');
			
			tp.removeClass('pink');
			t.addClass('pink');
			$('.teachingPlanDet').hide();
			switch(key){
				case 'learnDiscuss'://教学讨论会
				$('#scardLeftNav li').removeClass('greyBc');
				$('#studentCardShow,#studentCardShowAnother').hide();
				sc.height(1000);
				$('#studentCardShowOperation').show().html('<div id="teachDiscussionEdit" class="teacherEdit"><form action="" method="post"><h3 class="positionR"><input type="text" class="discuname checkVoid" placeholder="请输入标题"></h3><div class="basicInfor"><span>'+sinfor.html()+'</span><span>'+sinfor.attr("sex")+'</span><span>'+sinfor.attr("grade")+'</span><span>'+sinfor.attr("school")+'</span></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>父母职业</label><textarea name="" class="fl parentprofession checkVoid"></textarea></div><div class="clearfix"><div class="fl clearfix" style="margin-right:56px"><label for="" class="fl">目标学校</label><input type="text" class="fl targetschool"></div><div class="fl clearfix"><label for="" class="fl">期望进步分数</label><input type="text" class="fl expfraction"></div></div><div class="clearfix"><div class="fl clearfix" style="margin-right:56px"><label for="" class="fl"><i class="xh">*</i>报读科目</label><select class="fl subject checkVoid"><option value="">请选择</option><option value="语文">语文</option><option value="数学">数学</option><option value="英语">英语</option><option value="物理">物理</option><option value="化学">化学</option><option value="生物">生物</option><option value="政治">政治</option><option value="历史">历史</option><option value="地理">地理</option></select></div><div class="fl clearfix"><label for="" class="fl"><i class="xh">*</i>与目标差距分数</label><input type="text" class="fl disfraction checkVoid"></div></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>性格特点</label><textarea name="" class="fl character checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>兴趣爱好</label><textarea name="" class="fl hobbies checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>知识遗漏</label><textarea name="" class="fl cuttingcorners checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>教学计划</label><textarea name="" class="fl teachplan checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>顾问签名</label><input type="text" class="fl advisername checkVoid"></div><div class="tdBtn"><button type="button" class="tdCancel">取消</button><button type="button" class="tdSubmit">保存</button></div></form></div>');
				break;
				case 'feedback'://课后反馈
				$('#scardLeftNav li').removeClass('greyBc');
				$('#studentCardShow,#studentCardShowAnother').hide();
				sc.height(1000);
				$('#studentCardShowOperation').show().html('<div id="afterLeasonEidt" class="teacherEdit"><form action="" method="post"><h3 class="positionR"><input type="text" class="anamme checkVoid" placeholder="请输入标题"></h3><div class="basicInfor"><span>'+sinfor.html()+'</span><span>'+sinfor.attr("sex")+'</span><span>'+sinfor.attr("grade")+'</span><span>'+sinfor.attr("school")+'</span></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>报读科目</label><input type="text" class="fl subject checkVoid"></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>平均分</label><input type="text" class="fl average checkVoid"></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>上课内容</label><textarea name="" class="fl content checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>知识点掌握</label><textarea name="" class="fl master checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>辅导重点</label><textarea name="" class="fl coach checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>学生特点</label><textarea name="" class="fl style checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>课堂表现</label><textarea name="" class="fl doing checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>家长需求</label><textarea name="" class="fl demand checkVoid"></textarea></div><div class="tdBtn"><button type="button" class="tdCancel">取消</button> <button type="button" class="tdSubmit">保存</button></div></form></div>');
				break;
				case	'pageAnalysis'://试卷分析
				$('#scardLeftNav li').removeClass('greyBc');
				$('#studentCardShow,#studentCardShowAnother').hide();
				$('#studentCardShowOperation').show().html('<div class="textAnalysis positionR"><h2><input type="text" class="checkVoid" placeholder="请输入标题"></h2><div class="testAnalysisMain positionR"><ul class="clearfix testAnalysishead"><li class="fl" style="width:35%">涉及知识点</li><li class="fl" style="width:25%">常考题型</li><li class="fl" style="width:20%">掌握程度</li><li class="fl" style="width:20%">试卷未考到知识点</li></ul><div class="clearfix testAnalysisContent"><div class="testAnalysisBlock clearfix positionR"><div class="fl testTitleLeft" style="width:10%"><textarea name="" rows="2" cols="12" style="resize:none" class="checkVoid" placeholder="请输入"></textarea></div><div class="fl testMainRight" style="width:90%"><ul class="clearfix"><li class="fl" style="width:30%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li><li class="fl" style="width:30%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li><li class="fl" style="width:20%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li><li class="fl" style="width:20%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li></ul></div><div class="delRow del positionA" style="bottom:4px;right:36px"><i class="iconfont icon-minus-bold"></i></div><div class="plusRow plus positionA" style="bottom:4px;right:6px"><i class="iconfont icon-jiahao"></i></div></div></div><div class="plusCol plus positionA" style="bottom:-38px;left:0"><i class="iconfont icon-jiahao"></i></div><div class="delCol del positionA" style="bottom:-38px;left:30px"><i class="iconfont icon-minus-bold"></i></div></div><div class="testAnalysisBtn"><button type="button" class="cancelA">取消</button> <button type="button" class="save">保存</button></div></div>');
				break;
			}
			e.stopPropagation();
		})
		
		$(document).off('click','#teachDiscussionEdit .tdSubmit').on('click','#teachDiscussionEdit .tdSubmit',function(e){//教学讨论会提交
		var t=$(e.currentTarget);
		var td=$('#teachDiscussionEdit'),
		sinfor=$('.sctName');
		if(checkNull($('.checkVoid'))){
		layer.load(2);	
			$.ajax({
				type:"post",
				url:"student/insertDiscussion",
				dataType:'json',
				data:{
				stuid:sinfor.attr('sid'),
				/**
			     * 教学讨论会名称
			     */
				 discuname:$('#teachDiscussionEdit .discuname').val(),
			    /**
			     * 父母职业
			     */
				 parentprofession:$('#teachDiscussionEdit .parentprofession').val(),
			    /**
			     * 目标学校
			     */
				 targetschool:$('#teachDiscussionEdit .targetschool').val()||'-',
			    /**
			     * 期望分数
			     */
				 expfraction:$('#teachDiscussionEdit .expfraction').val()||'-',
			    /**
			     * 科目
			     */
				 subject:$('#teachDiscussionEdit .subject').val(),
			    /**
			     * 差距分数
			     */
				 disfraction:$('#teachDiscussionEdit .disfraction').val(),
			    /**
			     * 性格
			     */
				 character:$('#teachDiscussionEdit .character').val(),
			    /**
			     * 兴趣爱好
			     */
				 hobbies:$('#teachDiscussionEdit .hobbies').val(),
			    /**
			     * 知识的遗漏
			     */
				 cuttingcorners:$('#teachDiscussionEdit .cuttingcorners').val(),
			    /**
			     * 教学计划
			     */
				 teachplan:$('#teachDiscussionEdit .teachplan').val(),
			    /**
			     * 顾问姓名
			     */
				 advisername:$('#teachDiscussionEdit .advisername').val(),					
				},
				success:function(d){
					layer.close(layer.index);
					layer.msg(d.msg);
					if(d.code===1){
						$('#studentCardShowOperation').html('<div id="teachDiscussionEdit" class="teacherEdit"><form action="" method="post"><h3 class="positionR"><input type="text" class="discuname checkVoid" placeholder="请输入标题"></h3><div class="basicInfor"><span>'+sinfor.html()+'</span><span>'+sinfor.attr("sex")+'</span><span>'+sinfor.attr("grade")+'</span><span>'+sinfor.attr("school")+'</span></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>父母职业</label><textarea name="" class="fl parentprofession checkVoid"></textarea></div><div class="clearfix"><div class="fl clearfix" style="margin-right:56px"><label for="" class="fl">目标学校</label><input type="text" class="fl targetschool"></div><div class="fl clearfix"><label for="" class="fl">期望进步分数</label><input type="text" class="fl expfraction"></div></div><div class="clearfix"><div class="fl clearfix" style="margin-right:56px"><label for="" class="fl"><i class="xh">*</i>报读科目</label><select class="fl subject checkVoid"><option value="">请选择</option><option value="语文">语文</option><option value="数学">数学</option><option value="英语">英语</option><option value="物理">物理</option><option value="化学">化学</option><option value="生物">生物</option><option value="政治">政治</option><option value="历史">历史</option><option value="地理">地理</option></select></div><div class="fl clearfix"><label for="" class="fl"><i class="xh">*</i>与目标差距分数</label><input type="text" class="fl disfraction checkVoid"></div></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>性格特点</label><textarea name="" class="fl character checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>兴趣爱好</label><textarea name="" class="fl hobbies checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>知识遗漏</label><textarea name="" class="fl cuttingcorners checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>教学计划</label><textarea name="" class="fl teachplan checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>顾问签名</label><input type="text" class="fl advisername checkVoid"></div><div class="tdBtn"><button type="button" class="tdCancel">取消</button><button type="button" class="tdSubmit">保存</button></div></form></div>');
					}
				}
			});
					
		}else{
			layer.msg('请输入必填内容')
		}
		})
		$(document).off('click','#teachDiscussionEdit .tdCancel').on('click','#teachDiscussionEdit .tdCancel',function(e){//教学讨论会取消
			layui.use('layer', function(){
  			var layer = layui.layer;
				layer.confirm('是否重置当前内容？', {icon: 3, title:'提示'}, function(index){
					$('#studentCardShowOperation').html('<div id="teachDiscussionEdit" class="teacherEdit"><form action="" method="post"><h3 class="positionR"><input type="text" class="discuname checkVoid" placeholder="请输入标题"></h3><div class="basicInfor"><span>'+sinfor.html()+'</span><span>'+sinfor.attr("sex")+'</span><span>'+sinfor.attr("grade")+'</span><span>'+sinfor.attr("school")+'</span></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>父母职业</label><textarea name="" class="fl parentprofession checkVoid"></textarea></div><div class="clearfix"><div class="fl clearfix" style="margin-right:56px"><label for="" class="fl">目标学校</label><input type="text" class="fl targetschool"></div><div class="fl clearfix"><label for="" class="fl">期望进步分数</label><input type="text" class="fl expfraction"></div></div><div class="clearfix"><div class="fl clearfix" style="margin-right:56px"><label for="" class="fl"><i class="xh">*</i>报读科目</label><select class="fl subject checkVoid"><option value="">请选择</option><option value="语文">语文</option><option value="数学">数学</option><option value="英语">英语</option><option value="物理">物理</option><option value="化学">化学</option><option value="生物">生物</option><option value="政治">政治</option><option value="历史">历史</option><option value="地理">地理</option></select></div><div class="fl clearfix"><label for="" class="fl"><i class="xh">*</i>与目标差距分数</label><input type="text" class="fl disfraction checkVoid"></div></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>性格特点</label><textarea name="" class="fl character checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>兴趣爱好</label><textarea name="" class="fl hobbies checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>知识遗漏</label><textarea name="" class="fl cuttingcorners checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>教学计划</label><textarea name="" class="fl teachplan checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>顾问签名</label><input type="text" class="fl advisername checkVoid"></div><div class="tdBtn"><button type="button" class="tdCancel">取消</button><button type="button" class="tdSubmit">保存</button></div></form></div>');
  			layer.close(layer.index);		
			},function(index){
				layer.close(layer.index);
			});
}); 	
			
		})
		$(document).off('click','#afterLeasonEidt .tdSubmit').on('click','#afterLeasonEidt .tdSubmit',function(e){//课后反馈提交
		var t=$(e.currentTarget),
		sinfor=$('.sctName');
		if(checkNull($('.checkVoid'))){
		layer.load(2);			
		$.ajax({
				type:"post",
				url:"student/insertClassFeedback",
				dataType:'json',
				data:{
					stuid:sinfor.attr('sid'),
			 		anamme:$('#afterLeasonEidt .anamme').val(),
				    /**
				     * 科目
				     */
					 subject:$('#afterLeasonEidt .subject').val(),
				    /**
				     * 平均分
				     */
					 average:$('#afterLeasonEidt .average').val(),
				    /**
				     * 上课内容
				     */
					 content:$('#afterLeasonEidt .content').val(),
				    /**
				     * 知识点掌握
				     */
					master:$('#afterLeasonEidt .master').val(),
				    /**
				     * 辅导重点
				     */
					 coach:$('#afterLeasonEidt .coach').val(),
				    /**
				     * 学生特点
				     */
					 style:$('#afterLeasonEidt .style').val(),
				    /**
				     * 课堂表现
				     */
					 doing:$('#afterLeasonEidt .doing').val(),
				    /**
				     * 家长需求
				     */
					 demand:$('#afterLeasonEidt .demand').val()					
				},
				success:function(d){
					layer.close(layer.index);
					layer.msg(d.msg);
					if(d.code===1){
						$('#studentCardShowOperation').show().html('<div id="afterLeasonEidt" class="teacherEdit"><form action="" method="post"><h3 class="positionR"><input type="text" class="anamme checkVoid" placeholder="请输入标题"></h3><div class="basicInfor"><span>'+sinfor.html()+'</span><span>'+sinfor.attr("sex")+'</span><span>'+sinfor.attr("grade")+'</span><span>'+sinfor.attr("school")+'</span></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>报读科目</label><input type="text" class="fl subject checkVoid"></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>平均分</label><input type="text" class="fl average checkVoid"></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>上课内容</label><textarea name="" class="fl content checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>知识点掌握</label><textarea name="" class="fl master checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>辅导重点</label><textarea name="" class="fl coach checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>学生特点</label><textarea name="" class="fl style checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>课堂表现</label><textarea name="" class="fl doing checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>家长需求</label><textarea name="" class="fl demand checkVoid"></textarea></div><div class="tdBtn"><button type="button" class="tdCancel">取消</button> <button type="button" class="tdSubmit">保存</button></div></form></div>');
					}
				}
			});
		}else{
			layer.msg('请输入必填内容');
		}
		})
		$(document).off('click','#afterLeasonEidt .tdCancel').on('click','#afterLeasonEidt .tdCancel',function(e){//课后反馈取消
			layui.use('layer', function(){
  			var layer = layui.layer;
				layer.confirm('是否重置当前内容？', {icon: 3, title:'提示'}, function(index){
					$('#studentCardShowOperation').show().html('<div id="afterLeasonEidt" class="teacherEdit"><form action="" method="post"><h3 class="positionR"><input type="text" class="anamme checkVoid" placeholder="请输入标题"></h3><div class="basicInfor"><span>'+sinfor.html()+'</span><span>'+sinfor.attr("sex")+'</span><span>'+sinfor.attr("grade")+'</span><span>'+sinfor.attr("school")+'</span></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>报读科目</label><input type="text" class="fl subject checkVoid"></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>平均分</label><input type="text" class="fl average checkVoid"></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>上课内容</label><textarea name="" class="fl content checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>知识点掌握</label><textarea name="" class="fl master checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>辅导重点</label><textarea name="" class="fl coach checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>学生特点</label><textarea name="" class="fl style checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>课堂表现</label><textarea name="" class="fl doing checkVoid"></textarea></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>家长需求</label><textarea name="" class="fl demand checkVoid"></textarea></div><div class="tdBtn"><button type="button" class="tdCancel">取消</button> <button type="button" class="tdSubmit">保存</button></div></form></div>');
  			layer.close(layer.index);		
			},function(index){
				layer.close(layer.index);
			});
});			
		})
	},
	leftNav:function(){//左导航
		var that=this;
		$(document).off('click',that.options.scardNav).on('click',that.options.scardNav,{that:that},function(e){//左导航点击事件
			var t=$(e.currentTarget),
				that=e.data.that,
				tl=$('.sctNavMain li'),
				allLi=$(that.options.scardNav),
				sid=$('.sctName').attr('sid'),
			 	parms={
			 		c:$(that.options.container),
			 		s:$(that.options.scardShow),
			 		sa:$(that.options.scardShowA),
			 		h:0,
			 		str:''
			 	};
		allLi.removeClass('greyBc');
		tl.removeClass('red').children('ul').hide();
		t.addClass('greyBc');
		$('.sctNavMain').removeClass('red');	
		$('#studentCardShowOperation,#studentCardShowAnother').hide();
		$('#studentCardShow').show();		
		switch(t.attr('s'))
			{
			    case 'stuInfor'://基本信息
					$.ajax({
						type:'post',
						dataType:'json',
						url:'afterSaleManage/card/BasicInformation',
						data:{
							stuid:$('.sctName').attr('sid')
						},
						async:false,
						success:function(d){
							var c=d.data;
							layer.close(layer.index);
							c=checkNulls(c);
							c.usertable=checkNulls(c.usertable);
							c.birthday=c.birthday.length===0?"":c.birthday;
							c.usertable=c.usertable.length===0?"":c.usertable.username;
							if(d.code===0){
								var html1='<div id="scStudentInforWrap"><ul class="clearfix" id="scStudentInfor"><li class="fl"><dl class="clearfix"><dt class="fl">姓名</dt><dd class="fl">'+c.stuname+'</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">年级</dt><dd class="fl">'+c.grade+'</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">班主任</dt><dd class="fl">'+c.usertable+'</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">性别</dt><dd class="fl">'+c.sex+'</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">科目</dt><dd class="fl">',
								html2='',
								html3='</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">学员状态</dt><dd class="fl">'+c.stustatus+'</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">手机号</dt><dd class="fl">'+c.phone+'</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">学校</dt><dd class="fl">'+c.school+'</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">导入学员时间</dt><dd class="fl">'+c.inputtime+'</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">年龄</dt><dd class="fl">'+c.age+'</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">地区</dt><dd class="fl">'+c.address+'</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">麦克风/耳机</dt><dd class="fl">'+c.microphone+'</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">生日</dt><dd class="fl">'+c.birthday+'</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">联系人</dt><dd class="fl">'+c.guardian+'</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">学习态度</dt><dd class="fl">'+c.learnattitude+'</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">推荐人</dt><dd class="fl">'+c.referee+'</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">联系电话</dt><dd class="fl">'+c.referee+'</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">备注</dt><dd class="fl">'+c.remark+'</dd></dl></li></ul></div>';
						c.weaksubjects=c.weaksubjects.split('|');
						for(var i=0;i<c.weaksubjects;i++){
							c.weaksubjects[i]=c.weaksubjects[i].split(',');
							html2+='<span>'+c.weaksubjects[i][0]+"&nbsp;"+c.weaksubjects[i][1]+"&nbsp;"+c.weaksubjects[i][2]+'&nbsp;&nbsp;</span>'
						}								
						parms.str=html1+html2+html3;
							}
						}
					});
					break;
			    case 'orderInfor'://合同信息
			   	 parms.str='<div id="scOrderInfor"><div id="scardtable"></div><script type="text/javascript">layui.use(["table","upload"],function(){var e=layui.table,els = [".editOrderBtn",".DismissRecord"],target =[$(".contractEdit"), $(".DismissRecordBox")];e.render({elem:"#scardtable",url:"afterSaleManage/card/ContractInformation",where:{stuid:'+sid+'},id:"tableStuCard",skin:"line",cols:[[{field:"contype",width:100,title:"合同类型",templet:"#scOrderType"},{field:"cstatus",width:150,title:"状态",templet:"#scOrderState"},{field:"cnumber",minWidth:100,title:"合同编号"},{field:"perprice",width:100,title:"单价"},{field:"allsum",width:100,title:"总课时"},{field:"allprice",width:100,title:"总价"},{field:"paytype",width:150,title:"支付方式"},{field:"currentsum",width:100,title:"剩余课时"},{field:"username",width:100,title:"签约人"},{field:"ctime",width:160,title:"签约日期"},{field:"operationScard",width:160,title:"操作",templet:"#operationScard"}]],done:function(){layer.close(layer.index);setTimeout(function(){for(var i=0;i<els.length;i++){mtk(els[i],target[i],bBox)}},1)}})});</script><script type="text/html" id="scOrderType">{{#  if(d.cstatus=="签约未通过"){ }}<div class="failOrder">{{d.contype}}</div>{{#  } else{ }} <div class="">{{d.contype}}</div> {{#  } }}</script><script type="text/html" id="scOrderState">{{#  if(d.cstatus=="消耗中"){ }} <span class="scOstate toAuditStatus">消耗中</span>{{#  } else if(d.cstatus=="签约审核中") { }} <span class="scOstate inAuditStatus">签约审核中</span>{{#  } else if(d.cstatus=="待排课") { }} <span class="scOstate inAuditStatus">待排课</span>{{#  } else if(d.cstatus=="已消耗") { }} <span class="scOstate closed">已消耗</span> {{#  } else if(d.cstatus=="退费未通过") { }} <span class="scOstate noAuditStatus">退费未通过</span>{{#  } else if(d.cstatus=="退费审核中") { }} <span class="scOstate inAuditStatus">退费审核中</span>{{#  } else if(d.cstatus=="退费中") { }} <span class="scOstate inAuditStatus">退费中</span>{{#  } else if(d.cstatus=="已退费") { }} <span class="scOstate closed">已退费</span>{{#  } else if(d.cstatus=="签约未通过") { }} <span class="scOstate noAuditStatus">签约未通过</span>{{#  } }}</script><script type="text/html" id="operationScard"><div class="operation"><span title="编辑合同" class="iconfont icon-gaizhang editOrderBtn" sid="'+$(".sctName").attr("sid")+'" oid="{{d.id}}" cstatus="{{d.cstatus}}"></span><span title="驳回记录" class="iconfont icon-pen DismissRecord" cid="{{d.id}}"></span></div></script></div>';
			        break;
			    case 'classInfor'://排课信息
			    parms.str="<div id='scScheduleInfor'><div id='scardtable'></div><script type='text/javascript'>layui.use(['table','upload'],function(){var table=layui.table;table.render({elem:'#scardtable',url:'afterSaleManage/card/TimetableInformation',where:{stuid:"+sid+"},id:'tableStuCard',skin:'line',cols:[[{field:'subject',width:100,title:'科目'},{field:'classtype',width:100,title:'类型'},{field:'classdate',width:200,title:'上课时间'},{field:'username',minWidth:100,title:'老师'},{field:'remarks',width:100,title:'备注'}]],done:function(d){layer.close(layer.index);}})});</script></div>";
			        break;
			    case 'classhour'://课时消耗
			    $.ajax({
			    	type:"post",
			    	url:"afterSaleManage/card/TimeConsumption",
			    	dataType:'json',
			    	data:{stuid:sid},
			    	async:false,
			    	success:function(d){
			    		var csum=0;
			    		if(d.data.length!=0){
			    			csum=d.data[0].cousum;
			    		}		    		
			  		parms.str="<div id='scLessonPeriod'><div class='clearfix lessonPeriod'><dl class='fl clearfix'><dt class='fl'>一对一课时:</dt><dd class='fl'>"+csum+"</dd></dl><dl class='fl clearfix'><dt class='fl'>班课课时:</dt><dd class='fl'></dd></dl></div><div id='scLessonPeriodSearch'class='clearfix'><div class='fl clearfix'><div class='positionR fl achivClWrap'id='div_month_picker'><input type='text'class='layui-input achivClendar'id='scRangeClendar'><i class='positionA iconfont icon-rili'></i></div><script type='text/javascript'>layui.use('laydate',function(){var laydate=layui.laydate;laydate.render({elem:'#scRangeClendar',range:'至',trigger:'click',showBottom:false,change:function(value,date){$('#scRangeClendar').val(value)}})})</script></div><div class='fl clearfix'><select class='fl stu_ser_box stu_ser_1 Ctype'><option value=''>全部</option><option value='0'>线上一对一</option><option value='1'>班课</option></select></div><div class='fl clearfix'><button class='stu_ser_box backOne'style='background:transparent;' data-type='reload'>最近一天</button><button class='stu_ser_box backSeven'style='background:transparent;' data-type='reload'>最近七天</button></div><div class='fl'><button id='search_btnCard'class='s_btn' data-type='reload'>搜索</button></div></div><div id='scLessonPeriodtable'></div><script type='text/javascript'>layui.use(['table','upload'],function(){var table=layui.table;table.render({elem:'#scLessonPeriodtable',url:'afterSaleManage/card/TimeConsumption',where:{stuid:"+sid+",date:'',ctype:''},id:'tableStuCard',skin:'line',cols:[[{field:'subject',width:100,title:'科目'},{field:'ctype',width:100,title:'类型'},{field:'showtime',width:200,title:'上课时间'},{field:'username',width:100,title:'老师'},{field:'duration',width:100,title:'1节课时长'},{field:'duration',minWidth:100,title:'消耗时长'},{field:'remark',width:100,title:'备注'}]],done:function(d){layer.close(layer.index);}});$(document).off('click','#search_btnCard').on('click','#search_btnCard',function(){var type=$(this).data('type');var key={stuid:$('.sctName').attr('sid'),ctype:$('#studentCardShow .Ctype').val(),date:$('#studentCardShow .achivClendar').val()};searchReload2(table,key,type)});$(document).off('click','.backOne').on('click','.backOne',function(){var d=new Date();var type=$(this).data('type');d=d.getTime()-86400000;var key={stuid:$('.sctName').attr('sid'),ctype:$('#studentCardShow .Ctype').val(),date:timestampToData(d)};searchReload2(table,key,type)});$(document).off('click','.backSeven').on('click','.backSeven',function(){var d=new Date();var type=$(this).data('type');var db=d.getTime()-604800000;d=d.getTime();var key={stuid:$('.sctName').attr('sid'),ctype:$('#studentCardShow .Ctype').val(),date:timestampToData(db)+'至'+timestampToData(d)};searchReload2(table,key,type)});});</script></div>";
			    	}
			    });
			    break;
			    case 'stepRemark'://跟进记录
			    parms.str="<div id='scFollowRecord'><div id='scFollowRecordTable'></div><script type='text/javascript'>layui.use(['table','upload'],function(){var table=layui.table;table.render({elem:'#scFollowRecordTable',url:'student/queryContactlogByStuid',where:{stuid:"+sid+"},id:'tableStuCard',skin:'line',cols:[[{field:'ctime',width:200,title:'创建时间'},{field:'user',width:100,title:'联系人',templet:'#user'},{field:'content',minWidth:100,title:'内容'}]],done:function(d){layer.close(layer.index);}})});</script><script type='text/html' id='user'>{{d.user.username}}</script></div>";
			        break;
			    case 'goalList'://成绩列表
			    parms.str="<div id='scScoreList'><div id='scScoreListTable'></div><script type='text/javascript'>layui.use(['table','upload'],function(){var table=layui.table;table.render({elem:'#scScoreListTable',url:'/student/queryExamin',where:{id:"+sid+"},id:'tableStuCard',skin:'line',cols:[[{field:'examname',minWidth:100,title:'考试名称',templet:'#examname'},{field:'crdate',width:200,title:'创建时间'},{field:'user',width:100,title:'填写人',templet:'#user'}]],done:function(d){layer.close(layer.index);}})});</script><script type='text/html' id='examname'><div class='examnameId' eid='{{d.id}}'>{{d.examname}}</div></script><script type='text/html' id='user'>{{d.user.username}}</script></div>";
			        break;
			    case 'enclosureInfor'://附件信息
			    parms.str="<div id='scAttachmentInfor'><div id='scAttachmentInforTable'></div><script type='text/javascript'>layui.use(['table','upload'],function(){var table=layui.table;table.render({elem:'#scAttachmentInforTable',url:'/student/queryStuFile',where:{id:"+sid+"},id:'tableStuCard',skin:'line',cols:[[{field:'filename',minWidth:100,title:'名称',templet:'#urlFj'},{field:'crdate',width:200,title:'创建时间'},{field:'user',width:100,title:'创建人',templet:'#userFj'}]],done:function(d){layer.close(layer.index);}})});</script><script type='text/html' id='userFj'>{{d.user.username}}</script><script type='text/html' id='urlFj'><a href='{{d.fileurl}}'>{{d.filename}}</a></script></div>";
			        break;
			    case 'teachingInfor'://教学信息
			   parms.str="<div id='scTeachingInfor'><div id='scTeachingTable'></div><script type='text/javascript'>layui.use(['table','upload'],function(){var table=layui.table;table.render({elem:'#scTeachingTable',url:'student/queryExapaper',where:{id:"+sid+"},id:'tableStuCard',skin:'line',cols:[[{field:'name',minWidth:100,title:'名称',templet:'#type'},{field:'crdate',width:200,title:'创建时间',templet:'#ctime'}]],done:function(d){layer.close(layer.index);}})});</script><script type='text/html' id='type'><div><span class='branchs' branch='{{d.branch}}' bid='{{d.id}}'>{{d.name}}</span></div></script><script type='text/html' id='ctime'>{{timestampToTime(d.crdate)}}</script></div>";
			        break;
			    case	'audition'://试听记录
				 parms.str="<div id='auditionInfor'><div id='auditionInfor'></div><script type='text/javascript'>layui.use(['table','upload'],function(){var table=layui.table;table.render({elem:'#auditionInfor',url:'afterSaleManage/card/Auditions',where:{stuid:"+$('.sctName').attr('sid')+"},id:'tableStuCard',skin:'line',cols:[[{field:'ftime',minWidth:100,title:'创建时间',templet:'#ftime'},{field:'username',width:120,title:'备注人'},{field:'ftype',width:120,title:'反馈'},{field:'fremark',minWidth:100,title:'备注人',templet:'#ctime'}]],done:function(d){layer.close(layer.index);}})});</script><script type='text/html' id='ftime'>{{timestampToTime(d.ftime)}}</script></div>";
				break;
			}
			scardTableRendering(parms)
		})
		$('#scardLeftNav li:first-child').trigger('click');
	},
	goalDetShow:function(){//考试成绩
		var that=this;
		$(document).off('click','#scScoreList .layui-table-body tr').on('click','#scScoreList .layui-table-body tr',{that:that},function(e){//打开
			var that=e.data.that;
			var t=$(e.currentTarget);
			$.ajax({
				type:'post',
				dataType:'json',
				url:'student/queryTranscript',
				data:{id:t.find('.examnameId').attr('eid')},
				success:function(d){
					var c=d.data;
					var arr=[];
					var str1='<div id="#scScoreDetail"><div class="comeback tdBack"><i class="iconfont icon-houtui positionR" style="top:1px;"></i>返回</div><table class="goalsDet"><thead><tr><th></th>';
					var str2='</tr></thead><tbody><tr><td></td>';
					if(d.code===0){
						$('#studentCardShow,#studentCardShowOperation').hide();
						for(var i=0;i<c.length;i++){
							str1+='<th>'+c[i].subject+'</th>';
							str2+='<td>'+c[i].fraction+'</td>';
						}
						$('#studentCardShowAnother').html(str1+str2+'</tr></tbody></table></div>').show();
					}
				}
			})
			
		});
		$(document).off('click','#scScoreDetail .comeback').on('click','#scScoreDetail .comeback',{that:that},function(e){//关闭
			var that=e.data.that;
			$(that.options.scardShow).show();
			$(that.options.scardShowA).hide();
		})
	},
	teacherInforShow:function(){//教学信息
		var that=this;
		$(document).off('click','#scTeachingInfor .layui-table-body tr').on('click','#scTeachingInfor .layui-table-body tr',{that:that},function(e){//打开
			var that=e.data.that;
			var t=$(e.currentTarget);
			$(that.options.scardShow).hide();
			layer.load(2);
			$.ajax({
				type:"post",
				url:"student/queryTeachInfo",
				dataType:'json',
				data:{
					id:t.find('.branchs').attr('bid'),
					branch:t.find('.branchs').attr('branch')
				},
				success:function(d){
					var c=d.data;
					var str='';
					layer.close(layer.index);
					 c=checkNulls(c);
					if(d.code===0){
						if(t.find('.branchs').attr('branch')==='discussion'){
							str='<div id="teachDiscussion"class="discussionShow"><div class="comeback tdBack"><i class="iconfont icon-houtui positionR"style="top:1px;"></i>返回</div><div><dl class="clearfix"><dt class="fl"><i class="xh">*</i>名称</dt><dd class="fl">'+c.discuname+'</dd></dl><dl class="clearfix"><dt class="fl"><i class="xh">*</i>姓名</dt><dd class="fl">'+c.stuname+'</dd></dl><dl class="clearfix"><dt class="fl"><i class="xh">*</i>性别</dt><dd class="fl">'+c.sex+'</dd></dl><dl class="clearfix"><dt class="fl"><i class="xh">*</i>在读学校</dt><dd class="fl">'+c.school+'</dd></dl><dl class="clearfix"><dt class="fl"><i class="xh">*</i>年级</dt><dd class="fl">'+c.grade+'</dd></dl><dl class="clearfix"><dt class="fl"><i class="xh">*</i>父母职业</dt><dd class="fl">'+c.parentprofession+'</dd></dl><dl class="clearfix"><dt class="fl">目标学校</dt><dd class="fl">'+c.targetschool+'</dd></dl><dl class="clearfix"><dt class="fl">期望分数</dt><dd class="fl">'+c.expfraction+'</dd></dl><dl class="clearfix"><dt class="fl"><i class="xh">*</i>报读科目</dt><dd class="fl">'+c.subject+'</dd></dl><dl class="clearfix"><dt class="fl"><i class="xh">*</i>与目标差距</dt><dd class="fl">'+c.disfraction+'</dd></dl><dl class="clearfix"><dt class="fl"><i class="xh">*</i>性格特点</dt><dd class="fl">'+c.character+'</dd></dl><dl class="clearfix"><dt class="fl"><i class="xh">*</i>兴趣爱好</dt><dd class="fl">'+c.hobbies+'</dd></dl><dl class="clearfix"><dt class="fl"><i class="xh">*</i>知识遗漏</dt><dd class="fl">'+c.cuttingcorners+'</dd></dl></div></div>';					
						}else if(t.find('.branchs').attr('branch')==='afterfeedback'){
							str='<div id="teachDiscussion"class="discussionShow"><div class="comeback tdBack"><i class="iconfont icon-houtui positionR"style="top:1px;"></i>返回</div><div><dl class="clearfix"><dt class="fl"><i class="xh">*</i>名称</dt><dd class="fl">'+c.anamme+'</dd></dl><dl class="clearfix"><dt class="fl"><i class="xh">*</i>姓名</dt><dd class="fl">'+c.stuname+'</dd></dl><dl class="clearfix"><dt class="fl"><i class="xh">*</i>在读学校</dt><dd class="fl">'+c.school+'</dd></dl><dl class="clearfix"><dt class="fl"><i class="xh">*</i>年级</dt><dd class="fl">'+c.grade+'</dd></dl><dl class="clearfix"><dt class="fl"><i class="xh">*</i>科目</dt><dd class="fl">'+c.subject+'</dd></dl><dl class="clearfix"><dt class="fl">平均分</dt><dd class="fl">'+c.average+'</dd></dl><dl class="clearfix"><dt class="fl">上课内容</dt><dd class="fl">'+c.content+'</dd></dl><dl class="clearfix"><dt class="fl">知识点掌握</dt><dd class="fl">'+c.master+'</dd></dl><dl class="clearfix"><dt class="fl"><i class="xh">*</i>辅导重点</dt><dd class="fl">'+c.coach+'</dd></dl><dl class="clearfix"><dt class="fl"><i class="xh">*</i>学生特点</dt><dd class="fl">'+c.style+'</dd></dl><dl class="clearfix"><dt class="fl"><i class="xh">*</i>课堂表现</dt><dd class="fl">'+c.doing+'</dd></dl><dl class="clearfix"><dt class="fl"><i class="xh">*</i>家长需求</dt><dd class="fl">'+c.demand+'</dd></dl></div></div>';
						}else if(t.find('.branchs').attr('branch')==='exapaper'){
							for(var i=0;i<c.analysis.length;i++){							
							var str1='';
								for(var j=0;j<c.analysis[i].cont.length;j++){
									str1+='<ul class="clearfix"><li class="fl" style="width:30%"><p style="width:90%;height:40px" title="'+c.analysis[i].cont[j].topics+'">'+c.analysis[i].cont[j].topics+'</p></li><li class="fl" style="width:30%"><p  style="width:90%;height:40px"title="'+c.analysis[i].cont[j].question+'">'+c.analysis[i].cont[j].question+'</p></li><li class="fl" style="width:20%"><p style="width:90%;height:40px"title="'+c.analysis[i].cont[j].master+'">'+c.analysis[i].cont[j].master+'</p></li><li class="fl" style="width:20%"><p style="width:90%;height:40px"title="'+c.analysis[i].cont[j].endtopics+'">'+c.analysis[i].cont[j].endtopics+'</p></li></ul>';
								}
								str+='<div class="testAnalysisBlock clearfix positionR"><div class="fl testTitleLeft" style="width:10%;height:'+c.analysis[i].cont.length*57+'px"><p style="width:1em;height:70%;line-height:1.5em" title="'+c.analysis[i].anname+'">'+c.analysis[i].anname+'</p></div><div class="fl testMainRight" style="width:90%">'+str1+'</div></div>';
							}
						str='<div class="comeback tdBack"><i class="iconfont icon-houtui positionR"style="top:1px;"></i>返回</div><div class="textAnalysis  positionR"><h2>'+c.exname+'</h2><div class="testAnalysisMain positionR"><ul class="clearfix testAnalysishead"><li class="fl" style="width:35%">涉及知识点</li><li class="fl" style="width:25%">常考题型</li><li class="fl" style="width:20%">掌握程度</li><li class="fl" style="width:20%">试卷未考到知识点</li></ul>'+str+'</div>';	
						}
					$(that.options.scardShowA).html(str).show();
					var tlf=$('.testTitleLeft p');
					for(var i=0;i<tlf.length;i++){
						if(tlf.eq(i).height()<parseInt(tlf.eq(i).css('font-size'))*1.5*tlf.eq(i).html().length){
							tlf.eq(i).css({
								"width":'80%',
								"height":'1.5em',
								'text-overflow':'ellipsis',
								"white-space":"nowrap",
								"overflow": "hidden"
							})
						}
						
					}
					$('#studentCardShowOperation,#studentCardShow').hide();
					$(that.options.container).height('1000');
					}
				}
			});
									
		});
		$(document).off('click','.comeback').on('click','.comeback',{that:that},function(e){//关闭详情
			var that=e.data.that;
			$(that.options.scardShow).show();
			$(that.options.scardShowA).hide();
			$('#studentCardShowOperation').hide();
		})
	},
	textAnalysis:function(){//成绩分析录入
		$(document).off('click','.plusRow').on('click','.plusRow',function(e){//添加行
			var t=$(e.currentTarget),
				l=t.siblings('.testTitleLeft'),
				r=t.siblings('.testMainRight'),
				w=$('#studentCard'),
				h=w.height(),
				lt=l.find('textarea');
				if(h<896){
					w.height(h+67);
				}
			l.height(l.height()+57);
			lt.attr('rows',parseInt(lt.attr('rows'))+1);
			r.append('<ul class="clearfix"><li class="fl" style="width:30%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li><li class="fl" style="width:30%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li><li class="fl" style="width:20%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li><li class="fl" style="width:20%"><input type="" name="" id="" value="" placeholder="请输入" style="width:90%;height:40px"></li></ul>')
		});
		
		$(document).off('click','.delRow').on('click','.delRow',function(e){//删除行
			var t=$(e.currentTarget),
				l=t.siblings('.testTitleLeft'),
				r=t.siblings('.testMainRight'),
				w=$('#studentCard'),
				h=w.height(),
				lt=l.find('textarea');
			if(r.find('ul').length>1){
			l.height(l.height()-57);
			w.height(h-67);
			lt.attr('rows',parseInt(lt.attr('rows'))-1);			
			r.find('ul:last').remove();
			}
		});
		
		
		
		$(document).off('click','.plusCol').on('click','.plusCol',function(){//添加块
			var b=$('testAnalysisBlock'),
				c=$('.testAnalysisContent'),
				w=$('#studentCard'),
				h=w.height();
				if(h<896){
					w.height(h+122);
				}
				c.append('<div class="testAnalysisBlock clearfix positionR"><div class="fl testTitleLeft" style="width:10%"><textarea name="" rows="2" cols="12" style="resize:none" placeholder="请输入" class="checkVoid"></textarea></div><div class="fl testMainRight" style="width:90%"><ul class="clearfix"><li class="fl" style="width:30%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li><li class="fl" style="width:30%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li><li class="fl" style="width:20%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li><li class="fl" style="width:20%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li></ul></div><div class="delRow del positionA" style="bottom:4px;right:36px;"><i class="iconfont icon-minus-bold"></i></div><div class="plusRow plus positionA" style="bottom:4px;right:6px"><i class="iconfont icon-jiahao"></i></div></div>')
		});
		
		$(document).off('click','.delCol').on('click','.delCol',function(){//删除块
			var b=$('.testAnalysisBlock'),
				bl=$('.testAnalysisBlock:last'),
				c=$('.testAnalysisContent')
				w=$('#studentCard'),
				h=w.height();
				if(b.length>1){
					bl.remove();
					w.height(h-122);
				}
		});
		
		$(document).off('click','.textAnalysis .save').on('click','.textAnalysis .save',function(){//提交试卷分析
			var b=$('.testAnalysisBlock'),
				bl=$('.testAnalysisBlock:last'),
				c=$('.testAnalysisContent'),
				w=$('#studentCard'),
				sid=$('.sctName').attr('sid'),
				title=$('.textAnalysis h2 input').val(),
				arr=[],
				key={
					exname:title,
					stuid:sid,
					data:[]
				},
				blkone={
					topics:'',
					question:'',
					master:'',
					endtopics:''
				};
				for(var i=0;i<b.length;i++){
				var 	blk={anname:'',data:[]};
					blk.anname=b.eq(i).find('textarea').val();
					for(var j=0;j<b.eq(i).find('ul').length;j++){
							blkone={
									topics:b.eq(i).find('ul').eq(j).find('li input').eq(0).val().length!=0?b.eq(i).find('ul').eq(j).find('li input').eq(0).val():'-',
									question:b.eq(i).find('ul').eq(j).find('li input').eq(1).val().length!=0?b.eq(i).find('ul').eq(j).find('li input').eq(0).val():'-',
									master:b.eq(i).find('ul').eq(j).find('li input').eq(2).val().length!=0?b.eq(i).find('ul').eq(j).find('li input').eq(0).val():'-',
									endtopics:b.eq(i).find('ul').eq(j).find('li input').eq(3).val().length!=0?b.eq(i).find('ul').eq(j).find('li input').eq(0).val():'-'
								};
						blk.data.push(blkone);
					}
					key.data.push(blk);
				}
				arr.push(key);
				arr=JSON.stringify(arr);
				if(checkNull($('.checkVoid'))){
				layer.load(2);
				$.ajax({
					type:'post',
					dataType:'json',
					url:'student/insertExapaper',
					data:{list1:arr},
					success:function(d){
						layer.close(layer.index);
						layer.msg(d.msg);
						if(d.code===1){
							$('.testAnalysisContent').html('<div class="testAnalysisBlock clearfix positionR"><div class="fl testTitleLeft" style="width:10%"><textarea name="" rows="2" cols="12" style="resize:none" placeholder="请输入"></textarea></div><div class="fl testMainRight" style="width:90%"><ul class="clearfix"><li class="fl" style="width:30%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li><li class="fl" style="width:30%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li><li class="fl" style="width:20%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li><li class="fl" style="width:20%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li></ul></div><div class="delRow del positionA" style="bottom:4px;right:36px"><i class="iconfont icon-minus-bold"></i></div><div class="plusRow plus positionA" style="bottom:4px;right:6px"><i class="iconfont icon-jiahao"></i></div></div><div class="plusCol plus positionA" style="bottom:-38px;left:0"><i class="iconfont icon-jiahao"></i></div><div class="delCol del positionA" style="bottom:-38px;left:30px"><i class="iconfont icon-minus-bold"></i></div>');
						}
					}
					
				})
								
			}else{
				layer.msg('请填写必填内容');
			}
		});
		
		$(document).off('click','.textAnalysis .cancelA').on('click','.textAnalysis .cancelA',function(){//取消试卷分析
			var b=$('.testAnalysisBlock'),
				c=$('.testAnalysisContent'),
				w=$('#studentCard');
layui.use('layer', function(){
  var layer = layui.layer;
				layer.confirm('是否重置当前内容？', {icon: 3, title:'提示'}, function(index){
					w.height(500);
					c.html('<div class="testAnalysisBlock clearfix positionR"><div class="fl testTitleLeft" style="width:10%"><textarea name="" rows="2" cols="12" style="resize:none" placeholder="请输入" class="checkVoid" ></textarea></div><div class="fl testMainRight" style="width:90%"><ul class="clearfix"><li class="fl" style="width:30%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li><li class="fl" style="width:30%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li><li class="fl" style="width:20%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li><li class="fl" style="width:20%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li></ul></div><div class="delRow del positionA" style="bottom:4px;right:36px"><i class="iconfont icon-minus-bold"></i></div><div class="plusRow plus positionA" style="bottom:4px;right:6px"><i class="iconfont icon-jiahao"></i></div></div><div class="plusCol plus positionA" style="bottom:-38px;left:0"><i class="iconfont icon-jiahao"></i></div><div class="delCol del positionA" style="bottom:-38px;left:30px"><i class="iconfont icon-minus-bold"></i></div>');
  			layer.close(layer.index);		
			},function(index){
				layer.close(layer.index);
			});
}); 				
		});
		
	},
	uploadGoals:function(){
		$(document).off('click','').on('click','',function(){})
	},
	carryout:function(){//执行方法
		this.leftNav();
		this.goalDetShow();
		this.teacherInforShow();
		this.textAnalysis();
		this.topNav();
		this.closeScard();
		dismissRecord()
	}
}
var scard=new Scard();
scard.carryout();
