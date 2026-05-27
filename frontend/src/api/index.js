// 모든 API 호출 함수 모음
import client from './client';

// ── 인증 ──────────────────────────────────────────────
export const authAPI = {
  register: (data) => client.post('/api/register/', data),
  login:    (data) => client.post('/api/login/', data),
  logout:   ()     => client.post('/api/logout/'),
  me:       ()     => client.get('/api/me/'),
};

// ── 프로젝트 ──────────────────────────────────────────
export const projectAPI = {
  list:   ()         => client.get('/api/projects/'),
  create: (data)     => client.post('/api/projects/', data),
  delete: (id)       => client.delete(`/api/projects/${id}/`),
  update: (id, data) => client.put(`/api/projects/${id}/`, data),  // ← 추가

};

// ── 엑셀 처리 ─────────────────────────────────────────
export const excelAPI = {
  // 시트 목록 조회
  getSheets: (file) => {
    const fd = new FormData();
    fd.append('file', file);
    return client.post('/api/sheets/', fd);
  },

  // 미리보기
  getPreview: (file, sheet = '') => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('sheet', sheet);
    return client.post('/api/preview/', fd);
  },

  // 조건 필터 값 조회
  getFilterValues: (file, sheet, cols) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('sheet', sheet);
    fd.append('cols', cols.join(','));
    return client.post('/api/filter-values/', fd);
  },

  // Compare
  compare: ({ inputFile, outputFile, inputSheet, outputSheet, inputCols, outputCols, filterSettings }) => {
    const fd = new FormData();
    fd.append('input_file',      inputFile);
    fd.append('output_file',     outputFile);
    fd.append('input_sheet',     inputSheet  || '');
    fd.append('output_sheet',    outputSheet || '');
    fd.append('input_cols',      JSON.stringify(inputCols));
    fd.append('output_cols',     JSON.stringify(outputCols));
    fd.append('filter_settings', JSON.stringify(filterSettings || {}));
    return client.post('/api/compare/', fd);
  },

  // Save
  save: ({ inputFile, outputFile, inputSheet, outputSheet, inputCols, outputCols, transferPairs, customFills, filterSettings }) => {
    const fd = new FormData();
    fd.append('input_file',      inputFile);
    fd.append('output_file',     outputFile);
    fd.append('input_sheet',     inputSheet  || '');
    fd.append('output_sheet',    outputSheet || '');
    fd.append('input_cols',      JSON.stringify(inputCols));
    fd.append('output_cols',     JSON.stringify(outputCols));
    fd.append('transfer_pairs',  JSON.stringify(transferPairs || []));
    fd.append('custom_fills',    JSON.stringify(customFills   || []));
    fd.append('filter_settings', JSON.stringify(filterSettings || {}));
    return client.post('/api/save/', fd, { responseType: 'blob' });
  },







};