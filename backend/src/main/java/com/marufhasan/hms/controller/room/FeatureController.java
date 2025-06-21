package com.marufhasan.hms.controller.room;

import com.marufhasan.hms.model.room.Feature;
import com.marufhasan.hms.model.room.RoomClass;
import com.marufhasan.hms.repository.room.FeatureRepository;
import com.marufhasan.hms.repository.room.RoomClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/feature")
public class FeatureController {

    @Autowired
    private FeatureRepository featureRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addFeature(@RequestBody Feature feature){
        featureRepository.add(feature);
        return new ResponseEntity<>("added", HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Feature>> getAllFeature(){
        return new ResponseEntity<>(featureRepository.getAll(), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFeature(@PathVariable int id){
        featureRepository.delete(id);
        return new ResponseEntity<>("deleted", HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFeature(@PathVariable int id, @RequestBody Feature feature){
        feature.setId(id);
        featureRepository.edit(feature);
        return new ResponseEntity<>("edited", HttpStatus.OK);
    }
}
