package com.marufhasan.hms.DTO;

import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RoomDetailsDTO {
    private int id;
    private int floor;
    private int bed_count;
    private String image_url;

    private int room_class_id;
    private String room_class_name;
    private Double base_price;

    private int bed_type_id;
    private String bed_type_name;
    private Double price_per_bed;

    private int room_status_id;
    private String room_status_name;

    List<FeatureDTO> features;
}
