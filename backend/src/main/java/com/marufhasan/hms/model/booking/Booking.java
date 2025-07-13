package com.marufhasan.hms.model.booking;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Booking {

    private String id;
    private String email;
    private LocalDate booking_date;
    private LocalDate check_in;
    private LocalDate check_out;
    private Double price;
}
