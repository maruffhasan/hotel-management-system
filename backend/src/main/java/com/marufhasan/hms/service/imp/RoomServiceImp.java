package com.marufhasan.hms.service.imp;

import com.marufhasan.hms.DTO.RoomDetailsDTO;
import com.marufhasan.hms.exception.NotFoundException;
import com.marufhasan.hms.model.room.Room;
import com.marufhasan.hms.repository.room.RoomRepository;
import com.marufhasan.hms.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class RoomServiceImp implements RoomService {

    @Autowired
    RoomRepository roomRepository;

    @Override
    public List<RoomDetailsDTO> getAll(
            LocalDate check_in,
            LocalDate check_out,
            Integer room_class_id,
            Integer bed_type_id,
            List<Integer> featureIds,
            Integer floor,
            Double min_price,
            Double max_price,
            Integer person_count) {
        return roomRepository.getAllRooms(check_in, check_out, room_class_id, bed_type_id, featureIds, floor, min_price, max_price, person_count);
    }

    @Override
    public RoomDetailsDTO getRoomById(int id) throws NotFoundException {
        Optional<RoomDetailsDTO> roomDetailsDTO = roomRepository.getRoomDetailsById(id);
        if (roomDetailsDTO.isPresent()) {
            return roomDetailsDTO.get();
        } else {
            throw new NotFoundException("This room is not present");
        }
    }

    @Override
    public Integer add(Room room) {
        return roomRepository.add(room);
    }

    @Override
    public RoomDetailsDTO edit(Room room) {
        roomRepository.edit(room);
        return roomRepository.getRoomDetailsById(room.getId()).get();
    }

    @Override
    public void delete(int id) {
        roomRepository.delete(id);
    }
}
