import React, { useState, useMemo } from 'react';
import { useSupabaseData } from '../hooks/useSupabaseData';
import Modal from './Modal';
import { User, MessageCircle, MapPin, Clock, UserCircle } from 'lucide-react';

interface ComentariosTabProps {
  selectedUnitId: string;
}

const COLUMN_CONFIG = [
  {
    key: 'pendente',
    title: 'Esperando Aprovação',
    color: 'bg-yellow-100 border-yellow-300',
    headerColor: 'bg-yellow-200 text-yellow-900',
  },
  {
    key: 'aprovado',
    title: 'Aprovados',
    color: 'bg-green-100 border-green-300',
    headerColor: 'bg-green-200 text-green-900',
  },
  {
    key: 'reprovado',
    title: 'Reprovados',
    color: 'bg-red-100 border-red-300',
    headerColor: 'bg-red-200 text-red-900',
  },
];

const CLASSIFICACAO_LABEL: Record<string, { text: string; color: string }> = {
  pendente: { text: 'Em Análise', color: 'bg-yellow-200 text-yellow-900' },
  aprovado: { text: 'Aprovado', color: 'bg-green-200 text-green-900' },
  reprovado: { text: 'Reprovado', color: 'bg-red-200 text-red-900' },
};

const IA_SUGESTOES = [
  'Obrigado pelo seu comentário! Estamos à disposição.',
  'Agradecemos seu contato! Se precisar de algo, conte conosco.',
  'Sua mensagem é importante para nós. Em breve retornaremos!'
];

