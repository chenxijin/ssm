//日历初始化
function dateRange() { //时间段
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem: '#rangeClendar',
			range: '至',
			trigger: 'click',
			showBottom: false,
			change: function(value, date) {
				$('#rangeClendar').val(value);
			}
		});
	})
}
function dateRanges(id) { //时间段
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem:id,
			range: '至',
			trigger: 'click',
			showBottom: false,
			change: function(value, date) {
				$(id).val(value);
			}
		});
	})
}
function dateCL() { //日期
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem: '#achivClendarOr',
			type: 'date',
			trigger: 'click',
			value: new Date(),
			showBottom: false,
			change: function(value, date) {
				$('#achivClendarOr').val(value);
			}
		});
	})
}

function dateCLsr(id) { //日期
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem: id,
			type: 'date',
			trigger: 'click',
			value: new Date(),
			showBottom: false,
			change: function(value, date) {
				$(id).val(value);
			}
		});
	})
}
function dateNoIni(id) { //日期
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem: id,
			type: 'date',
			trigger: 'click',
			showBottom: false,
			change: function(value, date) {
				$(id).val(value);
			}
		});
	})
}
function dateCLsrs(id) { //日期
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem: id,
			type: 'date',
			trigger: 'click',
			value: new Date(),
			showBottom: false,
			done: function(value, date) {
				var d=new Date(value);
				$(id).val(value);				
				$(id).parents('form').find('input[name="paydate"]').val(d.getTime());
			}
		});
	})
}

function dateCLs() { //日期
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem: '#achivClendarOrs',
			type: 'date',
			trigger: 'click',
			value: new Date(),
			showBottom: false,
			change: function(value, date) {
				$('#achivClendarOrs').val(value);
			}
		});
	})
}

function dateCLp() { //日期
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem: '#achivClendarOrp',
			type: 'date',
			trigger: 'click',
			showBottom: false,
			change: function(value, date) {
				$('#achivClendarOrp').val(value);
			}
		});
	})
}
function dateCLps(id) { //日期
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem: id,
			type: 'date',
			trigger: 'click',
			showBottom: false,
			change: function(value, date) {
				$(id).val(value);
			}
		});
	})
}
function dateMin() { //时分
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem: '#orderClendar',
			format: 'yyyy-MM-dd HH:mm',
			type: 'datetime',
			value: new Date(),
			trigger: 'click',
			showBottom: true,
			change: function(value, date) {
				$('#orderClendar').val(value);
			}
		});
	})
}

function dateMins(id) { //时分
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem: id,
			format: 'yyyy-MM-dd HH:mm',
			type: 'datetime',
			value: new Date(),
			trigger: 'click',
			showBottom: true,
			change: function(value, date) {
				$(id).val(value);
			}
		});
	})
}
function dateMinDiy(val) { //时分diy初始
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem: '#orderClendarDiy',
			format: 'yyyy-MM-dd HH:mm',
			type: 'datetime',
			value: val,
			trigger: 'click',
			showBottom: true,
			change: function(value, date) {
				$('#orderClendarDiy').val(value);
			}
		});
	})
}

function dateMonth() {
	layui.use('laydate', function() { //月
		var laydate = layui.laydate;
		laydate.render({
			elem: '#achivClendar',
			type: 'month',
			trigger: 'click',
			value: new Date(),
			showBottom: false,
			change: function(value, date) {
				$('#achivClendar').val(value);
			}
		});
	})
}
function dateMonths(id) {
	layui.use('laydate', function() { //月
		var laydate = layui.laydate;
		laydate.render({
			elem: id,
			type: 'month',
			trigger: 'click',
			value: new Date(),
			showBottom: false,
			change: function(value, date) {
				$(id).val(value);
			}
		});
	})
}
function dateYear() {
	layui.use('laydate', function(e, type) { //年
		var laydate = layui.laydate;
		laydate.render({
			elem: '#achivClendarY',
			type: 'year',
			trigger: 'click',
			value: new Date(),
			showBottom: false,
			change: function(value, date) {
				$('#achivClendarY').val(value);
			}
		});
	})
}
function dateYears(id) {
	layui.use('laydate', function(e, type) { //年
		var laydate = layui.laydate;
		laydate.render({
			elem: id,
			type: 'year',
			trigger: 'click',
			value: new Date(),
			showBottom: false,
			change: function(value, date) {
				$(id).val(value);
			}
		});
	})
}
function dateYearDiy() { //年范围
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem: '#rangeClendarY',
			range: '至',
			trigger: 'click',
			type: 'year',
			done: function(value, date, endDate) {
				$('#rangeClendarY').val(value);
				var s = parseInt(date.year);
				var e = parseInt(endDate.year);
				var c = e - s;
				var arr = [s];
				for(var i = 0; i < c; i++) {
					arr.push(s++);
				}
				$('.rangeYear').val(JSON.stringify(arr));
			}
		});
	})
}

function dateMonthRange() { //月范围
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem: '#rangeClendar',
			range: '至',
			trigger: 'click',
			type: 'month',
			done: function(value, date, endDate) {
				$('#rangeClendar').val(value);
			}
		});
	})
}

function dateYearDiyT() { //年
	layui.use('laydate', function(e, type) { //年
		var laydate = layui.laydate;
		laydate.render({
			elem: '#achivClendarY',
			type: 'year',
			trigger: 'click',
			value: new Date(),
			showBottom: false,
			change: function(value, date) {
				console.log(value);
				$('#achivClendarY').val(value);
				var arr = [value];
				$('.rangeYear').val(JSON.stringify(arr));
			}
		})
	})
}

function dateCLclass(id) {
	layui.use('laydate', function() {
		var laydate = layui.laydate;
		laydate.render({
			elem: id,
			type: 'date',
			trigger: 'click',
			showBottom: false,
			done: function(value, date) {
				$(id).val(value);
				$('.classTimeRange').fadeIn();
			}
		});
	})
	$(document).on('click', '.classTimeRange li', function(e) {
		var t = $(e.target);
		var v = $(id).val();
		$('.classRanget').html(t.html())
		$('.classTimeRange').hide();
	})

}