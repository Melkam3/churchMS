import familyRepository from '../repositories/family.repository.js';
import memberRepository from '../repositories/member.repository.js';

class FamilyService {
  async getAll(query) { return familyRepository.findAll(query); }

  async getById(id) {
    const family = await familyRepository.findById(id);
    if (!family) throw new Error('Family not found');
    return family;
  }

  async create(data) { return familyRepository.create(data); }

  async update(id, data) {
    const family = await familyRepository.findById(id);
    if (!family) throw new Error('Family not found');
    return familyRepository.update(id, data);
  }

  async delete(id) {
    const family = await familyRepository.findById(id);
    if (!family) throw new Error('Family not found');
    await Promise.all(family.members.map(m => memberRepository.update(m._id, { family: null })));
    return familyRepository.delete(id);
  }

  async addMember(familyId, memberId) {
    const [family, member] = await Promise.all([
      familyRepository.findById(familyId),
      memberRepository.findById(memberId),
    ]);
    if (!family) throw new Error('Family not found');
    if (!member) throw new Error('Member not found');
    if (member.family && String(member.family._id) !== String(familyId)) {
      await familyRepository.removeMember(member.family._id, memberId);
    }
    await memberRepository.update(memberId, { family: familyId });
    return familyRepository.addMember(familyId, memberId);
  }

  async count() { return familyRepository.count(); }
}

export default new FamilyService();
