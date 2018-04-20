//上课时间段
var timeRangeArr = ['08:00-09:00', '09:00-10:00', '10:10-11:10', '11:10-12:10', '12:50-13:50', '13:50-14:50', '15:00-16:00', '16:00-17:00', '17:30-18:30', '18:30-19:30', '19:40-20:40', '20:40-21:40'],
	timeStartArr = ['09:00', '10:00', '11:10', '12:10', '13:50', '14:50', '16:00', '17:00', '18:30', '19:30', '21:40', '21:40'];
window.onresize = function()
{//窗口尺寸变化
 tableWidth();
 $('.leaving').outerWidth($('.wt-main table').width() / 7 - 40);
}
schedulingQuick();//排班表排班
typeScheduling();//排班方式切换日历
timetableDetails();//排课详情
function weekCanlendar()//周历加载
{ 
 $('#calendar').weekCalendar();
 $('#calendarLesson').weekCalendar();
};
function tableWidth()//排班排课表格宽度
{
 setTimeout(function()
 {
  var w = $('.weekTable:visible').outerWidth() - $('.wt-left:eq(0)').outerWidth() - $('.wt-right:eq(0) ul').outerWidth();
  $('.wt-right table').width(w);
  $('.wc-header').width(w);
  $('.wt-main').addClass('opacityShow');
 }, 1)
}
function schedulingQuick()//排班表排班
{
 sessionStorage.countW = 0;
 $(document).off('click', '.teacherArrangeW .wt-main td').on('click', '.teacherArrangeW .wt-main td', function(e)
 {
  var t = $(e.currentTarget),
   tp=$('.schedulingState').parents('table'),
   tr = t.parents('table').find('tr'),
   trl = t.parents('table').find('tr:last-child'),
   coq = $('.CarryOutShiftQuick'),//排课弹出框
   col = t.index(), //索引
   str = '',
   w = $('.weeks:visible'),
   uids = [t.parents('.wt-main').find('.wt-left dt').attr('tid')];
if(coq.is(':hidden'))//显示弹框
{
   coq.show();
}
else
{
   if(tp.find(t).length === 0)//只能选择当前班表
   {
    return false;
   }
}
  coq.find('h2').attr('uid', JSON.stringify(uids));
  if(t.attr('tid') != undefined)//检索单个
  {
   coq.find('h2').attr('tid', t.attr('tid'));
  }
  else//全部
  {
   coq.find('h2').attr('tid', '');
  }
  t.parents('tr').children().each(function(i, e)
  {
   if($(this).is(t) && !t.hasClass('schedulingState'))
   {
    tr.find('td:eq(' + i + ')').addClass('schedulingState');
    trl.find('td:eq(' + i + ')').addClass('schedulingStatel');
    str = '<li class="fl positionR"><span>' + w.eq(i).attr('d') + '</span>&nbsp;' + w.eq(i).html() + '<i class="iconfont icon-guanbi1" cw="' + sessionStorage.countW + '"></i></li>';
    t.parents('table').find('tr').find('td:eq(' + col + ')').attr('cw', sessionStorage.countW);
    sessionStorage.countW = parseInt(sessionStorage.countW) + 1;
    coq.find('.workTime').append(str);
   }
  })
 })
}
function scheduling(table)//教师列表-排班信息（单）
{
 table.on('tool(test)', function(obj)
 {
  var d = obj.data,
  	  mt = $('#mystu_table'),
   	  ta = $('.teacherArrangeW'),
	  str = '';
  if(obj.event === 'scheduling')
  {
   mt.next('.layui-form').hide();
   ta.show();
   $('.schedulingInfBack').show().addClass('schedulingInfBackW');
   $('#mystu_tab li').hide();
   $('#search_btn').attr('disabled', true);
   scheduleShowWork($(obj.tr).find('.schedulingBtn').attr('tid'))
  }
 });
 $(document).off('click', 'schedulingInfBackW').on('click', '.schedulingInfBackW', function()//关闭排班信息
 { 
  $('#mystu_tab li').show();
  $('.bombBox').hide();
  $('#mystu_table').next('.layui-form').show();
  $('.teacherArrangeW,.schedulingInfBack').hide();
  $('#search_btn').attr('disabled', false);
  $('.schedulingInfBack').removeClass('schedulingInfBackW');
 })
}
function schedulingGroup(table) //直接排班
{
 var documents=$(document);
 documents.off('click', '#checkedEvent .groupScheduling').on('click', '#checkedEvent .groupScheduling', function()
 {
  var str = '';
  var d = table.checkStatus('tableStu_1').data;
  for(var i = 0; i < d.length; i++)
  {
   str += '<li class="fl positionR" mid="' + d[i].id + '">' + d[i].username + '<i class="iconfont icon-guanbi1"></i></li>'
  }
  $('.CarryOutShift .teacherSche').html(str);
 })
 documents.off('click', '.CarryOutShift .save').on('click', '.CarryOutShift .save', function(e)//排班(可多人)-提交
 { 
  var t = $(e.currentTarget),
   uids = [],
   tea = t.parents('.CarryOutShift').find('.teacherSche li'),
   w = t.parents('.CarryOutShift').find('.banc').val(),
   tc = $('.typeSchedul').val(),
   ts = $('.teacherSche li'),
   wt = t.parents('.CarryOutShift').find('.workTime li');
  for(var i = 0; i < tea.length; i++)
  {
   uids.push(tea.eq(i).attr('mid'));
  }
  if(tc === '0')
  {
   var sdate = [];
   for(var i = 0; i < wt.length; i++)
   {
    sdate.push(wt.eq(i).attr('sdate'));
   }
   sdate = JSON.stringify(sdate);
  }
  else
  {
   var sdate = wt.attr('tdate');
  }
  if(wt.length != 0)
  {
   if(ts.length != 0)
   {
    layer.load(2);
    $.ajax(
    {
     type: "post",
     url: "teacherClass/insertScheduling",
     dataType: 'json',
     data:
     {
      uids: JSON.stringify(uids), //老师（数组）
      branch: '0', //判断按天或按时间段
      sdate: sdate, //时间数组
      shift: w //班次
     },
     success: function(d)
     {
      layer.close(layer.index);
      layer.msg(d.msg);
      if(d.code === 1)
      {
       t.parents('.CarryOutShift').hide();
       $('.curtain').hide();
       tea.remove();
       wt.remove();
      }
     }
    });
   }
   else
   {
    layer.msg('请选择教师');
   }
  }
  else
  {
   layer.msg('请选择时间');
  }
 })
 documents.off('click', '.CarryOutShift .cancel').on('click', '.CarryOutShift .cancel', function(e)//排班(可多人)-取消
 { 
  var t = $(e.currentTarget),
   ts=t.parents('.CarryOutShift'),
   tea = ts.find('.teacherSche li'),
   w = ts.find('.banc').val(),
   wt = ts.find('.workTime li');
  ts.hide();
  $('.curtain').hide();
  tea.remove();
  wt.remove();
 })
}
function typeScheduling()//排班方式切换日历
{
 $(document).on('change', '.typeSchedul', function(e)
 {
  var t = $(e.target),
  	  rangeC=$('#rangeClendarOrS'),
  	  dateC=$('#achivClendarOrS'),
  	  worktime=$('.CarryOutShift .workTime');
  if(t.val() === '0')
  {
   rangeC.hide();
   dateC.show();
   worktime.empty();
  }
  else if(t.val() === '1')
  {
   rangeC.show();
   dateC.hide();
   worktime.empty();
  }
 })
}

