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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return new ResponseEntity<>(userService.getUser(email), HttpStatus.OK);
    }

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/booking")
    public ResponseEntity<List<Booking>> getAllBooking(Authentication auth, @RequestParam(required = false) String email){
        if (auth.getAuthorities().stream().findFirst().get().toString().equals("ROLE_USER")) {
            email = auth.getName();
        }
        return new ResponseEntity<>(userService.getBookings(email), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers(){
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/disable")
    public ResponseEntity<?> disableUser(@RequestParam String email){
        userService.disableUser(email);
        return ResponseEntity.ok().build();
    }
}
