package com.marufhasan.hms.repository;

import com.marufhasan.hms.model.Hotel;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class HotelRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Hotel getDetails() {
        String sql = "select * from hotel";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(Hotel.class));
    }

    public void updateHotel(Hotel updated) {
        StringBuilder sql = new StringBuilder("UPDATE hotel SET ");
        List<Object> params = new ArrayList<>();

        if (updated.getName() != null) {
            sql.append("name = ?, ");
            params.add(updated.getName());
        }
        if (updated.getAddress() != null) {
            sql.append("address = ?, ");
            params.add(updated.getAddress());
        }
        if (updated.getCity() != null) {
            sql.append("city = ?, ");
            params.add(updated.getCity());
        }
        if (updated.getZip() != null) {
            sql.append("zip = ?, ");
            params.add(updated.getZip());
        }
        if (updated.getCountry() != null) {
            sql.append("country = ?, ");
            params.add(updated.getCountry());
        }
        if (updated.getPhone() != null) {
            sql.append("phone = ?, ");
            params.add(updated.getPhone());
        }
        if (updated.getEmail() != null) {
            sql.append("email = ?, ");
            params.add(updated.getEmail());
        }

        if (params.isEmpty()) return; // nothing to update

        // remove trailing comma
        sql.setLength(sql.length() - 2);

        jdbcTemplate.update(sql.toString(), params.toArray());
    }
}
