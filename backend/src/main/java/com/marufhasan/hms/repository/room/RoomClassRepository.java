package com.marufhasan.hms.repository.room;

import com.marufhasan.hms.model.room.RoomClass;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@Repository
public class RoomClassRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void add(RoomClass roomClass) {
        String sql = "INSERT INTO room_class (name, base_price) VALUES (?, ?)";
        jdbcTemplate.update(sql, roomClass.getName(), roomClass.getBase_price());
    }

    public List<RoomClass> getAll() {
        String sql = "SELECT * FROM room_class";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(RoomClass.class));
    }

    public void delete(int id) {
        String sql = "DELETE FROM room_class WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public void edit(int id, RoomClass roomClass) {
        String sql = "UPDATE room_class SET name = ?, base_price = ? WHERE id = ?";
        jdbcTemplate.update(sql, roomClass.getName(), roomClass.getBase_price(), id);
    }
}
