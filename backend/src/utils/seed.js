import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.model.js';
import Member from '../models/Member.model.js';
import Family from '../models/Family.model.js';
import Ministry from '../models/Ministry.model.js';
import Attendance from '../models/Attendance.model.js';

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Drop database to clear old indexes and collections
    await mongoose.connection.db.dropDatabase();
    console.log('🗑️  Dropped database');

    // Create Users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@church.com',
      password: 'admin123',
      role: 'admin',
      isActive: true,
    });

    const staffUser = await User.create({
      name: 'Staff User',
      email: 'staff@church.com',
      password: 'staff123',
      role: 'staff',
      isActive: true,
    });

    console.log('👤 Created users: admin@church.com, staff@church.com');

    // Create Members
    const members = await Member.insertMany([
      {
        firstName: 'John',
        middleName: 'Michael',
        lastName: 'Doe',
        gender: 'Male',
        dateOfBirth: new Date('1985-03-15'),
        phone: '+251911000001',
        email: 'john.doe@example.com',
        address: '123 Main St, Addis Ababa',
        occupation: 'Engineer',
        baptismStatus: 'Baptized',
        membershipStatus: 'Active',
        joinDate: new Date('2015-01-01'),
      },
      {
        firstName: 'Mary',
        lastName: 'Doe',
        gender: 'Female',
        dateOfBirth: new Date('1988-07-22'),
        phone: '+251911000002',
        email: 'mary.doe@example.com',
        address: '123 Main St, Addis Ababa',
        occupation: 'Teacher',
        baptismStatus: 'Baptized',
        membershipStatus: 'Active',
        joinDate: new Date('2015-06-15'),
      },
      {
        firstName: 'Samuel',
        lastName: 'Tesfaye',
        gender: 'Male',
        dateOfBirth: new Date('1992-11-10'),
        phone: '+251911000003',
        email: 'samuel.tesfaye@example.com',
        address: '45 Church Rd, Addis Ababa',
        occupation: 'Accountant',
        baptismStatus: 'Baptized',
        membershipStatus: 'Active',
        joinDate: new Date('2018-03-20'),
      },
      {
        firstName: 'Hiwot',
        lastName: 'Alemu',
        gender: 'Female',
        dateOfBirth: new Date('1995-04-05'),
        phone: '+251911000004',
        email: 'hiwot.alemu@example.com',
        address: '78 Gospel Lane, Addis Ababa',
        occupation: 'Nurse',
        baptismStatus: 'Pending',
        membershipStatus: 'Active',
        joinDate: new Date('2022-09-01'),
      },
      {
        firstName: 'Dawit',
        lastName: 'Bekele',
        gender: 'Male',
        dateOfBirth: new Date('1980-12-30'),
        phone: '+251911000005',
        email: 'dawit.bekele@example.com',
        address: '10 Faith Ave, Addis Ababa',
        occupation: 'Business Owner',
        baptismStatus: 'Baptized',
        membershipStatus: 'Inactive',
        joinDate: new Date('2010-05-10'),
      },
    ]);

    console.log(`👥 Created ${members.length} members`);

    // Create Families
    const family1 = await Family.create({
      familyName: 'Doe Family',
      headOfFamily: members[0]._id,
      address: '123 Main St, Addis Ababa',
      phone: '+251911000001',
      members: [members[0]._id, members[1]._id],
    });

    const family2 = await Family.create({
      familyName: 'Tesfaye Family',
      headOfFamily: members[2]._id,
      address: '45 Church Rd, Addis Ababa',
      phone: '+251911000003',
      members: [members[2]._id, members[3]._id],
    });

    // Update members with family references
    await Member.findByIdAndUpdate(members[0]._id, { family: family1._id });
    await Member.findByIdAndUpdate(members[1]._id, { family: family1._id });
    await Member.findByIdAndUpdate(members[2]._id, { family: family2._id });
    await Member.findByIdAndUpdate(members[3]._id, { family: family2._id });

    console.log('🏠 Created 2 families');

    // Create Ministries
    const worshipMinistry = await Ministry.create({
      name: 'Worship Ministry',
      description: 'Leading the congregation in praise and worship through music and song.',
      leader: members[0]._id,
      members: [members[0]._id, members[1]._id, members[3]._id],
      isActive: true,
    });

    const youthMinistry = await Ministry.create({
      name: 'Youth Ministry',
      description: 'Engaging and discipling the next generation through programs and mentorship.',
      leader: members[2]._id,
      members: [members[2]._id, members[3]._id],
      isActive: true,
    });

    const evangelismMinistry = await Ministry.create({
      name: 'Evangelism Ministry',
      description: 'Spreading the Gospel through outreach programs and community service.',
      leader: members[4]._id,
      members: [members[0]._id, members[2]._id, members[4]._id],
      isActive: true,
    });

    console.log('⛪ Created 3 ministries: Worship, Youth, Evangelism');

    // Create Attendance Records
    const today = new Date();
    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - today.getDay());

    const prevSunday = new Date(lastSunday);
    prevSunday.setDate(lastSunday.getDate() - 7);

    const attendanceRecords = [
      // Last Sunday attendance
      { member: members[0]._id, date: lastSunday, status: 'Present', recordedBy: adminUser._id },
      { member: members[1]._id, date: lastSunday, status: 'Present', recordedBy: adminUser._id },
      { member: members[2]._id, date: lastSunday, status: 'Present', recordedBy: staffUser._id },
      { member: members[3]._id, date: lastSunday, status: 'Absent', notes: 'Sick leave', recordedBy: staffUser._id },
      { member: members[4]._id, date: lastSunday, status: 'Absent', recordedBy: adminUser._id },
      // Previous Sunday attendance
      { member: members[0]._id, date: prevSunday, status: 'Present', recordedBy: adminUser._id },
      { member: members[1]._id, date: prevSunday, status: 'Absent', notes: 'Travelling', recordedBy: adminUser._id },
      { member: members[2]._id, date: prevSunday, status: 'Present', recordedBy: staffUser._id },
      { member: members[3]._id, date: prevSunday, status: 'Present', recordedBy: staffUser._id },
      { member: members[4]._id, date: prevSunday, status: 'Present', recordedBy: adminUser._id },
    ];

    await Attendance.insertMany(attendanceRecords);
    console.log(`📋 Created ${attendanceRecords.length} attendance records`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('  Admin:  admin@church.com  / admin123');
    console.log('  Staff:  staff@church.com  / staff123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
