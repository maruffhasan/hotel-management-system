package com.marufhasan.hms.service.imp;

import com.marufhasan.hms.DTO.RoomClassDTO;
import com.marufhasan.hms.exception.NotFoundException;
import com.marufhasan.hms.model.room.Feature;
import com.marufhasan.hms.model.room.RoomClass;
import com.marufhasan.hms.repository.room.RoomClassRepository;
import com.marufhasan.hms.service.RoomClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.text.html.Option;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class RoomClassServiceImp implements RoomClassService {

    @Autowired
    private RoomClassRepository roomClassRepository;

    @Override
    public Integer add(RoomClassDTO roomClassDTO) {
        Integer roomId = roomClassRepository.add(roomClassDTO);

        if (roomClassDTO.getFeatures_id() != null) {
            for (Integer featureId : roomClassDTO.getFeatures_id()) {
                roomClassRepository.addRoomClassFeature(roomId, featureId);
            }
        }
        return roomId;
    }

    @Override
    public List<RoomClassDTO> getAll() {
        List<RoomClassDTO> roomClssses = roomClassRepository.getAll();
        for (RoomClassDTO roomClassDTO : roomClssses) {
            roomClassDTO.setFeatures(roomClassRepository.getFeatures(roomClassDTO.getId()));
        }
        return roomClssses;
    }

    @Override
    public void delete(int id) {
        roomClassRepository.delete(id);
    }

    @Override
    public void edit(RoomClassDTO roomClassDTO) {
        ArrayList<Integer> addId = new ArrayList<>();
        ArrayList<Integer> deleteID = new ArrayList<>();
        RoomClassDTO present = roomClassRepository.getById(roomClassDTO.getId()).get();

        if (roomClassDTO.getFeatures_id() != null) {
            for (Integer featureId : roomClassDTO.getFeatures_id()) {
                if (!present.getFeatures().contains(featureId)) {
                    addId.add(featureId);
                }
            }

            for (Integer featureId : roomClassDTO.getFeatures_id()) {

            }
        }
        roomClassRepository.edit(roomClassDTO);
    }

    @Override
    public RoomClassDTO getById(int id) throws NotFoundException {
        Optional<RoomClassDTO> roomClassDTO = roomClassRepository.getById(id);
        if (!roomClassDTO.isPresent()) {
            throw new NotFoundException("Room class not found with this id : " + id);
        }
        roomClassDTO.get().setFeatures(roomClassRepository.getFeatures(roomClassDTO.get().getId()));
        return roomClassDTO.get();
    }
}
