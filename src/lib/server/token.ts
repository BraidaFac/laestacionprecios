import { JWT_SECRET_KEY } from '$env/static/private';
import jwt from 'jsonwebtoken';

// Función para generar JWT
export const signJWT = (payload: object, options: jwt.SignOptions) => {
	return jwt.sign(payload, JWT_SECRET_KEY, options);
};

// Función para verificar JWT
export const verifyJWT = <T>(token: string): T | null => {
	return jwt.verify(token, JWT_SECRET_KEY) as T;
};
