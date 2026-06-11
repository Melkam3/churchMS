import Family from '../models/Family.model.js';

export class FamilyRepository {
  async findAll({ page = 1, limit = 10, search = '' } = {}) {
    const skip = (page - 1) * limit;
    const query = search ? { familyName: { $regex: search, $options: 'i' } } : {};
    const [data, total] = await Promise.all([
      Family.find(query)
        .populate('headOfFamily', 'firstName lastName')
        .populate('members', 'firstName lastName profilePhoto')
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 }),
      Family.countDocuments(query),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id) {
    return Family.findById(id)
      .populate('headOfFamily', 'firstName lastName phone')
      .populate('members', 'firstName lastName email phone profilePhoto membershipStatus');
  }

  async create(data) { return Family.create(data); }

  async update(id, data) {
    return Family.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('headOfFamily', 'firstName lastName')
      .populate('members', 'firstName lastName profilePhoto');
  }

  async delete(id) { return Family.findByIdAndDelete(id); }
  async count() { return Family.countDocuments(); }

  async addMember(familyId, memberId) {
    return Family.findByIdAndUpdate(familyId, { $addToSet: { members: memberId } }, { new: true });
  }

  async removeMember(familyId, memberId) {
    return Family.findByIdAndUpdate(familyId, { $pull: { members: memberId } }, { new: true });
  }
}

export default new FamilyRepository();
