package com.marufhasan.hms.controller.booking;

import com.marufhasan.hms.exception.NotFoundException;
import com.marufhasan.hms.model.booking.Addon;
import com.marufhasan.hms.repository.booking.AddonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/addon")
public class AddonController {

    @Autowired
    private AddonRepository addonRepository;

    @PostMapping("/add")
    public ResponseEntity<Integer> save(@RequestBody Addon addon) {
        return new ResponseEntity<>(addonRepository.save(addon), HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Addon>> getAll() {
        return ResponseEntity.ok(addonRepository.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Addon> getById(@PathVariable int id) throws NotFoundException {
        return ResponseEntity.ok(addonRepository.getById(id));
    }

    @PutMapping("{id}")
    public ResponseEntity<Addon> update(@PathVariable int id, @RequestBody Addon addon) {
        addon.setId(id);
        return ResponseEntity.ok(addonRepository.edit(addon));
    }

    @DeleteMapping("{id}")
    public ResponseEntity<?> delete(@PathVariable int id) {
        addonRepository.delete(id);
        return new ResponseEntity<>("deleted", HttpStatus.OK);
    }
}
