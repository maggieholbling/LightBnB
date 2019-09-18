INSERT INTO users (name, email, password) 
VALUES ('Dan', 'd@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Mandy', 'm@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
('Ramon', 'r@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1, 'title', 'description', 'thumbnail_photo_url', 'cover_photo_url', 100, 9, 4, 1, 'canada', 'street', 'vancouver', 'province', 'V3M2U2', true),
(2, 'title', 'description', 'thumbnail_photo_url', 'cover_photo_url', 200, 4, 4, 1, 'canada', 'street', 'vancouver', 'province', 'V3M2U2', true),
(3, 'title', 'description', 'thumbnail_photo_url', 'cover_photo_url', 100, 9, 4, 1, 'canada', 'street', 'vancouver', 'province', 'V3M2U2', true);

INSERT INTO reservations (guest_id, property_id, start_date, end_date) 
VALUES (1, 1, '2018-09-11', '2018-09-26'),
(2, 2, '2019-01-04', '2019-02-01'),
(3, 3, '2021-10-01', '2021-10-14');

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message) 
VALUES (1, 1, 1, 3, 'message'),
(2, 2, 2, 5, 'message'),
(2, 3, 3, 1, 'message');