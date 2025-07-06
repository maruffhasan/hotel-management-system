package com.marufhasan.hms.controller.room;

import com.marufhasan.hms.DTO.RoomClassDTO;
import com.marufhasan.hms.exception.NotFoundException;
import com.marufhasan.hms.model.room.RoomClass;
import com.marufhasan.hms.repository.room.RoomClassRepository;
import com.marufhasan.hms.service.RoomClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/room-class")
public class RoomClassController {

    @Autowired
    private RoomClassService roomClassService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<Integer> createRoomStatus(@RequestBody RoomClassDTO roomClassDTO){
        return new ResponseEntity<>(roomClassService.add(roomClassDTO), HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<RoomClassDTO>> getAllRoomClasses(){
        return ResponseEntity.ok(roomClassService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomClassDTO> getRoomClassById(@PathVariable("id") int id) throws NotFoundException {
        return ResponseEntity.ok(roomClassService.getById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteRoomStatus(@PathVariable int id){
        roomClassService.delete(id);
        return new ResponseEntity<>("deleted", HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<String> updateRoomStatus(@PathVariable int id, @RequestBody RoomClassDTO roomClassDTO){
        roomClassDTO.setId(id);
        roomClassService.edit(roomClassDTO);
        return new ResponseEntity<>("updated", HttpStatus.OK);
    }
}
