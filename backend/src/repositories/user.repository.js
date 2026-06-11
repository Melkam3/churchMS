import User from '../models/User.model.js';

export class UserRepository {
  async findById(id) { return User.findById(id); }
  async findByEmail(email) { return User.findOne({ email }); }
  async create(data) { return User.create(data); }
  async update(id, data) { return User.findByIdAndUpdate(id, data, { new: true, runValidators: true }); }
  async delete(id) { return User.findByIdAndDelete(id); }
  async findAll() { return User.find(); }
}

export default new UserRepository();
