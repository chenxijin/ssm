package com.example.demo.dao;

import com.example.demo.entity.Usertable;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

public interface UserMapper {
    @Insert("insert into user (userId,pwd) values (#{userId},#{pwd})")
    boolean insertUsers (@Param("userId") String userId, @Param("pwd") String pwd);
    @Select("select * from usertable where pwd = #{pwd} and usernum = #{usernum} ")
    Usertable selectOne(@Param("username") String usernum, @Param("pwd") String password);
}
