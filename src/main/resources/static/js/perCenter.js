/*
 * 个人中心
 */
function modifyPassword(){//密码修改
	$(document).off('change','.oldPassword').on('change','.oldPassword',function(e){//原密码校检
		var target=$(e.target);
		$.ajax({
			url:'msg/checkPassword',
			type:'post',
			dataType:'json',
			data:{
				Lpassword:target.val()
			},
			success:function(d){
				layer.msg(d.msg);
				if(d.code===1){
					$(e.target).val('');
				}
			}						
		})
	})	
	$(document).off('change','.newPassword').on('change','.newPassword',function(e){//密码格式校检
		var t=$(e.currentTarget);
		if(checkPassword(t.val())===false){
			return true;
		}else{
			layer.msg('请输入字母或数字组成的大于6位的密码');
			t.val('');
		}
	})
	$(document).off('click','#savePassword').on('click','#savePassword',function(){//修改密码
		var newP=$('.newPassword');
		var conP=$('.confirmPass');
		if(conP.val()!=''&&newP.val()===conP.val()){
			$.ajax({
				url:'msg/updatePassword',
				type:'post',
				dataType:'json',
				data:{
					password:conP.val()
				},
				success:function(d){
					layer.msg(d.msg);
					if(d.code===1){
						conP.val('');
					}else{
						$('#modify').hide();
						$('.curtain').hide();
					}
				}						
			})			
		}else{
			layer.msg('两次输入的密码不同');
		}
	})
}
function msgStuType(){//消息检索-状态类型
	$(document).off('click','.examineDet li').on('click','.examineDet li',function(e){
		var t=$(e.currentTarget);
		that=t.parent('ul').siblings('.msgBox');
		that.attr('d',t.attr('data'));
	})
}
function checkDelMsg(table,url){//多条删除消息
   table.on('checkbox(test)', function(obj){//监听表格复选框选择  
   	if(obj.checked===true){
    	$('#checkedEvent').show();
  	 	$('#mystu_sear').hide();  		
   	}else if($('#myStudent .layui-form-checked').length===0){
    	$('#checkedEvent').hide();
  	 	$('#mystu_sear').show();     		
   	}
});
$(document).on('click','.perCheckedDel',function(){//批量 删除 学生
	var msgid=[];
	var target= table.checkStatus('tableStu_1').data;
	for(var i=0;i<target.length;i++){		
		msgid.push(target[i].id);
		if(target[i].tstatus==="1"){
			layer.msg('未读消息不可删除');
			return false;
		}
	}
      layer.confirm('真的删除选中项么', function(index){
      	layer.close(index);
        $.ajax({
        	url:url,
        	type:'post',
        	dataType:'json',
        	data:{msgids:JSON.stringify(msgid)},
        	success:function(d){
        		layer.msg(d.msg); 
        		if(d.code===1){
        			$('.s_btn').trigger('click');        			
        		}
        	}
        })
      });	
})
$(document).on('click','#checkedCancel',function(){//取消批量操作工具栏
	$('#mystu_tab').find('.tab_current').trigger('click');
})
}
function delOneMsg(table,url){//单条删除消息
	 table.on('tool(test)', function(obj){
    var data = obj.data;
	if(obj.event === 'del'){
		var myid=[];		
		myid.push(data.id);
      layer.confirm('真的删除本行么', function(index){
        $.ajax({
        	url:url,
        	type:'post',
        	dataType:'json',
        	data:{msgids:JSON.stringify(myid)},
        	success:function(d){
        		layer.msg(d.msg); 
        		if(d.code===1){
        			$('.s_btn').trigger('click');        			
        		}
        	}
        })
        layer.close(index);
      });
    }
  });
}
function noRead(){//未读状态
    	var status=$('.mstatus');
    	for(var i=0,l=status.length;i<l;i++){
    		if(status.eq(i).attr('status')==="1"){
    			status.eq(i).parents('tr').css({
    				"color":'#FD625B'
    			}).addClass('nolookMsg').attr('type',status.eq(i).attr('type'))
    		}
    	}	
}
function lookupMsg(){//查看未读消息
var look=$('.lookupMsg');
	mtk('.nolookMsg',look,bBox);
	$(document).on('click','.nolookMsg',function(e){//查看信息
		var that=$(e.currentTarget);
		var c=that.find('td[data-field="mcontent"]>div').html();
		var t=that.find('td[data-field="mtype"]  span').html();
		localStorage.msgId=that.find('.newsTitle').attr('myid');
		c=c.replace(/\n/g,'<br />');
		look.find('h2').html(t);
		look.find('p').html(c);
		look.attr('type',that.attr('type'));
	})
	$(document).on('click','.iKnow',function(){//知道了
		$.ajax({
			url:'msg/updateMstatus',
			dataType:'json',
			type:'post',
			data:{
				id:localStorage.msgId
			},
			success:function(d){
				if(d.code===0){
					var nt=$('#message #noticeNum'),
						nm=parseInt(nt.html());
						
					var en=$('#examNewsNum'),
						em=parseInt(en.html());
					if($('.lookupMsg').attr('type')==='0'){//统计
						if(nm>=0){
							nt.html(nm-1);
						}else{
							nt.html(0);
						}
					}else{
						if(em>=0){
							en.html(em-1);
						}else{
							en.html(0);
						}
					}
					$('.s_btn').trigger('click');						
				}
			}
		})
	})
}
//时间戳转时间
function transDate(now){
now=new Date(now);
var year=now.getFullYear();;
var month=now.getMonth()+1; 
var date=now.getDate(); 
var hour=now.getHours(); 
var minute=now.getMinutes(); 
var second=now.getSeconds(); 

	hour=zero(hour);
	minute=zero(minute);
return year+"-"+month+"-"+date+" "+hour+":"+minute; 
} 
function zero(d){
	d+=''
	if(d.length<2){
		return d='0'+d;
	}else{
		return d;
	}
}
