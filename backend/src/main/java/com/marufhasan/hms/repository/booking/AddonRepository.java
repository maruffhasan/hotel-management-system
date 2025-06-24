package com.marufhasan.hms.repository.booking;

import com.marufhasan.hms.exception.NotFoundException;
import com.marufhasan.hms.model.booking.Addon;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class AddonRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Integer save(Addon addon) {
        String sql = "INSERT INTO addon (name, price) VALUES (?, ?) RETURNING id";
        return jdbcTemplate.queryForObject(sql, new Object[]{
                addon.getName(),
                addon.getPrice()
        }, Integer.class);
    }

    public List<Addon> getAll() {
        String sql = "SELECT * FROM addon";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Addon.class));
    }

    public Addon getById(int id) throws NotFoundException {
        String sql = "SELECT * FROM addon WHERE id = ?";
        try {
            return jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(Addon.class), id);
        } catch (Exception e) {
            throw new NotFoundException("addon with id " + id + " not found!");
        }
    }

    public Addon edit(Addon addon) {
        String sql = "UPDATE addon SET name = ?, price = ? WHERE id = ? RETURNING *";
        return jdbcTemplate.queryForObject(sql, new Object[] {
                addon.getName(),
                addon.getPrice(),
                addon.getId()
        }, new BeanPropertyRowMapper<>(Addon.class));
    }

    public void delete(int id) {
        String sql = "DELETE FROM addon WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}
