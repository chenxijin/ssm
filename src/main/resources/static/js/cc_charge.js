//咨询主管
////分配学生
function allotStu(table, url) {
	$(document).off('click', '.allotStudentBoxBtn').on('click', '.allotStudentBoxBtn', function(e) { //分配学生-弹框打开
		var t = $(e.target);
		var arr = JSON.stringify([t.attr('sid')]);
		$('.allotStu').find('h2').attr('sid', arr);
	})

	$(document).off('click', '.allotStudentBoxBtnAll').on('click', '.allotStudentBoxBtnAll', function(e) { //分配学生-弹框打开
		var t = $(e.target);
		var d = table.checkStatus('tableStu_1').data;
		var arr = [];
		for(var i = 0; i < d.length; i++) {
			arr.push(d[i].id)
		}
		$('.allotStu').find('h2').attr('sid', JSON.stringify(arr));
		$('.allotStu').show();
		$('.curtain').show();
	})

	$(document).off('click', '.allotStudentBoxBtn').on('click', '.allotStudentBoxBtn', function(e) { //分配学生-弹框打开
		var t = $(e.target);
		$('.allotStu').find('h2').attr('sid', t.attr('sid'));
	})
	$(document).off('click', '.belonger').on('click', '.belonger', function() { //分配学生-团队列表
		$('.allotBox').slideDown('fast');
		var team = '';
		layer.load(2);
		$.ajax({
			url: 'student/queryTeamList',
			type: 'post',
			dataType: 'json',
			success: function(d) {
				var da = d;
				d = da.data;
				layer.close(layer.index);
				if(da.code === 0) {
					team = '<li tid="xyg">新员工(<span>' + d[0].newuser + '</span>)</li>';
					for(var i = 0; i < d.length; i++) {
						team += '<li tid="' + d[i].id + '">' + d[i].tname + '(<span>' + d[i].usersum + '</span>)</li>';
					}
				}
				/* newuser 新员工
				  id    团队 id
				  tname 团队名
				  usersum 人员数*/
				$('.allotTeam').html(team);
			}
		})
	})
	$(document).off('click', '.allotTeam li').on('click', '.allotTeam li', function(e) { //分配学生-	团队成员列表
		var man = '',
			t = $(e.currentTarget);
		layer.load(2);
		if(t.attr('tid') === 'xyg') {

			$.ajax({
				url: 'student/queryNewStaff',
				type: 'post',
				dataType: 'json',
				success: function(d) {
					var d = d.data;
					layer.close(layer.index);
					for(var i = 0; i < d.length; i++) {
						man += '<li class="fl" mid="' + d[i].id + '">' + d[i].username + '</li>';
					}
					$('.allotMan').html(man);
					/* id 成员id
					 username 成员姓名*/
				}
			})
		} else {
			$.ajax({
				url: 'afterSaleManage/student/queryTeamUserBytid',
				type: 'post',
				dataType: 'json',
				data: {
					teamid: t.attr('tid')
				},
				success: function(d) {
					var d = d.data;
					layer.close(layer.index);
					for(var i = 0; i < d.length; i++) {
						man += '<li class="fl" mid="' + d[i].id + '">' + d[i].username + '</li>';
					}
					$('.allotMan').html(man);
					/* id 成员id
					 username 成员姓名*/
				}
			})
		}
	})

	$(document).off('click', '.allotMan li').on('click', '.allotMan li', function(e) { //分配学生-	选择
		var t = $(e.currentTarget);
		var b = $('.belonger');
		var a = $('.allotBox');
		b.html(t.html());
		b.attr('tid', t.attr('mid'));
		a.slideUp('fast');
	})

	$(document).off('click', '.allotStu .save').on('click', '.allotStu .save', function(e) { //分配学生-	提交
		var t = $(e.currentTarget);
		var b = $('.belonger');
		var cur = $('.curtain');
		layer.load(2);
		$.ajax({
			url: url,
			type: 'post',
			dataType: 'json',
			data: {
				tid: b.attr('tid'),
				sid: $('.allotStu h2').attr('sid')
			},
			success: function(d) {
				layer.close(layer.index);
				layer.msg(d.msg); //(1,"操作成功",0,null)(0,"操作失败",0,null)
				if(d.code === 1) {
					b.html('');
					b.attr('tid', '');
					cur.hide();
					$('.tab_current').trigger('click');
				}
			}
		})
	})
}
//发公告
function sendMsg() {
	$(document).off('click', '#sendMsg').on('click', '#sendMsg', function() {
		$.ajax({
			type: "post",
			url: "msg/sendMsg",
			dataType: 'json',
			data: {
				mtitle: $('.sendNotice .msgTitle').val(),
				mcontent: $('.sendNotice .msgMain').val()
			},
			success: function(d) {
				layer.msg(d.msg);
				if(d.code === 1) {
					$('.sendNotice').hide();
					$('.curtain').hide();
					$('.tab_current').trigger('click');
				}
			}
		});
	})
}
//修改公告
function editMsg() {
	$(document).off('click', '.editMsg').on('click', '.editMsg', function(e) {
		var t = $(e.currentTarget);
		var edit = $('.editNotice');
		var ti = t.parents('tr').find('td[data-field="mtitle"] div').html();
		var m = t.parents('tr').find('td[data-field="mcontent"] div').html();
		edit.find('.msgTitle').val(ti);
		edit.find('.msgMain').html(m);
		$('.curtain').show();
		edit.attr('nid', t.attr('nid'))
	});

	$(document).off('click', '#editMsg').on('click', '#editMsg', function() {
		$.ajax({
			type: "post",
			url: "msg/sendMsg",
			dataType: 'json',
			data: {
				mtitle: $('.editNotice .msgTitle').val(),
				mcontent: $('.editNotice .msgMain').val()
			},
			success: function(d) {
				layer.msg(d.msg);
				if(d.code === 1) {
					$('.sendNotice').hide();
					$('.curtain').hide();
					$('.tab_current').trigger('click');
				}
			}
		});
	})
}
//业绩报表
function earnChart(url, fieldo, titleo, fieldt, titlet, ctime, parm) {
	// 指定图表的配置项和数据
	layui.use('table', function() {
		var table = layui.table;
		table.render({
			elem: '#mystu_table',
			url: url,
			page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
				layout: ['count', 'prev', 'page', 'next', 'skip'] //自定义分页布局
					//,curr: 5 //设定初始在第 5 页
					,
				groups: 5 //只显示 1 个连续页码
					,
				first: false //不显示首页
					,
				last: false //不显示尾页
			},
			where: {
				ids: parm,
				ctime: ctime
			},
			id: 'tableStu_1',
			skin: 'line',
			cols: [
				[{
					field: fieldo,
					align: 'center',
					minWidth: 100,
					title: titleo
				}, {
					field: fieldt,
					align: 'center',
					minWidth: 100,
					title: titlet
				}]
			],
			done: function(d) {
				var d = d.data;
				var n = [];
				var p = [];
				for(var i = 0; i < d.length; i++) {
					d[i].allprice = dataUde(d[i].allprice);
					n.push(d[i][fieldo]);
					p.push(parseInt(d[i].allprice));
				}
				myChart(n, p, '业绩金额/万');

			}
		});
	});
}

