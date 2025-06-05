import React from 'react';
import { Upload, FileText, Loader2, CheckCircle } from 'lucide-react';

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

export default FileUploadCard;