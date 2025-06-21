package com.marufhasan.hms.model.room;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Room {
    private Integer id;
    private Integer room_class_id;
    private Integer bed_type_id;
    private Integer room_status_id;
    private String image_url;
    private Integer floor;
    private Integer bed_count;
}
