package com.marufhasan.hms.service;

import com.marufhasan.hms.DTO.ReviewDTO;
import com.marufhasan.hms.exception.CustomError;
import com.marufhasan.hms.exception.NotFoundException;
import com.marufhasan.hms.model.User;
import com.marufhasan.hms.model.booking.Booking;
import com.marufhasan.hms.model.booking.Review;
import org.springframework.http.HttpStatusCode;

import java.util.List;

public interface UserService {
    public void signup(User user) throws CustomError;

    User login(User user) throws NotFoundException;

    List<Booking> getBookings(String email);

    Boolean canIgiveReview(String name, Integer id);

    Integer postReview(Review review);

    void editReview(String name, ReviewDTO reviewDTO);

    void deleteReview(String name, Integer id);

    void deleteReview(Integer id);

    User getUser(String email);

    List<User> getAllUsers();

    void adminSignup(User user) throws CustomError;

    void disableUser(String email);
}
