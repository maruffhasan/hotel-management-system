package com.marufhasan.hms.service;

import com.marufhasan.hms.model.User;

public interface UserService {
    public void signup(User user);

    User login(User user);
}
