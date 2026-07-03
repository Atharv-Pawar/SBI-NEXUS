import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, User, RefreshCw, ChevronDown, ChevronUp, AlertCircle, ArrowRight } from 'lucide-react';

export default function ChatBot({ onNavigate, onTriggerOnboarding }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello Atharv! I am **SBI NEXUS**, your Agentic AI financial companion. 🚀\n\nI monitor your savings rate, simulate what-if scenarios on your cash flow, and proactively watch out for scam alerts. How can I assist you today?\n\n*Try asking me:*\n- *'How will my savings grow if I cut spending by 15%?'*\n- *'Check for recent security flags'*\n- *'Help me activate SBI YONO'*"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [expandedLogs, setExpandedLogs] = useState({});

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    if (!textToSend) setInput('');
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.response,
          agent_logs: data.agent_logs,
          suggested_actions: data.suggested_actions,
          action_route: data.action_route
        }]);
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "❌ Sorry, I encountered an issue connecting to the AI agent layers. Please verify if the backend service is running."
        }]);
      }
    } catch (e) {
      console.error(e);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "⚠️ **Offline Mode Active:** The agent layers are currently offline. Please run the backend FastAPI server to initiate live orchestrations."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (action) => {
    if (action.type === 'navigate') {
      onNavigate(action.value);
    } else if (action.type === 'onboard') {
      onTriggerOnboarding(action.value);
    } else if (action.type === 'apply_twin') {
      onNavigate('digital_twin'); // Navigate to twin tab
    }
  };

  const toggleLog = (index) => {
    setExpandedLogs(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Quick suggestions list
  const suggestions = [
    "What if I cut spending by 15%?",
    "Check for security threats",
    "Help me setup UPI payments",
    "View my goal timelines"
  ];

  return (
    <div className="flex flex-col h-[500px] bg-slate-950/80 rounded-2xl border border-slate-800/80 overflow-hidden relative">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sbi-blue via-sbi-light to-sbi-blue" />
      
      {/* Header */}
      <div className="px-5 py-3 border-b border-slate-850 flex items-center justify-between bg-slate-900/50">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-sbi-blue border border-sbi-light rounded-lg text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-wide">SBI NEXUS Orchestrator</h4>
            <span className="text-[9px] text-slate-400 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Multi-Agent Active
            </span>
          </div>
        </div>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role !== 'user' && (
              <div className="p-2 rounded-xl bg-sbi-blue border border-sbi-light/30 text-white shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div className="space-y-2 max-w-[80%]">
              <div className={`p-4 rounded-2xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-slate-900 border border-slate-800 text-white rounded-tr-none'
                  : 'bg-slate-900/50 border border-slate-800/60 text-slate-200 rounded-tl-none'
              }`}>
                {/* Parse basic markdown details */}
                <div className="space-y-2 whitespace-pre-wrap">
                  {msg.content.split('\n').map((line, lIdx) => {
                    let formatted = line;
                    // Bold matching: **text**
                    formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    // Italic matching: *text*
                    formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
                    
                    return <p key={lIdx} dangerouslySetInnerHTML={{ __html: formatted }} />;
                  })}
                </div>
              </div>

              {/* Agent Collaboration Trace Panel */}
              {msg.agent_logs && msg.agent_logs.length > 0 && (
                <div className="border border-slate-800 bg-slate-900/20 rounded-xl overflow-hidden text-[10px]">
                  <button
                    onClick={() => toggleLog(index)}
                    className="w-full flex items-center justify-between px-3.5 py-2 hover:bg-slate-900/40 text-slate-400 font-semibold transition-colors"
                  >
                    <span className="flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-sbi-light" />
                      View Agent Collaboration Trace ({msg.agent_logs.length})
                    </span>
                    {expandedLogs[index] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                  {expandedLogs[index] && (
                    <div className="px-3.5 py-2.5 border-t border-slate-850 space-y-2 bg-slate-950/40">
                      {msg.agent_logs.map((log, lIdx) => (
                        <div key={lIdx} className="border-l border-slate-800 pl-2 py-0.5">
                          <span className="font-bold text-sbi-light block">{log.agent}</span>
                          <span className="text-[9px] text-slate-400 block mt-0.5">Action: {log.action}</span>
                          <span className="text-[9px] text-slate-300 block mt-0.5">✓ {log.result}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Suggested Action Callouts */}
              {msg.suggested_actions && msg.suggested_actions.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {msg.suggested_actions.map((act, aIdx) => (
                    <button
                      key={aIdx}
                      onClick={() => handleActionClick(act)}
                      className="px-3.5 py-1.5 bg-sbi-blue border border-sbi-light/40 hover:bg-sbi-light/20 text-white rounded-xl text-[10px] font-bold transition-all flex items-center gap-1"
                    >
                      {act.text} <ArrowRight className="w-3 h-3" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-sbi-blue border border-sbi-light/30 text-white shrink-0">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-900/50 border border-slate-800/60 p-4 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-sbi-light" />
              Orchestrator invoking AI Agent network...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 border-t border-slate-900 bg-slate-950 flex gap-2 overflow-x-auto shrink-0 select-none">
        {suggestions.map((sug, sIdx) => (
          <button
            key={sIdx}
            onClick={() => handleSend(sug)}
            className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-full text-[10px] text-slate-400 font-medium hover:border-slate-700 hover:text-white transition-colors shrink-0"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        className="p-3 border-t border-slate-850 bg-slate-900/50 flex gap-2 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask SBI NEXUS companion..."
          className="flex-1 bg-slate-950 border border-slate-800 focus:border-sbi-light focus:outline-none rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 bg-sbi-light hover:bg-sbi-hover text-white rounded-xl disabled:opacity-50 transition-colors shadow-lg shadow-sbi-light/10"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
}
