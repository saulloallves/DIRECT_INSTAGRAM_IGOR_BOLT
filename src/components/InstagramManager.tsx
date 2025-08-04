import React from 'react';
import { Instagram, RefreshCw } from 'lucide-react';
import InstagramDirectChat from './InstagramDirectChat';

interface InstagramManagerProps {
  unitId: string;
  onBack: () => void;
}

const InstagramManager: React.FC<InstagramManagerProps> = ({ unitId, onBack }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header fixo com espaçamento */}
      <div className="w-full bg-gray-50 border-b px-8 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Instagram className="w-6 h-6 text-white" />
            </div>
            Gerenciador Instagram Direct
          </h2>
          <p className="text-gray-600 mt-1 text-base">Atendimento em tempo real via Direct</p>
        </div>
        <div className="flex flex-row gap-2 mt-2 md:mt-0">
          <button
            onClick={onBack}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center gap-2 text-gray-700 font-medium"
          >
            Voltar
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 flex items-center gap-2 text-gray-700 font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            Atualizar
          </button>
        </div>
      </div>
      {/* Chat centralizado com espaçamento */}
      <div className="flex-1 flex justify-center items-start bg-gray-100 px-2 py-8">
        <div className="w-full max-w-7xl">
          <InstagramDirectChat unitId={unitId} onBack={onBack} />
        </div>
      </div>
    </div>
  );
};

export default InstagramManager;
