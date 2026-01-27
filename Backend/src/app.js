const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const pasteRoutes = require("./routes/pastes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/", pasteRoutes);

connectDB().catch(err => console.error("DB Connection Error:", err));

module.exports = app;
