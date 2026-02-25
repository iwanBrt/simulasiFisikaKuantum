import { useState } from 'react';
import Welcome from './Welcome';
import PhotoelectricSim from './PhotoelectricSim';
import ComptonSimulation from './ComptonSimulation';
import BlackbodySpectrum from './BlackbodySpectrum';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('welcome');

  return (
    <div>
      {currentPage === 'welcome' && (
        <Welcome onSelectSimulation={setCurrentPage} />
      )}

      {currentPage === 'blackbody' && (
        <div className="sim-page">
          <button
            onClick={() => setCurrentPage('welcome')}
            className="back-button"
          >
            ← Kembali ke Home
          </button>
          <BlackbodySpectrum />
        </div>
      )}

      {currentPage === 'photoelectric' && (
        <div className="sim-page">
          <button
            onClick={() => setCurrentPage('welcome')}
            className="back-button"
          >
            ← Kembali ke Home
          </button>
          <PhotoelectricSim />
        </div>
      )}

      {currentPage === 'compton' && (
        <div className="sim-page">
          <button
            onClick={() => setCurrentPage('welcome')}
            className="back-button"
          >
            ← Kembali ke Home
          </button>
          <ComptonSimulation />
        </div>
      )}
    </div>
  );
}
export default App;