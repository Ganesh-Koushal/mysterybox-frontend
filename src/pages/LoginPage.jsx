import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertBanner from '../components/AlertBanner';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Please provide both email address and password.');
      return;
    }

    try {
      setLoading(true);
      const user = await login(email.trim(), password.trim());
      if (user.role === 'ADMIN' && from === '/dashboard') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <span className="auth-icon">🕵️</span>
          <h2>Investigator Authentication</h2>
          <p>Access your detective records and unsolved mystery dossiers</p>
        </div>

        {error && <AlertBanner type="error" message={error} onClose={() => setError('')} />}

        <div className="demo-credentials-banner">
          <span className="demo-label">Quick-Fill Demo Access:</span>
          <div className="demo-buttons">
            <button
              type="button"
              className="btn-demo"
              onClick={() => handleFillDemo('admin@mysterybox.com', 'Admin@123')}
            >
              👑 Chief Admin
            </button>
            <button
              type="button"
              className="btn-demo"
              onClick={() => handleFillDemo('holmes@test.com', 'Secret@123')}
            >
              🔍 Detective Holmes
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Detective Email</label>
            <input
              id="email"
              type="email"
              placeholder="name@mysterybox.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Passphrase</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Authenticating...' : 'Sign In to Investigation 🗝️'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            New to the bureau? <Link to="/register">Enlist an investigator account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
