package com.marufhasan.hms.controller.room;

import com.marufhasan.hms.DTO.RoomDetailsDTO;
import com.marufhasan.hms.exception.NotFoundException;
import com.marufhasan.hms.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @GetMapping("/{id}")
    public ResponseEntity<RoomDetailsDTO> getRoomById(@PathVariable("id") int id) throws NotFoundException {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @GetMapping
    public ResponseEntity<List<RoomDetailsDTO>> getAllRooms(
            @RequestParam(required = false) Integer room_class_id,
            @RequestParam(required = false) Integer bed_type_id,
            @RequestParam(required = false) Integer room_status_id,
            @RequestParam(required = false) Integer floor,
            @RequestParam(required = false) Double min_price,
            @RequestParam(required = false) Double max_price,
            @RequestParam(required = false) Integer person_count
    ){
        return ResponseEntity.ok(roomService.getAll(room_status_id, bed_type_id, room_class_id, floor, min_price, max_price, person_count));
    }
}
