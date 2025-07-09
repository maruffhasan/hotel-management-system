package com.marufhasan.hms.service;

import com.marufhasan.hms.DTO.RoomDetailsDTO;
import com.marufhasan.hms.exception.NotFoundException;
import com.marufhasan.hms.model.room.Room;

import java.time.LocalDate;
import java.util.List;

public interface RoomService {
    List<RoomDetailsDTO> getAll(
            LocalDate check_in,
            LocalDate check_out,
            Integer room_class_id,
            Integer bed_type_id,
            List<Integer> featuresId,
            Integer floor,
            Double min_price,
            Double max_price,
            Integer person_count);

    RoomDetailsDTO getRoomById(int id) throws NotFoundException;

    Integer add(Room room);

    RoomDetailsDTO edit(Room room);

    void delete(int id);
}
