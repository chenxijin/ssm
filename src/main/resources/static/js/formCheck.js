//手机号验证
function checkMobile(phone){ 
var reg=/^1[3|4|5|7|8][0-9]\d{4,8}$/;
 if(reg.test(phone)){ 
  return true;
 }else{
 	return false;
 }
} 
//密码验证
function checkPassword(password){
	var reg=/^[0-9A-Za-z]{6,}$/;
 if(reg.test(password)){ 
  return false;
 }
}

//非空验证
function checkNull(CNull){
	for(var i=0;i<CNull.length;i++){
		if(CNull.eq(i).val()===''){
			return false;
		}
	}
	return true;
}

//是否为正整数
function isPositiveInteger(s){
     var re = /^[0-9]+$/ ;
     for(var i=0;i<s.length;i++){
		if(!re.test(s.eq(i).val())){
			return false;
		}
	}
      return true;
 } 

//最多两位小数点正整数
function isPrice(s){
	var re= /^[0-9]+([.]{1}[0-9]{1,2})?$/;
     for(var i=0;i<s.length;i++){
		if(!re.test(s.eq(i).val())){
			return false;
		}
	}
     return true;
}
//支付账号最多25位
function islength(s){
     for(var i=0;i<s.length;i++){
		if(s.eq(i).val().length>255){
			return false;
		}
	}
     return true;
}