import ministryRepository from '../repositories/ministry.repository.js';
import memberRepository from '../repositories/member.repository.js';

class MinistryService {
  async getAll(query) { return ministryRepository.findAll(query); }

  async getById(id) {
    const ministry = await ministryRepository.findById(id);
    if (!ministry) throw new Error('Ministry not found');
    return ministry;
  }

  async create(data) { return ministryRepository.create(data); }

  async update(id, data) {
    const ministry = await ministryRepository.findById(id);
    if (!ministry) throw new Error('Ministry not found');
    return ministryRepository.update(id, data);
  }

  async delete(id) {
    const ministry = await ministryRepository.findById(id);
    if (!ministry) throw new Error('Ministry not found');
    return ministryRepository.delete(id);
  }

  async assignMember(ministryId, memberId) {
    const [ministry, member] = await Promise.all([
      ministryRepository.findById(ministryId),
      memberRepository.findById(memberId),
    ]);
    if (!ministry) throw new Error('Ministry not found');
    if (!member) throw new Error('Member not found');
    return ministryRepository.assignMember(ministryId, memberId);
  }

  async removeMember(ministryId, memberId) {
    const ministry = await ministryRepository.findById(ministryId);
    if (!ministry) throw new Error('Ministry not found');
    return ministryRepository.removeMember(ministryId, memberId);
  }

  async count() { return ministryRepository.count(); }
}

export default new MinistryService();
