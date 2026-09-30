(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.CatalogCheck = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const HEADERS = ['internal_id', 'name', 'code', 'source_url', 'evidence_date'];
  const SAMPLE_ROWS = [
    { internal_id: '856', name: 'Cụm bướm ga', code: '35100-04200', source_url: 'https://phutungotohp.vn/product/than-buom-ga-kia-morning-2012', evidence_date: '2026-09-30' },
    { internal_id: '437', name: 'Nắp van hằng nhiệt', code: '3510004200', source_url: 'https://phutungotohp.vn/product/nap-van-hang-nhiet-kia-morning', evidence_date: '2026-09-30' }
  ];
  const STATUSES = {
    review: 'Cần đối chiếu: cùng mã, khác tên',
    same_name: 'Cùng mã, cùng tên: chưa thấy xung đột tên',
    single: 'Một dòng: chưa có đối chiếu',
    incomplete: 'Thiếu tên hoặc mã'
  };
  function normalizeCode(value) {
    return String(value == null ? '' : value).normalize('NFKC').trim().toUpperCase().replace(/[\s\-\u2010-\u2015]+/g, '');
  }
  function normalizeName(value) {
    return String(value == null ? '' : value).normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('vi');
  }
  function safeSourceUrl(value) {
    try {
      const url = new URL(String(value || '').trim());
      return ['https:', 'http:'].includes(url.protocol) && !url.username && !url.password ? url.href : null;
    } catch (_) { return null; }
  }
  function analyze(rows) {
    if (!Array.isArray(rows)) throw new Error('Dữ liệu phải là danh sách các dòng.');
    if (rows.length > 2000) throw new Error('Mẫu này xử lý tối đa 2.000 dòng mỗi lần.');
    const groupsByCode = new Map();
    const checkedRows = rows.map((input, index) => {
      const row = {};
      HEADERS.forEach(key => { row[key] = String(input[key] == null ? '' : input[key]).trim(); });
      row.row_number = index + 1;
      row.normalized_code = normalizeCode(row.code);
      row.normalized_name = normalizeName(row.name);
      row.status = !row.normalized_code || !row.normalized_name ? 'incomplete' : 'single';
      if (row.status !== 'incomplete') {
        if (!groupsByCode.has(row.normalized_code)) groupsByCode.set(row.normalized_code, []);
        groupsByCode.get(row.normalized_code).push(row);
      }
      return row;
    });
    const groups = [...groupsByCode].map(([code, members]) => {
      const distinctNames = [...new Set(members.map(row => row.normalized_name))];
      const status = distinctNames.length > 1 ? 'review' : members.length > 1 ? 'same_name' : 'single';
      members.forEach(row => { row.status = status; });
      return { code, rows: members, status, distinct_name_count: distinctNames.length };
    });
    return {
      rows: checkedRows,
      groups,
      review_groups: groups.filter(group => group.status === 'review'),
      same_name_groups: groups.filter(group => group.status === 'same_name'),
      incomplete_rows: checkedRows.filter(row => row.status === 'incomplete')
    };
  }
  function parseDelimited(input) {
    let text = String(input || '').replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
    if (text.length > 2 * 1024 * 1024) throw new Error('Dữ liệu vượt giới hạn 2 MB.');
    if (!text.trim()) throw new Error('Hãy dán CSV hoặc chọn tệp trước khi rà soát.');
    let firstLine = '', quoted = false;
    for (let i = 0; i < text.length; i++) {
      if (text[i] === '"') quoted = !quoted;
      if (text[i] === '\n' && !quoted) break;
      firstLine += text[i];
    }
    const delimiter = firstLine.includes('\t') ? '\t' : ',';
    const matrix = []; let row = [], value = '', inQuote = false, closed = false;
    function pushField() { row.push(value); value = ''; closed = false; }
    function pushRow() { pushField(); if (row.some(cell => cell.trim() !== '')) matrix.push(row); row = []; }
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (inQuote) {
        if (ch === '"') {
          if (text[i + 1] === '"') { value += '"'; i++; }
          else { inQuote = false; closed = true; }
        } else value += ch;
      } else if (ch === delimiter) pushField();
      else if (ch === '\n') pushRow();
      else if (ch === '"' && value === '' && !closed) inQuote = true;
      else if (closed && !/\s/.test(ch)) throw new Error('CSV không hợp lệ: có ký tự sau dấu ngoặc kép đóng.');
      else if (ch === '"') throw new Error('CSV không hợp lệ: hãy đặt cả ô trong ngoặc kép.');
      else if (!closed) value += ch;
    }
    if (inQuote) throw new Error('CSV không hợp lệ: thiếu dấu ngoặc kép đóng.');
    if (value !== '' || row.length || closed) pushRow();
    if (!matrix.length) throw new Error('Chưa tìm thấy dòng tiêu đề.');
    const headers = matrix.shift().map(cell => cell.trim().toLowerCase());
    if (new Set(headers).size !== headers.length) throw new Error('CSV có tên cột trùng nhau.');
    if (!headers.includes('name') || !headers.includes('code')) throw new Error('CSV cần hai cột name và code. Các cột còn lại là tùy chọn.');
    if (matrix.length > 2000) throw new Error('Mẫu này xử lý tối đa 2.000 dòng mỗi lần.');
    return matrix.map((cells, index) => {
      if (cells.length > headers.length) throw new Error('Dòng dữ liệu ' + (index + 1) + ' có nhiều ô hơn tiêu đề. Hãy kiểm tra dấu phẩy và ngoặc kép.');
      const record = {};
      HEADERS.forEach(key => { const at = headers.indexOf(key); record[key] = at < 0 ? '' : String(cells[at] || '').trim(); });
      return record;
    });
  }
  function csvCell(value) {
    let text = String(value == null ? '' : value);
    // Protect a CSV opened in spreadsheet software; quoting alone does not stop formulas.
    if (/^[\u0000-\u0020]*[=+@-]/.test(text) || /^[\t\r\n]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  }
  function exportCsv(result) {
    const fields = [...HEADERS, 'normalized_code', 'review_status'];
    const lines = [fields.map(csvCell).join(',')];
    result.rows.forEach(row => lines.push(fields.map(key => csvCell(key === 'review_status' ? STATUSES[row.status] : row[key])).join(',')));
    return '\uFEFF' + lines.join('\r\n') + '\r\n';
  }
  function sampleCsv() {
    return [HEADERS.map(csvCell).join(','), ...SAMPLE_ROWS.map(row => HEADERS.map(key => csvCell(row[key])).join(','))].join('\n');
  }
  return { HEADERS, SAMPLE_ROWS, STATUSES, normalizeCode, normalizeName, safeSourceUrl, analyze, parseDelimited, csvCell, exportCsv, sampleCsv };
});
