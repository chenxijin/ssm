var lnav = {}, //导航
 mainC = $("#mainC"),
 main = $("#main"),
 clk = 'click',
 lnavCtr = $('#lnavControl');
lnav.jump = '.Jump',
 lnav.twoRange = $('.twoRange'),
 lnav.allClick = $('#lnavMain>ul>li');
lnav.clk = function()
{ //左导航跳转
 var p = 'icon-jiahao',
  d = 'icon-minus-bold',
  c = 'lnavCur',
  pd = '.iconjz',
  table = '#mystu_table',
  r2 = $('.tableLoad'),
  jump = '.Jump',
  jump_2 = '.Jump2';

 function jumpHtml(e, range)
 { //载入页面		
  e.stopPropagation();
  mainC.load(range, function(response, status, xhr)
  {
   main.addClass('opacityShow');
   $('input:not([autocomplete]),textarea:not([autocomplete]),select:not([autocomplete])').attr('autocomplete', 'off'); //关闭表单自动填充
// $('.achivClendar').attr('readonly', true); //日历只读
   if(status != 'success')
   {
    window.location.reload();
   }
  });
 }

 function jumpStyle(that)
 { //跳转样式
  that.addClass(c).find(pd).addClass(d).removeClass(p);
  that.siblings('li').removeClass(c).find(pd).addClass(p).removeClass(d);
 }
 if($(jump).eq(0).attr('p') === '') //初始载入	
 {
  mainC.load($(jump).eq(0).find(jump_2).eq(0).attr('p'), function(response, status, xhr)
  {
   main.addClass('opacityShow');
   if(status != 'success')
   {
    window.location.reload();
   }
  });
 }
 else
 {
  mainC.load($(jump).eq(0).attr('p'), function(response, status, xhr)
  {
   main.addClass('opacityShow');
   if(status != 'success')
   {
    window.location.reload();
   }
  });
 }
 $(document).off(clk, jump).on(clk, jump, function(e)
 { //点击载入
  var target = $(e.currentTarget),
   that = target,
   r2 = that.attr('p'),
   rangeTwo = '.range_2';
  $('#studentCard').hide();
  if(r2 === '')
  {
   var d = that.attr('data-jump');
   jumpStyle(that);
   $(rangeTwo).slideUp(200);
   $('.twoRange').attr('data-jump', '0');
   if(d == '0')
   {
    that.find(rangeTwo).slideDown(200);
    that.attr('data-jump', '1');
    that.find(pd).addClass(d).removeClass(p);
   }
   else
   {
    that.find(rangeTwo).slideUp(200);
    that.attr('data-jump', '0');
    that.find(pd).addClass(p).removeClass(d);
   }
  }
  else
  {
   main.removeClass('opacityShow');
   jumpStyle(that);
   jumpHtml(e, r2);
  }
 });
 $(document).off(clk, jump_2).on(clk, jump_2, function(e)
 { //二级导航载入
  var target = $(e.currentTarget);
  $('#studentCard').hide();
  r2 = target.attr('p');
  e.stopPropagation();
  $('.Jump2').removeClass('redFont');
  target.addClass('redFont');
  if(r2.indexOf('/') != -1)
  {
   main.removeClass('opacityShow');
   jumpHtml(e, r2);
  }
 });
};
lnav.byCtr = function()
{ //全屏控制
 var ar = 'toArrow',
  tl = 'tranleft',
  movel = $("#lnav,#main");
 lnavCtr.on('click', function()
 {
  if($('.' + ar).length != 0)
  {
   $(this).removeClass(ar);
   movel.removeClass(tl);
  }
  else
  {
   $(this).addClass(ar);
   movel.addClass(tl);
  }
  $('.tab_current').trigger('click');
 })
}
lnav.tab = function(stutab, tableName)
{ //选项卡切换
 url = 'menu/';
 stutab.find('li').on(clk, function()
 {
  var i = $(this).index();
  $('#studentCard').hide();
  main.removeClass('opacityShow');
  $(this).addClass('tab_current').siblings().removeClass('tab_current');
  mainC.empty().load(url + tableName[i], function(response, status, xhr)
  {
   main.addClass('opacityShow');
   $('input:not([autocomplete]),textarea:not([autocomplete]),select:not([autocomplete])').attr('autocomplete', 'off'); //关闭表单自动填充
// $('.achivClendar').attr('readonly', true); //日历只读  
   if(status != 'success')
   {
    window.location.reload();
   }
  });
 });
}
function mySelect(examine, examineDet, examineDetli)
{ //自定义下拉框
 $(document).off('click', examine).on('click', examine, function(e)
 {
  var t = $(e.currentTarget);
  if(t.attr('data-slide') == '0')
  {
   t.find(examineDet).slideDown('fast');
   t.attr('data-slide', '1');
  }
  else if(t.attr('data-slide') == '1')
  {
   t.find(examineDet).slideUp('fast');
   t.attr('data-slide', '0');
  }
 });
 $(document).off('click', examineDetli).on('click', examineDetli, function(e)
 {
  var t = $(e.currentTarget);
  e.stopPropagation();
  t.parent(examineDet).siblings('span').html(t.html()).attr('status', t.attr('status'));
  t.parent(examineDet).slideUp('fast');
  t.parents(examine).attr('data-slide', '0');
 })
}
$(document).mouseup(function(e)
{ //点击空白关闭
 var e = e.target;
 var t = $('.examineDet li');
 var tp = $('.examineDet');
 var tpp = $('.examine');
 var allot = $('.allotBox');
 var se = $('.serStuState');
 var ser = $('.serviceStatus');
 if(!t.is(e) && !tp.is(e) && !tpp.is(e) && !allot.is(e) && t.has(e).length === 0 && tp.has(e).length === 0 && tpp.has(e).length === 0 && allot.has(e).length === 0)
 {
  t.parent().slideUp('fast');
  t.parents('.examine').attr('data-slide', '0');
  allot.slideUp('fast');
 }
 if(!se.is(e) && !ser.is(e) && se.has(e).length === 0 && ser.has(e).length === 0)
 {
  se.hide();
  ser.attr('c', '0');
  ser.find('.icon-xiaosanjiao').removeClass('trans');
 }
})

