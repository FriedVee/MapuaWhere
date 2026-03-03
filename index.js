import express from 'express';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import cors from 'cors';

const app = express();
const PORT = 3000;

// 1. Setup where to save images
const storage = multer.diskStorage({
  destination: 'public/uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // This serves your HTML/CSS files

const DB_FILE = './database.json';

// 2. GET Route to fetch all items (for index.html)
app.get('/api/items', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  res.json(data);
});

// 3. POST Route to save a new report
app.post('/api/report', upload.single('itemPhoto'), (req, res) => {
  try {
    const items = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
    
    const newItem = {
      id: Date.now(),
      category: req.body.category,
      itemName: req.body.itemName,
      location: req.body.location,
      description: req.body.description,
      status: req.body.status,
      image: req.file ? `/uploads/${req.file.filename}` : null,
      timestamp: new Date().toLocaleString()
    };

    items.push(newItem);
    fs.writeFileSync(DB_FILE, JSON.stringify(items, null, 2));

    res.status(201).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => console.log(`Running at http://localhost:${PORT}`));