import '../styles/base.css';
import '../styles/auth.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form,    setForm]    = useState({ username: '', password: '', password2: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.password2) {
      setError('비밀번호가 일치하지 않아요.'); return;
    }
    setLoading(true);
    setError('');
    try {
      await register(form.username, form.password, form.password2);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || '회원가입 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>⚡ Excel FreeThrow</h2>
        <p>회원가입</p>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="아이디"
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={form.password2}
            onChange={e => setForm(f => ({ ...f, password2: e.target.value }))}
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={loading}>
            {loading ? '가입 중…' : '회원가입'}
          </button>
        </form>
        <p>이미 계정이 있으신가요? <Link to="/login">로그인</Link></p>
      </div>
    </div>
  );
}