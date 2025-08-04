import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import type { Unit, DirectInstagram } from '../types'

// Mock data para fallback
const mockUnits: Unit[] = [
  {
    id: 'mock-unit-1',
    nome: 'Unidade Centro',
    codigo: 'UC001',
    localizacao: 'Centro da Cidade',
    fase_atual_id: 'mock-phase-1',
    status: 'ativa',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

const mockDirectConversas: DirectInstagram[] = [
  {
    id: 'mock-direct-1',
    unidade_id: 'mock-unit-1',
    id_ig_usuario: '123456',
    id_conta_instagram_unidade: 'conta_ig_1',
    bearer_token: null,
    mensagens: [{ conversas: [{ resposta: 'Olá!', usuario: 'conta_ig_1', mensagem: 'Oi, tudo bem?', timestamp: new Date().toISOString() }] }],
    id_recipient: null,
    nome: 'Usuário Direct',
    whatsapp: '11999999999',
    pic: null,
    mensagens_nao_lidas: 1,
    total_mensagens: 1,
    status: 'ativa',
    metadados: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
]

export const useSupabaseData = () => {
  const [units, setUnits] = useState<Unit[]>([])
  const [directConversas, setDirectConversas] = useState<DirectInstagram[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAllData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      if (!supabase) {
        setUnits(mockUnits)
        setDirectConversas(mockDirectConversas)
        setLoading(false)
        return
      }

      // Use o nome da tabela exatamente como está no banco, SEM aspas duplas
      const tableName = 'UNIDADES'
      const directTableName = 'DIRECT_INSTAGRAM'

      // Testa conexão usando UNIDADES (tabela em caixa alta)
      const testResult = await supabase.from(tableName).select('id').limit(1)
      if (testResult.error) throw new Error('Supabase connection failed: ' + testResult.error.message)

      // Busca dados reais das tabelas em caixa alta
      const [unitsResult, directConversasResult] = await Promise.all([
        supabase.from(tableName).select('*').order('created_at', { ascending: false }).limit(1000),
        supabase.from(directTableName).select('*').order('created_at', { ascending: false }).limit(100)
      ])

      // LOGS DE DEBUG
      console.log('UNIDADES result:', unitsResult)
      if (unitsResult.error) {
        console.error('Erro ao buscar UNIDADES:', unitsResult.error)
        setError('Erro ao buscar UNIDADES: ' + unitsResult.error.message)
      }
      if (directConversasResult.error) {
        console.error('Erro ao buscar DIRECT_INSTAGRAM:', directConversasResult.error)
      }

      // Fallback para mock se algum resultado vier vazio ou erro
      setUnits(unitsResult.data && unitsResult.data.length > 0 ? unitsResult.data : mockUnits)
      setDirectConversas(directConversasResult.data && directConversasResult.data.length > 0 ? directConversasResult.data : mockDirectConversas)
    } catch (err: any) {
      setUnits(mockUnits)
      setDirectConversas(mockDirectConversas)
      setError('Erro ao conectar ao Supabase: ' + (err?.message || String(err)))
      console.error('Erro global Supabase:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  return {
    units,
    directConversas,
    loading,
    error,
    refetch: fetchAllData
  }
}