function lockupSchedul()//教师列表-排课信息（单）
{
 var documents=$(document);
 documents.off('click', '.operation .schedulingWbtn').on('click', '.operation .schedulingWbtn', function(e)//打开排课信息
 { 
  var t = $(e.currentTarget);
  $('#mystu_table').next('.layui-form').hide();
  $('.teacherArrangeC,.schedulingInfBack').show();
  $('#search_btn').attr('disabled', true);
  $('.schedulingInfBack').addClass('schedulingInfBackC');
  tableWidth();
  $('#mystu_tab li').hide();
  scheduleShow(t.attr('tid'))
 });
 documents.off('click', '.schedulingInfBackC').on('click', '.schedulingInfBackC', function()//关闭排课信息
 { 
  $('#mystu_tab li').show();
  $('.bombBox').hide();
  $('#mystu_table').next('.layui-form').show();
  $('#search_btn').attr('disabled', false);
  $('.teacherArrangeC,.schedulingInfBack').hide();
  $('.schedulingInfBack').removeClass('schedulingInfBackC');
 })
}
function lockupSchedulStudent()//学生管理-排课信息（单）
{
 var documents=$(document);
 documents.off('click', '.operation .schedulingWbtnS').on('click', '.operation .schedulingWbtnS', function(e)//打开排课信息
 { 
  var t = $(e.currentTarget);
  $('#mystu_table').next('.layui-form').hide();
  $('.studentArrangeC,.schedulingInfBack').show();
  $('#search_btnAl').attr('disabled', true);
  $('.schedulingInfBack').addClass('schedulingInfBackC');
  tableWidth();
  $('#mystu_tab li').hide();
  scheduleShowStudent(t.attr('tid'), '0');
 });
 documents.off('click', '.schedulingInfBackC').on('click', '.schedulingInfBackC', function()//关闭排课信息
 { 
  $('#mystu_tab li').show();
  $('.bombBox').hide();
  $('#mystu_table').next('.layui-form').show();
  $('#search_btn').attr('disabled', false);
  $('.studentArrangeC,.schedulingInfBack').hide();
  $('.schedulingInfBack').removeClass('schedulingInfBackC');
 })
}
function schedulingBox()//排课弹出框
{
 sessionStorage.count = 0;
 var boomBoxClk='.teacherArrangeC .wt-right td,.studentArrangeC .wt-right td';
 $(document).off('click', boomBoxClk).on('click', boomBoxClk, function(e)//打开排课弹框
 { 
  var t = $(e.currentTarget);
      tr = t.parents('tr'),
      trow = tr.index(),//行索引
      tcol = t.index(), //列索引
      r = '',
      d = '',
      str = '',
      f = $('.takeCourse'),
      tp = t.parents('.teacherArrangeC'),
      box = $('.scheduleBoxStu').length != 0 ? $('.scheduleBoxStu') : $('.scheduleBox'),
      topLen = t.position().top + $('#main').scrollTop(),
      scb = $('.scheduleBox');
   $('.scheduleDetail  .icon-guanbi1').trigger('click');  
  scb.find('.tid').val(t.parents('.wt-main').find('.wt-left dt').attr('tid'));
  if(!t.is('.hasClass'))
  {
// if(timeJudge(t))
// {
    r = $('.wt-right li').eq(trow).html();
    d = $('.weeks:visible').eq(tcol).attr('d');
    str = '<li class="fl positionR" c="' + sessionStorage.count + '"><span>' + d + ' ' + r + '</span><i class="iconfont icon-guanbi1"></i></li>';
    if(f.length < 1)
    { //无选中
     //	<option value="01">线上班课</option><option value="10">线下一对一</option><option value="11">线下班课</option>
     $('.scheduleBox form').html('<div class="clearfix"><label for=""class="fl"><i class="xh">*</i>已选时间</label><ul class="clearfix customTag teacherSche fl"></ul></div><div class="clearfix teacherSide"><label for=""class="fl"><i class="xh">*</i>排课/加课</label><div class="fl scheduleType"><span><input type="checkbox"value="1"checked="checked"/>正常排课</span><span><input type="checkbox"value="3"/>请假</span><span><input type="checkbox"value="4"/>其他</span></div></div><div class="clearfix normalSchedule teacherSide"><label for=""class="fl"><i class="xh">*</i>选择班型</label><select class="select typeSchedulC fl"name=""><option value="">请选择</option><option value="00">线上一对一</option></select></div><div class="clearfix normalSchedule"><label for=""class="fl"><i class="xh">*</i>频率</label><input type="text"id="local"class="stu_ser_box stu_ser_2 fl"placeholder="请输入内容"/></div><div class="clearfix note"style="display:none;"><label for=""class="fl"><i class="xh">*</i>备注</label><textarea name="remark"class="fl"></textarea></div>');
     $('#main').scrollTop(topLen - 300);
     $('.scheduleBox,.scheduleBoxStu').show();
     t.addClass('takeCourse');
     $('.teacherSche').append(str);
     t.attr('c', sessionStorage.count);
     if(tcol < 3)
     { //弹出框位置小于周三
      box.css(
      {
       "left": t.offset().left + t.innerWidth(),
       "top": t.offset().top - (box.height() / 2),
       'margin': 0
      })
     }
     else
     { //弹出框位置大于周三
      box.css(
      {
       "left": t.offset().left - box.innerWidth(),
       "top": t.offset().top - (box.height() / 2),
       'margin': 0
      })
     }
     if(t.parents('.studentArrangeC').length != 0)
     { //判断学生排课或老师排课
      $('.teacherSide').hide();
      var od = JSON.parse($('.studentArrangeC .wt-main .wt-left').attr('order'));
      var str = '<div class="clearfix chooseOrder"><label for="" class="fl required"><i class="xh">*</i>选择合同</label><table class="fl"><tr style="font-size:12px"><td width="100"></td><td width="60">总课时</td><td width="60">剩余课时</td></tr>';
      var strr = '';
      var ord = '</table></div>';
      for(var i = 0; i < od.length; i++)
      {
       if(od[i].contype === '0')
       {
        thecontype='常规合同';
       }
       else if(od[i].contype === '1')
       {
       	thecontype='暑假合同';
//      strr += '<tr><td><input type="radio" name="order" value="' + od[i].id + '" ct="' + od[i].contype + '">暑假合同</td><td>' + od[i].couersum + '</td><td>' + od[i].currentsum + '</td></tr>';
       }
       else if(od[i].contype === '2')
       {
       	thecontype='寒假合同';
       }
       strr+='<tr><td><input type="radio" name="order" value="' + od[i].id + '" ct="' + od[i].contype + '">'+thecontype+'</td><td>' + od[i].couersum + '</td><td>' + od[i].currentsum + '</td></tr>';
      }
      $('#local').parents('.normalSchedule').before(str + strr + ord);
      $('.chooseOrder:visible input[type=radio]:eq(0)').attr('checked', true);
      scb.addClass('scheduleBoxStu').removeClass('scheduleBox');
      $('.scheduleBoxStu h2').attr({
      	'uname': t.parents('.wt-main').find('.wt-left dt').html(),
      	'sid':t.parents('.wt-main').find('.wt-left dt').attr('tid')
      });
//    $('.scheduleBoxStu h2').attr();
     }
     else
     {
      $('.teacherSide').show();
      $('.choiceOrder').remove();
     }
    }
    else if(f.length === 1)//选中一个
    { 
     var frow = f.parent('tr').index(),//行索引
         fcol = f.index(); //列索引
     if(t.is(f.parents('table').find('tr').eq(frow + 1).find('td').eq(fcol)) || t.is(f.parents('table').find('tr').eq(frow - 1).find('td').eq(fcol)))
     {
      t.addClass('takeCourse');
      $('.teacherSche').append(str);
      t.attr('c', sessionStorage.count);
     }
    }
    else//选中多个
    { 
     var frow = f.first().parent('tr').index(); //第一个行索引
         fcol = f.first().index(), //列索引
         flrow = f.last().parent('tr').index(); //最后一个行索引
     if(t.is(f.parents('table').find('tr').eq(flrow + 1).find('td').eq(fcol)) || t.is(f.parents('table').find('tr').eq(frow - 1).find('td').eq(fcol)))
     {
      t.addClass('takeCourse');
      $('.teacherSche').append(str);
      t.attr('c', sessionStorage.count);
     }
    }
    sessionStorage.count = parseInt(sessionStorage.count) + 1;
// }
// else
// {
//  layer.msg('时间已过')
// }
  }
  $('.scheduleBox .note').show();
 });
 $(document).off('click', '.scheduleBox .cancel').on('click', '.scheduleBox .cancel', function(e)//排课弹框-关闭
 { 
  sessionStorage.count = 0;
  $('.takeCourse').attr('c', '');
  $('.takeCourse').removeClass('takeCourse');
  //		<option value="01">线上班课</option><option value="10">线下一对一</option><option value="11">线下班课</option>
  $('.scheduleBox form,.scheduleBoxStu form').empty().html('<div class="clearfix"><label for=""class="fl"><i class="xh">*</i>已选时间</label><ul class="clearfix customTag teacherSche fl"></ul></div><div class="clearfix teacherSide"><label for=""class="fl"><i class="xh">*</i>排课/加课</label><div class="fl scheduleType"><span><input type="checkbox"value="1"checked="checked"/>正常排课</span><span><input type="checkbox"value="3"/>请假</span><span><input type="checkbox"value="4"/>其他</span></div></div><div class="clearfix normalSchedule teacherSide"><label for=""class="fl"><i class="xh">*</i>选择班型</label><select class="select typeSchedulC fl"name=""><option value="">请选择</option><option value="00">线上一对一</option></select></div><div class="clearfix normalSchedule"><label for=""class="fl"><i class="xh">*</i>频率</label><input type="text"id="local"class="stu_ser_box stu_ser_2 fl"placeholder="请输入内容"/></div><div class="clearfix note"style="display:none;"><label for=""class="fl"><i class="xh">*</i>备注</label><textarea name="remark"class="fl"></textarea></div>');
  //		$('#mystu_tab .tab_current').trigger('click');
 });
 $(document).off('click', '.scheduleBoxStu .cancel').on('click', '.scheduleBoxStu .cancel', function(e)//排课弹框（学生）-关闭
 { 
  sessionStorage.count = 0;
  $('.takeCourse').attr('c', '');
  $('.takeCourse').removeClass('takeCourse');
  //		<option value="01">线上班课</option><option value="10">线下一对一</option><option value="11">线下班课</option>
  $('.scheduleBoxStu form').empty().html('<div class="clearfix"><label for=""class="fl"><i class="xh">*</i>已选时间</label><ul class="clearfix customTag teacherSche fl"></ul></div><div class="clearfix teacherSide"><label for=""class="fl"><i class="xh">*</i>排课/加课</label><div class="fl scheduleType"><span><input type="checkbox"value="1"checked="checked"/>正常排课</span><span><input type="checkbox"value="3"/>请假</span><span><input type="checkbox"value="4"/>其他</span></div></div><div class="clearfix normalSchedule teacherSide"><label for=""class="fl"><i class="xh">*</i>选择班型</label><select class="select typeSchedulC fl"name=""><option value="">请选择</option><option value="00">线上一对一</option></select></div><div class="clearfix normalSchedule"><label for=""class="fl"><i class="xh">*</i>频率</label><input type="text"id="local"class="stu_ser_box stu_ser_2 fl"placeholder="请输入内容"/></div><div class="clearfix note"style="display:none;"><label for=""class="fl"><i class="xh">*</i>备注</label><textarea name="remark"class="fl"></textarea></div>');
  //		$('#mystu_tab .tab_current').trigger('click');
 });
 $(document).off('click', '.teacherSche li .icon-guanbi1').on('click', '.teacherSche li .icon-guanbi1', function(e)//排课弹框-删除已选时间
 { 
  var t = $(e.target);
  var p = $('.teacherSche li');
  var c = $('.takeCourse');
  var ind = t.parents('li').attr('c');
  for(var i = 0; i < c.length; i++)
  {
   if(c.eq(i).attr('c') === ind)
   {
    c.eq(i).attr('c', '');
    c.eq(i).removeClass('takeCourse');
   }
  }
  t.parents('li').remove();
  layer.close(layer.index)
 });
 $(document).off('click', '.scheduleBox .save').on('click', '.scheduleBox .save', function(e)//排课弹框-保存
 { 
  var v = $('.takeCourse');
  var check = $('.scheduleType');
  var t = $(e.target);
  var tp = t.parents('.scheduleBox');
  var tea = $('.teacherListC');
  var cur = $('.curtain');
  var sdate = $('.scheduleBox li span');
  var sdateArr = [];
  for(var i = 0; i < sdate.length; i++)
  {
   sdateArr.push(sdate.eq(i).html());
  }
  //		c.eq(i).attr('c','');
  //		sessionStorage.count=0;
  //		v.eq(0).attr('rowspan',v.length);
  if($('.teacherSche li').length != 0)
  {
   if(!tp.hasClass('scheduleBoxStu'))
   {
    if(check.find('input:first').is(':checked'))
    {
     if(isPositiveInteger($('.normalSchedule input')) && parseInt($('.normalSchedule input').val()) <= 100)
     {
      v.eq(0).html();
      var t = $('.typeSchedulC');
      var s = $('.scheduleBox');
      var c = $('.studentListC');
      var cur = $('.curtain');
      var cl = $('.classListC');
      var ct = $('.scheduleType input:checked').val();
      var cont = $('.typeSchedulC:visible').val().split('')[1];
      var otwo = $('.typeSchedulC:visible').val().split('')[0];
      var sdate = JSON.stringify(sdateArr);
      var fr = $('.normalSchedule input').val();
      var tid = $('.scheduleBox .tid').val();
      if(t.val() === '00' || t.val() === '10')
      {
       s.hide();
       c.show();
       cur.show();
       c.find('h2').attr(
       {
        'cont': cont,
        'ct': ct,
        'fr': fr,
        'otwo': otwo,
        'tid': tid,
        'sdate': sdate,
        'remarks':$('.scheduleBox textarea').val()
       });
       schedulingStudentList(sdate, fr, otwo)
       $('.checkSame:visible .layui-form-checkbox:first').trigger('click');
      }
      else if(t.val() === '01' || t.val() === '11')
      {
       s.hide();
       cl.show();
       cur.show();
       cl.find('h2').attr(
       {
        'cont': cont,
        'ct': ct,
        'fr': fr,
        'otwo': otwo,
        'tid': tid,
        'sdate': sdate
       });
       $('.createClass').find('h2').attr(
       {
        'cont': cont,
        'ct': ct,
        'fr': fr,
        'otwo': otwo,
        'tid': tid,
        'sdate': sdate
       });
       $('.studentListC').find('h2').attr(
       {
        'cont': cont,
        'ct': ct,
        'fr': fr,
        'otwo': otwo,
        'tid': tid,
        'sdate': sdate
       });
       schedulingClassList(sdate, fr, tid, otwo);
       $('.checkSame:visible .layui-form-checkbox:first').trigger('click');
      }
      else
      {	
       layer.msg('请选择班型');
      }
     }
     else
     {
      layer.msg('请填写正确的频率(最大频率100)');
     }
    }
    else
    {
     $.ajax(
     {
      type: 'post',
      dataType: 'json',
      url: 'teacherClass/insertTeacherClass',
      data:
      {
       ct: $('.scheduleType:visible input:checked').val(),
       sdate: JSON.stringify(sdateArr),
       remarks: $('.scheduleBox textarea').val(),
       tid: $('.scheduleBox .tid').val(),
      },
      success: function(d)
      {
       var da = d.data;
       layer.close(layer.index);
       layer.msg(d.msg);
       if(d.code === 1)
       {
        $('.takeCourse').attr('c', '');
        sessionStorage.count = 0;
        //							<option value="01">线上班课</option><option value="10">线下一对一</option><option value="11">线下班课</option>
        $('.scheduleBox form').empty().html('<div class="clearfix"><label for=""class="fl"><i class="xh">*</i>已选时间</label><ul class="clearfix customTag teacherSche fl"></ul></div><div class="clearfix teacherSide"><label for=""class="fl"><i class="xh">*</i>排课/加课</label><div class="fl scheduleType"><span><input type="checkbox"value="1"checked="checked"/>正常排课</span><span><input type="checkbox"value="3"/>请假</span><span><input type="checkbox"value="4"/>其他</span></div></div><div class="clearfix normalSchedule teacherSide"><label for=""class="fl"><i class="xh">*</i>选择班型</label><select class="select typeSchedulC fl"name=""><option value="">请选择</option><option value="00">线上一对一</option></select></div><div class="clearfix normalSchedule"><label for=""class="fl"><i class="xh">*</i>频率</label><input type="text"id="local"class="stu_ser_box stu_ser_2 fl"placeholder="请输入内容"/></div><div class="clearfix note"style="display:none;"><label for=""class="fl"><i class="xh">*</i>备注</label><textarea name="remark"class="fl"></textarea></div>')
        $('.scheduleBox').hide();
        $('#classTablePage .layui-laypage-btn').trigger('click');
        $('.goback').trigger('click');
       }
      }
     });
     //				str='<div class="leaving" style="height:'+(v.length*35-10)+'px;line-height:25px;" title="'+$(".scheduleBox .note textarea").val()+'">'+$(".scheduleBox .note textarea").val()+'</div>';
     //				v.eq(0).addClass('obc hasClass');
     //				v.eq(0).html(str);
    }
   }
   else
   {
    tea.show();
    cur.show();
    $('.scheduleBoxStu').hide();
   }
  }
  else
  {
   layer.msg('请选择时间');
  }
  //		v.removeClass('takeCourse');
  //		v.not(':first').remove();
 });
 $(document).off('click', '.scheduleType input').on('click', '.scheduleType input', function(e)//选择排课类型
 { 
  var t = $(e.target);
  var c = $('.scheduleType input');
  t.attr("checked", true);
  if(t.is(':checked'))
  {
   c.not(t).attr("checked", false)
  }
  if(t.is(c.eq(0)))
  {
   $('.scheduleBox .normalSchedule').show();
	$('.scheduleBox .note').show();
  }
  else
  {
   $('.scheduleBox .normalSchedule').hide();
   $('.scheduleBox .note').show();
  }
 });
}
function studentChecked(table)//排课-学生-班级列表
{ 
 $(document).off('click', '.checkSame:visible .layui-form-checkbox').on('click', '.checkSame:visible .layui-form-checkbox', function(e)
 {
  var t = $(e.currentTarget);
  var c = $('.checkSame:visible .layui-form-checkbox');
  c.removeClass('layui-form-checked');
  c.siblings('input').attr('checked', false);
  setTimeout(function()
  {   
  t.addClass('layui-form-checked');
  c.siblings('input').attr('checked', true);
  }, 10)
 })
 table.on('checkbox(student)', function(d)//监听表格复选框选择-学生
 {   
  var str = '';
  var strr = '';
  var d = d.data;
  var c = $('.studentListC');
  if(c.find('h2').attr('cont') === '0')
  {
   str = '<div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>当前学生</label><span class="fl stuname" n="' + d.id + '" >' + d.stuname + '</span></div><div class="clearfix chooseOrder"><label for="" class="fl required"><i class="xh">*</i>选择合同</label><table class="fl"><tr style="font-size:12px"><td width="100"></td><td width="60">总课时</td><td width="60">剩余课时</td></tr>';
   var ord = '</table></div>';
   for(var i = 0; i < d.list.length; i++)
   {
    strr += '<tr><td><input type="radio" name="order" value="' + d.list[i].id + '"  ct="' + d.list[i].contype + '">' + d.list[i].contype + '</td><td>' + d.list[i].couersum + '</td><td>' + d.list[i].currentsum + '</td></tr>'
   }
   $('.studentInforLeft').html(str + strr + ord);
   $('.studentInforLeft input:eq(0)').trigger('click');
  }
  else if(c.find('h2').attr('cont') === '1')
  {
   str = '<div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>当前学生</label><span class="fl stuname" n="' + d.id + '" >' + d.stuname + '</span></div><div class="clearfix chooseOrder"><label for="" class="fl required"><i class="xh">*</i>选择合同</label><table class="fl"><tr style="font-size:12px"><td width="100"></td><td width="60">总课时</td><td width="60">剩余课时</td></tr>';
   var ord = '</table></div>';
   var strrr = '';
   for(var i = 0; i < d.list.length; i++)
   {
    strrr += '<tr><td><input type="radio" class="orderFuc" name="order" value="' + d.list[i].id + '" ct="' + d.list[i].contype + '">' + d.list[i].contype + '</td><td>' + d.list[i].couersum + '</td><td>' + d.list[i].currentsum + '</td></tr>'
   }
   $('.studentInforLeft').html(str + strrr + ord);
   $('.studentInforRight').show();
   $('.studentInforLeft input:eq(0)').trigger('click');
  }
 });
 table.on('checkbox(class)', function(d)//监听表格复选框选择 -班级
 { 
  var str = '';
  var strr = '';
  var d = d.data;
  var c = $('.classListC');
  if(d.stulevel === "0")
  {
   d.stulevel = '优秀';
  }
  else if(d.stulevel === "1")
  {
   d.stulevel = '良好';
  }
  else if(d.stulevel === "2")
  {
   d.stulevel = '一般';
  }
  str = '<div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>当前班级</label><span class="fl nowClass" oid="' + d.id + '" >' + d.classesname + '</span></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>学员水平</label><span class="fl">' + d.stulevel + '</span></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>学生</label><ul class="fl">';
  strr = '</ul></div>';
  var li = '';
  for(var i = 0; i < d.stu.length; i++)
  {
   if(d.stu[i].contype === '常')
   {
    li += '<li class="fl"><span>' + d.stu[i].stuname + '</span><img src="images/changg.png" style="position: relative;top: -1px;right: -2px;" alt="" /></li>';
   }
   else if(d.stu[i].contype === '暑')
   {
    li += '<li class="fl"><span>' + d.stu[i].stuname + '</span><img src="images/shuj.png" style="position: relative;top: -1px;right: -2px;" alt="" /></li>';
   }
   else if(d.stu[i].contype === '寒')
   {
    li += '<li class="fl"><span>' + d.stu[i].stuname + '</span><img src="images/hanj.png" style="position: relative;top: -1px;right: -2px;" alt="" /></li>';
   }
  }
  $('.classInfor').html(str + li + strr);
 });
 table.on('checkbox(teacher)', function(d)//监听表格复选框选择 -班级
 { 
  var str = '';
  var strr = '';
  var d = d.data;
  var c = $('.teacherListC');
  c.attr('cid', d.id)
 });
 $(document).off('click', '.createClass .save').on('click', '.createClass .save', function(e)//班课-创建班级-保存
 { 
  layer.load(2);
  var t = $(e.target);
  var s = $('.createClass');
  var c = $('.classListC');
  var cur = $('.curtain');
  var stuI = s.find('.stu');
  var stuInfor = [];
  var sdate = c.find('h2').attr('sdate');
  var fr = c.find('h2').attr('fr');
  var tid = c.find('h2').attr('tid');
  var otwo = c.find('h2').attr('otwo');
  for(var i = 0; i < stuI.length; i++)
  {
   stuInfor.push(JSON.parse(stuI.eq(i).attr('si')));
  }
  $.ajax(
  {
   type: 'post',
   dataType: 'json',
   url: 'arrangeClass/insertStuClassroom',
   data:
   {
    grade: s.find('.grade').val(),
    subject: s.find('.subjects').val(),
    stulevel: s.find('.stulevel').val(),
    classesname: s.find('.className').val(),
    rnumber: s.find('.className').attr('nm'),
    stuList: JSON.stringify(stuInfor),
    otwo: s.find('h2').attr('otwo'),
    userid: s.find('h2').attr('tid')
   },
   success: function(d)
   {
    layer.close(layer.index);
    layer.msg(d.msg);
    if(d.code === 1)
    {
     s.hide();
     c.show();
     schedulingClassList(sdate, fr, tid, otwo);
     $('.checkSame:visible .layui-form-checkbox:first').trigger('click');
    }
   }
  })
  s.hide();
  c.show();
 });
 $(document).off('click', '.createClass .cancel').on('click', '.createClass .cancel', function(e)//班课-创建班级-取消
 { 
  var t = $(e.target);
  var s = $('.createClass');
  var c = $('.classListC');
  var cur = $('.curtain');
  var cre = $('.createClassStuList');
  clearInterval(careatCname);
  s.find('form').empty().html('<div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>年级</label><select class="select grade noneCheck"><option value="">请选择</option></select></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>科目</label><select class="select subjects noneCheck"><option value="">请选择</option></select></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>学员水平</label><select class="select noneCheck stulevel"><option value="">请选择</option><option value="0">优秀</option><option value="1">良好</option><option value="2">一般</option></select></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>班级名称</label><input type="text" class="fl className" placeholder="请输入内容"></div><div class="clearfix"><label for="" class="fl"><i class="xh">*</i>学生</label><i class="toStudentList">+</i></div><div class="stuInfFoot clearfix"><div class="fr clearfix"><button type="button" class="fl cancel OptBtn">取消</button> <button type="button" id="importStudent" class="fl save OptBtn">保存</button></div></div>');
  cre.find('.studentInforLeft').empty();
  cre.find('.studetChoosed').empty();
  cre.find('.studentInforRight').hide();
  paramGrade();
  paramSubjectS();
  s.hide();
  cur.show();
  c.show();
 });
 var careatCname = null;
 $(document).off('click', '.btnTypea').on('click', '.btnTypea', function(e)//创建班级-打开
 { 
  var t = $(e.target);
  var s = $('.createClass');
  var c = $('.classListC');
  var cur = $('.curtain');
  if(checkNull($('.createClass .noneCheck')))
  {
   careatCname = setInterval(function()
   {
    classNameProduct(careatCname);
   }, 1000);
  }
  s.show();
  cur.show();
  c.hide();
 });
 $(document).off('change', '.createClass .noneCheck').on('change', '.createClass .noneCheck', function(e)//创建班级-修改班级名
 { 
  if(checkNull($('.createClass .noneCheck')))
  {
   careatCname = setInterval(function()
   {
    classNameProduct(careatCname);
   }, 1000);
  }
 });

 function classNameProduct(careatCname)//生成班级名
 { 
  $.ajax(
  {
   type: 'post',
   dataType: 'json',
   url: 'arrangeClass/createClassname',
   data:
   {
    grade: $('.createClass .grade').val(),
    subject: $('.createClass .subjects').val(),
    stulevel: $('.createClass .stulevel').val()
   },
   success: function(d)
   {
    var da = d.data;
    if(d.code === 1)
    {
     $('.createClass .className').val(da.classesname).attr('nm', da.rnumber);
     clearInterval(careatCname);
    }
   }
  });
 }
 $(document).off('click', '.toStudentList').on('click', '.toStudentList', function(e)//创建班级-添加学生弹框
 { 
  var t = $(e.target);
  var c = $('.createClass');
  var s = $('.studentListC');
  var cur = $('.curtain');
  s.show();
  cur.show();
  c.hide();
  var sdate = c.find('h2').attr('sdate');
  var fr = c.find('h2').attr('fr');
  var otwo = c.find('h2').attr('otwo');
  s.addClass('createClassStuList');
  schedulingStudentList(sdate, fr, otwo);
 });
 $(document).off('click', '.createClassStuList .cancel').on('click', '.createClassStuList .cancel', function(e)
 { //创建班级-添加学生-学生列表取消
  var t = $(e.target);
  var c = $('.createClass');
  var s = $('.createClassStuList');
  var cur = $('.curtain');
  s.removeClass('createClassStuList');
  s.hide();
  cur.show();
  c.show();
 });
 $(document).off('click', '.createClassStuList .save').on('click', '.createClassStuList .save', function(e)
 { //创建班级-添加学生-学生列表保存
  var t = $(e.target);
  var c = $('.createClass');
  var s = $('.createClassStuList');
  var cur = $('.curtain');
  var stulist = s.find('.studetChoosed');
  var sl = stulist.find('li');
  var str = '';
  for(var i = 0; i < sl.length; i++)
  {
   if(sl.eq(i).attr('contype') === '常规合同')
   {
    str += '<li class="fl stu" si=\'{\"id\":\"' + sl.eq(i).attr("stuid") + '\",\"cid\":\"' + sl.eq(i).attr("cid") + '\"}\'>' + sl.eq(i).find('span').html() + '<img src="images/changg.png" alt="" /><img src="images/del.png" alt="" /></li>';
   }
   else if(sl.eq(i).attr('contype') === '暑假合同')
   {
    str += '<li class="fl stu" si=\'{\"id\":\"' + sl.eq(i).attr("stuid") + '\",\"cid\":\"' + sl.eq(i).attr("cid") + '\"}\'>' + sl.eq(i).find('span').html() + '<img src="images/shuj.png" alt="" /><img src="images/del.png" alt="" /></li>';
   }
   else if(sl.eq(i).attr('contype') === '寒假合同')
   {
    str += '<li class="fl stu" si=\'{\"id\":\"' + sl.eq(i).attr("stuid") + '\",\"cid\":\"' + sl.eq(i).attr("cid") + '\"}\'>' + sl.eq(i).find('span').html() + '<img src="images/hanj.png" alt="" /><img src="images/del.png" alt="" /></li>';
   }
  }
  s.find('.studentInforLeft').empty();
  s.find('.studetChoosed').empty();
  s.find('.studentInforRight').hide();
  c.find('.stulist .toStuL').before(str);
  s.hide();
  c.show();
 });
 $(document).off('click', '.orderFuc').on('click', '.orderFuc', function(e)
 { //创建班级-添加学生-选择学生
  var t = $(e.target);
  var str = '';
  var stuname = $('.createClassStuList .stuname').html();
  var stuid = $('.createClassStuList .stuname').attr('n');
  var cid = $('.orderFuc:checked').val();
  var ct = $('.orderFuc:checked').attr('ct');
  var sc = $('.studetChoosed');
  var scl = $('.studetChoosed li');
  if(scl.length != 0)
  {
   for(var i = 0; i < scl.length; i++)
   {
    if(scl.eq(i).attr('cid') === cid && scl.eq(i).attr('stuid') === stuid)
    {
     return false;
    }
   }
   for(var i = 0; i < scl.length; i++)
   {
    if(scl.eq(i).attr('cid') != cid && scl.eq(i).attr('stuid') === stuid)
    {
     scl.eq(i).remove();
     str = '<li class="fl positionR" stuid="' + stuid + '" cid="' + cid + '" contype="' + ct + '"><span>' + stuname + '</span><i class="iconfont icon-guanbi1"></i></li>';
    }
    else if(scl.eq(i).attr('cid') != cid && scl.eq(i).attr('stuid') != stuid)
    {
     str = '<li class="fl positionR" stuid="' + stuid + '" cid="' + cid + '" contype="' + ct + '"><span>' + stuname + '</span><i class="iconfont icon-guanbi1"></i></li>';
    }
   }
  }
  else
  {
   str = '<li class="fl positionR" stuid="' + stuid + '" cid="' + cid + '" contype="' + ct + '"><span>' + stuname + '</span><i class="iconfont icon-guanbi1"></i></li>';
  }
  sc.append(str);
 });
 $(document).off('click', '.studetChoosed .icon-guanbi1').on('click', '.studetChoosed .icon-guanbi1', function(e)
 { //创建班级-添加学生-删除学生
  var t = $(e.target);
  var str = '';
  var stuid = $('.createClassStuList .stuname').attr('n');
  var cid = $('.orderFuc:checked').val();
  t.parents('li').remove();
  if(t.parents('li').attr('cid') === cid && t.parents('li').attr('stuid') === stuid)
  {
   $('.orderFuc:checked').attr('checked', false);
  }
 });
 $(document).off('click', '.studentListC .save').on('click', '.studentListC .save', function(e)
 { //排课学生列表保存
  var t = $(e.target);
  var s = $('.scheduleBox');
  var c = $('.studentListC');
  var cur = $('.curtain');
  var hd = c.find('h2');
  if(c.find('h2').attr('cont') === '0')
  {
  	if(c.find('.chooseOrder input:checked').val()){
   var sids = {
    uid: c.find('.stuname').attr('n'),
    sid: c.find('.chooseOrder input:checked').val()
   };
     layer.load(2);
   $.ajax(
   {
    type: 'post',
    dataType: 'json',
    url: 'teacherClass/insertTeacherClass',
    data:
    {
     ct: hd.attr('ct'),
     sdate: hd.attr('sdate'),
     tid: hd.attr('tid'),
     cot: hd.attr('cont'),
     fr: hd.attr('fr'),
     otwo: hd.attr('otwo'),
     remarks:hd.attr('remarks'),
     sids: JSON.stringify(sids)
    },
    success: function(d)
    {
     var da = d.data;
     layer.close(layer.index);
     layer.msg(d.msg);
     if(d.code === 1)
     {
      c.find('.studentInforLeft').empty();
      c.find('.studentInforRight').hide();
      $('.takeCourse').attr('c', '');
      sessionStorage.count = 0;
      c.hide();
      cur.hide();
      $('.scheduleBox form').empty();
      $('#calssSchedule').trigger('click');
      $('.goback').trigger('click');
     }
    }
   });     		
  	}else{
  		layer.msg('学生无合同信息');
  	}
  }
  else
  {
   layer.close(layer.index);
  }
 });
 $(document).off('click', '.studentListC .cancel').on('click', '.studentListC .cancel', function(e)
 { //排课学生列表取消
  var t = $(e.target);
  var s = $('.scheduleBox');
  var c = $('.studentListC');
  var cur = $('.curtain');
  var hd = c.find('h2');
  c.find('.studentInforLeft').empty();
  c.find('.studentInforRight').hide();
  if(c.find('h2').attr('cont') === '0')
  {
   c.hide();
   cur.hide();
   s.show();
  }
 });
 $(document).off('click', '.classListC .cancel').on('click', '.classListC .cancel', function(e)
 { //排课班级列表取消
  var t = $(e.target);
  var s = $('.scheduleBox');
  var c = $('.classListC');
  var cur = $('.curtain');
  c.find('.classInfor').empty();
  s.show();
  c.hide();
  cur.hide()
 });
 $(document).off('click', '.classListC .save').on('click', '.classListC .save', function(e)
 { //排课班级列表提交
  var t = $(e.target);
  var s = $('.scheduleBox');
  var c = $('.classListC');
  var cur = $('.curtain');
  var hd = c.find('h2');
  var sids = {
   uid: c.find('.stuname').attr('n'),
   sid: c.find('.chooseOrder input:checked').val()
  };
  var sidsArr = [];
  sidsArr.push(sids);
  $.ajax(
  {
   type: 'post',
   dataType: 'json',
   url: 'teacherClass/insertTeacherClass',
   data:
   {
    ct: hd.attr('ct'),
    sdate: hd.attr('sdate'),
    tid: hd.attr('tid'),
    cot: hd.attr('cont'),
    fr: hd.attr('fr'),
    otwo: hd.attr('otwo'),
    cid: c.find('.nowClass').attr('oid')
   },
   success: function(d)
   {
    var da = d.data;
    layer.close(layer.index);
    layer.msg(d.msg);
    if(d.code === 1)
    {
     $('.takeCourse').attr('c', '');
     sessionStorage.count = 0;
     c.find('.classInfor').empty();
     s.find('form').empty();
     c.hide();
     cur.hide();
     $('#calssSchedule').trigger('click');
    }
   }
  });
 });
}
function timetableDetails()//排课详情

