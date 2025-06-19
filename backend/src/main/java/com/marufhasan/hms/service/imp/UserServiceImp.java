package com.marufhasan.hms.service.imp;

import com.marufhasan.hms.model.User;
import com.marufhasan.hms.repository.UserRepository;
import com.marufhasan.hms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserServiceImp implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public void signup(User user) {
        if (userRepository.getUser(user.getEmail()).isPresent()) {
            throw new IllegalArgumentException("User already exists with this email address");
        }
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userRepository.add(user);
    }

    @Override
    public User login(User user) {
        Optional<User> found = userRepository.getUser(user.getEmail());
        if (found.isPresent()) {
            if (bCryptPasswordEncoder.matches(user.getPassword(), found.get().getPassword())) {
                found.get().setPassword(null);
                found.get().setRole(null);
                return found.get();
            } else {
                return null;
            }
        } else {
            throw new IllegalArgumentException("User not found with this email address");
        }
    }
}