const ComentariosTab: React.FC<ComentariosTabProps> = ({ selectedUnitId }) => {
  const { instagramComments, units } = useSupabaseData();
  const [unitId, setUnitId] = useState(selectedUnitId);

  // Modal state
  const [selectedComment, setSelectedComment] = useState<any | null>(null);
  const [showReplyBox, setShowReplyBox] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showIASuggestions, setShowIASuggestions] = useState(true);

  React.useEffect(() => {
    setUnitId(selectedUnitId);
  }, [selectedUnitId]);

  const filteredComments = useMemo(() => {
    if (!unitId) return [];
    return (instagramComments || []).filter(c => c.unidade_id === unitId);
  }, [instagramComments, unitId]);

  const commentsByStatus = useMemo(() => {
    const map: Record<string, typeof filteredComments> = {
      pendente: [],
      aprovado: [],
      reprovado: [],
    };
    filteredComments.forEach(comment => {
      const key = comment.classificacao || 'pendente';
      if (map[key]) map[key].push(comment);
    });
    return map;
  }, [filteredComments]);

  const getUnitName = (unidade_id: string) => {
    const unit = units.find(u => u.id === unidade_id);
    return unit ? unit.nome : '';
  };

  // Simula origem
  const getOrigem = (comment: any) => {
    // Pode ser "HUMANO" ou "IA" conforme regras futuras
    return "HUMANO";
  };

  // Limpa estado do modal ao fechar
  const handleCloseModal = () => {
    setSelectedComment(null);
    setShowReplyBox(false);
    setReplyText('');
    setShowIASuggestions(true);
  };

  const handleDelete = () => {
    // Aqui você pode integrar com Supabase para deletar
    handleCloseModal();
  };

  const handleReply = () => {
    // Aqui você pode integrar com Supabase para salvar resposta
    handleCloseModal();
  };

  const handleIASuggestion = (suggestion: string) => {
    setReplyText(suggestion);
  };

  // Formata data/hora
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('pt-BR') + ', ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6">
      <div className="mb-6 max-w-xs">
        <select
          className="border rounded px-3 py-2 w-full"
          value={unitId}
          onChange={e => setUnitId(e.target.value)}
        >
          {units.map(u => (
            <option key={u.id} value={u.id}>{u.nome}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col md:flex-row gap-6 justify-center">
        {COLUMN_CONFIG.map(col => (
          <div
            key={col.key}
            className={`flex-1 min-w-[260px] border rounded-xl ${col.color} shadow-sm flex flex-col`}
          >
            <div className={`p-3 rounded-t-xl font-bold text-center text-base border-b ${col.headerColor}`}>
              {col.title} <span className="ml-1 text-xs font-normal">({commentsByStatus[col.key].length})</span>
            </div>
            <div className="flex-1 p-2 space-y-2 min-h-[120px]">
              {commentsByStatus[col.key].length === 0 ? (
                <div className="text-gray-400 text-center py-6">Nenhum comentário</div>
              ) : (
                commentsByStatus[col.key].map(comment => (
                  <div
                    key={comment.id}
                    className="bg-white border border-gray-200 rounded p-2 shadow-sm hover:bg-gray-50 transition cursor-pointer"
                    onClick={() => setSelectedComment(comment)}
                  >
                    <div className="text-sm text-gray-800">{comment.conteudo}</div>
                    <div className="text-xs text-gray-500 mt-1">@{comment.autor}</div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal de detalhes do comentário */}
      <Modal
        isOpen={!!selectedComment}
        onClose={handleCloseModal}
        className="p-0"
      >
        {selectedComment && (
          <div className="bg-[#fff] rounded-2xl min-w-[340px] max-w-[440px] shadow-xl overflow-hidden">
            {/* Cabeçalho */}
            <div className="flex items-center gap-3 px-6 pt-5 pb-3 border-b">
              <div className="bg-yellow-100 rounded-full p-2">
                <UserCircle className="w-7 h-7 text-yellow-500" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-800 text-lg leading-tight">{selectedComment.autor}</div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${CLASSIFICACAO_LABEL[selectedComment.classificacao || 'pendente'].color}`}>
                    Status: {CLASSIFICACAO_LABEL[selectedComment.classificacao || 'pendente'].text}
                  </span>
                  {selectedComment.created_at && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      <Clock className="w-4 h-4" />
                      {formatDate(selectedComment.created_at)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            {/* Corpo */}
            <div className="px-6 py-4 space-y-4">
              {/* Unidade */}
              <div>
                <div className="flex items-center gap-2 text-blue-700 font-medium text-sm mb-1">
                  <MapPin className="w-4 h-4" />
                  Unidade
                </div>
                <div className="bg-gray-50 border rounded px-3 py-2 text-gray-800 text-sm font-semibold">{getUnitName(selectedComment.unidade_id)}</div>
              </div>
              {/* Comentário */}
              <div>
                <div className="flex items-center gap-2 text-blue-700 font-medium text-sm mb-1">
                  <MessageCircle className="w-4 h-4" />
                  Comentário
                </div>
                <div className="bg-gray-50 border rounded px-3 py-2 text-gray-800 text-sm">{selectedComment.conteudo}</div>
              </div>
              {/* Origem */}
              <div>
                <div className="flex items-center gap-2 text-blue-700 font-medium text-sm mb-1">
                  <User className="w-4 h-4" />
                  Origem
                </div>
                <div className="bg-gray-100 border rounded px-3 py-2 text-gray-700 text-sm flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  HUMANO
                </div>
              </div>
              {/* Responder */}
              <div>
                {/* Removido: título "Responder" com ícone e botão "Sugestões da IA" */}
                {/* Só mostra o campo de resposta e sugestões se showReplyBox for true */}
                {!showReplyBox && (
                  <button
                    className="bg-blue-700 text-white px-3 py-1.5 rounded font-semibold text-sm hover:bg-blue-800 transition mt-2"
                    onClick={() => setShowReplyBox(true)}
                  >
                    Responder
                  </button>
                )}
                {showReplyBox && (
                  <div>
                    {/* Sugestões da IA */}
                    {showIASuggestions && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {IA_SUGESTOES.map((s, idx) => (
                          <button
                            key={idx}
                            type="button"
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs hover:bg-blue-200 transition"
                            onClick={() => handleIASuggestion(s)}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    )}
                    <textarea
                      className="w-full border rounded-lg px-3 py-2 mb-2 text-sm bg-gray-50 focus:bg-white focus:outline-blue-400"
                      rows={3}
                      placeholder="Digite sua resposta..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button
                        className="bg-blue-700 text-white px-3 py-1.5 rounded font-semibold text-sm hover:bg-blue-800 transition"
                        onClick={handleReply}
                      >
                        Responder
                      </button>
                      <button
                        className="bg-gray-100 text-gray-800 px-3 py-1.5 rounded font-semibold text-sm hover:bg-gray-200 transition"
                        onClick={() => { setShowReplyBox(false); setReplyText(''); }}
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        className="ml-auto flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition text-xs font-semibold"
                        title="Sugestões da IA"
                        onClick={() => setShowIASuggestions(v => !v)}
                      >
                        {/* Ícone removido, só texto */}
                        Sugestões da IA
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Rodapé */}
            <div className="flex justify-between items-center border-t px-6 py-3 bg-gray-50 rounded-b-2xl">
              <button
                className="bg-red-100 text-red-700 px-4 py-2 rounded font-semibold text-base hover:bg-red-200 transition"
                onClick={handleDelete}
              >
                Excluir comentário
              </button>
              <button
                className="bg-gray-400 text-white px-6 py-2 rounded font-semibold text-base hover:bg-gray-500 transition"
                onClick={handleCloseModal}
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ComentariosTab;
