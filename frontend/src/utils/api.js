import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001';

export const uploadFile = async (file, selectedModel) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model', selectedModel);
    
    return axios.post(`${API_BASE_URL}/upload`, formData, { withCredentials: true });
};

export const askQuestion = async (prompt, selectedModel) => {
    return axios.post(`${API_BASE_URL}/ask`, { prompt, selectedModel }, { withCredentials: true });
};

export const validatePDFFile = (file) => {
    return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
};