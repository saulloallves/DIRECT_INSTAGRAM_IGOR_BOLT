import React, { useState } from 'react';
import UnitSelectorPage from './components/UnitSelectorPage';
import InstagramManager from './components/InstagramManager';

function App() {
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-100">
      {!selectedUnitId ? (
        <UnitSelectorPage onSelectUnit={setSelectedUnitId} />
      ) : (
        <InstagramManager unitId={selectedUnitId} onBack={() => setSelectedUnitId(null)} />
      )}
    </div>
  );
}

export default App;
