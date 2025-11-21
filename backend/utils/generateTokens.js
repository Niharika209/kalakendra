import jwt from 'jsonwebtoken';

export function generateTokens(payload) {
  // payload should be { id, role }
  const accessToken = jwt.sign(
    { id: payload.id, role: payload.role },
    process.env.ACCESS_SECRET || 'access-secret',
    { expiresIn: process.env.ACCESS_EXPIRES || '15m' }
  );
  const refreshToken = jwt.sign(
    { id: payload.id, role: payload.role },
    process.env.REFRESH_SECRET || 'refresh-secret',
    { expiresIn: process.env.REFRESH_EXPIRES || '7d' }
  );
  return { accessToken, refreshToken };
}
