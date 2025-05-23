import React, { useState } from "react";

const BACKEND_URL = "https://michellekinzaibackendbotfr.onrender.com"; // Your backend URL

export default function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState(
    "Ask me anything, and I'll guide you with questions."
  );
  const [loading, setLoading] = useState(false);

  const submitInput = async () => {
    if (!input.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();

      if (data.response) {
        setResponse(data.response);
      } else if (data.error) {
        setResponse("Error from backend: " + data.error);
      } else {
        setResponse("Unexpected response from backend.");
      }

      setInput("");
    } catch (e) {
      setResponse("Error communicating with backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      submitInput();
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Michellekinzai Tutor</h1>

      <div
        style={{
          marginBottom: "1rem",
          minHeight: "4rem",
          padding: "1rem",
          backgroundColor: "#f0f0f0",
          borderRadius: "5px",
          whiteSpace: "pre-wrap",
        }}
      >
        {response}
      </div>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        placeholder="Type your question or statement here..."
        style={{
          width: "100%",
          padding: "0.5rem",
          fontSize: "1rem",
          boxSizing: "border-box",
        }}
      />

      <button
        onClick={submitInput}
        disabled={loading || !input.trim()}
        style={{
          marginTop: "0.5rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          cursor: loading || !input.trim() ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Thinking..." : "Ask"}
      </button>
    </div>
  );
}
