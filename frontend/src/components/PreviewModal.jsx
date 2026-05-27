import { useState, useEffect } from 'react';
import { excelAPI } from '../api';

export default function PreviewModal({ file, sheet, title, onClose }) {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');

  useEffect(() => {
    if (!file) return;
    setLoading(true);
    excelAPI.getPreview(file, sheet)
      .then(res => setData(res.data))
      .catch(e  => setError(e.response?.data?.error || '미리보기 실패'))
      .finally(() => setLoading(false));
  }, [file, sheet]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h4>{title}</h4>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        {loading && <p className="modal-loading">로딩 중…</p>}
        {error   && <p className="modal-error">{error}</p>}

        {data && !loading && (
          <div className="preview-table-wrap">
            <table className="preview-table">
              <thead>
                <tr>
                  <th>#</th>
                  {data.col_letters.map(l => <th key={l}>{l}</th>)}
                </tr>
                <tr className="col-name-row">
                  <th>1</th>
                  {data.col_names.map((n, i) => <th key={i}>{n}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.rows.map((row, ri) => (
                  <tr key={ri}>
                    <td className="row-num">{ri + 2}</td>
                    {row.map((cell, ci) => <td key={ci}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="modal-footer">
          <button className="btn-close-modal" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
}