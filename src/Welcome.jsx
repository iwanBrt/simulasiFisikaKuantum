import React from 'react';
import './Welcome.css';

export default function Welcome({ onSelectSimulation }) {
  const simulations = [
    {
      id: 1,
      title: 'Blackbody Spectrum',
      description:
        'Pelajari spektrum radiasi benda hitam dan bagaimana temperatur mempengaruhi distribusi panjang gelombang.',
      level: 'Dasar',
      tag: 'Termal',
      page: 'blackbody',
      accent: '#FF6B6B',
    },
    {
      id: 2,
      title: 'Efek Fotolistrik',
      description:
        'Jelajahi fenomena ejeksi elektron dari logam saat terkena cahaya dan hubungannya dengan frekuensi.',
      level: 'Menengah',
      tag: 'Kuantum',
      page: 'photoelectric',
      accent: '#4ECDC4',
    },
    {
      id: 3,
      title: 'Hamburan Compton',
      description:
        'Pahami interaksi foton dengan elektron dan perubahan panjang gelombang dalam mekanika kuantum.',
      level: 'Lanjut',
      tag: 'Relativistik',
      page: 'compton',
      accent: '#95E1D3',
    },
  ];

  return (
    <div className="welcome-container">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-pill">Platform Simulasi Fisika Kuantum</span>
            <h1 className="hero-title">Simulasi Sains Kuantum Interaktif</h1>
            <p className="hero-subtitle">
              Visualisasi modern untuk memahami konsep fisika kuantum yang kompleks secara intuitif dan terstruktur.
            </p>
            <div className="hero-actions">
              <a href="#simulations" className="cta-button primary">
                Mulai Eksperimen
              </a>
              <button
                type="button"
                className="cta-button secondary"
                onClick={() => onSelectSimulation(simulations[0].page)}
              >
                Coba Blackbody Spectrum
              </button>
            </div>
            <div className="hero-metadata">
              <div className="hero-metric">
                <span className="hero-metric-value">3+</span>
                <span className="hero-metric-label">Simulasi inti</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-value">100%</span>
                <span className="hero-metric-label">Berbasis web</span>
              </div>
              <div className="hero-metric">
                <span className="hero-metric-value">Realtime</span>
                <span className="hero-metric-label">Visualisasi hasil</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-header">
                <span className="hero-card-title">Spektrum Intensitas</span>
                <span className="hero-card-badge">Live preview</span>
              </div>
              <div className="hero-chart">
                <div className="hero-chart-line hero-chart-line-1" />
                <div className="hero-chart-line hero-chart-line-2" />
                <div className="hero-chart-line hero-chart-line-3" />
              </div>
              <div className="hero-card-footer">
                <div className="hero-card-row">
                  <span>Temperatur</span>
                  <span>3000 K</span>
                </div>
                <div className="hero-card-row">
                  <span>Panjang gelombang puncak</span>
                  <span>≈ 966 nm</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simulations Section */}
      <section id="simulations" className="simulations-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Koleksi Simulasi</h2>
            <p className="section-subtitle">
              Pilih simulasi yang sesuai dengan topik pembelajaran atau tingkat kesulitan yang Anda inginkan.
            </p>
          </div>
          <div className="section-tagline">Terstruktur dari dasar hingga lanjut</div>
        </div>

        <div className="simulations-grid">
          {simulations.map((sim) => (
            <article key={sim.id} className="simulation-card">
              <header className="simulation-card-header">
                <span className="simulation-tag" style={{ backgroundColor: `${sim.accent}15`, color: sim.accent }}>
                  {sim.tag}
                </span>
                <span className="simulation-level">{sim.level}</span>
              </header>

              <h3 className="card-title">{sim.title}</h3>
              <p className="card-description">{sim.description}</p>

              <div className="card-footer">
                <button
                  className="card-button"
                  style={{ backgroundColor: sim.accent }}
                  onClick={() => onSelectSimulation(sim.page)}
                >
                  Buka Simulasi
                </button>
                <span className="card-secondary-text">Penyesuaian parameter secara realtime</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header centered">
          <h2 className="section-title">Dirancang untuk Pembelajaran Profesional</h2>
          <p className="section-subtitle">
            Antarmuka rapi, fokus pada konsep inti, sehingga cocok digunakan di kelas maupun studi mandiri.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-item">
            <h4>Pembelajaran Interaktif</h4>
            <p>Kontrol variabel utama secara langsung dan amati perubahan hasil secara instan.</p>
          </div>

          <div className="feature-item">
            <h4>Visualisasi yang Rapi</h4>
            <p>Grafik dan tampilan data disusun dengan gaya minimalis untuk memudahkan analisis.</p>
          </div>

          <div className="feature-item">
            <h4>Struktur Materi Jelas</h4>
            <p>Setiap simulasi dilengkapi konteks konsep sehingga tidak terlepas dari teori.</p>
          </div>

          <div className="feature-item">
            <h4>Siap Digunakan di Kelas</h4>
            <p>Mudah dioperasikan oleh dosen maupun mahasiswa, cukup melalui browser.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <h2>Mulai Eksplorasi Fisika Kuantum Hari Ini</h2>
        <p>Bangun intuisi fisika melalui eksperimen digital yang tertata dan profesional.</p>
        <a href="#simulations" className="cta-button-large">
          Lihat Semua Simulasi
        </a>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2024 Simulasi Sains Kuantum · Dibuat untuk keperluan pendidikan.</p>
      </footer>
    </div>
  );
}