{ 
 $(document).off('click', '.hasClass').on('click', '.hasClass', function(e)//排课详情-弹框
 { 
  var t = $(e.currentTarget);
  var s = $('.scheduleDetail');
  var str = '';
  $('.scheduleBox .cancel').trigger('click');
  s.find('h2').attr('lid', t.attr('lid'));
  if(!t.hasClass('leaveWork'))
  {
   if(t.parents('.studentArrangeC').length != 0)
   {
    $('.scheduleDetail').attr('bsid', '1');
   }
   layer.load(2);
   $.ajax(
   {
    dataType: 'json',
    type: 'post',
    url: 'arrangeClass/queryClassPart',
    data:
    {
     lid: t.attr('lid')
    },
    success: function(d)
    {
     var da = d;
     var d = da.data;
     layer.close(layer.index);
     if(da.code === 0)
     {
      if(t.attr('ctype') === '0' || t.attr('ctype') === '2')
      { //一对一 试听
       str = '<div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>教师</label><p>' + d.username + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>类型</label><p>' + d.classontype + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>频次</label><p>' + d.classsum + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>起止日期</label><p>' + d.classtime + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>已结课数</label><p>' + d.classalr + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>学员</label><p>';
       var strLiS = '';
       var strLiE = '';
       if(t.attr('ctype') === '2')
       {
        strLiS = '<span>' + d.stu[0].stuname + '</span>';
       }
       if(d.stu[0].contype === '常')
       {
        strLiS = '<span>' + d.stu[0].stuname + '</span><img src="images/changg.png" style="position: relative;top: -1px;right: -2px;" alt="" />';
       }
       else if(d.stu[0].contype === '暑')
       {
        strLiS = '<span>' + d.stu[0].stuname + '</span><img src="images/shuj.png" style="position: relative;top: -1px;right: -2px;" alt="" />';
       }
       else if(d.stu[0].contype === '寒')
       {
        strLiS = '<span>' + d.stu[0].stuname + '</span><img src="images/hanj.png" style="position: relative;top: -1px;right: -2px;" alt="" />';
       }
       if(t.parents('.weekTable').hasClass('mysche') || ($('#idBOX').attr('range') === '2' && $('#idBOX').attr('dep') === '6') || $('#idBOX').attr('dep') === '8')
       {
        strLiE = '</p></div>';
       }
       else
       {
        if(d.stu[0].classcancel === null)
        {
         if( !t.hasClass('cancelClass'))
//       timeJudge(t) &&
         {
          strLiE = '</p></div><div class="adjustClass" style="display:none;"><label for="" class="fl required">调整课程</label><select class="select adjustment"  ><option value="">请选择</option><option value="3">调课</option><option value="2">加课</option><option value="7">取消课程</option><option value="6">删除课程</option></select></div><div class="adjustmentClass"></div><div class="stuInfFoot clearfix"><div class="fr clearfix"><button type="button" class="fl edit OptBtn">编辑</button> <button type="button" class="fl cancel OptBtn" style="display:none">取消</button> <button type="button" class="fl save OptBtn" style="display:none">保存</button></div></div>';
         }
         else
         {
          strLiE = '</p></div>';
         }
        }
        else
        {
         if( !t.hasClass('cancelClass'))
//       timeJudge(t) &&
         {
          strLiE = '<img src="images/stujia.png" alt="" /></p></div><div class="adjustClass" style="display:none;"><label for="" class="fl required">调整课程</label><select class="select adjustment"><option value="">请选择</option><option value="3">调课</option><option value="2">加课</option><option value="7">取消课程</option><option value="6">删除课程</option></select></div><div class="adjustmentClass"></div><div class="stuInfFoot clearfix"><div class="fr clearfix"><button type="button" class="fl edit OptBtn">编辑</button> <button type="button" class="fl cancel OptBtn" style="display:none">取消</button> <button type="button" class="fl save OptBtn" style="display:none">保存</button></div></div>';
         }
         else
         {
          strLiE = '<img src="images/stujia.png"  style="position: relative;top: -1px;right: -2px;"  alt="" /></p></div>';
         }
        }
       }
       str = str + strLiS + strLiE;
       $('.scheduleDetail form').html(str);
      }
      else if(t.attr('ctype') === '1')
      { //班课
       str = '<div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>班级</label><p>' + d.classesname + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>教师</label><p>' + d.username + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>类型</label><p>' + d.classontype + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>频次</label><p>' + d.classsum + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>起止日期</label><p>' + d.classtime + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>已结课数</label><p>' + d.classalr + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>学员水平</label><p>' + d.stulevel + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>学员</label><ul class="fl studentShowList clearfix">'
       var strEnd = '';
       var strLi = '';
       var strLiS = '';
       var strLiE = '';
       if(!t.hasClass('cancelClass'))
//     timeJudge(t) && 
       {
        strEnd = '</ul></div><div class="adjustClass" style="display:none;"><label for="" class="fl required">调整课程</label><select class="select adjustment" name="grade"><option value="">请选择</option><option value="3">调课</option><option value="2">加课</option><option value="7">取消课程</option><option value="6">删除课程</option></select></div><div class="adjustmentClass"></div><div class="stuInfFoot clearfix"><div class="fr clearfix"><button type="button" class="fl edit OptBtn">编辑</button> <button type="button" class="fl cancel OptBtn" style="display:none">取消</button> <button type="button" class="fl save OptBtn" style="display:none">保存</button></div></div>';
       }
       else
       {
        strEnd = '</ul></div>';
       }
       for(var i = 0; i < d.stu.length; i++)
       {
        if(d.stu[i].contype === '常')
        {
         strLiS = '<li class="fl"><span>' + d.stu[i].stuname + '</span><img src="images/changg.png"  style="position: relative;top: -1px;right: -2px;" alt="" />';
        }
        else if(d.stu[i].contype === '暑')
        {
         strLiS = '<li class="fl"><span>' + d.stu[i].stuname + '</span><img src="images/shuj.png"  style="position: relative;top: -1px;right: -2px;" alt="" />';
        }
        else if(d.stu[i].contype === '寒')
        {
         strLiS = '<li class="fl"><span>' + d.stu[i].stuname + '</span><img src="images/hanj.png"  style="position: relative;top: -1px;right: -2px;" alt="" />';
        }
        if(d.stu[i].classcancel === null)
        {
         strLiE = '</li>'
        }
        else
        {
         strLiE = '<img src="images/stujia.png"  style="position: relative;top: -1px;right: -2px;" alt="" /></li>'
        }
       }
       str = str + strLiS + strLiE + strEnd;
      }
     }
     s.find('form').html(str);
     var topLen = t.position().top + $('#main').scrollTop();
     var tcol = 0;
     var trow=t.parent('tr').index();
     for(var i = 0; i < t.parents('tr').find('td').length; i++)
     {
      if(t.parents('tr').find('td').eq(i).is(t))
      {
       tcol = i; //列索引						
      }
     }
     $('#main').scrollTop(topLen - 300);
     $('.classDetClk').removeClass('classDetClk');
     t.addClass('classDetClk');
     if(tcol < 3)
     { //弹出框位置小于周三
      s.css(
      {
       "left": t.offset().left + t.innerWidth(),
       "top": t.offset().top - (s.height() / 2 -60),
       'margin': 0
      })
     }
     else
     { //弹出框位置大于周三
      var theTop=t.offset().top - (s.height() / 2 -60);
      if($('.wt-main:visible').length===1&&trow>=9){
      	theTop=t.offset().top - (s.height() / 2 +150);
      }
      s.css(
      {
       "left": t.offset().left - s.innerWidth(),
       "top":theTop ,
       'margin': 0
      })
     }
     s.show();
    }
   })
  }
 });
 $(document).off('click', '.scheduleDetail .edit').on('click', '.scheduleDetail .edit', function(e)
 { //排课详情-编辑
  var t = $(e.target);
  t.hide();
  t.siblings('button').show();
  $('.adjustClass').show();
  $('.toStudentListBox').show();
 });
 //	$(document).off('click','.scheduleDetail .edit').on('click','.scheduleDetail .edit',function(e){//排课详情-编辑-添加学生
 //		var t=$(e.target);
 //		t.hide();
 //		t.siblings('button').show();
 //		$('.adjustment').attr('disabled',false);
 //		$('.toStudentListBox').show();
 //	}); 
 $(document).off('change', '.adjustment').on('change', '.adjustment', function(e)
 { //排课详情-编辑-调整课程选择
  var t = $(e.target);
  var str = '';
  var strs = '';
  var ac = $('.adjustmentClass');
  for(var i = 0; i < timeRangeArr.length; i++)
  {
   strs += '<li>' + timeRangeArr[i] + '</li>';
  }
  if(t.val() === '3')
  {
   str = '<div class="clearfix"><label for=""class="fl required"><i class="xh">*</i>调课</label><div class="fl positionR"><div><input type="checkbox" value="0"  class="typeBtn"  />临时调课</div><div><input type="checkbox" class="typeBtn" value="1" />常规调课</div><input type="text"class="layui-input achivClendar"placeholder="请选择日期"id="achivClendarClass"><span class="classRanget positionA"></span><ul class="positionA classTimeRange">' + strs + '</ul><script>dateCLclass("#achivClendarClass")</script></div></div><div class="clearfix note"><label for=""class="fl required"><i class="xh">*</i>备注</label><textarea name=""placeholder="添加备注"class="fl"></textarea></div>';
  }
  else if(t.val() === '2')
  {
   str = '<div class="clearfix"><label for=""class="fl required"><i class="xh">*</i>加课</label><div class="fl positionR"><div><input type="checkbox"  class="addClassTypeBtn typeBtn" value="0"  />临时加课</div><div><input type="checkbox" class="addClassTypeBtn rate typeBtn" value="1"  />常规加课</div><input type="text"class="layui-input achivClendar"placeholder="请选择日期"id="achivClendarClass"><span class="classRanget positionA"></span><ul class="positionA classTimeRange">' + strs + '</ul><script>dateCLclass("#achivClendarClass")</script></div></div><div class="clearfix note"><label for=""class="fl required"><i class="xh">*</i>备注</label><textarea name=""placeholder="添加备注"class="fl"></textarea></div>'
  }
  else if(t.val() === '7')
  {
   str = '<div class="clearfix"><label for=""class="fl required"><i class="xh">*</i>取消排课</label><div class="fl positionR"><div><input type="checkbox"  class="typeBtn"    value="0" />取消当前排课</div><div><input type="checkbox"  class="typeBtn" value="1"  />取消全部排课</div><select class="select leaveReasons"><option value="">请选择</option><option value="0">学生请假</option><option value="1">老师请假</option><option value="2">其他</option></select></div></div><div class="clearfix note"><label for=""class="fl required"><i class="xh">*</i>备注</label><textarea name=""placeholder="添加备注"class="fl"></textarea></div>'
  }
  else if(t.val() === '6')
  {
   str = '<div class="clearfix"><label for=""class="fl required"><i class="xh">*</i>删除排课</label><div class="fl positionR"><div><input type="checkbox"  class="typeBtn"  value="0" />删除当前排课</div><div><input type="checkbox"  class="typeBtn" value="1"  />删除全部排课</div></div></div>'
  }
  ac.html(str);
  var sd = $('.scheduleDetail');
  var w = sd.find('form').outerHeight();
  $('.scheduleDetail').find('.stuInfForm').scrollTop(w);
 });
 $(document).off('click', '.addClassTypeBtn').on('click', '.addClassTypeBtn', function(e)
 { //排课详情-编辑-是否是加课
  var t = $(e.target);
  var str = '';
  if(t.is(':checked') && t.hasClass('rate'))
  {
   str = '<div><input type="text" class="setRate"  placeholder="请输入频率"></div>'
   t.parent().after(str);
  }
  else
  {
   $('.setRate').remove();
  }
 });
 $(document).off('click', '.typeBtn').on('click', '.typeBtn', function(e)
 { //排课详情-编辑-调整课程选择
  var t = $(e.target);
  var c = $('.typeBtn')
  t.attr("checked", true);
  if(t.is(':checked'))
  {
   c.not(t).attr("checked", false)
  }
 });
 $(document).off('click', '.scheduleDetail .save').on('click', '.scheduleDetail .save', function(e)
 { //排课详情-编辑-提交
  var t = $(e.target);
  layer.load(2);
  var url = $('.scheduleDetail').attr('bsid') === undefined ? 'arrangeClass/updateAdjustClass' : 'arrangeClass/uppdateStuClass';
  $.ajax(
  {
   type: 'post',
   dataType: 'json',
   url: url,
   data:
   {
    id: $('.scheduleDetail').find('h2').attr('lid'), // 当前排课
    classtype: $('.adjustment').val(), // 3调课，2加课，7取消，6删除 表示
    classtime: $('.classRanget').html(), //时间区间
    dates: $('#achivClendarClass').val(), //日期
    dif: $('.typeBtn:checked').val(), //0临时1常规
    frequency: $('.setRate').val(), //频次
    remarks: $('.scheduleDetail textarea').val(), //备注
    classcancel: $('.leaveReasons').val() //0学生请假1老师请假 2 其他
   },
   success: function(d)
   {
    layer.close(layer.index);
    layer.msg(d.msg);
    if(d.code === 1)
    {
     $('#calssSchedule,.goback').trigger('click');
     $('.scheduleDetail').hide();
    }
   }
  })
 });
 $(document).off('click', '.scheduleDetail .icon-guanbi1').on('click', '.scheduleDetail .icon-guanbi1', function(e)
 { //排课详情-编辑-提交
  var t = $(e.target);
  $('.classDetClk').removeClass('classDetClk');
 });
}
//{ 
// $(document).off('click', '.hasClass').on('click', '.hasClass', function(e)//排课详情-弹框
// { 
//var t = $(e.currentTarget);
//var s = $('.scheduleDetail');
//var str = '';
//s.find('h2').attr('lid', t.attr('lid'));
//if(!t.hasClass('leaveWork'))
//{
// if(t.parents('.studentArrangeC').length != 0)
// {
//  $('.scheduleDetail').attr('bsid', '1');
// }
// layer.load(2);
// $.ajax(
// {
//  dataType: 'json',
//  type: 'post',
//  url: 'arrangeClass/queryClassPart',
//  data:
//  {
//   lid: t.attr('lid')
//  },
//  success: function(d)
//  {
//   var da = d;
//   var d = da.data;
//   layer.close(layer.index);
//   if(da.code === 0)
//   {
//    if(t.attr('ctype') === '0' || t.attr('ctype') === '2')
//    { //一对一 试听
//     str = '<div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>教师</label><p>' + d.username + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>类型</label><p>' + d.classontype + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>频次</label><p>' + d.classsum + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>起止日期</label><p>' + d.classtime + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>已结课数</label><p>' + d.classalr + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>学员</label><p>';
//     var strLiS = '';
//     var strLiE = '';
//     if(t.attr('ctype') === '2')
//     {
//      strLiS = '<span>' + d.stu[0].stuname + '</span>';
//     }
//     if(d.stu[0].contype === '常')
//     {
//      strLiS = '<span>' + d.stu[0].stuname + '</span><img src="images/changg.png" style="position: relative;top: -1px;right: -2px;" alt="" />';
//     }
//     else if(d.stu[0].contype === '暑')
//     {
//      strLiS = '<span>' + d.stu[0].stuname + '</span><img src="images/shuj.png" style="position: relative;top: -1px;right: -2px;" alt="" />';
//     }
//     else if(d.stu[0].contype === '寒')
//     {
//      strLiS = '<span>' + d.stu[0].stuname + '</span><img src="images/hanj.png" style="position: relative;top: -1px;right: -2px;" alt="" />';
//     }
//     if(t.parents('.weekTable').hasClass('mysche') || ($('#idBOX').attr('range') === '2' && $('#idBOX').attr('dep') === '6') || $('#idBOX').attr('dep') === '8')
//     {
//      strLiE = '</p></div>';
//     }
//     else
//     {
//      if(d.stu[0].classcancel === null)
//      {
//       if(timeJudge(t) && !t.hasClass('cancelClass'))
//       {
//        strLiE = '</p></div><div class="adjustClass" style="display:none;"><label for="" class="fl required">调整课程</label><select class="select adjustment"  ><option value="">请选择</option><option value="3">调课</option><option value="2">加课</option><option value="7">取消课程</option><option value="6">删除课程</option></select></div><div class="adjustmentClass"></div><div class="stuInfFoot clearfix"><div class="fr clearfix"><button type="button" class="fl edit OptBtn">编辑</button> <button type="button" class="fl cancel OptBtn" style="display:none">取消</button> <button type="button" class="fl save OptBtn" style="display:none">保存</button></div></div>';
//       }
//       else
//       {
//        strLiE = '</p></div>';
//       }
//      }
//      else
//      {
//       if(timeJudge(t) && !t.hasClass('cancelClass'))
//       {
//        strLiE = '<img src="images/stujia.png" alt="" /></p></div><div class="adjustClass" style="display:none;"><label for="" class="fl required">调整课程</label><select class="select adjustment"><option value="">请选择</option><option value="3">调课</option><option value="2">加课</option><option value="7">取消课程</option><option value="6">删除课程</option></select></div><div class="adjustmentClass"></div><div class="stuInfFoot clearfix"><div class="fr clearfix"><button type="button" class="fl edit OptBtn">编辑</button> <button type="button" class="fl cancel OptBtn" style="display:none">取消</button> <button type="button" class="fl save OptBtn" style="display:none">保存</button></div></div>';
//       }
//       else
//       {
//        strLiE = '<img src="images/stujia.png"  style="position: relative;top: -1px;right: -2px;"  alt="" /></p></div>';
//       }
//      }
//     }
//     str = str + strLiS + strLiE;
//     $('.scheduleDetail form').html(str);
//    }
//    else if(t.attr('ctype') === '1')
//    { //班课
//     str = '<div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>班级</label><p>' + d.classesname + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>教师</label><p>' + d.username + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>类型</label><p>' + d.classontype + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>频次</label><p>' + d.classsum + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>起止日期</label><p>' + d.classtime + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>已结课数</label><p>' + d.classalr + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>学员水平</label><p>' + d.stulevel + '</p></div><div class="clearfix"><label for="" class="fl required"><i class="xh">*</i>学员</label><ul class="fl studentShowList clearfix">'
//     var strEnd = '';
//     var strLi = '';
//     var strLiS = '';
//     var strLiE = '';
//     if(timeJudge(t) && !t.hasClass('cancelClass'))
//     {
//      strEnd = '</ul></div><div class="adjustClass" style="display:none;"><label for="" class="fl required">调整课程</label><select class="select adjustment" name="grade"><option value="">请选择</option><option value="3">调课</option><option value="2">加课</option><option value="7">取消课程</option><option value="6">删除课程</option></select></div><div class="adjustmentClass"></div><div class="stuInfFoot clearfix"><div class="fr clearfix"><button type="button" class="fl edit OptBtn">编辑</button> <button type="button" class="fl cancel OptBtn" style="display:none">取消</button> <button type="button" class="fl save OptBtn" style="display:none">保存</button></div></div>';
//     }
//     else
//     {
//      strEnd = '</ul></div>';
//     }
//     for(var i = 0; i < d.stu.length; i++)
//     {
//      if(d.stu[i].contype === '常')
//      {
//       strLiS = '<li class="fl"><span>' + d.stu[i].stuname + '</span><img src="images/changg.png"  style="position: relative;top: -1px;right: -2px;" alt="" />';
//      }
//      else if(d.stu[i].contype === '暑')
//      {
//       strLiS = '<li class="fl"><span>' + d.stu[i].stuname + '</span><img src="images/shuj.png"  style="position: relative;top: -1px;right: -2px;" alt="" />';
//      }
//      else if(d.stu[i].contype === '寒')
//      {
//       strLiS = '<li class="fl"><span>' + d.stu[i].stuname + '</span><img src="images/hanj.png"  style="position: relative;top: -1px;right: -2px;" alt="" />';
//      }
//      if(d.stu[i].classcancel === null)
//      {
//       strLiE = '</li>'
//      }
//      else
//      {
//       strLiE = '<img src="images/stujia.png"  style="position: relative;top: -1px;right: -2px;" alt="" /></li>'
//      }
//     }
//     str = str + strLiS + strLiE + strEnd;
//    }
//   }
//   s.find('form').html(str);
//   var topLen = t.position().top + $('#main').scrollTop();
//   var tcol = 0;
//   var trow=t.parent('tr').index();
//   for(var i = 0; i < t.parents('tr').find('td').length; i++)
//   {
//    if(t.parents('tr').find('td').eq(i).is(t))
//    {
//     tcol = i; //列索引						
//    }
//   }
//   $('#main').scrollTop(topLen - 300);
//   $('.classDetClk').removeClass('classDetClk');
//   t.addClass('classDetClk');
//   if(tcol < 3)
//   { //弹出框位置小于周三
//    s.css(
//    {
//     "left": t.offset().left + t.innerWidth(),
//     "top": t.offset().top - (s.height() / 2 -60),
//     'margin': 0
//    })
//   }
//   else
//   { //弹出框位置大于周三
//    var theTop=t.offset().top - (s.height() / 2 -60);
//    if($('.wt-main:visible').length===1&&trow>=9){
//    	theTop=t.offset().top - (s.height() / 2 +150);
//    }
//    s.css(
//    {
//     "left": t.offset().left - s.innerWidth(),
//     "top":theTop ,
//     'margin': 0
//    })
//   }
//   s.show();
//  }
// })
//}
// });
// $(document).off('click', '.scheduleDetail .edit').on('click', '.scheduleDetail .edit', function(e)
// { //排课详情-编辑
//var t = $(e.target);
//t.hide();
//t.siblings('button').show();
//$('.adjustClass').show();
//$('.toStudentListBox').show();
// });
// //	$(document).off('click','.scheduleDetail .edit').on('click','.scheduleDetail .edit',function(e){//排课详情-编辑-添加学生
// //		var t=$(e.target);
// //		t.hide();
// //		t.siblings('button').show();
// //		$('.adjustment').attr('disabled',false);
// //		$('.toStudentListBox').show();
// //	}); 
// $(document).off('change', '.adjustment').on('change', '.adjustment', function(e)
// { //排课详情-编辑-调整课程选择
//var t = $(e.target);
//var str = '';
//var strs = '';
//var ac = $('.adjustmentClass');
//for(var i = 0; i < timeRangeArr.length; i++)
//{
// strs += '<li>' + timeRangeArr[i] + '</li>';
//}
//if(t.val() === '3')
//{
// str = '<div class="clearfix"><label for=""class="fl required"><i class="xh">*</i>调课</label><div class="fl positionR"><div><input type="checkbox" value="0"  class="typeBtn"  />临时调课</div><div><input type="checkbox" class="typeBtn" value="1" />常规调课</div><input type="text"class="layui-input achivClendar"placeholder="请选择日期"id="achivClendarClass"><span class="classRanget positionA"></span><ul class="positionA classTimeRange">' + strs + '</ul><script>dateCLclass("#achivClendarClass")</script></div></div><div class="clearfix note"><label for=""class="fl required"><i class="xh">*</i>备注</label><textarea name=""placeholder="添加备注"class="fl"></textarea></div>';
//}
//else if(t.val() === '2')
//{
// str = '<div class="clearfix"><label for=""class="fl required"><i class="xh">*</i>加课</label><div class="fl positionR"><div><input type="checkbox"  class="addClassTypeBtn typeBtn" value="0"  />临时加课</div><div><input type="checkbox" class="addClassTypeBtn rate typeBtn" value="1"  />常规加课</div><input type="text"class="layui-input achivClendar"placeholder="请选择日期"id="achivClendarClass"><span class="classRanget positionA"></span><ul class="positionA classTimeRange">' + strs + '</ul><script>dateCLclass("#achivClendarClass")()</script></div></div><div class="clearfix note"><label for=""class="fl required"><i class="xh">*</i>备注</label><textarea name=""placeholder="添加备注"class="fl"></textarea></div>'
//}
//else if(t.val() === '7')
//{
// str = '<div class="clearfix"><label for=""class="fl required"><i class="xh">*</i>取消排课</label><div class="fl positionR"><div><input type="checkbox"  class="typeBtn"    value="0" />取消当前排课</div><div><input type="checkbox"  class="typeBtn" value="1"  />取消全部排课</div><select class="select leaveReasons"><option value="">请选择</option><option value="0">学生请假</option><option value="1">老师请假</option><option value="2">其他</option></select></div></div><div class="clearfix note"><label for=""class="fl required"><i class="xh">*</i>备注</label><textarea name=""placeholder="添加备注"class="fl"></textarea></div>'
//}
//else if(t.val() === '6')
//{
// str = '<div class="clearfix"><label for=""class="fl required"><i class="xh">*</i>删除排课</label><div class="fl positionR"><div><input type="checkbox"  class="typeBtn"  value="0" />删除当前排课</div><div><input type="checkbox"  class="typeBtn" value="1"  />删除全部排课</div></div></div>'
//}
//ac.html(str);
//var sd = $('.scheduleDetail');
//var w = sd.find('form').outerHeight();
//$('.scheduleDetail').find('.stuInfForm').scrollTop(w);
// });
// $(document).off('click', '.addClassTypeBtn').on('click', '.addClassTypeBtn', function(e)
// { //排课详情-编辑-是否是加课
//var t = $(e.target);
//var str = '';
//if(t.is(':checked') && t.hasClass('rate'))
//{
// str = '<div><input type="text" class="setRate"  placeholder="请输入频率"></div>'
// t.parent().after(str);
//}
//else
//{
// $('.setRate').remove();
//}
// });
// $(document).off('click', '.typeBtn').on('click', '.typeBtn', function(e)
// { //排课详情-编辑-调整课程选择
//var t = $(e.target);
//var c = $('.typeBtn')
//t.attr("checked", true);
//if(t.is(':checked'))
//{
// c.not(t).attr("checked", false)
//}
// });
// $(document).off('click', '.scheduleDetail .save').on('click', '.scheduleDetail .save', function(e)
// { //排课详情-编辑-提交
//var t = $(e.target);
//layer.load(2);
//var url = $('.scheduleDetail').attr('bsid') === undefined ? 'arrangeClass/updateAdjustClass' : 'arrangeClass/uppdateStuClass';
//$.ajax(
//{
// type: 'post',
// dataType: 'json',
// url: url,
// data:
// {
//  id: $('.scheduleDetail').find('h2').attr('lid'), // 当前排课
//  classtype: $('.adjustment').val(), // 3调课，2加课，7取消，6删除 表示
//  classtime: $('.classRanget').html(), //时间区间
//  dates: $('#achivClendarClass').val(), //日期
//  dif: $('.typeBtn:checked').val(), //0临时1常规
//  frequency: $('.setRate').val(), //频次
//  remarks: $('.scheduleDetail textarea').val(), //备注
//  classcancel: $('.leaveReasons').val() //0学生请假1老师请假 2 其他
// },
// success: function(d)
// {
//  layer.close(layer.index);
//  layer.msg(d.msg);
//  if(d.code === 1)
//  {
//   $('#calssSchedule').trigger('click');
//   $('.scheduleDetail').hide();
//  }
// }
//})
// });
// $(document).off('click', '.scheduleDetail .icon-guanbi1').on('click', '.scheduleDetail .icon-guanbi1', function(e)
// { //排课详情-编辑-提交
//var t = $(e.target);
//$('.classDetClk').removeClass('classDetClk');
// });
//}
/* 审核试听*/
function checkAudition(table, isline)
{ //查看试听预约信息
 table.on('tool(test)', function(obj)
 {
  var d = obj.data;
  var str = '';
  if(obj.event === 'checkAut')
  {
   var t = d.timeval.split(' ');
   str = '<div class="clearfix"><label for=""class="fl required"><i class="xh">*</i>姓名</label><p>' + d.stuname + '</p></div><div class="clearfix"><label for=""class="fl required"><i class="xh">*</i>年级</label><p>' + onGrade(d) + '</p></div><div class="clearfix"><label for=""class="fl required"><i class="xh">*</i>科目</label><p>' + onSubject(d, "asubject") + '</p></div><input type="hidden"name="id"class="id" value="' + d.id + '" /><div class="clearfix positionR"><label for=""class="fl required"><i class="xh">*</i>老师</label><input type="text"class="fl theTeacher orderNeed" value="' + d.username + '" placeholder="请输入内容"/><input type="hidden"class="userid"name="userid" value="' + d.userid + '" /><ul class="examineDet positionA teacherName"style="left: 100px;width: 220px!important;max-height:150px;overflow-y: auto;display: none;"></ul><script>searchTeacher();</script></div><div class="clearfix"><input type="hidden"class="hopetime" value="' + d.timeval + '" name="times"/><label for=""class="fl required"><i class="xh">*</i>试听时间</label><div class="positionR fl achivClWrap"id="div_month_picker"><input type="text"class="layui-input achivClendar"placeholder="请选择日期"id="achivClendarClass" value="' + t[0] + '"><i class="positionA iconfont icon-rili"></i><span class="classRanget positionA">' + t[1] + '</span><ul class="positionA classTimeRange"></ul></div><script type="text/javascript">dateMin();</script></div><div class="clearfix"><label for=""class="fl required"><i class="xh">*</i>课程时长</label><input type="text"class="fl  orderNeed auditiondate" value="' + d.auditiondate + '" name="auditiondate"placeholder="请输入内容|单位分钟"/></div>';
   $('.auditionOrderChcek form').html(str);
   var strs = '',
    timeStartArr = ['08:00', '09:00', '10:10', '11:10', '12:50', '13:50', '15:00', '16:00', '17:30', '18:30', '19:40', '20:40'];
   for(var i = 0; i < timeStartArr.length; i++)
   {
    strs += '<li>' + timeStartArr[i] + '</li>';
   }
   $('.classTimeRange').html(strs);
   dateCLclass("#achivClendarClass"); //上课时间
  }
 });
 $(document).off('click', '.auditionOrderChcek .save').on('click', '.auditionOrderChcek .save', function(e)
 { //通过审核
  var t = $(e.target);
  $('.auditionOrderChcek .hopetime').val($('#achivClendarClass').val() + " " + $('.classRanget').html())
  layer.load(2);
  $.ajax(
  {
   url: 'audition/updateUnauditedStu',
   type: 'post',
   dataType: 'json',
   data:
   {
    id: $('.auditionOrderChcek .id').val(),
    times: $('.auditionOrderChcek .hopetime').val(),
    auditiondate: $('.auditionOrderChcek .auditiondate').val(),
    userid: $('.auditionOrderChcek .userid').val(),
    otwo: isline
   },
   success: function(d)
   {
    layer.close(layer.index);
    layer.msg(d.msg);
    if(d.code === 1)
    {
     $('.auditionOrderChcek').hide();
     $('.curtain').hide();
     $('#mystu_tab li:eq(1)').trigger('click');
     $('.auditionOrderChcek form').html('');
    };
   }
  })
 });
}
/*
教师排班
 */
