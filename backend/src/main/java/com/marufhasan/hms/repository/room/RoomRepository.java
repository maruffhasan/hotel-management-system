package com.marufhasan.hms.repository.room;

import com.marufhasan.hms.DTO.FeatureDTO;
import com.marufhasan.hms.DTO.RoomDetailsDTO;
import com.marufhasan.hms.model.room.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class RoomRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public Optional<RoomDetailsDTO> getRoomDetailsById(int id) {
        String sql = """
                SELECT
                    r.id,
                    r.floor,
                    r.bed_count,
                    r.image_url,
                
                    r.room_class_id,
                    rc.name AS room_class_name,
                    rc.base_price,
                
                    r.bed_type_id,
                    bt.name AS bed_type_name,
                    bt.price_per_bed,
                
                    r.room_status_id,
                    rs.status AS room_status_name
                
                FROM room r
                JOIN room_class rc ON r.room_class_id = rc.id
                JOIN bed_type bt ON r.bed_type_id = bt.id
                JOIN room_status rs ON r.room_status_id = rs.id
                WHERE r.id = ?
                """;
        try {
            RoomDetailsDTO roomDetailsDTO = jdbcTemplate.queryForObject(sql, (rs, rowNum) -> new RoomDetailsDTO(
                        rs.getInt("id"),
                        rs.getInt("floor"),
                        rs.getInt("bed_count"),
                        rs.getString("image_url"),

                        rs.getInt("room_class_id"),
                        rs.getString("room_class_name"),
                        rs.getDouble("base_price"),

                        rs.getInt("bed_type_id"),
                        rs.getString("bed_type_name"),
                        rs.getDouble("price_per_bed"),

                        rs.getInt("room_status_id"),
                        rs.getString("room_status_name"),

                        getAllFeatures(rs.getInt("id")),
                        null
                ), id);
            return  Optional.of(roomDetailsDTO);

        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public List<RoomDetailsDTO> getAllRooms(
            Integer room_class_id,
            Integer bed_type_id,
            Integer room_status_id,
            Integer floor,
            Double min_price,
            Double max_price,
            Integer person_count
    ) {
        StringBuilder sql = new StringBuilder("""
            SELECT 
                r.id,
                r.floor,
                r.bed_count,
                r.image_url,

                rc.id AS room_class_id,
                rc.name AS room_class_name,
                rc.base_price,

                bt.id AS bed_type_id,
                bt.name AS bed_type_name,
                bt.price_per_bed,

                rs.id AS room_status_id,
                rs.status AS room_status_name
            FROM room r
            JOIN room_class rc ON r.room_class_id = rc.id
            JOIN bed_type bt ON r.bed_type_id = bt.id
            JOIN room_status rs ON r.room_status_id = rs.id
            WHERE 1=1
        """);


        List<Object> params = new ArrayList<>();

        if (room_class_id != null) {
            sql.append(" AND rc.id = ?");
            params.add(room_class_id);
        }

        if (bed_type_id != null) {
            sql.append(" AND bt.id = ?");
            params.add(bed_type_id);
        }

        if (room_status_id != null) {
            sql.append(" AND rs.id = ?");
            params.add(room_status_id);
        }

        if (floor != null) {
            sql.append(" AND r.floor = ?");
            params.add(floor);
        }

        if (min_price != null) {
            sql.append(" AND rc.base_price >= ?");
            params.add(min_price);
        }

        if (max_price != null) {
            sql.append(" AND rc.base_price <= ?");
            params.add(max_price);
        }

        if (person_count != null) {
            sql.append(" AND r.bed_count * bt.max_person >= ?");
            params.add(person_count);
        }

        sql.append(" ORDER BY r.id");

        return jdbcTemplate.query(sql.toString(), params.toArray(), (rs, rowNum) -> {
            RoomDetailsDTO dto = new RoomDetailsDTO(
                    rs.getInt("id"),
                    rs.getInt("floor"),
                    rs.getInt("bed_count"),
                    rs.getString("image_url"),

                    rs.getInt("room_class_id"),
                    rs.getString("room_class_name"),
                    rs.getDouble("base_price"),

                    rs.getInt("bed_type_id"),
                    rs.getString("bed_type_name"),
                    rs.getDouble("price_per_bed"),

                    rs.getInt("room_status_id"),
                    rs.getString("room_status_name"),

                    getAllFeatures(rs.getInt("id")),
                    null
            );

            return dto;
        });
    }

    public List<FeatureDTO> getAllFeatures(int room_class_id) {
        String sql = """
                            SELECT f.id, f.name, f.price_per_use
                            FROM room_class_feature rcf
                            JOIN feature f ON rcf.feature_id = f.id
                            WHERE rcf.room_class_id = ?
                        """;
        return jdbcTemplate.query(sql, new Object[]{room_class_id}, (rs, rowNum) -> new FeatureDTO(
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getDouble("price_per_use")
            ));
    }

    public Integer add(Room room) {
        String sql =
                """
                INSERT INTO room 
                (room_class_id, bed_type_id, room_status_id, image_url, floor, bed_count)
                VALUES (?, ?, ?, ?, ?, ?) RETURNING id
                 """;
        return jdbcTemplate.queryForObject(
                sql,
                new Object[] {
                        room.getRoom_class_id(),
                        room.getBed_type_id(),
                        room.getRoom_status_id(),
                        room.getImage_url(),
                        room.getFloor(),
                        room.getBed_count()
                },
                Integer.class
        );
    }

    public void edit(Room room) {
            StringBuilder sql = new StringBuilder("UPDATE room SET ");
            List<Object> params = new ArrayList<>();

            if (room.getBed_type_id() != null) {
                sql.append("bed_type_id = ?, ");
                params.add(room.getBed_type_id());
            }
            if (room.getRoom_status_id() != null) {
                sql.append("room_status_id = ?, ");
                params.add(room.getRoom_status_id());
            }
            if (room.getImage_url() != null) {
                sql.append("image_url = ?, ");
                params.add(room.getImage_url());
            }
            if (room.getFloor() != null) {
                sql.append("floor = ?, ");
                params.add(room.getFloor());
            }
            if (room.getBed_count() != null) {
                sql.append("bed_count = ?, ");
                params.add(room.getBed_count());
            }

            // Remove trailing comma
            if (params.isEmpty()) return; // nothing to update

            sql.setLength(sql.length() - 2);

            sql.append(" WHERE id = ?");
            params.add(room.getId());

            jdbcTemplate.update(sql.toString(), params.toArray());
    }

    public void delete(int id) {
        String sql = "DELETE FROM room WHERE id = ?";
        jdbcTemplate.update(sql, id);
    }
}
