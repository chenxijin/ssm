package com.example.demo.util;

import javax.security.auth.Subject;

public class baseAction {

    /**
     * 渲染失败数据
     *
     * @return result
     */
    protected JsonResult renderError() {
        JsonResult result = new JsonResult();
        result.setSuccess(false);
        result.setStatus("500");
        return result;
    }

    /**
     * 渲染失败数据（带消息）
     *
     * @param msg 需要返回的消息
     * @return result
     */
    protected JsonResult renderError(String msg) {
        JsonResult result = renderError();
        result.setMsg(msg);
        result.setCode(0);
        result.setStatus("500");
        return result;
    }

    /**
     * 渲染成功数据
     *
     * @return result
     */
    protected JsonResult renderSuccess() {
        JsonResult result = new JsonResult();
        result.setSuccess(true);
        result.setStatus("200");
        return result;
    }

    /**
     * 渲染成功数据（带信息）
     *
     * @param msg 需要返回的信息
     * @return result
     */
    protected JsonResult renderSuccess(String msg) {
        JsonResult result = renderSuccess();
        result.setMsg(msg);
        result.setSuccess(true);
        result.setStatus("200");
        result.setCode(1);
        return result;
    }

    /**
     * 渲染成功数据（带数据）
     *
     * @param obj 需要返回的对象
     * @return result
     */
    protected JsonResult renderSuccess(Object obj) {
        JsonResult result = renderSuccess();
        result.setCode(1);
        result.setData(obj);
        result.setMsg("请求成功");
        return result;
    }
    /**
     * 渲染成功数据（带数据）
     *
     * @return result
     */
    protected JsonResult renderSuccess(int code,String msg ,Integer count ,Object data) {
        JsonResult result = renderSuccess();
        result.setCode(code);
        result.setMsg(msg);
        result.setCount(count);
        result.setData(data);
        return result;
    }

    /**
     * 渲染成功数据（带数据）
     *
     * @return result
     */
    protected JsonResult renderSuccess(int code,String msg ,Integer count ,Object data,Object o) {
        JsonResult result = renderSuccess();
        result.setCode(code);
        result.setMsg(msg);
        result.setCount(count);
        result.setData(data);
        result.setObj(o);
        return result;
    }


    /**
     * 渲染失败数据（带数据）
     *
     * @return result
     */
    protected JsonResult renderError(int code,String msg ,Integer count ,Object data) {
        JsonResult result = renderSuccess();
        result.setCode(code);
        result.setMsg(msg);
        result.setCount(count);
        result.setData(data);
        return result;
    }

    /**
     *渲染成功数据（带单个数据）
     */
    public JsonResult renderSuccess(int code,String msg ,Object data){
        JsonResult result = renderSuccess();
        result.setCode(code);
        result.setMsg(msg);
        result.setData(data);
        return result;
    }

}