function scheduleShowWork(id)
{
 layer.load(2);
 $.ajax(
 {
  type: 'post',
  dataType: 'json',
  url: 'teacherClass/findTeaClsssList',
  data:
  {
   page: 0,
   limit: 10,
   monday: $('.wc-day-1 .weeks:visible').attr('d'),
   sunday: $('.wc-day-7 .weeks:visible').attr('d'),
   id: id
  },
  success: function(d)
  {
   layer.close(layer.index);
   $('.consum').html(d.count);
   //		var b=$('.wt-main:visible');	
   var da = d.data;
   var t = [];
   var w = $('.weeks:visible');
   var row = [];
   var col = [];
   scheduleFrame(10);
   layer.close(layer.index);
   if(id === undefined)
   {
    layui.use('laypage', function()
    {
     var laypage = layui.laypage;
     //分页
     laypage.render(
     {
      elem: 'classTablePage',
      count: d.count,
      layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'],
      jump: function(obj)
      {
       scheduleFrame(obj.limit);
       var key = {
        page: obj.curr,
        limit: obj.limit,
        monday: $('.wc-day-1 .weeks:visible').attr('d'),
        sunday: $('.wc-day-7 .weeks:visible').attr('d'),
        username: $('#mystu_sear #stu_name').val(),
        grade: $('#mystu_sear .grade').val(),
        subject: $('#mystu_sear .subjects').val(),
        shift: $('#workType').val()
       }
       workScheduleShowReload(key);
       tableWidth();
      }
     });
    });
   }
   $('#classTablePage').hide();
   workScheduleShowJudge(w, d, da, t);
  }
 })
 $(document).off('click', '.teacherArrangeW .wc-nav button').on('click', '.teacherArrangeW .wc-nav button', function()
 { //排班表切换周重载
  var pag = $('.layui-laypage-curr em:last-child').html();
  if(pag === undefined)
  {
   pag = 1;
  }
  var dt = $('.teacherArrangeW').find('.wt-left dt');
  var id = dt.length === 1 ? dt.attr('tid') : '';
  var key = {
   page: pag || 1,
   limit: $('.layui-laypage-limits select').val() || 10,
   monday: $('.wc-day-1 .weeks:visible').attr('d'),
   sunday: $('.wc-day-7 .weeks:visible').attr('d'),
   username: $('#mystu_sear #stu_name').val(),
   grade: $('#mystu_sear .grade').val(),
   subject: $('#mystu_sear .subjects').val(),
   shift: $('#workType').val(),
   id: id
  }
  scheduleFrame($('.layui-laypage-limits select').val());
  workScheduleShowReload(key);
  tableWidth();
 })
 $(document).off('click', '#calssSchedule').on('click', '#calssSchedule', function()
 { //排班表搜索重载
  layer.load(2);
  var dt = $('#mystu_sear .achivClendar').val();
  var oneDayTime = 24 * 60 * 60 * 1000;
  var MondayTime = '';
  var SundayTime = '';
  if(dt != '')
  {
   var nd = new Date(dt);
   var day = nd.getDay();
   nd = nd.getTime();
   if(day === 0)
   {
    day = 7;
   }
   //显示周一
   MondayTime = nd - (day - 1) * oneDayTime;
   //显示周日
   SundayTime = nd + (7 - day) * oneDayTime;
   MondayTime = timestampToData(MondayTime);
   SundayTime = timestampToData(SundayTime);
  }
  else
  {
   MondayTime = $('.wc-day-1 .weeks:visible').attr('d');
   SundayTime = $('.wc-day-7 .weeks:visible').attr('d');
  }
  var pag = $('.layui-laypage-curr em:last-child').html();
  if(pag === undefined)
  {
   pag = 1;
  }
  var key = {
   page: pag,
   limit: $('.layui-laypage-limits select').val(),
   monday: MondayTime,
   sunday: SundayTime,
   username: $('#mystu_sear #stu_name').val(),
   grade: $('#mystu_sear .grade').val(),
   subject: $('#mystu_sear .subjects').val(),
   shift: $('#workType').val()
  }
  $.ajax(
  { //搜索重载
   type: 'post',
   dataType: 'json',
   url: 'teacherClass/findTeaClsssList',
   data: key,
   success: function(d)
   {
    layer.close(layer.index);
    $('.consum').html(d.count);
    var b = $('.wt-main:visible');
    var da = d.data;
    var t = [];
    var w = $('.weeks:visible');
    var row = [];
    var col = [];
    scheduleFrame(10);
    layer.close(layer.index);
    layui.use('laypage', function()
    {
     var laypage = layui.laypage;
     //分页
     laypage.render(
     {
      elem: 'classTablePage',
      count: d.count,
      layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'],
      jump: function(obj)
      {
       scheduleFrame(obj.limit);
       var key = {
        page: obj.curr,
        limit: obj.limit,
        monday: MondayTime,
        sunday: SundayTime,
        username: $('#mystu_sear #stu_name').val(),
        grade: $('#mystu_sear .grade').val(),
        subject: $('#mystu_sear .subjects').val(),
        shift: $('#workType').val()
       }
       workScheduleShowReload(key);
       tableWidth();
      }
     });
     $('#classTablePage').hide();
    });
    workScheduleShowJudge(w, d, da, t);
    $('#calendar').remove();
    $('.switchWeek').after('<div id="calendar"></div>');
    $('#calendar').weekCalendar(
    {
     date: new Date(dt)
    });
    tableWidth();
   }
  })
 })
}

