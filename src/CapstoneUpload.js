import React, { useState } from 'react';
import DashboardLayout from './components/DashboardLayout';
import { useTheses } from './context/ThesisContext';
import './CapstoneUpload.css';

export default function CapstoneUpload() {
  const { setTheses } = useTheses();

  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    author: '',
    email: '',
    studentNumber: '',
    groupMembers: '',
    course: '',
    year: '',
    section: '',
    adviser: '',
    file: null,
  });

  const [message, setMessage] = useState(null);

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
        const newThesis = await res.json();
        setTheses(prev => [...prev, newThesis]); // add new thesis to context

        setMessage({ type: 'success', text: 'Capstone uploaded successfully!' });
        setFormData({
          title: '',
          abstract: '',
          author: '',
          email: '',
          studentNumber: '',
          groupMembers: '',
          course: '',
          year: '',
          section: '',
          adviser: '',
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
    <DashboardLayout>
      <div className="upload-container flat-theme">
        <h2>Upload Capstone</h2>
        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="Title" required onChange={handleChange} value={formData.title} />
          <textarea name="abstract" placeholder="Abstract" required onChange={handleChange} value={formData.abstract} />
          <input name="author" placeholder="Author" required onChange={handleChange} value={formData.author} />
          <input name="email" placeholder="Email" type="email" required onChange={handleChange} value={formData.email} />
          <input name="studentNumber" placeholder="Student Number" required onChange={handleChange} value={formData.studentNumber} />
          <input name="groupMembers" placeholder="Group Members (comma-separated)" onChange={handleChange} value={formData.groupMembers} />
          <input name="course" placeholder="Course" onChange={handleChange} value={formData.course} />
          <input name="year" placeholder="Year" onChange={handleChange} value={formData.year} />
          <input name="section" placeholder="Section" onChange={handleChange} value={formData.section} />
          <input name="adviser" placeholder="Adviser" onChange={handleChange} value={formData.adviser} />
          <input name="file" type="file" accept="application/pdf" required onChange={handleChange} />

          <button type="submit">Submit</button>
        </form>

        {message && (
          <div className={`message-box ${message.type}`}>
            {message.text}
            <button className="close-btn" onClick={() => setMessage(null)}>×</button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
