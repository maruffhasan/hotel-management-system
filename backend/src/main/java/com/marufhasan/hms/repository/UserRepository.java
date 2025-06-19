package com.marufhasan.hms.repository;

import com.marufhasan.hms.model.User;
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
}
