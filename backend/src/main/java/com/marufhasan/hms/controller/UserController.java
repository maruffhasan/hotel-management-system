package com.marufhasan.hms.controller;

import com.marufhasan.hms.model.User;
import com.marufhasan.hms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user){
        User found = userService.login(user);
        if (found == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(found, HttpStatus.OK);
    }

    @PostMapping("/sign-up")
    public ResponseEntity<String> home(@RequestBody User user) {
        userService.signup(user);
        return new ResponseEntity<>("User signup successfull", HttpStatus.CREATED);
    }
}
