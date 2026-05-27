import '../styles/base.css';
import '../styles/dashboard.css';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { projectAPI } from '../api';

export default function DashboardPage() {
  const { user, logout }       = useAuth();
  const navigate               = useNavigate();
  const [projects, setProjects] = useState([]);
  const [form,     setForm]     = useState({ name: '', description: '' });
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm,  setEditForm]  = useState({ name: '', description: '' });


  // 프로젝트 목록 불러오기
  useEffect(() => {
    projectAPI.list().then(res => setProjects(res.data));
  }, []);

  // 프로젝트 생성
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const res = await projectAPI.create(form);
    setProjects(p => [res.data, ...p]);
    setForm({ name: '', description: '' });
    setCreating(false);
  };

  // 프로젝트 삭제
  const handleDelete = async (id) => {
    if (!confirm('삭제할까요?')) return;
    await projectAPI.delete(id);
    setProjects(p => p.filter(pr => pr.id !== id));
  };

  const handleEdit = async (id) => {
    await projectAPI.update(id, editForm);
    setProjects(p => p.map(pr => pr.id === id ? { ...pr, ...editForm } : pr));
    setEditingId(null);
  };

  // 로그아웃
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>⚡ Excel FreeThrow</h2>
        <div>
          <span>{user?.username}님</span>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      </div>

      <div className="dashboard-body">
        <div className="dashboard-top">
          <h3>내 프로젝트</h3>
          <div>
            <Link to="/task" className="btn-quick">⚡ 바로 작업하기</Link>
            <button onClick={() => setCreating(v => !v)}>+ 새 프로젝트</button>
          </div>
        </div>

        {/* 프로젝트 생성 폼 */}
        {creating && (
          <form className="create-form" onSubmit={handleCreate}>
            <input
              placeholder="프로젝트 이름"
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            />
            <input
              placeholder="설명 (선택)"
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            />
            <button type="submit">만들기</button>
            <button type="button" onClick={() => setCreating(false)}>취소</button>
          </form>
        )}

        {/* 프로젝트 목록 */}
        <div className="project-grid">
        {projects.map(p => (
            <div key={p.id} className="project-card">
            <div className="project-card-header">
                <button onClick={() => handleDelete(p.id)}>✕</button>
                {editingId === p.id ? (
                <div className="edit-form">
                    <input
                    value={editForm.name}
                    onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="프로젝트 이름"
                    />
                    <input
                    value={editForm.description}
                    onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))}
                    placeholder="설명"
                    />
                </div>
                ) : (
                <h4>{p.name}</h4>
                )}
                <div className="card-actions">
                {editingId === p.id ? (
                    <button className="btn-confirm" onClick={() => handleEdit(p.id)}>✔</button>
                ) : (
                    <button className="btn-edit" onClick={() => {
                    setEditingId(p.id);
                    setEditForm({ name: p.name, description: p.description });
                    }}>✏️</button>
                )}
                <Link to={`/task?project=${p.id}`}>작업 시작 →</Link>
                </div>
            </div>
            {editingId !== p.id && p.description && (
                <p className="project-desc">{p.description}</p>
            )}
            </div>
        ))}
        </div>

      </div>
    </div>
  );
}