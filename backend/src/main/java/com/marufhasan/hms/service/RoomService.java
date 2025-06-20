package com.marufhasan.hms.service;

import com.marufhasan.hms.DTO.RoomDetailsDTO;
import com.marufhasan.hms.exception.NotFoundException;
import com.marufhasan.hms.model.room.Room;

import java.util.List;

public interface RoomService {
    List<RoomDetailsDTO> getAll(Integer room_class_id,
                                Integer bed_type_id,
                                Integer room_status_id,
                                Integer floor,
                                Double min_price,
                                Double max_price, Integer person_count);

    RoomDetailsDTO getRoomById(int id) throws NotFoundException;

    Integer add(Room room);

    RoomDetailsDTO edit(Room room);

    void delete(int id);
}
