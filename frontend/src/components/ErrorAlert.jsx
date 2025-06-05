import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorAlert = ({ error }) => {
    if (!error) return null;

    return (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 animate-in slide-in-from-top-2 duration-300">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700 font-medium">{error}</p>
        </div>
    );
};

export default ErrorAlert;