function workScheduleShowJudge(w, d, da, t)
{ //排班表展示
 var clos = [];
 for(var i = 0; i < w.length; i++)
 { //一周日期
  t.push(w.eq(i).attr('d'));
 }
 if(d.code === 0)
 {
  for(var i = 0; i < da.length; i++)
  {
   var l = '';
   for(var j = 0; j < da[i].classInfo.length; j++)
   { //班级信息
    l += '<li class="clearfix"><span class="fl">' + da[i].classInfo[j].classesname + '</span><span class="fr">' + da[i].classInfo[j].stunum + '</span></li>';
   }
   $('.teacherArrangeW .wt-main').eq(i).find('.wt-left ul').html(l);
   //老师信息
   $('.teacherArrangeW .wt-main').eq(i).find('.wt-left dl').html('<dt tid="' + da[i].id + '">' + da[i].username + '</dt><dd class="clearfix"><span class="wt-phone fl">' + da[i].phone + '</span><span class="wt-teacherDet fr">' + da[i].grade + da[i].subject + '</span></dd>');
   for(var j = 0; j < da[i].schedulings.length; j++)
   { //排班信息
    for(var k = 0; k < t.length; k++)
    {
     if(da[i].schedulings[j].sdate === t[k])
     {
      $('.teacherArrangeW .wt-main table').eq(i).find('tr').find('td:eq(' + k + ')').attr('tid', da[i].schedulings[j].id);
      if(da[i].schedulings[j].shift === '0')
      {
       $('.teacherArrangeW .wt-main  table').eq(i).find('tr:lt(7)').find('td:eq(' + k + ')').addClass('workTimeId');
      }
      else if(da[i].schedulings[j].shift === '1')
      {
       $('.teacherArrangeW .wt-main  table').eq(i).find('tr:lt(9):gt(1)').find('td:eq(' + k + ')').addClass('workTimeId');
      }
      else if(da[i].schedulings[j].shift === '2')
      {
       $('.teacherArrangeW .wt-main  table').eq(i).find('tr:lt(11):gt(3)').find('td:eq(' + k + ')').addClass('workTimeId');
      }
      else if(da[i].schedulings[j].shift === '3')
      {
       $('.teacherArrangeW .wt-main table').eq(i).find('tr:gt(4)').find('td:eq(' + k + ')').addClass('workTimeId');
      }
     }
    }
   }
   if(d.data.length < parseInt($('.weekTable  .layui-laypage-limits select').val()) || d.data.length < 10)
   {
    $('.teacherArrangeW .wt-main:lt(' + d.data.length + ')').show();
   }
   else
   {
    $('.teacherArrangeW .wt-main').show();
   }
  }
  setTimeout(function()
  {
   $('#classTablePage').show();
  }, 1000)
 }
}

