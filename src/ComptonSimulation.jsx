import React, { useRef, useState, useEffect } from 'react';
import './ComptonSimulation.css';

// Konstanta fisika
const HC = 1240; // eV·nm (h*c)
const MC2 = 511e3; // eV (massa elektron)
const COMPTON_SHIFT = 0.00243; // nm (h/(m_e*c))

const ComptonSimulation = () => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Parameter input
  const [thetaDeg, setThetaDeg] = useState(45); // sudut hambur (derajat)
  const [E0keV, setE0keV] = useState(100); // energi foton awal (keV)

  // Status animasi
  const [animating, setAnimating] = useState(false);
  const [info, setInfo] = useState({
    lambda0: 0,
    lambda1: 0,
    E1: 0,
    Ee: 0,
    phiDeg: 0,
  });

  // Referensi posisi dan kecepatan partikel (untuk animasi)
  const photonPos = useRef({ x: 100, y: 200 });
  const electronPos = useRef({ x: 300, y: 200 });
  const photonVel = useRef({ x: 0, y: 0 });
  const electronVel = useRef({ x: 0, y: 0 });
  const collided = useRef(false);

  // Kecepatan gerak partikel (piksel/frame)
  const SPEED = 3;

  // Fungsi untuk menghitung ulang besaran fisika berdasarkan theta dan E0
  const computePhysics = (theta, E0) => {
    const thetaRad = (theta * Math.PI) / 180;
    const lambda0 = HC / (E0 * 1000); // nm
    const deltaLambda = COMPTON_SHIFT * (1 - Math.cos(thetaRad));
    const lambda1 = lambda0 + deltaLambda;
    const E1 = HC / lambda1 / 1000; // keV
    const Ee = E0 - E1; // keV

    // Sudut elektron phi (rad)
    const ratio = lambda1 / lambda0;
    const cosTheta = Math.cos(thetaRad);
    const sinTheta = Math.sin(thetaRad);
    const phi = Math.atan2(sinTheta, ratio - cosTheta);
    const phiDeg = (phi * 180) / Math.PI;

    return { lambda0, lambda1, E1, Ee, phiDeg, phi };
  };

  // Update info saat parameter berubah
  useEffect(() => {
    const { lambda0, lambda1, E1, Ee, phiDeg } = computePhysics(thetaDeg, E0keV);
    setInfo({ lambda0, lambda1, E1, Ee, phiDeg });
  }, [thetaDeg, E0keV]);

  // Fungsi menggambar canvas
  const draw = (ctx) => {
    ctx.clearRect(0, 0, 600, 400);

    // Latar belakang grid lembut agar mirip tampilan lembar kerja pada contoh
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(0, 0, 600, 400);

    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    // Garis vertikal
    for (let x = 0; x <= 600; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 400);
      ctx.stroke();
    }

    // Garis horizontal
    for (let y = 0; y <= 400; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(600, y);
      ctx.stroke();
    }

    // Gambar elektron
    ctx.beginPath();
    ctx.arc(electronPos.current.x, electronPos.current.y, 12, 0, 2 * Math.PI);
    ctx.fillStyle = '#3b82f6';
    ctx.fill();
    ctx.strokeStyle = '#1e3a8a';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('e⁻', electronPos.current.x - 8, electronPos.current.y + 4);

    // Gambar foton
    ctx.beginPath();
    ctx.arc(photonPos.current.x, photonPos.current.y, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
    ctx.strokeStyle = '#b45309';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText('γ', photonPos.current.x - 5, photonPos.current.y + 4);

    // Garis lintasan (opsional)
    ctx.beginPath();
    ctx.strokeStyle = '#aaa';
    ctx.setLineDash([5, 3]);
    ctx.moveTo(100, 200);
    ctx.lineTo(300, 200);
    ctx.stroke();
    ctx.setLineDash([]);
  };

  // Reset ke posisi awal
  const resetSimulation = () => {
    setAnimating(false);
    photonPos.current = { x: 100, y: 200 };
    electronPos.current = { x: 300, y: 200 };
    photonVel.current = { x: 0, y: 0 };
    electronVel.current = { x: 0, y: 0 };
    collided.current = false;
    // Gambar ulang canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      draw(ctx);
    }
  };

  // Mulai animasi
  const startAnimation = () => {
    resetSimulation(); // set posisi awal
    photonVel.current = { x: SPEED, y: 0 }; // foton bergerak ke kanan
    setAnimating(true);
  };

  // Loop animasi
  useEffect(() => {
    if (!animating) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const animate = () => {
      // Update posisi
      photonPos.current.x += photonVel.current.x;
      photonPos.current.y += photonVel.current.y;
      electronPos.current.x += electronVel.current.x;
      electronPos.current.y += electronVel.current.y;

      // Deteksi tumbukan (sebelum collided)
      if (!collided.current) {
        // Tumbuk jika foton mencapai elektron (dengan toleransi)
        if (photonPos.current.x >= electronPos.current.x - 10) {
          collided.current = true;

          // Hitung ulang fisika berdasarkan nilai slider saat tumbukan
          const { lambda0, lambda1, E1, Ee, phi } = computePhysics(thetaDeg, E0keV);
          setInfo({ lambda0, lambda1, E1, Ee, phiDeg: (phi * 180) / Math.PI });

          // Set posisi tepat di elektron
          photonPos.current = { ...electronPos.current };

          // Arah baru foton (sudut theta)
          const thetaRad = (thetaDeg * Math.PI) / 180;
          photonVel.current = {
            x: SPEED * Math.cos(thetaRad),
            y: SPEED * Math.sin(thetaRad),
          };

          // Arah elektron (sudut phi)
          electronVel.current = {
            x: SPEED * Math.cos(phi),
            y: SPEED * Math.sin(phi),
          };
        }
      }

      // Hentikan animasi jika partikel keluar canvas (opsional)
      const outOfBounds =
        photonPos.current.x < -20 ||
        photonPos.current.x > 620 ||
        photonPos.current.y < -20 ||
        photonPos.current.y > 420 ||
        electronPos.current.x < -20 ||
        electronPos.current.x > 620 ||
        electronPos.current.y < -20 ||
        electronPos.current.y > 420;

      if (outOfBounds) {
        setAnimating(false);
        return;
      }

      // Gambar
      draw(ctx);

      // Lanjutkan animasi
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animating, thetaDeg, E0keV]); // thetaDeg dan E0keV dimasukkan agar saat tumbukan menggunakan nilai terbaru

  // Gambar statis saat komponen dimuat atau di-reset
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      draw(ctx);
    }
  }, []);

  return (
    <div className="compton-container">
      <div className="compton-window">
        <div className="compton-window-header">
          <span className="compton-window-title">Compton Simulation.yax</span>
        </div>

        {/* Bar parameter atas (hiasan supaya mirip UI contoh) */}
        <div className="compton-toolbar">
          <div className="toolbar-section">
            <div className="toolbar-label">Eupe:</div>
            <div className="toolbar-row">
              <span className="toolbar-chip">Energy Ref</span>
              <span className="toolbar-chip">Container Ref</span>
            </div>
          </div>

          <div className="toolbar-section">
            <div className="toolbar-label">Info</div>
            <div className="toolbar-row">
              <span className="toolbar-chip">
                E₀: <strong>{E0keV.toFixed(0)}</strong> keV
              </span>
              <span className="toolbar-chip">
                Eᵢ: <strong>{info.E1.toFixed(1)}</strong> keV
              </span>
            </div>
          </div>

          <div className="toolbar-section">
            <div className="toolbar-label">Foton hambur</div>
            <div className="toolbar-row">
              <span className="toolbar-chip">
                λ₀ = {info.lambda0.toFixed(3)} nm
              </span>
              <span className="toolbar-chip">
                λ&apos; = {info.lambda1.toFixed(3)} nm
              </span>
            </div>
          </div>
        </div>

        <div className="compton-content">
          {/* Canvas */}
          <div className="compton-canvas-wrapper">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="compton-canvas"
            />
          </div>

          {/* Panel kontrol dan info */}
          <div className="compton-sidebar">
            <h2 className="compton-title">Simulasi Hamburan Compton</h2>

            <div className="control-group">
              <label className="control-label">
                Sudut hambur θ (°): <span className="control-value">{thetaDeg}</span>
              </label>
              <input
                type="range"
                min="0"
                max="180"
                value={thetaDeg}
                onChange={(e) => setThetaDeg(Number(e.target.value))}
                className="range-input"
                disabled={animating}
              />
            </div>

            <div className="control-group">
              <label className="control-label">
                Energi foton awal (keV):{' '}
                <span className="control-value">{E0keV}</span>
              </label>
              <input
                type="range"
                min="10"
                max="500"
                value={E0keV}
                onChange={(e) => setE0keV(Number(e.target.value))}
                className="range-input"
                disabled={animating}
              />
            </div>

            <div className="button-row">
              <button
                onClick={startAnimation}
                disabled={animating}
                className="primary-button"
              >
                Start
              </button>
              <button
                onClick={resetSimulation}
                disabled={animating}
                className="secondary-button"
              >
                Reset
              </button>
            </div>

            <div className="info-card">
              <h4 className="info-title">Hasil Perhitungan</h4>
              <p>λ₀ = {info.lambda0.toFixed(4)} nm</p>
              <p>λ&apos; = {info.lambda1.toFixed(4)} nm</p>
              <p>Eγ&apos; = {info.E1.toFixed(2)} keV</p>
              <p>Ee = {info.Ee.toFixed(2)} keV</p>
              <p>φ = {info.phiDeg.toFixed(1)}°</p>
            </div>

            <p className="description-text">
              Foton (kuning) datang dari kiri dan menumbuk elektron (biru). Setelah
              tumbukan, foton berubah arah (θ) dan panjang gelombang, sedangkan
              elektron terdorong dengan sudut φ.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComptonSimulation;