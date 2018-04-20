/*我的学生*/
function paramConvert(para, url) { //参数转换
	var json;
	$.ajax({
		url: url,
		type: 'post',
		data: {
			'para': para
		},
		async: false,
		success: function(data) {
			json = data;
		}
	});
	return json;
}
function paramGrade() {
	$.ajax({
		url: 'student/queryParam', //参数表年级
		dataType: 'json',
		type: 'post',
		data: {
			para: 'GRADE'
		},
		success: function(d) {
			var g = d.data,
				sg = '';
			for(var i = 0; i < g.length; i++) {
				sg += '<option value="' + g[i].paramvalue + '">' + g[i].paramtext + '</option>';
			}
			$('.grade').append(sg);
		}
	});
}
function paramSubject() { //参数表学科
	$.ajax({
		url: 'student/queryParam',
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
}

function paramSubjectS() { //参数表学科(数字)
	$.ajax({
		url: 'student/queryParam',
		dataType: 'json',
		type: 'post',
		data: {
			para: 'SUBJECT'
		},
		success: function(d) {

			var s = d.data,
				ss = '';
			for(var j = 0; j < s.length; j++) {
				ss += '<option value="' + s[j].paramvalue + '">' + s[j].paramtext + '</option>';
			}
			$('.subjects').append(ss);
		}
	});
}

function paramSubjectSard() { //学生卡-参数表学科(数字)
	$.ajax({
		url: 'student/queryParam',
		dataType: 'json',
		type: 'post',
		data: {
			para: 'SUBJECT'
		},
		success: function(d) {

			var s = d.data,
				ss = '';
			for(var j = 0; j < s.length; j++) {
				ss += '<option value="' + s[j].paramvalue + '">' + s[j].paramtext + '</option>';
			}
			$('.subjectsard').append(ss);
		}
	});
}

function onGrade(d) { //年级回传
	var g = paramConvert('GRADE', 'student/queryParam').data;
	for(var i = 0, l = g.length; i < l; i++) {
		if(g[i].paramvalue == d.grade)
			return g[i].paramtext;
	}
	return "";
}

function onSubject(d, sub) { //学科回传
	var g = paramConvert('SUBJECT', 'student/queryParam').data;
	for(var i = 0, l = g.length; i < l; i++) {
		if(g[i].paramvalue == d[sub])
			return g[i].paramtext;
	}
	return "";
}

function addStudent() { //添加学生
	var imports = '#importStudent',
		importForm = $('.setInStuInfor form'),
		ifStuname = importForm.find('input[name=stuname]'),
		ifPhone = importForm.find('input[name=stuname]');

	$(document).off('click', imports).on('click', imports, function() { //提交
		var attr = [],
			weakSub = $('.weakSubject'),
			checkPhone = checkMobile($('.setInStuInfor input[name=phone]').val()),
			importStu = $('.importStu:visible');

		if(checkNull(importStu) && $('input[type=radio].importStu').is(':checked')) { //非空验证
			if(checkPhone == true) { //电话验证
				for(var i = 0; i < weakSub.length; i++) { //薄弱科目数据处理
					var obj = {
						"科目": weakSub.eq(i).children("select").eq(0).val(),
						"满分": weakSub.eq(i).children("select").eq(1).val(),
						"区间": weakSub.eq(i).children("select").eq(2).val()
					};
					attr.push(obj);
				}
				$('#weaksubjects').val(JSON.stringify(attr));
				layer.load(2);
				$.ajax({
					type: "POST",
					url: "student/insertStu",
					data: importForm.serialize(), // 序列化表单值  
					async: false,
					success: function(d) {
						layer.close(layer.index);
						layer.msg(d.msg);
						if(d.code === 1) {
							$('.bombBox,.curtain').hide();
							$('#mystu_tab').find('.tab_current').trigger('click');
						}
					}
				});
			} else if(checkPhone == false) {
				layer.msg('请填写正确的手机号');
			}
		} else {
			layer.msg('请填写必填信息');
		}
	})
	$(document).off('click', '.setInStuInfor  .cancel').on('click', '.setInStuInfor  .cancel', function() { //添加学生取消
		$('.setInStuInfor   input[type=text],.setInStuInfor select,.setInStuInfor  textarea').val('');
		$('.setInStuInfor .weakSubject:not(:first)').remove();
	})
}
function checkDel(table) { //复选框批量删除与取消
	table.on('checkbox(test)', function(obj) { //监听表格复选框选择  	
		if(obj.checked === true) {
			$('#checkedEvent').show();
			$('#mystu_sear').hide();
		} else if($('#myStudent .layui-form-checked').length === 0) {
			$('#checkedEvent').hide();
			$('#mystu_sear').show();
		}
		var d = table.checkStatus('tableStu_1');
		smsMore(d);
	});
	$(document).off('click', '.myStuCheckedDel').on('click', '.myStuCheckedDel', function() { //批量 删除 学生
		var myid = [];
		var target = $('#myStudent>.layui-form .layui-table-body .layui-form-checked').parents('tr');
		for(var i = 0; i < target.length; i++) {
			myid.push(target.eq(i).find('.nameDetail').attr('myid'));
		}
		layer.confirm('真的删除选中项么', function(index) {
			layer.close(index);
			$.ajax({
				url: 'student/delStuByIds',
				type: 'post',
				dataType: 'json',
				data: {
					stuids: JSON.stringify(myid)
				},
				success: function(d) {
					layer.msg(d.msg);
					if(d.code === 1) {
						$('#search_btn').trigger('click');
					}
				}
			})
		});
	})
	$(document).off('click', '#checkedCancel').on('click', '#checkedCancel', function() { //取消批量操作工具栏
		$('#search_btn').trigger('click');
	})
}

function delOne(table) { //单行删除学生
	table.on('tool(test)', function(obj) {
		var data = obj.data;
		if(obj.event === 'del') {
			var myid = [];
			myid.push(obj.tr.find('.nameDetail').attr('myid'));
			layer.confirm('真的删除该学生么', function(index) {
				$.ajax({
					url: 'student/delStuByIds',
					type: 'post',
					dataType: 'json',
					data: {
						stuids: JSON.stringify(myid)
					},
					success: function(d) {
						layer.msg(d.msg);
						if(d.code === 1) {
							$('#search_btn').trigger('click');
						}
					}
				})
				layer.close(index);
			});
		}
		var obje = obj.event
		smsOne(data, obje);
	});
}

function orderType() { //合同类型判断
	$(document).off('change', '#orderTypeSel').on('change', '#orderTypeSel', function(e) {
		var target = $(e.target),
			od1 = $('.orderDetail1'),
			od2 = $('.orderDetail2'),
			ot1 = $('.orderType1'),
			ot2 = $('.orderType2')
		cg = '常规合同',
			hj = "寒假合同",
			sj = "暑假合同",
			val = target.val();
		if(val === '0') {
			od1.show();
			od2.hide();
			ot1.html(cg);
		} else if(val === "1") {
			od1.show();
			od2.hide();
			ot1.html(sj);
		} else if(val === "2") {
			od1.show();
			od2.hide();
			ot1.html(hj);
		} else if(val === "01") {
			od1.show();
			od2.show();
			ot1.html(cg);
			ot2.html(sj);
		} else if(val === "02") {
			od1.show();
			od2.show();
			ot1.html(cg);
			ot2.html(hj);
		}
	})
}

function orderSetIn(url) { //录入合同
	$(document).off('click', '.icon-feijizhizao,.operation .setInOrderBtn,.operation .editOrderBtn,.renewOrderBtn,.sctNavMain li[key="addOrder"]').on('click', '.icon-feijizhizao,.operation .setInOrderBtn,.operation .editOrderBtn,.renewOrderBtn,.sctNavMain li[key="addOrder"]', function(e) {
		var that = $(e.currentTarget);
		var stuNameId = that.parents('tr').find('.nameDetail').attr('myid') || that.attr('sid');
		var stuName = that.parents('tr').find('.nameDetail span').html() || that.attr('sname');
		var stuGrade = that.parents('tr').find('td[data-field=grade] div').html() || that.attr('sgrade');
		$('.orderStuid').val(stuNameId);
		$('.orderUname').html(stuName);
		$('.orderGrade').html(stuGrade);
		if(that.hasClass('icon-feijizhizao')) { //绿色通道判断			
			$('.contract form').append('<input type="hidden" class="br" value="1" />') //绿色通道
		} else {
			$('.contract form').append('<input type="hidden" class="br" value="0" />')
		}
		$(document).off('click', '#orderSubmit:visible').on('click', '#orderSubmit:visible', function(e) { //提交
			var t = $(e.currentTarget);
			var orderConkind = $('.beOrderType').attr('v');
			var ordercontype = $('#orderTypeSel').val();
			var oDate = $('#achivClendarOrs').val();
			oDate = oDate.replace(/-/g,   "/");
			oDate = new Date(oDate);
			oDate = oDate.getTime();
			if(t.parents('.contract').is('.contractSetIn')) { //判断录入or编辑
				url = 'student/insrtContract';
			} else {
				url = 'student/updateContract';
			}
			for(var i = 0; i < ordercontype.length; i++) {
				$('.ordercontype').eq(i).val(ordercontype[i]);
				$('.orderConkind').eq(i).val(orderConkind[i]);
				$('.orderCtime').eq(i).val(oDate);
			}
			var table1 = getFormJson(t.parents('.contract').find('#orderForm1'));
			var table2 = getFormJson(t.parents('.contract').find('#orderForm2'));
			if(ordercontype.length > 1) {
				table = [table1, table2]
			} else {
				table = [table1];
			}
			var remarksDet = $("#remarksDet");
			if(checkNull($('.contract .CNull:visible'))) {
				if(isPrice($('.contract .price:visible'))) {
					if(isPositiveInteger($('.contract .num:visible'))) {
						if(islength($('.contract textarea[name=accountnum]:visible'))) {

							layer.load(2);
							$.ajax({
								url: url,
								type: "post",
								dataType: "json",
								data: {
									con: JSON.stringify(table),
									br: $('.contract form .br').val()
								},
								success: function(d) {
									layer.close(layer.index);
									layer.msg(d.msg);
									if(d.code === 1) {
										$('.contractSetIn textarea,.contractSetIn select,.contractSetIn input').val('');
										$('.curtain,.contractSetIn').hide();
										$('.contract form .br').remove();
										if($('#mystu_tab').find('li').length > 2) {
											$('#mystu_tab').find('li:eq(4)').trigger('click');
										} else {
											$('#mystu_tab').find('li:eq(0)').trigger('click');
										}
									}
								}
							})
						} else {
							layer.msg('支付账号长度超出限制');
						}
					} else {
						layer.msg('课时请输入数字');
					}
				} else {
					layer.msg('价格请输入数字,小数点最多两位');
				}
			} else {
				layer.msg('请添写必填内容');
			}
		})
	})
	
	$(document).off('change','.contractSetIn select[name="isdeposit"]').on('change','.contractSetIn select[name="isdeposit"]',function(e){//是否付定金
		var t=$(e.currentTarget);
		if(t.val()==='1'){//是
			t.siblings('.achivClWrap,input[name="deposit"]').show();
		}else if(t.val()==='0'){//否
			t.siblings('.achivClWrap,input[name="deposit"]').hide();
		}
	})
	
	$(document).off('change','.contractSetIn select[name="paytype"]').on('change','.contractSetIn select[name="paytype"]',function(e){//支付方式
		var t=$(e.currentTarget);
		if(t.val()==='现金'){//现金
			t.siblings('textarea[name="accountnum"]').hide();
		}else{
			t.siblings('textarea[name="accountnum"]').show();
		}
	})	
	
	$(document).off('click', '.contractSetIn .cancel').on('click', '.contractSetIn .cancel', function(e) { //取消录入合同
		$('.contractSetIn textarea,.contractSetIn select,.contractSetIn input').val('');
		$('.contract form .br').remove();
	})
	$(document).off('change', '.contract input[name=perprice]:visible,.contract input[name=couersum]:visible').on('change', '.contract input[name=perprice]:visible,.contract input[name=couersum]:visible', function(e) { //计算总价
		var t = $(e.currentTarget);
		var p = t.parents('form').find($('.contract input[name=perprice]'));
		var c = t.parents('form').find($('.contract input[name=couersum]'));
		if(p.val() != '' && c.val() != '' && isPositiveInteger(c) && isPrice(p)) {
			t.parents('form').find($('.contract input[name=allprice]')).val((p.val() * 100 * c.val() / 100).toFixed(2));
		}
	})
}

function tabCount(dis) { //选项卡统计数
	$.ajax({
		url: 'student/queryWholeCou',
		data: {
			dis: dis
		},
		success: function(d) {
			var tabTotal = stutab.find('li>span'),
				d = d.data[0],
				arr = [];
			for(x in d) {
				arr.push(d[x]);
			}
			for(var i = 0; i < tabTotal.length; i++) {
				tabTotal.eq(i).html(arr[i]);
			}
		}
	})
}

function groudpSetIn(upload) { //批量导入学生
	upload.render({ //允许上传的文件后缀
		elem: '#upload1',
		url: 'student/batchImport',
		accept: 'file' //普通文件
			,
		exts: 'xls|xlsx' //只允许上传压缩文件
			,
		before: function(obj) { //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
			layer.load(2);
		},
		done: function(res) {
			layer.close(layer.index);
			layer.msg(res.msg);
			if(res.code === 1) {
				$('.tab_current').trigger('click');
			}
		}
	});
}

function stuRemark() { //添加备注
	$(document).off('click', '.icon-pen.stuRemark,.sctNavMain li[key="remark"]').on('click', '.icon-pen.stuRemark,.sctNavMain li[key="remark"]', function(e) { //备注
		var that = $(e.currentTarget);
		localStorage.stuid = that.parents('tr').find('.nameDetail').attr('myid') || $('.sctName').attr('sid');
		$('.curtain').show();
		$.ajax({
			url: "student/queryContactlogByStuid",
			type: "post",
			dataType: "json",
			data: {
				stuid: localStorage.stuid
			},
			success: function(d) {
				var html = '',
					d = d.data;
				for(var i = 0; i < d.length; i++) {
					html += '<tr><td>' + d[i].ctime + '</td><td><div title="' + d[i].content + '">' + d[i].content + '</div></td><td>' + d[i].user.username + '</td></tr>';
				}
				$('.myRemark tbody').html(html);
			}
		})
	})
	$(document).off('click', '.setInremark .cancel').on('click', '.setInremark .cancel', function(e) { //取消添加备注
		$('.setInremark textarea').val('');
	})
	$(document).off('click', '#remarks').on('click', '#remarks', function() { //备注提交
		var remarksDet = $("#remarksDet");
		if(remarksDet.val() != '') {
			layer.load(2);
			$.ajax({
				url: "student/insertContactlog",
				type: "post",
				dataType: "json",
				data: {
					content: $("#remarksDet").val(),
					stuid: localStorage.stuid
				},
				success: function(d) {
					layer.close(layer.index);
					layer.msg(d.msg);
					if(d.code=== 1) {
						remarksDet.val('');
						$('.setInremark,.curtain').hide();
					}
				}
			})
		} else {
			layer.msg('请添写备注');
		}
	})
}

function searchTeacher() { //模糊查询老师
	$(document).off('propertychange input', '.theTeacher').on('propertychange input', '.theTeacher', function() { //模糊查询老师
		var n = $('.theTeacher').val();
		$.ajax({
			type: "post",
			url: "student/queryLikeName",
			dataType: 'json',
			data: {
				username: n
			},
			success: function(d) {
				var teacherName = $('.teacherName');
				var html = '',
					d = d.data;
				for(var i = 0; i < d.length; i++) {
					html += '<li data-id="' + d[i].id + '">' + d[i].username + '</li>';
				}
				$('.teacherName').html(html);
				if(d.length != 0) {
					$('.teacherName').show();
				} else {
					$('.toCustormService .userid').val('');
				}
			}
		});
	});
	$(document).off('click', '.teacherName li').on('click', '.teacherName li', function() { //选择老师
		$('.theTeacher').val($(this).html());
		$('.userid').val($(this).attr('data-id'));
	})
}

function Reservations() { //预约试听
	$(document).off('click', '.addS .icon-n').on('click', '.addS .icon-n', function(e) { //预约试听弹框
		var that = $(e.target);
		$('.stuid').val(that.parents('tr').find('.nameDetail').attr('myid'));
	})
	$(document).off('click', '#orderBtn').on('click', '#orderBtn', function() { //试听提交
		$('.hopetime').val($('#achivClendarClass').val() + ' ' + $('.classRanget').html());
		var getInOrder = $('.getInOrders form');
		var orderNeed = $('.getInOrders .orderNeed');
		var auditiondate = $('.getInOrders .auditiondate');
		var teacherName = $('.getInOrders .teacherName');
		var userid = $('.getInOrders .userid');
		if(userid.val() != '') {
			if(checkNull(orderNeed)) {
//				if(isPositiveInteger(auditiondate)) {
					layer.load(2);
					$.ajax({
						type: "POST",
						url: "student/insertAppointment",
						data: getInOrder.serialize(), // 序列化表单值  
						async: false,
						dataType: 'json',
						success: function(d) {
							layer.close(layer.index);
							layer.msg(d.msg);
							if(d.code === 1) {
								$('.getInOrders,.curtain').hide();
								$('#mystu_tab').find('li:eq(1)').trigger('click');
							}
						}
					});
				} else {
					layer.msg('请填写必填内容');
				}
//			} else {
//				layer.msg('课时请填写数字');
//				auditiondate.focus();
//			}
		} else {
			layer.msg('请检索并选择老师');
			teacherName.focus();
		}
	})

	$(document).off('click', '.getInOrder .cancel').on('click', '.getInOrder .cancel', function() { //试听取消
		$('.getInOrder form input,.getInOrder form select,.getInOrder form textarea').val('');
	})
}

function SMS(d) { //发送短信
	var msgContent = [];
	var msg = {};
	for(var i = 0; i < d.length; i++) {
		d[i].appointclass.account = turnNull(d[i].appointclass.account);
		d[i].grade = onGrade(d[i]);
		d[i].weaksubjects = onSubject(d[i], 'weaksubjects');
		msg[i] = {
			tephone: d[i].usertable.phone,
			stphone: d[i].phone,
			te: [d[i].usertable.username, d[i].appointclass.timeval, d[i].grade, d[i].weaksubjects, d[i].stuname, d[i].appointclass.auditiondate, d[i].appointclass.account],
			st: [d[i].stuname, d[i].appointclass.timeval, d[i].grade, d[i].weaksubjects, d[i].usertable.username, d[i].appointclass.auditiondate, d[i].appointclass.account]
		}
		msgContent.push(msg[i]);
	}
	msgContent = JSON.stringify(msgContent);
	layer.load(2);
	$.ajax({
		type: "post",
		url: "student/sendMessge",
		dataType: "json",
		data: {
			ms: msgContent
		},
		success: function(d) {
			layer.close(layer.index);
			layer.msg(d.msg);
			if(d.code === 1) {
				$('.tab_current').trigger('click');
			}
		}
	});
}

function smsMore(d) { //多条短信
	$(document).off('click', '.icon-paper-airplane').on('click', '.icon-paper-airplane', function() {
		var str = '';
		for(var i = 0; i < d.data.length; i++) {
			str += d.data[i].stustatus;
		}
		if(str.indexOf('0') != -1) {
			layer.msg('请审核通过后发送');
		} else {
			SMS(d.data);
		}
	})
}

function smsOne(d, obj) { //单条短信
	var arr = [];
	if(obj === 'msg') {
		if(d.stustatus === '1') {
			arr.push(d);
			SMS(arr);
		} else {
			layer.msg('请审核通过后发送');
		}
	}
}

function classRemark() { //试听反馈
	$(document).off('click', '.operation .fillInFeedback').on('click', '.operation .fillInFeedback', function(e) { //打开反馈弹框
		var target = $(e.target);
		localStorage.stuid = target.parents('tr').find('.nameDetail').attr('myid');
	})
	$(document).off('click', '.feedbackRemark .examineDet li').on('click', '.feedbackRemark .examineDet li', function(e) { //选择反馈类型
		var target = $(e.target);
		$('.feedbackRemark .examine span').attr('data-otype', target.attr('data-otype'));
	})
	$(document).off('click', '.feedbackRemark .cancel').on('click', '.feedbackRemark .cancel', function(e) { //取消反馈
		$('.feedbackRemark textarea').val('');
	})
	$(document).off('click', '#feedbackBtn').on('click', '#feedbackBtn', function() { //提交反馈
		layer.load(2);
		$.ajax({
			url: 'student/insertRemarks',
			type: 'post',
			dataType: 'json',
			data: {
				fremark: $('#feedbackMain').val(),
				stuid: localStorage.stuid,
				ftype: $('.feedbackRemark .examine .fbtarget').attr('data-otype'),
			},
			success: function(d) {
				layer.close(layer.index);
				layer.msg(d.msg);
				if(d.code === 1) {
					$('.curtain').hide();
					$('#mystu_tab').find('li:eq(2)').trigger('click');
				}

			}
		})
	})
}

function editStuInfor() { //编辑学生信息
	$(document).off('click', '.sctNavMain li[key="editStuInfor"]').on('click', '.sctNavMain li[key="editStuInfor"]', function(e) { //载入信息
		var that = $(e.target);
		$.ajax({
			type: "post",
			url: "student/queryOneStu",
			data: {
				id: $('.sctName').attr('sid')
			},
			dataType: 'json',
			success: function(d) {
				var html = '';
				var sex = '';
				var subject = '';
				var d = d.data;
				for(x in d) {
					if(d[x] === null) {
						d[x] = '';
					}
				}
				if(d.sex === '0') {
					sex = '<div class="clearfix"><label for=""class="fl required"><i class="xh">*</i>性别</label><span class="fl radio radioClk"><input type="radio" class=" importStu" value="0" name="sex" checked="checked" /></span><span class="fl afterRadio">男</span><span class="fl radio"><input type="radio" value="1" class=" importStu" name="sex"/></span><span class="fl afterRadio">女</span></div>'
				} else {
					sex = '<div class="clearfix"><label for=""class="fl required"><i class="xh">*</i>性别</label><span class="fl radio"><input type="radio" class=" importStu" value="0" name="sex"/></span><span class="fl afterRadio">男</span><span class="fl radio radioClk"><input type="radio" value="1"  checked="checked" class=" importStu" name="sex"/></span><span class="fl afterRadio">女</span></div>'
				}
				html = '<form action=""method="post"><input type="hidden" value="' + $('.sctName').attr('sid') + '" name="id" /><div class="clearfix"><label for=""class="fl required"><i class="xh">*</i>姓名</label><input type="text"class="fl importStu"name="stuname"placeholder="请输入内容" value="' + d.stuname + '" /></div>' + sex + '<div class="clearfix"><label for=""class="fl required"><i class="xh">*</i>手机号</label><input type="text"class="fl importStu"name="phone"placeholder="请输入内容" value="' + d.phone + '" /></div><div class="clearfix"><label for="" class="fl required">年龄</label><input type="text" class="fl" name="age" value="' + d.age + '" placeholder="请输入内容"></div><div class="clearfix"><label for="" class="fl required">生日</label><div class="positionR fl achivClWrap" id="div_month_picker"><input type="text" class="layui-input achivClendar" name="birthday" placeholder="请选择时间段" value="' + d.birthday + '" id="birthDatesc"> <i class="positionA iconfont icon-rili"></i></div></div><div class="clearfix"><label for="" class="fl required">推荐人</label><input type="text" class="fl" name="referee" value="' + d.referee + '" placeholder="请输入内容"></div><div class="clearfix"><label for=""class="fl required"><i class="xh">*</i>年级</label><select class="select grade"class="fl  importStu"name="grade" p="' + d.grade + '"><option value="">请选择</option></select></div><input type="hidden"name="weaksubjects"id="weaksubjects" value=\'' + d.weaksubjects + '\'/><div class="clearfix subOptWrap"><label for=""class="fl">薄弱科目</label><div class="subOptWrapIn fl">';
				if(d.weaksubjects!="") {
					d.weaksubjects = JSON.parse(d.weaksubjects);					
					for(var i = 0, l = d.weaksubjects.length; i < l; i++) {
						subject += '<div class="fl subOpt positionR weakSubject"><select class="select subject" p="' + d.weaksubjects[i]["科目"] + '"><option value="">请选择</option></select><select class="select goal" p="' + d.weaksubjects[i]["满分"] + '"><option value="">请选择满分制</option><option value="200满分">200满分</option><option value="160满分">160满分</option><option value="150满分">150满分</option><option value="120满分">120满分</option><option value="110满分">110满分</option><option value="100满分">100满分</option><option value="90满分">90满分</option></select><select class="select range"  p="' + d.weaksubjects[i]["区间"] + '"><option value="">区间</option><option value="10±10">10±10</option><option value="20±10">20±10</option><option value="30±10">30±10</option><option value="40±10">40±10</option><option value="50±10">50±10</option><option value="60±10">60±10</option><option value="70±10">70±10</option></select><div class="plus positionA"><i class="iconfont icon-jiahao"></i></div></div>';
					}
				} else {
					subject += '<div class="fl subOpt positionR weakSubject"><select class="select subject" ><option value="">请选择</option></select><select class="select goal"><option value="">请选择满分制</option><option value="200满分">200满分</option><option value="160满分">160满分</option><option value="150满分">150满分</option><option value="120满分">120满分</option><option value="110满分">110满分</option><option value="100满分">100满分</option><option value="90满分">90满分</option></select><select class="select range"  ><option value="">区间</option><option value="10±10">10±10</option><option value="20±10">20±10</option><option value="30±10">30±10</option><option value="40±10">40±10</option><option value="50±10">50±10</option><option value="60±10">60±10</option><option value="70±10">70±10</option></select><div class="plus positionA"><i class="iconfont icon-jiahao"></i></div></div>';
				}

				html += subject + '</div></div><div class="clearfix"><label for=""class="fl">就读学校</label><input type="text"class="fl"placeholder="请输入内容"name="school" value="' + d.school + '"/></div><div class="clearfix"><label for=""class="fl required">所在地</label><input type="text"class="fl"name="address"placeholder="请输入内容" value="' + d.address + '"  /></div><div class="clearfix"><label for=""class="fl">学习态度</label><input type="text"class="fl"name="learnattitude"placeholder="请输入内容" value="' + d.learnattitude + '" /></div><div class="clearfix"><label for="" class="fl">联系人</label><input type="text" class="fl" name="guardian" value="' + d.guardian + '" placeholder="请输入内容"></div><div class="clearfix"><label for="" class="fl">联系电话</label><input type="text" class="fl" name="contactnumber" value="' + d.contactnumber + '" placeholder="请输入内容"></div><div class="clearfix"><label for=""class="fl">麦克风/耳机</label><select class="select"class="fl"name="microphone" p="' + d.microphone + '"><option value="">请选择</option><option value="有">有</option><option value="无">无</option></select></div><div class="clearfix note"><label for=""class="fl">添加备注</label><textarea name="remark"class="fl">' + d.remark + '</textarea></div>'
				$(".editStuInfor .stuInfForm").html(html);
				dateCLsr("#birthDatesc");//生日
				$('input:not([autocomplete]),textarea:not([autocomplete]),select:not([autocomplete])').attr('autocomplete', 'off'); //关闭表单自动填充				
				$('.plus:not(:last)').hide();
				paramSubject();
				paramGrade();
				setTimeout(function() {
					reloadSG();
				}, 100)

				function reloadSG() {
					$('.stuInfForm select').each(function() {
						$(this).val($(this).attr('p'));
					});
				}
			}
		});
	});

	$(document).off('click', '.editStuInfor .save').on('click', '.editStuInfor .save', function() { //修改编辑学生信息
		var importForm = $('.editStuInfor form');
		//			ifStuname=importForm.find('input[name=stuname]'),
		//			ifPhone=importForm.find('input[name=stuname]');			
		var attr = [],
			weakSub = $('.weakSubject:visible');
		var checkPhone = checkMobile($('.editStuInfor input[name=phone]').val());
		var importStu = $('.importStu:visible');
		
		if(checkNull(importStu) && $('.editStuInfor input[type=radio].importStu').is(':checked')) {
			if(checkPhone) {
				for(var i = 0; i < weakSub.length; i++) { //薄弱科目数据处理
					var obj = {
						'科目': weakSub.eq(i).children("select").eq(0).val(),
						'满分': weakSub.eq(i).children("select").eq(1).val(),
						'区间': weakSub.eq(i).children("select").eq(2).val()
					};
					console.log(obj);
					attr.push(obj);					
				}
				$('#weaksubjects').val(JSON.stringify(attr));
				$.ajax({
					type: "POST",
					url: "student/updateStu",
					data: importForm.serialize(), // 序列化表单值
					success: function(d) {
						layer.msg(d.msg);
						$('.bombBox,.curtain').hide();                   
					}
				});
			} else {
				layer.msg('请输入正确手机号');
			}
		} else {
			layer.msg('请填写必填信息');
		}
	})
}

function showOrder() { //编辑查看合同
	function kindAjug(d) {
		if(d === '1') {
			return '新签';
		} else if(d === '0') {
			return '续签';
		}
	}
	$(document).off('click', '.operation  .editOrderBtn,.operation .ccCheckOrder').on('click', '.operation .editOrderBtn,.operation .ccCheckOrder', function(e) { //查看合同
		var that = $(e.target);
		localStorage.stuid = that.parents('tr').find('.nameDetail').attr('myid') || that.attr('sid');
		localStorage.oId = that.parents('tr').find('.oid').attr('oid') || that.attr('oid');
		$.ajax({
			type: "post",
			url: "student/queryOneCont",
			data: {
				uid: localStorage.stuid,
				sid: localStorage.oId
			},
			dataType: 'json',
			success: function(d) {
				var d = d.data;
				var c = d.cont;
				var html = '';
				for(x in c) {
					if(c[x] === null) {
						c[x] = '';
					}
				}
				var cstatus=that.attr('cstatus');
				if(that.attr('cstatus') == '2'||that.attr('cstatus') == '签约未通过') {
					$('.contractEdit h2').html('编辑合同');
					html = '<section action="" method="post"><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>姓名/年级</label><p class="orderUname fl">' + d.stname + '</p><p class="orderGrade fl">' + (d.grade ? d.grade : " ") + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>签约类型</label><p v="1"class="beOrderType">新签</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>合同类型</label><select class="select CNull" class="fl" id="orderTypeSel" p="' + c.contype + '"><option value="">请选择</option><option value="0">常规合同</option><option value="1">暑假合同</option><option value="2">寒假合同</option></select></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>签约日期</label><div class="positionR fl achivClWrap" id="div_month_picker"><input type="text" class="layui-input achivClendar CNull" placeholder="请选择时间" id="achivClendarOrs"  value="' + c.ctime + '"> <i class="positionA iconfont icon-rili"></i></div><script type="text/javascript">dateCLs();</script></div><section class="clearfix orderMain"><form id="orderForm1" class="fl"><div class="orderDetail orderDetail1"><h3 class="orderType orderType1"></h3><input type="hidden" name="stuid" value="' + c.stuid + '" class="orderStuid"> <input type="hidden" name="conkind" value="' + c.conkind + '" class="orderConkind CNull"> <input type="hidden" name="contype" class="ordercontype CNull" value="' + c.contype + '"> <input type="hidden" name="ctime" class="orderCtime" value="' + c.ctime + '"><input type="hidden" name="isline"  value="0" /><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>合同编号</label><input type="hidden"  name="id" value="' + c.id + '"><input type="text" class="fl CNull" name="cnumber" value="' + c.cnumber + '"  placeholder="请输入内容"></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>现单价</label><div class="fl"><input type="text" class="CNull price" placeholder="请输入内容" name="perprice" value="' + c.perprice + '"></div></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>原单价</label><div class="fl"><input type="text" class="CNull price" placeholder="请输入原单价" name="forprice" value="' + c.forprice + '"></div></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>签约课时</label><input type="text" class="fl CNull num" placeholder="请输入内容" name="couersum" value="' + c.couersum + '"></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>赠送课时</label><input type="text" class="fl CNull num"  name="freesum" value="' + c.freesum + '" placeholder="请输入内容"></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>总价</label><input type="text" class="fl CNull price" name="allprice" value="' + c.allprice + '" placeholder="请输入内容"></div>'
					+'<div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>是否付定金</label><select class="select fl CNull"  name="isdeposit" p="' + c.isdeposit + '"><option value="1">是</option><option value="0">否</option></select><br /><div class="positionR fl achivClWrap" style="margin-left:100px;"><input type="text" class="layui-input achivClendar CNull" placeholder="请选择时间" value="' +(c.paydate?timestampToData(c.paydate):"")+ '"  id="achivClendarDj"><i class="positionA iconfont icon-rili"></i></div><br /><input type="text" class="fl CNull num price" value="' + (c.deposit?c.deposit:"") + '" name="deposit" style="margin-left:100px;margin-top:2px;" placeholder="请输入内容"></div><input type="hidden" name="paydate" value="' +(c.paydate?c.paydate:"")  + '" /><script>dateCLsrs("#achivClendarDj")<\/script>'+
					'<div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>支付方式</label><div class="fl"><select class="select CNull" name="paytype" p="' + c.paytype + '"><option value="">请选择</option><option value="支付宝">支付宝</option><option value="微信">微信</option><option value="银行卡">银行卡</option><option value="现金">现金</option><option value="分期">分期</option><option value="其他">其他</option></select><br>'
						+'<textarea  class="CNull" name="accountnum" placeholder="请输入内容" style="width:160px;height:60px;line-height:30px;padding:0 12px;margin-top:2px;box-sizing:border-box;">' +(c.accountnum?c.accountnum:"") + '</textarea>'
					+'</div></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>家长姓名</label><input type="text" class="fl CNull" name="contact" value="' + c.contact + '" placeholder="请输入内容"></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>家长电话</label><input type="text" class="fl CNull" value="' + c.cphone + '" name="cphone" placeholder="请输入内容"></div></div></form></section></div></section><div class="stuInfFoot clearfix"><div class="fr clearfix"><button type="button" class="fl cancel OptBtn">取消</button><button type="button" id="orderSubmit" class="fl save OptBtn">保存</button></div></div>';
					$('.contractEdit .stuInfForm').html(html);
				}
				else 
//				if(that.attr('cstatus') == '0')
				{					
						$('.contractEdit h2').html('查看合同<i class="iconfont fr icon-guanbi1"></i>');
						html = '<section action="" method="post"><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>姓名/年级</label><p class="orderUname fl">' + d.stname + '</p><p class="orderGrade fl">' + (d.grade ? d.grade : " ") + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>签约类型</label><p v="1"class="beOrderType">' + kindAjug(c.conkind) + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>合同类型</label><select class="select CNull"  class="fl" id="orderTypeSel" p="' + c.contype + '"><option value="">请选择</option><option value="0">常规合同</option><option value="1">暑假合同</option><option value="2">寒假合同</option></select></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>签约日期</label><div class="positionR fl achivClWrap" id="div_month_picker"><input type="text" class="layui-input achivClendar CNull" placeholder="请选择时间" id="achivClendarOrs"   value="' + c.ctime + '"> <i class="positionA iconfont icon-rili"></i></div></div><section class="clearfix orderMain"><form id="orderForm1" class="fl"><div class="orderDetail orderDetail1"><h3 class="orderType orderType1"></h3><input type="hidden" name="stuid" value="' + c.stuid + '" class="orderStuid"> <input type="hidden" name="conkind" value="' + c.conkind + '" class="orderConkind CNull"> <input type="hidden" name="contype" class="ordercontype CNull" value="' + c.contype + '"> <input type="hidden" name="ctime" class="orderCtime" value="' + c.ctime + '"><input type="hidden" name="isline"  value="0" /><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>合同编号</label><input type="hidden"  name="id" value="' + c.id + '"><input type="text" class="fl CNull" name="cnumber" value="' + c.cnumber + '"  placeholder="请输入内容"></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>现单价</label><div class="fl"><input type="text" class="CNull price" placeholder="请输入内容" name="perprice" value="' + c.perprice + '"></div></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>原单价</label><div class="fl"><input type="text" class="CNull price" placeholder="请输入原单价" name="forprice" value="' + c.forprice + '"></div></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>签约课时</label><input type="text" class="fl CNull num" placeholder="请输入内容" name="couersum" value="' + c.couersum + '"></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>赠送课时</label><input type="text" class="fl CNull num"  name="freesum" value="' + c.freesum + '" placeholder="请输入内容"></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>总价</label><input type="text" class="fl CNull price" name="allprice" value="' + c.allprice + '"  placeholder="由计算所得"></div>'
											+'<div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>是否付定金</label><select class="select fl CNull"  name="isdeposit" p="' + c.isdeposit + '"><option value="1">是</option><option value="0">否</option></select><br /><div class="positionR fl achivClWrap" style="margin-left:100px;"><input type="text" class="layui-input achivClendar CNull" placeholder="请选择时间" value="' +(c.paydate?timestampToData(c.paydate):"")+ '"  id="achivClendarDj"><i class="positionA iconfont icon-rili"></i></div><br /><input type="text" class="fl CNull num price" value="' + (c.deposit?c.deposit:"") + '" name="deposit" style="margin-left:100px;margin-top:2px;" placeholder="请输入内容"></div><input type="hidden" name="paydate" value="' +(c.paydate?c.paydate:"")  + '" />'+
											'<div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>支付方式</label><div class="fl"><select class="select CNull" name="paytype" p="' + c.paytype + '"><option value="">请选择</option><option value="支付宝">支付宝</option><option value="微信">微信</option><option value="银行卡">银行卡</option><option value="现金">现金</option><option value="分期">分期</option><option value="其他">其他</option></select><br>'
											+'<textarea  class="CNull" name="accountnum" placeholder="请输入内容" style="width:160px;height:60px;line-height:30px;padding:0 12px;margin-top:2px;box-sizing:border-box;">' +(c.accountnum?c.accountnum:"") + '</textarea>'
											+'</div></div> <div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>家长姓名</label><input type="text" class="fl CNull num" name="contact" value="' + c.contact + '" placeholder="请输入内容"></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>家长电话</label><input type="text" class="fl CNull num" value="' + c.cphone + '" name="cphone" placeholder="请输入内容"></div></div></form></section></div></section>';										
					$('.contractEdit .stuInfForm').html(html);
				} 

				setTimeout(function() {
					reloadSG(cstatus);
				}, 100)

				function reloadSG(cstatus) {
					$('.beOrderType,#orderTypeSel,.select[name="paytype"],.select[name="isdeposit"]').each(function() {
						$(this).val($(this).attr('p'));
						var y=$('.select[name="isdeposit"]:visible');
						var m=$('.select[name="paytype"]:visible');
						console.log(y.val());
						console.log(m.val());
						if(y.val()==='1'){//是
							y.siblings('.achivClWrap,input[name="deposit"]').show();
						}else if(y.val()==='0'){//否
							y.siblings('.achivClWrap,input[name="deposit"]').hide();
						}						
						if(m.val()==='现金'){//现金
							m.siblings('textarea[name="accountnum"]').hide();
						}else{
							m.siblings('textarea[name="accountnum"]').show();
						}
						if(!(cstatus== '2'||cstatus== '签约未通过')){
							$('.contractEdit .stuInfForm input,.contractEdit .stuInfForm textarea').attr("readonly", "readonly");
							$('.contractEdit .stuInfForm select').attr('disabled', 'disabled');
						}
					});
				}
			}
		});
	})
	//编辑合同
	orderType();
	orderSetIn("student/updateContract");
}

function toCusService() { //移交客服
	$(document).off('click', '.operation .cuestormSurvice,li[key=transfer]').on('click', '.operation .cuestormSurvice,li[key=transfer]', function(e) {
		var that = $(e.target);
		$('.toCustormService .stuid').val(that.parents('tr').find('.nameDetail').attr('myid')||$('.sctName').attr('sid'));
		console.log($('.sctName').attr('sid'));
	})

	$(document).off('click', '#toCusService').on('click', '#toCusService', function(e) { //提交
		var cusSer = $('.toCustormService');
		$('.hopetime').val($('#achivClendarClassD').val() + ' ' + $('.classRanget').html());
		var infor = getFormJson('#tocusser');
		
		if($('.toCustormService .userid').val() != '') {
			if(checkNull($('.toCustormService input,.toCustormService select'))) { //非空验证
				$.ajax({
					type: "post",
					url: "student/addEdule",
					data: {
						edu: JSON.stringify(infor)
					},
					dataType: 'json',
					success: function(d) {
						layer.msg(d.msg);
						$('.bombBox,.curtain').hide();
						$('#mystu_tab').find('li:last').trigger('click');
					}
				});
			} else {
				layer.msg('请填写必填内容')
			}
		} else {
			layer.msg('请检索并选择老师')
		}

	})
}