function workScheduleShowReload(key)
{ //重载排班表
 layer.load(2);
 $.ajax(
 {
  type: 'post',
  dataType: 'json',
  url: 'teacherClass/findTeaClsssList',
  data: key,
  success: function(d)
  {
   var b = $('.teacherArrangeW .scheduleFrame  .wt-main');
   var da = d.data;
   var t = [];
   var w = $('.weeks:visible');
   var row = [];
   var col = [];
   layer.close(layer.index);
   $('.consum').html(d.count);
   workScheduleShowJudge(w, d, da, t);
   tableWidth();
  }
 });
}

function workScheduling()
{ //进行排班
 $(document).off('click', '.CarryOutShiftQuick .save').on('click', '.CarryOutShiftQuick .save', function(e)
 { //排班表排班-提交
  var t = $(e.currentTarget),
   w = $('.workRange').val(),
   l = $('.workTime li'),
   ar = [];
  for(var i = 0; i < l.length; i++)
  {
   ar.push(l.find('span').html())
  }
  layer.load(2);
  $.ajax(
  {
   type: 'post',
   dataType: 'json',
   url: 'teacherClass/insertScheduling',
   data:
   {
    uids: t.parents('.CarryOutShiftQuick').find('h2').attr('uid'), //老师（数组）
    tid: t.parents('.CarryOutShiftQuick').find('h2').attr('tid'),
    branch: '0', //判断按天或按时间段
    sdate: JSON.stringify(ar), //时间数组
    shift: w //班次
   },
   success: function(d)
   {
    layer.close(layer.index);
    layer.msg(d.msg)
    if(d.code === 1)
    {
     $('.schedulingState').removeClass('schedulingState schedulingStatel');
     $('.workTime').empty();
     $('.CarryOutShiftQuick').hide();
     $('#calssSchedule').trigger('click');
     $('.schedulingInfBackW').trigger('click');
    }
   }
  })
 })
 $(document).off('click', '.CarryOutShiftQuick .cancel').on('click', '.CarryOutShiftQuick .cancel', function(e)
 { //排班表排班-取消
  var t = $(e.currentTarget);
  $('.schedulingState').removeClass('schedulingState schedulingStatel');
  $('.workTime').empty();
 })
 $(document).off('click', '.CarryOutShiftQuick .workTime .icon-guanbi1').on('click', '.CarryOutShiftQuick .workTime .icon-guanbi1', function(e)
 { //排班表排班-删除时间
  var t = $(e.currentTarget);
  var ss = $('.schedulingState');
  var timeLi=$('.CarryOutShiftQuick .workTime li');
  if(timeLi.length>1)
  {
	  t.parents('li').remove();
	  for(var i = 0; i < ss.length; i++)
	  {
	   if(t.attr('cw') === ss.eq(i).attr('cw'))
	   {
	    ss.eq(i).removeClass('schedulingState schedulingStatel');
	   }
	  }   	
  }else{
  	layer.msg('至少保留一个时间')
  }
 })
}
workScheduling();
/*
教师排课
 */
function scheduleShow(id)
{
 layer.load(2);
 $.ajax(
 {
  type: 'post',
  dataType: 'json',
  url: 'teacherClass/queryTeacherClassInfo',
  data:
  {
   page: 0,
   limit: 10,
   monday: $('.wc-day-1 .weeks:visible').attr('d'),
   sunday: $('.wc-day-7 .weeks:visible').attr('d'),
   id: id
  },
  success: function(d)
  {
   layer.close(layer.index);
   var da = d.data;
   var t = [];
   var w = $('.weeks:visible');
   var row = [];
   var col = [];
   scheduleFrame(10);
   layer.close(layer.index);
   $('.consum').html(d.count);
   if(id === undefined)
   {
    layui.use('laypage', function()
    {
     var laypage = layui.laypage;
     //分页
     laypage.render(
     {
      elem: 'classTablePage',
      count: d.count,
      layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'],
      jump: function(obj)
      {
       scheduleFrame(obj.limit);
       var key = {
        page: obj.curr,
        limit: obj.limit,
        monday: $('.wc-day-1 .weeks:visible').attr('d'),
        sunday: $('.wc-day-7 .weeks:visible').attr('d'),
        username: $('#mystu_sear #stu_name').val(),
        grade: $('#mystu_sear .grade').val(),
        subject: $('#mystu_sear .subjects').val(),
        shift: $('#workType').val()
       }
       scheduleShowReload(key);
      }
     });
    });
   }
   $('#classTablePage').hide();
   scheduleShowJudge(w, d, da, t, row, col);
  }
 })
 $(document).off('click', '.teacherArrangeC .wc-nav button').on('click', '.teacherArrangeC .wc-nav button', function()
 { //排课表切换周重载
  var pag = $('.layui-laypage-curr em:last-child').html();
  var limit = $('.layui-laypage-limits select').val();
  if(pag === undefined)
  {
   pag = 1;
  }
  if(limit === undefined)
  {
   limit = 10;
  }
  var dt = $('.teacherArrangeC').find('.wt-left dt');
  var id = dt.length === 1 ? dt.attr('tid') : '';
  var key = {
   page: pag,
   limit: limit,
   monday: $('.wc-day-1 .weeks:visible').attr('d'),
   sunday: $('.wc-day-7 .weeks:visible').attr('d'),
   username: $('#mystu_sear #stu_name').val(),
   grade: $('#mystu_sear .grade').val(),
   subject: $('#mystu_sear .subjects').val(),
   shift: $('#workType').val(),
   id: id
  }
  scheduleFrame(limit);
  scheduleShowReload(key);
  //		    		tableWidth();
 })
 $(document).off('click', '#calssSchedule').on('click', '#calssSchedule', function()
 { //排课表搜索重载
  layer.load(2);
  var dt = $('#mystu_sear .achivClendar').val();
  var oneDayTime = 24 * 60 * 60 * 1000;
  var MondayTime = '';
  var SundayTime = '';
  console.log(dt != '');
  if(dt != '')
  {
   var nd = new Date(dt);
   var day = nd.getDay();
   nd = nd.getTime();
   console.log(day);
   //显示周一
   if(day === 0)
   {
    day = 7;
   }
   MondayTime = nd - (day - 1) * oneDayTime;
   //显示周日
   SundayTime = nd + (7 - day) * oneDayTime;
   MondayTime = timestampToData(MondayTime);
   SundayTime = timestampToData(SundayTime);
  }
  else
  {
   MondayTime = $('.wc-day-1 .weeks:visible').attr('d');
   SundayTime = $('.wc-day-7 .weeks:visible').attr('d');
  }
  var pag = $('.layui-laypage-curr em:last-child').html();
  var limit = $('.layui-laypage-limits select').val();
  if(pag === undefined)
  {
   pag = 1;
  }
  if(limit === undefined)
  {
   limit = 10;
  }
  var key = {
   page: pag,
   limit: limit,
   monday: MondayTime,
   sunday: SundayTime,
   username: $('#mystu_sear #stu_name').val(),
   grade: $('#mystu_sear .grade').val(),
   subject: $('#mystu_sear .subjects').val(),
   shift: $('#workType').val(),
   id: id
  }
  console.log(key);
  $.ajax(
  { //搜索重载
   type: 'post',
   dataType: 'json',
   url: 'teacherClass/queryTeacherClassInfo',
   data: key,
   success: function(d)
   {
    layer.close(layer.index);
    var da = d.data;
    var t = [];
    var w = $('.weeks:visible');
    var row = [];
    var col = [];
    scheduleFrame(10);
    layer.close(layer.index);
    $('.consum').html(d.count);
    layui.use('laypage', function()
    {
     var laypage = layui.laypage;
     //分页
     laypage.render(
     {
      elem: 'classTablePage',
      count: d.count,
      layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'],
      jump: function(obj)
      {
       scheduleFrame(obj.limit);
       var key = {
        page: obj.curr,
        limit: obj.limit,
        monday: MondayTime,
        sunday: SundayTime,
        username: $('#mystu_sear #stu_name').val(),
        grade: $('#mystu_sear .grade').val(),
        subject: $('#mystu_sear .subjects').val(),
        shift: $('#workType').val(),
        id: id
       }
       scheduleShowReload(key);
      }
     });
     $('#classTablePage').hide();
    });
    scheduleShowJudge(w, d, da, t, row, col);
    $('#calendarLesson').remove();
    $('.switchWeek').after('<div id="calendarLesson"></div>');
    $('#calendarLesson').weekCalendar(
    {
     date: new Date(dt)
    });
    tableWidth();
   }
  })
 })
}

function scheduleShowJudge(w, d, da, t, row, col)
{ //课表展示
 var clos = [];
 for(var i = 0; i < w.length; i++)
 { //一周日期
  t.push(w.eq(i).attr('d'));
 }
 if(d.code === 0)
 {
  for(var i = 0; i < da.length; i++)
  {
   var l = '';
   for(var j = 0; j < da[i].classInfo.length; j++)
   { //班级信息
    l += '<li class="clearfix"><span class="fl">' + da[i].classInfo[j].classesname + '</span><span class="fr">' + da[i].classInfo[j].stunum + '</span></li>';
   }
   $('.teacherArrangeC .wt-main').eq(i).find('.wt-left ul').html(l);
   //老师信息
   $('.teacherArrangeC .wt-main').eq(i).find('.wt-left dl').html('<dt tid="' + da[i].id + '">' + da[i].username + '</dt><dd class="clearfix"><span class="wt-phone fl">' + da[i].phone + '</span><span class="wt-teacherDet fr">' + da[i].grade + da[i].subject + '</span></dd>');
   //课表信息
   col.push([]);
   row.push([]);
   for(var j = 0; j < da[i].classList.length; j++)
   {
    for(var k = 0; k < t.length; k++)
    {
     if(da[i].classList[j].classdate === t[k])
     {
      col[i].push(k);
     }
    }
    for(var k = 0; k < timeRangeArr.length; k++)
    {
     if(da[i].classList[j].classtime === timeRangeArr[k])
     {
      row[i].push(k);
     }
    }
   }
   for(var j = 0; j < da[i].schedulings.length; j++)
   { //排班信息
    for(var k = 0; k < t.length; k++)
    {
     if(da[i].schedulings[j].sdate === t[k])
     {
      if(da[i].schedulings[j].shift === '0')
      {
       $('.teacherArrangeC .wt-main table').eq(i).find('tr:lt(7)').find('td:eq(' + k + ')').addClass('workTimeId');
      }
      else if(da[i].schedulings[j].shift === '1')
      {
       $('.teacherArrangeC .wt-main table').eq(i).find('tr:lt(9):gt(1)').find('td:eq(' + k + ')').addClass('workTimeId');
      }
      else if(da[i].schedulings[j].shift === '2')
      {
       $('.teacherArrangeC .wt-main table').eq(i).find('tr:lt(12):gt(4)').find('td:eq(' + k + ')').addClass('workTimeId');
      }
      else if(da[i].schedulings[j].shift === '3')
      {
       $('.teacherArrangeC .wt-main table').eq(i).find('tr:gt(5)').find('td:eq(' + k + ')').addClass('workTimeId');
      }
     }
    }
   }
   for(var j = 0; j < da[i].classList.length; j++)
   { //排课信息
    var cinfo = '';
    //标识有课
    $('.teacherArrangeC .wt-main table').eq(i).find('tr:eq(' + row[i][j] + ')').find('td:eq(' + col[i][j] + ')').addClass('hasClass').attr(
    {
     'lid': da[i].classList[j].id,
     'ctype': da[i].classList[j].classontype
    });
    if(da[i].classList[j].otwo === '0')
    { //线上
     $('.teacherArrangeC .wt-main table').eq(i).find('tr:eq(' + row[i][j] + ')').find('td:eq(' + col[i][j] + ')').addClass('One-on-one');
    }
    if(da[i].classList[j].classontype === '3' || da[i].classList[j].classontype === '4')
    { //请假
     $('.teacherArrangeC .wt-main table').eq(i).find('tr:eq(' + row[i][j] + ')').find('td:eq(' + col[i][j] + ')').addClass('leaveWork');
     cinfo = '<div class="leaving" title="' + da[i].classList[j].remarks + '">' + da[i].classList[j].remarks + '</div>';
    }
    else if(da[i].classList[j].classontype === '0')
    { //一对一
     if(da[i].classList[j].classtype === '2')
     { //加课
      cinfo = '<span class="One-on-one">一对一</span><i class="positionR zhushi"><img src="../images/jiake.png" width=14 alt="" /><img src="../images/zhushi.png" alt="" title="' + da[i].classList[j].remarks + '" width=14  /><span class="kbbz  ybbz">' + da[i].classList[j].remarks + '</span></i>';
     }
     else if(da[i].classList[j].classtype === '3')
     { //调课
      cinfo = '<span class="One-on-one">一对一</span><i class="positionR zhushi"><img src="../images/tiao.png" width=14 alt="" /><img src="../images/zhushi.png" title="' + da[i].classList[j].remarks + '" alt="" width=14  /><span class="kbbz  ybbz">' + da[i].classList[j].remarks + '</span></i>';
     }
     else if(da[i].classList[j].classtype === '1')
     { //常规课
     	if(da[i].classList[j].remarks){
     		if(col[i][j]===6){
     			cinfo = '<span class="One-on-one">一对一</span><i class="positionR zhushi"><img src="../images/zhushi.png" title="' + da[i].classList[j].remarks + '" alt="" width=14  /><span class="kbbz  ybbz" style="left:-240px;background-image:url(../images/beizhuMainR.png);" >' + da[i].classList[j].remarks + '</span></i>';	
     		}else{
     			cinfo = '<span class="One-on-one">一对一</span><i class="positionR zhushi"><img src="../images/zhushi.png" alt="" title="' + da[i].classList[j].remarks + '" width=14  /><span class="kbbz  ybbz" >' + da[i].classList[j].remarks + '</span></i>';	
     		}
     		
     	}else{
     		cinfo = '<span class="One-on-one">一对一</span>';
     	}      
     }
     if(da[i].classList[j].cancel === 1)
     { //取消排课
      cinfo = '<span class="One-on-one">一对一</span><i class="positionR zhushi"><img src="../images/jia.png" width=14 alt="" /><img src="../images/zhushi.png" alt="" width=14  /><span class="kbbz  ybbz">' + da[i].classList[j].remarks + '</span></i>';
      $('.teacherArrangeC .wt-main table').eq(i).find('tr:eq(' + row[i][j] + ')').find('td:eq(' + col[i][j] + ')').addClass('cancelClass');
     }
    }
    else if(da[i].classList[j].classontype === '1')
    { //班课
     if(da[i].classList[j].classtype === '2')
     { //加课
      cinfo = '<span class="One-on-one">班课</span><i class="positionR zhushi"><img src="../images/jiake.png" width=14 alt="" /><img src="../images/zhushi.png" alt="" width=14  /><span class="kbbz  ybbz">' + da[i].classList[j].remarks + '</span></i>';
     }
     else if(da[i].classList[j].classtype === '3')
     { //调课
      cinfo = '<span class="One-on-one">班课</span><i class="positionR zhushi"><img src="../images/tiao.png" width=14 alt="" /><img src="../images/zhushi.png" alt="" width=14  /><span class="kbbz  ybbz">' + da[i].classList[j].remarks + '</span></i>';
     }
     else if(da[i].classList[j].classtype === '1')
     { //常规课
      cinfo = '<span class="One-on-one">班课</span>';
     }
     if(da[i].classList[j].cancel === 1)
     { //取消排课
      cinfo = '<span class="One-on-one">班课</span><i class="positionR zhushi"><img src="../images/jia.png" width=14 alt="" /><img src="../images/zhushi.png" alt="" width=14  /><span class="kbbz  ybbz">' + da[i].classList[j].remarks + '</span></i>';
      $('.teacherArrangeC .wt-main table').eq(i).find('tr:eq(' + row[i][j] + ')').find('td:eq(' + col[i][j] + ')').addClass('cancelClass');
     }
    }
    else if(da[i].classList[j].classontype === '2')
    { //试听
     cinfo = '<span>试听</span>';
     $('.teacherArrangeC .wt-main table').eq(i).find('tr:eq(' + row[i][j] + ')').find('td:eq(' + col[i][j] + ')').addClass('oneOn');
    }
    $('.teacherArrangeC .wt-main table').eq(i).find('tr:eq(' + row[i][j] + ')').find('td:eq(' + col[i][j] + ')').html(cinfo);
    $('.leaving').outerWidth($('.teacherArrangeC .wt-main table').width() / 7 - 40);
   }
  }
  if(d.data.length < parseInt($('.weekTable  .layui-laypage-limits select').val()) || d.data.length < 10)
  {
   $('.teacherArrangeC .wt-main:lt(' + d.data.length + ')').show();
  }
  else
  {
   $('.teacherArrangeC .wt-main').show();
  }
 }
 setTimeout(function()
 {
  $('#classTablePage').show();
 }, 1000)
}

