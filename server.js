const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;  // Set this in Render environment variables

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

let servicesCollection;

// Connect to MongoDB
async function connectDB() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db('mould');
    servicesCollection = db.collection('services');
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
  }
}
connectDB();

// POST service
app.post('/api/services', async (req, res) => {
  const { type, description } = req.body;
  if (!type || !description) {
    return res.status(400).json({ message: 'Missing fields' });
  }
  try {
    const result = await servicesCollection.insertOne({ type, description, createdAt: new Date() });
    res.status(201).json({ id: result.insertedId, type, description });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to save service' });
  }
});

// GET services
app.get('/api/services', async (req, res) => {
  try {
    const services = await servicesCollection.find({}).toArray();
    res.json(services);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
});

// Auth routes (if you have them)
const authRoutes = require('./auth');
app.use('/auth', authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
