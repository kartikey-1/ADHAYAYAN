import google.generativeai as genai
import os
from dotenv import load_dotenv
from flask import Flask, request, Response
import traceback
from flask_cors import CORS
import uuid

load_dotenv()
GOOGLE_API_KEY = os.environ.get("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY is not set in your .env file.")
genai.configure(api_key=GOOGLE_API_KEY)

try:
    system_instruction = "You are a helpful chatbot for Computer Science Engineering students. Your task is to answer their questions accurately and concisely."
    model = genai.GenerativeModel(
        model_name="models/gemini-1.5-flash-latest",
        system_instruction=system_instruction
    )
except Exception as e:
    print(f"Error initializing model: {e}")
    exit(1)

app = Flask(__name__)
CORS(app)

chat_sessions = {}


#@app.route("/api/chat", methods=["POST"])
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        query = data.get("query")
        session_id = data.get("sessionId")

        if not query:
            return Response("Query is missing", status=400)

        if not session_id or session_id not in chat_sessions:
            session_id = str(uuid.uuid4())
            chat_sessions[session_id] = model.start_chat(history=[])
            print(f"Starting new chat session: {session_id}")
        
        chat_session = chat_sessions[session_id]

        def generate_chunks():
            try:
                response_stream = chat_session.send_message(query, stream=True)
                
                yield f"session_id:{session_id}\n"

                for chunk in response_stream:
                    if chunk.text:
                        yield chunk.text
            except Exception as e:
                print(f"Error during stream generation: {e}")
                yield "Error processing your request."

        return Response(generate_chunks(), mimetype='text/plain')

    except Exception as e:
        error_message = f"Error in /chat: {e}"
        print(error_message)
        traceback.print_exc()
        return Response(error_message, status=500)

@app.route("/")
def index():
    return "Welcome to ADHAYAYAN Chatbot API!"
    
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