//客户报表
function customerChart(url, k, kt, a, at, b, bt, c, ct, d, dt, e, et, f, ft, parm) {
	// 指定图表的配置项和数据
	layui.use('table', function() {
		var table = layui.table;
		table.render({
			elem: '#mystu_table',
			url: url,
			page: { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
				layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'] //自定义分页布局
					//,curr: 5 //设定初始在第 5 页
					,
				groups: 5 //只显示 1 个连续页码
					,
				first: false //不显示首页
					,
				last: false //不显示尾页
			},
			where: parm,
			id: 'tableStu_1',
			skin: 'line',
			cols: [
				[{
					field: k,
					align: 'center',
					minWidth: 100,
					title: kt
				}, {
					field: a,
					align: 'center',
					minWidth: 100,
					title: at
				}, {
					field: b,
					align: 'center',
					minWidth: 100,
					title: bt
				}, {
					field: c,
					align: 'center',
					minWidth: 100,
					title: ct
				}, {
					field: d,
					align: 'center',
					minWidth: 100,
					title: dt
				}, {
					field: e,
					align: 'center',
					minWidth: 100,
					title: et
				}, {
					field: f,
					align: 'center',
					minWidth: 100,
					title: ft
				}]
			],
			done: function(d) {
				var d = d.data;
				var n = [];
				var p = [];
				for(var i = 0; i < d.length; i++) {
					d[i].allprice = dataUde(d[i].allprice);
					n.push(d[i].tname);
					p.push(parseInt(d[i].allprice));
				}
			}
		});
	});

	$(document).off('change', '#eReportTeam').on('change', '#eReportTeam', function(e) { //客户报表团队选择
		var t = $(e.target);
		if(t.val() === 'all') {
			userReportTeam({}, 'performance/queryCustomerTeamAll');
			customerChart('performance/queryCustomerTeamList', 'tname', '团队', 'a', '学生总数', 'b', '已转客服', 'c', '待付费', 'd', '试听反馈', 'e', '排课反馈', 'f', '成单待审', parm);
		} else {
			var parm = {
				teamid: t.val()
			};
			userReportTeam(parm, 'performance/queryCustomerTeam');
			customerChart('performance/queryCustomerTeam', 'tname2', '团队', 'stuAll', '学生总数', 'custom', '已转客服', 'payPaid', '待付费', 'auditions', '试听反馈', 'feedback', '排课反馈', 'pending', '成单待审', parm);
		}
	})

	$(document).off('change', '#teamOrone').on('change', '#teamOrone', function(e) { //客户报表团队个人切换
		var t = $(e.target);
		var sel = $('#eReportTeam');
		var inp = $('#eReportMan');
		if(t.val() === '0') {
			sel.show();
			$('.theOneName').hide();
			inp.hide();
		} else {
			inp.show();
			sel.hide();
		}
	});

	$(document).off('input propertychange', '#eReportMan').on('input propertychange', '#eReportMan', function(e) { //客户报表团队选择个人
		var t = $(e.target);
		$.ajax({
			url: 'performance/queryOnlineConsult',
			type: 'post',
			dataType: 'json',
			data: {
				username: t.val()
			},
			success: function(d) {
				var d = d.data;
				var h = '<li aid="all">全部</li>';
				for(var i = 0; i < d.length; i++) {
					h += '<li aid="' + d[i].id + '">' + d[i].username + '</li>';
				}
				$('.theOneName').html(h).show();
			}
		});
	});

	$(document).off('click', '.theOneName li').on('click', '.theOneName li', function(e) { //客户报表团队选择个人点击
		var t = $(e.currentTarget);
		$('#eReportMan').val(t.html());
		var parm = {
			userid: t.attr('aid')
		}
		var url = 'performance/queryCustomerUser';
		if(t.html() === '全部') {
			customerChart('performance/queryCustomerUserListAll', 'username', '名字', 'a', '学生总数', 'b', '已转客服', 'c', '待付费', 'd', '试听反馈', 'e', '排课反馈', 'f', '成单待审', parm); //客户报表团队全部列表				
			userReportTeam(parm, 'performance/queryCustomerUserAll'); //客户报表团队全部图表	
		} else {
			customerChart(url, 'username2', '名字', 'stuAll', '学生总数', 'custom', '已转客服', 'payPaid', '待付费', 'auditions', '试听反馈', 'feedback', '排课反馈', 'pending', '成单待审', parm); //客户报表团队个人列表

			userReportTeam(parm, 'performance/queryCustomerUser'); //客户报表团队个人图表			
		}
		t.parent('ul').empty().hide();
	});

}

