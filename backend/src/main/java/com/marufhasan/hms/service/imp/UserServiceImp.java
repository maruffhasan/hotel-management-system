package com.marufhasan.hms.service.imp;

import com.marufhasan.hms.DTO.ReviewDTO;
import com.marufhasan.hms.exception.CustomError;
import com.marufhasan.hms.exception.NotFoundException;
import com.marufhasan.hms.exception.Response;
import com.marufhasan.hms.model.User;
import com.marufhasan.hms.model.booking.Booking;
import com.marufhasan.hms.model.booking.Review;
import com.marufhasan.hms.repository.UserRepository;
import com.marufhasan.hms.repository.booking.BookingRepository;
import com.marufhasan.hms.service.BookingService;
import com.marufhasan.hms.service.UserService;
import org.apache.naming.factory.SendMailFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserServiceImp implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public void signup(User user) throws CustomError {
        if (userRepository.getUser(user.getEmail()).isPresent()) {
            throw new CustomError("User already exist with this email address...");
        }
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userRepository.add(user);
    }

    @Override
    public User login(User user) throws NotFoundException {
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
            throw new NotFoundException("User not found with this email address");
        }
    }

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public List<Booking> getBookings(String email) {
        return bookingRepository.getBookingsForUser(email);
    }

    @Override
    public Boolean canIgiveReview(String email, Integer id) {
        if(bookingRepository.bookingCount(email, id) > 0) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public Integer postReview(Review review) {
        if (canIgiveReview(review.getUser_email(), review.getRoom_id())) {
            return userRepository.postReview(review);
        } else {
            throw new IllegalArgumentException("you are not allowed to post a review");
        }
    }

    @Override
    public void editReview(String email, ReviewDTO reviewDTO) {
        userRepository.editReview(email, reviewDTO);
    }

    @Override
    public void deleteReview(String email, Integer id) {
        userRepository.deleteReview(email, id);
    }

    @Override
    public User getUser(String email) {
        User user = userRepository.getUser(email).get();
        user.setPassword(null);
        return user;
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.getAllUsers();
    }

    @Override
    public void adminSignup(User user) throws CustomError {
        if (userRepository.getUser(user.getEmail()).isPresent()) {
            throw new CustomError("admin already exist with this email address...");
        }
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userRepository.addADmin(user);
    }
}
