import Ministry from '../models/Ministry.model.js';

export class MinistryRepository {
  async findAll({ page = 1, limit = 10, search = '' } = {}) {
    const skip = (page - 1) * limit;
    const query = search ? { name: { $regex: search, $options: 'i' } } : {};
    const [data, total] = await Promise.all([
      Ministry.find(query)
        .populate('leader', 'firstName lastName')
        .populate('members', 'firstName lastName profilePhoto')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Ministry.countDocuments(query),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id) {
    return Ministry.findById(id)
      .populate('leader', 'firstName lastName email phone')
      .populate('members', 'firstName lastName email phone profilePhoto membershipStatus');
  }

  async create(data) { return Ministry.create(data); }

  async update(id, data) {
    return Ministry.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('leader', 'firstName lastName')
      .populate('members', 'firstName lastName profilePhoto');
  }

  async delete(id) { return Ministry.findByIdAndDelete(id); }
  async count() { return Ministry.countDocuments(); }

  async assignMember(ministryId, memberId) {
    return Ministry.findByIdAndUpdate(ministryId, { $addToSet: { members: memberId } }, { new: true });
  }

  async removeMember(ministryId, memberId) {
    return Ministry.findByIdAndUpdate(ministryId, { $pull: { members: memberId } }, { new: true });
  }
}

export default new MinistryRepository();
