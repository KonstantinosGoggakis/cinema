## 🧩 Features

### 👥 User Authentication
- Register and login with email/password
- Secure JWT-based authentication

### 📍 Cinema Management
- List cinemas
- Search by name or location

### 🎥 Movie & Seat Booking
- Select movie, time, and seats
- Book, update, or cancel reservations

### 🙍 User Dashboard
- View booking history
- Manage future reservations

---

## 🛠 Tech Stack

| Layer       | Technology        |
|-------------|-------------------|
| Frontend    | React Native (Expo) |
| Backend     | Node.js, Express   |
| Database    | MariaDB            |
| Tools       | Postman, GitHub    |

---

## 🔌 REST API Endpoints

| Method | Endpoint                | Description                      |
|--------|-------------------------|----------------------------------|
| POST   | `/register`             | Register a new user              |
| POST   | `/login`                | Authenticate user and get token  |
| GET    | `/cinemas`              | List all cinemas                 |
| GET    | `/movies?cinema_id=ID`  | Get movies for a cinema          |
| POST   | `/reservations`         | Create a reservation             |
| PUT    | `/reservations/:id`     | Modify a reservation             |
| DELETE | `/reservations/:id`     | Delete a reservation             |
| GET    | `/user/reservations`    | User’s reservation history       |

---

## 🗃 Database 

### Tables

- **Users**: `user_id`, `name`, `email`, `password`
- **Cinemas**: `cinema_id`, `name`, `location`, `description`
- **Movies**: `movie_id`, `title`, `genre`, `description`, `cinema_id`,`rating`.
- **Reservations**: `reservation_id`, `user_id`, `movie_id`, `cinema_id`, `date`, `time`, `seat_numbers`

---

## 🚀 Running the App

### . Setup 
```bash
cd mvp/api
npm install
node server.js

# Create a .env file with your DB and JWT details
npm start

### 2. FrontEnd ('mvp/table-reservation-app')
cd mvp/table-reservation-app
npm install
npx expo start

