package com.marufhasan.hms.service.imp;

import com.marufhasan.hms.model.User;
import com.marufhasan.hms.repository.UserRepository;
import com.marufhasan.hms.security.MyUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
public class UserDetailServiceImp implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user =  userRepository.getUser(username).orElseThrow(
                () -> new UsernameNotFoundException("User not found with this email")
        );
        return new MyUserDetails(user);
    }
}
