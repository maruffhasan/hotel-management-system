INSERT INTO room_class (name, base_price) VALUES
                                              ('Standard', 100.00),
                                              ('Deluxe', 150.00),
                                              ('Suite', 250.00),
                                              ('Family', 200.00),
                                              ('Presidential', 500.00);

INSERT INTO feature (name, price_per_use) VALUES
                                              ('Sea View', 20.00),
                                              ('Mini Bar', 15.00),
                                              ('Air Conditioning', 10.00),
                                              ('Balcony', 12.00),
                                              ('Smart TV', 8.00),
                                              ('Jacuzzi', 30.00),
                                              ('Free Wi-Fi', 0.00),
                                              ('Kitchenette', 25.00);

INSERT INTO bed_type (name, max_person, price_per_bed) VALUES
                                                           ('Single', 1, 20.00),
                                                           ('Double', 2, 35.00),
                                                           ('Queen', 2, 40.00),
                                                           ('King', 2, 50.00),
                                                           ('Twin', 2, 30.00);

INSERT INTO room_status (status) VALUES
                                     ('Available'),
                                     ('Occupied'),
                                     ('Maintenance'),
                                     ('Cleaning'),
                                     ('Reserved'),
                                     ('Out of Service');

-- Standard
INSERT INTO room_class_feature (room_class_id, feature_id) VALUES (1, 3), (1, 7);  -- Air Conditioning, Wi-Fi

-- Deluxe
INSERT INTO room_class_feature (room_class_id, feature_id) VALUES (2, 1), (2, 3), (2, 4), (2, 5); -- Sea View, AC, Balcony, TV

-- Suite
INSERT INTO room_class_feature (room_class_id, feature_id) VALUES (3, 1), (3, 2), (3, 4), (3, 6), (3, 5), (3, 7);

-- Family
INSERT INTO room_class_feature (room_class_id, feature_id) VALUES (4, 3), (4, 7), (4, 8);

-- Presidential
INSERT INTO room_class_feature (room_class_id, feature_id) VALUES
                                                               (5, 1), (5, 2), (5, 4), (5, 5), (5, 6), (5, 7), (5, 8);


-- Standard Rooms
INSERT INTO room (room_class_id, bed_type_id, bed_count, room_status_id, floor) VALUES
                                                                                    (1, 3, 1, 1, 1),  -- Queen, Available
                                                                                    (1, 2, 1, 2, 1),  -- Double, Occupied
                                                                                    (1, 1, 2, 1, 1),  -- 2 Singles, Available
                                                                                    (1, 5, 1, 4, 2);  -- Twin, Cleaning

-- Deluxe Rooms
INSERT INTO room (room_class_id, bed_type_id, bed_count, room_status_id, floor) VALUES
                                                                                    (2, 4, 1, 1, 2),
                                                                                    (2, 3, 1, 2, 2),
                                                                                    (2, 1, 1, 5, 2),
                                                                                    (2, 4, 1, 3, 2);

-- Suite Rooms
INSERT INTO room (room_class_id, bed_type_id, bed_count, room_status_id, floor) VALUES
                                                                                    (3, 4, 1, 1, 3),
                                                                                    (3, 5, 2, 1, 3),
                                                                                    (3, 2, 2, 6, 3),
                                                                                    (3, 1, 1, 2, 3);

-- Family Rooms
INSERT INTO room (room_class_id, bed_type_id, bed_count, room_status_id, floor) VALUES
                                                                                    (4, 2, 2, 1, 2),
                                                                                    (4, 3, 1, 4, 2),
                                                                                    (4, 1, 2, 5, 2),
                                                                                    (4, 2, 2, 1, 1);

-- Presidential Rooms
INSERT INTO room (room_class_id, bed_type_id, bed_count, room_status_id, floor) VALUES
                                                                                    (5, 4, 2, 1, 4),
                                                                                    (5, 4, 1, 2, 4),
                                                                                    (5, 3, 1, 3, 4),
                                                                                    (5, 1, 2, 6, 4);
INSERT INTO addon (name, price) VALUES
                                    ('Extra Pillow', 5.00),
                                    ('Breakfast', 10.50),
                                    ('Late Checkout', 15.00),
                                    ('Airport Pickup', 25.00),
                                    ('Spa Access', 30.00),
                                    ('Gym Access', 12.00),
                                    ('Parking', 7.00),
                                    ('Pet Stay', 20.00);
