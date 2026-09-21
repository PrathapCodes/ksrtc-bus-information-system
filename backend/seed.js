const mongoose = require('mongoose');
require('dotenv').config();

const Admin = require('./models/Admin');
const Place = require('./models/Place');
const Bus = require('./models/Bus');
const Query = require('./models/Query');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/businfo';

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('Clearing existing data...');
    await Admin.deleteMany({});
    await Place.deleteMany({});
    await Bus.deleteMany({});
    await Query.deleteMany({});

    // Seed admin
    console.log('Seeding admin...');
    const admin = new Admin({
      username: 'admin',
      password: 'admin123'
    });
    const savedAdmin = await admin.save();
    console.log('✅ Admin created:', savedAdmin._id);

    // Seed places
    console.log('Seeding places...');
    const places = await Place.insertMany([
      { name: 'Bengaluru' },
      { name: 'Mysuru' },
      { name: 'Tumakuru' },
      { name: 'Hassan' }
    ]);
    console.log('✅ Places created:', places.length);

    // Seed buses
    console.log('Seeding buses...');
    const buses = await Bus.insertMany([
      {
        from_place_id: places[0]._id,
        to_place_id: places[1]._id,
        class_of_service: 'AC',
        via_places: 'Tumakuru',
        departure_time: '06:30:00'
      },
      {
        from_place_id: places[1]._id,
        to_place_id: places[0]._id,
        class_of_service: 'Non-AC',
        via_places: '---',
        departure_time: '09:00:00'
      },
      {
        from_place_id: places[0]._id,
        to_place_id: places[2]._id,
        class_of_service: 'AC',
        via_places: 'Hassan',
        departure_time: '13:45:00'
      },
      {
        from_place_id: places[2]._id,
        to_place_id: places[3]._id,
        class_of_service: 'Non-AC',
        via_places: 'Mysuru',
        departure_time: '18:10:00'
      }
    ]);
    console.log('✅ Buses created:', buses.length);

    console.log('\n✅ Database seeded successfully!');
    console.log('Admin credentials: username=admin, password=admin123');
    console.log('Places:', places.map(p => p.name).join(', '));
    console.log('Buses:', buses.length);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
}

seedDatabase();
