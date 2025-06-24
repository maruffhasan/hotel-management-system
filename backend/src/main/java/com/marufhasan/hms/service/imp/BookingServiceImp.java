package com.marufhasan.hms.service.imp;

import com.marufhasan.hms.DTO.BookingDTO;
import com.marufhasan.hms.exception.NotFoundException;
import com.marufhasan.hms.model.booking.Booking;
import com.marufhasan.hms.repository.booking.BookingRepository;
import com.marufhasan.hms.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
public class BookingServiceImp implements BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public String add(BookingDTO bookingDTO) {
        String randomNumber = String.format("%05d", new Random().nextInt(100000));
        String bookingId = "BKG-" + LocalDate.now().format(DateTimeFormatter.BASIC_ISO_DATE) + "-" + randomNumber;
        bookingDTO.setId(bookingId);
        bookingRepository.save(bookingDTO);

        if (bookingDTO.getAddonIds() != null) {
            for (Integer addonId : bookingDTO.getAddonIds()) {
                bookingRepository.addBookingAddon(bookingId, addonId);
            }
        }
        if (bookingDTO.getRoomIds() != null) {
            for (Integer roomId : bookingDTO.getRoomIds()) {
                bookingRepository.addBookingRoom(bookingId, roomId);
            }
        }
        return bookingId;
    }

    @Override
    public List<Booking> getLogs(LocalDate from, LocalDate to) {
        return bookingRepository.getLogs(from, to);
    }

    @Override
    public BookingDTO getDetails(String id) throws NotFoundException {
         if(bookingRepository.getDetails(id).isPresent()) {
             BookingDTO bookingDTO = bookingRepository.getDetails(id).get();
             bookingDTO.setRooms(bookingRepository.getRooms(id));
             bookingDTO.setAddons(bookingRepository.getAddons(id));
             return bookingDTO;
         } else {
             throw new NotFoundException("Booking with id " + id + " not found");
         }
    }
}
