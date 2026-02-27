import React, { useMemo, useState } from 'react';
import './BlackbodySpectrum.css';

const MIN_T = 1000;
const MAX_T = 8000;

const MIN_LAMBDA_NM = 200;
const MAX_LAMBDA_NM = 3000;

// Konstanta Planck (disederhanakan untuk visualisasi relatif)
const C1 = 3.741e-16; // 2 * h * c^2  (W·m^2)
const C2 = 1.4388e-2; // h * c / kB  (m·K)

function computeSpectrum(temperature) {
  const points = [];
  const steps = 140;
  const range = MAX_LAMBDA_NM - MIN_LAMBDA_NM;

  for (let i = 0; i <= steps; i++) {
    const lambdaNm = MIN_LAMBDA_NM + (range * i) / steps;
    const lambdaM = lambdaNm * 1e-9;

    // Rumus Planck (intensitas relatif)
    const exponent = C2 / (lambdaM * temperature);
    const intensity =
      C1 / (Math.pow(lambdaM, 5) * (Math.exp(exponent) - 1 || 1e-9));

    points.push({ lambdaNm, intensity: isFinite(intensity) ? intensity : 0 });
  }

  const max = points.reduce(
    (acc, p) => (p.intensity > acc ? p.intensity : acc),
    0
  );

  return points.map((p) => ({
    lambdaNm: p.lambdaNm,
    value: max > 0 ? p.intensity / max : 0,
  }));
}

function useBlackbodyData(temperature) {
  return useMemo(() => computeSpectrum(temperature), [temperature]);
}

function getPeakWavelengthNm(temperature) {
  const b = 2.897771955e-3; // m·K
  const lambdaPeakM = b / temperature;
  return lambdaPeakM * 1e9;
}

function describeRegion(lambdaPeakNm) {
  if (lambdaPeakNm < 380) return 'Ultraviolet (UV)';
  if (lambdaPeakNm <= 780) return 'Spektrum tampak (visible light)';
  return 'Inframerah (IR)';
}

