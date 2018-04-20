package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/a")
public class loginAction {

    @RequestMapping("/login")
    public String login(){ return "/login.html";
    }
}
