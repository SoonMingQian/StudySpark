import axios from 'axios';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Flashcard } from '../type';

interface FileUploadProps {
    onUploadSuccess: (flashcards: Flashcard[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onUploadSuccess }) => {
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (file) {
            console.log('Uploading file...', file);
            try {
                const formData = new FormData();
                formData.append('pdf', file);
                const response = await axios.post('http://localhost:4000/api/flashcards/generate', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })

                onUploadSuccess(response.data);
            } catch (error) {
                console.error('Failed to upload file', error);
            }
        } else {
            console.error('No file selected');
        }
    }

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFile(event.target.files[0]);
        }
    }
    return (
        <form onSubmit={handleSubmit}>
            <input type="file" accept=".pdf,image/*" onChange={handleFileChange} />
            <button type="submit">Upload</button>
        </form>
    )
}

export default FileUpload;