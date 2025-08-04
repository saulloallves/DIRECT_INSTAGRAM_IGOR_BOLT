import React, { useState } from 'react';
import UnitSelectorPage from './UnitSelectorPage';
import ComentariosTab from './ComentariosTab';
import { useSupabaseData } from '../hooks/useSupabaseData';

const Dashboard: React.FC = () => {
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);
  const { loading } = useSupabaseData();

  return (
    <div className="relative min-h-screen bg-[#f6f7fb]">
      {!selectedUnitId ? (
        <UnitSelectorPage onSelectUnit={setSelectedUnitId} />
      ) : (
        <div className="relative">
          {/* Overlay de carregamento */}
          {loading && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70">
              <div className="flex flex-col items-center">
                <svg className="animate-spin h-10 w-10 text-blue-500 mb-2" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
                <span className="text-blue-600 font-medium text-lg">Carregando...</span>
              </div>
            </div>
          )}
          <ComentariosTab selectedUnitId={selectedUnitId} />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
