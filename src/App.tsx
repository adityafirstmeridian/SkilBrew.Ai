import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, -apple-system, sans-serif",
        background: "#f8fafc",
        color: "#0f172a",
        gap: "1rem",
      }}
    >
      <h1 style={{ fontSize: "2rem", fontWeight: 600 }}>Project</h1>
      <p style={{ color: "#64748b" }}>Built with AI Studio</p>
      <button
        onClick={() => setCount((c) => c + 1)}
        style={{
          padding: "0.75rem 1.5rem",
          fontSize: "1rem",
          border: "none",
          borderRadius: "0.5rem",
          background: "#2563eb",
          color: "white",
          cursor: "pointer",
        }}
      >
        Count: {count}
      </button>
    </div>
  );
}

export default App;
