CREATE DATABASE hms;

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

INSERT INTO hotel(name, address, city, zip, country, phone, email)
VALUES ('Hotel Sheraton', '1/3 Gulshan', 'Dhaka', '1990', 'Bangladesh', '01888888888', 'hotel@hotel.com');

CREATE TABLE users (
   email VARCHAR(255) PRIMARY KEY,
   first_name VARCHAR(100) NOT NULL,
   last_name VARCHAR(100) NOT NULL,
   password VARCHAR(255) NOT NULL,
   role VARCHAR(50) NOT NULL
);


CREATE TABLE room_class (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    base_price NUMERIC(10, 2) NOT NULL
);

-- Sample insert (already included base_price)
INSERT INTO room_class (name, base_price) VALUES
('Standard', 100.00),
('Deluxe', 150.00),
('Suite', 250.00),
('Family', 200.00),
('Presidential', 500.00);




CREATE TABLE feature (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL UNIQUE,
     price_per_use NUMERIC(10,2) NOT NULL DEFAULT 0
);

-- Sample insert with prices
INSERT INTO feature (name, price_per_use) VALUES
('Sea View', 20.00),
('Mini Bar', 15.00),
('Air Conditioning', 10.00),
('Balcony', 12.00),
('Smart TV', 8.00),
('Jacuzzi', 30.00),
('Free Wi-Fi', 0.00),
('Kitchenette', 25.00);



CREATE TABLE bed_type (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL UNIQUE,
  max_person int,
  price_per_bed NUMERIC(10,2) NOT NULL DEFAULT 0
);

-- Sample insert with prices
INSERT INTO bed_type (name, max_person, price_per_bed) VALUES
('Single', 1, 20.00),
('Double', 2, 35.00),
('Queen', 2, 40.00),
('King', 2, 50.00),
('Twin', 2, 30.00);





CREATE TABLE room_class_feature (
    room_class_id INT REFERENCES room_class(id),
    feature_id INT REFERENCES feature(id),
    PRIMARY KEY (room_class_id, feature_id)
);

ALTER TABLE room_class_feature
ADD CONSTRAINT rc_id_delete
FOREIGN KEY (room_class_id) REFERENCES room_class(id)
ON DELETE CASCADE;

ALTER TABLE room_class_feature
ADD CONSTRAINT fc_id_delete
FOREIGN KEY (feature_id) REFERENCES feature(id)
ON DELETE CASCADE;

-- Step 1: Drop the existing constraint
ALTER TABLE room_class_feature
DROP CONSTRAINT room_class_feature_room_class_id_fkey;

-- Step 2: Add it back with ON DELETE CASCADE
ALTER TABLE room_class_feature
ADD CONSTRAINT room_class_feature_room_class_id_fkey
FOREIGN KEY (room_class_id) REFERENCES room_class(id)
ON DELETE CASCADE;


-- Standard
INSERT INTO room_class_feature (room_class_id, feature_id) VALUES
(1, 3),  -- Air Conditioning
(1, 7);  -- Free Wi-Fi

-- Deluxe
INSERT INTO room_class_feature (room_class_id, feature_id) VALUES
(2, 1),  -- Sea View
(2, 3),  -- Air Conditioning
(2, 4),  -- Balcony
(2, 5);  -- Smart TV

-- Suite
INSERT INTO room_class_feature (room_class_id, feature_id) VALUES
(3, 1),
(3, 2),
(3, 4),
(3, 6),
(3, 5),
(3, 7);

-- Family
INSERT INTO room_class_feature (room_class_id, feature_id) VALUES
(4, 3),
(4, 7),
(4, 8);

-- Presidential
INSERT INTO room_class_feature (room_class_id, feature_id) VALUES
(5, 1),
(5, 2),
(5, 4),
(5, 5),
(5, 6),
(5, 7),
(5, 8);