const BlackbodySpectrum = () => {
  const [temperature, setTemperature] = useState(4000);

  const spectrum = useBlackbodyData(temperature);
  const lambdaPeak = getPeakWavelengthNm(temperature);
  const lambdaPeakDisplay = lambdaPeak.toFixed(0);
  const regionLabel = describeRegion(lambdaPeak);

  const chartPath = useMemo(() => {
    if (!spectrum.length) return '';

    const xSpan = MAX_LAMBDA_NM - MIN_LAMBDA_NM;
    const baseY = 55;
    const ampY = 40;

    const toCoords = (p) => {
      const x =
        ((p.lambdaNm - MIN_LAMBDA_NM) / xSpan) * 100;
      const y = baseY - p.value * ampY;
      return { x, y };
    };

    const first = toCoords(spectrum[0]);
    let d = `M ${first.x} ${baseY} L ${first.x} ${first.y}`;

    for (let i = 1; i < spectrum.length; i++) {
      const { x, y } = toCoords(spectrum[i]);
      d += ` L ${x} ${y}`;
    }

    const last = toCoords(spectrum[spectrum.length - 1]);
    d += ` L ${last.x} ${baseY} Z`;

    return d;
  }, [spectrum]);

  const handlePreset = (value) => {
    setTemperature(value);
  };

  return (
    <div className="bb-root">
      <div className="bb-layout">
        <section className="bb-panel bb-panel-left">
          <div className="bb-pill">Simulasi Benda Hitam</div>
          <h1 className="bb-title">Spektrum Radiasi Benda Hitam</h1>
          <p className="bb-subtitle">
            Visualisasi bentuk spektrum radiasi termal untuk berbagai temperatur.
            Geser suhu dan amati bagaimana puncak intensitas berpindah dan
            melebar, sebagaimana dijelaskan oleh hukum Planck dan hukum pergeseran Wien.
          </p>

          <div className="bb-controls">
            <div className="bb-control-header">
              <div>
                <span className="bb-control-label">Temperatur permukaan</span>
                <span className="bb-control-unit">dalam Kelvin (K)</span>
              </div>
              <div className="bb-control-value">{temperature.toFixed(0)} K</div>
            </div>

            <input
              type="range"
              min={MIN_T}
              max={MAX_T}
              step={100}
              value={temperature}
              onChange={(e) => setTemperature(Number(e.target.value))}
              className="bb-slider"
            />

            <div className="bb-presets">
              <button
                type="button"
                className="bb-preset-button"
                onClick={() => handlePreset(3000)}
              >
                3000 K · Lampu pijar hangat
              </button>
              <button
                type="button"
                className="bb-preset-button"
                onClick={() => handlePreset(5800)}
              >
                5800 K · Matahari
              </button>
              <button
                type="button"
                className="bb-preset-button"
                onClick={() => handlePreset(7500)}
              >
                7500 K · Bintang biru
              </button>
            </div>
          </div>

          <div className="bb-info-grid">
            <div className="bb-info-card">
              <div className="bb-info-label">Panjang gelombang puncak</div>
              <div className="bb-info-value">
                {lambdaPeakDisplay} <span className="bb-info-unit">nm</span>
              </div>
              <p className="bb-info-desc">
                Dihitung dengan hukum pergeseran Wien. Semakin tinggi suhu,
                puncak bergeser ke arah panjang gelombang yang lebih pendek.
              </p>
            </div>
            <div className="bb-info-card">
              <div className="bb-info-label">Rentang spektrum dominan</div>
              <div className="bb-info-value bb-info-value-small">
                {regionLabel}
              </div>
              <p className="bb-info-desc">
                Menunjukkan di wilayah mana energi radiasi paling banyak
                dipancarkan untuk temperatur saat ini.
              </p>
            </div>
          </div>
        </section>

        <section className="bb-panel bb-panel-right">
          <div className="bb-chart-card">
            <header className="bb-chart-header">
              <div>
                <div className="bb-chart-title">Spektrum Intensitas Relatif</div>
                <div className="bb-chart-subtitle">
                  Kurva Planck untuk benda hitam ideal pada suhu terpilih.
                </div>
              </div>
              <div className="bb-legend">
                <span className="bb-legend-color" />
                <span className="bb-legend-label">Intensitas relatif</span>
              </div>
            </header>

            <div className="bb-chart-wrapper">
              <svg
                className="bb-chart-svg"
                viewBox="0 0 100 60"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id="bb-spectrum-fill"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.1" />
                    <stop offset="35%" stopColor="#22c55e" stopOpacity="0.35" />
                    <stop offset="65%" stopColor="#facc15" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.4" />
                  </linearGradient>
                  <linearGradient
                    id="bb-spectrum-line"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="35%" stopColor="#22c55e" />
                    <stop offset="65%" stopColor="#facc15" />
                    <stop offset="100%" stopColor="#f97316" />
                  </linearGradient>
                </defs>

                {/* Grid garis vertikal sederhana */}
                {Array.from({ length: 5 }).map((_, i) => {
                  const x = (i * 25);
                  return (
                    <line
                      key={i}
                      x1={x}
                      y1={10}
                      x2={x}
                      y2={55}
                      stroke="rgba(148, 163, 184, 0.25)"
                      strokeWidth="0.2"
                    />
                  );
                })}

                {/* Sumbu */}
                <line
                  x1="0"
                  y1="55"
                  x2="100"
                  y2="55"
                  stroke="rgba(148, 163, 184, 0.7)"
                  strokeWidth="0.5"
                />

                {/* Kurva spektrum */}
                {chartPath && (
                  <>
                    <path
                      d={chartPath}
                      fill="url(#bb-spectrum-fill)"
                      stroke="none"
                    />
                    <path
                      d={chartPath}
                      fill="none"
                      stroke="url(#bb-spectrum-line)"
                      strokeWidth="0.9"
                    />
                  </>
                )}
              </svg>

              <div className="bb-axis-label bb-axis-x">
                Panjang gelombang (nm)
              </div>
              <div className="bb-axis-label bb-axis-y">
                Intensitas relatif
              </div>
              <div className="bb-axis-ticks">
                <span>{MIN_LAMBDA_NM}</span>
                <span>700</span>
                <span>{MAX_LAMBDA_NM}</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlackbodySpectrum;