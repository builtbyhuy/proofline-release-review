'use strict';
(() => {
  const api = window.ParsingReview;
  const $ = id => document.getElementById(id);
  let state = api.createState();
  let selected = state[0].id;
  const active = () => state.find(record => record.id === selected);
  function message(text, error = false) {
    $('status').textContent = text;
    $('status').className = error ? 'error' : 'success';
  }
  function renderQueue() {
    $('queue').replaceChildren();
    state.forEach(record => {
      const button = document.createElement('button');
      button.type = 'button';
      button.setAttribute('aria-current', String(record.id === selected));
      button.textContent = record.id;
      const title = document.createElement('span');
      title.className = 'case-title'; title.textContent = record.title;
      const status = document.createElement('span');
      status.className = 'case-state'; status.textContent = record.decision === 'revise' ? 'Marked for revision' : record.decision;
      button.append(title, status);
      button.addEventListener('click', () => { selected = record.id; renderRecord(); });
      $('queue').append(button);
    });
    $('progress').textContent = `${state.filter(record => record.decision !== 'pending').length} of 3 records have a human decision.`;
    $('decision-status').textContent = active().decision === 'revise' ? 'Needs revision' : active().decision;
  }
  function renderValidation() {
    const errors = api.validationErrors(active());
    $('validation').textContent = errors.length ? errors.join(' ') : 'Required fields are present. Source meaning still requires human review.';
  }
  function renderRecord() {
    const record = active();
    renderQueue();
    $('record-title').textContent = record.title;
    $('source-ref').textContent = record.sourceRef + ' · synthetic source';
    $('raw-source').textContent = record.raw;
    $('flags').replaceChildren();
    record.flags.forEach(flag => { const item = document.createElement('li'); item.textContent = flag; $('flags').append(item); });
    ['item', 'quantity', 'unit', 'requiredBy'].forEach(field => { $(field).value = record.parsed[field] ?? ''; });
    $('review-note').value = record.reviewerNote;
    $('source-checked').checked = record.sourceChecked;
    renderValidation(); message('');
  }
  ['item', 'quantity', 'unit', 'requiredBy'].forEach(field => {
    $(field).addEventListener('input', event => {
      api.updateField(state, selected, field, event.target.value);
      $('source-checked').checked = false;
      renderQueue(); renderValidation();
      message('Edited. Review the source again before deciding.');
      $('export-status').textContent = 'Review changed. Prepare JSON again to refresh the preview.';
    });
  });
  $('review-note').addEventListener('input', event => {
    active().reviewerNote = event.target.value;
    active().decision = 'pending'; renderQueue();
    $('export-status').textContent = 'Review changed. Prepare JSON again to refresh the preview.';
  });
  $('source-checked').addEventListener('change', event => {
    active().sourceChecked = event.target.checked;
    active().decision = 'pending'; renderQueue();
    $('export-status').textContent = 'Review changed. Prepare JSON again to refresh the preview.';
  });
  function decision(kind) {
    try {
      api.decide(state, selected, kind, $('review-note').value, $('source-checked').checked);
      renderQueue(); message(kind === 'accepted' ? 'Human acceptance recorded. No data was sent.' : 'Marked for revision. Missing facts remain explicit.');
      $('export-status').textContent = 'Decision changed. Prepare JSON again to refresh the preview.';
    } catch (error) { message(error.message, true); }
  }
  $('accept').addEventListener('click', () => decision('accepted'));
  $('revise').addEventListener('click', () => decision('revise'));
  function prepareJson() {
    const json = JSON.stringify(api.buildExport(state), null, 2);
    $('json-output').value = json;
    $('export-status').textContent = 'Current review state prepared locally. Pending records are included.';
    return json;
  }
  $('prepare-json').addEventListener('click', prepareJson);
  $('copy-json').addEventListener('click', async () => {
    const json = prepareJson();
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(json);
      $('export-status').textContent = 'JSON copied. Nothing was sent.';
    } catch (_) {
      $('json-output').focus(); $('json-output').select();
      $('export-status').textContent = 'Clipboard permission unavailable. JSON is selected; use Ctrl+C or Cmd+C.';
    }
  });
  $('reset').addEventListener('click', () => { state = api.createState(); selected = state[0].id; renderRecord(); prepareJson(); message('Synthetic examples restored.'); });
  renderRecord(); prepareJson();
})();
