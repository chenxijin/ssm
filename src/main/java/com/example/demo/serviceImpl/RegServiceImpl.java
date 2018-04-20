package com.example.demo.serviceImpl;

import com.example.demo.dao.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import com.example.demo.service.IRegService;
import org.springframework.stereotype.Service;

@Service
public class RegServiceImpl implements IRegService {
    @Autowired
    private UserMapper userMapper;
    @Override
    public boolean regUser(String uerId, String pwd) {

        Boolean flag;
        try {
            flag = userMapper.insertUsers(uerId,pwd);
        }catch (Exception e){
            return false;
        }
        return flag;
    }
}
