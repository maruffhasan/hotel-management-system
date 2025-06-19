package com.marufhasan.hms.model;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Room {
    private int id;
    private int room_class_id;
    private int bed_type_id;
    private int room_status_id;
    private String image_url;
    private int floor;
    private int bed_count;
}
