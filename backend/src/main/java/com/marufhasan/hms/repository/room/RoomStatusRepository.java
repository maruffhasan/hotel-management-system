package com.marufhasan.hms.repository.room;

import com.marufhasan.hms.model.room.RoomStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RoomStatusRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    public void add(RoomStatus roomStatus) {
        String sql = "INSERT INTO room_status (status) VALUES (?)";
        jdbcTemplate.update(sql, roomStatus.getStatus());
    }

    public List<RoomStatus> getAll() {
        String sql = "SELECT * FROM room_status";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(RoomStatus.class));
    }

    public void delete(int id) {
        String sql = "DELETE FROM room_status WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public void edit(int id, RoomStatus roomStatus) {
        String sql = "UPDATE room_status SET status = ? WHERE id = ?";
        jdbcTemplate.update(sql, roomStatus.getStatus(), id);
    }


}
