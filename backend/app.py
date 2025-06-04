import os
import shutil
from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_session import Session
from uuid import uuid4
import tempfile
from langchain_community.vectorstores import FAISS
from langchain_community.document_loaders import PyMuPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_ollama import OllamaLLM, OllamaEmbeddings

from langchain.chains.question_answering import load_qa_chain
from dotenv import load_dotenv


load_dotenv()
app = Flask(__name__)
app.secret_key = os.getenv("SECRET_KEY")

app.config["SESSION_PERMANENT"] = False  # Sessions expire when the browser is closed
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_FILE_DIR"] = (
    tempfile.gettempdir()
)  # Use temp directory for session files
Session(app)
CORS(app, supports_credentials=True)

# Directory to store vector stores in tmp directory
VECTOR_STORE_PATH = os.getenv("VECTOR_STORE_PATH", tempfile.gettempdir())


# Ensure every session has a unique ID
@app.before_request
def ensure_session_id():
    if "session_id" not in session:
        session["session_id"] = str(uuid4())


# Test route
@app.route("/test", methods=["GET"])
def test():
    return jsonify({"message": "Hello, World!"})


@app.route("/upload", methods=["POST"])
def upload():
    uploaded_file = request.files.get("file")
    if not uploaded_file:
        return jsonify({"error": "No file uploaded"}), 400

    with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
        uploaded_file.save(tmp.name)
        loader = PyMuPDFLoader(tmp.name, mode="page")
        documents = loader.load()

    if not documents:
        return jsonify({"error": "No readable text found in PDF"}), 400

    text = "\n".join(doc.page_content for doc in documents)

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    texts = splitter.create_documents([text])

    if not texts:
        return jsonify({"error": "No text found after splitting"}), 400

    embeddings = OllamaEmbeddings(model="nomic-embed-text")
    vector_store = FAISS.from_documents(texts, embeddings)

    session_id = session["session_id"]
    vector_path = os.path.join(VECTOR_STORE_PATH, session_id)

    # Remove existing vector store if it exists
    if os.path.exists(vector_path):
        shutil.rmtree(vector_path)

    # Save new vector store
    vector_store.save_local(vector_path)

    return jsonify(
        {"message": "File uploaded and indexed successfully.", "session_id": session_id}
    )


@app.route("/ask", methods=["POST"])
def ask():
    prompt = request.json.get("prompt")
    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    session_id = session.get("session_id")
    if not session_id:
        return jsonify({"error": "Session not found"}), 400

    vector_path = os.path.join(VECTOR_STORE_PATH, session_id)
    if not os.path.exists(vector_path):
        return jsonify({"error": "No uploaded file for this session"}), 400

    vector_store = FAISS.load_local(
        vector_path,
        OllamaEmbeddings(model="nomic-embed-text"),
        allow_dangerous_deserialization=True,
    )
    llm = OllamaLLM(model="qwen2.5:latest")
    chain = load_qa_chain(llm=llm, chain_type="stuff")
    docs = vector_store.similarity_search(prompt)
    result = chain.invoke({"input_documents": docs, "question": prompt})

    return jsonify({"answer": result["output_text"]})


if __name__ == "__main__":
    app.run(port=5001, debug=True)
