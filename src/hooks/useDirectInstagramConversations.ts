import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Tipos para mensagens e conversas
export interface ChatMessage {
  id: string
  sender: 'me' | 'them'
  text: string
  timestamp: string
}

export interface ChatConversation {
  id: string
  name: string
  avatarUrl?: string
  messages: ChatMessage[]
  sugestoesIA?: { id: string; texto: string }[]
}

const mockSugestoes = {
  "sugestão_01": "Olá! Sim, temos vestidos temáticos disponíveis. Você procura algum tema específico?",
  "sugestão_02": "Oi! Trabalhamos com vestidos temáticos sim. Gostaria de conhecer nossas opções?",
  "sugestão_03": "Olá! Temos vários modelos de vestidos temáticos. Posso ajudar a encontrar o que você precisa?"
}

const mockConversations: ChatConversation[] = [
  {
    id: 'mock-direct-1',
    name: 'Usuário Direct',
    avatarUrl: 'https://randomuser.me/api/portraits/men/32.jpg',
    messages: [
      {
        id: 'm1',
        sender: 'them',
        text: 'Oi, tudo bem?',
        timestamp: '09:00'
      },
      {
        id: 'm2',
        sender: 'me',
        text: 'Olá! Como posso ajudar?',
        timestamp: '09:01'
      }
    ],
    sugestoesIA: Object.entries(mockSugestoes).slice(0, 3).map(([id, texto]) => ({
      id,
      texto
    }))
  }
]

// Função robusta para parsear sugestões IA
function parseSugestoesIA(raw: any): { id: string; texto: string }[] {
  if (!raw) return []
  let obj: any = raw

  // Se vier stringificada duas vezes, desfaça
  if (typeof obj === 'string') {
    try {
      obj = JSON.parse(obj)
      if (typeof obj === 'string') {
        obj = JSON.parse(obj)
      }
    } catch {
      return []
    }
  }

  // Se for objeto, converte para array de sugestões
  if (typeof obj === 'object' && !Array.isArray(obj)) {
    return Object.entries(obj)
      .slice(0, 3)
      .map(([id, texto]) => ({
        id,
        texto: String(texto)
      }))
  }

  // Se for array, tenta mapear
  if (Array.isArray(obj)) {
    return obj.slice(0, 3).map((item, idx) => ({
      id: item.id || `sugestao_${idx + 1}`,
      texto: item.texto || String(item)
    }))
  }

  return []
}

export function useDirectInstagramConversations(unitId?: string) {
  const [conversations, setConversations] = useState<ChatConversation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        if (!supabase) {
          setConversations(mockConversations)
          setLoading(false)
          return
        }
        let query = supabase
          .from('DIRECT_INSTAGRAM')
          .select('ID, id_ig_usuario, pic, mensagens, SUGESTOES_IA, unidade_id')
          .order('created_at', { ascending: false })
          .limit(50)
        // Filtro por unidade_id
        if (unitId) {
          query = query.eq('unidade_id', unitId)
        }
        const { data, error: err } = await query
        if (err) throw err

        // Mapear para ChatConversation
        const mapped: ChatConversation[] = (data as any[]).map(conv => {
          // DEBUG: log do campo SUGESTOES_IA
          // eslint-disable-next-line no-console
          console.log('SUGESTOES_IA recebido:', conv.SUGESTOES_IA)
          return {
            id: conv.ID,
            name: conv.id_ig_usuario || `Usuário ${conv.ID}`,
            avatarUrl: conv.pic || 'https://randomuser.me/api/portraits/lego/1.jpg',
            messages: Array.isArray(conv.mensagens)
              ? conv.mensagens.map((msg: any, idx: number) => {
                  if (msg.usuario) {
                    return {
                      id: `u${idx}`,
                      sender: 'them',
                      text: msg.mensagem,
                      timestamp: msg.timestamp || ''
                    }
                  } else if (msg.resposta) {
                    return {
                      id: `r${idx}`,
                      sender: 'me',
                      text: msg.mensagem,
                      timestamp: msg.timestamp || ''
                    }
                  }
                  return null
                }).filter(Boolean) as ChatMessage[]
              : [],
            sugestoesIA: parseSugestoesIA(conv.SUGESTOES_IA)
          }
        })
        setConversations(mapped)
      } catch (e: any) {
        setError(e.message)
        setConversations(mockConversations)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [unitId])

  return { conversations, loading, error }
}
