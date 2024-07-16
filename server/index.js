const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
require('express-async-errors'); // Automatically handles async errors

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev')); // Use morgan for logging

// MongoDB Connection
mongoose.connect('mongodb+srv://kishita562:user0@cluster0.2x5vcmi.mongodb.net/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Define a schema and model
const itemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
});

const Item = mongoose.model('Item', itemSchema);

// Routes
app.get('/items', async (req, res) => {
    const items = await Item.find();
    res.json(items);
});

app.post('/items', async (req, res) => {
    const newItem = new Item(req.body);
    await newItem.save();
    res.json(newItem);
});

app.put('/items/:id', async (req, res) => {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) {
        return res.status(404).json({ message: 'Item not found' });
    }
    res.json(updatedItem);
});

app.delete('/items/:id', async (req, res) => {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
        return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'An error occurred', error: err.message });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
