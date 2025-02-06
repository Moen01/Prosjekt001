const express = require("express");
const multer = require("multer");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require('dotenv').config();

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

// Connect to MongoDB
const mongoURL = process.env.MONGODB_URL;
mongoose.connect(mongoURL,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema for metadata
const metadataSchema = new mongoose.Schema({
  partId: String,
  stpFileName: String,
  coordinates: [Number], // [x, y, z]
  comments: String,
});

const Metadata = mongoose.model("Metadata", metadataSchema);

// Set up file uploads with Multer
const upload = multer({ dest: "uploads/" });

// API to handle file uploads
app.post("/upload", upload.single("file"), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: "No file uploaded." });
  }

  // Here, you can process the .stp file if needed
  const stpFileName = file.originalname;

  // Save metadata to MongoDB
  const metadata = new Metadata({
    partId: "part-1", // Replace with actual part ID
    stpFileName,
    coordinates: [10, 20, 30], // Replace with actual coordinates
    comments: "Sample comment", // Replace with actual comments
  });

  await metadata.save();

  res.json({ message: "File uploaded and metadata saved.", metadata });
});

// API to fetch metadata
app.get("/metadata", async (req, res) => {
  const metadata = await Metadata.find();
  res.json(metadata);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err);
  });