function timeJudge(t)
{ //排课时间判断
 var x = $('.weeks:visible').eq(t.index()).attr('d');
 var y = timeStartArr[t.parents('tr').index()];
 var d = new Date();
 var xy = (x + " " + y);
 var nd = new Date(xy);
 d = d.getTime();
 nd = nd.getTime();
 if(d <= nd)
 {
  return true;
 }
 else
 {
  return false
 }
}

function scheduleShowReload(key)
{ //重载课表
 layer.load(2);
 $.ajax(
 {
  type: 'post',
  dataType: 'json',
  url: 'teacherClass/queryTeacherClassInfo',
  data: key,
  success: function(d)
  {
   var da = d.data;
   var t = [];
   var w = $('.weeks:visible');
   var row = [];
   var col = [];
   layer.close(layer.index);
   $('.consum').html(d.count);
   scheduleShowJudge(w, d, da, t, row, col);
   tableWidth();
  }
 });
}

function scheduleFrame(l)
{ //插入课表结构
 var html = '';
 $('.scheduleFrame').empty();
 $('#classTablePage').hide();
 for(var i = 0; i < l; i++)
 {
  html += '<div class="wt-main"><div class="wt-content clearfix"><div class="fl wt-left"><dl></dl><ul></ul></div><div class="fl wt-right clearfix"><ul class="fl"><li>08:00-09:00</li><li>09:00-10:00</li><li>10:10-11:10</li><li>11:10-12:10</li><li>12:50-13:50</li><li>13:50-14:50</li><li>15:00-16:00</li><li>16:00-17:00</li><li>17:30-18:30</li><li>18:30-19:30</li><li>19:40-20:40</li><li>20:40-21:40</li></ul><table class="fl"><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr></table></div></div></div>';
 }
 $('.scheduleFrame').html(html);
 tableWidth()
}

function submitTeachingSchedule(ct, cont, sdate, fr, cid, tid, sids, remarks, otwo)
{ //排课提交
 layer.load(2);
 $.ajax(
 {
  type: 'post',
  dataType: 'json',
  url: 'teacherClass/insertTeacherClass',
  data:
  {
   ct: $('.scheduleType:visible input:checked').val(),
   cont: $('.typeSchedulC:visible').val().split('')[1],
   sdate: sdate,
   fr: fr,
   cid: cid,
   tid: tid,
   sids: sids,
   remarks: remarks,
   otwo: $('.typeSchedulC:visible').val().split('')[0]
  },
  success: function(d)
  {
   var da = d.data;
   layer.close(layer.index);
  }
 });
}

function schedulingStudentList(sdate, fr, otwo)
{ //排课学生列表
 layui.use('table', function()
 {
  var table = layui.table;
  table.render(
  {
   elem: '#studentList',
   url: 'teacherClass/queryCurrentTimeStu',
   page:
   { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
    layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'] //自定义分页布局
     //,curr: 5 //设定初始在第 5 页
     ,
    groups: 5 //只显示 1 个连续页码
     ,
    first: false //不显示首页
     ,
    last: false //不显示尾页
   },
   where:
   {
    sdate: sdate,
    fr: fr,
    otwo: otwo
   },
   id: 'studentList',
   skin: 'nob',
   cols: [
    [{ type: 'checkbox' }, { field: 'stuname', width: 120, title: '姓名' }, { field: 'phone', width: 150, title: '电话' }, { field: 'grade', width: 120, title: '年级' }, { field: 'weaksubjects', minWidth: 100, title: '科目' }]
   ],
   done: function(d)
   {
    $('#studentList+.layui-form .layui-table-header').remove();
    $('.checkSame:visible .layui-form-checkbox:first').trigger('click');
    var ccs = $('.createClassStuList');
    if(ccs.find('.studetChoosed li').length != 0)
    {
     var stcLi = ccs.find('.studetChoosed li');
     var stLef = ccs.find('.studentInforLeft');
     for(var i = 0; i < stcLi.length; i++)
     {
      for(var j = 0; j < stLef.find('.orderFuc').length; j++)
      {
       if(stcLi.eq(i).attr('stuid') === stLef.find('.stuname').attr('n') && stcLi.eq(i).attr('cid') === stLef.find('.orderFuc').eq(j).val())
       {
        stLef.find('.orderFuc').eq(j).attr('checked', true)
       }
      }
     }
    }
   }
  });
  //复选
  studentChecked(table)
  //状态重载
  $(document).off('click', '.studentListC .s_btn').on('click', '.studentListC .s_btn', function()
  {
   var type = $('.studentListC .s_btn').data('type');
   var stuname = $(".studentListC .stuName").val(),
    grade = $(".studentListC .grade").val(),
    weaksubjects = $(".studentListC .subjects").val();
   var key = {
    stuname: stuname,
    grade: grade,
    weaksubjects: weaksubjects
   };
   var active = {
    reload: function()
    {
     //执行重载
     table.reload('studentList',
     {
      page:
      {
       curr: 1 //重新从第 1 页开始
      },
      where: key
     });
    }
   };
   setTimeout(function()
   {
    active[type] ? active[type].call(this) : '';
   }, 10);
  });
 });
}

function schedulingClassList(sdate, fr, id, otwo)
{ //排课教室列表
 layui.use('table', function()
 {
  var table = layui.table;
  table.render(
  {
   elem: '#classList',
   url: 'teacherClass/queryCurrentTimeClass',
   page:
   { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
    layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'] //自定义分页布局
     //,curr: 5 //设定初始在第 5 页
     ,
    groups: 5 //只显示 1 个连续页码
     ,
    first: false //不显示首页
     ,
    last: false //不显示尾页
   },
   where:
   {
    sdate: sdate,
    fr: fr,
    otwo: otwo,
    id: id
   },
   id: 'classList',
   skin: 'nob',
   cols: [
    [{ type: 'checkbox' }, { field: 'classesname', minWidth: 120, title: '班级' }, { field: 'stunum', width: 80, title: '人数' }]
   ],
   done: function(d)
   {
    $('#classList+.layui-form .layui-table-header').remove();
    $('.checkSame:visible .layui-form-checkbox:first').trigger('click');
   }
  });
  //复选
  studentChecked(table)
  //状态重载
  $(document).off('click', '.classListC .s_btn').on('click', '.classListC .s_btn', function()
  {
   var type = $('.classListC .s_btn').data('type');
   var classesname = $(".classListC .className").val()
   var key = {
    classesname: classesname
   };
   var active = {
    reload: function()
    {
     //执行重载
     table.reload('classList',
     {
      page:
      {
       curr: 1 //重新从第 1 页开始
      },
      where: key
     });
    }
   };
   setTimeout(function()
   {
    active[type] ? active[type].call(this) : '';
   }, 10);
  });
 });
}
/*
 学生排课
  */
function scheduleShowStudent(id, otwo)
{
 layer.load(2);
 $.ajax(
 {
  type: 'post',
  dataType: 'json',
  url: 'arrangeClass/queryStuInfo',
  data:
  {
   //		page:0,
   //		limit:10,
   monday: $('.wc-day-1 .weeks:visible').attr('d'),
   sunday: $('.wc-day-7 .weeks:visible').attr('d'),
   sid: id,
   otwo: otwo
  },
  success: function(d)
  {
   layer.close(layer.index);
   var da = d.data;
   var t = [];
   var w = $('.weeks:visible');
   var row = [];
   var col = [];
   scheduleFrame(10);
   layer.close(layer.index);
   if(id === undefined)
   {
    layui.use('laypage', function()
    {
     var laypage = layui.laypage;
     //分页
     laypage.render(
     {
      elem: 'classTablePage',
      count: d.count,
      layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'],
      jump: function(obj)
      {
       scheduleFrame(obj.limit);
       var key = {
        page: obj.curr,
        limit: obj.limit,
        monday: $('.wc-day-1 .weeks:visible').attr('d'),
        sunday: $('.wc-day-7 .weeks:visible').attr('d'),
        username: $('#mystu_sear #stu_name').val(),
        grade: $('#mystu_sear .grade').val(),
        subject: $('#mystu_sear .subjects').val(),
        shift: $('#workType').val(),
        otwo: otwo
       }
       scheduleShowReloadStudent(key);
      }
     });
    });
   }
   $('#classTablePage').hide();
   scheduleShowJudgeStudent(w, d, da, t, row, col);
  }
 })
 $(document).off('click', '.studentArrangeC .wc-nav button').on('click', '.studentArrangeC .wc-nav button', function()
 { //排课表切换周重载
  var pag = $('.layui-laypage-curr em:last-child').html();
  if(pag === undefined)
  {
   pag = 1;
  }
  var dt = $('.studentArrangeC').find('.wt-left dt');
  var id = dt.length === 1 ? dt.attr('tid') : '';
  var key = {
   page: pag,
   limit: $('.layui-laypage-limits select').val(),
   monday: $('.wc-day-1 .weeks:visible').attr('d'),
   sunday: $('.wc-day-7 .weeks:visible').attr('d'),
   username: $('#mystu_sear #stu_name').val(),
   grade: $('#mystu_sear .grade').val(),
   subject: $('#mystu_sear .subjects').val(),
   shift: $('#workType').val(),
   sid: id,
   otwo: otwo
  }
  scheduleFrame($('.layui-laypage-limits select').val());
  scheduleShowReloadStudent(key);
 })
 $(document).off('click', '#calssSchedule').on('click', '#calssSchedule', function()
 { //排课表搜索重载
  layer.load(2);
  var dt = $('#mystu_sear .achivClendar').val();
  var oneDayTime = 24 * 60 * 60 * 1000;
  var MondayTime = '';
  var SundayTime = '';
  if(dt != '')
  {
   var nd = new Date(dt);
   var day = nd.getDay();
   nd = nd.getTime();
   //显示周一
   if(day === 0)
   {
    day = 7;
   }
   MondayTime = nd - (day - 1) * oneDayTime;
   //显示周日
   SundayTime = nd + (7 - day) * oneDayTime;
   MondayTime = timestampToData(MondayTime);
   SundayTime = timestampToData(SundayTime);
  }
  else
  {
   MondayTime = $('.wc-day-1 .weeks:visible').attr('d');
   SundayTime = $('.wc-day-7 .weeks:visible').attr('d');
  }
  var pag = $('.layui-laypage-curr em:last-child').html();
  if(pag === undefined)
  {
   pag = 1;
  }
  var key = {
   page: pag,
   limit: $('.layui-laypage-limits select').val(),
   monday: MondayTime,
   sunday: SundayTime,
   username: $('#mystu_sear #stu_name').val(),
   grade: $('#mystu_sear .grade').val(),
   subject: $('#mystu_sear .subjects').val(),
   shift: $('#workType').val(),
   otwo: otwo
  }
  $.ajax(
  { //搜索重载
   type: 'post',
   dataType: 'json',
   url: 'arrangeClass/queryStuInfo',
   data: key,
   success: function(d)
   {
    layer.close(layer.index);
    var da = d.data;
    var t = [];
    var w = $('.weeks:visible');
    var row = [];
    var col = [];
    scheduleFrame(10);
    layer.close(layer.index);
    layui.use('laypage', function()
    {
     var laypage = layui.laypage;
     //分页
     laypage.render(
     {
      elem: 'classTablePage',
      count: d.count,
      layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'],
      jump: function(obj)
      {
       scheduleFrame(obj.limit);
       var key = {
        page: obj.curr,
        limit: obj.limit,
        monday: MondayTime,
        sunday: SundayTime,
        username: $('#mystu_sear #stu_name').val(),
        grade: $('#mystu_sear .grade').val(),
        subject: $('#mystu_sear .subjects').val(),
        shift: $('#workType').val(),
        otwo: otwo
       }
       scheduleShowReloadStudent(key);
      }
     });
     $('#classTablePage').hide();
    });
    scheduleShowJudgeStudent(w, d, da, t, row, col);
    $('#calendarLesson').remove();
    $('.switchWeek').after('<div id="calendarLesson"></div>');
    $('#calendarLesson').weekCalendar(
    {
     date: new Date(dt)
    });
    tableWidth();
   }
  })
 })
}

