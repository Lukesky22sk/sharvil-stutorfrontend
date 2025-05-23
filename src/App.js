import React, { useState, useEffect } from "react";

const BACKEND_URL = "https://sharvilstutorbackend.onrender.com";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("learning"); // "learning" or "answer"

  // KaTeX render on response change
  useEffect(() => {
    if (window.renderMathInElement) {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\(", right: "\\)", display: false },
        ],
      });
    }
  }, [response]);

  const submitPrompt = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setResponse("");

    let wrappedPrompt = prompt;

    if (mode === "learning") {
      wrappedPrompt =
        `Please provide a list of specific methods, techniques, or approaches I can use to solve the following problem. ` +
        `Do not give the final answer or ask follow-up questions. Instead, guide me step-by-step through possible ways to approach the problem:\n\n${prompt}`;
    }

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
    <div className="container">
      <h1>Sharvils Tutor</h1>

      <label htmlFor="mode-select">Select Mode:</label>
      <select
        id="mode-select"
        value={mode}
        onChange={(e) => setMode(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem" }}
      >
        <option value="learning">Learning Mode (step-by-step guidance)</option>
        <option value="answer">Answer Mode (direct solution)</option>
      </select>

      <textarea
        className="input-box"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your question or problem here..."
        rows={5}
        disabled={loading}
      />

      <button
        className="button"
        onClick={submitPrompt}
        disabled={loading || !prompt.trim()}
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
          className="response-box"
          dangerouslySetInnerHTML={{ __html: response }}
        />
      )}
    </div>
  );
}
