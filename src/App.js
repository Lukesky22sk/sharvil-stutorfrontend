import React, { useState } from "react";

const BACKEND_URL = "https://michellekinzaibackendbotfr.onrender.com";

export default function App() {
  const [userId] = React.useState(() => "user_" + Math.floor(Math.random() * 10000));
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitPrompt = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setResponse("");

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        setError(errorData.error || "Error from backend");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setResponse(data.response || "");
    } catch (e) {
      setError("Network error: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      submitPrompt();
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "Arial, sans-serif", color: "black" }}>
      <h1>Michellekinzai Tutor</h1>

      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        placeholder="Type your question here..."
        style={{
          width: "100%",
          padding: "0.5rem",
          fontSize: "1rem",
          boxSizing: "border-box",
          color: "black",
          border: "1px solid #ccc",
          borderRadius: "4px"
        }}
      />
      <button
        onClick={submitPrompt}
        disabled={loading || !prompt.trim()}
        style={{
          marginTop: "0.5rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          cursor: loading || !prompt.trim() ? "not-allowed" : "pointer",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px"
        }}
      >
        {loading ? "Thinking..." : "Submit"}
      </button>

      {error && (
        <div style={{ marginTop: "1rem", color: "red", fontWeight: "bold" }}>
          {error}
        </div>
      )}

      {response && (
        <div
          style={{
            marginTop: "1.5rem",
            whiteSpace: "pre-wrap",
            backgroundColor: "#f9f9f9",
            padding: "1rem",
            borderRadius: "4px",
            border: "1px solid #ddd",
            color: "black",
          }}
        >
          {response}
        </div>
      )}
    </div>
  );
}
