
import React, { useState, useEffect } from "react";

const BACKEND_URL = "https://michellekinzaibackendfr.onrender.com"; // Change if your backend URL differs

export default function App() {
  const [userId] = useState(() => "user_" + Math.floor(Math.random() * 10000));
  const [question, setQuestion] = useState("");
  const [guidance, setGuidance] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/questions?user=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setQuestion(data.question);
        setGuidance(data.guidance);
      });
  }, [userId]);

  const submitAnswer = async () => {
    if (!answer.trim()) return;

    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: userId, answer }),
      });
      const data = await res.json();

      setQuestion(data.question || "");
      setGuidance(data.guidance || "");
      setAnswer("");
    } catch (e) {
      setQuestion("Error communicating with backend.");
      setGuidance("");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) {
      submitAnswer();
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Michellekinzai Tutor</h1>
      <div style={{ marginBottom: "1rem", fontWeight: "bold" }}>{question}</div>
      <div style={{ marginBottom: "1rem", color: "#666" }}>{guidance}</div>

      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        style={{
          width: "100%",
          padding: "0.5rem",
          fontSize: "1rem",
          boxSizing: "border-box",
        }}
        placeholder="Type your answer or question here..."
      />
      <button
        onClick={submitAnswer}
        disabled={loading || !answer.trim()}
        style={{
          marginTop: "0.5rem",
          padding: "0.5rem 1rem",
          fontSize: "1rem",
          cursor: loading || !answer.trim() ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Thinking..." : "Submit"}
      </button>
    </div>
  );
}
