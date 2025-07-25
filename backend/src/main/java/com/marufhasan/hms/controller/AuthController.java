package com.marufhasan.hms.controller;

import com.marufhasan.hms.exception.CustomError;
import com.marufhasan.hms.model.User;
import com.marufhasan.hms.security.JwtUtil;
import com.marufhasan.hms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            user.getEmail(),
                            user.getPassword()
                    )
            );

            String token = jwtUtil.generateToken(user.getEmail());

            String role = String.valueOf(auth.getAuthorities().stream().findFirst().get()).substring(5).toLowerCase();
            Map<String, String> response = new HashMap<>();
            response.put("role", role);
            response.put("token", token);

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }
    }


    @Autowired
    private UserService userService;

    @PostMapping("/user-sign-up")
    public ResponseEntity<?> signUp(@RequestBody User user) throws CustomError {
        user.setRole("ROLE_USER");
        userService.signup(user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/admin-sign-up")
    public ResponseEntity<?> signUpAdmin(@RequestBody User user) throws CustomError {
        user.setRole("ROLE_ADMIN");
        userService.adminSignup(user);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
