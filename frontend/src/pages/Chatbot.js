import React, { useState, useRef, useEffect } from "react";
import { askChatbot } from "../api";
import "../styles/Chatbot.css";

export default function Chatbot() {
  const [qns, setQns] = useState("");
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "Hello! I'm your Hotel Bot assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Function to remove ```html and trailing ```
  function cleanHtmlResponse(response) {
    return response
      .replace(/^```html\s*/, "") // Remove starting ```html
      .replace(/\s*```$/, ""); // Remove ending ```
  }

  async function handleAsk() {
    if (!qns.trim()) return;

    const userMessage = {
      type: "user",
      content: qns,
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setQns("");

    try {
      const reply = await askChatbot(qns);
      const cleanReply = cleanHtmlResponse(reply);
      
      const botMessage = {
        type: "bot",
        content: cleanReply,
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        type: "bot",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAsk();
    }
  }

  function clearChat() {
    setMessages([
      {
        type: "bot",
        content: "Hello! I'm your Hotel Bot assistant. How can I help you today?",
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  }

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <div className="header-content">
          <div className="bot-avatar">🏨</div>
          <div className="header-text">
            <h2>Hotel Bot Assistant</h2>
            <span className="status">Online</span>
          </div>
        </div>
        <button className="clear-btn" onClick={clearChat} title="Clear chat">
          🗑️
        </button>
      </div>

      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-avatar">
              {message.type === "bot" ? "🏨" : "👤"}
            </div>
            <div className="message-content">
              {message.type === "bot" ? (
                <div
                  dangerouslySetInnerHTML={{ __html: message.content }}
                  className="bot-response"
                />
              ) : (
                <p>{message.content}</p>
              )}
              <span className="timestamp">{message.timestamp}</span>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message bot">
            <div className="message-avatar">🏨</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="input-container">
        <div className="input-wrapper">
          <input
            ref={inputRef}
            type="text"
            value={qns}
            onChange={(e) => setQns(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            disabled={isLoading}
            className="message-input"
          />
          <button 
            onClick={handleAsk} 
            disabled={isLoading || !qns.trim()}
            className="send-btn"
          >
            {isLoading ? "..." : "Send"}
          </button>
        </div>
        <div className="input-footer">
          <span>Press Enter to send • Shift+Enter for new line</span>
        </div>
      </div>
    </div>
  );
}