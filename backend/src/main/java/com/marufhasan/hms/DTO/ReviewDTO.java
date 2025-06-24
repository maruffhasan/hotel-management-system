package com.marufhasan.hms.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReviewDTO {
    private int id;
    private String name;
    private Integer rating;
    private String comment;
}
