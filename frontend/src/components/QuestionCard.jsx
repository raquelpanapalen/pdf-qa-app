import React from 'react';
import { MessageCircle, Loader2, Sparkles } from 'lucide-react';

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

export default QuestionCard;