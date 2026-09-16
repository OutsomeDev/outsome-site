/* Outsome Founder Sprint — /ko/apply (v4)
   Single-page application form (YC form factor) with Apple-style motion.
   Keeps the v3 data contract: same endpoint, same field names, same GA4 event names. */
(function () {
  'use strict';

  var CONFIG = {
    endpoint: 'https://script.google.com/macros/s/AKfycbwdCFqeK0OXNwu7YkeM-nzoP7TbW7gzYJUw3SN0-GUgj8-ovdEIwV9vjp4O0ULMMLZZ/exec',
    deadline: '2026-10-30',
    draftKey: 'outsome_fs8_apply_draft',
    tokenKey: 'outsome_fs8_apply_token',
    maxIndustries: 3,
    /* Peter's post links under each question. Off by default — the form reads as a
       document, not a content feed. Flip to true to show them again. */
    showRefs: false
  };

  var INDUSTRIES = ['AI','핀테크','헬스케어','의료','바이오 테크','Dev 툴','보안','하드웨어','블록체인','AR/VR','에듀테크/교육','커뮤니티','미디어','엔터테인먼트','게임','E-Sports','라이프스타일','뷰티','패션','식음료','웰니스/핏니스','펫 푸드/테크','관광/레저','스마트시티','농업','ESG/환경/에너지','오픈소스','그외'];
  var BMS = ['B2B SaaS','B2B 구독서비스','B2C 구독서비스','B2B2C 마켓플레이스','온라인 판매','API','광고모델','수수료 모델','B2G','프로젝트 계약/에이전시','Brokerage/중개업','유통','프랜차이즈','라이센싱','제조','그외'];
  var STAGES = ['아이디어 단계','프로토타입 / 목업','MVP 개발 중','MVP 완성, 런칭 전','베타 테스트 중','정식 런칭, 매출 전','유료 고객 확보','월 매출 발생 중','투자 유치 완료'];
  var REFERRALS = ['피터 LinkedIn','Outsome LinkedIn','Outsome Instagram','Outsome Threads','Outsome YouTube','Outsome TikTok','피터 Brunch','피터 Disquiet','피터 Facebook','Naver 검색','Google 검색','Founder Sprint 알럼나이','지인 소개','기타'];
  var ALUMNI = 'Founder Sprint 알럼나이', FRIEND = '지인 소개', OTHER = '기타', ETC = '그외';

  /* Peter's posts, per question */
  var REFS = {
    oneLiner: [
      ['투자자에게 B2B SaaS라고 우릴 소개하면 안되는 이유', 'https://lnkd.in/gnZqx7w7'],
      ['똑같은 솔루션으로 마진 50배 높이는 방법', 'https://lnkd.in/giRKBCV2']
    ],
    productStage: [
      ['초기 스타트업이 투자를 미뤄야 하는 이유', 'https://lnkd.in/g_vsKqMh'],
      ['나만의 초기 스타트업 평가 기준 3가지', 'https://lnkd.in/gexXkzqz']
    ],
    businessModel: [
      ['우리 스타트업에 맞는 BM 도출하는 방법', 'https://lnkd.in/gBHRA2Hb'],
      ['스타트업 가격정책 5계명', 'https://lnkd.in/gWKFuTDB'],
      ['B2B 가격정책은 싯가입니다', 'https://lnkd.in/gBfm3iTz']
    ],
    targetProblem: [
      ['시장수요가 무조건 존재하는 프로덕트를 만드는 방법', 'https://lnkd.in/gbavJsgD'],
      ['프로덕트 없이 시장수요 10배 더 효과적으로 확인하는 법', 'https://lnkd.in/gdvWh4k2'],
      ['우리에게 건강한 POC가 따로 있다', 'https://lnkd.in/gS8T5_8m']
    ],
    targetCustomer: [
      ['고객이 우리에게 무조건 지불하게 해야 하는 3가지', 'https://lnkd.in/g9sexhgp'],
      ['SKY, 삼성 아니어도 100% 답장 받는 콜드메일', 'https://lnkd.in/gFXNcmGr'],
      ['스타트업이 처음부터 매출을 발생시켜야 하는 4가지 이유', 'https://lnkd.in/giNtzQ5b']
    ],
    whyUS: [
      ['한국에서 실패한 파운더가 실리콘밸리에서 성공할거라 믿는 이유', 'https://lnkd.in/gF6GCQvq'],
      ['한국에서 플랫폼 사업이 어려운 이유', 'https://lnkd.in/gXa8X_V4'],
      ['비미국 해외파 출신 파운더들이 강한 이유', 'https://lnkd.in/gkEpatnq'],
      ['한국인 파운더가 참고해야 하는 한국의 특성', 'https://lnkd.in/gCUGVtna']
    ]
  };

  var FIELDS = ['founderNameKr','founderNameEn','phone','email','linkedin','companyName','website','oneLiner','industry','industryOtherText','productStage','stageDetail','businessModel','bmOtherText','deckUrl','targetProblem','targetCustomer','whyUS','referral','referralAlumniName','referralFriendName','referralOtherText'];

  var SECTIONS = [
    { id: 'founder',  title: '대표자',       fields: ['founderNameKr','founderNameEn','phone','email','linkedin'] },
    { id: 'company',  title: '기업',         fields: ['companyName','website','oneLiner','industry','businessModel','deckUrl'] },
    { id: 'progress', title: '진행 상황',    fields: ['productStage'] },
    { id: 'idea',     title: '아이디어',     fields: ['targetProblem','targetCustomer','whyUS'] },
    { id: 'curious',  title: '알게 된 경로', fields: ['referral'] },
    { id: 'submit',   title: '제출',         fields: ['consent'] }
  ];
  var TOTAL_Q = SECTIONS.reduce(function (n, s) { return n + s.fields.length; }, 0);

  var LABELS = {
    founderNameKr:'한글 이름', founderNameEn:'영문 이름', phone:'연락처', email:'이메일', linkedin:'LinkedIn',
    companyName:'기업명', website:'웹사이트', oneLiner:'한 문장 설명', industry:'분야', productStage:'현재 단계',
    businessModel:'비즈니스 모델', deckUrl:'IR 덱', targetProblem:'푸는 문제', targetCustomer:'고객', whyUS:'왜 미국인가', referral:'알게 된 경로'
  };

  var form, editToken = null, saveTimer = null, startedTracked = false, activeSec = 'founder';

  /* ---------- helpers ---------- */
  function $(id) { return document.getElementById(id); }
  function qs(s, el) { return (el || document).querySelector(s); }
  function qsa(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function track(name, params) { try { if (typeof gtag === 'function') gtag('event', name, params || {}); } catch (e) { } }
  function val(name) { var el = form.elements[name]; return el ? (el.type === 'checkbox' ? (el.checked ? 'YES' : '') : String(el.value).trim()) : ''; }
  function setVal(name, v) { var el = form.elements[name]; if (!el) return; if (el.type === 'checkbox') el.checked = v === 'YES'; else el.value = v || ''; }
  function isEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); }
  function normUrl(v) { v = (v || '').trim(); if (!v) return ''; if (!/^https?:\/\//i.test(v)) v = 'https://' + v; return v; }
  function words(v) { v = (v || '').trim(); return v ? v.split(/\s+/).length : 0; }
  function daysLeft() { var d = new Date(CONFIG.deadline + 'T23:59:59+09:00'); return Math.ceil((d - new Date()) / 86400000); }
  function splitList(v) { return (v || '').split(/\s*,\s*/).filter(Boolean); }
  function esc(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function groupOf(el) { return el.closest('.fg') || el.closest('section'); }
  function errOf(el) { var g = groupOf(el); return g ? g.querySelector('.err') : null; }

  function toast(msg) {
    var t = $('toast');
    if (!t) { t = document.createElement('div'); t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(function () { t.classList.remove('show'); }, 2000);
  }

  /* ---------- chips ---------- */
  function chipGroup(opts) {
    var wrap = qs('.chips', $(opts.wrapId)), hidden = $(opts.hiddenId);
    function selected() { return splitList(hidden.value); }
    function setSelected(arr) {
      hidden.value = arr.join(', ');
      qsa('.chip', wrap).forEach(function (x) { x.classList.toggle('on', arr.indexOf(x.textContent) > -1); });
      if (opts.multi && opts.max) {
        var full = arr.length >= opts.max;
        qsa('.chip', wrap).forEach(function (x) { x.classList.toggle('dim', full && arr.indexOf(x.textContent) < 0); });
      }
      Object.keys(opts.reveals || {}).forEach(function (label) {
        var el = $(opts.reveals[label]), on = arr.indexOf(label) > -1;
        el.classList.toggle('show', on);
        if (!on) el.querySelector('input').value = '';
      });
      $(opts.wrapId).classList.remove('bad');
      var err = errOf($(opts.wrapId)); if (err) err.style.display = 'none';
      if (opts.onChange) opts.onChange(arr);
    }
    opts.list.forEach(function (label) {
      var b = document.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.textContent = label;
      b.addEventListener('click', function () {
        var cur = selected(), i = cur.indexOf(label);
        if (opts.multi) {
          if (i > -1) cur.splice(i, 1);
          else if (opts.max && cur.length >= opts.max) { toast('최대 ' + opts.max + '개'); return; }
          else cur.push(label);
        } else cur = [label];
        setSelected(cur);
        if (cur.indexOf(label) > -1) track('apply_select', { field: opts.hiddenId, value: label, section: activeSec });
        if (opts.reveals && opts.reveals[label] && cur.indexOf(label) > -1) setTimeout(function () { $(opts.reveals[label]).querySelector('input').focus(); }, 150);
        onChange();
      });
      wrap.appendChild(b);
    });
    return { sync: function () { setSelected(selected()); } };
  }
  var groups = {};

  function renderRefs() {
    if (!CONFIG.showRefs) { qsa('.refs[data-refs]').forEach(function (b) { b.remove(); }); return; }
    qsa('.refs[data-refs]').forEach(function (box) {
      var list = REFS[box.dataset.refs]; if (!list) return;
      box.innerHTML = '참고 ' + list.map(function (r) {
        return '<a href="' + r[1] + '" target="_blank" rel="noopener">' + esc(r[0]) + '</a>';
      }).join('<span class="sp">·</span>');
    });
  }

  /* ---------- progress / nav state ---------- */
  function filled(name) { return !!val(name); }
  function sectionDone(sec) { return sec.fields.every(filled); }
  function updateProgress() {
    var n = 0;
    SECTIONS.forEach(function (s) { s.fields.forEach(function (f) { if (filled(f)) n++; }); });
    var b = qs('b', $('barStatus')); if (b) b.textContent = n;
    SECTIONS.forEach(function (s) {
      var a = qs('#sectionNav a[data-sec="' + s.id + '"]');
      if (a) a.classList.toggle('done', sectionDone(s));
    });
  }

  function updateCounters() {
    qsa('textarea[data-words]', form).forEach(function (ta) {
      var lim = +ta.dataset.words, n = words(ta.value), el = $('wc-' + ta.name);
      if (!el) return;
      el.textContent = n + ' / ' + lim + ' 단어';
      el.classList.toggle('warn', n > lim);
    });
    var ol = form.elements.oneLiner, cc = $('cc-oneLiner');
    if (ol && cc) { cc.textContent = ol.value.length + ' / 30자'; cc.classList.toggle('warn', ol.value.length >= 30); }
  }

  /* ---------- validation ---------- */
  function validateAll(quiet) {
    var ok = true, first = null;
    qsa('[required]', form).forEach(function (input) {
      var v = input.type === 'checkbox' ? input.checked : String(input.value).trim();
      var bad = !v || (input.type === 'email' && !isEmail(input.value));
      if (!quiet) {
        if (input.type === 'hidden') {
          var wrap = groupOf(input).querySelector('.chips-wrap');
          if (wrap) wrap.classList.toggle('bad', bad);
        } else if (input.type === 'checkbox') {
          $('consentBox').classList.toggle('bad', bad);
          $('consentError').style.display = bad ? 'block' : 'none';
        } else {
          input.classList.toggle('bad', bad);
        }
        var err = errOf(input);
        if (err && input.type !== 'checkbox') err.style.display = bad ? 'block' : 'none';
      }
      if (bad) { ok = false; if (!first) first = input.type === 'hidden' ? groupOf(input) : input; }
    });
    if (!ok && !quiet) {
      track('apply_validation_error', { section: activeSec });
      if (first) {
        first.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (first.focus && first.tagName !== 'DIV') setTimeout(function () { first.focus({ preventScroll: true }); }, 320);
      }
    }
    return ok;
  }

  /* ---------- composed values ---------- */
  function composed() {
    var d = {};
    FIELDS.forEach(function (f) { d[f] = val(f); });
    var ind = splitList(d.industry).map(function (x) { return x === ETC ? (d.industryOtherText || ETC) : x; });
    var ref = splitList(d.referral).map(function (x) {
      if (x === ALUMNI) return ALUMNI + (d.referralAlumniName ? ' (' + d.referralAlumniName + ')' : '');
      if (x === FRIEND) return FRIEND + (d.referralFriendName ? ' (' + d.referralFriendName + ')' : '');
      if (x === OTHER) return OTHER + (d.referralOtherText ? ' (' + d.referralOtherText + ')' : '');
      return x;
    });
    return {
      founderNameKr: d.founderNameKr, founderNameEn: d.founderNameEn, phone: d.phone, email: d.email, linkedin: normUrl(d.linkedin),
      companyName: d.companyName, website: normUrl(d.website), oneLiner: d.oneLiner,
      industry: ind.join(', '),
      deckUrl: normUrl(d.deckUrl),
      productStage: d.productStage + (d.stageDetail ? ', ' + d.stageDetail : ''),
      businessModel: d.businessModel === ETC ? (d.bmOtherText || ETC) : d.businessModel,
      targetProblem: d.targetProblem, targetCustomer: d.targetCustomer, whyUS: d.whyUS,
      referral: ref.join(', '), consent: 'YES'
    };
  }
  function decompose(data) {
    var d = {};
    FIELDS.forEach(function (f) { d[f] = data[f] || ''; });
    var inds = splitList(data.industry), known = [], other = '';
    inds.forEach(function (x) { if (INDUSTRIES.indexOf(x) > -1 && x !== ETC) known.push(x); else other = x; });
    if (other) { known.push(ETC); d.industryOtherText = other === ETC ? '' : other; }
    d.industry = known.slice(0, CONFIG.maxIndustries).join(', ');
    var ps = (data.productStage || '').split(', ');
    d.productStage = STAGES.indexOf(ps[0]) > -1 ? ps[0] : '';
    d.stageDetail = STAGES.indexOf(ps[0]) > -1 ? ps.slice(1).join(', ') : (data.productStage || '');
    if (data.businessModel && BMS.indexOf(data.businessModel) < 0) { d.businessModel = ETC; d.bmOtherText = data.businessModel; }
    var refs = splitList(data.referral), rk = [];
    refs.forEach(function (x) {
      var m = x.match(/^(.*?)\s*\((.*)\)$/), base = m ? m[1] : x, extra = m ? m[2] : '';
      if (base === ALUMNI) { rk.push(ALUMNI); d.referralAlumniName = extra; }
      else if (base === FRIEND) { rk.push(FRIEND); d.referralFriendName = extra; }
      else if (base === OTHER) { rk.push(OTHER); d.referralOtherText = extra; }
      else if (REFERRALS.indexOf(base) > -1) rk.push(base);
      else { if (rk.indexOf(OTHER) < 0) rk.push(OTHER); d.referralOtherText = x; }
    });
    d.referral = rk.join(', ');
    return d;
  }

  /* ---------- review ---------- */
  function renderReview() {
    var c = composed();
    var secs = [
      { t: '대표자', id: 'founder', keys: ['founderNameKr', 'founderNameEn', 'phone', 'email', 'linkedin'] },
      { t: '기업', id: 'company', keys: ['companyName', 'website', 'oneLiner', 'industry', 'businessModel', 'deckUrl'] },
      { t: '진행 상황', id: 'progress', keys: ['productStage'] },
      { t: '아이디어', id: 'idea', keys: ['targetProblem', 'targetCustomer', 'whyUS'] },
      { t: '알게 된 경로', id: 'curious', keys: ['referral'] }
    ];
    $('reviewArea').innerHTML = secs.map(function (sec) {
      return '<div class="rev-h"><h3>' + sec.t + '</h3><a href="#sec-' + sec.id + '">수정</a></div><div class="rev">' +
        sec.keys.map(function (k) {
          var v = c[k];
          return '<div class="rev-row"><div class="rev-k">' + LABELS[k] + '</div><div class="rev-v' + (v ? '' : ' empty') + '">' + (v ? esc(v) : '입력 안 함') + '</div></div>';
        }).join('') + '</div>';
    }).join('');
  }

  /* ---------- draft ---------- */
  function collectRaw() { var d = {}; FIELDS.forEach(function (f) { d[f] = val(f); }); return d; }
  function flashSaved() {
    var s = $('saveState'); if (!s) return;
    s.classList.add('show'); clearTimeout(s._h);
    s._h = setTimeout(function () { s.classList.remove('show'); }, 1800);
  }
  function saveDraft(immediate) {
    if (editToken) return;
    clearTimeout(saveTimer);
    var run = function () {
      var d = collectRaw();
      if (!Object.keys(d).some(function (k) { return d[k]; })) return;
      try { localStorage.setItem(CONFIG.draftKey, JSON.stringify({ data: d, savedAt: Date.now() })); } catch (e) { }
      flashSaved();
    };
    if (immediate) run(); else saveTimer = setTimeout(run, 600);
  }
  function loadDraft() { try { return JSON.parse(localStorage.getItem(CONFIG.draftKey) || 'null'); } catch (e) { return null; } }
  function applyRaw(d) {
    FIELDS.forEach(function (f) { if (d[f] !== undefined) setVal(f, d[f]); });
    Object.keys(groups).forEach(function (k) { groups[k].sync(); });
    updateCounters(); updateProgress(); renderReview();
  }
  function ago(ts) {
    var m = Math.round((Date.now() - ts) / 60000);
    if (m < 1) return '방금';
    if (m < 60) return m + '분 전';
    var h = Math.round(m / 60);
    if (h < 24) return h + '시간 전';
    return Math.round(h / 24) + '일 전';
  }
  window.resumeDraft = function () {
    var d = loadDraft(); if (!d) return;
    track('apply_draft_resume', {});
    applyRaw(d.data);
    $('resumeBanner').classList.remove('show');
  };
  window.discardDraft = function () {
    track('apply_draft_discard', {});
    try { localStorage.removeItem(CONFIG.draftKey); } catch (e) { }
    $('resumeBanner').classList.remove('show');
  };

  /* ---------- edit mode ---------- */
  function enterEditMode(token) {
    editToken = token;
    $('formContainer').style.display = 'none';
    $('loadingState').classList.add('show');
    fetch(CONFIG.endpoint + '?token=' + encodeURIComponent(token))
      .then(function (r) { return r.json(); })
      .then(function (res) {
        $('loadingState').classList.remove('show');
        $('formContainer').style.display = '';
        if (!res || !res.ok) { editToken = null; toast('수정 링크를 찾을 수 없습니다.'); return; }
        track('apply_edit_open', {});
        applyRaw(decompose(res.data));
        $('editBanner').classList.add('show');
        $('editMeta').textContent = (res.data.companyName || res.data.founderNameKr || '') + (res.updatedAt ? ' · 마지막 수정 ' + res.updatedAt : '');
        $('pageTitle').textContent = '지원서 수정';
        $('pageSub').textContent = '마감 10월 30일까지 수정할 수 있습니다.';
        $('submitLabel').textContent = '수정 내용 저장';
      })
      .catch(function () {
        $('loadingState').classList.remove('show');
        $('formContainer').style.display = '';
        editToken = null;
        toast('불러오지 못했습니다. 네트워크를 확인해 주십시오.');
      });
  }

  /* ---------- submit ---------- */
  function onSubmit(e) {
    e.preventDefault();
    if (!validateAll()) return;
    var btn = $('submitBtn');
    btn.classList.add('loading'); btn.disabled = true;
    var c = composed();
    track(editToken ? 'apply_edit_save_attempt' : 'apply_submit_attempt', {});
    var payload = Object.assign({ formType: editToken ? 'application_update' : 'application', token: editToken || undefined, source: location.href }, c);
    fetch(CONFIG.endpoint, { method: 'POST', body: JSON.stringify(payload) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res || !res.ok) throw new Error(res && res.error || 'bad response');
        var token = res.token || editToken;
        track(editToken ? 'apply_edit_save' : 'apply_submit_success', {
          industry: c.industry, stage: (c.productStage || '').split(',')[0], business_model: c.businessModel,
          referral: c.referral, has_deck: c.deckUrl ? 'yes' : 'no', has_website: c.website ? 'yes' : 'no'
        });
        try { localStorage.removeItem(CONFIG.draftKey); if (token) localStorage.setItem(CONFIG.tokenKey, token); } catch (x) { }
        showSuccess(c, token, !!editToken);
      })
      .catch(function (err) {
        console.error(err);
        track('apply_submit_error', { message: String(err && err.message || err).slice(0, 80) });
        btn.classList.remove('loading'); btn.disabled = false;
        toast('제출에 실패했습니다. 다시 시도해 주십시오.');
      });
  }

  function showSuccess(d, token, wasEdit) {
    $('formContainer').style.display = 'none';
    qs('.ap-head').style.display = 'none';
    $('actionBar').style.display = 'none';
    $('editBanner').classList.remove('show');
    $('resumeBanner').classList.remove('show');
    var name = d.founderNameKr || '대표님';
    var editUrl = location.origin + '/ko/apply?edit=' + encodeURIComponent(token || '');
    if (wasEdit) {
      $('successTitle').textContent = '수정이 저장됐습니다';
      $('successLead').textContent = '마감일인 10월 30일까지 같은 링크로 다시 수정할 수 있습니다.';
      $('timeline').style.display = 'none';
    } else {
      $('successTitle').textContent = '지원서가 접수됐습니다';
      $('successLead').innerHTML = '확인 메일을 <b>' + esc(d.email) + '</b>로 보냈습니다.';
    }
    $('editLink').href = editUrl;
    $('editNote').innerHTML = token ? '아래 링크로 마감일인 10월 30일까지 지원서를 수정할 수 있습니다. 같은 링크를 확인 메일로도 보냈습니다.<br/><code>' + esc(editUrl) + '</code>' : '';
    $('successState').classList.add('show');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /* ---------- change handling ---------- */
  function onChange(e) {
    if (!startedTracked && !editToken) { startedTracked = true; track('apply_start', {}); }
    var t = e && e.target;
    if (t && t.classList && (t.classList.contains('inp') || t.classList.contains('txt'))) {
      if (t.classList.contains('bad') && String(t.value).trim()) {
        t.classList.remove('bad');
        var err = errOf(t); if (err) err.style.display = 'none';
      }
    }
    updateCounters(); updateProgress(); renderReview(); saveDraft(false);
  }
  function formatPhone(el) {
    var v = el.value.replace(/[^\d]/g, '');
    if (v.length >= 10 && v.indexOf('0') === 0) el.value = v.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, '$1-$2-$3');
  }


  /* ---------- section nav: scroll spy + reveal ---------- */
  function setupObservers() {
    var secEls = qsa('.ap-sec');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduce) secEls.forEach(function (el) { el.classList.add('in'); });
    else {
      var reveal = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); reveal.unobserve(en.target); } });
      }, { rootMargin: '0px 0px -8% 0px', threshold: .06 });
      secEls.forEach(function (el) { reveal.observe(el); });
      setTimeout(function () { var f = secEls[0]; if (f) f.classList.add('in'); }, 40);
    }

    var firstNav = qs('#sectionNav a');
    if (firstNav) firstNav.classList.add('on');

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var id = en.target.dataset.sec;
        if (id === activeSec) return;
        activeSec = id;
        qsa('#sectionNav a').forEach(function (a) { a.classList.toggle('on', a.dataset.sec === id); });
        track('apply_section_view', { section: id });
      });
    }, { rootMargin: '-20% 0px -66% 0px', threshold: 0 });
    secEls.forEach(function (el) { spy.observe(el); });
  }

  /* ---------- init ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    form = $('applicationForm');

    var indReveal = {}; indReveal[ETC] = 'industryOther';
    var bmReveal = {}; bmReveal[ETC] = 'bmOther';
    var refReveal = {}; refReveal[ALUMNI] = 'referralAlumni'; refReveal[FRIEND] = 'referralFriend'; refReveal[OTHER] = 'referralOther';

    groups.industry = chipGroup({
      wrapId: 'industryChips', hiddenId: 'industry', list: INDUSTRIES, multi: true, max: CONFIG.maxIndustries, reveals: indReveal,
      onChange: function (arr) {
        $('industryNote').textContent = arr.length ? arr.length + ' / ' + CONFIG.maxIndustries : '';
      }
    });
    groups.stage = chipGroup({ wrapId: 'stageChips', hiddenId: 'productStage', list: STAGES });
    groups.bm = chipGroup({ wrapId: 'bmChips', hiddenId: 'businessModel', list: BMS, reveals: bmReveal });
    groups.referral = chipGroup({ wrapId: 'referralChips', hiddenId: 'referral', list: REFERRALS, multi: true, reveals: refReveal });

    renderRefs();
    renderReview();

    form.addEventListener('input', onChange);
    form.addEventListener('change', onChange);
    form.addEventListener('submit', onSubmit);
    form.elements.phone.addEventListener('blur', function () { formatPhone(this); });

    form.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || e.target.tagName === 'TEXTAREA' || e.target.type === 'submit' || e.target.type === 'checkbox' || e.target.classList.contains('chip')) return;
      e.preventDefault();
      var inputs = qsa('.inp', form).filter(function (i) { return i.offsetParent !== null; });
      var idx = inputs.indexOf(e.target);
      if (idx > -1 && idx < inputs.length - 1) inputs[idx + 1].focus();
    });

    $('consent').addEventListener('change', function () {
      $('consentBox').classList.toggle('checked', this.checked);
      if (this.checked) { $('consentBox').classList.remove('bad'); $('consentError').style.display = 'none'; }
    });

    document.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('.refs a');
      if (a) track('apply_ref_click', { title: a.textContent.trim().slice(0, 60), field: (a.closest('.refs') || { dataset: {} }).dataset.refs || '' });
    });

    setupObservers();
    updateProgress();

    var editParam = new URLSearchParams(location.search).get('edit');
    if (editParam) { enterEditMode(editParam); return; }

    var draft = loadDraft();
    if (draft && draft.data && Object.keys(draft.data).some(function (k) { return draft.data[k]; })) {
      $('resumeMeta').textContent = (draft.data.companyName ? draft.data.companyName + ' · ' : '') + ago(draft.savedAt) + ' 저장';
      $('resumeBanner').classList.add('show');
    }
  });
})();
