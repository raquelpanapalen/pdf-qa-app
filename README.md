# SceneScanner - PDF Question Answering for Movie Content

SceneScanner is a full-stack application that lets you upload movie-related PDF documents (like scripts, reviews, etc.), then ask natural language questions about their content. It uses a React frontend and a Flask backend powered by vector search and a local language model via Ollama.

## Setup Instructions

1. **Clone the repository:**
    ```bash
    git clone https://github.com/raquelpanapalen/scenescanner.git
    cd scenescanner
    ```

2. **Install dependencies:**

    ```bash
    # For backend
    cd backend
    python -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt

    # For frontend
    cd frontend
    npm install
    ```

    ### Model Configuration
    This application supports two distinct ways to utilize language models, and you can configure both to compare their performance or suitability for different tasks:

    #### Option 1: Local Open-Source Models (Ollama)
    If you prefer to use open-source models running locally on your machine, you will need to install Ollama and pull the required models.

    1. **Install Ollama:**
    Follow the installation instructions for your operating system on the [Ollama website](https://ollama.com/download).

    2. **Pull Ollama Models:**
    Once Ollama is installed and running, use the following commands in your terminal to download the necessary models:
        ```bash
        ollama pull qwen2.5:latest              # (4.7 GB)
        ollama pull nomic-embed-text:latest     # (274 MB)
        ```
        
        - `qwen2.5` will be used as the Large Language Model (LLM) for generating replies.
        - `nomic-embed-text` will be used to create text embeddings for the vector database.

    #### Option 2: OpenAI Cloud Models
    If you prefer to use OpenAI's powerful cloud-based models, you will need an OpenAI API key.

    1. **Obtain an OpenAI API Key:**
    If you don't have one, you can generate an API key from the OpenAI Platform.

    2. **Configure API Key:**
    Create a file named .env in the root directory of your application (if it doesn't already exist) and add your OpenAI API key to it in the following format:

        `OPENAI_API_KEY="your-api-key-here"`

        Replace the value with your actual OpenAI API key. This API key will be automatically loaded to the environment using `dotenv`.

        - `gpt-4o-mini` will be used as the LLM for generating replies.
        - `text-embedding-3-large` will be used to create the embeddings for the vector database.



3. **Run the backend server:**
    ```bash
    cd backend
    flask run
    ```

4. **Run the frontend (different terminal):**
    ```bash
    cd frontend
    npm start
    ```

5. **Access the app:**
    - Open [http://localhost:3000](http://localhost:3000) in your browser.



## 📁 Project Structure
```
project-root/
│
├── backend/
│   ├── app.py             # Flask backend
│   └── requirements.txt   # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ModelSelector.jsx      # AI model selection dropdown
│   │   │   ├── FileUploadCard.jsx     # PDF file upload component
│   │   │   ├── QuestionCard.jsx       # Question input and submission
│   │   │   ├── AnswerCard.jsx         # AI response display
│   │   │   ├── ErrorAlert.jsx         # Error message component
│   │   │   └── StatusIndicator.jsx    # Upload progress indicator
│   │   ├── utils/
│   │   │   └── api.js                 # API service functions
│   │   ├── App.jsx                    # Main React application
│   │   └── index.js                   # React entry point
│   ├── public/
│   │   └── index.html                 # HTML template
│   ├── package.json                   # React dependencies
│   └── package-lock.json              # Lock file for dependencies
│
├── .gitignore                         # Git ignore file
└── README.md                          # Project documentation
```

---

## Code Overview

### i. Overall Architecture
- Frontend (React) lets users upload a PDF and submit questions.
- Backend (Flask) handles PDF processing, vector storage, and LLM-based answering.
- FAISS is used for efficient storage and retrieval of vector representations (embeddings) of document chunks. This allows for fast similarity searches to find relevant sections of the PDF.
- Language Models (LLMs) are used for question answering given top-k relevant documents as context. 

### ii. Frontend ↔ Backend Interaction
The frontend and backend communicate through a set of well-defined API endpoints.

- **`/upload` (`POST` Request):**
    - The React frontend sends the selected PDF file to this endpoint using a FormData object.
    - The Flask backend receives the PDF, reads and splits its content into manageable chunks using LangChain's `PyMuPDFLoader`.
    - It then generates vector embeddings for these chunks using either `OpenAIEmbeddings` or `OllamaEmbeddings`, depending on the user's model selection.
    - These embeddings are then saved to disk using FAISS, creating a dedicated vector store for the uploaded document.
    - A unique session cookie is used to associate the user with their specific FAISS vector store, ensuring continuity across their interaction.

- **`/ask` (`POST` Request):**
    - The React frontend sends the user's natural language question to this endpoint.
    - The Flask backend identifies the correct session and loads the corresponding FAISS vector store.
    - It performs a similarity search to retrieve the top-k most relevant document chunks based on the user's question.
    - This retrieved context, along with the user's question, is then sent to the selected LLM (either OpenAI or Ollama-powered).
    - The selected LLM processes the input and returns a comprehensive answer, which is then sent back to the frontend for display to the user.


### Why LangChain
LangChain offers smooth integration of vector databases, language models, and question-answering chains—ideal for building RAG pipelines.

If OpenAI credentials are available, LangChain allows for straightforward integration. By simply providing an API key, the framework can automatically handle connections to OpenAI's services, including both OpenAIEmbeddings and OpenAI LLMs, making setup and deployment significantly smoother.

Additionally, free open-source models can be used locally instead. While attempting to use Hugging Face embeddings, we encountered several compatibility issues stemming from recent API changes—LangChain's current version has deprecation problems and is not fully up to date with the latest Hugging Face methods.

## 🛡️ Environment & Security Notes
- The session uses a securely generated `SECRET_KEY`.
- Uploaded PDFs are saved temporarily and removed after processing.
- Cookies are handled securely via Flask sessions (withCredentials in Axios).