import jwt from 'jsonwebtoken';

const JWT_SECRET = '123k321';

// Verifies JWT token
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!authHeader) {
        console.warn('No Authorization header');
        return res.sendStatus(401);
    }

    if (!token) {
        console.warn('Authorization header exists but no token found:', authHeader);
        return res.sendStatus(401);
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Invalid JWT:', err.message);
            return res.sendStatus(403);
        }

        req.user = user;
        console.log('Authenticated user:', user);
        next();
    });
}
