import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="landing-page">
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">REST API &bull; Spring Boot 3 &bull; React &bull; PostgreSQL</div>
          <h1 className="hero-title">
            Step Into the Fog.<br />
            <span className="text-gradient">Solve the Unsolved.</span>
          </h1>
          <p className="hero-subtitle">
            MysteryBox is an interactive investigation platform where critical thinking and deductive logic meet full-stack engineering. Inspect evidence, analyze crime-scene clues, and submit your deductions to crack the case.
          </p>
          <div className="hero-actions">
            <Link to="/cases" className="btn btn-primary btn-lg">
              Explore Active Cases 🔎
            </Link>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-secondary btn-lg">
                View My Dossier
              </Link>
            ) : (
              <Link to="/register" className="btn btn-secondary btn-lg">
                Enlist as Detective
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="features-section">
        <h2 className="section-title">Forensic Investigation Pillars</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">📜</div>
            <h3>Detailed Incident Briefs</h3>
            <p>Immerse yourself in complex mysteries ranging from locked-room thefts to poisoned laboratory murders and cybersecurity heists.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Sequential Clue Logs</h3>
            <p>Cross-reference forensic findings, broken alibis, and chronological witness statements to piece together the sequence of events.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔬</div>
            <h3>Physical & Digital Evidence</h3>
            <p>Inspect forensic casts, decrypted notes, chemical residues, and biometric bypass logs stored securely in the evidence locker.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Server-Side Validation</h3>
            <p>Submit your deductions to our Spring Boot backend. Solutions are never exposed in public payloads and are verified strictly server-side.</p>
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <h2 className="section-title">How the Investigation Works</h2>
        <div className="steps-container">
          <div className="step-card">
            <div className="step-number">1</div>
            <h4>Select a Mystery</h4>
            <p>Browse cases categorized by difficulty—from introductory cases to mastermind security breaches.</p>
          </div>
          <div className="step-card">
            <div className="step-number">2</div>
            <h4>Analyze Evidence</h4>
            <p>Study chronological clues and forensic items to uncover inconsistencies in suspect testimonies.</p>
          </div>
          <div className="step-card">
            <div className="step-number">3</div>
            <h4>Submit Deduction</h4>
            <p>Enter the culprit's identity. Earn detective points and rank up to Chief Consulting Detective!</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
