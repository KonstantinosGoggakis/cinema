CREATE DATABASE IF NOT EXISTS kgongakis22b_db1;
USE kgongakis22b_db1;
-- Drop tables in order to avoid FK conflicts
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS movies;
DROP TABLE IF EXISTS cinemas;
DROP TABLE IF EXISTS users;
-- Users table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(256) NOT NULL
);
-- Cinemas table
CREATE TABLE cinemas (
    cinema_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(100) NOT NULL,
    description TEXT
);
-- Movies table
CREATE TABLE movies (
    movie_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    genre VARCHAR(100),
    -- added based on your insertions
    description TEXT,
    cinema_id INT NOT NULL,
    rating DECIMAL(3, 1),
    -- rating on a 0-10 scale
    FOREIGN KEY (cinema_id) REFERENCES cinemas(cinema_id) ON DELETE CASCADE
);
-- Reservations table
CREATE TABLE reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    cinema_id INT NOT NULL,
    movie_id INT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    seat_numbers VARCHAR(255) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (cinema_id) REFERENCES cinemas(cinema_id) ON DELETE CASCADE,
    FOREIGN KEY (movie_id) REFERENCES movies(movie_id) ON DELETE CASCADE
);
-- Insert Users with hashed passwords (example hashes)
INSERT INTO users (name, email, password)
VALUES (
        'Panagiwta',
        'panagiwta@lada.com',
        '9b8769a4a742959a2d0298c36fb70623f2dfacda8436237df08d8dfd5b37374c'
    ),
    (
        'Giorgos',
        'giorgos@gmail.com',
        '1d4598d1949b47f7f211134b639ec32238ce73086a83c2f745713b3f12f817e5'
    );
-- Insert Cinemas
INSERT INTO cinemas (name, location, description)
VALUES ('Orfeas Cinema', 'Corfu', 'Godzilla'),
    ('The Village Cinema', 'Patras', 'Transporter 2'),
    ('The Mall Cinema', 'Thessaloniki', 'Toy Story 3'),
    ('The Village Cinema', 'Heraklion', 'Alien 2'),
    ('Parafeas Cinema', 'Athens', 'Grand Turismo 2');
-- Insert Movies (note: cinema_id must reference existing cinemas)
INSERT INTO movies (title, genre, description, cinema_id, rating)
VALUES (
        'Godzilla',
        'Action',
        'A giant monster awakens.',
        1,
        7.3
    ),
    (
        'Transporter 2',
        'Thriller',
        'Frank is back with more speed.',
        2,
        6.8
    ),
    (
        'Toy Story 3',
        'Animation',
        'The toys are back in town.',
        3,
        8.3
    ),
    (
        'Alien 2',
        'Sci-Fi',
        'Ripley fights again.',
        4,
        8.1
    ),
    (
        'Grand Turismo 2',
        'Racing',
        'High-octane racing simulation.',
        5,
        7.5
    );
-- Insert Reservations
INSERT INTO reservations (
        user_id,
        cinema_id,
        movie_id,
        date,
        time,
        seat_numbers
    )
VALUES (1, 1, 1, '2025-05-15', '20:00:00', 'A1,A2'),
    (2, 2, 2, '2025-05-16', '19:00:00', 'B3,B4'),
    (1, 3, 3, '2025-05-20', '18:30:00', 'C1,C2,C3'),
    (
        2,
        4,
        4,
        '2025-05-21',
        '21:00:00',
        'D1,D2,D3,D4,D5'
    );