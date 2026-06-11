import memberRepository from '../repositories/member.repository.js';
import familyRepository from '../repositories/family.repository.js';

class MemberService {
  async getAll(query) { return memberRepository.findAll(query); }

  async getById(id) {
    const member = await memberRepository.findById(id);
    if (!member) throw new Error('Member not found');
    return member;
  }

  async create(data) {
    const member = await memberRepository.create(data);
    if (data.family) {
      await familyRepository.addMember(data.family, member._id);
    }
    return member;
  }

  async update(id, data) {
    const existing = await memberRepository.findById(id);
    if (!existing) throw new Error('Member not found');
    if (data.family && String(existing.family?._id) !== String(data.family)) {
      if (existing.family) await familyRepository.removeMember(existing.family._id, id);
      await familyRepository.addMember(data.family, id);
    }
    return memberRepository.update(id, data);
  }

  async delete(id) {
    const member = await memberRepository.findById(id);
    if (!member) throw new Error('Member not found');
    if (member.family) await familyRepository.removeMember(member.family._id, id);
    return memberRepository.delete(id);
  }

  async updatePhoto(id, photoPath) {
    return memberRepository.update(id, { profilePhoto: photoPath });
  }

  async getStats() {
    const [totalMembers, recentMembers] = await Promise.all([
      memberRepository.count(),
      memberRepository.findRecent(5),
    ]);
    return { totalMembers, recentMembers };
  }
}

export default new MemberService();
