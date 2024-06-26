const express = require('express'); // za lokalna upotreba 
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const app = express(); // za lokalna upotreba 
const PORT = 8000;


//Midleware
app.use(bodyParser.json());

//cors
app.use(cors());


// MongoDB Connection 
const mongoURI = process.env.MONGO_URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });


const db = mongoose.connection;
db.on('error' , console.error.bind(console,'MongoDB connection error: '));
db.once('open' , () => console.log('Connected to MongoDB'));



// MongoDB Model 
const Book = mongoose.model('Book', {
    title: {type: String},
    author: { type: String },
    publicationYear: { type: String },
});



app.post('/books' , async (req, res) => { 
    try {
        const { title, author, publicationYear } = req.body;
        const newItem = new Book ({ title, author, publicationYear });        
        console.log({newItem})
        await newItem.save();
        res.json('Success!');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



app.get('/books' , async (req, res) => { 
    try {
        const items = await Book.find();
        res.json(items);
    }   catch (error) {
        res.status(500).json({ error: error.message});
    }
});



app.put('/books/:id', async (req, res) => { 
try {
    const { id } = req.params;
    const updatedItem = await Book.findByIdAndUpdate(id, req.body, {new: true});
    res.json(updatedItem);
}catch (error) {
    res.status(500).json({ error: error.message});
}
});



app.delete('/books/:id', async (req, res) => {
    try {
    const { id } = req.params;
    await Book.findByIdAndDelete(id);
    res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



