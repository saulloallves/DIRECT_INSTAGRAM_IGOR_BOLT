import React from 'react'
import type { Unit } from '../types'
import { useSupabaseData } from '../hooks/useSupabaseData'

const UnidadesTab: React.FC = () => {
  const { units, loading, error } = useSupabaseData()
  const [search, setSearch] = React.useState('')

  // Filtro seguro para evitar erro de toLowerCase
  const filteredUnits = units.filter((u) =>
    String(u.codigo || '')
      .toLowerCase()
      .includes(search.toLowerCase())
    || String(u.nome || '')
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Unidades</h2>
      <input
        type="text"
        placeholder="Buscar por código ou nome..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="border rounded px-2 py-1 mb-4 w-full"
      />
      {loading && <div>Carregando...</div>}
      {error && <div className="text-red-500">{error}</div>}
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Código</th>
            <th className="border px-2 py-1">Nome</th>
            <th className="border px-2 py-1">Localização</th>
            <th className="border px-2 py-1">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredUnits.map((u) => (
            <tr key={u.id}>
              <td className="border px-2 py-1">{u.codigo}</td>
              <td className="border px-2 py-1">{u.nome}</td>
              <td className="border px-2 py-1">{u.localizacao}</td>
              <td className="border px-2 py-1">{u.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {filteredUnits.length === 0 && !loading && (
        <div className="mt-4 text-gray-500">Nenhuma unidade encontrada.</div>
      )}
    </div>
  )
}

export default UnidadesTab
