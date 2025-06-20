package com.marufhasan.hms.controller.room;

import com.marufhasan.hms.model.room.RoomClass;
import com.marufhasan.hms.repository.room.RoomClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/room-class")
public class RoomClassController {

    @Autowired
    private RoomClassRepository roomClassRepository;

    @PostMapping("/add")
    public ResponseEntity<String> createRoomStatus(@RequestBody RoomClass roomClass){
        roomClassRepository.add(roomClass);
        return new ResponseEntity<>("added", HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<RoomClass>> getAllRoomClasses(){
        return ResponseEntity.ok(roomClassRepository.getAll());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoomStatus(@PathVariable int id){
        roomClassRepository.delete(id);
        return new ResponseEntity<>("deleted", HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateRoomStatus(@PathVariable int id, @RequestBody RoomClass roomClass){
        roomClassRepository.edit(id, roomClass);
        return new ResponseEntity<>("updated", HttpStatus.OK);
    }
}
