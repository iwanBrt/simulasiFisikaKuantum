import React from 'react';
import './Welcome.css';

export default function Welcome({ onSelectSimulation }) {
  const simulations = [
    {
      id: 1,
      title: 'Blackbody Spectrum',
      description: 'Pelajari spektrum radiasi benda hitam dan bagaimana temperatur mempengaruhi distribusi panjang gelombang.',
      icon: '🌡️',
      image: '⚫',
      page: 'blackbody'
    },
    {
      id: 2,
      title: 'Efek Fotolistrik',
      description: 'Jelajahi fenomena ejeksi elektron dari logam saat terkena cahaya dan hubungannya dengan frekuensi.',
      icon: '⚡',
      image: '💡',
      page: 'photoelectric'
    },
    {
      id: 3,
      title: 'Hamburan Compton',
      description: 'Pahami interaksi foton dengan elektron dan perubahan panjang gelombang dalam mekanika kuantum.',
      icon: '📊',
      image: '🔬',
      page: 'compton'
    },
  ];

  return (
    <div className="welcome-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Simulasi Sains Kuantum</h1>
          <p className="hero-subtitle">Jelajahi Fenomena Fisika Kuantum</p>
          <p className="hero-description">
            Pelajari konsep-konsep penting melalui simulasi interaktif dan visualisasi yang mudah dipahami
          </p>
          <a href="#simulations" className="cta-button">
            Mulai Sekarang
          </a>
        </div>
        <div className="hero-background">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
        </div>
      </section>

      {/* Simulations Section */}
      <section id="simulations" className="simulations-section">
        <h2 className="section-title">Pilih Simulasi</h2>
        <p className="section-subtitle">Klik untuk memulai pembelajaran</p>
        
        <div className="simulations-grid">
          {simulations.map((sim) => (
            <div key={sim.id} className="simulation-card" style={{ borderTopColor: sim.id === 1 ? '#FF6B6B' : sim.id === 2 ? '#4ECDC4' : '#95E1D3' }}>
              <div className="card-icon-large">{sim.image}</div>
              <div className="card-icon">{sim.icon}</div>
              
              <h3 className="card-title">{sim.title}</h3>
              <p className="card-description">{sim.description}</p>
              
              <button 
                className="card-button"
                style={{ 
                  backgroundColor: sim.id === 1 ? '#FF6B6B' : sim.id === 2 ? '#4ECDC4' : '#95E1D3'
                }}
                onClick={() => onSelectSimulation(sim.page)}
              >
                Buka Simulasi
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Mengapa Simulasi Sains?</h2>
        
        <div className="features-grid">
          <div className="feature-item">
            <div className="feature-icon">🎯</div>
            <h4>Pembelajaran Interaktif</h4>
            <p>Pahami konsep dengan cara yang menyenangkan melalui simulasi langsung</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">🔍</div>
            <h4>Visualisasi Jelas</h4>
            <p>Lihat fenomena fisika kompleks menjadi animasi mudah dipahami</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">⚙️</div>
            <h4>Kontrol Penuh</h4>
            <p>Ubah parameter dan lihat hasilnya secara real-time</p>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">📚</div>
            <h4>Teori & Praktek</h4>
            <p>Kombinasi penjelasan teori dengan aplikasi praktis</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Siap Memulai?</h2>
        <p>Mulai petualangan Anda ke dunia fisika kuantum</p>
        <a href="#simulations" className="cta-button-large">
          Pilih Simulasi
        </a>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Simulasi Sains Kuantum. Dibuat untuk pendidikan fisika.</p>
      </footer>
    </div>
  );
}
