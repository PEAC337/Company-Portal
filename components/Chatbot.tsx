import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { ChatbotIcon } from './icons/ChatbotIcon';
import { CloseIcon } from './icons/CloseIcon';
import { SendIcon } from './icons/SendIcon';

interface Message {
  role: 'user' | 'model';
  text: string;
  sources?: { uri: string; title: string }[];
}

interface Location {
    latitude: number;
    longitude: number;
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<Location | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      // Focus input when chat opens
      setTimeout(() => inputRef.current?.focus(), 300);
      setMessages([
          { role: 'model', text: 'Hello! How can I assist you today? I can access up-to-date information to answer your questions.' }
      ]);
      
      // Request user's location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.warn(`Geolocation error: ${error.message}`);
          // You could add a message to the user here if needed
        }
      );

    } else {
        setMessages([]);
        setUserInput('');
        setIsLoading(false);
        setError(null);
        setLocation(null);
    }
  }, [isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedInput = userInput.trim();
    if (!trimmedInput || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', text: trimmedInput }];
    setMessages(newMessages);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: trimmedInput,
        config: {
          tools: [{ googleSearch: {} }, { googleMaps: {} }],
          ...(location && {
            toolConfig: {
              retrievalConfig: {
                latLng: location,
              },
            },
          }),
        },
      });
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      const sources: { uri: string, title: string }[] = [];
      if (groundingChunks) {
        for (const chunk of groundingChunks) {
          if (chunk.web) {
            sources.push({ uri: chunk.web.uri, title: chunk.web.title });
          } else if (chunk.maps) {
            sources.push({ uri: chunk.maps.uri, title: chunk.maps.title });
          }
        }
      }

      setMessages([
        ...newMessages,
        { role: 'model', text: response.text, sources: sources.length > 0 ? sources : undefined },
      ]);
    } catch (err) {
      console.error(err);
      const errorMessage = 'Sorry, I encountered an error. Please try again.';
      setError(errorMessage);
      setMessages([...newMessages, { role: 'model', text: errorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Chat Bubble */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-amber-600 text-white rounded-full p-4 shadow-lg hover:bg-amber-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-500 transition-all duration-300 transform hover:scale-110"
          aria-label={isOpen ? 'Close chat' : 'Open chat'}
        >
          {isOpen ? <CloseIcon className="h-8 w-8" /> : <ChatbotIcon className="h-8 w-8" />}
        </button>
      </div>

      {/* Chat Window */}
      <div
        className={`fixed bottom-24 right-6 w-[calc(100%-3rem)] max-w-md h-[70vh] max-h-[600px] bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ease-in-out z-30 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
        }`}
        role="dialog"
        aria-hidden={!isOpen}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-slate-700 flex items-center justify-between">
          <h3 className="font-brand text-xl text-slate-100 tracking-wider">Ministry Assistant</h3>
          <button onClick={() => setIsOpen(false)} aria-label="Close chat window">
            <CloseIcon className="h-6 w-6 text-slate-400 hover:text-white" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-grow p-4 overflow-y-auto">
          <div className="flex flex-col space-y-4">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs md:max-w-sm rounded-xl px-4 py-2 ${msg.role === 'user' ? 'bg-blue-800 text-white' : 'bg-slate-700 text-slate-200'}`}>
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-600">
                        <h4 className="text-xs font-bold text-slate-400 mb-1">Sources:</h4>
                        <ul className="text-xs space-y-1">
                            {msg.sources.map((source, i) => (
                                <li key={i}>
                                    <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline break-all">
                                        {i + 1}. {source.title || source.uri}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-xs md:max-w-sm rounded-xl px-4 py-2 bg-slate-700 text-slate-200">
                    <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <div className="flex-shrink-0 p-4 border-t border-slate-700">
          <form onSubmit={handleSendMessage} className="relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask a question..."
              className="w-full bg-slate-800 border border-slate-600 rounded-full py-2 pl-4 pr-12 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
              disabled={isLoading}
              aria-label="Chat input"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full bg-amber-600 text-white hover:bg-amber-500 disabled:bg-slate-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-amber-500"
              disabled={isLoading || !userInput.trim()}
              aria-label="Send message"
            >
              <SendIcon className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Chatbot;