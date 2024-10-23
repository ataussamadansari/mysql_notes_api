const express = require('express');
const connection = require('../config/db');
const authenticate = require('../config/middleware');

const notesRouter = express.Router();

// Create a new note
notesRouter.post('/', authenticate, (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id;

    const query = 'INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)';
    connection.query(query, [userId, title, content], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error creating note.', error: err });

        res.status(201).json({ message: 'Note created successfully!', noteId: results.insertId });
    });
});


// Get all notes for a specific user
notesRouter.get('/', authenticate, (req, res) => {
    const userId = req.user.id;

    const query = 'SELECT * FROM notes WHERE user_id = ?';
    connection.query(query, [userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching notes.', error: err });

        res.json({ notes: results });
    });
});

// Update a note by ID
notesRouter.put('/:id', authenticate, (req, res) => {
    const { title, content } = req.body;
    const noteId = req.params.id;
    const userId = req.user.id;

    const query = 'UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?';
    connection.query(query, [title, content, noteId, userId], (err, results) => {
        if (err || results.affectedRows === 0) {
            return res.status(404).json({ message: 'Note not found or unauthorized.' });
        }
        res.json({ message: 'Note updated successfully!' });
    });
});


// Delete a note by ID
notesRouter.delete('/:id', authenticate, (req, res) => {
    const noteId = req.params.id;
    const userId = req.user.id;

    const query = 'DELETE FROM notes WHERE id = ? AND user_id = ?';
    connection.query(query, [noteId, userId], (err, results) => {
        if (err || results.affectedRows === 0) {
            return res.status(404).json({ message: 'Note not found or unauthorized.' });
        }
        res.json({ message: 'Note deleted successfully!' });
    });
});

// Fetch all users
// Fetch all notes
notesRouter.get("/all", (req, res) => {
    const query = 'SELECT id, user_id, title, content FROM notes'; // Saare notes ki details fetch karne ka query
    
    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error fetching notes.', error: err });
        }
        res.json({ notes: results }); // Notes ki details return karo
    });
});


//export
module.exports = notesRouter;