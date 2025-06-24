package com.marufhasan.hms.controller.room;

import com.marufhasan.hms.DTO.ReviewDTO;
import com.marufhasan.hms.model.booking.Review;
import com.marufhasan.hms.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/review")
public class reviewController {

    @Autowired
    private UserService userService;

    @GetMapping("/eligible")
    public ResponseEntity<?> canIgiveReview(Integer id, Authentication auth){
        Boolean yes = userService.canIgiveReview(auth.getName(), id);
        if (yes) {
            return new ResponseEntity<>(HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping("/post")
    public ResponseEntity<?> postReview(@RequestBody Review review, Authentication auth){
        review.setUser_email(auth.getName());
        return new ResponseEntity<>(userService.postReview(review), HttpStatus.CREATED);
    }

    @PutMapping("/edit/{id}")
    public ResponseEntity<?> editReview(@PathVariable int id, @RequestBody ReviewDTO reviewDTO, Authentication auth){
        reviewDTO.setId(id);
        userService.editReview(auth.getName(), reviewDTO);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteReview(@PathVariable Integer id, Authentication auth){
        userService.deleteReview(auth.getName(), id);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}
