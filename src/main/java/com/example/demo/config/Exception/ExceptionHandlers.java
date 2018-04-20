package com.example.demo.config.Exception;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

@ControllerAdvice
public class ExceptionHandlers {

    @ExceptionHandler(Exception.class)
    @ResponseBody
    public ModelAndView defaulteException (HttpServletRequest req, Exception e){
            e.printStackTrace();
            e.getMessage();
            ModelAndView andView = new ModelAndView("exception");
            andView.addObject("exception", e.getMessage());

        return andView;
    }
}
