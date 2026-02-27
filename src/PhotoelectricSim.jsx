import React, { useMemo, useState } from 'react';
import './PhotoelectricSim.css';

// Konstanta fisika (disederhanakan untuk perhitungan numerik)
const H = 6.626e-34; // J·s
const C = 3e8; // m/s
const E_CHARGE = 1.602e-19; // C

const METALS = [
  { id: 'na', name: 'Natrium (Na)', workFunctionEV: 2.3 },
  { id: 'ca', name: 'Kalsium (Ca)', workFunctionEV: 2.9 },
  { id: 'zn', name: 'Seng (Zn)', workFunctionEV: 4.3 },
  { id: 'cu', name: 'Tembaga (Cu)', workFunctionEV: 4.7 },
  { id: 'pt', name: 'Platina (Pt)', workFunctionEV: 6.4 },
];

const MIN_LAMBDA = 200;
const MAX_LAMBDA = 800;

function usePhotoelectricModel(wavelengthNm, intensity, voltage, metalId) {
  const metal = METALS.find((m) => m.id === metalId) ?? METALS[0];

  return useMemo(() => {
    const lambdaM = wavelengthNm * 1e-9;
    const frequency = C / lambdaM;
    const photonEnergyJ = H * frequency;
    const photonEnergyEV = photonEnergyJ / E_CHARGE;

    const phi = metal.workFunctionEV;
    const keMaxEV = Math.max(0, photonEnergyEV - phi);
    const stoppingVoltage = keMaxEV; // dalam volt (1 eV = 1 e * 1 V)

    const emissionPossible = photonEnergyEV >= phi && intensity > 0;
    let relativeCurrent = 0;

    if (emissionPossible && keMaxEV > 0) {
      const biasFactor =
        stoppingVoltage > 0
          ? Math.max(0, 1 - Math.max(0, -voltage) / stoppingVoltage)
          : 0;
      relativeCurrent = Math.max(0, intensity * biasFactor);
    }

    const currentActive = relativeCurrent > 0.01;

    // Panjang gelombang ambang (threshold) dari fungsi kerja
    const thresholdLambdaNm =
      (H * C) / (phi * E_CHARGE) * 1e9;

    return {
      metal,
      frequency,
      photonEnergyEV,
      keMaxEV,
      stoppingVoltage,
      emissionPossible,
      currentActive,
      relativeCurrent: Math.min(relativeCurrent, 1),
      thresholdLambdaNm,
    };
  }, [wavelengthNm, intensity, voltage, metal]);
}

