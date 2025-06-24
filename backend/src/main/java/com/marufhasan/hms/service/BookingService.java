package com.marufhasan.hms.service;

import com.marufhasan.hms.DTO.BookingDTO;
import com.marufhasan.hms.exception.NotFoundException;
import com.marufhasan.hms.model.booking.Booking;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {
    String add(BookingDTO bookingDTO);

    List<Booking> getLogs(LocalDate from, LocalDate to);

    BookingDTO getDetails(String  id) throws NotFoundException;
}
