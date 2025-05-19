import React, { useState } from 'react';
import './CapstoneUpload.css';

export default function CapstoneUpload() {
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    author: '',
    email: '',
    file: null,
  });

  const [message, setMessage] = useState(null); // { type: 'success'|'error', text: string }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const body = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      body.append(key, value);
    });

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body,
      });

      if (res.ok) {
        setMessage({ type: 'success', text: 'Capstone uploaded successfully!' });
        // Optional: reset form here if you want
        setFormData({
          title: '',
          abstract: '',
          author: '',
          email: '',
          file: null,
        });
      } else {
        const data = await res.json();
        setMessage({ type: 'error', text: data.error || 'Upload failed. Please try again.' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error. Please try again.' });
    }
  };

  return (
    <div className="upload-container">
      <h2>Upload Capstone</h2>
      <form onSubmit={handleSubmit}>
        <input name="title" placeholder="Title" required onChange={handleChange} value={formData.title} /><br />
        <textarea name="abstract" placeholder="Abstract" required onChange={handleChange} value={formData.abstract} /><br />
        <input name="author" placeholder="Author" required onChange={handleChange} value={formData.author} /><br />
        <input name="email" placeholder="Email" type="email" required onChange={handleChange} value={formData.email} /><br />
        <input name="file" type="file" accept="application/pdf" required onChange={handleChange} /><br />
        <button type="submit">Submit</button>
      </form>

      {/* Message box */}
      {message && (
        <div className={`message-box ${message.type}`}>
          {message.text}
          <button className="close-btn" onClick={() => setMessage(null)}>×</button>
        </div>
      )}
    </div>
  );
}
