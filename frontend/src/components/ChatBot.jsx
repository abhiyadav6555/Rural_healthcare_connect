import { useState, useRef, useEffect } from 'react';
import API from '../api/axios';

function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Namaste! Main aapki healthcare assistant hu. Aap type karke ya mic dabake bol sakte hain. Kaise help karu?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'hi-IN';

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      setIsOpen(true); // recording poori hone ke baad hi chat khulegi
      handleSend(transcript);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startListening = () => {
    if (!recognitionRef.current) return;
    setIsListening(true);
    recognitionRef.current.start();
  };

  const speak = (text) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'hi-IN';
    utterance.rate = 0.95;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const handleSend = async (overrideText) => {
    const textToSend = (overrideText ?? input).trim();
    if (!textToSend) return;

    setMessages((prev) => [...prev, { sender: 'user', text: textToSend }]);
    setInput('');
    setLoading(true);

    try {
      const res = await API.post('/chatbot/message', { message: textToSend });
      const reply = res.data.reply;

      setMessages((prev) => [...prev, { sender: 'bot', text: reply }]);
      speak(reply);
    } catch (err) {
      const errorMsg = 'Sorry, kuch problem ho gayi. Dobara try karein.';
      setMessages((prev) => [...prev, { sender: 'bot', text: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-24 bg-gradient-to-r from-orange-500 to-blue-600 text-white rounded-full shadow-lg flex items-center gap-2 pl-4 pr-2 py-2 hover:opacity-90 transition-opacity z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2"
          >
            <span className="text-xl">🩺</span>
            <span className="font-semibold text-sm whitespace-nowrap">AI Assistant</span>
          </button>

          <button
            onClick={() => {
              if (voiceSupported) startListening();
            }}
            title="Tap to speak"
            className={`rounded-full w-9 h-9 flex items-center justify-center transition-all shrink-0 ${
              isListening
                ? 'bg-red-500 scale-110 animate-pulse'
                : 'bg-white/20 hover:bg-white/30 hover:scale-110'
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
              <path d="M12 15a3 3 0 003-3V6a3 3 0 10-6 0v6a3 3 0 003 3z" fill="white"/>
              <path d="M19 11a1 1 0 00-2 0 5 5 0 01-10 0 1 1 0 00-2 0 7 7 0 006 6.92V20H9a1 1 0 100 2h6a1 1 0 100-2h-2v-2.08A7 7 0 0019 11z" fill="white"/>
            </svg>
          </button>
        </div>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 h-[28rem] bg-white rounded-lg shadow-2xl flex flex-col z-50 border">
          <div className="bg-blue-600 text-white px-4 py-3 rounded-t-lg flex justify-between items-center">
            <span className="font-semibold text-sm">Health Assistant</span>
            <button
              onClick={() => {
                stopSpeaking();
                setIsOpen(false);
              }}
              className="text-white text-lg"
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`text-sm px-3 py-2 rounded-lg max-w-[85%] ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white self-end'
                    : 'bg-gray-100 text-gray-800 self-start'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && (
              <div className="bg-gray-100 text-gray-500 text-sm px-3 py-2 rounded-lg self-start">
                Typing...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {isSpeaking && (
            <div className="px-3 pb-2">
              <button
                onClick={stopSpeaking}
                className="w-full bg-red-500 text-white text-xs py-1.5 rounded-full hover:bg-red-600 flex items-center justify-center gap-1"
              >
                🔇 Stop Speaking
              </button>
            </div>
          )}

          <div className="p-3 border-t flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type ya mic dabao..."
              className="flex-1 border rounded-full px-3 py-2 text-sm"
            />
            {voiceSupported && (
              <button
                onClick={startListening}
                className={`w-9 h-9 rounded-full flex items-center justify-center text-white shrink-0 ${
                  isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-500 hover:bg-gray-600'
                }`}
                title="Bolke poochho"
              >
                🎤
              </button>
            )}
            <button
              onClick={() => handleSend()}
              className="bg-blue-600 text-white w-9 h-9 rounded-full flex items-center justify-center shrink-0 hover:bg-blue-700"
            >
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default ChatBot;