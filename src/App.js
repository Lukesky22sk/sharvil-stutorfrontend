import React, { useState, useEffect } from "react";

const BACKEND_URL = "https://sharvilstutorbackend.onrender.com";

export default function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(""); // Full response
  const [displayedResponse, setDisplayedResponse] = useState(""); // Animated typing
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mode, setMode] = useState("learning"); // "learning" or "answer"

  // KaTeX rendering when response updates
  useEffect(() => {
    if (window.renderMathInElement) {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\(", right: "\\)", display: false },
        ],
      });
    }
  }, [displayedResponse]);

  // Typing animation
  useEffect(() => {
    if (!response) return;

    let index = 0;
    setDisplayedResponse("");
    const interval = setInterval(() => {
      setDisplayedResponse((prev) => {
        if (index >= response.length) {
          clearInterval(interval);
          return prev;
        }
        const nextChar = response[index];
        index++;
        return prev + nextChar;
      });
    }, 15);

    return () => clearInterval(interval);
  }, [response]);

  const submitPrompt = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setResponse("");
    setDisplayedResponse("");

    const modeInstruction =
      mode === "learning"
        ? `Please provide a list of specific methods, techniques, or approaches I can use to solve the following problem. Do not give the final answer or ask follow-up questions. Instead, guide me step-by-step through possible ways to approach the problem:\n\n${prompt}`
        : `Please give me the complete and correct final answer to the following question directly:\n\n${prompt}`;

    try {
      const res = await fetch(`${BACKEND_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: modeInstruction }),
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
      <h1>Sharvil's Tutor</h1>

      <div style={{ marginBottom: "1rem" }}>
        <label style={{ fontWeight: "600", marginRight: "0.5rem" }}>
          Mode:
        </label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "6px",
            fontSize: "1rem",
          }}
        >
          <option value="learning">Learning Mode (use for methods and explanation)</option>
          <option value="answer">Answer Mode (use for answers and reasoning)</option>
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

      {displayedResponse && (
        <div
          className="response-box"
          dangerouslySetInnerHTML={{ __html: displayedResponse }}
        />
      )}
    </div>
  );
}
