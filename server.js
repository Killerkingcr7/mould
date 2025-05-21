const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Use environment variable for Mongo URI, fallback to your URI (not recommended for production)
const uri = process.env.MONGO_URI || "mongodb+srv://Bigmoney02800:Calebmurimi%401@cluster0.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

let servicesCollection;

async function connectToMongo() {
  try {
    await client.connect();
    const db = client.db("mould"); // DB name
    servicesCollection = db.collection("services");
    console.log("✅ Connected to MongoDB");

    // Start server only after DB connection is established
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1); // Exit app if DB connection fails
  }
}

connectToMongo();

app.post('/post-service', async (req, res) => {
  try {
    const post = req.body;
    if (!post.name || !post.service) {
      return res.json({ success: false, message: "Missing required fields" });
    }

    const result = await servicesCollection.insertOne(post);
    res.json({ success: true, insertedId: result.insertedId });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "Error inserting service" });
  }
});

app.get('/get-services', async (req, res) => {
  try {
    const services = await servicesCollection.find({}).toArray();
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});
