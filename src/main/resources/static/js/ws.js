var ws = null;
var username = $("#wsusername").val()
$(function(){
    connect();
});

function connect(){
    if(username!=null){
        if ('WebSocket' in window){
            ws = new WebSocket("ws://"+window.location.host+"/socketServer/"+username);
        }
        else if ('MozWebSocket' in window){
            ws = new MozWebSocket("ws://"+window.location.host+"/socketServer/"+username);
        }
        else{
            alert("该浏览器不支持websocket");
        }


        ws.onmessage = function(evt) {
        	var num=parseInt($('#noticeNum').html())+1;
        	var numa=parseInt($('#examNewsNum').html())+1;
        	var d=JSON.parse(evt.data);
        	console.log(evt);
        	console.log(d);
        	if(parseInt($('#noticeNum').html())===99){
        		$('#noticeNum').html(99);
        		$('#examNewsNum').html(99);
        		console.log(d.code);
        		if(d.code==='0'){
        			$('.noticePrompt p').html(d.content);
        			$('.noticePrompt').show();
        		}else if(d.code==='1'){
        			$('.examPrompt p').html(d.content);
        			$('.examPrompt').show();
        		}
        	}else{
              $('#noticeNum').html(num);
              $('#examNewsNum').html(numa);             
              if(d.code==='0'){
        			$('.noticePrompt p').html(d.content);
        			$('.noticePrompt').show();
        		}else if(d.code==='1'){
        			$('.examPrompt p').html(d.content);
        			$('.examPrompt').show();
        		}
        	}
		};	
        ws.onclose = function(evt) {
            alert("连接中断,关闭浏览器重新登录！");
        };

        ws.onopen = function(evt) {
           // alert("连接成功");
        };

    }
}