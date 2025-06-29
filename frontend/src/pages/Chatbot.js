import React, { useState } from "react";
import { askChatbot } from "../api";

export default function Chatbot() {
  const [qns, setQns] = useState("");
  const [res, setRes] = useState("");

  // Function to remove ```html and trailing ```
  function cleanHtmlResponse(response) {
    return response
      .replace(/^```html\s*/, "")  // Remove starting ```html
      .replace(/\s*```$/, "");     // Remove ending ```
  }

  async function handleAsk() {
    const reply = await askChatbot(qns);
    const cleanReply = cleanHtmlResponse(reply);
    setRes(cleanReply);
  }

  return (
    <div>
      <h2>Chat with Hotel Bot</h2>
      <input
        value={qns}
        onChange={(e) => setQns(e.target.value)}
        placeholder="Ask me anything..."
      />
      <button onClick={handleAsk}>Ask</button>

      <div
        style={{ border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}
        dangerouslySetInnerHTML={{ __html: res }}
      />
    </div>
  );
}
