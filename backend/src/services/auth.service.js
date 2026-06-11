import userRepository from '../repositories/user.repository.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';

class AuthService {
  async register(data) {
    const existing = await userRepository.findByEmail(data.email);
    if (existing) throw new Error('Email already registered');
    const user = await userRepository.create(data);
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    return { user, accessToken, refreshToken };
  }

  async login(email, password) {
    const user = await userRepository.findByEmail(email);
    if (!user || !user.isActive) throw new Error('Invalid credentials');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error('Invalid credentials');
    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);
    return { user, accessToken, refreshToken };
  }

  async getMe(id) {
    const user = await userRepository.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  }
}

export default new AuthService();
