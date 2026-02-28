import React, { useMemo } from 'react';
import './Welcome.css';

// Konstanta Planck untuk kurva spektrum (preview 3000 K)
const C1 = 3.741e-16;
const C2 = 1.4388e-2;
const PREVIEW_T = 3000;
const MIN_L = 200;
const MAX_L = 3000;

function getBlackbodyCurvePath() {
  const points = [];
  const steps = 100;
  for (let i = 0; i <= steps; i++) {
    const lambdaNm = MIN_L + ((MAX_L - MIN_L) * i) / steps;
    const lambdaM = lambdaNm * 1e-9;
    const exp = C2 / (lambdaM * PREVIEW_T);
    const intensity = C1 / (Math.pow(lambdaM, 5) * (Math.exp(exp) - 1 || 1e-9));
    points.push({ lambdaNm, value: isFinite(intensity) ? intensity : 0 });
  }
  const max = points.reduce((a, p) => (p.value > a ? p.value : a), 0);
  const normalized = points.map((p) => ({
    x: ((p.lambdaNm - MIN_L) / (MAX_L - MIN_L)) * 100,
    y: 55 - (max ? p.value / max : 0) * 40,
  }));
  let d = `M ${normalized[0].x} 55 L ${normalized[0].x} ${normalized[0].y}`;
  for (let i = 1; i < normalized.length; i++) {
    d += ` L ${normalized[i].x} ${normalized[i].y}`;
  }
  d += ` L ${normalized[normalized.length - 1].x} 55 Z`;
  return d;
}

export default function Welcome({ onSelectSimulation }) {
  const curvePath = useMemo(() => getBlackbodyCurvePath(), []);

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
                <svg
                  className="hero-chart-svg"
                  viewBox="0 0 100 60"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="hero-bb-fill" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.2" />
                      <stop offset="35%" stopColor="#22c55e" stopOpacity="0.4" />
                      <stop offset="65%" stopColor="#facc15" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0.35" />
                    </linearGradient>
                    <linearGradient id="hero-bb-line" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#0ea5e9" />
                      <stop offset="35%" stopColor="#22c55e" />
                      <stop offset="65%" stopColor="#facc15" />
                      <stop offset="100%" stopColor="#f97316" />
                    </linearGradient>
                  </defs>
                  <path d={curvePath} fill="url(#hero-bb-fill)" stroke="none" />
                  <path d={curvePath} fill="none" stroke="url(#hero-bb-line)" strokeWidth="0.8" />
                </svg>
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
