-- Create Database
CREATE DATABASE hms;

-- Table: hotel
CREATE TABLE hotel (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(100) NOT NULL,
                       address VARCHAR(255) NOT NULL,
                       city VARCHAR(100) NOT NULL,
                       zip VARCHAR(20),
                       country VARCHAR(100) NOT NULL,
                       phone VARCHAR(20),
                       email VARCHAR(255)
);

-- Table: users
CREATE TABLE users (
                       email VARCHAR(255) PRIMARY KEY,
                       first_name VARCHAR(100) NOT NULL,
                       last_name VARCHAR(100) NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(50) NOT NULL,
                       enabled BOOLEAN DEFAULT TRUE
);

-- Table: room_class
CREATE TABLE room_class (
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(100) NOT NULL UNIQUE,
                            base_price NUMERIC(10, 2) NOT NULL
);

-- Table: feature
CREATE TABLE feature (
                         id SERIAL PRIMARY KEY,
                         name VARCHAR(100) NOT NULL UNIQUE,
                         price_per_use NUMERIC(10,2) NOT NULL DEFAULT 0
);

-- Table: bed_type
CREATE TABLE bed_type (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR(50) NOT NULL UNIQUE,
                          max_person INT,
                          price_per_bed NUMERIC(10,2) NOT NULL DEFAULT 0
);

-- Table: room_class_feature (junction table)
CREATE TABLE room_class_feature (
                                    room_class_id INT,
                                    feature_id INT,
                                    PRIMARY KEY (room_class_id, feature_id),
                                    CONSTRAINT room_class_feature_room_class_id_fkey
                                        FOREIGN KEY (room_class_id)
                                            REFERENCES room_class(id)
                                            ON DELETE CASCADE,
                                    CONSTRAINT room_class_feature_feature_id_fkey
                                        FOREIGN KEY (feature_id)
                                            REFERENCES feature(id)
                                            ON DELETE CASCADE
);

-- Table: room_status
CREATE TABLE room_status (
                             id SERIAL PRIMARY KEY,
                             status VARCHAR(50) NOT NULL UNIQUE
);

-- Table: room
CREATE TABLE room (
                      id SERIAL PRIMARY KEY,
                      room_class_id INT,
                      bed_type_id INT,
                      bed_count INT CHECK (bed_count > 0),
                      room_status_id INT,
                      floor INT CHECK (floor >= 0),
                      image BYTEA,
                      CONSTRAINT room_room_class_id_fkey
                          FOREIGN KEY (room_class_id)
                              REFERENCES room_class(id)
                              ON DELETE SET NULL,
                      CONSTRAINT room_bed_type_id_fkey
                          FOREIGN KEY (bed_type_id)
                              REFERENCES bed_type(id)
                              ON DELETE SET NULL,
                      CONSTRAINT room_room_status_id_fkey
                          FOREIGN KEY (room_status_id)
                              REFERENCES room_status(id)
                              ON DELETE SET NULL
);

-- Table: addon
CREATE TABLE addon (
                       id SERIAL PRIMARY KEY,
                       name VARCHAR(100) NOT NULL,
                       price NUMERIC(10, 2) NOT NULL
);

-- Table: booking
CREATE TABLE booking (
                         id TEXT PRIMARY KEY,
                         user_email TEXT,
                         check_in DATE NOT NULL,
                         check_out DATE NOT NULL,
                         price NUMERIC(10, 2) NOT NULL,
                         booking_date DATE,
                         CONSTRAINT fk_user_email FOREIGN KEY (user_email)
                             REFERENCES users(email)
                             ON DELETE SET NULL
);

-- Table: booking_addon (junction table)
CREATE TABLE booking_addon (
                               booking_id TEXT NOT NULL,
                               addon_id INT NOT NULL,
                               PRIMARY KEY (booking_id, addon_id),
                               CONSTRAINT fk_booking FOREIGN KEY (booking_id)
                                   REFERENCES booking(id)
                                   ON DELETE CASCADE,
                               CONSTRAINT fk_addon FOREIGN KEY (addon_id)
                                   REFERENCES addon(id)
                                   ON DELETE CASCADE
);

-- Table: booking_room (junction table)
CREATE TABLE booking_room (
                              booking_id TEXT NOT NULL,
                              room_id INT NOT NULL,
                              PRIMARY KEY (booking_id, room_id),
                              CONSTRAINT fk_booking_room_booking FOREIGN KEY (booking_id)
                                  REFERENCES booking(id)
                                  ON DELETE CASCADE,
                              CONSTRAINT fk_booking_room_room FOREIGN KEY (room_id)
                                  REFERENCES room(id)
                                  ON DELETE CASCADE
);

-- Table: review
CREATE TABLE review (
                        id SERIAL PRIMARY KEY,
                        user_email VARCHAR(255),
                        room_id INT,
                        rating INT CHECK (rating BETWEEN 1 AND 5),
                        comment TEXT,
                        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
                        FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE SET NULL,
                        FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE SET NULL
);
