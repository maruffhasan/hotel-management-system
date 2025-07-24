package com.marufhasan.hms.repository.room;

import com.marufhasan.hms.DTO.ReviewDTO;
import com.marufhasan.hms.DTO.RoomDetailsDTO;
import com.marufhasan.hms.model.booking.Review;
import com.marufhasan.hms.model.room.Feature;
import com.marufhasan.hms.model.room.Room;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
                    r.image,
                
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
                        rs.getString("image"),

                        rs.getInt("room_class_id"),
                        rs.getString("room_class_name"),
                        rs.getDouble("base_price"),

                        rs.getInt("bed_type_id"),
                        rs.getString("bed_type_name"),
                        rs.getDouble("price_per_bed"),

                        rs.getInt("room_status_id"),
                        rs.getString("room_status_name"),

                        getAllFeatures(rs.getInt("room_class_id")),
                        null,
                        getAllReviews(rs.getInt("id"))
                ), id);
            return  Optional.of(roomDetailsDTO);

        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public List<RoomDetailsDTO> getAllRooms(
            LocalDate check_in,
            LocalDate check_out,
            Integer room_class_id,
            Integer bed_type_id,
            List<Integer> featureIds,
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
                r.image,

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
            WHERE r.id NOT IN (
                      SELECT room_id FROM booking_room br
                      JOIN booking b ON br.booking_id = b.id
                      WHERE
                      (check_in < ? AND check_out > ?)
                    )
        """);


        List<Object> params = new ArrayList<>();
        params.add(check_out);
        params.add(check_in);


        if (room_class_id != null) {
            sql.append(" AND rc.id = ?");
            params.add(room_class_id);
        }

        if (bed_type_id != null) {
            sql.append(" AND bt.id = ?");
            params.add(bed_type_id);
        }


        if (featureIds != null && !featureIds.isEmpty()) {
            String placeholders = featureIds.stream().map(id -> "?").collect(Collectors.joining(", "));
            sql.append("""
                    AND EXISTS (
                        SELECT 1 FROM room_class_feature rcf
                            WHERE rcf.room_class_id = rc.id
                              AND rcf.feature_id IN (""" + placeholders + """
                            )
                        GROUP BY rcf.room_class_id
                        HAVING COUNT(DISTINCT rcf.feature_id) = ?
                    )"""
            );
            params.addAll(featureIds);
            params.add(featureIds.size());
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
                    rs.getString("image"),

                    rs.getInt("room_class_id"),
                    rs.getString("room_class_name"),
                    rs.getDouble("base_price"),

                    rs.getInt("bed_type_id"),
                    rs.getString("bed_type_name"),
                    rs.getDouble("price_per_bed"),

                    rs.getInt("room_status_id"),
                    rs.getString("room_status_name"),

                    getAllFeatures(rs.getInt("room_class_id")),
                    null,
                    getAllReviews(rs.getInt("id"))
            );

            return dto;
        });
    }

    private List<ReviewDTO> getAllReviews(int id) {
        String sql = """
                    SELECT re.id, u.first_name || ' ' || u.last_name AS "name", re.rating, re.comment
                    FROM users u
                    JOIN review re ON re.user_email = u.email
                    JOIN room r ON r.id = re.room_id
                    WHERE r.id = ?
                """;
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(ReviewDTO.class), id);
    }

    public List<Feature> getAllFeatures(int room_class_id) {
        String sql = """
                            SELECT f.id, f.name, f.price_per_use
                            FROM room_class_feature rcf
                            JOIN feature f ON rcf.feature_id = f.id
                            WHERE rcf.room_class_id = ?
                        """;
        return jdbcTemplate.query(sql, new Object[]{room_class_id}, (rs, rowNum) -> new Feature(
                    rs.getInt("id"),
                    rs.getString("name"),
                    rs.getDouble("price_per_use")
            ));
    }

    public Integer add(Room room) {
        String sql =
                """
                INSERT INTO room 
                (room_class_id, bed_type_id, room_status_id, image, floor, bed_count)
                VALUES (?, ?, ?, ?, ?, ?) RETURNING id
                 """;
        return jdbcTemplate.queryForObject(
                sql,
                new Object[] {
                        room.getRoom_class_id(),
                        room.getBed_type_id(),
                        room.getRoom_status_id(),
                        room.getImage(),
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
            if (room.getImage() != null) {
                sql.append("image = ?, ");
                params.add(room.getImage());
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

    public List<Room> getRooms() {
        String sql = "SELECT * FROM room";
        return jdbcTemplate.query(sql, new BeanPropertyRowMapper<>(Room.class));
    }
}
