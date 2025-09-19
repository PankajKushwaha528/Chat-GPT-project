// import React from 'react'
// import { Link } from 'react-router-dom'
// // ...existing code...

// const Home = () => {
//   return (
//     <main className="page page--home">
//       <header className="hero">
//         <div className="hero__inner">
//     {/* Theme toggle moved to global header */}
//           <h1 className="hero__title">Seamless UI</h1>
//           <p className="hero__subtitle">Simple, responsive auth screens — mobile-first design.</p>
//           <div className="hero__actions">
//             <Link className="btn" to="/login">Sign in</Link>
//             <Link className="btn btn--primary" to="/register">Get started</Link>
//           </div>
//         </div>
//       </header>
//     </main>
//   )
// }

// export default Home
import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! How can I help you today?", sender: 'ai' },
    { id: 2, text: "Can you help me with a React component?", sender: 'user' },
    { id: 3, text: "Absolutely! What would you like to create?", sender: 'ai' },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { id: 1, title: 'Introduction to React' },
    { id: 2, title: 'Building a login page' },
    { id: 3, title: 'Debugging axios' },
    { id: 4, title: 'Latest chat about UI' },
  ]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;

    const newMessage = { id: messages.length + 1, text: inputMessage, sender: 'user' };
    setMessages([...messages, newMessage]);
    setInputMessage('');

    // TODO: Add your axios call here to send the user message to your backend.
    // The response from the AI can then be added to the messages array.
    // Example:
    // const response = await axios.post('/api/chat', { message: inputMessage });
    // setMessages(currentMessages => [...currentMessages, { id: currentMessages.length + 1, text: response.data.text, sender: 'ai' }]);
  };

  const Message = ({ message }) => {
    const isUser = message.sender === 'user';
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`p-3 rounded-lg max-w-lg ${isUser ? 'bg-indigo-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
          <p className="text-sm">{message.text}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Left Sidebar for Chat History */}
      <div className="hidden md:flex flex-col w-64 bg-gray-800 text-gray-100 p-4">
        <div className="mb-6">
          <h2 className="text-xl font-bold">Chat History</h2>
        </div>
        <button className="w-full text-left bg-indigo-600 hover:bg-indigo-700 text-white rounded-md py-2 px-4 mb-4 font-semibold">
          + New Chat
        </button>
        <div className="flex-1 overflow-y-auto">
          {chatHistory.map((chat) => (
            <div key={chat.id} className="p-3 rounded-md hover:bg-gray-700 transition-colors duration-200 cursor-pointer">
              {chat.title}
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Chat Header */}
        <header className="flex justify-between items-center p-4 bg-white border-b border-gray-200 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-800">Current Chat</h1>
          <button className="text-sm text-gray-500 hover:text-gray-700">...</button>
        </header>

        {/* Chat Messages */}
        <div className="flex-1 p-6 overflow-y-auto bg-white">
          {messages.map((msg) => (
            <Message key={msg.id} message={msg} />
          ))}
        </div>

        {/* Input Area */}
        <footer className="bg-gray-100 p-4 border-t border-gray-200">
          <form onSubmit={handleSendMessage} className="flex">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Message Aurora..."
              className="flex-1 px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-r-lg px-6 py-2 ml-1 transition-colors duration-200 font-semibold"
            >
              Send
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default Home;
