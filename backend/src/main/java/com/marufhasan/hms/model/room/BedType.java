package com.marufhasan.hms.model.room;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BedType {
    Integer id;
    String name;
    Integer max_person;
    Double price_per_bed;
}
