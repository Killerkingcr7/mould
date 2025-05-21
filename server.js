const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

const uri = "mongodb+srv://Bigmoney02800:Calebmurimi%401@cluster0.mongodb.net/?retryWrites=true&w=majority"; // Replace with actual cluster
const client = new MongoClient(uri);
let servicesCollection;

// Connect to MongoDB
async function connectToMongo() {
  try {
    await client.connect();
    const db = client.db("mould"); // You can name the DB anything
    servicesCollection = db.collection("services");
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
  }
}
connectToMongo();

// POST service
app.post('/post-service', async (req, res) => {
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

// GET all services
app.get('/get-services', async (req, res) => {
  try {
    const services = await servicesCollection.find({}).toArray();
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
