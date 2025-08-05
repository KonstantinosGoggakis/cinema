import express from 'express';
import { authenticateToken } from './middleware/auth.js';
import { userRoutes } from './routes/user.js';
import { cinemaRoutes } from './routes/cinema.js';
import { reservationRoutes } from './routes/reservation.js';

const app = express();
app.use(express.json());

// Define base paths for clarity and REST best practices
app.use(userRoutes);
app.use(cinemaRoutes);
app.use(reservationRoutes(authenticateToken)); // auth required

app.listen(3000, () => {
    console.log('Server is up on http://192.168.1.10:3000');
});