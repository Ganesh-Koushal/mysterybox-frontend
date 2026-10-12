import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { progressApi } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertBanner from '../components/AlertBanner';

const DashboardPage = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await progressApi.getProgress();
      setProgress(data);
    } catch (err) {
      setError(err.message || 'Failed to retrieve detective progress records.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Retrieving detective service dossier..." />;
  }

  const resolutionRate = progress?.totalAvailableCases > 0
    ? Math.round((progress.solvedCasesCount / progress.totalAvailableCases) * 100)
    : 0;

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <div className="profile-badge-card">
          <div className="avatar-circle">🔍</div>
          <div className="profile-details">
            <span className="rank-tag">{progress?.detectiveRank || 'Investigator'}</span>
            <h2>{user?.name}</h2>
            <p className="user-email">{user?.email}</p>
          </div>
        </div>

        <div className="dashboard-quick-actions">
          <Link to="/cases" className="btn btn-primary">
            Browse Crime Cases 📁
          </Link>
          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="btn btn-secondary">
              Admin Case Console ⚙️
            </Link>
          )}
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">⭐</div>
          <div className="stat-data">
            <h3>{progress?.totalScore ?? 0}</h3>
            <p>Total Investigation Points</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-data">
            <h3>{progress?.solvedCasesCount ?? 0}</h3>
            <p>Cases Solved</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-data">
            <h3>{progress?.totalAvailableCases ?? 0}</h3>
            <p>Total Available Cases</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-data">
            <h3>{resolutionRate}%</h3>
            <p>Case Resolution Rate</p>
          </div>
        </div>
      </div>

      <div className="solved-history-section">
        <div className="section-header-row">
          <h3>Resolved Case Archives</h3>
          <span className="case-count-pill">{progress?.solvedCases?.length || 0} Archived</span>
        </div>

        {progress?.solvedCases && progress.solvedCases.length > 0 ? (
          <div className="solved-cases-list">
            {progress.solvedCases.map((sc) => (
              <div key={sc.caseId} className="solved-case-card">
                <div className="solved-case-left">
                  <span className="solved-stamp">SOLVED</span>
                  <div>
                    <h4>{sc.title}</h4>
                    <span className={`difficulty-pill ${sc.difficulty?.toLowerCase()}`}>
                      {sc.difficulty}
                    </span>
                  </div>
                </div>

                <div className="solved-case-right">
                  <div className="points-awarded">+{sc.scoreAwarded} PTS</div>
                  <div className="solved-time">
                    {sc.solvedAt ? new Date(sc.solvedAt).toLocaleDateString() : 'Resolved'}
                  </div>
                  <Link to={`/cases/${sc.caseId}`} className="btn btn-outline btn-sm">
                    Review Dossier
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <span className="empty-icon">🗄️</span>
            <h4>No Cases Resolved Yet</h4>
            <p>No criminal cases have been closed under your credentials. Open the case docket and begin your first investigation!</p>
            <Link to="/cases" className="btn btn-primary btn-sm">
              Launch First Case 🔎
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
