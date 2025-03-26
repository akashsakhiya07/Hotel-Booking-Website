const mongoose = require('mongoose');

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/hotel_booking', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Room Schema
const roomSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    image: String,
    available: Boolean
});

const Room = mongoose.model('Room', roomSchema);

// Sample Room Data
const rooms = [
    {
        name: "Luxury Suite",
        price: 9999,
        description: "Spacious room with king size bed, ocean view, and private balcony",
        image: "images/img1.jpg",
        available: true
    },
    {
        name: "Deluxe Room",
        price: 7999,
        description: "Modern room with city view and premium amenities",
        image: "images/img2.jpg",
        available: true
    },
    {
        name: "Family Suite",
        price: 12999,
        description: "Large suite perfect for families with separate living area",
        image: "images/img3.jpg",
        available: true
    }
];

// Add rooms to database
async function seedDatabase() {
    try {
        // Clear existing rooms
        await Room.deleteMany({});
        
        // Add new rooms
        await Room.insertMany(rooms);
        
        console.log('Database seeded successfully!');
        process.exit();
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase(); 