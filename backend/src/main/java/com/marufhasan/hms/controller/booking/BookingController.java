package com.marufhasan.hms.controller.booking;

import com.marufhasan.hms.DTO.BookingDTO;
import com.marufhasan.hms.exception.NotFoundException;
import com.marufhasan.hms.model.booking.Booking;
import com.marufhasan.hms.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/booking")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PreAuthorize("hasRole('USER')")
    @PostMapping("/add")
    public ResponseEntity<?> addBooking(@RequestBody BookingDTO bookingDTO, Authentication auth){
        bookingDTO.setEmail(auth.getName());
        if (bookingDTO.getSuccess() == null){
            bookingDTO.setSuccess(Boolean.TRUE);
        }
        return new ResponseEntity<>(bookingService.add(bookingDTO), HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/logs")
    public ResponseEntity<?> logs(
            @RequestParam(required = false)  LocalDate from,
            @RequestParam(required = false) LocalDate to){
        if (from == null) {
            from = LocalDate.MIN;
        }
        if (to == null) {
            to = LocalDate.now();
        }

        return ResponseEntity.ok(bookingService.getLogs(from, to));
    }

    @GetMapping("/details/{id}")
    public ResponseEntity<?> details(@PathVariable String id) throws NotFoundException {
        return new ResponseEntity<>(bookingService.getDetails(id), HttpStatus.OK);
    }
}