CREATE TABLE room_status (
     id SERIAL PRIMARY KEY,
     status VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO room_status (status) VALUES
('Available'),
('Occupied'),
('Maintenance'),
('Cleaning'),
('Reserved'),
('Out of Service');



CREATE TABLE room (
      id SERIAL PRIMARY KEY,
      room_class_id INT NOT NULL REFERENCES room_class(id),
      bed_type_id INT NOT NULL REFERENCES bed_type(id),
      bed_count INT NOT NULL CHECK (bed_count > 0),
      room_status_id INT NOT NULL REFERENCES room_status(id),
      floor INT NOT NULL CHECK (floor >= 0)
);


ALTER TABLE room
ADD COLUMN image_url TEXT;

-- Step 1: Drop NOT NULL constraints
ALTER TABLE room ALTER COLUMN room_class_id DROP NOT NULL;
ALTER TABLE room ALTER COLUMN bed_type_id DROP NOT NULL;
ALTER TABLE room ALTER COLUMN room_status_id DROP NOT NULL;

-- Step 2: Drop existing foreign key constraints
ALTER TABLE room DROP CONSTRAINT room_room_class_id_fkey;
ALTER TABLE room DROP CONSTRAINT room_bed_type_id_fkey;
ALTER TABLE room DROP CONSTRAINT room_room_status_id_fkey;

-- Step 3: Re-add foreign key constraints with ON DELETE SET NULL
ALTER TABLE room
ADD CONSTRAINT room_room_class_id_fkey
FOREIGN KEY (room_class_id) REFERENCES room_class(id) ON DELETE SET NULL;

ALTER TABLE room
ADD CONSTRAINT room_bed_type_id_fkey
FOREIGN KEY (bed_type_id) REFERENCES bed_type(id) ON DELETE SET NULL;

ALTER TABLE room
ADD CONSTRAINT room_room_status_id_fkey
FOREIGN KEY (room_status_id) REFERENCES room_status(id) ON DELETE SET NULL;



-- Deluxe Room with 1 King bed
INSERT INTO room (room_class_id, bed_type_id, bed_count, room_status_id, floor)
VALUES (2, 4, 1, 1, 2);  -- Deluxe, King, Available, 2nd floor

-- Family Room with 2 Double beds
INSERT INTO room (room_class_id, bed_type_id, bed_count, room_status_id, floor)
VALUES (4, 2, 2, 1, 2);  -- Family, Double, Available

-- Standard Room with 1 Queen, Occupied
INSERT INTO room (room_class_id, bed_type_id, bed_count, room_status_id, floor)
VALUES (1, 3, 1, 2, 1);  -- Standard, Queen, Occupied

-- Presidential Room with 2 King Beds
INSERT INTO room (room_class_id, bed_type_id, bed_count, room_status_id, floor)
VALUES (5, 4, 2, 1, 4);  -- Presidential, 2 Kings, Available

-- Standard (base_price: 100)
INSERT INTO room (room_class_id, bed_type_id, bed_count, room_status_id, floor) VALUES
(1, 3, 1, 1, 1),  -- R1: Queen, Available
(1, 2, 1, 2, 1),  -- R2: Double, Occupied
(1, 1, 2, 1, 1),  -- R3: 2 Singles, Available
(1, 5, 1, 4, 2),  -- R4: Twin, Cleaning

-- Deluxe (base_price: 150)
(2, 4, 1, 1, 2),  -- R5: King, Available
(2, 3, 1, 2, 2),  -- R6: Queen, Occupied
(2, 1, 1, 5, 2),  -- R7: Single, Reserved
(2, 4, 1, 3, 2),  -- R8: King, Maintenance

-- Suite (base_price: 250)
(3, 4, 1, 1, 3),  -- R9: King, Available
(3, 5, 2, 1, 3),  -- R10: 2 Twins, Available
(3, 2, 2, 6, 3),  -- R11: 2 Doubles, Out of Service
(3, 1, 1, 2, 3),  -- R12: Single, Occupied

-- Family (base_price: 200)
(4, 2, 2, 1, 2),  -- R13: 2 Doubles, Available
(4, 3, 1, 4, 2),  -- R14: Queen, Cleaning
(4, 1, 2, 5, 2),  -- R15: 2 Singles, Reserved
(4, 2, 2, 1, 1),  -- R16: 2 Doubles, Available

-- Presidential (base_price: 500)
(5, 4, 2, 1, 4),  -- R17: 2 Kings, Available
(5, 4, 1, 2, 4),  -- R18: King, Occupied
(5, 3, 1, 3, 4),  -- R19: Queen, Maintenance
(5, 1, 2, 6, 4);  -- R20: 2 Singles, Out of Service


-- Create table
CREATE TABLE addon (
   id SERIAL PRIMARY KEY,
   name VARCHAR(100) NOT NULL,
   price NUMERIC(10, 2) NOT NULL
);

-- Insert sample data
INSERT INTO addon (name, price) VALUES
('Extra Pillow', 5.00),
('Breakfast', 10.50),
('Late Checkout', 15.00),
('Airport Pickup', 25.00),
('Spa Access', 30.00);



CREATE TABLE booking (
     id TEXT PRIMARY KEY,
     user_email TEXT,
     check_in DATE NOT NULL,
     check_out DATE NOT NULL,
     price NUMERIC(10, 2) NOT NULL,
     CONSTRAINT fk_user_email FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE SET NULL
);

CREATE TABLE booking_addon (
       booking_id TEXT NOT NULL,
       addon_id INTEGER NOT NULL,
       PRIMARY KEY (booking_id, addon_id),
       CONSTRAINT fk_booking FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE CASCADE,
       CONSTRAINT fk_addon FOREIGN KEY (addon_id) REFERENCES addon(id) ON DELETE CASCADE
);

CREATE TABLE booking_room (
      booking_id TEXT NOT NULL,
      room_id INTEGER NOT NULL,
      PRIMARY KEY (booking_id, room_id),
      CONSTRAINT fk_booking_room_booking FOREIGN KEY (booking_id) REFERENCES booking(id) ON DELETE CASCADE,
      CONSTRAINT fk_booking_room_room FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE CASCADE
);

CREATE TABLE review (
        id SERIAL PRIMARY KEY,
        user_email VARCHAR(255),
        room_id INT,
        rating INT CHECK (rating BETWEEN 1 AND 5),
        comment TEXT,

        FOREIGN KEY (user_email) REFERENCES users(email) ON DELETE SET NULL,
        FOREIGN KEY (room_id) REFERENCES room(id) ON DELETE SET NULL
);

ALTER TABLE booking ADD COLUMN booking_date DATE;
