/*客服*/
function switchStatus()
{ //切换状态
 $(document).off('click', '.serviceStatus').on('click', '.serviceStatus', function(e)
 {
  var t = $(e.currentTarget),
   c = t.attr('c'),
   tri = t.find('.icon-xiaosanjiao'),
   ser = $('.serStuState'),
   s = $('.serStuState li');
  ser.hide();
  ser.parents('.serStuStateWrap').find('.serviceStatus').attr('c', '0');
  ser.parents('.serStuStateWrap').find('.icon-xiaosanjiao').removeClass('trans');
  if(c === undefined || c === '0')
  {
   s.removeClass('redFont');
   for(var i = 0, l = s.length; i < l; i++)
    if(s.eq(i).html() === t.find('span').text()) s.eq(i).addClass('redFont');
   tri.addClass('trans');
   t.parent('div').siblings('ul').show();
   t.attr('c', '1');
  }
  else
  {
   t.attr('c', '0');
   tri.removeClass('trans');
   t.parent('div').siblings('ul').hide();
  }
 })
 $(document).off('click', '.serStuState li').on('click', '.serStuState li', function(e)
 {
  var t = $(e.currentTarget),
   st = t.parents('.serStuStateWrap').find('.serviceStatus'),
   id = st.attr('sid'),
   tri = st.find('.icon-xiaosanjiao'),
   s = t.attr('s');
  layer.load(2);
  $.ajax(
  {
   url: 'student/updateStuStatus',
   type: 'post',
   dataType: 'json',
   data:
   {
    id: id,
    stustatus: s
   },
   success: function(d)
   {
    var da = d;
    d = da.data;
    layer.close(layer.index);
    if(da.code === 1)
    {
     st.attr(
     {
      'c': '0',
      'class': 'serviceStatus'
     });
     tri.removeClass('trans');
     st.parent('div').siblings('ul').hide();
     if(s === '6')
     {
      st.addClass('executing').find('span').html('执行中');
     }
     else if(s === '13')
     {
      st.addClass('warning').find('span').html('预警一级');
     }
     else if(s === '14')
     {
      st.addClass('warning').find('span').html('预警二级');
     }
     else if(s === '15')
     {
      st.addClass('warning').find('span').html('预警三级');
     }
     else if(s === '16')
     {
      st.addClass('closed').find('span').html('停课');
     }
     else if(s === '17')
     {
      st.addClass('class-ending').find('span').html('结课');
      $('.tab_current').trigger('click');
     }
    }
   }
  })
 })
}
function listMargin(n, l)
{//末尾去margin
 var l = $(l);
 for(var i = 0; i < l.length; i++)
 {
  if((i + 1) % n === 0 && i != 0)
  {
   l.eq(i).css(
   {
    'margin-right': 0
   })
  }
 }
}
function previewOrd(t)
{//合同预览对齐
 var t = $(t);
 for(var i = 0; i < t.length; i++)
 {
  var l = -(t.eq(i).parents('li').position().left + 1);
  t.eq(i).css(
  {
   left: l
  })
 }
}

