'use client';

import { useState, useCallback } from 'react';
import { ChatSidebar } from '@/components/chat/ChatSidebar';
import { MessageList } from '@/components/chat/MessageList';
import { ChatInput } from '@/components/chat/ChatInput';
import { useChat } from '@/hooks/useChat';
import { AI_MODELS, DEFAULT_MODEL } from '@/lib/ai/models';
import { ChevronDown, Settings2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Conversation {
  id: string;
  title: string;
  updatedAt: number;
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState(DEFAULT_MODEL);
  const [modelPickerOpen, setModelPickerOpen] = useState(false);

  const currentModel = AI_MODELS.find((m) => m.id === selectedModel);

  const { messages, isStreaming, error, sendMessage, stopStreaming, clearMessages } =
    useChat({
      model: selectedModel,
      provider: currentModel?.provider,
    });

  const handleNewChat = useCallback(() => {
    const id = crypto.randomUUID();
    const newConv: Conversation = {
      id,
      title: 'New Chat',
      updatedAt: Date.now(),
    };
    setConversations((prev) => [newConv, ...prev]);
    setActiveConvId(id);
    clearMessages();
  }, [clearMessages]);

  const handleSend = useCallback(
    async (content: string) => {
      if (!activeConvId) {
        handleNewChat();
      }
      await sendMessage(content);

      // Auto-title from first message
      if (activeConvId && messages.length === 0) {
        const title = content.slice(0, 40) + (content.length > 40 ? '...' : '');
        setConversations((prev) =>
          prev.map((c) => (c.id === activeConvId ? { ...c, title } : c))
        );
      }
    },
    [activeConvId, handleNewChat, sendMessage, messages.length]
  );

  const handleDelete = useCallback(
    (id: string) => {
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConvId === id) {
        setActiveConvId(null);
        clearMessages();
      }
    },
    [activeConvId, clearMessages]
  );

  const handleRename = useCallback((id: string, title: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c))
    );
  }, []);

  const handleSelect = useCallback((id: string) => {
    setActiveConvId(id);
    // In a real app, load messages from Convex here
    clearMessages();
  }, [clearMessages]);

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Sidebar */}
      <ChatSidebar
        conversations={conversations}
        activeId={activeConvId ?? undefined}
        onNew={handleNewChat}
        onSelect={handleSelect}
        onDelete={handleDelete}
        onRename={handleRename}
      />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/50 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-2">
            {/* Model picker */}
            <div className="relative">
              <button
                onClick={() => setModelPickerOpen(!modelPickerOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/8 border border-white/8 text-sm text-zinc-300 transition-colors"
              >
                <span className="font-medium">{currentModel?.name ?? selectedModel}</span>
                <ChevronDown className={cn('w-3.5 h-3.5 transition-transform', modelPickerOpen && 'rotate-180')} />
              </button>

              {modelPickerOpen && (
                <div className="absolute top-full left-0 mt-1 w-72 rounded-xl bg-zinc-900 border border-white/10 shadow-2xl z-50 overflow-hidden">
                  <div className="p-2">
                    <p className="text-[10px] text-zinc-600 uppercase font-semibold tracking-wider px-2 py-1 mb-1">
                      Select Model
                    </p>
                    {AI_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model.id);
                          setModelPickerOpen(false);
                        }}
                        className={cn(
                          'w-full flex items-start gap-3 px-3 py-2 rounded-lg text-left transition-colors',
                          selectedModel === model.id
                            ? 'bg-red-500/10 border border-red-500/20'
                            : 'hover:bg-white/5 border border-transparent'
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-zinc-200">{model.name}</span>
                            <span className="text-[10px] text-zinc-600 border border-white/8 rounded px-1">
                              {model.provider}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-500 mt-0.5">{model.description}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-colors">
              <Settings2 className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 flex flex-col min-h-0">
          {error && (
            <div className="mx-4 mt-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400">
              {error}
            </div>
          )}
          <MessageList messages={messages} isStreaming={isStreaming} />
        </div>

        {/* Input */}
        <div className="px-4 pb-4 flex-shrink-0">
          <ChatInput
            onSend={handleSend}
            onStop={stopStreaming}
            isStreaming={isStreaming}
          />
        </div>
      </div>
    </div>
  );
}
