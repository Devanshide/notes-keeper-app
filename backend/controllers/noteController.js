const Note = require("../models/noteModel");

// Get all notes for logged-in user
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.status(200).json({ notes });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch notes", error: err.message });
  }
};

// Create new note
const createNote = async (req, res) => {
  const { title, content, tags } = req.body;
  if (!title || !content) {
    return res.status(400).json({ message: "Title and content required" });
  }

  try {
    const newNote = new Note({
      user: req.user.id,
      title,
      content,
      tags: tags || [],
    });
    await newNote.save();
    res.status(201).json({ note: newNote });
  } catch (err) {
    res.status(500).json({ message: "Failed to create note", error: err.message });
  }
};

// Update note
const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content, tags } = req.body;

  try {
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // ✅ Update fields
    note.title = title !== undefined ? title : note.title;
    note.content = content !== undefined ? content : note.content;
    note.tags = tags !== undefined ? tags : note.tags;

    await note.save();

    return res.status(200).json({ message: "Note updated successfully", note });
  } catch (error) {
    console.error("Error updating note:", error);
    return res.status(500).json({ message: "Failed to update note", error: error.message });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    if (note.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Note.findByIdAndDelete(id);

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete note", error: err.message });
  }
};

module.exports = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};
