import Attendance from '../models/Attendance.model.js';

export class AttendanceRepository {
  async findAll({ page = 1, limit = 20, memberId = null, date = null, status = null } = {}) {
    const skip = (page - 1) * limit;
    const query = {};
    if (memberId) query.member = memberId;
    if (date) {
      const start = new Date(date); start.setHours(0, 0, 0, 0);
      const end = new Date(date); end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }
    if (status) query.status = status;
    const [data, total] = await Promise.all([
      Attendance.find(query)
        .populate('member', 'firstName lastName profilePhoto')
        .populate('recordedBy', 'name')
        .skip(skip)
        .limit(limit)
        .sort({ date: -1 }),
      Attendance.countDocuments(query),
    ]);
    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async findById(id) {
    return Attendance.findById(id)
      .populate('member', 'firstName lastName')
      .populate('recordedBy', 'name');
  }

  async create(data) { return Attendance.create(data); }

  async update(id, data) {
    return Attendance.findByIdAndUpdate(id, data, { new: true, runValidators: true })
      .populate('member', 'firstName lastName');
  }

  async delete(id) { return Attendance.findByIdAndDelete(id); }

  async findByMemberAndDate(memberId, date) {
    const start = new Date(date); start.setHours(0, 0, 0, 0);
    const end = new Date(date); end.setHours(23, 59, 59, 999);
    return Attendance.findOne({ member: memberId, date: { $gte: start, $lte: end } });
  }
}

export default new AttendanceRepository();
