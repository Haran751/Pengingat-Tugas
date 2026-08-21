require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Task = require('./models/Task');

const seedDatabase = async () => {
  try {
    // Connect to MongoDB Atlas
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB Connected!');

    // Clear existing collections
    console.log('Clearing existing User collection...');
    await User.deleteMany({});
    console.log('User collection cleared.');

    console.log('Clearing existing Task collection...');
    await Task.deleteMany({});
    console.log('Task collection cleared.');

    // Create dummy user
    console.log('Creating dummy user: Andi...');
    const user = await User.create({
      name: 'Andi',
      avatar: 'https://api.dicebear.com/9.x/adventurer/svg?seed=Andi&backgroundColor=b6e3f4',
      level: 10,
      xp: 1500,
      streak: 7,
    });
    console.log(`User created: ${user.name} (ID: ${user._id})`);

    // Calculate deadlines
    const now = new Date();
    const in30Mins = new Date(now.getTime() + 30 * 60 * 1000);
    const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);
    const in1Day = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Create dummy tasks
    console.log('Creating dummy tasks...');

    const task1 = await Task.create({
      title: 'Laporan Kimia',
      priority: 'PENTING',
      deadline: in30Mins,
      isCompleted: false,
      user: user._id,
    });
    console.log(`Task created: ${task1.title} [${task1.priority}] — Deadline: ${task1.deadline.toISOString()}`);

    const task2 = await Task.create({
      title: 'Latihan Soal Matematika',
      priority: 'PENTING',
      deadline: in1Hour,
      isCompleted: false,
      user: user._id,
    });
    console.log(`Task created: ${task2.title} [${task2.priority}] — Deadline: ${task2.deadline.toISOString()}`);

    const task3 = await Task.create({
      title: 'Bikin Skrip Drama Anekdot',
      priority: 'MENENGAH',
      deadline: in1Day,
      isCompleted: false,
      user: user._id,
    });
    console.log(`Task created: ${task3.title} [${task3.priority}] — Deadline: ${task3.deadline.toISOString()}`);

    const task4 = await Task.create({
      title: 'Belanja Mingguan',
      priority: 'SELESAI',
      deadline: oneDayAgo,
      isCompleted: true,
      user: user._id,
    });
    console.log(`Task created: ${task4.title} [${task4.priority}] — Deadline: ${task4.deadline.toISOString()} (Completed)`);

    console.log('\n=== Seeding Complete ===');
    console.log(`Created 1 user and 4 tasks.`);
    process.exit(0);
  } catch (error) {
    console.error('Seeding Error:', error.message);
    process.exit(1);
  }
};

seedDatabase();
