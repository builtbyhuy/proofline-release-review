(function () {
  'use strict';
  const C = window.CatalogCheck;
  const $ = id => document.getElementById(id);
  let current;
  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text != null) node.textContent = String(text);
    if (className) node.className = className;
    return node;
  }
  function render(result, origin) {
    current = result;
    $('csv-preview').hidden = true;
    $('csv-preview').open = false;
    $('csv-output').value = '';
    $('copy-status').textContent = '';
    $('row-count').textContent = result.rows.length;
    $('review-count').textContent = result.review_groups.length;
    $('missing-count').textContent = result.incomplete_rows.length;
    $('status').textContent = origin + ' · ' + result.same_name_groups.length + ' nhóm cùng mã, cùng tên được giữ riêng. Kết quả không xác nhận tính đúng của mã.';
    $('review-groups').replaceChildren();
    if (!result.review_groups.length) {
      $('review-groups').append(element('p', 'Chưa thấy nhóm cùng mã, khác tên trong dữ liệu này. Điều đó không có nghĩa mọi mã đã đúng.', 'empty'));
    }
    result.review_groups.forEach(group => {
      const card = element('article', null, 'group');
      const header = element('div', null, 'group-heading');
      const title = element('div');
      title.append(element('p', 'MÃ SAU CHUẨN HÓA'), element('h3', group.code));
      header.append(title, element('span', group.distinct_name_count + ' tên khác nhau', 'badge'));
      const list = element('div', null, 'source-rows');
      group.rows.forEach(row => {
        const item = element('div', null, 'source-row');
        item.append(element('p', 'ID nội bộ: ' + (row.internal_id || 'chưa có') + ' · Dòng ' + row.row_number, 'row-id'));
        item.append(element('h4', row.name));
        item.append(element('p', 'Mã đầu vào: ' + row.code));
        item.append(element('p', 'Ngày ghi nhận: ' + (row.evidence_date || 'chưa cung cấp')));
        const href = C.safeSourceUrl(row.source_url);
        if (href) {
          const a = element('a', 'Mở trang nguồn ↗');
          a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer';
          a.setAttribute('aria-label', 'Mở trang nguồn của ' + row.name + ', ID ' + (row.internal_id || 'chưa có'));
          item.append(a);
        } else item.append(element('p', row.source_url ? 'Liên kết nguồn không hợp lệ hoặc không dùng HTTP/HTTPS.' : 'Chưa có liên kết nguồn.', 'small'));
        list.append(item);
      });
      card.append(header, list, element('p', 'Cần người am hiểu phụ tùng đối chiếu trang nguồn và tài liệu mã. Không tự sửa, gộp hoặc suy luận tính tương đương.', 'review-note'));
      $('review-groups').append(card);
    });
    $('all-rows-body').replaceChildren();
    result.rows.forEach(row => {
      const tr = element('tr');
      [row.internal_id || 'chưa có', row.name || 'thiếu tên', row.code || 'thiếu mã', row.normalized_code || '—', C.STATUSES[row.status]].forEach(text => tr.append(element('td', text)));
      $('all-rows-body').append(tr);
    });
    $('export').disabled = result.rows.length === 0;
  }
  function run(origin) {
    try {
      const rows = C.parseDelimited($('csv-input').value);
      render(C.analyze(rows), origin);
      $('error').textContent = '';
      return true;
    } catch (error) {
      $('error').textContent = error.message + ' Kết quả phía trên vẫn là lần rà soát thành công trước đó.';
      return false;
    }
  }
  function reset() {
    $('csv-input').value = C.sampleCsv();
    $('file').value = '';
    run('Mẫu công khai ghi nhận 30/09/2026');
  }
  $('analyze').addEventListener('click', () => run('Dữ liệu vừa nhập, chưa được xác minh'));
  $('reset').addEventListener('click', reset);
  $('file').addEventListener('change', async event => {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { $('error').textContent = 'Tệp vượt giới hạn 2 MB. Hãy chọn danh mục nhỏ hơn.'; return; }
    try {
      $('csv-input').value = await file.text();
      run('Tệp đã chọn, chưa được xác minh');
    } catch (_) { $('error').textContent = 'Không đọc được tệp. Hãy thử dán nội dung CSV vào ô nhập.'; }
  });
  $('export').addEventListener('click', () => {
    if (!current || !current.rows.length) return;
    const csv = C.exportCsv(current);
    $('csv-output').value = csv;
    $('csv-preview').hidden = false;
    $('csv-preview').open = true;
    $('copy-status').textContent = '';
    let url;
    try {
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
      url = URL.createObjectURL(blob);
      const a = element('a');
      a.href = url; a.download = 'ket-qua-ra-soat-ma.csv';
      document.body.append(a); a.click(); a.remove();
      $('status').textContent = 'Đã chuẩn bị CSV từ kết quả đang hiển thị và yêu cầu trình duyệt tải xuống. Nếu chưa thấy tệp, có thể sao chép bản CSV bên dưới.';
    } catch (_) {
      $('status').textContent = 'Đã chuẩn bị CSV từ kết quả đang hiển thị. Không yêu cầu được lượt tải xuống; hãy sao chép bản CSV bên dưới.';
    } finally {
      if (url) setTimeout(() => URL.revokeObjectURL(url), 1000);
    }
  });
  $('select-csv').addEventListener('click', () => {
    $('csv-output').focus();
    $('csv-output').select();
    $('csv-output').setSelectionRange(0, $('csv-output').value.length);
    $('copy-status').textContent = 'Đã chọn toàn bộ CSV. Nhấn Ctrl+C (hoặc Command+C trên Mac); trên điện thoại, dùng lệnh Sao chép của thiết bị.';
  });
  reset();
})();
