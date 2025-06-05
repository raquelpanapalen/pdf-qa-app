import React from 'react';
import { Sparkles } from 'lucide-react';

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


export default AnswerCard;