import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { caseApi } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertBanner from '../components/AlertBanner';

const CaseListPage = () => {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [difficultyFilter, setDifficultyFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await caseApi.getAll();
      setCases(data || []);
      setFilteredCases(data || []);
    } catch (err) {
      setError(err.message || 'Unable to load active mystery cases.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...cases];

    if (difficultyFilter !== 'ALL') {
      result = result.filter((c) => c.difficulty === difficultyFilter);
    }

    if (statusFilter === 'SOLVED') {
      result = result.filter((c) => c.solved);
    } else if (statusFilter === 'UNSOLVED') {
      result = result.filter((c) => !c.solved);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q)
      );
    }

    setFilteredCases(result);
  }, [difficultyFilter, statusFilter, searchQuery, cases]);

  if (loading) {
    return <LoadingSpinner message="Accessing unsolved police archives..." />;
  }

  return (
    <div className="cases-page">
      <div className="cases-header">
        <div>
          <h2>Open Case Dockets</h2>
          <p>Review unsolved incidents, scrutinize clues, and submit your deductions</p>
        </div>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

      <div className="filters-bar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search cases by keyword, suspect, or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-controls">
          <div className="filter-group">
            <label>Difficulty:</label>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="ALL">All Levels</option>
              <option value="EASY">Easy</option>
              <option value="MEDIUM">Medium</option>
              <option value="HARD">Hard</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Cases</option>
              <option value="UNSOLVED">Unsolved Only</option>
              <option value="SOLVED">Solved Only</option>
            </select>
          </div>
        </div>
      </div>

      {filteredCases.length > 0 ? (
        <div className="cases-grid">
          {filteredCases.map((c) => (
            <div key={c.id} className={`case-card ${c.solved ? 'solved-card' : ''}`}>
              <div className="case-card-header">
                <span className={`difficulty-badge ${c.difficulty?.toLowerCase()}`}>
                  {c.difficulty}
                </span>
                {c.solved ? (
                  <span className="case-status-badge solved">✅ Resolved</span>
                ) : (
                  <span className="case-status-badge open">🔴 Open Investigation</span>
                )}
              </div>

              <h3 className="case-card-title">{c.title}</h3>
              <p className="case-card-desc">
                {c.description.length > 150
                  ? `${c.description.substring(0, 150)}...`
                  : c.description}
              </p>

              <div className="case-card-footer">
                <span className="points-indicator">Award: 100 PTS</span>
                <Link to={`/cases/${c.id}`} className="btn btn-primary btn-sm">
                  {c.solved ? 'Review Dossier' : 'Investigate Case 🔎'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <span className="empty-icon">📁</span>
          <h4>No Matching Incident Files</h4>
          <p>No mystery cases match your current filter parameters.</p>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setDifficultyFilter('ALL');
              setStatusFilter('ALL');
              setSearchQuery('');
            }}
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default CaseListPage;
