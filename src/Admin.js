import React, { useEffect, useState } from 'react';
import './Admin.css'; // your custom styles

const Admin = () => {
  const [theses, setTheses] = useState([]);

  useEffect(() => {
    fetch('/api/theses')
      .then(res => res.json())
      .then(data => setTheses(data))
      .catch(err => console.error('Fetch error:', err));
  }, []);

  return (
    <div className="admin-container">
      <h2>Capstone</h2>
      <div className="thesis-grid">
        {theses.map((thesis) => (
          <div className="thesis-card" key={thesis._id}>
            <div className="thumbnail">
              {thesis.thumbnailPath ? (
               <img
                src={`http://localhost:5000/thumbnails/${thesis.thumbnailPath.split('/').pop()}`}
                alt={`${thesis.title} front page thumbnail`}
                className="thumbnail-img"
              />

              ) : (
                <img
                  src="/book-cover.png" // default placeholder image
                  alt="Default thumbnail"
                  className="thumbnail-img"
                />
              )}
            </div>
            <div className="thesis-info">
             <h1 className="thesis-title">{thesis.title}</h1>

              <p><strong>Author:</strong> {thesis.author}</p>
              <p><strong>Email:</strong> {thesis.email}</p>
              <button
                className="view-button"
                onClick={() => window.open(`http://localhost:5000/${thesis.filePath}`, '_blank')}
                style={{ textDecoration: 'none' }} // disables underline on button text
              >
                View PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;
