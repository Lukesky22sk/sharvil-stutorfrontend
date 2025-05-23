import React, { useState } from "react";

const BACKEND_URL = "https://michellekinzaibackendbotfr.onrender.com"; // Your backend URL

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitPrompt = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setResponse("");

    // Wrap user prompt with guidance instructions
    const wrappedPrompt = `Guide me step-by-step to solve the following problem without giving the final answer or asking follow-up questions. Only provide methods, hints, and approaches:\n\n${prompt}`;

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: wrappedPrompt }),
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
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "Arial, sans-serif", color: "#000" }}>
      <h1>Michellekinzai Tutor</h1>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your question or problem here..."
        rows={5}
        style={{
          width: "100%",
          padding: "0.5rem",
          fontSize: "1rem",
          boxSizing: "border-box",
          marginBottom: "1rem",
          color: "#000",
          borderColor: "#333",
          resize: "vertical",
        }}
        disabled={loading}
      />

      <button
        onClick={submitPrompt}
        disabled={loading || !prompt.trim()}
        style={{
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          cursor: loading || !prompt.trim() ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Thinking..." : "Submit"}
      </button>

      {error && (
        <div style={{ marginTop: "1rem", color: "red" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div
          style={{
            marginTop: "1rem",
            whiteSpace: "pre-wrap",
            backgroundColor: "#f9f9f9",
            padding: "1rem",
            borderRadius: "4px",
            color: "#000",
          }}
        >
          {response}
        </div>
      )}
    </div>
  );
}
