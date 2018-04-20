
pics=[]
accessid = ''
accesskey = ''
host = ''
policyBase64 = ''
signature = ''
filename = ''
key = ''
expire = 0;
var timstamps=null;
now = timestamp = Date.parse(new Date()) / 1000; 
serviceUrl=window.location.protocol+'//'+window.location.host
function send_request()
{
    var xmlhttp = null;
    if (window.XMLHttpRequest)
    {
        xmlhttp=new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
  
    if (xmlhttp!=null)
    {
        serverUrl = serviceUrl+'/common/returnSign';
        xmlhttp.open( "GET", serverUrl, false );
        xmlhttp.send( null );
        return xmlhttp.responseText
    }
    else
    {
        alert("Your browser does not support XMLHTTP.");
    }
};

function get_signature()
{
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = timestamp = Date.parse(new Date()) / 1000; 
    console.log('get_signature ...');
    console.log('expire:' + expire.toString());
    console.log('now:', + now.toString())
    if (expire < now + 3)
    {
        console.log('get new sign')
        body = send_request();
        var obj = eval ("(" + body + ")");
        obj=obj.data;
        host = obj['host']
        policyBase64 = obj['policy']
        accessid = obj['accessid']
        signature = obj['signature']
        expire = parseInt(obj['expire'])
        key = obj['dir']
        return true;
    }
    return false;
};
function set_upload_param(up)
{
    var ret = get_signature()
    if (ret == true)
    {
    	pho=$('.sctPhone').html();
        new_multipart_params = {
            'key' : 'oasystem/stu_file/'+pho+'/'+'${filename}',
            'policy': policyBase64,
            'OSSAccessKeyId': accessid, 
            'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
            'signature': signature,
        };
        up.setOption({
            'url': host,
            'multipart_params': new_multipart_params
        });
		console.log(host);
        console.log('reset uploader')
          uploader.start();
    }
}
var uploader = new plupload.Uploader({
	runtimes : 'html5,flash,silverlight,html4',
	browse_button : 'selectfilesCard', 
	container: document.getElementById('containerCard'),
	flash_swf_url : 'lib/plupload-2.1.2/js/Moxie.swf',
	silverlight_xap_url : 'lib/plupload-2.1.2/js/Moxie.xap',

    url : 'http://oss.aliyuncs.com',
	filters: {
        mime_types : [ //只允许上传图片和zip文件
        { title : "Image files", extensions : "pdf"},
          { title : "Zip files", extensions : "zip,rar"},
            { title : "Text files", extensions : "doc,docx,xls,xlsx,ppt,pptx,wps,dps,et"}
        ],
        max_file_size : '500mb', //最大只能上传10mb的文件
        prevent_duplicates : true //不允许选取重复文件
    },
	init: {
		PostInit: function() {
				$(document).on('change','#containerCard .fileimg',function() {
            set_upload_param(uploader);
            uploader.start();
            return false;
			});
		},

		FilesAdded: function(up, files) {
			plupload.each(files, function(file) {
			});
		},

		UploadProgress: function(up, file) {
			var d = document.getElementById(file.id);
		},

		FileUploaded: function(up, file, info) {            
            set_upload_param(up);
            if (info.status >= 200 || info.status < 200)
            {
            	var regEn = /[#%&+?？=\/[\]]/im;
            	if(regEn.test(file.name)){
					layui.use('layer', function(){
					  var layer = layui.layer;					  
					  layer.msg('文件名存在特殊符号，上传失败');
					});           		
            	}else{
            		$.ajax({
            			type:'post',
            			dataType:'json',
            			url:'student/upFile',
            			data:{
						fileurl:'http://iyouwen-1.oss-cn-shanghai.aliyuncs.com/oasystem/stu_file/'+$(".sctPhone").html()+'/'+file.name,
						stuid:$('.sctName').attr('sid'),
						filename:file.name     				
            			},
            			success:function(d){
		 					layui.use('layer', function(){
							  var layer = layui.layer;					  
							  layer.msg(d.msg);
							});            				
            			}
            		})
            	}
            }
            else
            {
				layui.use('layer', function(){
					  var layer = layui.layer;					  
					  layer.msg('上传失败');
					});
            } 
		},

		Error: function(up, err) {
            set_upload_param(up);
			alert('文件已存在')              
            console.log(err);
		}
	}
});

uploader.init();
