package com.marufhasan.hms.DTO;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.marufhasan.hms.model.booking.Review;
import com.marufhasan.hms.model.room.Feature;
import lombok.*;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RoomDetailsDTO {
    private Integer id;
    private Integer floor;
    private Integer bed_count;
    private String image_url;

    private Integer room_class_id;
    private String room_class_name;
    private Double base_price;

    private Integer bed_type_id;
    private String bed_type_name;
    private Double price_per_bed;

    private Integer room_status_id;
    private String room_status_name;

    List<Feature> features;
    List<Integer> features_ids;

    List<ReviewDTO> reviews;
}
