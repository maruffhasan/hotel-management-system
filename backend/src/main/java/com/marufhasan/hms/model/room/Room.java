package com.marufhasan.hms.model.room;


import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Room {
    private Integer id;
    private Integer room_class_id;
    private Integer bed_type_id;
    private Integer room_status_id;
    private byte[] image_byte;
    private String image;
    private Integer floor;
    private Integer bed_count;
}
