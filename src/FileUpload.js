import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = () => {
    axios.get('http://localhost:8080/uploads')
      .then((response) => {
        console.log(response);
        setUploadedFiles(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the uploaded files!', error);
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
        fetchUploadedFiles(); // Update the list of uploaded files
      })
      .catch((error) => {
        console.error('There was an error uploading the file!', error);
      });
  };

  const onFileDelete = (filename) => {
    axios.delete(`http://localhost:8080/files/${filename}`)
      .then((response) => {
        setMessage(response.data.message);
        fetchUploadedFiles();
      })
      .catch((error) => {
        console.error('There was an error deleting the file!', error);
      });
  };

  const fetchFiles = () => {
    axios.get('http://localhost:8080/files')
      .then((response) => {
        setFiles(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the files!', error);
      });
  };
  return (
    <div>
      <h2>File Upload</h2>
      <input type="file" onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload</button>
      <p>{message}</p>
      <h3>Uploaded Files:</h3>
      <button onClick={fetchUploadedFiles}>SUP</button>
      <ul>
        {uploadedFiles.map((file, index) => (
          <li key={index}>
            <a href={`http://localhost:8080/uploads/${file}`} target="_blank" rel="noopener noreferrer">
              {file}
            </a>
            <button onClick={() => onFileDelete(file)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FileUpload;

// import React, { useState } from 'react';
// import axios from 'axios';

// const FileUploader = () => {
//   const [file, setFile] = useState(null);
//   const [message, setMessage] = useState('');
//   const [uploadedFile, setUploadedFile] = useState(null);

//   const onFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const onFileUpload = () => {
//     const formData = new FormData();
//     formData.append('file', file);

//     axios.post('http://localhost:8080/upload', formData)
//       .then((response) => {
//         setMessage(response.data.message);
//         setUploadedFile(response.data.filename);
//       })
//       .catch((error) => {
//         console.error('There was an error uploading the file!', error);
//       });
//   };

//   return (
//     <div>
//       <h2>File Upload</h2>
//       <input type="file" onChange={onFileChange} />
//       <button onClick={onFileUpload}>Upload</button>
//       <p>{message}</p>
//       {uploadedFile && (
//         <div>
//           <h3>Uploaded File:</h3>
//           <a href={`http://localhost:8080/uploads/${uploadedFile}`} target="_blank" rel="noopener noreferrer">
//             {uploadedFile}
//           </a>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUploader;
