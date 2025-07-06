package com.marufhasan.hms.controller.room;

import com.marufhasan.hms.model.room.RoomStatus;
import com.marufhasan.hms.repository.room.RoomStatusRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/room-status")
public class RoomStatusController {

    @Autowired
    private RoomStatusRepository roomStatusRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<String> createRoomStatus(@RequestBody RoomStatus roomStatus){
        roomStatusRepository.add(roomStatus);
        return new ResponseEntity<>("added", HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<RoomStatus>> getAllRoomStatus(){
        return ResponseEntity.ok(roomStatusRepository.getAll());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoomStatus(@PathVariable int id){
        roomStatusRepository.delete(id);
        return new ResponseEntity<>("deleted", HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<String> updateRoomStatus(@PathVariable int id, @RequestBody RoomStatus roomStatus){
        roomStatusRepository.edit(id, roomStatus);
        return new ResponseEntity<>("updated", HttpStatus.OK);
    }
}
