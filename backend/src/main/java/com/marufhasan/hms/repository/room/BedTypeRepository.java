package com.marufhasan.hms.repository.room;

import com.marufhasan.hms.model.room.BedType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class BedTypeRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;


    public void add(BedType bedType) {
        String sql = "INSERT INTO bed_type (name, max_person, price_per_bed) VALUES (?, ?, ?)";
        jdbcTemplate.update(sql, bedType.getName(), bedType.getMax_person(), bedType.getPrice_per_bed());
    }

    public List<BedType> getAll() {
        String sql = "SELECT * FROM bed_type";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(BedType.class));
    }


    public BedType getBedTypeById(int id) {
        String sql = "SELECT * FROM bed_type WHERE id = ?";
        return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(BedType.class), id);
    }


    public void delete(int id) {
        String sql = "DELETE FROM bed_type WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public void edit(BedType bedType) {
        String sql = "UPDATE bed_type SET name = ?, max_person = ?, price_per_bed = ? WHERE id = ?";
        jdbcTemplate.update(sql, bedType.getName(), bedType.getMax_person(), bedType.getPrice_per_bed(),     bedType.getId());
    }


}
