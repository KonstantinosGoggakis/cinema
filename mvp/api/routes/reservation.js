import express from 'express';
import { db } from '../db.js';

export function reservationRoutes(authMiddleware) {
    const router = express.Router();

    // Create reservation
    router.post('/reservations', authMiddleware, (req, res) => {
        const { cinema_id, movie_id, date, time, seat_numbers } = req.body;
        const user_id = req.user.user_id;

        console.log('Creating reservation:', { user_id, cinema_id, movie_id, date, time, seat_numbers });

        if (!user_id || !cinema_id || !movie_id || !date || !time || !seat_numbers) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        db.query(
            'INSERT INTO reservations (user_id, cinema_id, movie_id, date, time, seat_numbers) VALUES (?, ?, ?, ?, ?, ?)',
            [user_id, cinema_id, movie_id, date, time, seat_numbers],
            (err, result) => {
                if (err) {
                    console.error('DB Error:', err.code, err.sqlMessage);
                    return res.status(500).json({ error: 'Database error', code: err.code, message: err.sqlMessage });
                }
                res.json({ message: 'Reservation made', id: result.insertId });
            }
        );
    });

    // Update reservation (date, time, seat_numbers)
    router.put('/reservations/:id', authMiddleware, (req, res) => {
        const { date, time, seat_numbers } = req.body;
        const reservation_id = req.params.id;
        const user_id = req.user.user_id;

        if (!date || !time || !seat_numbers) {
            return res.status(400).json({ error: 'Missing fields for update' });
        }

        db.query(
            'UPDATE reservations SET date = ?, time = ?, seat_numbers = ? WHERE reservation_id = ? AND user_id = ?',
            [date, time, seat_numbers, reservation_id, user_id],
            (err, result) => {
                if (err) {
                    console.error('Update error:', err.code, err.sqlMessage);
                    return res.status(500).json({ error: 'Database error', code: err.code, message: err.sqlMessage });
                }

                if (result.affectedRows === 0) {
                    return res.status(403).json({ error: 'Update failed (unauthorized or not found)' });
                }

                res.json({ message: 'Reservation updated' });
            }
        );
    });

    // Delete reservation
    router.delete('/reservations/:id', authMiddleware, (req, res) => {
        const reservation_id = req.params.id;
        const user_id = req.user.user_id;

        db.query(
            'DELETE FROM reservations WHERE reservation_id = ? AND user_id = ?',
            [reservation_id, user_id],
            (err, result) => {
                if (err) {
                    console.error('Delete error:', err.code, err.sqlMessage);
                    return res.status(500).json({ error: 'Database error', code: err.code, message: err.sqlMessage });
                }

                if (result.affectedRows === 0) {
                    return res.status(403).json({ error: 'Delete failed (unauthorized or not found)' });
                }

                res.json({ message: 'Reservation deleted' });
            }
        );
    });

    // Get reservations for logged-in user (with cinema and movie info)
    router.get('/user/reservations', authMiddleware, (req, res) => {
        const user_id = req.user.user_id;

        db.query(
            `SELECT r.*, c.name AS cinema_name, m.title AS movie_title
             FROM reservations r
             JOIN cinemas c ON r.cinema_id = c.cinema_id
             JOIN movies m ON r.movie_id = m.movie_id
             WHERE r.user_id = ?`,
            [user_id],
            (err, results) => {
                if (err) {
                    console.error('Fetch error:', err.code, err.sqlMessage);
                    return res.status(500).json({ error: 'Database error', code: err.code, message: err.sqlMessage });
                }

                res.json(results);
            }
        );
    });

    return router;
}
