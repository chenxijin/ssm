package com.example.demo.controller;

import com.example.demo.util.JsonResult;
import com.example.demo.util.baseAction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import com.example.demo.service.IRegService;
import org.springframework.web.servlet.ModelAndView;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

@Controller
@EnableAutoConfiguration
@RequestMapping("/test")
public class testAction extends baseAction {
    @Autowired
    private IRegService regService;
    @RequestMapping("/reg")
    @ResponseBody
    JsonResult reg(@RequestParam("pwd") String pwd,@RequestParam("userId") String userId){
        String pwd1 = creatMD5(pwd);
        System.out.println(userId+":"+pwd);
        boolean b = regService.regUser(userId, pwd1);
        return renderSuccess(0,"",0,b);
    }
    private String creatMD5(String loginNum){
        // 生成一个MD5加密计算摘要
        MessageDigest md = null;
        try {
            md = MessageDigest.getInstance("MD5");
            md.update(loginNum.getBytes());

        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return new BigInteger(1, md.digest()).toString(16);
    }

    @RequestMapping("/login")
    public String index (){

        return "/login.html";
    }

}