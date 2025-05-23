import React, { useState } from "react";
import ResponseBox from "./ResponseBox"; // Importing our smart rendering component

const BACKEND_URL = "https://michellekinzaibackendbotfr.onrender.com";

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

    const wrappedPrompt = `Please provide a list of specific methods, techniques, or approaches I can use to solve the following problem. Do not give the final answer or ask follow-up questions. Instead, guide me step-by-step through possible ways to approach the problem:\n\n${prompt}`;

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
    if (e.key === "Enter" && !loading && !e.shiftKey) {
      e.preventDefault(); // Prevent newline insert
      submitPrompt();
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">Michellekinzai Tutor</h1>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your question or problem here..."
        rows={5}
        className="input-box"
        disabled={loading}
      />

      <button
        onClick={submitPrompt}
        disabled={loading || !prompt.trim()}
        className="submit-button"
      >
        {loading ? "Thinking..." : "Submit"}
      </button>

      {error && (
        <div style={{ marginTop: "1rem", color: "red" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && <ResponseBox message={response} />}
    </div>
  );
}
