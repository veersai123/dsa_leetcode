import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Markdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

export default function AiMentor({ problem, userCodes }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'model', content: "Hi! I'm your AI Mentor. I can give you hints, explain concepts, or debug your code. How can I help you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });
      
      // Construct context
      let contextStr = `You are a helpful DSA AI Mentor on a custom coding platform. 
Do not give the direct full code solution unless specifically asked. Instead, provide hints, explain complexity, or debug the user's code. 
Answer nicely and use a mix of Hindi and English (Hinglish) if appropriate.

Current Problem: ${problem?.title || 'Unknown'} (${problem?.difficulty || 'Unknown'})
Problem Description: ${problem?.problem || 'No description'}
`;
      
      // Include user code if any
      const activeCode = userCodes?.['bruteforce'] || userCodes?.['optimized1'] || userCodes?.['optimized2'];
      if (activeCode) {
        contextStr += `\nUser's Current Code:\n\`\`\`java\n${activeCode}\n\`\`\`\n\n`;
      }
      
      const chat = model.startChat({
        history: messages.slice(1).map(m => ({ // Skip the first greeting message from history
          role: m.role,
          parts: [{ text: m.content }]
        })),
        systemInstruction: { parts: [{ text: contextStr }]},
      });

      const result = await chat.sendMessage(userMessage);
      const response = await result.response;
      const text = response.text();

      setMessages(prev => [...prev, { role: 'model', content: text }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "Sorry, I encountered an error connecting to the AI service. Please check your API key and internet connection." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-12 right-6 p-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full shadow-lg shadow-emerald-500/20 transition-all duration-300 z-50 ${isOpen ? 'scale-0' : 'scale-100'}`}
        title="Ask AI Mentor"
      >
        <MessageCircle size={22} />
      </button>

      {/* Chat Window */}
      <div 
        className={`fixed bottom-12 right-6 w-[400px] h-[600px] max-h-[85vh] bg-[var(--color-bg-sidebar)] border border-slate-700 shadow-2xl rounded-2xl flex flex-col transition-all duration-300 z-50 overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-[var(--color-bg-panel)] relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-white leading-tight">AI Mentor</h3>
              <p className="text-xs text-slate-400">Powered by Gemini</p>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800"
          >
            <X size={20} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-[var(--color-bg-sidebar)]">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 max-w-[95%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-slate-700 text-slate-300' : 'bg-emerald-500/20 text-emerald-400'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`rounded-2xl p-3 text-sm prose prose-invert prose-p:leading-relaxed prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 ${
                msg.role === 'user' 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-[var(--color-bg-panel)] text-slate-200 rounded-tl-none border border-slate-700'
              }`}>
                {msg.role === 'user' ? (
                  <p className="m-0 whitespace-pre-wrap">{msg.content}</p>
                ) : (
                  <div className="markdown-body">
                    <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{msg.content}</Markdown>
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 max-w-[90%]">
              <div className="p-2 rounded-full h-8 w-8 flex items-center justify-center shrink-0 bg-emerald-500/20 text-emerald-400">
                <Bot size={16} />
              </div>
              <div className="rounded-2xl p-4 bg-[var(--color-bg-panel)] rounded-tl-none border border-slate-700 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-emerald-400" />
                <span className="text-sm text-slate-400">Thinking...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-700 bg-[var(--color-bg-panel)] relative z-10">
          <div className="flex items-end gap-2 bg-[var(--color-bg-sidebar)] border border-slate-700 rounded-xl p-2 focus-within:border-emerald-500 transition-colors">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask for a hint or explain..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm text-white resize-none max-h-32 min-h-[40px] p-2 outline-none"
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="p-2 text-emerald-500 hover:bg-emerald-500/20 rounded-lg disabled:opacity-50 disabled:hover:bg-transparent transition-colors mb-1"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
