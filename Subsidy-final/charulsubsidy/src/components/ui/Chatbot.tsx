import { useState, useEffect, useRef } from "react";

type Message = {
  sender: "user" | "bot";
  text: string;
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hello! How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isOpen, setIsOpen] = useState(true); // ✅ NEW STATE
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("http://localhost:5000/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();

      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          { sender: "bot", text: data.reply }
        ]);
        setIsTyping(false);
      }, 800);
    } catch {
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Server error. Please try again." }
      ]);
      setIsTyping(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* 🔽 Minimized Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "10px 15px",
            borderRadius: "20px",
            background: "#007bff",
            color: "white",
            border: "none",
            cursor: "pointer"
          }}
        >
          Chat
        </button>
      )}

      {/* 🔽 Chat Window */}
      {isOpen && (
        <div style={chatContainer}>
          
          {/* 🔽 Header with Minimize */}
          <div
            style={{
              ...chatHeader,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <span>Chat Assistant</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: "18px",
                cursor: "pointer"
              }}
            >
              −
            </button>
          </div>

          {/* 🔽 Messages */}
          <div style={chatBody}>
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  textAlign: msg.sender === "user" ? "right" : "left",
                  margin: "5px 0"
                }}
              >
                <span
                  style={{
                    ...messageBubble,
                    background:
                      msg.sender === "user" ? "#007bff" : "#f1f1f1",
                    color: msg.sender === "user" ? "white" : "black"
                  }}
                >
                  {msg.text}
                </span>
              </div>
            ))}

            {isTyping && (
              <div style={{ fontStyle: "italic" }}>Bot is typing...</div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* 🔽 Input */}
          <div style={chatInputArea}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about schemes..."
              style={inputStyle}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage} style={buttonStyle}>
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}

const chatContainer: React.CSSProperties = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  width: "350px",
  height: "450px",
  background: "white",
  borderRadius: "10px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
  display: "flex",
  flexDirection: "column"
};

const chatHeader: React.CSSProperties = {
  background: "#007bff",
  color: "white",
  padding: "10px",
  borderTopLeftRadius: "10px",
  borderTopRightRadius: "10px"
};

const chatBody: React.CSSProperties = {
  flex: 1,
  padding: "10px",
  overflowY: "auto"
};

const messageBubble: React.CSSProperties = {
  display: "inline-block",
  padding: "8px 12px",
  borderRadius: "15px",
  maxWidth: "75%"
};

const chatInputArea: React.CSSProperties = {
  display: "flex",
  padding: "10px",
  borderTop: "1px solid #ddd"
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: "8px",
  borderRadius: "5px",
  border: "1px solid #ccc"
};

const buttonStyle: React.CSSProperties = {
  marginLeft: "5px",
  padding: "8px 12px",
  borderRadius: "5px",
  border: "none",
  background: "#007bff",
  color: "white",
  cursor: "pointer"
};