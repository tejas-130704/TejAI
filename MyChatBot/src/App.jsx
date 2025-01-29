import React, { useState, useRef, useEffect } from "react";
import myImg from "./assets/images/my_img.jpg";


const App = () => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null); // Reference to input field

  const chatEndRef = useRef(null);

  // Function to scroll to the bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (currentMessage.trim()) {
      setMessages([...messages, currentMessage]);
      setLoading(true);  // Set loading state to true
      const data = { query: currentMessage };

      fetch("https://tejai.onrender.com/api/query", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => response.json())
        .then(data => {
          setMessages([...messages, data.response]);
          setLoading(false);  // Stop loading
        })
        .catch(error => {
          setLoading(false);  // Stop loading
          setMessages([...messages, "Something went wrong. Please try again later."]);
        });
      setCurrentMessage(""); // Clear the input after sending
    }
  };

  useEffect(() => {
    // Focus input field after each message
    inputRef.current?.focus();
  }, [messages]);

  return (
    <div className="bg-black text-white font-sans min-h-screen overflow-hidden relative">
      {/* Custom Background Grid */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.15) 0.5px, transparent 0.5px), linear-gradient(90deg, rgba(255,255,255,0.16) 0.5px, transparent 0.5px)",
            backgroundSize: "150px 150px",
          }}
        ></div>
      </div>

      <div className="relative z-10">
        {/* Main Section */}
        <main className="flex flex-col items-center h-screen text-center mt-6">
          <div className="w-32 h-32 rounded-full overflow-hidden">
            <img
              src={myImg}
              alt="Tej AI"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-4xl font-bold mt-4">Tej AI</h2>
          <div
            className="border border-red-400 text-red-700 px-4 mt-2 rounded relative bg-transparent"
            role="alert"
          >
            <strong className="font-bold">BETA</strong>
          </div>
        </main>

        {/* Chat Section */}
        <div className="fixed bottom-0 left-0 w-full bg-black py-4 shadow-lg px-8 md:px-28 mb-4 ">
          <div className="h-52 overflow-y-auto bg-transparent p-4 rounded-md text-gray-300">
            {loading ? (
              <p>Loading...</p>  // Show loading while waiting for response
            ) : messages.length === 0 ? (
              <p className="text-center">Hello! How can I help you ?</p>
            ) : (
              <ul>
                {messages.map((msg, index) => (
                  <li
                    key={index}
                    className={`${index % 2 === 0 ? "text-blue-400" : "text-green-400"} mb-2`}
                  >
                    {msg}
                  </li>
                ))}
              </ul>
            )}
            <div ref={chatEndRef}></div>
          </div>
          <div className="flex items-center mt-4">
            <input
              ref={inputRef}  // Add ref to the input field
              type="text"
              placeholder="Type your message..."
              className="w-full px-4 py-2 rounded-md bg-gray-900 text-white focus:outline-none"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="ml-4 px-6 py-2 border-[1px] rounded-lg hover:border-red-500
              hover:text-red-500"
            >
              Ask
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
