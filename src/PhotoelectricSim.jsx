import React from 'react';
import './PhotoelectricSim.css';

const PhotoelectricSim = () => {
  return (
    <div className="photoelectric-container">
      <div className="sim-header">
        <h1>Simulasi Efek Fotolistrik (Photoelectric Effect)</h1>
        <p>Jelajahi fenomena ejeksi elektron dari logam ketika terkena cahaya dengan simulasi interaktif PhET</p>
      </div>

      <div className="sim-wrapper">
        <iframe 
          src="https://phet.colorado.edu/sims/cheerpj/photoelectric/latest/photoelectric.html?simulation=photoelectric"
          width="100%"
          height="600"
          allowFullScreen
          title="Photoelectric Effect Simulation"
        />
      </div>

      <div className="sim-info">
        <div className="info-section">
          <h3>📖 Tentang Simulasi</h3>
          <p>Simulasi ini memungkinkan Anda untuk:</p>
          <ul>
            <li>Mengubah panjang gelombang cahaya yang mengenai logam</li>
            <li>Melihat pengaruh intensitas cahaya terhadap arus fotolistrik</li>
            <li>Mengukur energi kinetik maksimal elektron yang dilepaskan</li>
            <li>Menentukan fungsi kerja (work function) dari berbagai logam</li>
            <li>Memverifikasi hubungan Einstein dan hipotesis foton</li>
          </ul>
        </div>

        <div className="info-section">
          <h3>🔬 Konsep Fisika</h3>
          <p>
            Efek fotolistrik adalah fenomena di mana elektron dilepaskan dari suatu material ketika cahaya bersinar di atasnya.
            Energi foton diberikan kepada elektron melalui persamaan: <strong>E = hf</strong>
          </p>
          <ul>
            <li><strong>h</strong> = Konstanta Planck (6.626 × 10⁻³⁴ J·s)</li>
            <li><strong>f</strong> = Frekuensi cahaya</li>
            <li><strong>E</strong> = Energi foton</li>
          </ul>
          <p style={{ marginTop: '15px' }}>
            Energi kinetik maksimal elektron: <strong>KE_max = hf - W</strong>, di mana W adalah fungsi kerja
          </p>
        </div>

        <div className="info-section">
          <h3>💡 Tips Penggunaan</h3>
          <ul>
            <li>Coba ubah panjang gelombang dan amati apakah ada arus yang terdeteksi</li>
            <li>Bandingkan hasil untuk berbagai jenis logam</li>
            <li>Identifikasi frekuensi minimum (threshold frequency) untuk setiap logam</li>
            <li>Ukur hubungan linear antara frekuensi cahaya dan energi kinetik maksimal</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PhotoelectricSim;