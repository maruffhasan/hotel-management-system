package com.marufhasan.hms.model.booking;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class Addon {
    private Integer id;
    private String name;
    private Double price;
}
