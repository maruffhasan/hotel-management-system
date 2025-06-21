package com.marufhasan.hms.DTO;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.marufhasan.hms.model.room.Feature;
import com.marufhasan.hms.model.room.RoomClass;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RoomClassDTO extends RoomClass {
    Integer id;
    String name;
    Double base_price;
    List<Feature> features;
    List<Integer> features_id;
}
