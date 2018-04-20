package com.example.demo.service;

import com.example.demo.entity.User;
import com.example.demo.entity.Usertable;

public interface IUsertableService {
    Usertable selectOne(String usernum, String password);
}
