/* Outsome Founder Sprint — /apply (v2)
   Multi-step form with autosave, review step, edit-after-submit, and small moments of delight. */
(function () {
  'use strict';

  var CONFIG = {
    endpoint: 'https://script.google.com/macros/s/AKfycbwdCFqeK0OXNwu7YkeM-nzoP7TbW7gzYJUw3SN0-GUgj8-ovdEIwV9vjp4O0ULMMLZZ/exec',
    deadline: '2026-10-30',
    draftKey: 'outsome_fs8_apply_draft',
    tokenKey: 'outsome_fs8_apply_token',
    totalSteps: 4
  };

  var INDUSTRIES = ['핀테크','스마트시티','엔터테인먼트','AR/VR','바이오 테크','Dev 툴','라이프스타일','의료','E-Sports','뷰티','미디어','하드웨어','AI','블록체인','식음료','웰니스/핏니스','농업','커뮤니티','에듀테크/교육','게임','보안','관광/레저','헬스케어','패션','오픈소스','ESG/환경/에너지','펫 푸드/테크','그외'];
  var BMS = ['B2B SaaS','B2B 구독서비스','B2C 구독서비스','B2B2C 마켓플레이스','온라인 판매','API','광고모델','수수료 모델','B2G','프로젝트 계약/에이전시','Brokerage/중개업','유통','프랜차이즈','라이센싱','제조','그외'];

  var FIELDS = ['founderNameKr','founderNameEn','phone','email','linkedin','companyName','website','oneLiner','industry','industryOtherText','productStage','businessModel','bmOtherText','deckUrl','targetProblem','targetCustomer','whyUS','referral'];
  var STEP_FIELDS = {
    1: ['founderNameKr','founderNameEn','phone','email','linkedin'],
    2: ['companyName','website','oneLiner','industry','productStage','businessModel','deckUrl'],
    3: ['targetProblem','targetCustomer','whyUS','referral'],
    4: ['consent']
  };
  var LABELS = {
    founderNameKr:'한글 이름', founderNameEn:'영문 이름', phone:'연락처', email:'이메일', linkedin:'LinkedIn',
    companyName:'기업명', website:'웹사이트', oneLiner:'한 문장 설명', industry:'분야', productStage:'개발 단계',
    businessModel:'Business Model', deckUrl:'IR 덱', targetProblem:'타겟 문제', targetCustomer:'타겟 고객', whyUS:'왜 미국인가', referral:'알게 된 경로'
  };

  var form, currentStep = 1, editToken = null, saveTimer = null, celebrated = {};

  /* ---------- helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function qs(s, el) { return (el || document).querySelector(s); }
  function qsa(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function val(name) { var el = form.elements[name]; return el ? (el.type === 'checkbox' ? (el.checked ? 'YES' : '') : el.value.trim()) : ''; }
  function setVal(name, v) { var el = form.elements[name]; if (!el) return; if (el.type === 'checkbox') el.checked = v === 'YES'; else el.value = v || ''; }
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function normUrl(v) { v = (v || '').trim(); if (!v) return ''; if (!/^https?:\/\//i.test(v)) v = 'https://' + v; return v; }
  function words(v) { v = (v || '').trim(); return v ? v.split(/\s+/).length : 0; }
  function daysLeft() { var d = new Date(CONFIG.deadline + 'T23:59:59+09:00'); return Math.ceil((d - new Date()) / 86400000); }

  function toast(msg) {
    var t = $('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; t.innerHTML = '<span class="tick"><svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><span class="msg"></span>'; document.body.appendChild(t); }
    qs('.msg', t).textContent = msg;
    t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  /* ---------- confetti (no deps) ---------- */
  function confetti() {
    var c = $('confetti'); if (!c) return;
    var ctx = c.getContext('2d'), W = c.width = window.innerWidth, H = c.height = window.innerHeight;
    var colors = ['#FF6600', '#1B1917', '#FFB27A', '#FAFAF5', '#1E9E5A'];
    var parts = [];
    for (var i = 0; i < 160; i++) parts.push({ x: W / 2 + (Math.random() - .5) * 200, y: H * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, g: .35 + Math.random() * .2, s: 5 + Math.random() * 6, r: Math.random() * Math.PI, vr: (Math.random() - .5) * .3, c: colors[i % colors.length], life: 1 });
    var start = performance.now();
    (function frame(t) {
      var el = (t - start) / 1000;
      ctx.clearRect(0, 0, W, H);
      parts.forEach(function (p) { p.vy += p.g; p.x += p.vx; p.y += p.vy; p.vx *= .99; p.r += p.vr; p.life = Math.max(0, 1 - el / 2.4); ctx.save(); ctx.globalAlpha = p.life; ctx.translate(p.x, p.y); ctx.rotate(p.r); ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6); ctx.restore(); });
      if (el < 2.5) requestAnimationFrame(frame); else ctx.clearRect(0, 0, W, H);
    })(start);
  }

  /* ---------- chips ---------- */
  function buildChips(wrapId, hiddenId, list, otherId) {
    var wrap = qs('.chips', $(wrapId));
    list.forEach(function (label) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'chip'; b.textContent = label;
      b.addEventListener('click', function () {
        qsa('.chip', wrap).forEach(function (x) { x.classList.remove('on'); });
        b.classList.add('on');
        $(hiddenId).value = label;
        $(wrapId).classList.remove('error');
        var err = $(wrapId).parentNode.querySelector('.field-error-msg'); if (err) err.style.display = 'none';
        var other = $(otherId); other.classList.toggle('show', label === '그외');
        if (label !== '그외') other.querySelector('input').value = ''; else setTimeout(function () { other.querySelector('input').focus(); }, 150);
        onChange();
      });
      wrap.appendChild(b);
    });
  }
  function syncChips(wrapId, hiddenId, otherId) {
    var v = $(hiddenId).value;
    qsa('.chip', $(wrapId)).forEach(function (x) { x.classList.toggle('on', x.textContent === v); });
    $(otherId).classList.toggle('show', v === '그외');
  }

  /* ---------- progress ---------- */
  function filledCount(step) {
    var names = STEP_FIELDS[step], n = 0;
    names.forEach(function (nm) { if (val(nm)) n++; });
    return { done: n, total: names.length };
  }
  function updateProgress() {
    for (var s = 1; s <= CONFIG.totalSteps; s++) {
      var c = filledCount(s), item = qs('.step-item[data-step="' + s + '"]');
      var bar = qs('.mini i', item), cnt = qs('.cnt', item);
      if (bar) bar.style.width = (c.done / c.total * 100) + '%';
      if (cnt) cnt.textContent = c.done + '/' + c.total;
      var stepEl = qs('.form-step[data-step="' + s + '"] .step-count .done'); if (stepEl) stepEl.textContent = c.done;
      if (s < 4 && c.done === c.total && !celebrated[s] && s === currentStep) { celebrated[s] = true; }
    }
    var all = FIELDS.filter(function (f) { return f !== 'industryOtherText' && f !== 'bmOtherText'; });
    var filled = all.filter(function (f) { return !!val(f); }).length;
    var pct = Math.max(8, Math.round(((currentStep - 1) / CONFIG.totalSteps) * 100 + (filledCount(currentStep).done / filledCount(currentStep).total) * (100 / CONFIG.totalSteps)));
    $('progressBar').style.width = Math.min(pct, 100) + '%';
    void filled;
  }

  /* ---------- field state ---------- */
  function markField(el) {
    if (!el || !el.classList || !(el.classList.contains('field-input') || el.classList.contains('field-textarea'))) return;
    var v = el.value.trim(), ok = false;
    if (v) {
      if (el.type === 'email') ok = isEmail(v);
      else ok = true;
    }
    el.classList.toggle('ok', ok);
    if (ok) { el.classList.remove('error'); var err = el.closest('.field-group') && el.closest('.field-group').querySelector('.field-error-msg'); if (err) err.style.display = 'none'; }
  }
  function updateCounters() {
    qsa('textarea[data-words]', form).forEach(function (ta) {
      var lim = +ta.dataset.words, n = words(ta.value), el = $('wc-' + ta.name);
      if (!el) return; el.textContent = n + ' / ' + lim + ' 단어';
      el.classList.toggle('warn', n > lim); el.classList.toggle('good', n > 0 && n <= lim && n >= 20);
    });
    var ol = form.elements.oneLiner, cc = $('cc-oneLiner');
    if (ol && cc) { cc.textContent = ol.value.length + ' / 30자'; cc.classList.toggle('warn', ol.value.length >= 30); cc.classList.toggle('good', ol.value.length > 0 && ol.value.length < 30); }
  }

  /* ---------- validation ---------- */
  function validateStep(step) {
    var stepEl = qs('.form-step[data-step="' + step + '"]'), valid = true, first = null;
    qsa('[required]', stepEl).forEach(function (input) {
      var group = input.closest('.field-group'), err = group ? group.querySelector('.field-error-msg') : null;
      var v = input.type === 'checkbox' ? input.checked : input.value.trim();
      var bad = !v || (input.type === 'email' && !isEmail(input.value));
      if (input.type === 'hidden') { var wrap = group.querySelector('.chips-wrap'); if (wrap) wrap.classList.toggle('error', bad); }
      else if (input.type === 'checkbox') { $('consentBox').classList.toggle('error', bad); $('consentError').style.display = bad ? 'block' : 'none'; }
      else { input.classList.toggle('error', bad); if (bad) { input.classList.remove('ok'); } }
      if (err && input.type !== 'checkbox') err.style.display = bad ? 'block' : 'none';
      if (bad) { valid = false; if (!first) first = input.type === 'hidden' ? group : input; }
    });
    if (first) { (first.scrollIntoView ? first : stepEl).scrollIntoView({ behavior: 'smooth', block: 'center' }); if (first.focus && first.type !== 'hidden') setTimeout(function () { first.focus(); }, 300); }
    return valid;
  }

  /* ---------- navigation ---------- */
  function goToStep(step) {
    if (step < 1 || step > CONFIG.totalSteps) return;
    if (step > currentStep) {
      for (var s = currentStep; s < step; s++) { if (!validateStep(s)) { currentStep = s; updateUI(); return; } }
      if (!celebrated[currentStep]) { celebrated[currentStep] = true; toast(qs('.step-item[data-step="' + currentStep + '"] .step-label').textContent + ' 완료'); }
    }
    currentStep = step;
    if (step === 4) renderReview();
    updateUI();
    saveDraft(true);
  }
  function updateUI() {
    qsa('.form-step').forEach(function (el) { el.classList.toggle('active', +el.dataset.step === currentStep); });
    qsa('.step-item').forEach(function (el) {
      var s = +el.dataset.step; el.classList.remove('active', 'completed');
      if (s === currentStep) el.classList.add('active'); else if (s < currentStep) el.classList.add('completed');
      var num = qs('.step-number', el);
      if (s < currentStep) num.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>'; else num.textContent = s;
    });
    updateProgress();
    $('apply-form').scrollIntoView({ behavior: 'smooth', block: 'start' });
    var firstInput = qs('.form-step.active .field-input, .form-step.active .field-textarea');
    if (firstInput && window.innerWidth > 820 && !firstInput.value) setTimeout(function () { firstInput.focus({ preventScroll: true }); }, 350);
  }

  /* ---------- review ---------- */
  function esc(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function renderReview() {
    var sections = [
      { t: '대표자 정보', step: 1, keys: ['founderNameKr', 'founderNameEn', 'phone', 'email', 'linkedin'] },
      { t: '기업 정보', step: 2, keys: ['companyName', 'website', 'oneLiner', 'industry', 'productStage', 'businessModel', 'deckUrl'] },
      { t: '심층 질문', step: 3, keys: ['targetProblem', 'targetCustomer', 'whyUS', 'referral'] }
    ];
    var html = sections.map(function (sec) {
      return '<div class="review-card"><div class="review-head"><h3>' + sec.t + '</h3><button type="button" class="review-edit" data-step="' + sec.step + '">수정</button></div>' +
        sec.keys.map(function (k) {
          var v = val(k);
          if (k === 'industry' && v === '그외') v = val('industryOtherText') || '그외';
          if (k === 'businessModel' && v === '그외') v = val('bmOtherText') || '그외';
          return '<div class="review-row"><div class="review-k">' + LABELS[k] + '</div><div class="review-v' + (v ? '' : ' empty') + '">' + (v ? esc(v) : '입력 안 함') + '</div></div>';
        }).join('') + '</div>';
    }).join('');
    $('reviewArea').innerHTML = html;
    qsa('.review-edit', $('reviewArea')).forEach(function (b) { b.addEventListener('click', function () { goToStep(+b.dataset.step); }); });
  }

  /* ---------- draft ---------- */
  function collect() { var d = {}; FIELDS.forEach(function (f) { d[f] = val(f); }); return d; }
  function saveDraft(immediate) {
    if (editToken) return;
    clearTimeout(saveTimer);
    var run = function () {
      var d = collect(); var any = Object.keys(d).some(function (k) { return d[k]; });
      if (!any) return;
      try { localStorage.setItem(CONFIG.draftKey, JSON.stringify({ data: d, step: currentStep, savedAt: Date.now() })); } catch (e) { }
      var a = $('autosave' + currentStep); if (a) { a.classList.add('show'); clearTimeout(a._h); a._h = setTimeout(function () { a.classList.remove('show'); }, 1800); }
    };
    if (immediate) run(); else saveTimer = setTimeout(run, 600);
  }
  function loadDraft() { try { return JSON.parse(localStorage.getItem(CONFIG.draftKey) || 'null'); } catch (e) { return null; } }
  function applyData(d) {
    FIELDS.forEach(function (f) { if (d[f] !== undefined) setVal(f, d[f]); });
    syncChips('industryChips', 'industry', 'industryOther'); syncChips('bmChips', 'businessModel', 'bmOther');
    qsa('.field-input, .field-textarea', form).forEach(markField); updateCounters(); updateProgress();
  }
  function ago(ts) { var m = Math.round((Date.now() - ts) / 60000); if (m < 1) return '방금'; if (m < 60) return m + '분 전'; var h = Math.round(m / 60); if (h < 24) return h + '시간 전'; return Math.round(h / 24) + '일 전'; }
  window.resumeDraft = function () {
    var d = loadDraft(); if (!d) return;
    applyData(d.data); currentStep = Math.min(d.step || 1, 3); updateUI();
    $('resumeBanner').classList.remove('show'); toast('이어서 작성할게요');
  };
  window.discardDraft = function () { try { localStorage.removeItem(CONFIG.draftKey); } catch (e) { } $('resumeBanner').classList.remove('show'); };

  /* ---------- edit mode ---------- */
  function enterEditMode(token) {
    editToken = token;
    $('formContainer').style.display = 'none'; $('apply-form').style.display = 'none'; $('loadingState').classList.add('show');
    fetch(CONFIG.endpoint + '?token=' + encodeURIComponent(token)).then(function (r) { return r.json(); }).then(function (res) {
      $('loadingState').classList.remove('show');
      if (!res || !res.ok) { $('apply-form').style.display = ''; $('formContainer').style.display = ''; editToken = null; toast('수정 링크를 찾지 못했어요. 새로 작성해 주세요.'); return; }
      $('apply-form').style.display = ''; $('formContainer').style.display = '';
      applyData(res.data);
      $('editBanner').classList.add('show'); $('editMeta').textContent = (res.data.companyName || res.data.founderNameKr || '') + (res.updatedAt ? ' · 마지막 수정 ' + res.updatedAt : '');
      $('pageTitle').innerHTML = '지원서 <em>수정</em>'; $('pageSub').textContent = '바꾸고 싶은 부분만 고치고 저장하세요. 저장 즉시 반영돼요.';
      $('submitLabel').textContent = '수정 내용 저장'; qsa('.badges')[0].style.display = 'none';
      currentStep = 4; renderReview(); updateUI();
    }).catch(function () { $('loadingState').classList.remove('show'); $('apply-form').style.display = ''; $('formContainer').style.display = ''; editToken = null; toast('불러오기에 실패했어요. 네트워크를 확인해 주세요.'); });
  }

  /* ---------- submit ---------- */
  function onSubmit(e) {
    e.preventDefault();
    if (!validateStep(4)) return;
    for (var s = 1; s <= 3; s++) { if (!validateStep(s)) { goToStep(s); return; } }
    var btn = $('submitBtn'); btn.classList.add('btn-loading'); btn.disabled = true;
    var d = collect();
    var payload = {
      formType: editToken ? 'application_update' : 'application',
      token: editToken || undefined,
      founderNameKr: d.founderNameKr, founderNameEn: d.founderNameEn, phone: d.phone, email: d.email, linkedin: normUrl(d.linkedin),
      companyName: d.companyName, website: normUrl(d.website), oneLiner: d.oneLiner,
      industry: d.industry === '그외' ? (d.industryOtherText || '그외') : d.industry,
      deckUrl: normUrl(d.deckUrl), productStage: d.productStage,
      businessModel: d.businessModel === '그외' ? (d.bmOtherText || '그외') : d.businessModel,
      targetProblem: d.targetProblem, targetCustomer: d.targetCustomer, whyUS: d.whyUS, referral: d.referral, consent: 'YES',
      source: location.href
    };
    fetch(CONFIG.endpoint, { method: 'POST', body: JSON.stringify(payload) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res || !res.ok) throw new Error(res && res.error || 'bad response');
        var token = res.token || editToken;
        try { localStorage.removeItem(CONFIG.draftKey); if (token) localStorage.setItem(CONFIG.tokenKey, token); } catch (x) { }
        showSuccess(d, token, !!editToken);
      })
      .catch(function (err) {
        console.error(err);
        btn.classList.remove('btn-loading'); btn.disabled = false;
        toast('제출에 실패했어요. 잠시 후 다시 시도해 주세요.');
      });
  }
  function showSuccess(d, token, wasEdit) {
    $('formContainer').style.display = 'none'; $('apply-form').style.display = 'none'; $('editBanner').classList.remove('show'); $('resumeBanner').classList.remove('show');
    var name = d.founderNameKr || '대표님';
    var editUrl = location.origin + '/apply?edit=' + encodeURIComponent(token || '');
    if (wasEdit) {
      $('successTitle').textContent = '수정이 저장됐어요';
      $('successLead').innerHTML = '<b>' + esc(name) + '</b>님의 지원서가 최신 내용으로 반영됐어요.<br/>마감 전까지 같은 링크로 다시 수정할 수 있어요.';
      $('timeline').style.display = 'none';
    } else {
      $('successTitle').textContent = '지원 완료. ' + esc(name) + '님, 환영해요.';
      $('successLead').innerHTML = '<b>' + esc(d.email) + '</b>로 확인 메일을 보냈어요.<br/>' + (d.companyName ? '<b>' + esc(d.companyName) + '</b>의 이야기, 잘 읽을게요.' : '잘 읽을게요.');
    }
    $('editLink').href = editUrl;
    $('editNote').innerHTML = token
      ? '<b>지원서 수정 링크</b>가 메일에도 들어있어요. 이 페이지를 닫아도 링크로 언제든 돌아올 수 있어요.<br/><code>' + esc(editUrl) + '</code>'
      : '';
    $('successState').classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(confetti, 250);
  }

  /* ---------- misc UX ---------- */
  function onChange(e) { var t = e && e.target; if (t) markField(t); updateCounters(); updateProgress(); saveDraft(false); }
  function formatPhone(el) {
    var v = el.value.replace(/[^\d]/g, '');
    if (v.length >= 10 && v.indexOf('0') === 0) { v = v.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, '$1-$2-$3'); el.value = v; }
  }
  window.toggleHint = function (btn) { var body = btn.closest('.field-group').querySelector('.hint-body'); body.classList.toggle('show'); btn.textContent = body.classList.contains('show') ? '닫기' : '좋은 답의 기준'; };
  window.goToStep = goToStep; window.nextStep = function () { goToStep(currentStep + 1); }; window.prevStep = function () { goToStep(currentStep - 1); };

  /* ---------- init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    form = $('applicationForm');
    buildChips('industryChips', 'industry', INDUSTRIES, 'industryOther');
    buildChips('bmChips', 'businessModel', BMS, 'bmOther');

    var dl = daysLeft(); var b = $('deadlineBadge');
    if (dl > 0) b.textContent = '최종 마감 10.30 · D-' + dl; else if (dl === 0) b.textContent = '오늘 마감'; else b.textContent = '마감';

    form.addEventListener('input', onChange);
    form.addEventListener('change', onChange);
    form.addEventListener('submit', onSubmit);
    form.elements.phone.addEventListener('blur', function () { formatPhone(this); markField(this); });
    // Enter moves forward instead of submitting
    form.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || e.target.tagName === 'TEXTAREA' || e.target.type === 'submit' || e.target.type === 'checkbox') return;
      e.preventDefault();
      var inputs = qsa('.form-step.active .field-input', form).filter(function (i) { return i.offsetParent !== null; });
      var idx = inputs.indexOf(e.target);
      if (idx > -1 && idx < inputs.length - 1) inputs[idx + 1].focus(); else if (currentStep < 4) goToStep(currentStep + 1);
    });
    document.addEventListener('input', function (e) {
      if (e.target.classList && e.target.classList.contains('error')) { e.target.classList.remove('error'); var err = e.target.closest('.field-group') && e.target.closest('.field-group').querySelector('.field-error-msg'); if (err) err.style.display = 'none'; }
      if (e.target.id === 'consent') { $('consentBox').classList.remove('error'); $('consentError').style.display = 'none'; }
    });
    window.addEventListener('resize', function () { var c = $('confetti'); if (c) { c.width = window.innerWidth; c.height = window.innerHeight; } });

    var editParam = new URLSearchParams(location.search).get('edit');
    if (editParam) { enterEditMode(editParam); return; }

    var draft = loadDraft();
    if (draft && draft.data && Object.keys(draft.data).some(function (k) { return draft.data[k]; })) {
      $('resumeMeta').textContent = (draft.data.companyName ? draft.data.companyName + ' · ' : '') + '마지막 저장 ' + ago(draft.savedAt);
      $('resumeBanner').classList.add('show');
    }
    updateProgress();
  });
})();