function refund()
{//退费
 $(document).off('click', '.refundBoxBtn').on('click', '.refundBoxBtn', function(e)
 {
  var t = $(e.currentTarget),
   r = $('.refund h2');
  layer.load(2);
  orderConType('0', t);
  r.attr('sid', t.attr('sid'));
 })

 function orderConType(a, t)
 {//加载顶导航
  $.ajax(
  {
   url: 'contract/queryContractByUserid',
   type: 'post',
   dataType: 'json',
   data:
   {
    stuid: t.attr('sid')
   },
   success: function(d)
   {
    var da = d,
     str = ''
    d = da.data;
    layer.close(layer.index);
    if(da.code === 1)
    {
     var ind = 1;
     for(var i = 0; i < d.length; i++)
     {
      if(d[i].contype === a)
      {
       str += '<li class="fl" oid="' + d[i].id + '">合同' + ind + ' <img src="images/arrowT.png" style="top:37px;left:27px;display:none" class="positionA"></li>';
       // <div class="previewOrder positionA"><h2>原合同</h2><div><dl class="clearfix"><dt class="fl">姓名/年级</dt><dd class="fl"><span style="margin-right:35px">'+d[i].stuname+'</span><span>'+onGrade(d[i])+'</span></dd></dl></div><div class="clearfix"><dl class="clearfix fl"><dt class="fl">签约类型</dt><dd class="fl">'+d[i].conkind+'</dd></dl><dl class="clearfix fl"><dt class="fl">合同编号</dt><dd class="fl">'+d[i].cnumber+'</dd></dl></div><div><dl class="clearfix"><dt class="fl">签约日期</dt><dd class="fl">'+timestampToTime(d[i].ctime)+'</dd></dl></div><div class="clearfix"><dl class="clearfix fl"><dt class="fl">签约课时</dt><dd class="fl">'+d[i].couersum+'</dd></dl><dl class="clearfix fl"><dt class="fl">赠送课时</dt><dd class="fl">'+d[i].freesum+'</dd></dl></div><div class="clearfix"><dl class="clearfix fl"><dt class="fl">现单价</dt><dd class="fl"><span>￥'+d[i].forprice+'</span><br><span>￥'+d[i].perprice+'</span></dd></dl><dl class="clearfix fl"><dt class="fl">总价</dt><dd class="fl">￥'+d[i].allprice+'</dd></dl></div><div><dl class="clearfix"><dt class="fl">支付方式</dt><dd class="fl"><span>'+d[i].paytype+'</span><br><span>￥'+d[i].accountnum+'</span></dd></dl></div></div>
       ind++;
      }
     }
     $('.orderDetNav ul').html(str);
    }
   }
  })
 }
 $(document).off('click', '.orderTypeNav li').on('click', '.orderTypeNav li', function(e)
 { //退费-左导航
  var t = $(e.currentTarget),
   l = $('.orderTypeNav li'),
   h = $('.refund h2'),
   u = $('.orderDetNav ul');
  u.empty();
  l.removeClass('redFont');
  for(var i = 0; i < l.length; i++)
  {
   if(l.eq(i).is(t))
   {
    t.addClass('redFont');
    orderConType(i.toString(), h);
   }
  }
 })
 $(document).off('click', '.orderDetNav li').on('click', '.orderDetNav li', function(e)
 { //退费-顶导航
  var t = $(e.currentTarget),
   s = $('.refundTypeC');
  t.addClass('Identification').siblings().removeClass('Identification red');
  t.siblings('li').find('.contractSettlement,img').hide();
  var ifi = $('.Identification');
  if((!t.hasClass('red') || t.hasClass('redBc')))
  {
   layer.load(2);
   $.ajax(
   {
    url: 'contract/queryContractIsfinish',
    type: 'post',
    dataType: 'json',
    data:
    {
     id: t.attr('oid')
    },
    success: function(d)
    {
     var da = d;
     d = da.data;
     layer.close(layer.index);
     if(da.code === 1)
     {
      s.show();
     }
     else
     {
      layer.load(2);
      $.ajax(
      {
       url: 'afterSaleManage/student/queryContractBalance',
       type: 'post',
       dataType: 'json',
       data:
       {
        id: t.attr('oid'),
        finish: '1'
       },
       success: function(d)
       {
        var da = d;
        d = da.data;
        layer.close(layer.index);
        ifi.addClass('red');
        if(da.code === 1)
        {
         ifi.find('img').show();
         t.append('<div class="previewOrder contractSettlement positionA"><button type="button" class="positionA contractSettlementBtn">确定</button><h2>合同结算</h2><div><dl class="clearfix"><dt class="fl">日期</dt><dd class="fl">' + timestampToData(d[1].ctime) + '</dd></dl></div><div class="clearfix"><dl class="clearfix fl"><dt class="fl">姓名/年级</dt><dd class="fl"><span style="margin-right:35px">' + d[1].stuname + '</span><span>' + onGrade(d[0]) + '</span></dd></dl><dl class="clearfix fl"><dt class="fl">合同编号</dt><dd class="fl">' + d[1].cnumber + '</dd></dl></div><div class="clearfix"><dl class="clearfix fl"><dt class="fl">购买课时</dt><dd class="fl">' + d[1].couersum + '</dd></dl><dl class="clearfix fl"><dt class="fl">赠送课时</dt><dd class="fl">' + d[1].freesum + '</dd></dl></div><div class="clearfix"><dl class="clearfix fl"><dt class="fl">购买单价</dt><dd class="fl">￥' + d[1].perprice + '</dd></dl><dl class="clearfix fl"><dt class="fl">合同总价</dt><dd class="fl">￥' + d[1].allprice + '</dd></dl></div><div class="clearfix"><dl class="clearfix fl"><dt class="fl">消耗课时</dt><dd class="fl">' + d[2].consume + '</dd></dl><dl class="clearfix fl"><dt class="fl">消耗课时费用</dt><dd class="fl">￥' + d[0].finishfee + '</dd></dl></div><div><dl class="clearfix"><dt class="fl">退费手续费</dt><dd class="fl">￥' + d[0].stepfee + '</dd></dl></div><div><dl class="clearfix"><dt class="fl">承担税额</dt><dd class="fl">￥' + d[0].tax + '</dd></dl></div><div><dl class="clearfix"><dt class="fl">应退款</dt><dd class="fl">￥' + d[0].bmoney + '</dd></dl></div>' + '<div style="text-align:left;"><i class="xh">*</i><input style="width:240px" type="text" placeholder="请输入退款方式+账号" class="stu_ser_box" /></div><div class="lookOriginalOrder" style="color:#36AFF0;text-align:left;">查看原合同</div>' + '<div class="formHide OriginalOrder"><h2>原合同</h2><div><dl class="clearfix"><dt class="fl">姓名/年级</dt><dd class="fl"><span style="margin-right:35px">' + d[1].stuname + '</span><span>' + onGrade(d[0]) + '</span></dd></dl></div><div class="clearfix"><dl class="clearfix fl"><dt class="fl">签约类型</dt><dd class="fl">' + d[1].conkind + '</dd></dl><dl class="clearfix fl"><dt class="fl">合同编号</dt><dd class="fl">' + d[1].cnumber + '</dd></dl></div><div><dl class="clearfix"><dt class="fl">签约日期</dt><dd class="fl">' + timestampToData(d[1].ctime) + '</dd></dl></div><div class="clearfix"><dl class="clearfix fl"><dt class="fl">签约课时</dt><dd class="fl">' + d[1].couersum + '</dd></dl><dl class="clearfix fl"><dt class="fl">赠送课时</dt><dd class="fl">' + d[1].freesum + '</dd></dl></div><div class="clearfix"><dl class="clearfix fl"><dt class="fl">现单价</dt><dd class="fl"><span>￥' + d[1].forprice + '</span><br><span>￥' + d[1].perprice + '</span></dd></dl><dl class="clearfix fl"><dt class="fl">总价</dt><dd class="fl">￥' + d[1].allprice + '</dd></dl></div><div><dl class="clearfix"><dt class="fl">支付方式</dt><dd class="fl"><span>' + d[1].paytype + '</span><br><span>￥' + d[1].accountnum + '</span></dd></dl></div><input type="hidden" class="settlement" oid="' + d[1].id + '" d=\'' + JSON.stringify(d[0]) + '\' /></div></div>');
        }
        else
        {
         layer.msg(da.msg);
        }
       }
      })
     }
    }
   })
  }
 })
 $(document).off('click', '.lookOriginalOrder').on('click', '.lookOriginalOrder', function(e)
 { //查看原合同
  var oo = $('.OriginalOrder');
  var t = $(e.currentTarget);
  t.hide();
  oo.show();
 })
 $(document).off('click', '.refundTypeC .save').on('click', '.refundTypeC .save', function(e)
 { //退费-确认未消耗课时-确认
  var t = $(e.currentTarget),
   r = $('.refundTypeC'),
   ifi = $('.Identification');
  layer.load(2);
  $.ajax(
  {
   url: 'afterSaleManage/student/queryContractBalance',
   type: 'post',
   dataType: 'json',
   data:
   {
    id: ifi.attr('oid'),
    finish: '1'
   },
   success: function(d)
   {
    var da = d;
    d = da.data;
    layer.close(layer.index);
    if(da.code === 1)
    {
     r.hide();
     ifi.addClass('red');
     ifi.find('img').show();
     ifi.append('<div class="previewOrder contractSettlement positionA"><button type="button" class="positionA contractSettlementBtn">确定</button><h2>合同结算</h2><div><dl class="clearfix"><dt class="fl">日期</dt><dd class="fl">' + timestampToData(d[1].ctime) + '</dd></dl></div><div class="clearfix"><dl class="clearfix fl"><dt class="fl">姓名/年级</dt><dd class="fl"><span style="margin-right:35px">' + d[1].stuname + '</span><span>' + onGrade(d[0]) + '</span></dd></dl><dl class="clearfix fl"><dt class="fl">合同编号</dt><dd class="fl">' + d[1].cnumber + '</dd></dl></div><div class="clearfix"><dl class="clearfix fl"><dt class="fl">购买课时</dt><dd class="fl">' + d[1].couersum + '</dd></dl><dl class="clearfix fl"><dt class="fl">赠送课时</dt><dd class="fl">' + d[1].freesum + '</dd></dl></div><div class="clearfix"><dl class="clearfix fl"><dt class="fl">购买单价</dt><dd class="fl">￥' + d[1].perprice + '</dd></dl><dl class="clearfix fl"><dt class="fl">合同总价</dt><dd class="fl">￥' + d[1].allprice + '</dd></dl></div><div class="clearfix"><dl class="clearfix fl"><dt class="fl">消耗课时</dt><dd class="fl">' + d[2].consume + '</dd></dl><dl class="clearfix fl"><dt class="fl">消耗课时费用</dt><dd class="fl">￥' + d[0].finishfee + '</dd></dl></div><div><dl class="clearfix"><dt class="fl">退费手续费</dt><dd class="fl">￥' + d[0].stepfee + '</dd></dl></div><div><dl class="clearfix"><dt class="fl">承担税额</dt><dd class="fl">￥' + d[0].tax + '</dd></dl></div><div><dl class="clearfix"><dt class="fl">应退款</dt><dd class="fl">￥' + d[0].bmoney + '</dd></dl></div>' + '<div style="text-align:left;"><i class="xh">*</i><input placeholder="请输入退款方式+账号" style="width:240px" class="stu_ser_box" /></div><div class="lookOriginalOrder" style="color:#36AFF0;text-align:left;">查看原合同</div>' + '<div class="formHide OriginalOrder"><h2>原合同</h2><div><dl class="clearfix"><dt class="fl">姓名/年级</dt><dd class="fl"><span style="margin-right:35px">' + d[1].stuname + '</span><span>' + onGrade(d[0]) + '</span></dd></dl></div><div class="clearfix"><dl class="clearfix fl"><dt class="fl">签约类型</dt><dd class="fl">' + d[1].conkind + '</dd></dl><dl class="clearfix fl"><dt class="fl">合同编号</dt><dd class="fl">' + d[1].cnumber + '</dd></dl></div><div><dl class="clearfix"><dt class="fl">签约日期</dt><dd class="fl">' + timestampToData(d[1].ctime) + '</dd></dl></div><div class="clearfix"><dl class="clearfix fl"><dt class="fl">签约课时</dt><dd class="fl">' + d[1].couersum + '</dd></dl><dl class="clearfix fl"><dt class="fl">赠送课时</dt><dd class="fl">' + d[1].freesum + '</dd></dl></div><div class="clearfix"><dl class="clearfix fl"><dt class="fl">现单价</dt><dd class="fl"><span>￥' + d[1].forprice + '</span><br><span>￥' + d[1].perprice + '</span></dd></dl><dl class="clearfix fl"><dt class="fl">总价</dt><dd class="fl">￥' + d[1].allprice + '</dd></dl></div><div><dl class="clearfix"><dt class="fl">支付方式</dt><dd class="fl"><span>' + d[1].paytype + '</span><br><span>￥' + d[1].accountnum + '</span></dd></dl></div><input type="hidden" class="settlement" oid="' + d[1].id + '" d=\'' + JSON.stringify(d[0]) + '\' /></div></div>');		           	
    }
    else
    {
     layer.msg(da.msg)
    }
   }
  })
 })
 $(document).off('click', '.refundTypeC .cancels').on('click', '.refundTypeC .cancels', function(e)
 { //退费-确认未消耗课时-取消
  var t = $(e.currentTarget),
   r = $('.refundTypeC');
  r.hide();
  layer.msg('请先与教务沟通取消课程安排后进行退费!');
 })
 $(document).off('click', '.contractSettlementBtn').on('click', '.contractSettlementBtn', function(e)
 { //退费-确定结算
  e.stopPropagation();
  var t = $(e.currentTarget),
   st = JSON.parse($('.settlement').attr('d')),
   ifi = $('.Identification'),
   oid = $('.settlement').attr('oid'),
   oidBox = $('.orderId');
  cst = $('.contractSettlement .stu_ser_box').val();
  if(oidBox.val() === '')
  {
   var oidArr = [];
  }
  else
  {
   var oidArr = JSON.parse(oidBox.val());
  }
  if(cst != "")
  {
   bc = {
    contractid: oid,
    bmoney: st.bmoney,
    stepfee: st.stepfee,
    tax: st.tax,
    finishfee: st.finishfee,
    payment: cst
   };
  }
  else
  {
   layer.msg('请输入退款账户');
   return false
  }
  if(t.html() === '确定')
  {
   layer.load(2);
   $.ajax(
   {
    url: 'afterSaleManage/student/insertBackContract',
    type: 'post',
    dataType: 'json',
    data:
    {
     bc: JSON.stringify(bc)
    },
    success: function(d)
    {
     layer.close(layer.index);
     layer.msg(d.msg); //(1,"操作成功",0,null)(0,"操作失败",0,null)
     if(d.code === 1)
     {
      oidBox.val('');
      if(oidArr.length != 0)
      {
       for(var i = 0; i < oidArr.length; i++)
       {
        if(oidArr[i] != oid)
        {
         oidArr.push(oid);
        }
       }
      }
      else
      {
       oidArr.push(oid);
      }
      oidBox.val(JSON.stringify(oidArr));
      $('.contractSettlementBtn').html('取消退费').addClass('contractSettlementNoBtn');
      ifi.removeClass('red').addClass('redBc');
     }
    }
   })
  }
 })
 $(document).off('click', '.contractSettlementNoBtn').on('click', '.contractSettlementNoBtn', function(e)
 { //退费-取消退费-单个  
  e.stopPropagation();
  var t = $(e.currentTarget),
   oid = $('.settlement').attr('oid'),
   ifi = $('.Identification'),
   oidArr = [oid];
  layer.load(2);
  $.ajax(
  {
   url: 'afterSaleManage/student/delBackContractBycid',
   type: 'post',
   dataType: 'json',
   data:
   {
    ids: JSON.stringify(oidArr)
   },
   success: function(d)
   {
    layer.close(layer.index);
    layer.msg(d.msg);
    if(d.code === 1)
    {
     t.removeClass('contractSettlementNoBtn').html('确定');
     ifi.removeClass('redBc').addClass('red');
    }
   }
  })
 })
 $(document).off('click', '.refund .cancel').on('click', '.refund .cancel', function(e)
 { //退费-取消退费-全部  
  var t = $(e.currentTarget),
   oidBox = $('.orderId'),
   ifi = $('.Identification'),
   oidArr = oidBox.val();
  $('.orderTypeNav li').removeClass('redFont');
  $('.orderTypeNav li:first').addClass('redFont');
  if(oidArr != '')
  {
   layer.load(2);
   $.ajax(
   {
    url: 'afterSaleManage/student/delBackContractBycid',
    type: 'post',
    dataType: 'json',
    data:
    {
     ids: oidArr
    },
    success: function(d)
    {
     layer.close(layer.index);
     layer.msg(d.msg);
     if(d.code === 1)
     {
      oidBox.val('');
      //          	t.removeClass('contractSettlementNoBtn').html('确定');
      ifi.removeClass('redBc').addClass('red');
      $('.orderId').val('');
     }
    }
   })
  }
 });
 $(document).off('click', '.refund .stuInfFoot .save').on('click', '.refund  .stuInfFoot .save', function(e)
 { //退费-保存  
  var t = $(e.currentTarget);
  $('.orderTypeNav li').removeClass('redFont');
  $('.orderTypeNav li:first').addClass('redFont');
  $('.refund').hide();
  $('.curtain').hide()
 });
}
function allotStu(table)
{//分配学生
 $(document).off('click', '.allotStudentBoxBtn').on('click', '.allotStudentBoxBtn', function(e)
 { //分配学生-弹框打开
  var t = $(e.target);
  var arr = [t.attr('sid')];
  $('.allotStu').find('h2').attr('sid', JSON.stringify(arr));
 })
 $(document).off('click', '.allotStudentBoxBtnAll').on('click', '.allotStudentBoxBtnAll', function(e)
 { //分配学生-弹框打开
  var t = $(e.target);
  var d = table.checkStatus('tableStu_1').data;
  var arr = [];
  for(var i = 0; i < d.length; i++)
  {
   arr.push(d[i].id)
  }
  $('.allotStu').find('h2').attr('sid', JSON.stringify(arr));
  $('.allotStu').show();
  $('.curtain').show();
 })
 $(document).off('click', '.belonger').on('click', '.belonger', function()
 { //分配学生-团队列表
  $('.allotBox').slideDown('fast');
  var team = '';
  layer.load(2);
  $.ajax(
  {
   url: 'afterSaleManage/student/allotStuTeamList',
   type: 'post',
   dataType: 'json',
   success: function(d)
   {
    var da = d;
    d = da.data;
    layer.close(layer.index);
    if(da.code === 0)
    {
     team = '<li tid="xyg">新员工(<span>' + d[d.length - 1].newuser + '</span>)</li>';
     for(var i = 0; i < d.length - 1; i++)
     {
      team += '<li tid="' + d[i].id + '">' + d[i].tname + '(<span>' + d[i].usersum + '</span>)</li>';
     }
    }
    $('.allotTeam').html(team);
   }
  })
 })
 $(document).off('click', '.allotTeam li').on('click', '.allotTeam li', function(e)
 { //分配学生-	团队成员列表
  var man = '',
   t = $(e.currentTarget);
  layer.load(2);
  if(t.attr('tid') === 'xyg')
  {
   $.ajax(
   {
    url: 'afterSaleManage/student/queryNewUser',
    type: 'post',
    dataType: 'json',
    success: function(d)
    {
     var d = d.data;
     layer.close(layer.index);
     for(var i = 0; i < d.length; i++)
     {
      man += '<li class="fl" mid="' + d[i].id + '">' + d[i].username + '</li>';
     }
     $('.allotMan').html(man);
    }
   })
  }
  else
  {
   $.ajax(
   {
    url: 'afterSaleManage/student/queryTeamUserBytid',
    type: 'post',
    dataType: 'json',
    data:
    {
     teamid: t.attr('tid')
    },
    success: function(d)
    {
     var d = d.data;
     layer.close(layer.index);
     for(var i = 0; i < d.length; i++)
     {
      man += '<li class="fl" mid="' + d[i].id + '">' + d[i].username + '</li>';
     }
     $('.allotMan').html(man);
    }
   })
  }
 })
 $(document).off('click', '.allotMan li').on('click', '.allotMan li', function(e)
 { //分配学生-	选择
  var t = $(e.currentTarget);
  var b = $('.belonger');
  var a = $('.allotBox');
  b.html(t.html());
  b.attr('tid', t.attr('mid'));
  a.slideUp('fast');
 })
 $(document).off('click', '.allotStu .save').on('click', '.allotStu .save', function(e)
 { //分配学生-	提交
  var t = $(e.currentTarget);
  var b = $('.belonger');
  var cur = $('.curtain');
  layer.load(2);
  $.ajax(
  {
   url: 'afterSaleManage/student/allotStu',
   type: 'post',
   dataType: 'json',
   data:
   {
    userid: b.attr('tid'),
    stuid: $('.allotStu h2').attr('sid')
   },
   success: function(d)
   {
    layer.close(layer.index);
    layer.msg(d.msg); //(1,"操作成功",0,null)(0,"操作失败",0,null)
    if(d.code === 1)
    {
     b.html('');
     b.attr('tid', '');
     cur.hide();
     $('.tab_current').trigger('click');
    }
   }
  })
 })
}
function classSheetDataOut()
{//导出课时单
 $(document).off('click', '#toExcel').on('click', '#toExcel', function()
 {
  window.open('afterSaleManage/count/downloadExcel?stuname=' + $('#stu_name').val() + '&username=' + $('#stu_user').val() + '&ctype=' + $('#cstype').val() + '&inputtime=' + $('.achivClendar:visible').val())
 })
}

