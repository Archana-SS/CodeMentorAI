import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import "./Chatbot.css"; 

const MODEL_NAME = "gemini-2.5-flash";
const GEMINI_API_KEY = "AIzaSyAH3z0awaBe70rXvnFoXrcdJ3zIMqgzg5E";

const systemInstructionText = `
You are an experienced Coding and Data Structures & Algorithms (DSA) Instructor with over 5 years of teaching experience. 
You should respond only to questions related to programming, coding concepts, or DSA problems.

For relevant queries:
- Provide clear, detailed, and well-structured explanations.
- Include examples, logic breakdowns, and reasoning steps wherever possible.
- If you are unsure or do not know the correct answer, politely admit it and avoid guessing or giving inaccurate information.

For unrelated or off-topic queries:
- Politely refuse to answer, stating that you only handle coding and DSA-related topics.`;

export default function Chatbot() {
  const [question, setQuestion] = useState("");
  const [responses, setResponses] = useState([]); // store multiple responses if needed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    if (!question.trim()) {
      setError("Please enter your question first!");
      return;
    }

    setError("");
    setLoading(true);
    setResponses([]);

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    const requestBody = {
      contents: [{ role: "user", parts: [{ text: question }] }],
      systemInstruction: { parts: [{ text: systemInstructionText }] },
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) throw new Error(`API Error: ${res.status}`);

      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) throw new Error("Unexpected response from AI");

      setResponses([text]);
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  };

  return (
    <div className="chatbot-container">
      <h1 className="chatbot-title">💬 Coding Instructor AI</h1>

      {/* Input Section */}
      <div className="chatbot-input-section">
        <textarea
          placeholder="Ask a coding question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button onClick={handleAsk} disabled={loading}>
          {loading ? "Analyzing..." : "Ask Instructor"}
        </button>
      </div>

      {/* Error Message */}
      {error && <div className="chatbot-error">{error}</div>}

      {/* Output Section */}
      <div className="chatbot-output">
        {loading && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <p>Analyzing your question...</p>
          </div>
        )}

        {responses.map((resp, i) => (
          <div key={i} className="chatbot-response">
            <ReactMarkdown>{resp}</ReactMarkdown>
          </div>
        ))}
      </div>
    </div>
  );
}
