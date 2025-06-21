package com.marufhasan.hms.repository.room;

import com.marufhasan.hms.DTO.RoomClassDTO;
import com.marufhasan.hms.model.room.Feature;
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
import java.util.Optional;

@Repository
public class RoomClassRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Integer add(RoomClassDTO roomClassDTO) {
        String sql = "INSERT INTO room_class (name, base_price) VALUES (?, ?) RETURNING id";
        return jdbcTemplate.queryForObject(
                sql,
                new Object[] {
                        roomClassDTO.getName(),
                        roomClassDTO.getBase_price()
                },
                Integer.class
        );
    }

    public List<RoomClassDTO> getAll() {
        String sql = "SELECT * FROM room_class";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(RoomClassDTO.class));
    }

    public void delete(int id) {
        String sql = "DELETE FROM room_class WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }

    public void edit(RoomClassDTO roomClassDTO) {
        String sql = "UPDATE room_class SET name = ?, base_price = ? WHERE id = ?";
        jdbcTemplate.update(sql, roomClassDTO.getName(), roomClassDTO.getBase_price(), roomClassDTO.getId());
    }

    public void addRoomClassFeature(Integer id, Integer id1) {
        String sql = "INSERT INTO room_class_feature (room_class_id, feature_id) VALUES (?, ?)";
        jdbcTemplate.update(sql, id, id1);
    }

    public void deleteRoomClassFeature(Integer id, Integer id1) {
        String sql = "DELETE FROM room_class_feature WHERE room_class_id = ? AND feature_id = ?";
        jdbcTemplate.update(sql, id, id1);
    }

    public Optional<RoomClassDTO> getById(int id) {
        try {
            String sql = "SELECT * FROM room_class WHERE id = ?";
            RoomClassDTO roomClassDTO = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(RoomClassDTO.class), id);
            return Optional.ofNullable(roomClassDTO);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public List<Feature> getFeatures(Integer id) {
        String sql = """
                SELECT f.id, f.name, f.price_per_use
                FROM feature f
                JOIN room_class_feature rcf ON rcf.feature_id = f.id
                JOIN room_class rc ON rc.id = rcf.room_class_id
                WHERE rc.id = ?
                """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Feature.class), id);
    }
}
