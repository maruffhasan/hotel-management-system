package com.marufhasan.hms.controller.room;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.marufhasan.hms.DTO.RoomDetailsDTO;
import com.marufhasan.hms.exception.NotFoundException;
import com.marufhasan.hms.model.room.Room;
import com.marufhasan.hms.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<Integer> addRoom(@RequestParam("room") String roomJson,
                                           @RequestParam("image") MultipartFile image) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        Room room = mapper.readValue(roomJson, Room.class);

        room.setImage(image.getBytes());
        Integer id = roomService.add(room);
        return new ResponseEntity<>(id, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDetailsDTO> getRoomById(@PathVariable("id") int id) throws NotFoundException {
        return ResponseEntity.ok(roomService.getRoomById(id));
    }

    @GetMapping("/all")
    public ResponseEntity<List<RoomDetailsDTO>> getAllRooms(
            @RequestParam(required = true) LocalDate check_in,
            @RequestParam(required = true) LocalDate check_out,
            @RequestParam(required = false) Integer room_class_id,
            @RequestParam(required = false) Integer bed_type_id,
            @RequestParam(required = false) List<Integer> feature_id,
            @RequestParam(required = false) Integer floor,
            @RequestParam(required = false) Double min_price,
            @RequestParam(required = false) Double max_price,
            @RequestParam(required = false) Integer person_count

    ){
        return ResponseEntity.ok(roomService.getAll(check_in, check_out, room_class_id, bed_type_id, feature_id, floor, min_price, max_price, person_count));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<RoomDetailsDTO> updateRoom(@PathVariable("id") int id, @RequestBody Room room){
        room.setId(id);
        return new ResponseEntity<>(roomService.edit(room), HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRoom(@PathVariable("id") int id){
        roomService.delete(id);
        return new ResponseEntity<>("deleted", HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/getall")
    public ResponseEntity<?> getAll(){
        return new ResponseEntity<>(roomService.getRooms(), HttpStatus.OK);
    }
}
