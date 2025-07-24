package com.marufhasan.hms.DTO;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ReviewDTO {
    private int id;
    private String name;
    private Integer rating;
    private String comment;
    private LocalDateTime created_at;

    private Integer room_id;
    private Integer room_class_id;
}
