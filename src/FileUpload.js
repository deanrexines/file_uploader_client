import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = () => {
    axios.get('http://localhost:8080/uploads')
      .then((response) => {
        setFiles(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the files!', error);
      });
  };

  const onFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const onFileUpload = () => {
    const formData = new FormData();
    formData.append('file', file);

    axios.post('http://localhost:8080/upload', formData)
      .then((response) => {
        setMessage(response.data.message);
        fetchFiles(); // Refresh file list after upload
      })
      .catch((error) => {
        console.error('There was an error uploading the file!', error);
      });
  };

  const onFileDelete = (filename) => {
    axios.delete(`http://localhost:8080/files/${filename}`)
      .then((response) => {
        setMessage(response.data.message);
        setFiles(files.filter(file => file.filename !== filename)); // Remove the file from the state
      })
      .catch((error) => {
        console.error('There was an error deleting the file!', error);
      });
  };

  return (
    <div>
      <h2>File Uploader</h2>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload</button>
      <p>{message}</p>
      <h3>Uploaded Files:</h3>
      <ul>
        {files.map((file, index) => (
          <li key={index}>
            <a href={`http://localhost:8080/uploads/${file.filename}`} target="_blank" rel="noopener noreferrer">
              File: {file.filename} (upload timestamp: {file.timestamp})
            </a>
            <button onClick={() => onFileDelete(file.filename)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUpload;
