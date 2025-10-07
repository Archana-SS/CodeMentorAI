import React, { useState } from "react";
import Chatbot from "./Chatbot";
import "./FloatingChatbot.css";
import { FaCommentDots, FaTimes } from "react-icons/fa";

export default function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <button
        className="floating-btn"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {/*{isOpen ? "✖" : "💻"}*/}
        {isOpen ? <FaTimes /> : <FaCommentDots />}
      </button>

      {/* Chatbot Popup */}
      {isOpen && (
        <div className="floating-chatbot">
          <Chatbot />
        </div>
      )}
    </>
  );
}


{/*import React, { useState, useEffect } from "react";

const FloatingChatbot = () => {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState(`
    <p>Welcome to Coding Instructor AI! I'm here to help you with any programming questions you have.</p>
    <p>Ask me about:</p>
    <ul>
      <li>Programming concepts (OOP, recursion, closures)</li>
      <li>Language-specific questions (JavaScript, Python, Java)</li>
      <li>Algorithm explanations</li>
      <li>Code debugging</li>
      <li>Best practices</li>
    </ul>
  `);
  const [isOpen, setIsOpen] = useState(false);

  const GEMINI_API_KEY = "AIzaSyAH3z0awaBe70rXvnFoXrcdJ3zIMqgzg5E";
  const MODEL_NAME = "gemini-2.5-flash";

  const systemInstructionText = `
    You are an experienced Coding and Data Structures & Algorithms (DSA) Instructor with over 5 years of teaching experience. 
You should respond only to questions related to programming, coding concepts, or DSA problems.

For relevant queries:
- Provide clear, detailed, and well-structured explanations.
- Include examples, logic breakdowns, and reasoning steps wherever possible.
- If you are unsure or do not know the correct answer, politely admit it and avoid guessing or giving inaccurate information.

For unrelated or off-topic queries:
- Politely refuse to answer, stating that you only handle coding and DSA-related topics.`;

  // Function to display output gradually (typing effect)
  const typeOutput = (fullText) => {
    setOutput(""); // clear current output
    let index = 0;
    const interval = setInterval(() => {
      if (index >= fullText.length) {
        clearInterval(interval);
      } else {
        setOutput((prev) => prev + fullText[index]);
        index++;
      }
    }, 15); // 15ms per character
  };

  // Example welcome answer after 2 seconds with typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) return;
      const exampleText = `
        <p><strong>Welcome to Coding Instructor AI!</strong> I'm here to help you with any programming questions you have.</p>
        <p>Here's an example of how I can help:</p>
        <p><strong>Question:</strong> What is a closure in JavaScript?</p>
        <p><strong>Answer:</strong> A closure is a function that retains access to variables from its outer (enclosing) scope even after the outer function has finished executing. This happens because the inner function maintains a reference to its lexical environment.</p>
        <p>Example:</p>
        <pre><code>function outer() {
  const outerVar = 'I am outside!';
  
  function inner() {
    console.log(outerVar); // Accesses outerVar from outer function's scope
  }
  
  return inner;
}

const myInner = outer();
myInner(); // Logs "I am outside!"</code></pre>
        <p>In this example, <code>inner()</code> is a closure that "closes over" the <code>outerVar</code> variable.</p>
      `;
      typeOutput(exampleText);
    }, 2000);

    return () => clearTimeout(timer);
  }, [isOpen]);

  const handleAsk = async () => {
    if (!question.trim()) {
      setOutput(`<div class="error-message"><i class="fas fa-exclamation-circle"></i> Please enter a coding question!</div>`);
      return;
    }

    setLoading(true);
    setOutput("");

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    const requestBody = {
      contents: [{ role: "user", parts: [{ text: question }] }],
      systemInstruction: { parts: [{ text: systemInstructionText }] },
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData?.error?.message || "Unknown API error";
        throw new Error(errorMsg);
      }

      const data = await response.json();

      if (data.candidates?.[0]?.content?.parts?.length > 0) {
        let answerText = data.candidates[0].content.parts[0].text;

        answerText = answerText.replace(/(```[\s\S]*?```)|(`[^`]+`)/g, (match) => {
          if (match.startsWith("```")) {
            return `<pre><code>${match.replace(/```/g, "")}</code></pre>`;
          } else {
            return `<code>${match.replace(/`/g, "")}</code>`;
          }
        });

        const paragraphs = answerText.split("\n\n");
        const htmlOutput = paragraphs
          .filter(p => p.trim() !== "")
          .map(p => `<p>${p}</p>`)
          .join("");

        typeOutput(htmlOutput); // Use typing effect
      } else {
        setOutput(`<div class="error-message"><i class="fas fa-exclamation-triangle"></i> Unexpected response structure from AI.</div>`);
      }
    } catch (err) {
      console.error(err);
      setOutput(`<div class="error-message"><i class="fas fa-bug"></i> Failed to get answer: ${err.message}</div>`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      bottom: "20px",
      right: "20px",
      width: isOpen ? "400px" : "60px",
      height: isOpen ? "550px" : "60px",
      backgroundColor: "#1e293b",
      borderRadius: "15px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
      overflow: "hidden",
      transition: "all 0.3s ease",
      zIndex: 9999,
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {isOpen ? (
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          
          <div style={{
            backgroundColor: "#0c1120",
            padding: "10px 15px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #2d3749"
          }}>
            <h3 style={{ color: "#7e6fff", margin: 0 }}>Code Mentor AI</h3>
            <button onClick={() => setIsOpen(false)} style={{
              background: "transparent",
              border: "none",
              color: "#e2e8f0",
              fontSize: "18px",
              cursor: "pointer"
            }}>✖</button>
          </div>

          
          <div style={{
            flex: 1,
            padding: "15px",
            overflowY: "auto",
            color: "#e2e8f0",
            fontSize: "14px"
          }}>
            {loading ? (
              <div style={{ textAlign: "center", paddingTop: "50px" }}>
                <div style={{
                  width: "50px",
                  height: "50px",
                  border: "5px solid rgba(126,111,255,0.2)",
                  borderTopColor: "#7e6fff",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 20px"
                }}></div>
                <p>Analyzing your question...</p>
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: output }} />
            )}
          </div>

          
          <div style={{ padding: "10px", borderTop: "1px solid #2d3749" }}>
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              placeholder="Ask a coding question..."
              style={{
                width: "100%",
                height: "70px",
                borderRadius: "12px",
                border: "1px solid #2d3749",
                padding: "10px",
                background: "#121826",
                color: "#e2e8f0",
                fontFamily: "'Segoe UI', monospace",
                fontSize: "14px",
                resize: "vertical"
              }}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAsk();
                }
              }}
            />
            <button
              onClick={handleAsk}
              disabled={loading}
              style={{
                marginTop: "8px",
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #7e6fff, #00d4ff)",
                color: "#fff",
                fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                border: "none",
                fontSize: "14px"
              }}
            >
              {loading ? "Thinking..." : "Ask Coding Instructor"}
            </button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} style={{
          width: "100%",
          height: "100%",
          background: "#7e6fff",
          border: "none",
          borderRadius: "50%",
          color: "white",
          fontSize: "24px",
          cursor: "pointer",
        }}>
          💬
        </button>
      )}

      <style>
        {`
          @keyframes spin { to { transform: rotate(360deg); } }
          pre { background: #0f172a; color: #00d4ff; padding: 8px 12px; border-radius: 8px; overflow-x: auto; }
          code { background: #0f172a; color: #00d4ff; padding: 2px 6px; border-radius: 6px; font-family: 'Fira Code', monospace; }
          .error-message { color: #ef4444; background: rgba(239,68,68,0.1); padding: 12px; border-radius: 12px; margin: 10px 0; border-left: 4px solid #ef4444; font-weight: 500; display: flex; gap: 8px; align-items: center; }
        `}
      </style>
    </div>
  );
};

export default FloatingChatbot;*/}
