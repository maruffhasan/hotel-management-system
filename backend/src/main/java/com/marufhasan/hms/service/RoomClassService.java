package com.marufhasan.hms.service;

import com.marufhasan.hms.DTO.RoomClassDTO;
import com.marufhasan.hms.exception.NotFoundException;
import com.marufhasan.hms.model.room.RoomClass;

import java.util.List;

public interface RoomClassService {
    Integer add(RoomClassDTO roomClassDTO);

    List<RoomClassDTO> getAll();

    void delete(int id);

    void edit(RoomClassDTO roomClassDTO);

    RoomClassDTO getById(int id) throws NotFoundException;
}
