import React from 'react';

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

export default StatusIndicator;