function ccTeamList() {
	$.ajax({ //选择团队
		type: 'post',
		dataType: 'json',
		url: 'performance/queryTeamAll',
		success: function(d) {
			var da = d.data;
			var h = '<option value="all">全部</option>';
			for(var i = 0; i < da.length; i++) {
				h += '<option value="' + da[i].id + '">' + da[i].tname + '</option>';
			}
			$('#eReportTeam').html(h)
		}
	})
}

function userReportTeam(id, url) {
	$.ajax({ //客户报表团队单个图表
		type: 'post',
		dataType: 'json',
		url: url,
		data: id,
		success: function(d) {
			var da = d.data[0];
			var n = ['排课反馈', '试听反馈', '待付费', '成单待审', '已转客服'];
			var p = [parseInt(da.feedback), parseInt(da.auditions), parseInt(da.payPaid), parseInt(da.pending), parseInt(da.custom)];

			myChart(n, p, '学生数量/位');

		}
	})
}
//渲染图表
function myChart(n, p, t) {
	// 基于准备好的dom，初始化echarts实例
	console.log(p);
	var myChart = echarts.init(document.getElementById('eReport'));
	var option = {
		tooltip: {},
//		legend: {
//			data: ['业绩']
//		},
		xAxis: {
			data: n,
			axisLabel: {
				//              	inside:true,
				fontSize: 14,
				margin: 25,
				color: '#707070'
			},
			axisLine: {
				lineStyle: {
					color: '#dddddd'
				}
			},
			axisTick: {
				alignWithLabel: true
			},
			boundaryGap: true
		},
		yAxis: {
			splitLine: {
				lineStyle: {
					type: 'dashed',
					color: '#E6E6E6'
				}
			},
			type: 'value',
			name: t,
			min:0,
			nameGap: 25,
			nameTextStyle: {
				fontSize: 14,
				color: '#707070'
			},
			axisLabel: {
				//              	inside:true,
				fontSize: 14,
				margin: 20,
				color: '#707070'
			},
			axisLine: {
				lineStyle: {
					color: '#dddddd'
				}
			},
		},
		series: [{
			//              name: '销量',
			type: 'bar',
			data: p,
			color: ['#FD625B'],
			barCategoryGap: '40%'
		}],
		grid: {
			left: 70,
			right: 60
		}
	};
	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
}
//切换日历
function switchCanlendar() {
	$(document).off('change', '#epDate').on('change', '#epDate', function(e) { //切换日历
		var val = $(e.target).val();
		if(val === "0") {
			$('#achivClendarOr').show().siblings('input').hide();
		} else if(val === "1") {
			$('#achivClendar').show().siblings('input').hide();
		} else if(val === '2') {
			$('#achivClendarY').show().siblings('input').hide();
		} else if(val === '3') {
			$('#rangeClendar').show().siblings('input').hide();
		}
	})
}
//切换个人团队
function switchEarnType() {
	$(document).off('change', '#epType').on('change', '#epType', function(e) {
		var val = $(e.target).val();
		var ctime = $('.achivClendar').val()
		if(val === '0') {
			earnChart('performance/queryTeamPer', 'tname', '团队', 'allprice', '业绩金额/万', ctime, "");
			$('.fiuck').hide();
		} else if(val === "1") {
			$.ajax({
				type: "post",
				url: "performance/queryUserPer",
				dataType: 'json',
				data: {
					ctime: ctime
				},
				success: function(d) {
					var da = d.data;
					var arr = [];
					if(da != null) {
						for(var i = 0; i < da.length; i++) {
							arr.push(da[i].userid);
						}
					}
					var parm = JSON.stringify(arr);
					if(d.code === 0) {
						$('.fiuck').show();
						earnChart('performance/queryUserPer', 'username', '姓名', 'allprice', '业绩金额/万', ctime, parm);
					} else {
						var bBox = $('.bombBox');
						bBox.hide();
						$('.choiceSeat').show();
						$('.curtain').show();
					}
				}
			});
		}
	})
}
$(document).off('click', '.fiuck').on('click', '.fiuck', function() {
	$('.choiceSeat').show();
	$('.curtain').show();
})
switchEarnType();
choiceSeatBtn();
//选择坐席提交
function choiceSeatBtn() {
	$(document).off('click', '#choiceSeat').on('click', '#choiceSeat', function() {
		var parm = [];
		var ctime = $('.achivClendar').val();
		var e = $('#seatChoice ul li');
		for(var i = 0; i < e.length; i++) {
			parm.push(e.eq(i).attr('uid'));
		}
		parm = JSON.stringify(parm);
		layer.load(2)
		$.ajax({
			type: "post",
			url: "performance/addUserRedis",
			dataType: 'json',
			data: {
				userids: parm
			},
			success: function(d) {
				layer.close(layer.index);
				layer.msg(d.msg);
				if(d.code === 1) {
					$('.curtain').hide();
					$('.choiceSeat').hide();
					earnChart('performance/queryUserPer', 'username', '姓名', 'allprice', '业绩金额/万', ctime, parm);
				}
			}
		});

	})
}
//选择坐席
function choiceSeat() {
	$.ajax({ //团队
		dataType: 'json',
		type: 'post',
		url: 'performance/queryTeamAll',
		success: function(d) {
			var d = d.data;
			var html = ''
			for(var i = 0; i < d.length; i++) {
				html += '<li class="fl" teamId="' + d[i].id + '">' + d[i].tname + '</li>';
			}
			$('#teamList ul').html(html);
		}
	})

	$(document).off('click', '#teamList li').on('click', '#teamList li', function(e) { //业绩报表团队成员
		var t = $(e.target);
		var id = t.attr('teamId');
		$('#teamList li').removeClass('teamCur')
		t.addClass('teamCur');
		$.ajax({
			url: 'team/queryTeamUsers',
			dataType: 'json',
			type: 'post',
			data: {
				tid: id
			},
			success: function(d) {
				var d = d.data;
				var h = '';
				for(var i = 0; i < d.length; i++) {
					h += '<li class="fl"><span class="mycheck checkCont" data-chec="0"></span><span class="seatIdCon" uid=' + d[i].id + '>' + d[i].username + '</span></li>'
				}
				$('#teamMan ul').html(h);
			}
		})
	})
}

