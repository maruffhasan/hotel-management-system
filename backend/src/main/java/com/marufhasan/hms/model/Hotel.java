package com.marufhasan.hms.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Hotel {
    @JsonInclude(JsonInclude.Include.NON_NULL)
    private Integer id;
    private String name;
    private String address;
    private String city;
    private String zip;
    private String country;
    private String phone;
    private String email;
}
