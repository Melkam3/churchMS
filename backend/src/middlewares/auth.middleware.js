import { verifyToken } from '../utils/generateToken.js';
import userRepository from '../repositories/user.repository.js';

export const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) return res.status(401).json({ success: false, message: 'Not authorized' });
    const decoded = verifyToken(token);
    const user = await userRepository.findById(decoded.id);
    if (!user || !user.isActive) return res.status(401).json({ success: false, message: 'Not authorized' });
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};
