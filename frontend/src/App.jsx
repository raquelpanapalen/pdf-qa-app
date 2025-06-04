import React, { useState } from 'react';
import axios from 'axios';
import { Upload, MessageCircle, FileText, Loader2, CheckCircle, AlertCircle, Sparkles, Brain, ChevronDown } from 'lucide-react';

// Model Selection Component
const ModelSelector = ({ selectedModel, onModelChange }) => {
    const [isOpen, setIsOpen] = useState(false);

    const models = [
        {
            id: 'openai',
            name: 'GPT-4',
            description: 'OpenAI\'s latest model with advanced capabilities',
            color: 'from-green-500 to-green-600'
        },
        {
            id: 'ollama',
            name: 'Qwen2.5',
            description: 'It demonstrates significant advancements in instruction following and reasoning',
            color: 'from-orange-500 to-orange-600'
        }
    ];

    const selectedModelData = models.find(m => m.id === selectedModel) || models[0];

    return (
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 shadow-lg hover:shadow-xl transition-all duration-300 mb-6">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-xl">
                    <Brain className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">AI Model Selection</h2>
            </div>

            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full bg-white/80 backdrop-blur-sm border border-indigo-200 rounded-xl p-4 flex items-center justify-between hover:border-indigo-300 transition-colors"
                >
                    <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${selectedModelData.color}`} />
                        <div className="text-left">
                            <div className="font-semibold text-gray-800">{selectedModelData.name}</div>
                            <div className="text-sm text-gray-600">{selectedModelData.description}</div>
                        </div>
                    </div>
                    <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-indigo-200 rounded-xl shadow-xl z-10 overflow-hidden">
                        {models.map((model) => (
                            <button
                                key={model.id}
                                onClick={() => {
                                    onModelChange(model.id);
                                    setIsOpen(false);
                                }}
                                className={`w-full p-4 flex items-center gap-3 hover:bg-indigo-50 transition-colors border-b border-gray-100 last:border-b-0 ${selectedModel === model.id ? 'bg-indigo-50' : ''
                                    }`}
                            >
                                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${model.color}`} />
                                <div className="text-left">
                                    <div className="font-semibold text-gray-800">{model.name}</div>
                                    <div className="text-sm text-gray-600">{model.description}</div>
                                </div>
                                {selectedModel === model.id && (
                                    <CheckCircle className="w-5 h-5 text-indigo-600 ml-auto" />
                                )}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
const FileUploadCard = ({ file, setFile, uploading, uploaded, onUpload, error }) => {
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-xl">
                    <Upload className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Upload Your PDF</h2>
            </div>

            <div className="space-y-4">
                <div className="relative">
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => {
                            setFile(e.target.files[0]);
                        }}
                        className="w-full p-4 border-2 border-dashed border-blue-300 rounded-xl bg-white/80 backdrop-blur-sm hover:border-blue-400 transition-colors cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {uploaded && (
                        <div className="absolute top-2 right-2">
                            <CheckCircle className="w-6 h-6 text-green-500" />
                        </div>
                    )}
                </div>

                {file && (
                    <div className="flex items-center gap-2 p-3 bg-white/80 rounded-lg">
                        <FileText className="w-5 h-5 text-blue-600" />
                        <span className="text-sm text-gray-700 font-medium">{file.name}</span>
                    </div>
                )}

                <button
                    onClick={onUpload}
                    disabled={!file || uploading}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                    {uploading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Upload className="w-5 h-5" />
                            Upload PDF
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

// Question Component
const QuestionCard = ({ prompt, setPrompt, onAsk, loading, uploaded, disabled, selectedModel }) => {
    const modelNames = {
        'openai': 'GPT-4',
        'ollama': 'Qwen2.5'
    };

    return (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-xl">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">Ask Your Question</h2>
                {selectedModel && (
                    <div className="ml-auto">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                            Using {modelNames[selectedModel]}
                        </span>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <textarea
                    placeholder="What would you like to know about your document? Be specific for better results..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full p-4 border border-green-200 rounded-xl bg-white/80 backdrop-blur-sm focus:border-green-400 focus:ring-2 focus:ring-green-200 transition-all duration-200 resize-none"
                    rows={4}
                />

                <button
                    onClick={onAsk}
                    disabled={disabled || !prompt || loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Analyzing with {modelNames[selectedModel]}...
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            Get Answer
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

// Answer Component
const AnswerCard = ({ answer }) => {
    if (!answer) return null;

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100 shadow-lg animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-xl">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                </div>
                <h2 className="text-xl font-bold text-gray-800">AI Response</h2>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-purple-200">
                <p className="text-gray-800 leading-relaxed whitespace-pre-line">{answer}</p>
            </div>
        </div>
    );
};

// Error Component
const ErrorAlert = ({ error }) => {
    if (!error) return null;

    return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 font-medium">{error}</p>
        </div>
    );
};

// Status Indicator
const StatusIndicator = ({ uploaded, file }) => {
    return (
        <div className="flex items-center justify-center gap-4 mb-6">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${file ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500'
                }`}>
                <div className={`w-2 h-2 rounded-full ${file ? 'bg-blue-500' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium">File Selected</span>
            </div>

            <div className="w-8 h-0.5 bg-gray-300 rounded" />

            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 ${uploaded ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                }`}>
                <div className={`w-2 h-2 rounded-full ${uploaded ? 'bg-green-500' : 'bg-gray-400'}`} />
                <span className="text-sm font-medium">Ready to Ask</span>
            </div>
        </div>
    );
};

// Main App Component
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
        const formData = new FormData();
        formData.append('file', file);
        formData.append('model', selectedModel);

        // Check if the file is a PDF (by MIME type or extension)
        const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        if (!isPDF) {
            setError('Only PDF files are allowed.');
            setFile(null);
            setUploading(false);
            return;
        }

        try {
            const res = await axios.post('http://localhost:5001/upload', formData, { withCredentials: true });
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
            const res = await axios.post('http://localhost:5001/ask', { prompt, selectedModel }, { withCredentials: true });
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