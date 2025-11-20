import jwt from 'jsonwebtoken';

export function generateTokens(user) {
  const accessToken = jwt.sign(
    { id: user._id, role: user.role },
    process.env.ACCESS_SECRET || 'access-secret',
    { expiresIn: process.env.ACCESS_EXPIRES || '15m' }
  );
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_SECRET || 'refresh-secret',
    { expiresIn: process.env.REFRESH_EXPIRES || '7d' }
  );
  return { accessToken, refreshToken };
}