//我的团队
//团队管理
//编辑坐席
function editSeatInfor() {
	var cn = [];
	$(document).off('click', '.seatMang .icon-yonghuguanli').on('click', '.seatMang .icon-yonghuguanli', function(e) { //打开编辑
		var t = $(e.target);
		var n = t.parents('tr').find('.name').html();
		var id = t.parents('tr').find('.name').attr('aid');
		var tid = t.parents('tr').find('.teamid').attr('tid');
		var phone = t.parents('tr').find('td[data-field="phone"] div').html();
		$('.eidtSeatInfor .user').html(n);
		$('.eidtSeatInfor .uid').val(id);
		$.ajax({ //团队
			url: 'team/queryTeamAndCaptain',
			type: 'post',
			dataType: 'json',
			success: function(d) {
				var d = d.data;
				var h = '<option value="">请输入</option>';
				for(var i = 0; i < d.length; i++) {
					h += '<option value="' + d[i].id + '">' + d[i].tname + '</option>';
					cn.push(d[i].captainname);
				}
				$('#ccTeam').html(h);
				$('#ccTeam').val(tid);
				$('.Superior').html(d[0].captainname)
				$('.eidtSeatInfor .phone').val(phone);
			}
		})
	});

	$(document).off('change', '#ccTeam').on('change', '	#ccTeam', function(e) { //团队上级
		var t = $(e.target);
		var id = parseInt(t.val());
		$('.Superior').html(cn[id]);
	})

	$(document).off('change', '.inforEdit').on('change', '.inforEdit', function(e) { //是否编辑
		var t = $(e.target);
		if(t.is(":checked") === true) {
			$('.sInfor').attr('disabled', false);
		} else {
			$('.sInfor').attr('disabled', true)
			//			.val('');
		}
	})

	$(document).off('click', '#seatInfEdit').on('click', '#seatInfEdit', function(e) { //座席编辑提交
		var t = $(e.target);
		var key = {};
		var uid = $('.eidtSeatInfor .uid').val();
		var tid = $('#ccTeam').val();
		var phone = $('.eidtSeatInfor .phone').val();
		var pass = $('.eidtSeatInfor .confirmPass').val();
		var npass = $('.eidtSeatInfor .newPassword').val();
		if($('.inforEdit').attr('checked') === true) {
			if(checkMobile(phone)) {
				if(checkPassword(npass)) {
					if(npass === pass) {
						layer.load(2)
						$.ajax({
							url: 'team/updateUserInfor',
							type: 'post',
							dataType: 'json',
							data: {
								uid: uid,
								tid: tid,
								user: JSON.stringify({
									phone: phone,
									password: pass
								})
							},
							success: function(d) {
								layer.close(d.index);
								layer.msg(d.msg);
								if(d.code === 1) {
									t.siblings('.cancel').trigger('click');
									$('#mystu_tab').find('.tab_current').trigger('click');
								}
							}
						})
					} else {
						layer.msg('两次输入的密码不一致');
					}
				} else {
					layer.msg('密码格式错误')
				}
			} else {
				layer.msg('手机号格式错误');
			}
		} else {
			$.ajax({
				url: 'team/updateUserInfor',
				type: 'post',
				dataType: 'json',
				data: {
					uid: uid,
					tid: tid,
					user: JSON.stringify({
						phone: phone,
						password: pass
					})
				},
				success: function(d) {
					if(d.code === 1) {
						layer.msg(d.msg);
						t.siblings('.cancel').trigger('click');
						$('#mystu_tab').find('.tab_current').trigger('click');
					} else {
						layer.msg(d.msg);
					}
				}
			})
		}
	})
}
//创建小组
function setTeam() {
	$(document).off('click', '#setTeamSub').on('click', '#setTeamSub', function(e) { //创建提交
		var t = $(e.target);
		var uids = [];
		var aid = $('.setTeam .aid');
		for(var i = 0; i < aid.length; i++) {
			uids.push(aid.eq(i).attr('aid'));
		}
		var tn = $('.teamName').val();
		if(tn != '') {
			$.ajax({
				url: 'team/createTeam',
				type: 'post',
				dataType: 'json',
				data: {
					team: JSON.stringify({
						tname: tn
					}),
					uids: JSON.stringify(uids)
				},
				success: function(d) {
					localStorage.editTeamById = "[]";
					if(d.code === 1) {
						t.siblings('.cancel').trigger('click');
						$('#mystu_tab').find('.tab_current').trigger('click');
						layer.msg(d.msg);
					} else {
						layer.msg(d.msg);
					}
				}
			})
		} else {
			layer.msg('请输入小组名');
		}

	})

	$(document).off('click', '.setTeam .addMan,.editTeam .addMan').on('click', '.setTeam .addMan,.editTeam .addMan', function() { //未分配小组成员列表
		$('.allotSeat').show();
		$.ajax({
			type: "post",
			url: "team/queryNoTeamUser",
			dataType: 'json',
			success: function(d) {

				var d = d.data;
				var h = '';
				for(var i = 0; i < d.length; i++) {
					h += '<li class="fl"><span class="mycheck checkCont  fl" data-chec="0"></span><label for="" class="fl" aid="' + d[i].id + '">' + d[i].username + '</label></li>';
				}
				$('.allotSeat ul').html(h);
			}
		});
	});

	$(document).off('click', '.sCannel').on('click', '.sCannel', function() { //关闭小组成员列表
		$('.allotSeatSame').hide();
	});

	$(document).off('click', '#wfpList').on('click', '#wfpList', function() { //选择无小组成员
		var date = new Date();
		var year = date.getFullYear(); //获取当前年份
		var mon = date.getMonth() + 1; //获取当前月份
		var da = date.getDate(); //获取当前日
		var h = date.getHours(); //获取小时
		var m = date.getMinutes(); //获取分钟
		mon = checkZeroS(mon);
		da = checkZeroS(da);
		h = checkZeroS(h);
		m = checkZeroS(m);
		var d = year + '-' + mon + '-' + da + '&nbsp;' + h + ':' + m;
		var c = $('.allotSeat .checkCur').siblings('label');
		var h = '';
		var arr = [];
		for(var i = 0; i < c.length; i++) {
			arr.push(c.eq(i).attr('aid'));
			if(localStorage.editTeamById != undefined && localStorage.editTeamById != "[]") {

				if(localStorage.editTeamById.indexOf(c.eq(i).attr('aid')) === -1) {

					h += '<tr class="noReq"><td class="aid"  aid=' + c.eq(i).attr('aid') + '>' + c.eq(i).html() + '</td><td></td><td>' + d + '</td><td class="positionR alignC moreIcon"><img src="images/more.png" alt="" state="1" /><ul class="more"><li class="removeSeat">移除</li></ul></td></tr>';
				}
			} else {

				h += '<tr class="noReq"><td class="aid"  aid=' + c.eq(i).attr('aid') + '>' + c.eq(i).html() + '</td><td></td><td>' + d + '</td><td class="positionR alignC moreIcon"><img src="images/more.png" alt="" state="1" /><ul class="more"><li class="removeSeat">移除</li></ul></td></tr>';
			}
		}
		localStorage.editTeamById = JSON.stringify(arr);

		$('.allotSeat').hide();
		$('.sameTeam:visible table tbody').append(h);
	});

	$(document).off('click', '.cnmCancel').on('click', '.cnmCancel', function() {
		localStorage.editTeamById = '[]';
	});
}

