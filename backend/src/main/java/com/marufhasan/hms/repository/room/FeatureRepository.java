package com.marufhasan.hms.repository.room;

import com.marufhasan.hms.model.room.Feature;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class FeatureRepository {
    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void add(Feature feature){
        String sql = "INSERT INTO feature (name, price_per_use) VALUES (?, ?)";
        jdbcTemplate.update(sql, feature.getName(), feature.getPrice_per_use());
    }

    public List<Feature> getAll() {
        String sql = "SELECT * FROM feature";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Feature.class));
    }

    public void delete(int id) {
        String sql = "DELETE FROM feature WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public void edit(Feature feature) {
        String sql = "UPDATE feature SET name = ?, price_per_use = ? WHERE id = ?";
        jdbcTemplate.update(sql, feature.getName(), feature.getPrice_per_use(), feature.getId());
    }
}
