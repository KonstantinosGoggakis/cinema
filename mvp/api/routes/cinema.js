import express from 'express';
import { db } from '../db.js';

const router = express.Router();

router.get('/cinema', (req, res) => {
    db.query('SELECT * FROM cinemas', (err, results) => {
        if (err) return res.status(500).json({ error: 'Failed to load cinemas' });
        res.json(results);
    });
});

router.get('/cinema/:cinemaId/movies', (req, res) => {
  const cinemaId = req.params.cinemaId;

  db.query(
    'SELECT * FROM movies WHERE cinema_id = ?',
    [cinemaId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to load movies' });
      }
      res.json(results);
    }
  );
});

router.get('/cinema/:cinemaId/movies', (req, res) => {
  const cinemaId = req.params.cinemaId;

  db.query(
    'SELECT * FROM movies WHERE cinema_id = ?',
    [cinemaId],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to load movies' });
      }
      res.json(results);
    }
  );
});

export { router as cinemaRoutes };
