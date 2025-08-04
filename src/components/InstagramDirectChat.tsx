import React, { useState } from 'react'
import { useDirectInstagramConversations } from '../hooks/useDirectInstagramConversations'

const ConversationList: React.FC<{
  conversations: { id: string; name: string; avatarUrl?: string }[]
  selectedId: string
  onSelect: (id: string) => void
  loading: boolean
}> = ({ conversations, selectedId, onSelect, loading }) => (
  <div className="w-64 bg-white border-r h-full overflow-y-auto">
    <div className="p-4 font-bold text-lg border-b">Conversas</div>
    {loading ? (
      <div className="p-4 text-gray-400">Carregando...</div>
    ) : conversations.length === 0 ? (
      <div className="p-4 text-gray-400">Nenhuma conversa encontrada</div>
    ) : (
      conversations.map(conv => (
        <div
          key={conv.id}
          className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-100 ${
            conv.id === selectedId ? 'bg-gray-100 font-semibold' : ''
          }`}
          onClick={() => onSelect(conv.id)}
        >
          <img
            src={conv.avatarUrl}
            alt={conv.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <span>{conv.name}</span>
        </div>
      ))
    )}
  </div>
)

const MessageList: React.FC<{ messages: { id: string; sender: 'me' | 'them'; text: string; timestamp: string }[] }> = ({ messages }) => (
  <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col gap-2" style={{ maxHeight: '60vh', minHeight: '200px' }}>
    {messages.map(msg => (
      <div
        key={msg.id}
        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`px-4 py-2 rounded-2xl max-w-xs ${
            msg.sender === 'me'
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
              : 'bg-gray-200 text-gray-900'
          }`}
        >
          <span>{msg.text}</span>
          <div className="text-xs text-gray-200 mt-1 text-right" style={{ color: msg.sender === 'me' ? '#f3e8ff' : '#a3a3a3' }}>
            {msg.timestamp}
          </div>
        </div>
      </div>
    ))}
  </div>
)

const SuggestionsBar: React.FC<{
  suggestions: { id: string; texto: string }[]
  onSuggestionClick: (texto: string) => void
  loading: boolean
}> = ({ suggestions, onSuggestionClick, loading }) => {
  // Garantir que só mostra até 3 sugestões
  const topSuggestions = suggestions.slice(0, 3)
  // Log para debug
  console.log('Sugestões IA recebidas:', suggestions)
  return (
    <div className="w-full px-6 pt-3 pb-1 bg-white" style={{ minHeight: '40px' }}>
      <div className="flex flex-wrap gap-2 overflow-x-auto">
        {loading ? (
          <span className="text-gray-400">Carregando sugestões...</span>
        ) : topSuggestions.length === 0 ? (
          <span className="text-gray-400">Nenhuma sugestão disponível</span>
        ) : (
          topSuggestions.map(s => (
            <button
              key={s.id}
              className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-pink-200 transition whitespace-nowrap"
              onClick={() => onSuggestionClick(s.texto)}
              type="button"
            >
              {s.texto}
            </button>
          ))
        )}
      </div>
    </div>
  )
}

const MessageInput: React.FC<{
  value: string
  onChange: (v: string) => void
  onSend: () => void
}> = ({
  value,
  onChange,
  onSend
}) => (
  <div className="w-full px-6 pb-4 pt-1 bg-white">
    <div className="flex gap-2">
      <input
        className="w-full border rounded-full px-4 py-2"
        placeholder="Mensagem..."
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter') onSend()
        }}
      />
      <button
        className="bg-pink-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-pink-600 transition"
        onClick={onSend}
        disabled={!value.trim()}
      >
        Enviar
      </button>
    </div>
  </div>
)

const InstagramDirectChat: React.FC<{ unitId?: string }> = ({ unitId }) => {
  const { conversations, loading } = useDirectInstagramConversations(unitId)
  const [selectedId, setSelectedId] = useState('')
  const [input, setInput] = useState('')

  // Seleciona a primeira conversa automaticamente
  React.useEffect(() => {
    if (!selectedId && conversations.length > 0) {
      setSelectedId(conversations[0].id)
    }
  }, [conversations, selectedId])

  const selectedConv = conversations.find(c => c.id === selectedId)
  const suggestions = selectedConv?.sugestoesIA || []
  const loadingSuggestions = loading

  // Adiciona mensagem localmente (apenas para simulação visual)
  const handleSend = () => {
    if (!input.trim() || !selectedConv) return
    selectedConv.messages.push({
      id: `local-${Date.now()}`,
      sender: 'me',
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    })
    setInput('')
  }

  const handleSuggestionClick = (texto: string) => {
    setInput(texto)
  }

  return (
    <div className="flex h-[70vh] bg-white rounded-xl shadow overflow-hidden border">
      <ConversationList
        conversations={conversations}
        selectedId={selectedId}
        onSelect={setSelectedId}
        loading={loading}
      />
      <div className="flex flex-col flex-1">
        <div className="flex-1 flex flex-col">
          {selectedConv ? (
            <MessageList messages={selectedConv.messages} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Selecione uma conversa
            </div>
          )}
        </div>
        {/* SUGESTOES_IA BAR */}
        <SuggestionsBar
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
          loading={loadingSuggestions}
        />
        <MessageInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
        />
      </div>
    </div>
  )
}

export default InstagramDirectChat