function teamerList(tid) { //团队成员列表
	$.ajax({
		type: "post",
		url: "team/queryTeamUsers",
		dataType: 'json',
		data: {
			tid: tid
		},
		success: function(d) {
			var d = d.data;
			var h = '';
			for(var i = 0; i < d.length; i++) {
				h += '<tr class="req"><td class="aid" aid="' + d[i].id + '">' + d[i].username + '</td><td>' + d[i].rolename + '</td><td>' + d[i].jointime + '</td><td class="positionR alignC moreIcon"><img src="images/more.png" alt="" state="1"><ul class="more"><li class="teamCap">设为组长</li><li class="removeSeat">移除</li></ul></td></tr>';
			}
			$('.editTeam tbody').html(h);
		}
	});
}

function editTeam() { //打开编辑团队
	$(document).off('click', 'td .tname').on('click', 'td .tname', function(e) {
		var t = $(e.target);
		var tid = t.attr('tid');
		var tname = t.html();
		$('.editTeam .tname').val(tname).attr('tid', tid);
		teamerList(tid);
	})

	$(document).off('click', '.moreIcon img').on('click', '.moreIcon img', function(e) { //单行编辑
		var t = $(e.target);
		$('.moreIcon ul').hide();
		$('.editTeam img').hide();
		if(t.attr('state') === '1') {
			t.siblings('ul').show();
			t.show();
			t.attr('state', '0');
		} else {
			t.siblings('ul').hide();
			t.hide();
			t.attr('state', '1');
		}
	})

	$(document).off('click', '.req .teamCap').on('click', '.req .teamCap', function(e) { //设为组长
		var t = $(e.target);
		uid = t.parents('tr').find('.aid').attr('aid');
		tid = t.parents('form').find('.tname').attr('tid');

		$.ajax({
			type: "post",
			url: "team/setCaptain",
			dataType: 'json',
			data: {
				tid: tid,
				uid: uid
			},
			success: function(d) {

				layer.msg(d.msg);
				if(d.code === 1) {
					teamerList(tid);
				}
			}
		});
	})

	$(document).off('click', '.req .removeSeat').on('click', '.req .removeSeat', function(e) { //移除成员
		var t = $(e.target);
		uid = t.parents('tr').find('.aid').attr('aid');
		tid = t.parents('form').find('.tname').attr('tid');
		$.ajax({
			type: "post",
			url: "team/delTeamUser",
			dataType: 'json',
			data: {
				tid: tid,
				uid: uid
			},
			success: function(d) {

				layer.msg(d.msg);
				if(d.code === 1) {
					teamerList(tid);
				}
			}
		});
	});

	$(document).off('click', '.noReq .removeSeat').on('click', '.noReq .removeSeat', function(e) { //移除未提交成员
		var t = $(e.target);
		uid = t.parents('tr').remove();
	});
	$(document).off('click', '#editTeamSub').on('click', '#editTeamSub', function(e) { //编辑团队提交
		var t = $(e.target);
		var id = $('.editTeam .tname').attr('tid');
		var tname = $('.editTeam .tname').val();
		var team = {
			tname: tname,
			id: id
		};
		if(localStorage.editTeamById === undefined) {
			localStorage.editTeamById = JSON.stringify([]);
		}
		$.ajax({
			type: "post",
			url: "team/updateTeam",
			dataType: 'json',
			data: {
				team: JSON.stringify(team),
				uids: localStorage.editTeamById
			},
			success: function(d) {

				layer.msg(d.msg);
				localStorage.editTeamById = JSON.stringify([]);
				t.siblings('.cancel').trigger('click');
				$('#mystu_tab').find('.tab_current').trigger('click');
			}
		});
	});

	$(document).off('click', '#addTeamQuick').on('click', '#addTeamQuick', function(e) { //快速添加团队成员
		var t = $(e.target);
		var c = $('.allotSeatQuick .checkCur').siblings('label');
		var h = '';
		var arr = [];
		for(var i = 0; i < c.length; i++) {
			arr.push(c.eq(i).attr('aid'));
		}
		$.ajax({
			type: "post",
			url: "team/updateTeam",
			dataType: 'json',
			data: {
				team: $('.teamQuickEdit').val(),
				uids: JSON.stringify(arr)
			},
			success: function(d) {

				layer.msg(d.msg);
				localStorage.editTeamById = JSON.stringify([]);
				t.siblings('.cancel').trigger('click');
				$('#mystu_tab').find('.tab_current').trigger('click');
			}
		});
		$('.sameTeam:visible table tbody').append(h);
	})

	$(document).off('click', '.teamAddMan .icon-fenpei').on('click', '.teamAddMan .icon-fenpei', function(e) { //未分配小组成员列表
		var t = $(e.target);
		var tname = t.parents('tr').find('.tname');

		var team = {
			tname: tname.html(),
			id: tname.attr('tid')
		}
		$('.teamQuickEdit').val(JSON.stringify(team))
		$('.allotSeatQuick').show();
		$.ajax({
			type: "post",
			url: "team/queryNoTeamUser",
			dataType: 'json',
			success: function(d) {

				var d = d.data;
				var h = '';
				for(var i = 0; i < d.length; i++) {
					h += '<li class="fl"><span class="mycheck checkCont  fl" data-chec="0"></span><label for="" class="fl" aid="' + d[i].id + '">' + d[i].username + '</label></li>';
				}
				$('.allotSeatQuick ul').html(h);
			}
		});
	});
}

