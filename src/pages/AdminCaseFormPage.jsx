import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminApi } from '../api/client';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertBanner from '../components/AlertBanner';

const AdminCaseFormPage = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('MEDIUM');
  const [isActive, setIsActive] = useState(true);
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [clues, setClues] = useState([
    { title: '', content: '', displayOrder: 1 }
  ]);
  const [evidence, setEvidence] = useState([
    { title: '', description: '' }
  ]);

  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      loadCaseData();
    }
  }, [id]);

  const loadCaseData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await adminApi.getCaseById(id);
      setTitle(data.title || '');
      setDescription(data.description || '');
      setDifficulty(data.difficulty || 'MEDIUM');
      setIsActive(data.active !== undefined ? data.active : true);
      setCorrectAnswer(data.correctAnswer || '');
      if (data.clues && data.clues.length > 0) {
        setClues(data.clues);
      }
      if (data.evidence && data.evidence.length > 0) {
        setEvidence(data.evidence);
      }
    } catch (err) {
      setError(err.message || 'Failed to load case data for editing.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddClue = () => {
    setClues([...clues, { title: '', content: '', displayOrder: clues.length + 1 }]);
  };

  const handleRemoveClue = (index) => {
    setClues(clues.filter((_, i) => i !== index));
  };

  const handleClueChange = (index, field, value) => {
    const updated = [...clues];
    updated[index][field] = value;
    setClues(updated);
  };

  const handleAddEvidence = () => {
    setEvidence([...evidence, { title: '', description: '' }]);
  };

  const handleRemoveEvidence = (index) => {
    setEvidence(evidence.filter((_, i) => i !== index));
  };

  const handleEvidenceChange = (index, field, value) => {
    const updated = [...evidence];
    updated[index][field] = value;
    setEvidence(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !correctAnswer.trim()) {
      setError('Title, description, and the correct solution answer are required.');
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      difficulty,
      isActive,
      correctAnswer: correctAnswer.trim(),
      clues: clues.filter((c) => c.title.trim() && c.content.trim()),
      evidence: evidence.filter((e) => e.title.trim() && e.description.trim())
    };

    try {
      setSaving(true);
      if (isEditMode) {
        await adminApi.updateCase(id, payload);
      } else {
        await adminApi.createCase(payload);
      }
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Failed to save mystery case.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Fetching case records..." />;
  }

  return (
    <div className="admin-form-page">
      <div className="admin-form-header">
        <Link to="/admin">&larr; Return to Admin Console</Link>
        <h2>{isEditMode ? 'Edit Mystery Case Dossier' : 'Author New Mystery Case'}</h2>
      </div>

      {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

      <form onSubmit={handleSubmit} className="admin-case-form">
        {/* Core Case Information */}
        <div className="form-card">
          <h3>1. Incident Overview</h3>

          <div className="form-group">
            <label htmlFor="caseTitle">Case Title *</label>
            <input
              id="caseTitle"
              type="text"
              placeholder="e.g. The Sapphire of Blackwood Manor"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="caseDesc">Incident Briefing / Description *</label>
            <textarea
              id="caseDesc"
              rows={4}
              placeholder="Describe the setting, crime, and primary circumstances..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="caseDifficulty">Investigation Difficulty *</label>
              <select
                id="caseDifficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
              </select>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                Active (Available for Investigators to solve)
              </label>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="correctAnswer">
              Configured Solution / Correct Culprit *
            </label>
            <input
              id="correctAnswer"
              type="text"
              placeholder="e.g. Charles Thornwood"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              required
            />
            <small className="help-text">
              This solution is stored securely on the backend and validated server-side.
            </small>
          </div>
        </div>

        {/* Clues Section */}
        <div className="form-card">
          <div className="card-header-row">
            <h3>2. Investigation Clues</h3>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAddClue}
            >
              + Add Clue
            </button>
          </div>

          {clues.map((clue, idx) => (
            <div key={idx} className="dynamic-item-card">
              <div className="item-card-header">
                <span>Clue #{idx + 1}</span>
                {clues.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => handleRemoveClue(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Clue Title (e.g. The Broken Window Latch)"
                  value={clue.title}
                  onChange={(e) => handleClueChange(idx, 'title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <textarea
                  rows={2}
                  placeholder="Clue Details and observation..."
                  value={clue.content}
                  onChange={(e) => handleClueChange(idx, 'content', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Evidence Section */}
        <div className="form-card">
          <div className="card-header-row">
            <h3>3. Forensic Evidence Locker</h3>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleAddEvidence}
            >
              + Add Evidence
            </button>
          </div>

          {evidence.map((ev, idx) => (
            <div key={idx} className="dynamic-item-card">
              <div className="item-card-header">
                <span>Evidence Item #{idx + 1}</span>
                {evidence.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => handleRemoveEvidence(idx)}
                  >
                    Remove
                  </button>
                )}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Evidence Label (e.g. Muddy Footprint Cast)"
                  value={ev.title}
                  onChange={(e) => handleEvidenceChange(idx, 'title', e.target.value)}
                />
              </div>
              <div className="form-group">
                <textarea
                  rows={2}
                  placeholder="Forensic analysis description..."
                  value={ev.description}
                  onChange={(e) => handleEvidenceChange(idx, 'description', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="form-actions">
          <Link to="/admin" className="btn btn-secondary">
            Cancel
          </Link>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving Case Dossier...' : isEditMode ? 'Update Case File' : 'Publish Mystery Case'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCaseFormPage;
