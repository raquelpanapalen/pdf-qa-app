import React, { useState } from 'react';
import { Brain, ChevronDown, CheckCircle } from 'lucide-react';

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

export default ModelSelector;