const PhotoelectricSim = () => {
  const [wavelength, setWavelength] = useState(450);
  const [intensity, setIntensity] = useState(0.6);
  const [voltage, setVoltage] = useState(0);
  const [metalId, setMetalId] = useState('na');

  const model = usePhotoelectricModel(
    wavelength,
    intensity,
    voltage,
    metalId
  );

  const {
    metal,
    photonEnergyEV,
    keMaxEV,
    stoppingVoltage,
    emissionPossible,
    currentActive,
    relativeCurrent,
    thresholdLambdaNm,
  } = model;

  const photonEnergyDisplay = photonEnergyEV.toFixed(2);
  const keMaxDisplay = keMaxEV.toFixed(2);
  const stoppingVoltageDisplay = stoppingVoltage.toFixed(2);
  const thresholdLambdaDisplay = thresholdLambdaNm.toFixed(0);

  return (
    <div className="photoelectric-root">
      <div className="pe-layout">
        <section className="pe-panel pe-left">
          <div className="pe-pill">Simulasi Efek Fotolistrik</div>
          <h1 className="pe-title">Interaksi Foton dengan Logam</h1>
          <p className="pe-subtitle">
            Atur panjang gelombang, intensitas cahaya, jenis logam, dan tegangan antar
            elektroda. Amati kapan elektron terlepas dan bagaimana arus foto bergantung
            pada frekuensi dan intensitas cahaya.
          </p>

          <div className="pe-controls">
            <div className="pe-control-block">
              <div className="pe-control-header">
                <div>
                  <span className="pe-control-label">Panjang gelombang cahaya</span>
                  <span className="pe-control-unit">dalam nanometer (nm)</span>
                </div>
                <div className="pe-control-value">
                  {wavelength.toFixed(0)} nm
                </div>
              </div>
              <input
                type="range"
                min={MIN_LAMBDA}
                max={MAX_LAMBDA}
                step={5}
                value={wavelength}
                onChange={(e) => setWavelength(Number(e.target.value))}
                className="pe-slider"
              />
              <div className="pe-control-scale">
                <span>{MIN_LAMBDA}</span>
                <span>Spektrum tampak</span>
                <span>{MAX_LAMBDA}</span>
              </div>
            </div>

            <div className="pe-control-row">
              <div className="pe-control-block small">
                <div className="pe-control-header">
                  <div>
                    <span className="pe-control-label">Intensitas cahaya</span>
                    <span className="pe-control-unit">proporsional jumlah foton</span>
                  </div>
                  <div className="pe-control-value">
                    {(intensity * 100).toFixed(0)}%
                  </div>
                </div>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={intensity}
                  onChange={(e) => setIntensity(Number(e.target.value))}
                  className="pe-slider"
                />
              </div>

              <div className="pe-control-block small">
                <div className="pe-control-header">
                  <div>
                    <span className="pe-control-label">Tegangan antar pelat</span>
                    <span className="pe-control-unit">-5 V (balik) sampai +5 V</span>
                  </div>
                  <div className="pe-control-value">
                    {voltage.toFixed(2)} V
                  </div>
                </div>
                <input
                  type="range"
                  min={-5}
                  max={5}
                  step={0.1}
                  value={voltage}
                  onChange={(e) => setVoltage(Number(e.target.value))}
                  className="pe-slider"
                />
              </div>
            </div>

            <div className="pe-metal-row">
              <div className="pe-metal-select">
                <label className="pe-control-label" htmlFor="metal-select">
                  Jenis logam katoda
                </label>
                <select
                  id="metal-select"
                  className="pe-select"
                  value={metalId}
                  onChange={(e) => setMetalId(e.target.value)}
                >
                  {METALS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="pe-metal-badge">
                Fungsi kerja: {metal.workFunctionEV.toFixed(2)} eV
              </div>
            </div>
          </div>

          <div className="pe-info-grid">
            <div className="pe-info-card">
              <div className="pe-info-label">Energi foton</div>
              <div className="pe-info-value">
                {photonEnergyDisplay}{' '}
                <span className="pe-info-unit">eV</span>
              </div>
              <p className="pe-info-desc">
                Dihitung dari E = hf dengan f = c/λ. Jika E &lt; fungsi kerja logam,
                tidak ada elektron yang terlepas.
              </p>
            </div>
            <div className="pe-info-card">
              <div className="pe-info-label">Energi kinetik maksimal</div>
              <div className="pe-info-value">
                {keMaxDisplay}{' '}
                <span className="pe-info-unit">eV</span>
              </div>
              <p className="pe-info-desc">
                Sesuai persamaan Einstein: KEₘₐₓ = hf − W. Bernilai nol jika foton
                tidak cukup energik.
              </p>
            </div>
            <div className="pe-info-card">
              <div className="pe-info-label">Tegangan henti teoritis</div>
              <div className="pe-info-value">
                {stoppingVoltageDisplay}{' '}
                <span className="pe-info-unit">V</span>
              </div>
              <p className="pe-info-desc">
                Tegangan minimum (berlawanan arah) yang diperlukan untuk menghentikan
                elektron paling energik mencapai anoda.
              </p>
            </div>
            <div className="pe-info-card">
              <div className="pe-info-label">Panjang gelombang ambang</div>
              <div className="pe-info-value">
                {thresholdLambdaDisplay}{' '}
                <span className="pe-info-unit">nm</span>
              </div>
              <p className="pe-info-desc">
                Untuk λ lebih besar dari nilai ini, foton tidak lagi mampu melepaskan
                elektron dari logam tersebut.
              </p>
            </div>
          </div>
        </section>

        <section className="pe-panel pe-right">
          <div className="pe-apparatus-card">
            <header className="pe-apparatus-header">
              <div>
                <div className="pe-apparatus-title">Aparatus Fotoelektrik</div>
                <div className="pe-apparatus-subtitle">
                  Ilustrasi kualitatif katoda–anoda dan arus foto.
                </div>
              </div>
              <div
                className={
                  currentActive
                    ? 'pe-current-indicator active'
                    : 'pe-current-indicator'
                }
              >
                <span className="pe-current-dot" />
                <span className="pe-current-label">
                  {currentActive ? 'Arus terukur' : 'Tidak ada arus'}
                </span>
              </div>
            </header>

            <div className="pe-apparatus">
              <div className="pe-light-source">
                <div className="pe-light-label">Berkas foton</div>
                <div className="pe-light-beam" />
              </div>

              <div className="pe-chamber">
                <div className="pe-electrode pe-cathode">
                  <span className="pe-electrode-label">Katoda ({metalId.toUpperCase()})</span>
                </div>
                <div className="pe-gap">
                  <div className="pe-electron-stream">
                    {emissionPossible && currentActive ? (
                      <div className="pe-electron-bar" style={{ opacity: 0.9 }} />
                    ) : emissionPossible ? (
                      <div className="pe-electron-bar weak" />
                    ) : null}
                  </div>
                </div>
                <div className="pe-electrode pe-anode">
                  <span className="pe-electrode-label">Anoda</span>
                </div>
              </div>

              <div className="pe-meter">
                <div className="pe-meter-label">Kuat arus relatif</div>
                <div className="pe-meter-bar">
                  <div
                    className="pe-meter-fill"
                    style={{ width: `${relativeCurrent * 100}%` }}
                  />
                </div>
              </div>

              <div className="pe-voltage-indicator">
                Tegangan sumber: {voltage.toFixed(2)} V
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default PhotoelectricSim;