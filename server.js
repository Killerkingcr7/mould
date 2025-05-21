// Remove dotenv require in production on Render
// require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
// Optional: serve static from 'public' folder if needed
// app.use(express.static('public'));

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);
let servicesCollection;

async function connectToMongo() {
  try {
    await client.connect();
    const db = client.db("mould");
    servicesCollection = db.collection("services");
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}
connectToMongo();

app.get('/', (req, res) => res.send('🟢 Server is running'));

app.post('/post-service', async (req, res) => {
  if (!servicesCollection) return res.status(500).json({ error: "DB not ready" });

  try {
    const post = req.body;
    if (!post.name || !post.service) return res.json({ success: false });

    const result = await servicesCollection.insertOne(post);
    res.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error(error);
    res.json({ success: false });
  }
});

app.get('/get-services', async (req, res) => {
  if (!servicesCollection) return res.status(500).json({ error: "DB not ready" });

  try {
    const services = await servicesCollection.find({}).toArray();
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
