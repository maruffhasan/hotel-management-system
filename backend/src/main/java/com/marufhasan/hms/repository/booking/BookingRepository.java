package com.marufhasan.hms.repository.booking;

import com.marufhasan.hms.DTO.BookingDTO;
import com.marufhasan.hms.DTO.RoomDetailsDTO;
import com.marufhasan.hms.exception.NotFoundException;
import com.marufhasan.hms.model.booking.Addon;
import com.marufhasan.hms.model.booking.Booking;
import com.marufhasan.hms.repository.room.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Repository
public class BookingRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    public void save(BookingDTO bookingDTO) {
        String sql = "INSERT INTO booking (id, user_email, check_in, check_out, booking_date, price) VALUES (?, ?, ?, ?, ?, ?)";
        jdbcTemplate.update(sql,
                bookingDTO.getId(),
                bookingDTO.getEmail(),
                bookingDTO.getCheck_in(),
                bookingDTO.getCheck_out(),
                bookingDTO.getBooking_date(),
                bookingDTO.getPrice());
    }

    public List<Booking> getLogs(LocalDate from, LocalDate to) {
        String sql = """
                        SELECT * FROM 
                        booking b JOIN users u ON b.user_email = u.email
                        WHERE b.booking_date >= ? AND b.booking_date <= ?
                      """;
        return jdbcTemplate.query(sql, new Object[]{
                from,
                to
        }, new BeanPropertyRowMapper<>(Booking.class));
    }

    public List<Booking> getBookingsForUser(String email) {
        String sql = """
                        SELECT * FROM 
                        booking JOIN users ON booking.user_email = users.email
                        WHERE email = ?
                      """;
        return jdbcTemplate.query(sql, new Object[]{email}, new BeanPropertyRowMapper<>(Booking.class));
    }

    public void addBookingAddon(String bookingId, Integer addonId) {
        String sql = "INSERT INTO booking_addon (booking_id, addon_id) VALUES (?, ?)";
        jdbcTemplate.update(sql, bookingId, addonId);
    }

    public void addBookingRoom(String bookingId, Integer roomId) {
        String sql = "INSERT INTO booking_room (booking_id, room_id) VALUES (?, ?)";
        jdbcTemplate.update(sql, bookingId, roomId);
    }

    public Optional<BookingDTO> getDetails(String id) {
        try {
            String sql = """
                        SELECT  (u.first_name || ' ' || u.last_name) AS booker_name, u.email AS booker_email, b.check_in, b.check_out, b.price, b.booking_date
                        FROM booking b 
                        JOIN users u on u.email = b.user_email 
                        WHERE b.id = ?
                        """;
            BookingDTO bookingDTO = jdbcTemplate.queryForObject(sql, new Object[]{
                    id
            }, new BeanPropertyRowMapper<>(BookingDTO.class));

            return Optional.of(bookingDTO);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    @Autowired
    private RoomRepository roomRepository;
    public List<RoomDetailsDTO> getRooms(String id) {
        String sql = """
                SELECT room_id
                FROM booking_room JOIN booking b ON b.id = booking_room.booking_id
                WHERE b.id = ? 
                """;
        List<Integer> roomIds = jdbcTemplate.queryForList(sql, new Object[]{id}, Integer.class);
        List<RoomDetailsDTO> rooms = new ArrayList<>();
        for (Integer roomId : roomIds) {
            rooms.add(roomRepository.getRoomDetailsById(roomId).get());
        }
        return rooms;
    }

    @Autowired
    private AddonRepository addonRepository;
    public List<Addon> getAddons(String id) throws NotFoundException {
        String sql = """
                SELECT addon_id
                FROM booking_addon JOIN booking b ON b.id = booking_addon.booking_id
                WHERE b.id = ?
                """;
        List<Integer> addonIds = jdbcTemplate.queryForList(sql, new Object[] {id}, Integer.class);
        List<Addon> addons = new ArrayList<>();
        for (Integer addonId : addonIds) {
            addons.add(addonRepository.getById(addonId));
        }
        return addons;
    }

    public int bookingCount(String email, Integer id) {
        String sql = """
                SELECT COUNT(*)
                FROM users u
                JOIN booking b ON u.email = b.user_email
                JOIN booking_room br ON b.id = br.booking_id
                JOIN room r ON br.room_id = r.id
                WHERE u.email = ? AND r.id = ?
                """;
        return jdbcTemplate.queryForObject(sql, new Object[]{email, id}, Integer.class);
    }
}
