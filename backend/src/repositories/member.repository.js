import Member from '../models/Member.model.js';

export class MemberRepository {
  async findAll({ page = 1, limit = 10, search = '', filter = {} } = {}) {
    const skip = (page - 1) * limit;
    const query = { ...filter };
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }
    const [data, total] = await Promise.all([
      Member.find(query).populate('family', 'familyName').skip(skip).limit(limit).sort({ createdAt: -1 }),
      Member.countDocuments(query),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id) { return Member.findById(id).populate('family'); }
  async create(data) { return Member.create(data); }
  async update(id, data) { return Member.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('family'); }
  async delete(id) { return Member.findByIdAndDelete(id); }
  async count() { return Member.countDocuments(); }
  async findRecent(limit = 5) { return Member.find().sort({ createdAt: -1 }).limit(limit).populate('family', 'familyName'); }
}

export default new MemberRepository();
