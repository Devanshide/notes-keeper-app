import React, { useEffect, useState } from 'react';
import api, { setAuthToken } from '../api';
import { useAuth } from '../context/AuthContext';

function Notes() {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', tags: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    setAuthToken(token);
    fetchNotes();
  }, [token]);

  const fetchNotes = async () => {
    const res = await api.get('/notes');
    setNotes(res.data.notes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    if (editingId) {
      await api.put(`/notes/update/${editingId}`, payload);
      setEditingId(null);
    } else {
      await api.post('/notes', payload);
    }

    setForm({ title: '', content: '', tags: '' });
    fetchNotes();
  };

  const handleEdit = (note) => {
    setEditingId(note._id);
    setForm({ title: note.title, content: note.content, tags: note.tags.join(', ') });
  };

  const handleDelete = async (id) => {
    await api.delete(`/notes/delete/${id}`);
    fetchNotes();
  };

  return (
    <div style={{ maxWidth: 600, margin: 'auto' }}>
      <h2>{editingId ? 'Edit Note' : 'Create Note'}</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <textarea placeholder="Content" value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} required />
        <input placeholder="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

      <hr />
      <h3>Your Notes</h3>
      {notes.map(note => (
        <div key={note._id} style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
          <h4>{note.title}</h4>
          <p>{note.content}</p>
          {note.tags && <p>Tags: {note.tags.join(', ')}</p>}
          <button onClick={() => handleEdit(note)}>Edit</button>
          <button onClick={() => handleDelete(note._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Notes;