import React, { useState } from 'react';
import axios from 'axios';

function App() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError('');
        const formData = new FormData();
        formData.append('file', file);

        try {
            const res = await axios.post('http://localhost:5001/upload', formData, { withCredentials: true });
            setUploaded(true);
            console.log("Upload session ID:", res.data.session_id);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Error uploading file. Please try again.');
        } finally {
            setUploading(false);
        }
    };

    const handleAsk = async () => {
        if (!prompt) return;
        setLoading(true);
        setError('');
        setAnswer('');
        if (!uploaded) {
            setError('Please upload a PDF file first.');
            setLoading(false);
            return;
        }
        try {
            const res = await axios.post('http://localhost:5001/ask', { prompt }, { withCredentials: true });
            setAnswer(res.data.answer);
            console.log("Ask session ID:", res.data.session_id);
        } catch (err) {
            // Print response error to console for debugging (from payload)
            console.error(err.response?.data?.error);
            setError(err.response?.data?.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto bg-white shadow-xl rounded-xl p-6">
                <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">📄 PDF Q&A Assistant</h1>

                <div className="mb-4">
                    <label className="block font-medium mb-1">Upload PDF</label>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                            setFile(e.target.files[0]);
                            setUploaded(false);
                            setAnswer('');
                            setPrompt('');
                        }}
                        className="w-full p-2 border rounded"
                    />
                    <button
                        onClick={handleUpload}
                        disabled={!file || uploading}
                        className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
                    >
                        {uploading ? 'Uploading...' : 'Upload PDF'}
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block font-medium mb-1">Ask a question</label>
                    <textarea
                        placeholder="What would you like to know?"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="w-full p-3 border rounded"
                        rows={3}
                    />
                    <button
                        onClick={handleAsk}
                        disabled={!uploaded || !prompt || loading}
                        className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Thinking...' : 'Ask'}
                    </button>
                </div>

                {answer && (
                    <div className="bg-green-100 p-4 rounded mb-2">
                        <h2 className="font-semibold text-green-700">Answer:</h2>
                        <p className="mt-1 text-gray-800 whitespace-pre-line">{answer}</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 p-3 rounded text-red-700 font-medium">{error}</div>
                )}
            </div>
        </div>
    );
}

export default App;
