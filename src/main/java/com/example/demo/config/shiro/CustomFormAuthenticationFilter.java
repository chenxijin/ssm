package com.example.demo.config.shiro;

import org.apache.shiro.web.filter.authc.FormAuthenticationFilter;
import org.apache.shiro.web.util.WebUtils;

import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Description: oasystem
 * Created by zhangchengji on 2018/4/12 10:05
 */
public class CustomFormAuthenticationFilter extends FormAuthenticationFilter {
    @Override
    protected boolean onAccessDenied(ServletRequest request, ServletResponse response) throws Exception {
        System.out.println("执行拦截----------");
        if(isLoginRequest(request,response)){
            if(isLoginSubmission(request,response)){
                return executeLogin(request,response);
            }else{
                return true;
            }
        }else{
            HttpServletRequest httpRequest= WebUtils.toHttp(request);
            if (ShiroFilterUtils.isAjax(httpRequest)) {
                HttpServletResponse httpServletResponse = WebUtils.toHttp(response);
                httpServletResponse.sendError(401);

                return false;

            } else {
                saveRequestAndRedirectToLogin(request, response);
            }

            return false;
        }

    }
}
