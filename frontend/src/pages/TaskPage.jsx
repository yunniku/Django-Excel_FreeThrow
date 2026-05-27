import '../styles/base.css';
import '../styles/task.css';
import { Link } from 'react-router-dom';
import { useState, useCallback } from 'react';
import { excelAPI } from '../api';
import PreviewModal from '../components/PreviewModal';
import FilterModal from '../components/FilterModal';

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function TaskPage() {
  const [previewTarget,  setPreviewTarget]  = useState(null);
  const [filterOpen,     setFilterOpen]     = useState(false);
  const [inputFile,      setInputFile]      = useState(null);
  const [inputSheets,    setInputSheets]    = useState([]);
  const [inputSheet,     setInputSheet]     = useState('');
  const [inputCols,      setInputCols]      = useState(['', '', '']);
  const [outputFile,     setOutputFile]     = useState(null);
  const [outputSheets,   setOutputSheets]   = useState([]);
  const [outputSheet,    setOutputSheet]    = useState('');
  const [outputCols,     setOutputCols]     = useState(['', '', '']);
  const [filterSettings, setFilterSettings] = useState({});
  const [transferPairs,  setTransferPairs]  = useState([{ from_col: '', to_col: '' }]);
  const [customFills,    setCustomFills]    = useState([{ col: '', value: '' }]);
  const [compareResult,  setCompareResult]  = useState(null);
  const [statusMsg,      setStatusMsg]      = useState('');
  const [loading,        setLoading]        = useState(false);

  const handleInputFile = useCallback(async (file) => {
    if (!file) return;
    setInputFile(file);
    setFilterSettings({});
    try {
      const res = await excelAPI.getSheets(file);
      setInputSheets(res.data.sheets);
      setInputSheet(res.data.sheets[0] || '');
    } catch { setInputSheets([]); }
  }, []);

  const handleOutputFile = useCallback(async (file) => {
    if (!file) return;
    setOutputFile(file);
    try {
      const res = await excelAPI.getSheets(file);
      setOutputSheets(res.data.sheets);
      setOutputSheet(res.data.sheets[0] || '');
    } catch { setOutputSheets([]); }
  }, []);

  const handleCompare = async () => {
    if (!inputFile || !outputFile) {
      setStatusMsg('⚠ 파일을 모두 선택하세요.'); return;
    }
    setLoading(true); setStatusMsg('');
    try {
      const res = await excelAPI.compare({
        inputFile, outputFile,
        inputSheet, outputSheet,
        inputCols:  inputCols.filter(Boolean),
        outputCols: outputCols.filter(Boolean),
        filterSettings,
      });
      setCompareResult(res.data);
    } catch (e) {
      setStatusMsg(`❌ ${e.response?.data?.error || e.message}`);
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    if (!inputFile || !outputFile) {
      setStatusMsg('⚠ 파일을 모두 선택하세요.'); return;
    }
    setLoading(true); setStatusMsg('');
    try {
      const res = await excelAPI.save({
        inputFile, outputFile,
        inputSheet, outputSheet,
        inputCols:     inputCols.filter(Boolean),
        outputCols:    outputCols.filter(Boolean),
        transferPairs: transferPairs.filter(p => p.from_col && p.to_col),
        customFills:   customFills.filter(f => f.col && f.value),
        filterSettings,
      });
      downloadBlob(res.data, `result_${Date.now()}.xlsx`);
      setStatusMsg(`✅ 저장 완료!`);
    } catch (e) {
      setStatusMsg(`❌ ${e.response?.data?.error || e.message}`);
    } finally { setLoading(false); }
  };

  const handleReset = () => {
    setInputFile(null);  setInputSheets([]);  setInputSheet('');
    setOutputFile(null); setOutputSheets([]); setOutputSheet('');
    setInputCols(['','','']); setOutputCols(['','','']);
    setFilterSettings({});
    setTransferPairs([{ from_col: '', to_col: '' }]);
    setCustomFills([{ col: '', value: '' }]);
    setCompareResult(null); setStatusMsg('');
  };

  return (
    <div className="task-page">

      {/* 1. Input Settings */}
      <section className="group-box">
        <h3>1. Input Settings</h3>
        <div className="file-row">
          <input type="file" accept=".xlsx,.xls"
            onChange={e => handleInputFile(e.target.files[0])} />
          <button
            className="btn-preview"
            disabled={!inputFile}
            onClick={() => setPreviewTarget({ file: inputFile, sheet: inputSheet, title: 'Input Preview' })}
          >Preview</button>
          {inputSheets.length > 0 && (
            <select value={inputSheet} onChange={e => setInputSheet(e.target.value)}>
              {inputSheets.map(s => <option key={s}>{s}</option>)}
            </select>
          )}
        </div>
        <div className="col-row">
          <span>Matching Columns :</span>
          {inputCols.map((c, i) => (
            <input key={i} className="col-field" maxLength={2} value={c}
              placeholder="A"
              onChange={e => setInputCols(cols => cols.map((v, idx) => idx === i ? e.target.value.toUpperCase() : v))} />
          ))}
          <button onClick={() => setInputCols(c => [...c, ''])}>+</button>
          <button onClick={() => setInputCols(c => c.slice(0, -1))}>−</button>
        </div>

        {/* 조건 필터 */}
        <div className="filter-row">
          <span>조건 필터 :</span>
          <button
            className="btn-filter"
            disabled={!inputFile || inputCols.filter(Boolean).length === 0}
            onClick={() => setFilterOpen(true)}
          >
            조회 및 선택하기
          </button>
          {Object.keys(filterSettings).length > 0 && (
            <span className="filter-badge">
              {Object.values(filterSettings).flat().length}개 선택됨
            </span>
          )}
        </div>
      </section>

      {/* 2. Output Settings */}
      <section className="group-box">
        <h3>2. Output Settings</h3>
        <div className="file-row">
          <input type="file" accept=".xlsx,.xls"
            onChange={e => handleOutputFile(e.target.files[0])} />
          <button
            className="btn-preview"
            disabled={!outputFile}
            onClick={() => setPreviewTarget({ file: outputFile, sheet: outputSheet, title: 'Output Preview' })}
          >Preview</button>
          {outputSheets.length > 0 && (
            <select value={outputSheet} onChange={e => setOutputSheet(e.target.value)}>
              {outputSheets.map(s => <option key={s}>{s}</option>)}
            </select>
          )}
        </div>
        <div className="col-row">
          <span>Matching Columns :</span>
          {outputCols.map((c, i) => (
            <input key={i} className="col-field" maxLength={2} value={c}
              placeholder="B"
              onChange={e => setOutputCols(cols => cols.map((v, idx) => idx === i ? e.target.value.toUpperCase() : v))} />
          ))}
          <button onClick={() => setOutputCols(c => [...c, ''])}>+</button>
          <button onClick={() => setOutputCols(c => c.slice(0, -1))}>−</button>
        </div>
      </section>

      {/* 3. Compare Result */}
      <section className="group-box">
        <h3>3. Compare Result</h3>
        <button onClick={handleCompare} disabled={loading}>Compare</button>
        {compareResult && (
          <div className="compare-result">
            <p>📋 Input 행 수: <strong>{compareResult.input_row_count}</strong></p>
            <p>✅ Output 일치 행 수: <strong>{compareResult.matched_key_count}</strong></p>
            {Object.keys(compareResult.output_duplicate_keys).length > 0 && (
              <p>⚠ Output 중복 키: {Object.keys(compareResult.output_duplicate_keys).join(', ')}</p>
            )}
            {Object.keys(compareResult.input_duplicate_keys).length > 0 && (
              <p>⚠ Input 중복 키: {Object.keys(compareResult.input_duplicate_keys).join(', ')}</p>
            )}
          </div>
        )}
      </section>

      {/* 4-1. Transfer Columns */}
      <section className="group-box">
        <h3>4-1. Transfer Columns (Input → Output)</h3>
        {transferPairs.map((p, i) => (
          <div key={i} className="transfer-row">
            <input className="col-field" placeholder="From" maxLength={2} value={p.from_col}
              onChange={e => setTransferPairs(pairs => pairs.map((v, idx) => idx === i ? { ...v, from_col: e.target.value.toUpperCase() } : v))} />
            <span>→</span>
            <input className="col-field" placeholder="To" maxLength={2} value={p.to_col}
              onChange={e => setTransferPairs(pairs => pairs.map((v, idx) => idx === i ? { ...v, to_col: e.target.value.toUpperCase() } : v))} />
            {i === 0 && (
              <>
                <button onClick={() => setTransferPairs(p => [...p, { from_col: '', to_col: '' }])}>+</button>
                <button onClick={() => setTransferPairs(p => p.slice(0, -1))}>−</button>
              </>
            )}
          </div>
        ))}
      </section>

      {/* 4-2. Custom Fill */}
      <section className="group-box">
        <h3>4-2. Custom Text Fill</h3>
        {customFills.map((f, i) => (
          <div key={i} className="transfer-row">
            <span>Output Column :</span>
            <input className="col-field" placeholder="T" maxLength={2} value={f.col}
              onChange={e => setCustomFills(fills => fills.map((v, idx) => idx === i ? { ...v, col: e.target.value.toUpperCase() } : v))} />
            <span>Custom Text :</span>
            <input placeholder="텍스트 입력" value={f.value}
              onChange={e => setCustomFills(fills => fills.map((v, idx) => idx === i ? { ...v, value: e.target.value } : v))} />
            {i === 0 && (
              <>
                <button onClick={() => setCustomFills(f => [...f, { col: '', value: '' }])}>+</button>
                <button onClick={() => setCustomFills(f => f.slice(0, -1))}>−</button>
              </>
            )}
          </div>
        ))}
      </section>

      {/* 상태 메시지 */}
      {statusMsg && <p className="status-msg">{statusMsg}</p>}

      {/* 액션 버튼 */}
      <div className="action-row">
        <Link to="/dashboard" className="btn-back">←</Link>
        <button className="btn-reset" onClick={handleReset}>Reset</button>
        <button className="btn-save" onClick={handleSave} disabled={loading}>
          {loading ? '저장 중…' : '💾 Save Result'}
        </button>
      </div>

      {/* Preview 모달 */}
      {previewTarget && (
        <PreviewModal
          file={previewTarget.file}
          sheet={previewTarget.sheet}
          title={previewTarget.title}
          onClose={() => setPreviewTarget(null)}
        />
      )}

      {/* 조건 필터 모달 */}
      {filterOpen && (
        <FilterModal
          file={inputFile}
          sheet={inputSheet}
          cols={inputCols.filter(Boolean)}
          previous={filterSettings}
          onApply={(filters) => { setFilterSettings(filters); setFilterOpen(false); }}
          onClose={() => setFilterOpen(false)}
        />
      )}

    </div>
  );
}