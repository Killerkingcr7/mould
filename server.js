const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let posts = []; // Temporary in-memory storage

app.post('/post-service', (req, res) => {
  const post = req.body;
  if (!post.name || !post.contact || !post.service || !post.price || !post.hours || !post.location || !post.description) {
    return res.status(400).json({ success: false, message: 'Missing fields' });
  }
  posts.push(post);
  res.json({ success: true });
});

app.get('/get-services', (req, res) => {
  res.json(posts);
});

app.listen(3000, () => console.log('✅ Server running locally on http://localhost:3000'));
