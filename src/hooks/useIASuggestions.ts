import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

// Retorna sugestões como array de objetos { id, texto }
export function useIASuggestions(conversationId?: string) {
  const [suggestions, setSuggestions] = useState<{ id: string; texto: string }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSuggestions() {
      setLoading(true)
      if (!supabase || !conversationId) {
        setSuggestions([
          { id: '1', texto: 'Obrigado pelo seu comentário! Estamos à disposição para ajudar.' },
          { id: '2', texto: 'Agradecemos seu contato! Se precisar de algo, conte conosco.' },
          { id: '3', texto: 'Sua mensagem é muito importante para nós. Em breve retornaremos!' }
        ])
        setLoading(false)
        return
      }
      // Tabela e coluna com case exato
      const { data, error } = await supabase
        .from('DIRECT_INSTAGRAM')
        .select('SUGESTOES_IA')
        .eq('id', conversationId)
        .single()
      if (error || !data || !data.SUGESTOES_IA) {
        setSuggestions([
          { id: '1', texto: 'Obrigado pelo seu comentário! Estamos à disposição para ajudar.' },
          { id: '2', texto: 'Agradecemos seu contato! Se precisar de algo, conte conosco.' },
          { id: '3', texto: 'Sua mensagem é muito importante para nós. Em breve retornaremos!' }
        ])
        setLoading(false)
        return
      }
      const json = data.SUGESTOES_IA
      if (json && typeof json === 'object') {
        setSuggestions(
          Object.entries(json).map(([k, v]) => ({
            id: k,
            texto: String(v)
          }))
        )
      } else {
        setSuggestions([])
      }
      setLoading(false)
    }
    fetchSuggestions()
  }, [conversationId])

  return { suggestions, loading }
}