function getFormJson(form)
{ //表单序列化为对象
 var o = {};
 var a = $(form).serializeArray();
 $.each(a, function()
 {
  if(o[this.name] !== undefined)
  {
   if(!o[this.name].push)
   {
    o[this.name] = [o[this.name]];
   }
   o[this.name].push(this.value || '');
  }
  else
  {
   o[this.name] = this.value || '';
  }
 });
 return o;
}

function dataUde(d)
{ //数据未定义
 if(d === undefined)
 {
  d = 0;
  return d;
 }
 else
 {
  return d;
 }
}

function turnNull(d)
{ //null转空串
 if(d === null)
 {
  d = "";
  return d;
 }
 else
 {
  return d;
 }
}

function checkNulls(d)
{ //检测数据null
 for(var key in d)
 {
  if(d[key] === null)
  {
   d[key] = "";
  }
 }
 return d
}

function searchReload(table, key, type)
{ //表格重载
 var active = {
  reload: function()
  {
   //执行重载
   table.reload('tableStu_1',
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
 $('#studentCard').hide();
}

function searchReload2(table, key, type)
{ //表格重载
 var active = {
  reload: function()
  {
   //执行重载
   table.reload('tableStuCard',
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
}

function addEarnSeatList(t)
{ //个人业绩添加坐席
 var str = '';
 var arr = [];
 var d = $('#seatChoice ul li');
 for(var i = 0; i < d.length; i++)
 {
  arr.push(d.eq(i).attr('uid'));
 }
 if(t.hasClass('allCheck'))
 {
  var d = t.parent('span').siblings('ul').find('.seatIdCon');
  for(var i = 0; i < d.length; i++)
  {
   if(JSON.stringify(arr).indexOf(d.eq(i).attr('uid')) === -1)
   {
    str += '<li class="fl positionR"  uid=' + d.eq(i).attr('uid') + '>' + d.eq(i).html() + '<i class="iconfont icon-guanbi1"></i></li>';
    arr.push(d.eq(i).attr('uid'));
   }
  }
 }
 else
 {
  var m = t.siblings('span').html();
  var id = t.siblings('span').attr('uid');
  if(JSON.stringify(arr).indexOf(id) === -1)
  {
   str = '<li class="fl positionR"  uid=' + id + '>' + m + '<i class="iconfont icon-guanbi1"></i></li>';
   arr.push(id);
  }
 }
 $('#seatChoice ul').append(str);
}

function myCheckBox()
{ //自定义复选框
 $(document).off('click', '.checkCont').on('click', '.checkCont', function(e)
 {
  var t = $(e.target);
  if(t.attr('data-chec') === '0')
  {
   t.addClass('checkCur');
   t.attr('data-chec', '1');
   if(t.parents('#teamMan').length != 0)
   {
    addEarnSeatList(t);
   }
  }
  else
  {
   t.removeClass('checkCur');
   t.attr('data-chec', '0');
  }
 })
 $(document).off('click', '.allCheck').on('click', '.allCheck', function(e)
 {
  var t = $(e.target);
  var mycheck = $('.checkCont');
  if(t.attr('data-chec') === '0')
  {
   mycheck.addClass('checkCur');
   mycheck.attr('data-chec', '1');
   t.addClass('checkCur');
   t.attr('data-chec', '1');
   if(t.parents('#teamMan').length != 0)
   {
    addEarnSeatList(t);
   }
  }
  else
  {
   mycheck.removeClass('checkCur');
   mycheck.attr('data-chec', '0');
   t.removeClass('checkCur');
   t.attr('data-chec', '0');
  }
 })
 $(document).off('click', '#seatChoice .icon-guanbi1').on('click', '#seatChoice .icon-guanbi1', function(e)
 {
  var t = $(e.target);
  t.parents('li').remove();
 })
}
//时间戳转时间格式
function timestampToTime(timestamp)
{
 var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
 Y = date.getFullYear() + '-';
 M = date.getMonth() + 1;
 D = date.getDate();
 h = date.getHours();
 m = date.getMinutes();
 //      s = date.getSeconds();
 M = checkZeroS(M) + '-';
 D = checkZeroS(D) + ' ';
 h = checkZeroS(h) + ':';
 m = checkZeroS(m);
 return Y + M + D + h + m;
}

function timestampToData(timestamp)
{
 var date = new Date(timestamp); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
 Y = date.getFullYear() + '-';
 M = date.getMonth() + 1;
 D = date.getDate();
 M = checkZeroS(M) + '-';
 D = checkZeroS(D);
 return Y + M + D;
}
//时间格式加零
function checkZeroS(d)
{
 if(d < 10)
 {
  d = '0' + d;
  return d;
 }
 else
 {
  return d;
 }
}
$(document).off('click', '.nameDetail span').on('click', '.nameDetail span', function(e)
{//学生卡
 var t = $(e.currentTarget);
 layer.load(2);
 $.ajax(
 {
  type: 'post',
  dataType: 'json',
  url: 'afterSaleManage/card/BasicInformation',
  data:
  {
   stuid: t.attr('sid')
  },
  success: function(d)
  {
   var c = d.data;
   layer.close(layer.index);
   c = checkNulls(c);
   c.usertable = checkNulls(c.usertable);
   c.birthday = c.birthday.length === 0 ? "" : c.birthday;
   c.usertable = c.usertable.length === 0 ? "" : c.usertable.username;
   if(d.code === 0)
   {
    var navT = '<li class="fl" key="editStuInfor"><i class="iconfont icon-bianjiziliao"></i><span>编辑资料</span></li><li class="fl" key="addOrder"><i class="iconfont icon-hetong"></i><span>新增合同</span></li><li class="fl" key="upload" id="containerCard" ><span id="selectfilesCard"><i class="iconfont icon-shangchuan"></i><span>上传附件</span></span></li><li class="fl" key="addGoals"><i class="iconfont icon-prize"></i><span>录入成绩</span></li><li class="fl" key="remark"><i class="iconfont icon-lianxibeizhu"></i><span>联系备注</span></li><li class="fl" key="transfer"><i class="iconfont icon-yijiaokefu"></i><span>移交客服</span></li><li class="fl positionR" key="teachingPlan"><i class="iconfont icon-jiaoxuejilu"></i><span>教学记录</span><ul class="positionA teachingPlanDet" style="display:none"><li key="learnDiscuss">教学讨论会</li><li key="feedback">课后反馈</li><li key="pageAnalysis">试卷分析</li></ul></li>',
     navL = '<li s="stuInfor">基本信息</li><li s="orderInfor">合同信息</li><li s="classInfor">排课信息</li><li s="classhour">课时消耗</li><li s="stepRemark">跟进记录</li><li s="audition">试听记录</li><li s="goalList">成绩列表</li><li s="enclosureInfor">附件信息</li><li s="teachingInfor">教学信息</li>',
     ib = $('#idBOX');
    if(ib.attr('dep') === '7')
    {
     if(t.attr('notran') === '1')
     {
      navT = '<li class="fl" key="editStuInfor"><i class="iconfont icon-bianjiziliao"></i><span>编辑资料</span></li><li class="fl" key="addOrder"><i class="iconfont icon-hetong"></i><span>新增合同</span></li><li class="fl" key="upload" id="containerCard" ><span id="selectfilesCard"><i class="iconfont icon-shangchuan"></i><span>上传附件</span></span></li><li class="fl" key="remark"><i class="iconfont icon-lianxibeizhu"></i><span>联系备注</span></li>';
     }
     else
     {
      navT = '<li class="fl" key="editStuInfor"><i class="iconfont icon-bianjiziliao"></i><span>编辑资料</span></li><li class="fl" key="addOrder"><i class="iconfont icon-hetong"></i><span>新增合同</span></li><li class="fl" key="upload" id="containerCard" ><span id="selectfilesCard"><i class="iconfont icon-shangchuan"></i><span>上传附件</span></span></li><li class="fl" key="remark"><i class="iconfont icon-lianxibeizhu"></i><span>联系备注</span></li><li class="fl" key="transfer"><i class="iconfont icon-yijiaokefu"></i><span>移交客服</span></li>';
     }
    }
    else if(ib.attr('dep') === '8')
    {
     navT = '<li class="fl" key="addOrder"><i class="iconfont icon-hetong"></i><span>新增合同</span></li><li class="fl" key="upload" id="containerCard" ><span id="selectfilesCard"><i class="iconfont icon-shangchuan"></i><span>上传附件</span></span></li><li class="fl" key="addGoals"><i class="iconfont icon-prize"></i><span>录入成绩</span></li><li class="fl" key="remark"><i class="iconfont icon-lianxibeizhu"></i><span>联系备注</span></li><li class="fl positionR" key="teachingPlan"><i class="iconfont icon-jiaoxuejilu"></i><span>教学记录</span><ul class="positionA teachingPlanDet" style="display:none"><li key="learnDiscuss">教学讨论会</li><li key="feedback">课后反馈</li><li key="pageAnalysis">试卷分析</li></ul></li>'
    }
    else if(ib.attr('dep') === '6')
    {
     navT = '<li class="fl" key="upload" id="containerCard" ><span id="selectfilesCard"><i class="iconfont icon-shangchuan"></i><span>上传附件</span></span></li><li class="fl" key="addGoals"><i class="iconfont icon-prize"></i><span>录入成绩</span></li><li class="fl positionR" key="teachingPlan"><i class="iconfont icon-jiaoxuejilu"></i><span>教学记录</span><ul class="positionA teachingPlanDet" style="display:none"><li key="learnDiscuss">教学讨论会</li><li key="feedback">课后反馈</li><li key="pageAnalysis">试卷分析</li></ul></li>'
    }
    $('#studentCard').html('<div id="studentCardTbtn" class="clearfix positionA"><div class="fl sctUserWrap clearfix"><i class="iconfont icon-boshi fl" style="position: relative;top:3px;left:-2px;font-size:14px"></i><div class="sctNameWrap fl"><span class="sctName" sid="' + c.id + '" sex="' + c.sex + '" grade="' + c.grade + '" school="' + c.school + '">' + c.stuname + '</span> <span class="sctPhone">15665659696</span></div></div><ul class="fl sctNavMain">' + navT + '</ul><i class="iconfont icon-cuohao positionA" style="top:20px;right:24px;color:#fd625b;font-size:22px;"></i></div><nav id="studentCardLnav" class="positionA"><ul class="sclNavMain" id="scardLeftNav">' + navL + '</ul></nav><div id="studentCardShow"></div><!--录入成绩--><div class="order recordEntry bombBox formHide"></div><div id="studentCardShowAnother"></div><div id="studentCardShowOperation" style="display:none"><div class="textAnalysis positionR"><h2><input type="text" placeholder="请输入标题"></h2><div class="testAnalysisMain positionR"><ul class="clearfix testAnalysishead"><li class="fl" style="width:35%">涉及知识点</li><li class="fl" style="width:25%">常考题型</li><li class="fl" style="width:20%">掌握程度</li><li class="fl" style="width:20%">试卷未考到知识点</li></ul><div class="clearfix testAnalysisContent"><div class="testAnalysisBlock clearfix positionR"><div class="fl testTitleLeft" style="width:10%"><textarea name="" rows="2" cols="12" style="resize:none" placeholder="请输入"></textarea></div><div class="fl testMainRight" style="width:90%"><ul class="clearfix"><li class="fl" style="width:30%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li><li class="fl" style="width:30%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li><li class="fl" style="width:20%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li><li class="fl" style="width:20%"><input type="" name="" id="" placeholder="请输入" value="" style="width:90%;height:40px"></li></ul></div><div class="delRow del positionA" style="bottom:4px;right:36px"><i class="iconfont icon-minus-bold"></i></div><div class="plusRow plus positionA" style="bottom:4px;right:6px"><i class="iconfont icon-jiahao"></i></div></div></div><div class="plusCol plus positionA" style="bottom:-38px;left:0"><i class="iconfont icon-jiahao"></i></div><div class="delCol del positionA" style="bottom:-38px;left:30px"><i class="iconfont icon-minus-bold"></i></div></div><div class="testAnalysisBtn"><button type="button" class="cancelA">取消</button> <button type="button" class="save">保存</button></div></div></div><script src="js/cc_scard.js"></script><script src="js/plupload.full.min.js"></script><script src="js/uploadScard.js"></script>').show();
    var html1 = '<div id="scStudentInforWrap"><ul class="clearfix" id="scStudentInfor"><li class="fl"><dl class="clearfix"><dt class="fl">姓名</dt><dd class="fl">' + c.stuname + '</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">年级</dt><dd class="fl">' + c.grade + '</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">班主任</dt><dd class="fl">' + c.usertable + '</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">性别</dt><dd class="fl">' + c.sex + '</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">科目</dt><dd class="fl">',
     html2 = '',
     html3 = '</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">学员状态</dt><dd class="fl">' + c.stustatus + '</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">手机号</dt><dd class="fl">' + c.phone + '</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">学校</dt><dd class="fl">' + c.school + '</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">导入学员时间</dt><dd class="fl">' + c.inputtime + '</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">年龄</dt><dd class="fl">' + c.age + '</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">地区</dt><dd class="fl">' + c.address + '</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">麦克风/耳机</dt><dd class="fl">' + c.microphone + '</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">生日</dt><dd class="fl">' + c.birthday + '</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">联系人</dt><dd class="fl">' + c.guardian + '</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">学习态度</dt><dd class="fl">' + c.learnattitude + '</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">推荐人</dt><dd class="fl">' + c.referee + '</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">联系电话</dt><dd class="fl">' + c.referee + '</dd></dl></li><li class="fl"><dl class="clearfix"><dt class="fl">备注</dt><dd class="fl">' + c.remark + '</dd></dl></li></ul></div>';
    c.weaksubjects = c.weaksubjects.split('|');
    for(var i = 0; i < c.weaksubjects.length; i++)
    {
     if(c.weaksubjects[i] != "")
     {
      c.weaksubjects[i] = c.weaksubjects[i].split(',');
      html2 += '<span>' + c.weaksubjects[i][0] + "&nbsp;" + c.weaksubjects[i][1] + "&nbsp;" + c.weaksubjects[i][2] + '&nbsp;&nbsp;</span>';
     }
    }
    $('#studentCardShow').html(html1 + html2 + html3);
    $('.sctNavMain li[key="addOrder"]').attr(
    {
     'sid': $('.sctName').attr('sid'),
     'sname': $('.sctName').html(),
     'sgrade': $('.sctName').attr('grade')
    })
   }
   $('#main').scrollTop($('#studentCard').offset().top);
  }
 })
})
//文本域输入字数限制255
function limitTextNum()
{
 $(document).off('input porpertychanger', '.note textarea').on('input porpertychanger', '.note textarea', function(e)
 {
  var t = $(e.currentTarget);
  if(t.val().length > 255)
  {
   layer.msg('输入文字数超限制');
   t.val(t.val().slice(0, 255));
  }
 })
}
limitTextNum();
mySelect('.examine', '.examineDet' ,'.examineDet li'); //自定义下拉框
lnav.clk();//左道航跳转
lnav.byCtr();//全屏控制
myCheckBox();//自定义复选框