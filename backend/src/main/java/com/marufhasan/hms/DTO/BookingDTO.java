package com.marufhasan.hms.DTO;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.marufhasan.hms.model.booking.Addon;
import com.marufhasan.hms.model.booking.Booking;
import com.marufhasan.hms.model.room.Room;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.LocalDate;
import java.util.List;


@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BookingDTO extends Booking {


    private List<RoomDetailsDTO> rooms;
    private List<Integer> roomIds;

    private List<Addon> addons;
    private List<Integer> addonIds;

    private String booker_name;
    private String booker_email;
//    List<Service> services;
}
