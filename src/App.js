import React, { useState, useEffect } from "react";

const BACKEND_URL = "https://sharvilstutorbackend.onrender.com"; // Change if needed

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [animatedResponse, setAnimatedResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("learning"); // 'learning' or 'answer'

  useEffect(() => {
    if (window.renderMathInElement) {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\(", right: "\\)", display: false },
        ],
      });
    }
  }, [animatedResponse]);

  useEffect(() => {
    // Animate text reveal
    let i = 0;
    const interval = setInterval(() => {
      if (i < response.length) {
        setAnimatedResponse(window.marked(response.slice(0, i + 1)));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 10);
    return () => clearInterval(interval);
  }, [response]);

  const submitPrompt = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setResponse("");
    setAnimatedResponse("");

    const wrappedPrompt =
      mode === "learning"
        ? `Please provide a list of specific methods, techniques, or approaches I can use to solve the following problem. Do not give the final answer or ask follow-up questions. Instead, guide me step-by-step through possible ways to approach the problem:\n\n${prompt}`
        : prompt;

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
      e.preventDefault();
      submitPrompt();
    }
  };

  return (
    <div className="container">
      <h1>Sharvil's Tutor</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ marginRight: "1rem", fontWeight: 600 }}>
          Mode:
        </label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            fontSize: "1rem",
          }}
        >
          <option value="learning">Learning Mode</option>
          <option value="answer">Answer Mode</option>
        </select>
      </div>

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

      {animatedResponse && (
        <div
          className="response-box"
          dangerouslySetInnerHTML={{ __html: animatedResponse }}
        />
      )}
    </div>
  );
}
