import React, { useState } from 'react';
import ModelSelector from './components/ModelSelector';
import FileUploadCard from './components/FileUploadCard';
import QuestionCard from './components/QuestionCard';
import AnswerCard from './components/AnswerCard';
import ErrorAlert from './components/ErrorAlert';
import StatusIndicator from './components/StatusIndicator';
import { uploadFile, askQuestion, validatePDFFile } from './utils/api';


function App() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploaded, setUploaded] = useState(false);
    const [prompt, setPrompt] = useState('');
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedModel, setSelectedModel] = useState('openai');

    const handleFileChange = (newFile) => {
        setFile(newFile);
        setUploaded(false);
        setAnswer('');
        setPrompt('');
        setError('');
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError('');

        // Check if the file is a PDF
        if (!validatePDFFile(file)) {
            setError('Only PDF files are allowed.');
            setFile(null);
            setUploading(false);
            return;
        }

        try {
            await uploadFile(file, selectedModel);
            setUploaded(true);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Error uploading file. Please try again.');
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
            const res = await askQuestion(prompt, selectedModel);
            setAnswer(res.data.answer);
        } catch (err) {
            // Print response error to console for debugging (from payload)
            console.error(err);
            setError(err.response?.data?.error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                        🎥 SceneScanner
                    </h1>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Upload your PDF document and ask questions to get instant, AI-powered answers
                    </p>
                </div>

                {/* Status Indicator */}
                <StatusIndicator uploaded={uploaded} file={file} />

                {/* Model Selection */}
                <ModelSelector
                    selectedModel={selectedModel}
                    onModelChange={setSelectedModel}
                />

                {/* Error Alert */}
                <div className="mb-6">
                    <ErrorAlert error={error} />
                </div>

                {/* Main Content */}
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                    <FileUploadCard
                        file={file}
                        setFile={handleFileChange}
                        uploading={uploading}
                        uploaded={uploaded}
                        onUpload={handleUpload}
                        error={error}
                    />

                    <QuestionCard
                        prompt={prompt}
                        setPrompt={setPrompt}
                        onAsk={handleAsk}
                        loading={loading}
                        uploaded={uploaded}
                        disabled={!uploaded}
                        selectedModel={selectedModel}
                    />
                </div>

                {/* Answer Section */}
                <AnswerCard answer={answer} />
            </div>
        </div>
    );
}

export default App;