function scheduleShowJudgeStudent(w, d, da, t, row, col)
{ //课表展示
 var clos = [];
 for(var i = 0; i < w.length; i++)
 { //一周日期
  t.push(w.eq(i).attr('d'));
 }
 if(d.code === 0)
 {
  for(var i = 0; i < da.length; i++)
  {
   var l = '';
   for(var j = 0; j < da[i].classList.length; j++)
   { //班级信息
    l += '<li class="clearfix"><span class="fl">' + da[i].classList[j].classesname + '</span><span class="fr">' + da[i].classList[j].stunum + '</span></li>';
   }
   $('.studentArrangeC .wt-main').eq(i).find('.wt-left ul').html(l);
   //合同信息	
   $('.studentArrangeC .wt-main').eq(i).find('.wt-left').attr('order', JSON.stringify(da[i].clist));
   //老师信息
   $('.studentArrangeC .wt-main').eq(i).find('.wt-left dl').html('<dt tid="' + da[i].id + '">' + da[i].stuname + '</dt><dd class="clearfix"><span class="wt-phone fl">' + da[i].phone + '</span><span class="wt-teacherDet fr">' + da[i].weaksubjects + '</span></dd>');
   //课表信息
   col.push([]);
   row.push([]);
   for(var j = 0; j < da[i].classnoteList.length; j++)
   {
    for(var k = 0; k < t.length; k++)
    {
     if(da[i].classnoteList[j].classdate === t[k])
     {
      col[i].push(k);
     }
    }
    for(var k = 0; k < timeRangeArr.length; k++)
    {
     if(da[i].classnoteList[j].classtime === timeRangeArr[k])
     {
      row[i].push(k);
     }
    }
   }
   for(var j = 0; j < da[i].classnoteList.length; j++)
   { //排课信息
    var cinfo = '';
    //标识有课
    $('.studentArrangeC .wt-main table').eq(i).find('tr:eq(' + row[i][j] + ')').find('td:eq(' + col[i][j] + ')').addClass('hasClass').attr(
    {
     'lid': da[i].classnoteList[j].id,
     'ctype': da[i].classnoteList[j].classontype
    });
    if(da[i].classnoteList[j].otwo === '0')
    { //线上
     $('.studentArrangeC .wt-main table').eq(i).find('tr:eq(' + row[i][j] + ')').find('td:eq(' + col[i][j] + ')').addClass('One-on-one');
    }
    if(da[i].classnoteList[j].classontype === '3' || da[i].classnoteList[j].classontype === '4')
    { //请假
     $('.studentArrangeC .wt-main table').eq(i).find('tr:eq(' + row[i][j] + ')').find('td:eq(' + col[i][j] + ')').addClass('leaveWork');
     cinfo = '<div class="leaving" title="' + da[i].classnoteList[j].remarks + '">' + da[i].classnoteList[j].remarks + '</div>';
    }
    else if(da[i].classnoteList[j].classontype === '0')
    { //一对一
     if(da[i].classnoteList[j].classtype === '2')
     { //加课
      cinfo = '<span class="One-on-one">一对一</span><i class="positionR zhushi"><img src="../images/jiake.png" width=14 alt="" /><img src="../images/zhushi.png" alt="" width=14  /><span class="kbbz  ybbz">' + da[i].classnoteList[j].remarks + '</span></i>';
     }
     else if(da[i].classnoteList[j].classtype === '3')
     { //调课
      cinfo = '<span class="One-on-one">一对一</span><i class="positionR zhushi"><img src="../images/tiao.png" width=14 alt="" /><img src="../images/zhushi.png" alt="" width=14  /><span class="kbbz  ybbz">' + da[i].classnoteList[j].remarks + '</span></i>';
     }
     else if(da[i].classnoteList[j].classtype === '1')
     { //常规课
      cinfo = '<span class="One-on-one">一对一</span>';
     }
     if(da[i].classnoteList[j].cancel === 1)
     { //取消排课
      cinfo = '<span class="One-on-one">一对一</span><i class="positionR zhushi"><img src="../images/jia.png" width=14 alt="" /><img src="../images/zhushi.png" alt="" width=14  /><span class="kbbz  ybbz">' + da[i].classnoteList[j].remarks + '</span></i>';
      $('.studentArrangeC .wt-main table').eq(i).find('tr:eq(' + row[i][j] + ')').find('td:eq(' + col[i][j] + ')').addClass('cancelClass');
     }
    }
    else if(da[i].classnoteList[j].classontype === '1')
    { //班课
     if(da[i].classnoteList[j].classtype === '2')
     { //加课
      cinfo = '<span class="One-on-one">班课</span><i class="positionR zhushi"><img src="../images/jiake.png" width=14 alt="" /><img src="../images/zhushi.png" alt="" width=14  /><span class="kbbz  ybbz">' + da[i].classnoteList[j].remarks + '</span></i>';
     }
     else if(da[i].classnoteList[j].classtype === '3')
     { //调课
      cinfo = '<span class="One-on-one">班课</span><i class="positionR zhushi"><img src="../images/tiao.png" width=14 alt="" /><img src="../images/zhushi.png" alt="" width=14  /><span class="kbbz  ybbz">' + da[i].classnoteList[j].remarks + '</span></i>';
     }
     else if(da[i].classnoteList[j].classtype === '1')
     { //常规课
      cinfo = '<span class="One-on-one">班课</span>';
     }
     if(da[i].classnoteList[j].cancel === 1)
     { //取消排课
      cinfo = '<span class="One-on-one">班课</span><i class="positionR zhushi"><img src="../images/jia.png" width=14 alt="" /><img src="../images/zhushi.png" alt="" width=14  /><span class="kbbz  ybbz">' + da[i].classnoteList[j].remarks + '</span></i>';
      $('.studentArrangeC .wt-main table').eq(i).find('tr:eq(' + row[i][j] + ')').find('td:eq(' + col[i][j] + ')').addClass('cancelClass');
     }
    }
    else if(da[i].classnoteList[j].classontype === '2')
    { //试听
     cinfo = '<span>试听</span>';
     $('.studentArrangeC .wt-main table').eq(i).find('tr:eq(' + row[i][j] + ')').find('td:eq(' + col[i][j] + ')').addClass('oneOn');
    }
    $('.studentArrangeC .wt-main table').eq(i).find('tr:eq(' + row[i][j] + ')').find('td:eq(' + col[i][j] + ')').html(cinfo);
    $('.leaving').outerWidth($('.studentArrangeC .wt-main table').width() / 7 - 40);
   }
  }
  //			if(d.count<10){
  //			$('.studentArrangeC .wt-main:lt('+d.count+')').show();
  //			}else{
  //				$('.studentArrangeC .wt-main table').show();
  //			}
  $('.studentArrangeC .wt-main:eq(0)').show();
 }
 setTimeout(function()
 {
  $('#classTablePage').show();
 }, 1000)
}

function scheduleShowReloadStudent(key)
{ //重载课表
 layer.load(2);
 $.ajax(
 {
  type: 'post',
  dataType: 'json',
  url: 'arrangeClass/queryStuInfo',
  data: key,
  success: function(d)
  {
   var da = d.data;
   var t = [];
   var w = $('.weeks:visible');
   var row = [];
   var col = [];
   layer.close(layer.index);
   scheduleShowJudgeStudent(w, d, da, t, row, col);
   tableWidth();
  }
 });
}

function submitStudentSchedule()
{ //学生排课提交
 $(document).off('click', '.scheduleBoxStu .save').on('click', '.scheduleBoxStu .save', function()
 {
  var st = $('.scheduleBoxStu  .teacherSche li'),
   arr = [];
  for(var i = 0; i < st.length; i++)
  {
   arr.push(st.eq(i).find('span').html())
  }
  var fr = $('#local').val(),
   uname = $('.scheduleBoxStu h2').attr('uname'),
   sid = $('.scheduleBoxStu h2').attr('sid'),
   od = $('.scheduleBoxStu input[type=radio]:checked').val(),
   sdate = JSON.stringify(arr)
  if($('.teacherSche li').length != 0 && fr != '')
  {
   $('.teacherListC').show();
   $('.curtain').show();
   $('.scheduleBoxStu').hide();
   $('.teacherListC').attr(
   {
    'od': od,
    'sdate': sdate,
    'sid': sid,
    'fr': fr
   });
   schedulingTeacherList(sdate, fr, uname);
  }
  else
  {
   layer.msg('请填写必填信息');
  }
 })
 $(document).off('click', '.teacherListC .save').on('click', '.teacherListC .save', function(e)
 { //教师列表提交
  var t = $(e.currentTarget);
  var tl = $('.teacherListC'),
   sid = tl.attr('sid'),
   sdate = tl.attr('sdate'),
   fr = tl.attr('fr'),
   tid = tl.attr('cid'),
   cid = tl.attr('od');
  layer.load(2);
  $.ajax(
  {
   type: 'post',
   dataType: 'json',
   url: 'arrangeClass/insertArrangeClass',
   data:
   {
    startdate: sdate,
    sid: sid,
    cid: cid,
    tid: tid,
    fr: fr,
    otwo: '0'
   },
   success: function(d)
   {
    layer.close(layer.index);
    layer.msg(d.msg);
    if(d.code === 1)
    {
     tl.hide();
     $('.scheduleBoxStu').hide();
     $('.curtain').hide();
     $('.scheduleBoxStu form').empty();
     scheduleShowStudent(sid, '0')
    }
   }
  });
 })
 $(document).off('click', '.teacherListC .cancel').on('click', '.teacherListC .cancel', function(e)
 {
  var t = $(e.currentTarget);
  $('.teacherListC').hide();
  $('.scheduleBoxStu').show();
 })
}
submitStudentSchedule();

function schedulingTeacherList(sdate, fr)
{ //学生排课老师列表
 layui.use('table', function()
 {
  var table = layui.table;
  table.render(
  {
   elem: '#teacherList',
   url: 'arrangeClass/queryStuTeachList',
   page:
   { //支持传入 laypage 组件的所有参数（某些参数除外，如：jump/elem） - 详见文档
    layout: ['limit', 'count', 'prev', 'page', 'next', 'skip'] //自定义分页布局
     //,curr: 5 //设定初始在第 5 页
     ,
    groups: 5 //只显示 1 个连续页码
     ,
    first: false //不显示首页
     ,
    last: false //不显示尾页
   },
   where:
   {
    sdate: sdate,
    fr: fr
   },
   id: 'teacherList',
   skin: 'nob',
   cols: [
    [{ type: 'checkbox' }, { field: 'username', width: 120, title: '姓名' }, { field: 'phone', width: 150, title: '电话' }, { field: 'grade', width: 100, title: '年级' }, { field: 'subject', width: 100, title: '科目' }]
   ],
   done: function(d)
   {
    $('#teacherList+.layui-form .layui-table-header').remove();
    $('.checkSame:visible .layui-form-checkbox:first').trigger('click');
   }
  });
  //复选
  studentChecked(table)
  //状态重载
  $(document).off('click', '.teacherListC .s_btn').on('click', '.teacherListC .s_btn', function()
  {
   var type = $('.teacherListC .s_btn').data('type');
   var key = {
    grade: $('.teacherListC .grade').val(),
    subject: $('.teacherListC .subjects').val(),
    username: $('.teacherListC .name').val()
   };
   var active = {
    reload: function()
    {
     //执行重载
     table.reload('teacherList',
     {
      page:
      {
       curr: 1 //重新从第 1 页开始
      },
      where: key
     });
    }
   };
   setTimeout(function()
   {
    active[type] ? active[type].call(this) : '';
   }, 10);
  });
 });
}

function classImg(table)//课时截图
{	
 table.on("tool(test)", function(d)
 {
  var da = d;
  var layeEvent = da.event;
  d = da.data;
  if(layeEvent === 'imgurl')
  {
   $('.curtain').show();
   var img = '<img src="' + d.imgurl + '" /><i class="iconfont icon-cuohao positionA" style="color: #666;height: 25px;width: 25px;text-align: center;font-size: 16px;border-radius: 50%;top: -5px;right: -8px;background: #fff;line-height: 25px;"></i>';
   $('.imgBox').html(img);
  }
 })
 $(document).off('click', '.imgBox .icon-cuohao').on('click', '.imgBox .icon-cuohao', function()
 {
  $('.imgBox').empty();
  $('.curtain').hide();
 })
}

function teacherInformation(){//教师信息
	var documents=$(document);
	documents.off('click','.teacherDetail,.Jump2[type=teacherDetail]').on('click','.teacherDetail,.Jump2[type=teacherDetail]',function(e){//查看教师信息
		var t=$(e.currentTarget),
			ibox=$('#idBOX');
		$.ajax({
			type:"post",
			url:"",
			dataType:'json',
			data:{
				userid:t.attr('userid')?t.attr('userid'):$('#idBOX').val()
			},
			success:function(d){
				var c=d.data,
				    str="";
				layer.msg(d.msg);
				if(d.code===1){				
					str='<div class="order teacherDetailBox formHide bombBox" uid="'+c.uid+'"><div class="stuInfTitle"><h2>个人资料</h2></div><div class="stuInfForm"><form action="" method="post"><div class="clearfix"><label for="" class="fl required">姓名</label><p class="fl">'+c.stuname+'</p></div><div class="clearfix"><div class="fl clearfix" style="margin-right:100px"><label for="" class="fl required">授课年级</label><p class="fl">'+c.grade+'</p></div><div class="fl clearfix"><label for="" class="fl required">授课学科</label><p class="fl">'+c.subject+'</p></div></div><div class="clearfix"><label for="" class="fl required">工作类型</label><p class="fl">'+c.wtype+'</p></div><div class="clearfix"><label for="" class="fl required">手机号</label><p class="fl">'+c.phone+'</p></div><div class="clearfix"><label for="" class="fl required">紧急联系电话</label><p class="fl">'+c.jphone+'</p></div><div class="clearfix"><label for="" class="required" style="display:block"><i class="xh">*</i>教师风格&amp;个人标签</label><input type="text" value='+c.teacherStyle+' class="teacherStyle" style="width:300px"></div><div class="clearfix"><label for="" class="required" style="display:block"><i class="xh">*</i>教师优势/擅长</label><textarea name="" rows="" class="teacherAdvantage" cols="2" style="width:300px;border-radius:3px">'+c.teacherAdvantage+'</textarea></div><div class="stuInfFoot clearfix"><div class="fr clearfix"><button type="button" class="fl cancel OptBtn">取消</button> <button type="button" class="fl save OptBtn">保存</button></div></div></form></div></div>';
					$('#mainC').append(str);
					if(ibox.attr('range')==='1'||ibox.attr('range')==='2'){
						$('.teacherStyle,.teacherAdvantage').attr('readonly',true);
					}
				}
			}
		});
	});
	
	documents.off('click','.teacherDetailBox .save').on('click','.teacherDetailBox .save',function(e){//提交教师信息
		var t=$(e.currentTarget),
			tdb=$('.teacherDetailBox'),
			ts=$('.teacherStyle'),
			ta=$('.teacherAdvantage');
		layer.load('2');
		$.ajax({
			type:"post",
			url:"",
			dataType:'json',
			data:{
				userid:tdb.attr('userid'),
				teacherStyle:ts.attr('userid'),
				teacherAdvantage:ta.attr('userid')
			},
			success:function(d){
				var c=d.data,
				    str="";
				layer.close(layer.index);
				layer.msg(d.msg);
				if(d.code===1){
					tdb.remove();
				}
			}
		});
	});
	
	documents.off('click','.teacherDetailBox .save').on('click','.teacherDetailBox .save',function(e){//教师信息取消
		var tdb=$('.teacherDetailBox');  
			tdb.remove();
	});	
}

function studentDataSummary(x,yo,y,qf,m){//学生数据汇总
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
            name:y,
            min:0,
            max:100,
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
            color:['#FD625B'],
             markPoint : {
                data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                ]
            }
        }
    ]
};
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);	
}

function studentAuditionDataOnline(){
	var documents=$(document);
	documents.off('click','#studentDataBtn').on('click','#studentDataBtn',function(e){
		var t=$(e.currentTarget),
			table=$('#mystu_table~.layui-form,.searchF,#eReport'),
			detail=$('.studentDataDetail,.searchS');			
			if(t.html()==="查看详细数据"){
				t.html('返回数据统计');
				table.hide();
				detail.show();
			}else{
				t.html('查看详细数据');
				table.show();
				detail.hide();
			}
			
	})
	
}
