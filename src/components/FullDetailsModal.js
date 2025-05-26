// FullDetailsModal.js
import React from 'react';
import './FullDetailsModal.css';

const FullDetailsModal = ({ thesis }) => (
  <div className="full-details-modal">
    <h2>{thesis.title}</h2>
    <section><strong>Author:</strong> <p>{thesis.author}</p></section>
    <section><strong>Email:</strong> <p>{thesis.email}</p></section>
    <section><strong>Student Number:</strong> <p>{thesis.studentNumber}</p></section>
    <section><strong>Group Members:</strong> <p>{thesis.groupMembers}</p></section>
    <section><strong>Course:</strong> <p>{thesis.course}</p></section>
    <section><strong>Year:</strong> <p>{thesis.year}</p></section>
    <section><strong>Section:</strong> <p>{thesis.section}</p></section>
    <section><strong>Adviser:</strong> <p>{thesis.adviser}</p></section>
    <section><strong>Abstract:</strong> <p>{thesis.abstract}</p></section>
    {/* Add other fields if needed */}
    <section>
      <strong>File:</strong>
      <a
  href={`http://localhost:5000/${thesis.filePath}`} // Ensure this path is correct
  target="_blank"
  rel="noopener noreferrer"
  className="file-link"
>
  View / Download File
</a>

    </section>
  </div>
);

export default FullDetailsModal;