function ccOrderChecked()//cc合同审核
{
$(document).off('click','.ccCheckOrder').on('click','.ccCheckOrder',function(e)//是否通过
{
	var t=$(e.currentTarget);
	$('#myStudent').append('<div class="positionA refundTypeC formHide ccCheckOrderBox bombBox" style="display:block"><h2>请确认<i class="iconfont fr icon-guanbi1"></i></h2><p>学员"'+t.attr("sname")+'"的合同信息,是否通过？</p><div class="clearfix positionA" style="bottom:20px;width:340px"><div class="fr clearfix"><button type="button" cid="'+t.attr("oid")+'" class="fl cancelO OptBtn">否</button><button type="button" class="fl saveO OptBtn" cid="'+t.attr("oid")+'" OptBtn">是</button></div></div></div>')
})	
	
$(document).off('click','.ccCheckOrderBox .saveO').on('click','.ccCheckOrderBox .saveO',function(e)//通过合同
{
	var t=$(e.currentTarget);
	layer.load(2);	
	$.ajax({
        url:'contract/updateConfirmcont',
        type:'post',
        dataType:'json',
        data:{
        	id:t.attr('cid')
        },
        success:function(d){
         	layer.close(layer.index);
            layer.msg(d.msg);      
            if(d.code===1){
            	$('.ccCheckOrderBox').hide();
				$('.curtain').hide();
            	$('#mystu_tab .tab_current').trigger('click');
            }
        }
    })
})

$(document).off('click','.ccCheckOrderBox .cancelO').on('click','.ccCheckOrderBox .cancelO',function(e){//驳回合同-填写备注
	var t=$(e.currentTarget);
	layer.load(2);	
	 $.ajax({
        url:'/moneyManage/contract/checkContractList',
        data:{
        	cid:t.attr('cid')
        },
        success:function(d){
        	layer.close(layer.index);
        	var da=d.data;
        	var ror=$('.ccRejectOrderRemark');
        	var co=$('.ccCheckOrderBox');
        	var cur=$('.curtain');
        	var str='';
        	if(d.code===1){   		
        		for(var i=0;i<da.length;i++){
        			str+='<tr><td>'+layui.util.toDateString(da[i].checktime, 'yyyy-MM-dd')+'</td><td>'+da[i].content+'</td><td>'+da[i].username+'</td></tr>'
        		}       		
        		ror.show();
        		ror.attr('cid',t.attr('cid'))
        		ror.find('table tbody').html(str);
        		co.hide();
        		cur.show();
        	}
        }
   })
})

$(document).off('click','.ccRejectOrderRemark .saveO').on('click','.ccRejectOrderRemark .saveO',function(){//驳回合同-提交
	layer.load(2);	
	var ta=$('.ccRejectOrderRemark textarea'),
	    ror=$('.ccRejectOrderRemark'),
        cur=$('.curtain');
	 $.ajax({
        url:'/moneyManage/contract/refuseContract',
        data:{
        	cid:ror.attr('cid'),
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