function checkTimeSheet()
{ //审核课时单
 $(document).off('click', '.operation .checkTs').on('click', '.operation .checkTs', function(e)
 {
  var t = $(e.currentTarget);
  $('.checkTimesheet h2').attr('cid', t.attr('cid'))
  layer.load(2);
  console.log(t.attr('cid'))
  $.ajax(
  {
   url: 'afterSaleManage/coufee/coufeeDetail',
   type: 'post',
   dataType: 'json',
   data:
   {
    id: t.attr('cid')
   },
   success: function(d)
   {
    var da = d,
     str = '';
    d = da.data;
    layer.close(layer.index);
    if(da.code === 0)
    {
     if(d.ctype === '1')
     {
      d.ctype = "班课";
     }
     else if(d.ctype === '0')
     {
      d.ctype = "线上一对一";
     }
     str = '<dl class="fl"><dt>学员姓名:</dt><dd>' + d.stuname + '</dd></dl><dl class="fl"><dt>手机号:</dt><dd>' + d.phone + '</dd></dl><dl class="fl"><dt>上课形式:</dt><dd>' + d.ctype + '</dd></dl><dl class="fl"><dt>上课时间段:</dt><dd class="showTime">' + d.showtime + '</dd></dl><dl class="fl"><dt>课时数量:</dt><dd>' + d.cousum + '</dd></dl><dl class="fl"><dt>操作人:</dt><dd>' + d.username + '</dd></dl><dl class="fl ctsRemark"><dt>备注:</dt><dd>' + (d.remark?d.remark:"") + '</dd></dl><dl class="fl ctsRemark"><dt>上课截图:</dt><dd><img src="' + d.imgurl + '" width=375 alt=""/></dd></dl>';
     $('.checkTimesheet .stuInfForm').html(str);
    }
   }
  })
 })
 $(document).off('click', '.checkTimesheet .save').on('click', '.checkTimesheet .save', function(e)
 { //通过课时单
  var t = $(e.currentTarget);
  var cur = $('.curtain');
  layer.load(2);
  console.log(t.attr('cid'))
  $.ajax(
  {
   url: 'afterSaleManage/coufee/auditCoufee',
   type: 'post',
   dataType: 'json',
   data:
   {
    id: $('.checkTimesheet h2').attr('cid'),
    checkstatus: '1'
   },
   success: function(d)
   {
    layer.close(layer.index);
    layer.msg(d.msg);
    if(d.code === 1)
    {
     cur.hide();
     $('.tab_current').trigger('click');
    }
   }
  })
 })
 $(document).off('click', '.checkTimesheet .cancels').on('click', '.checkTimesheet .cancels', function(e)
 { //取消审核课时单
  var t = $(e.currentTarget);
  var cur = $('.curtain');
  layer.load(2);
  $('.setInremarkSC').show();
  $.ajax(
  {
   url: 'afterSaleManage/coufee/showRemarkCoufee',
   type: 'post',
   dataType: 'json',
   data: { id: $('.checkTimesheet h2').attr('cid') },
   success: function(d)
   {
    layer.close(layer.index);
    var html = '',
     d = d.data;
    for(var i = 0; i < d.length; i++)
    {
     html += '<tr><td>' + timestampToData(d[i].ctime) + '</td><td>' + d[i].content + '</td><td>' + d[i].username + '</td></tr>';
    }
    $('.myRemark tbody').html(html);
   }
  })
 })
 $(document).off('click', '.setInremarkSC .save').on('click', '.setInremarkSC .save', function(e)
 { //审核课时单备注提交
  var t = $(e.currentTarget);
  var cur = $('.curtain');
  layer.load(2);
  $.ajax(
  {
   url: 'afterSaleManage/coufee/addCoufeeRemark',
   type: 'post',
   dataType: 'json',
   data:
   {
    couid: $('.checkTimesheet h2').attr('cid'),
    content: $('.setInremarkSC textarea').val(),
    checkstatus: '2'
   },
   success: function(d)
   {
    if(d.code === 1)
    {
     $.ajax(
     {
      url: 'afterSaleManage/coufee/auditCoufee',
      type: 'post',
      dataType: 'json',
      data:
      {
       id: $('.checkTimesheet h2').attr('cid'),
       checkstatus: '2'
      },
      success: function(d)
      {
       layer.close(layer.index);
       layer.msg(d.msg);
       if(d.code === 1)
       {
        cur.hide();
        $('.tab_current').trigger('click');
       }
      }
     })
    }
   }
  })
 })
 $(document).off('click', '.setInremarkSC .cancels').on('click', '.setInremarkSC .cancels', function(e)
 {
  var t = $(e.currentTarget);
  $('.setInremarkSC,.curtain').hide();
 })
}
checkTimeSheet();//审核课时单
classSheetDataOut();//导出课时单
refund();//退费
switchStatus();//切换状态
listMargin(5, '.orderDetNav li');//末尾去margin
previewOrd('.previewOrder');