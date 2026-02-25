import React from 'react';
import './BlackbodySpectrum.css';
import blackbodyUrl from './blackbody-spectrum_en.html?url';

const BlackbodySpectrum = () => {
  return (
    <div className="bb-root">
      <div className="bb-iframe-wrapper">
        <iframe
          src={blackbodyUrl}
          title="Blackbody Spectrum Simulation"
          className="bb-iframe"
        />
      </div>
    </div>
  );
};

export default BlackbodySpectrum;