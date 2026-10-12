import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { caseApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertBanner from '../components/AlertBanner';

const CaseDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [caseData, setCaseData] = useState(null);
  const [activeTab, setActiveTab] = useState('clues');
  const [answerInput, setAnswerInput] = useState('');
  const [submissionResult, setSubmissionResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCaseDetails();
  }, [id]);

  const fetchCaseDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await caseApi.getById(id);
      setCaseData(data);
    } catch (err) {
      setError(err.message || 'Unable to retrieve case dossier.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!answerInput.trim()) return;

    try {
      setSubmitting(true);
      setSubmissionResult(null);
      const res = await caseApi.submitAnswer(id, answerInput.trim());
      setSubmissionResult(res);

      if (res.correct) {
        setCaseData((prev) => (prev ? { ...prev, solved: true } : prev));
      }
    } catch (err) {
      setSubmissionResult({
        correct: false,
        message: err.message || 'Submission error. Please verify server connection.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Unsealing evidence archives..." />;
  }

  if (error || !caseData) {
    return (
      <div className="case-detail-page">
        <AlertBanner type="error" message={error || 'Case file not found.'} />
        <Link to="/cases" className="btn btn-secondary btn-sm">
          &larr; Return to Case Dockets
        </Link>
      </div>
    );
  }

  return (
    <div className="case-detail-page">
      <div className="case-breadcrumbs">
        <Link to="/cases">&larr; Back to Case Dockets</Link>
      </div>

      <div className="case-dossier-header">
        <div className="dossier-meta">
          <span className={`difficulty-badge ${caseData.difficulty?.toLowerCase()}`}>
            {caseData.difficulty}
          </span>
          {caseData.solved ? (
            <span className="case-status-badge solved">✅ Case Solved (+100 PTS)</span>
          ) : (
            <span className="case-status-badge open">🔴 Open Investigation</span>
          )}
        </div>
        <h1 className="dossier-title">{caseData.title}</h1>
      </div>

      <div className="incident-briefing-card">
        <h3>📋 Incident Briefing</h3>
        <p className="incident-narrative">{caseData.description}</p>
      </div>

      <div className="dossier-tabs-nav">
        <button
          className={`tab-btn ${activeTab === 'clues' ? 'active' : ''}`}
          onClick={() => setActiveTab('clues')}
        >
          🔍 Chronological Clues ({caseData.clues?.length || 0})
        </button>
        <button
          className={`tab-btn ${activeTab === 'evidence' ? 'active' : ''}`}
          onClick={() => setActiveTab('evidence')}
        >
          🔬 Evidence Locker ({caseData.evidence?.length || 0})
        </button>
      </div>

      <div className="dossier-tab-content">
        {activeTab === 'clues' && (
          <div className="clues-container">
            {caseData.clues && caseData.clues.length > 0 ? (
              <div className="clues-list">
                {caseData.clues.map((clue, idx) => (
                  <div key={clue.id || idx} className="clue-item">
                    <div className="clue-number-badge">
                      Clue #{clue.displayOrder || idx + 1}
                    </div>
                    <div className="clue-body">
                      <h4>{clue.title}</h4>
                      <p>{clue.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-tab-text">No clues logged for this incident file.</p>
            )}
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="evidence-container">
            {caseData.evidence && caseData.evidence.length > 0 ? (
              <div className="evidence-grid">
                {caseData.evidence.map((ev, idx) => (
                  <div key={ev.id || idx} className="evidence-card">
                    <div className="evidence-tag">Evidence #{idx + 1}</div>
                    <h4>{ev.title}</h4>
                    <p>{ev.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-tab-text">No forensic evidence logged in the locker.</p>
            )}
          </div>
        )}
      </div>

      {/* Deduction Submission Section */}
      <div className="deduction-console">
        <div className="deduction-console-header">
          <h3>⚖️ Bureau Deduction Terminal</h3>
          <p>Synthesize the clues and evidence to name the perpetrator or primary solution.</p>
        </div>

        {caseData.solved && (
          <div className="solved-banner">
            <span className="banner-icon">🏆</span>
            <div>
              <strong>Case Successfully Closed!</strong>
              <p>You have already earned 100 points for resolving this mystery.</p>
            </div>
          </div>
        )}

        {submissionResult && (
          <div
            className={`result-alert ${
              submissionResult.correct ? 'result-success' : 'result-failure'
            }`}
          >
            <div className="result-header">
              <span className="result-icon">
                {submissionResult.correct ? '🎯' : '❌'}
              </span>
              <h4>{submissionResult.correct ? 'Deduction Confirmed!' : 'Deduction Refuted'}</h4>
            </div>
            <p className="result-message">{submissionResult.message}</p>
            {submissionResult.scoreAwarded > 0 && (
              <div className="points-celebration">
                +{submissionResult.scoreAwarded} Investigation Points Added!
              </div>
            )}
          </div>
        )}

        {isAuthenticated ? (
          <form onSubmit={handleAnswerSubmit} className="deduction-form">
            <div className="form-group">
              <label htmlFor="solutionInput">
                Perpetrator or Key Solution:
              </label>
              <input
                id="solutionInput"
                type="text"
                placeholder="Enter suspect name or deduction (e.g. Charles Thornwood)..."
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={submitting || !answerInput.trim()}
            >
              {submitting ? 'Verifying with Police Bureau...' : 'Submit Final Deduction 🔎'}
            </button>
          </form>
        ) : (
          <div className="auth-required-box">
            <p>You must authenticate your investigator identity to submit deductions and record points.</p>
            <Link to="/login" className="btn btn-primary btn-sm">
              Sign In to Submit Solution
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseDetailPage;
