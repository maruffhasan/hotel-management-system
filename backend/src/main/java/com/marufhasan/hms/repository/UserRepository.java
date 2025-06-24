package com.marufhasan.hms.repository;

import com.marufhasan.hms.DTO.ReviewDTO;
import com.marufhasan.hms.model.User;
import com.marufhasan.hms.model.booking.Review;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void add(User user) {
        String sql = """
                INSERT INTO users
                (email, first_name, last_name, password, role)
                VALUES (?, ?, ?, ?, ?)
                """;
        jdbcTemplate.update(sql, user.getEmail(), user.getFirst_name(), user.getLast_name(), user.getPassword(), user.getRole());
    }


    public Optional<User> getUser(String email) {
        try {
            String sql = """
                SELECT * FROM users 
                WHERE email = ?
                """;
            User user = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper<>(User.class), email);
            return Optional.ofNullable(user);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Integer postReview(Review review) {
        String sql = "INSERT INTO review (user_email, room_id, rating, comment) VALUES (?, ?, ?, ?) RETURNING id";
        return jdbcTemplate.queryForObject(sql, new Object[] {
                review.getUser_email(),
                review.getRoom_id(),
                review.getRating(),
                review.getComment()
        }, Integer.class);
    }

    public void editReview(String email, ReviewDTO reviewDTO) {
        String sql = """
                UPDATE review
                SET rating = ?, comment = ?
                WHERE user_email = ? AND id = ?
                """;
        jdbcTemplate.update(sql, reviewDTO.getRating(), reviewDTO.getComment(), email, reviewDTO.getId());
    }

    public void deleteReview(String email, Integer id) {
        String sql = "DELETE FROM review WHERE user_email = ? AND id = ?";
        jdbcTemplate.update(sql, email, id);
    }
}
