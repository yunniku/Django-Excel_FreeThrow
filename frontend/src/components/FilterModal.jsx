import { useState, useEffect } from 'react';
import { excelAPI } from '../api';

export default function FilterModal({ file, sheet, cols, previous, onApply, onClose }) {
  const [filterData, setFilterData] = useState({});
  const [selected,   setSelected]   = useState(previous || {});
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState('');

  // 마운트 시 컬럼별 고유값 조회
  useEffect(() => {
    if (!file || cols.length === 0) return;
    setLoading(true);
    excelAPI.getFilterValues(file, sheet, cols)
      .then(res => setFilterData(res.data))
      .catch(e  => setError(e.response?.data?.error || '조회 실패'))
      .finally(() => setLoading(false));
  }, [file, sheet, cols]);

  // 체크박스 토글
  const toggle = (col, val) => {
    setSelected(prev => {
      const curr = new Set(prev[col] || []);
      curr.has(val) ? curr.delete(val) : curr.add(val);
      return { ...prev, [col]: [...curr] };
    });
  };

  // 전체 선택/해제
  const toggleAll = (col) => {
    const all  = filterData[col] || [];
    const curr = selected[col]   || [];
    const isAll = curr.length === all.length;
    setSelected(prev => ({ ...prev, [col]: isAll ? [] : [...all] }));
  };

  const handleApply = () => {
    const result = Object.fromEntries(
      Object.entries(selected).filter(([, vals]) => vals.length > 0)
    );
    onApply(result);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box filter-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h4>조건 필터 선택</h4>
          <button className="btn-close" onClick={onClose}>✕</button>
        </div>

        {loading && <p className="modal-loading">조회 중…</p>}
        {error   && <p className="modal-error">{error}</p>}

        {!loading && !error && (
          <div className="filter-columns">
            {cols.map(col => {
              const values  = filterData[col] || [];
              const currSel = new Set(selected[col] || []);
              const allSel  = values.length > 0 && currSel.size === values.length;

              return (
                <div key={col} className="filter-col-group">
                  <div className="filter-col-header">{col} 컬럼 조건 필터</div>
                  <div className="filter-list">
                    {/* 전체 선택 */}
                    <label className="filter-item all-select">
                      <input
                        type="checkbox"
                        checked={allSel}
                        onChange={() => toggleAll(col)}
                      />
                      전체 선택
                    </label>
                    {/* 개별 값 */}
                    {values.map(val => (
                      <label key={val} className="filter-item">
                        <input
                          type="checkbox"
                          checked={currSel.has(val)}
                          onChange={() => toggle(col, val)}
                        />
                        {val}
                      </label>
                    ))}
                    {values.length === 0 && (
                      <p className="filter-empty">값이 없어요.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="modal-footer">
          <button className="btn-close-modal" onClick={handleApply}>적용</button>
          <button className="btn-cancel" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
}