package com.example.demo.serviceImpl;

import com.example.demo.dao.UserMapper;
import com.example.demo.entity.Usertable;
import com.example.demo.service.IUsertableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class usertableImpl implements IUsertableService {
    @Autowired
    private UserMapper userMapper;


    @Override
    public Usertable selectOne(String usernum, String password) {
        return userMapper.selectOne(usernum,password);
    }
}
