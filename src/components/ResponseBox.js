import { useEffect } from "react";

function ResponseBox({ message }) {
  useEffect(() => {
    if (window.renderMathInElement) {
      window.renderMathInElement(document.body, {
        delimiters: [
          { left: "$$", right: "$$", display: true },
          { left: "\\(", right: "\\)", display: false },
        ],
      });
    }
  }, [message]);

  return (
    <div
      className="bot-response"
      style={{ fontFamily: "Inter, sans-serif", fontSize: "1rem", lineHeight: "1.6" }}
      dangerouslySetInnerHTML={{ __html: message }}
    />
  );
}
