package com.marufhasan.hms.controller.room;

import com.marufhasan.hms.exception.Response;
import com.marufhasan.hms.model.room.BedType;
import com.marufhasan.hms.repository.room.BedTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bed-type")
public class BedTypeController {

    @Autowired
    private BedTypeRepository bedTypeRepository;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/add")
    public ResponseEntity<String> addBedType(@RequestBody BedType bedType){
        bedTypeRepository.add(bedType);
        return new ResponseEntity<>("added",HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<BedType>> getAllBedType(){
        return ResponseEntity.ok(bedTypeRepository.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<BedType> getBedTypeById(@PathVariable("id") int id){
        return ResponseEntity.ok(bedTypeRepository.getBedTypeById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBedType(@PathVariable("id") int id){
        bedTypeRepository.delete(id);
        return new ResponseEntity<>("deleted",HttpStatus.OK);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping("/{id}")
    public ResponseEntity<String> updateBedType(@PathVariable("id") int id, @RequestBody BedType bedType){
        bedType.setId(id);
        bedTypeRepository.edit(bedType);
        return new ResponseEntity<>("updated",HttpStatus.OK);
    }
}
