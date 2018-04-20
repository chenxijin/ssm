package com.example.demo.config.shiro;

import com.example.demo.entity.Usertable;
import com.example.demo.service.IUsertableService;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.HashSet;
import java.util.Set;

/**
 * @author 张成基
 * @version V1.0
 * @Title: ${file_name}
 * @Package ${package_name}
 * @Description: TODO
 * @date ${date} ${time}
 */
public class MyShiroRealm extends AuthorizingRealm {

    private static final transient Logger logger = LoggerFactory.getLogger(ShiroConfiguration.class);

    @Autowired
    private IUsertableService iUsertableService;




    //身份认证配置
    @Override
    protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        logger.info("身份认证————————————————————>MyShiroRealm.doGetAuthorizationInfo()");
        //获取用户的输入账号
        String usernum =(String) token.getPrincipal();
        String password = new String((char[])token.getCredentials());
        //查询当前用户

        Usertable user=iUsertableService.selectOne(usernum,password);
        if(user==null){
            return null;
        }
        SimpleAuthenticationInfo simpleAuthenticationInfo=new SimpleAuthenticationInfo(user, user.getPwd(),user.getName());
        return simpleAuthenticationInfo;
    }
    //权限配置(授权){暂时没有用到}
    @Override
    protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        logger.info("权限配置————————————————————>MyShiroRealm.doGetAuthorizationInfo()");
        //获取用户信息
/*        Usertable user= (Usertable) principals.getPrimaryPrincipal();*/
        SimpleAuthorizationInfo authenticationInfo =  new SimpleAuthorizationInfo();
     //   appointclassMapper.
        Set<String> roleSet = new HashSet<String>();
        roleSet.add("100004");
        authenticationInfo.setRoles(roleSet);
        Set<String> permissionSet = new HashSet<String>();
        permissionSet.add("权限添加");
        permissionSet.add("权限删除");
        authenticationInfo.setStringPermissions(permissionSet);
        return authenticationInfo;
    }

}
