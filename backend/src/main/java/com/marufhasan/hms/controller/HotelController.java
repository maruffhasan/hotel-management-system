package com.marufhasan.hms.controller;

import com.marufhasan.hms.exception.Response;
import com.marufhasan.hms.model.Hotel;
import com.marufhasan.hms.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/hotel")
public class HotelController {

    @Autowired
    private HotelService hotelService;


    @GetMapping("/details")
    public ResponseEntity<Hotel> hotel(){
        Hotel hotel = hotelService.getDetails();
        return ResponseEntity.ok(hotel);
    }

    @PutMapping("/edit")
    public ResponseEntity<Response> edit(@RequestBody Hotel hotel){
        hotelService.editDetails(hotel);
        return ResponseEntity.ok(new Response("Successfully updated details"));
    }
}
