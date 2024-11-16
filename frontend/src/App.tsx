import React, { ChangeEvent, FormEvent, useState } from 'react';
import './App.css';

function App() {
  const [file, setFile] = useState<File | null>(null);
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (file) {
      console.log('File selected: ', file)
      //send it to be processed by the ai api
    } else {
      console.error('No file selected!')
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Welcome to StudySpark</h1>
        <p>Upload your PDF or image file</p>
        <form onSubmit={handleSubmit}>
          <input
            type="file"
            accept=".pdf,image/*" // Allow PDFs and images
            onChange={handleFileChange}
          />
          <button type="submit">Submit</button>
        </form>
        {file && <p>Selected File: {file.name}</p>}
      </header>
    </div>
  );
}

export default App;
