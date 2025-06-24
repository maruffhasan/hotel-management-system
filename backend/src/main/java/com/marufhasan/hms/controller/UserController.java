package com.marufhasan.hms.controller;

import com.marufhasan.hms.DTO.ReviewDTO;
import com.marufhasan.hms.exception.NotFoundException;
import com.marufhasan.hms.model.User;
import com.marufhasan.hms.model.booking.Booking;
import com.marufhasan.hms.model.booking.Review;
import com.marufhasan.hms.model.room.Room;
import com.marufhasan.hms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody User user) throws NotFoundException {
        User found = userService.login(user);
        if (found == null){
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        return new ResponseEntity<>(found, HttpStatus.OK);
    }

    @GetMapping("/booking")
    public ResponseEntity<List<Booking>> getAllBooking(Authentication auth){
        return new ResponseEntity<>(userService.getBookings(auth.getName()), HttpStatus.OK);
    }


    @PostMapping("/sign-up")
    public ResponseEntity<String> home(@RequestBody User user) {
        user.setRole("ROLE_USER");
        userService.signup(user);
        return new ResponseEntity<>("User signup successfull", HttpStatus.CREATED);
    }


}
