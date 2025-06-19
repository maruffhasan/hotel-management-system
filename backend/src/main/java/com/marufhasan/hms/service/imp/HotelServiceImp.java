package com.marufhasan.hms.service.imp;

import com.marufhasan.hms.model.Hotel;
import com.marufhasan.hms.repository.HotelRepository;
import com.marufhasan.hms.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HotelServiceImp implements HotelService {

    @Autowired
    private HotelRepository hotelRepository;

    @Override
    public Hotel getDetails() {
        Hotel hotel = hotelRepository.getDetails();
        hotel.setId(null);
        return hotel;
    }

    @Override
    public void editDetails(Hotel hotel) {
        hotelRepository.updateHotel(hotel);
    }
}
