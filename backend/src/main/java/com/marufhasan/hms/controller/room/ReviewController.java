package com.marufhasan.hms.controller.room;

import com.marufhasan.hms.DTO.ReviewDTO;
import com.marufhasan.hms.model.booking.Review;
import com.marufhasan.hms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/review")
public class ReviewController {

    @Autowired
    private UserService userService;

    @PreAuthorize("hasRole('USER')")
    @GetMapping("/eligible")
    public ResponseEntity<?> canIgiveReview(Integer id, Authentication auth){
        Boolean yes = userService.canIgiveReview(auth.getName(), id);
        if (yes) {
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/post")
    public ResponseEntity<?> postReview(@RequestBody Review review, Authentication auth){
        review.setUser_email(auth.getName());
        return new ResponseEntity<>(userService.postReview(review), HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping("/edit/{id}")
    public ResponseEntity<?> editReview(@PathVariable int id, @RequestBody ReviewDTO reviewDTO, Authentication auth){
        reviewDTO.setId(id);
        userService.editReview(auth.getName(), reviewDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Integer id, Authentication auth){
        if (auth.getAuthorities().stream().findFirst().get().toString().equals("ROLE_ADMIN")) {
            userService.deleteReview(id);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        userService.deleteReview(auth.getName(), id);
        return new ResponseEntity<>(HttpStatus.OK);
    }

//    @PreAuthorize("hasRole('ADMIN')")
//    @GetMapping("/all")
//    public ResponseEntity<?> getAllReview(@RequestParam(required = false) LocalDate from,
//                                          @RequestParam(required = false) LocalDate to,
//                                          @RequestParam(required = false) Integer){
//
//
//    }

}
