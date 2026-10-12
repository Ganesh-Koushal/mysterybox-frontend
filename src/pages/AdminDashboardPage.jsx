import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertBanner from '../components/AlertBanner';

const AdminDashboardPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSolutions, setShowSolutions] = useState({});

  useEffect(() => {
    fetchAdminCases();
  }, []);

  const fetchAdminCases = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminApi.getAllCases();
      setCases(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load administrator cases.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSolutionVisibility = (id) => {
    setShowSolutions((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDeleteCase = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete case "${title}"? This will permanently remove its clues, evidence, and records.`)) {
      return;
    }

    try {
      await adminApi.deleteCase(id);
      setSuccess(`Case "${title}" deleted successfully.`);
      setCases((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete case.');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading administrative case registry..." />;
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div>
          <h2>Chief Administrator Case Console</h2>
          <p>Author, modify, review solutions, and administer all mystery case files</p>
        </div>
        <Link to="/admin/cases/new" className="btn btn-primary">
          + Author New Mystery Case
        </Link>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}
      {success && <AlertBanner type="success" message={success} onClose={() => setSuccess('')} />}

      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Case Title</th>
              <th>Difficulty</th>
              <th>Status</th>
              <th>Clues</th>
              <th>Evidence</th>
              <th>Configured Solution</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cases.length > 0 ? (
              cases.map((c) => (
                <tr key={c.id}>
                  <td>#{c.id}</td>
                  <td>
                    <strong>{c.title}</strong>
                  </td>
                  <td>
                    <span className={`difficulty-pill ${c.difficulty?.toLowerCase()}`}>
                      {c.difficulty}
                    </span>
                  </td>
                  <td>
                    <span className={`status-pill ${c.active ? 'active' : 'inactive'}`}>
                      {c.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{c.clues?.length || 0}</td>
                  <td>{c.evidence?.length || 0}</td>
                  <td>
                    <div className="solution-cell">
                      <span className="solution-text">
                        {showSolutions[c.id] ? c.correctAnswer : '••••••••••••'}
                      </span>
                      <button
                        type="button"
                        className="btn-icon"
                        title={showSolutions[c.id] ? 'Hide Solution' : 'Reveal Solution'}
                        onClick={() => toggleSolutionVisibility(c.id)}
                      >
                        {showSolutions[c.id] ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <Link to={`/admin/cases/edit/${c.id}`} className="btn btn-secondary btn-xs">
                        Edit
                      </Link>
                      <button
                        type="button"
                        className="btn btn-danger btn-xs"
                        onClick={() => handleDeleteCase(c.id, c.title)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  No cases registered in the system. Create one above!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
