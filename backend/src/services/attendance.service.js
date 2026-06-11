import attendanceRepository from '../repositories/attendance.repository.js';

class AttendanceService {
  async getAll(query) { return attendanceRepository.findAll(query); }

  async getById(id) {
    const attendance = await attendanceRepository.findById(id);
    if (!attendance) throw new Error('Attendance record not found');
    return attendance;
  }

  async record(data) {
    const existing = await attendanceRepository.findByMemberAndDate(data.member, data.date);
    if (existing) {
      return attendanceRepository.update(existing._id, { status: data.status, notes: data.notes });
    }
    return attendanceRepository.create(data);
  }

  async update(id, data) {
    const attendance = await attendanceRepository.findById(id);
    if (!attendance) throw new Error('Attendance record not found');
    return attendanceRepository.update(id, data);
  }

  async delete(id) {
    const attendance = await attendanceRepository.findById(id);
    if (!attendance) throw new Error('Attendance record not found');
    return attendanceRepository.delete(id);
  }
}

export default new AttendanceService();
