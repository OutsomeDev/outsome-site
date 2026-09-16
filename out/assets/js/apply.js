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
    /* Peter's post links under each question, separated from the question by a rule. */
    showRefs: true
  };

  var INDUSTRIES = ['AI','Fintech','Healthcare','Medical','Biotech','Dev Tools','Security','Hardware','Blockchain','AR/VR','Edtech','Community','Media','Entertainment','Gaming','E-Sports','Lifestyle','Beauty','Fashion','Food & Beverage','Wellness & Fitness','Pet','Travel & Leisure','Smart City','Agriculture','Climate & Energy','Open Source','Other'];
  var BMS = ['B2B SaaS','B2B Subscription','B2C Subscription','B2B2C Marketplace','E-commerce','API','Advertising','Transaction Fee','B2G','Services / Agency','Brokerage','Distribution','Franchise','Licensing','Manufacturing','Other'];
  /* submissions made before 2026-09-16 stored these values in Korean — map them
     back to the English options when an applicant opens their edit link */
  var LEGACY = {
    '핀테크':'Fintech','헬스케어':'Healthcare','의료':'Medical','바이오 테크':'Biotech','Dev 툴':'Dev Tools',
    '보안':'Security','하드웨어':'Hardware','블록체인':'Blockchain','에듀테크/교육':'Edtech','커뮤니티':'Community',
    '미디어':'Media','엔터테인먼트':'Entertainment','게임':'Gaming','라이프스타일':'Lifestyle','뷰티':'Beauty',
    '패션':'Fashion','식음료':'Food & Beverage','웰니스/핏니스':'Wellness & Fitness','펫 푸드/테크':'Pet',
    '관광/레저':'Travel & Leisure','스마트시티':'Smart City','농업':'Agriculture','ESG/환경/에너지':'Climate & Energy',
    '오픈소스':'Open Source','그외':'Other',
    'B2B 구독서비스':'B2B Subscription','B2C 구독서비스':'B2C Subscription','B2B2C 마켓플레이스':'B2B2C Marketplace',
    '온라인 판매':'E-commerce','광고모델':'Advertising','수수료 모델':'Transaction Fee',
    '프로젝트 계약/에이전시':'Services / Agency','Brokerage/중개업':'Brokerage','유통':'Distribution',
    '프랜차이즈':'Franchise','라이센싱':'Licensing','제조':'Manufacturing'
  };
  function unlegacy(v) { return LEGACY[v] || v; }

  var STAGES = ['아이디어 단계','프로토타입 / 목업','MVP 개발 중','MVP 완성, 런칭 전','베타 테스트 중','정식 런칭, 매출 전','유료 고객 확보','월 매출 발생 중','투자 유치 완료'];
  var REFERRALS = ['피터 LinkedIn','Outsome LinkedIn','Outsome Instagram','Outsome Threads','Outsome YouTube','Outsome TikTok','피터 Brunch','피터 Disquiet','피터 Facebook','Naver 검색','Google 검색','Founder Sprint 알럼나이','지인 소개','기타'];
  var ALUMNI = 'Founder Sprint 알럼나이', FRIEND = '지인 소개', OTHER = '기타', ETC = 'Other';
  /* referral options that get the rotating orange ring */
  var HIGHLIGHT = [ALUMNI, FRIEND];

  /* Peter's posts, per question */
  var REFS = {
    oneLiner: [
      ['투자자에게 B2B SaaS라고 우릴 소개하면 안되는 이유', 'https://lnkd.in/gnZqx7w7', "Why you shouldn't pitch yourself as B2B SaaS"],
      ['똑같은 솔루션으로 마진 50배 높이는 방법', 'https://lnkd.in/giRKBCV2', 'How to 50x your margin with the same product']
    ],
    productStage: [
      ['초기 스타트업이 투자를 미뤄야 하는 이유', 'https://lnkd.in/g_vsKqMh', 'Why early startups should delay fundraising'],
      ['나만의 초기 스타트업 평가 기준 3가지', 'https://lnkd.in/gexXkzqz', 'The 3 things I look at in an early startup']
    ],
    businessModel: [
      ['우리 스타트업에 맞는 BM 도출하는 방법', 'https://lnkd.in/gBHRA2Hb', 'How to find the business model that fits you'],
      ['스타트업 가격정책 5계명', 'https://lnkd.in/gWKFuTDB', '5 rules for startup pricing'],
      ['B2B 가격정책은 싯가입니다', 'https://lnkd.in/gBfm3iTz', 'B2B pricing is a market price']
    ],
    targetProblem: [
      ['시장수요가 무조건 존재하는 프로덕트를 만드는 방법', 'https://lnkd.in/gbavJsgD', 'How to build a product demand already exists for'],
      ['프로덕트 없이 시장수요 10배 더 효과적으로 확인하는 법', 'https://lnkd.in/gdvWh4k2', 'Validate demand 10x better without a product'],
      ['우리에게 건강한 POC가 따로 있다', 'https://lnkd.in/gS8T5_8m', 'What a healthy POC actually looks like']
    ],
    targetCustomer: [
      ['고객이 우리에게 무조건 지불하게 해야 하는 3가지', 'https://lnkd.in/g9sexhgp', '3 things that make customers pay you, always'],
      ['SKY, 삼성 아니어도 100% 답장 받는 콜드메일', 'https://lnkd.in/gFXNcmGr', 'Cold emails that get replies without a big name'],
      ['스타트업이 처음부터 매출을 발생시켜야 하는 4가지 이유', 'https://lnkd.in/giNtzQ5b', '4 reasons to make revenue from day one']
    ],
    whyUS: [
      ['한국에서 실패한 파운더가 실리콘밸리에서 성공할거라 믿는 이유', 'https://lnkd.in/gF6GCQvq', 'Why founders who failed in Korea can win in SV'],
      ['한국에서 플랫폼 사업이 어려운 이유', 'https://lnkd.in/gXa8X_V4', 'Why platform businesses are hard in Korea'],
      ['비미국 해외파 출신 파운더들이 강한 이유', 'https://lnkd.in/gkEpatnq', 'Why non-US international founders are strong'],
      ['한국인 파운더가 참고해야 하는 한국의 특성', 'https://lnkd.in/gCUGVtna', 'What Korean founders should know about Korea']
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

  var LABELS_EN = {
    founderNameKr:'Name (KR)', founderNameEn:'Name (EN)', phone:'Phone', email:'Email', linkedin:'LinkedIn',
    companyName:'Company', website:'Website', oneLiner:'One-liner', industry:'Industry', productStage:'Stage',
    businessModel:'Revenue model', deckUrl:'Deck', targetProblem:'Problem', targetCustomer:'Customer',
    whyUS:'Why the US', referral:'Referral'
  };
  function revKey(k) { return lang === 'ko' ? LABELS[k] : (LABELS_EN[k] || LABELS[k]); }
  function revVal(k, v) {
    if (lang === 'ko' || !v) return v;
    if (k === 'productStage') {
      var parts = String(v).split(', ');
      parts[0] = STAGE_LABELS[parts[0]] || parts[0];
      return parts.join(', ');
    }
    if (k === 'referral') {
      return String(v).split(', ').map(function (x) {
        var m = x.match(/^(.*?)\s*\((.*)\)$/), base = m ? m[1] : x, extra = m ? m[2] : '';
        var lb = REFERRAL_LABELS[base] || base;
        return extra ? lb + ' (' + extra + ')' : lb;
      }).join(', ');
    }
    return v;
  }

  var LABELS = {
    founderNameKr:'한글 이름', founderNameEn:'영문 이름', phone:'연락처', email:'이메일', linkedin:'LinkedIn',
    companyName:'기업명', website:'웹사이트', oneLiner:'한 문장 설명', industry:'분야', productStage:'현재 단계',
    businessModel:'비즈니스 모델', deckUrl:'IR 덱', targetProblem:'푸는 문제', targetCustomer:'고객', whyUS:'왜 미국인가', referral:'알게 된 경로'
  };


  /* ═══════════ i18n ═══════════
     English is the default. Chip *values* stay canonical (what lands in the
     spreadsheet); only their labels are translated. */
  /* the URL is the single source of truth: /apply = English, /ko/apply = Korean */
  var KO_PATH = '/ko/apply', EN_PATH = '/apply';
  function pathLang() { return /^\/ko(\/|$)/.test(location.pathname) ? 'ko' : 'en'; }
  function pathFor(l) { return l === 'ko' ? KO_PATH : EN_PATH; }
  var lang = pathLang();

  var STAGE_LABELS = {
    '아이디어 단계':'Idea stage','프로토타입 / 목업':'Prototype / mockup','MVP 개발 중':'Building MVP',
    'MVP 완성, 런칭 전':'MVP done, pre-launch','베타 테스트 중':'In beta','정식 런칭, 매출 전':'Launched, pre-revenue',
    '유료 고객 확보':'Paying customers','월 매출 발생 중':'Monthly revenue','투자 유치 완료':'Raised funding'
  };
  var REFERRAL_LABELS = {
    '피터 LinkedIn':"Peter's LinkedIn",'Outsome LinkedIn':'Outsome LinkedIn','Outsome Instagram':'Outsome Instagram',
    'Outsome Threads':'Outsome Threads','Outsome YouTube':'Outsome YouTube','Outsome TikTok':'Outsome TikTok',
    '피터 Brunch':"Peter's Brunch",'피터 Disquiet':"Peter's Disquiet",'피터 Facebook':"Peter's Facebook",
    'Naver 검색':'Naver search','Google 검색':'Google search','Founder Sprint 알럼나이':'Founder Sprint alumni',
    '지인 소개':'Referred by a friend','기타':'Other'
  };
  function chipLabel(hiddenId, value) {
    if (lang === 'ko') return value;
    if (hiddenId === 'productStage') return STAGE_LABELS[value] || value;
    if (hiddenId === 'referral') return REFERRAL_LABELS[value] || value;
    return value;
  }

  var T = {
    en: {
      'nav.saved':'Saved','nav.contact':'Contact','state.loading':'Loading',
      'banner.draft':'You have an application in progress.','banner.resume':'Continue','banner.discard':'Start over',
      'banner.editMode':'Edit mode',
      'rail.dates':'Nov 9 – Dec 4, 2026','rail.location':'Seoul','rail.cohort':'10 teams','rail.deadline':'Oct 30, 2026',
      'tag.optional':'(optional)',
      'q.nameKr':'Name (Korean)','q.nameEn':'Name (English)','q.phone':'Phone','q.email':'Email','q.linkedin':'LinkedIn',
      'q.companyName':'Company or team name','q.website':'Website',
      'q.oneLiner':'What does your company do? Please answer in 30 characters or less.',
      'q.industry':'Select your industry. Up to 3.','q.bm':'What is your revenue model?',
      'q.deck':'Link to your deck or company overview','q.stage':'How far along are you?',
      'q.problem':'What problem are you solving? Describe who has it, in what situation, and how they deal with it today.',
      'q.customer':'Who exactly are your customers? Name your first 10, and what they pay for today instead.',
      'q.whyUS':'Why will this work better in the US than in Korea? Give reasons beyond market size.',
      'q.referral':'How did you hear about Founder Sprint? Select all that apply.',
      'ph.industryOther':'Enter your industry','ph.bmOther':'Enter your business model',
      'ph.stageDetail':'e.g. 3 paying customers, 2M KRW MRR (optional)',
      'ph.alumni':'Alumni name / company','ph.friend':'Who referred you? Name / company','ph.other':'Please specify',
      'err.nameKr':'Please enter your name.','err.phone':'Please enter your phone number.',
      'err.email':'Please enter a valid email address.','err.linkedin':'Please enter your LinkedIn URL.',
      'err.companyName':'Please enter your company or team name.','err.oneLiner':'Please describe what your company does.',
      'err.industry':'Please select at least one industry.','err.bm':'Please select a business model.',
      'err.stage':'Please select your current stage.','err.answer':'Please write an answer.',
      'err.referral':'Please select at least one.','err.consent':'Please agree to the collection of personal information.',
      'consent.title':'I agree to the collection and use of my personal information.',
      'consent.body':'Purpose: reviewing this application and contacting you. Data: name, email, phone, LinkedIn, company details. Retention: one year after review, or deleted immediately on withdrawal of consent.',
      'consent.link':'Privacy policy',
      'sheet.title':'Review before submitting','sheet.titleEdit':'Review your changes',
      'sheet.note':'You can still edit your application until the deadline, Oct 30.',
      'btn.keepEditing':'Keep editing','btn.submit':'Submit','btn.save':'Save changes','btn.edit':'Edit','btn.home':'Home',
      'rev.edit':'Edit','rev.empty':'Not answered',
      'tl.received':'Received','tl.receivedNote':'Done','tl.review':'Application review','tl.reviewNote':'Rolling',
      'tl.interview':'Interview','tl.interviewNote':'Online or in person','tl.decision':'Decision','tl.decisionNote':'Nov 4',
      'foot.privacy':'Privacy policy','foot.contact':'Contact',
      'refs.label':"From Peter's writing",
      'success.title':'Your application has been received','success.titleEdit':'Your changes are saved',
      'success.leadEdit':'You can edit again with the same link until the deadline, Oct 30.',
      'toast.max':'Up to {n}','toast.submitFail':'Submission failed. Please try again.',
      'toast.loadFail':'Could not load. Please check your connection.','toast.linkFail':'We could not find that edit link.',
      'dday.closed':'Closed','count.chars':'{n} / 30 chars','count.words':'{n} / {lim} words',
      'meta.saved':'saved','ago.now':'just now','ago.min':'{n}m ago','ago.hour':'{n}h ago','ago.day':'{n}d ago',
      'edit.note':'Use the link below to edit your application until the deadline, Oct 30. We also emailed you the same link.',
      'edit.sub':'You can edit until the deadline, Oct 30.',
      'title.edit':'Edit Application','doc.title':'Apply | Outsome Founder Sprint'
    },
    ko: {
      'nav.saved':'저장됨','nav.contact':'문의','state.loading':'불러오는 중',
      'banner.draft':'작성 중인 지원서가 있습니다.','banner.resume':'이어서 작성','banner.discard':'새로 시작',
      'banner.editMode':'수정 모드',
      'rail.dates':'11월 9일 – 12월 4일','rail.location':'서울','rail.cohort':'10팀','rail.deadline':'10월 30일',
      'tag.optional':'(선택)',
      'q.nameKr':'한글 이름','q.nameEn':'영문 이름','q.phone':'연락처','q.email':'이메일','q.linkedin':'LinkedIn',
      'q.companyName':'기업명 또는 팀명','q.website':'웹사이트',
      'q.oneLiner':'무엇을 하는 회사입니까? 30자 이내로 작성해 주십시오.',
      'q.industry':'분야를 선택해 주십시오. 최대 3개.','q.bm':'수익 모델은 무엇입니까?',
      'q.deck':'IR 덱 또는 회사 소개서 링크','q.stage':'지금 어디까지 왔습니까?',
      'q.problem':'어떤 문제를 풀고 있습니까? 누가, 어떤 상황에서 겪는 문제인지, 지금은 그 문제를 어떻게 해결하고 있는지 작성해 주십시오.',
      'q.customer':'고객은 누구입니까? 첫 고객 10명이 누구인지, 그들이 지금 어떤 대안에 얼마를 쓰고 있는지 작성해 주십시오.',
      'q.whyUS':'한국이 아니라 미국에서 더 잘 될 이유는 무엇입니까? 시장 규모 외의 근거를 작성해 주십시오.',
      'q.referral':'Founder Sprint를 어떻게 알게 되셨습니까? 해당하는 것을 모두 선택해 주십시오.',
      'ph.industryOther':'분야 직접 입력','ph.bmOther':'비즈니스 모델 직접 입력',
      'ph.stageDetail':'예: 유료 고객 3곳, MRR 200만원 (선택)',
      'ph.alumni':'알럼나이 이름 / 회사','ph.friend':'소개해준 사람 이름 / 회사','ph.other':'직접 입력',
      'err.nameKr':'이름을 입력해 주십시오.','err.phone':'연락처를 입력해 주십시오.',
      'err.email':'올바른 이메일 주소를 입력해 주십시오.','err.linkedin':'LinkedIn 주소를 입력해 주십시오.',
      'err.companyName':'기업명 또는 팀명을 입력해 주십시오.','err.oneLiner':'한 문장 설명을 입력해 주십시오.',
      'err.industry':'분야를 하나 이상 선택해 주십시오.','err.bm':'비즈니스 모델을 선택해 주십시오.',
      'err.stage':'현재 단계를 선택해 주십시오.','err.answer':'답변을 입력해 주십시오.',
      'err.referral':'하나 이상 선택해 주십시오.','err.consent':'개인정보 수집에 동의해 주십시오.',
      'consent.title':'개인정보 수집 및 이용에 동의합니다.',
      'consent.body':'목적: 지원서 심사 및 연락. 항목: 이름, 이메일, 연락처, LinkedIn, 기업 정보. 보유: 심사 완료 후 1년 또는 동의 철회 시 파기.',
      'consent.link':'개인정보처리방침',
      'sheet.title':'제출 전 확인','sheet.titleEdit':'수정 내용 확인',
      'sheet.note':'제출 후에도 마감일인 10월 30일까지 수정할 수 있습니다.',
      'btn.keepEditing':'계속 작성','btn.submit':'제출','btn.save':'수정 내용 저장','btn.edit':'지원서 수정','btn.home':'홈으로',
      'rev.edit':'수정','rev.empty':'입력 안 함',
      'tl.received':'접수','tl.receivedNote':'완료','tl.review':'서류 검토','tl.reviewNote':'롤링 리뷰',
      'tl.interview':'인터뷰','tl.interviewNote':'온라인 또는 대면','tl.decision':'결과 통보','tl.decisionNote':'11월 4일',
      'foot.privacy':'개인정보처리방침','foot.contact':'문의',
      'refs.label':'Peter 글 참고',
      'success.title':'지원서가 접수됐습니다','success.titleEdit':'수정이 저장됐습니다',
      'success.leadEdit':'마감일인 10월 30일까지 같은 링크로 다시 수정할 수 있습니다.',
      'toast.max':'최대 {n}개','toast.submitFail':'제출에 실패했습니다. 다시 시도해 주십시오.',
      'toast.loadFail':'불러오지 못했습니다. 네트워크를 확인해 주십시오.','toast.linkFail':'수정 링크를 찾을 수 없습니다.',
      'dday.closed':'마감','count.chars':'{n} / 30자','count.words':'{n} / {lim} 단어',
      'meta.saved':'저장','ago.now':'방금','ago.min':'{n}분 전','ago.hour':'{n}시간 전','ago.day':'{n}일 전',
      'edit.note':'아래 링크로 마감일인 10월 30일까지 지원서를 수정할 수 있습니다. 같은 링크를 확인 메일로도 보냈습니다.',
      'edit.sub':'마감일인 10월 30일까지 수정할 수 있습니다.',
      'title.edit':'지원서 수정','doc.title':'지원서 | Outsome Founder Sprint'
    }
  };
  function t(key, vars) {
    var v = (T[lang] && T[lang][key]) || T.en[key] || key;
    if (vars) Object.keys(vars).forEach(function (k) { v = v.replace('{' + k + '}', vars[k]); });
    return v;
  }

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
  function deadlineAt() { return new Date(CONFIG.deadline + 'T23:59:59+09:00'); }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }
  /* live countdown under the Deadline row */
  function renderDday() {
    var el = $('dday'); if (!el) return;
    var diff = deadlineAt() - new Date();
    if (diff <= 0) { el.className = 'ap-dday past'; el.innerHTML = '<b>' + t('dday.closed') + '</b>'; return; }
    var days = Math.floor(diff / 86400000);
    var h = Math.floor(diff / 3600000) % 24, m = Math.floor(diff / 60000) % 60, s = Math.floor(diff / 1000) % 60;
    var clock = pad2(h) + ':' + pad2(m) + ':' + pad2(s);
    el.innerHTML = days > 0
      ? '<b>D-' + days + '</b><span class="clock">' + clock + '</span>'
      : '<b>D-DAY</b><span class="clock">' + clock + '</span>';
  }
  function splitList(v) { return (v || '').split(/\s*,\s*/).filter(Boolean); }
  function esc(s) { return String(s || '').replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function groupOf(el) { return el.closest('.fg') || el.closest('section'); }
  function errOf(el) { var g = groupOf(el); return g ? g.querySelector('.err') : null; }

  /* banners float above the page; the page makes room for them */
  function setBanner(id, on) {
    $(id).classList.toggle('show', !!on);
    var any = $('resumeBanner').classList.contains('show') || $('editBanner').classList.contains('show');
    document.body.classList.toggle('has-banner', any);
  }

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
      qsa('.chip', wrap).forEach(function (x) { x.classList.toggle('on', arr.indexOf(x.dataset.val) > -1); });
      if (opts.multi && opts.max) {
        var full = arr.length >= opts.max;
        qsa('.chip', wrap).forEach(function (x) { x.classList.toggle('dim', full && arr.indexOf(x.dataset.val) < 0); });
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
      b.type = 'button'; b.dataset.val = label; b.textContent = chipLabel(opts.hiddenId, label);
      b.className = 'chip' + (opts.hiddenId === 'referral' && HIGHLIGHT.indexOf(label) > -1 ? ' spin' : '');
      b.addEventListener('click', function () {
        var cur = selected(), i = cur.indexOf(label);
        if (opts.multi) {
          if (i > -1) cur.splice(i, 1);
          else if (opts.max && cur.length >= opts.max) { toast(t('toast.max', { n: opts.max })); return; }
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
      box.innerHTML = '<span class="rl">' + t('refs.label') + '</span>' + list.map(function (r) {
        return '<a href="' + r[1] + '" target="_blank" rel="noopener">' + esc(lang === 'ko' ? r[0] : (r[2] || r[0])) + '</a>';
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
      el.textContent = t('count.words', { n: n, lim: lim });
      el.classList.toggle('warn', n > lim);
    });
    var ol = form.elements.oneLiner, cc = $('cc-oneLiner');
    if (ol && cc) { cc.textContent = t('count.chars', { n: ol.value.length }); cc.classList.toggle('warn', ol.value.length >= 30); }
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
    var inds = splitList(data.industry).map(unlegacy), known = [], other = '';
    inds.forEach(function (x) { if (INDUSTRIES.indexOf(x) > -1 && x !== ETC) known.push(x); else other = x; });
    if (other) { known.push(ETC); d.industryOtherText = other === ETC ? '' : other; }
    d.industry = known.slice(0, CONFIG.maxIndustries).join(', ');
    var ps = (data.productStage || '').split(', ');
    d.productStage = STAGES.indexOf(ps[0]) > -1 ? ps[0] : '';
    d.stageDetail = STAGES.indexOf(ps[0]) > -1 ? ps.slice(1).join(', ') : (data.productStage || '');
    d.businessModel = unlegacy(d.businessModel);
    if (d.businessModel && BMS.indexOf(d.businessModel) < 0) { d.bmOtherText = d.businessModel; d.businessModel = ETC; }
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
      { t: 'Founder', id: 'founder', keys: ['founderNameKr', 'founderNameEn', 'phone', 'email', 'linkedin'] },
      { t: 'Company', id: 'company', keys: ['companyName', 'website', 'oneLiner', 'industry', 'businessModel', 'deckUrl'] },
      { t: 'Progress', id: 'progress', keys: ['productStage'] },
      { t: 'Idea', id: 'idea', keys: ['targetProblem', 'targetCustomer', 'whyUS'] },
      { t: 'Referral', id: 'curious', keys: ['referral'] }
    ];
    $('reviewArea').innerHTML = secs.map(function (sec) {
      return '<div class="rev-h"><h3>' + sec.t + '</h3><a data-goto="sec-' + sec.id + '">' + t('rev.edit') + '</a></div><div class="rev">' +
        sec.keys.map(function (k) {
          var v = c[k];
          return '<div class="rev-row"><div class="rev-k">' + revKey(k) + '</div><div class="rev-v' + (v ? '' : ' empty') + '">' + (v ? esc(revVal(k, v)) : t('rev.empty')) + '</div></div>';
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
    updateCounters(); updateProgress();
  }
  function ago(ts) {
    var m = Math.round((Date.now() - ts) / 60000);
    if (m < 1) return t('ago.now');
    if (m < 60) return t('ago.min', { n: m });
    var h = Math.round(m / 60);
    if (h < 24) return t('ago.hour', { n: h });
    return t('ago.day', { n: Math.round(h / 24) });
  }
  window.resumeDraft = function () {
    var d = loadDraft(); if (!d) return;
    track('apply_draft_resume', {});
    applyRaw(d.data);
    setBanner('resumeBanner', false);
  };
  window.discardDraft = function () {
    track('apply_draft_discard', {});
    try { localStorage.removeItem(CONFIG.draftKey); } catch (e) { }
    setBanner('resumeBanner', false);
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
        if (!res || !res.ok) { editToken = null; toast(t('toast.linkFail')); return; }
        track('apply_edit_open', {});
        applyRaw(decompose(res.data));
        setBanner('editBanner', true);
        $('editMeta').textContent = (res.data.companyName || res.data.founderNameKr || '') + (res.updatedAt ? ' · 마지막 수정 ' + res.updatedAt : '');
        $('pageTitle').textContent = t('title.edit');
        $('pageSub').textContent = t('edit.sub');
        $('submitLabel').textContent = t('btn.save');
      })
      .catch(function () {
        $('loadingState').classList.remove('show');
        $('formContainer').style.display = '';
        editToken = null;
        toast(t('toast.loadFail'));
      });
  }

  /* ---------- review sheet ---------- */
  function openSheet() {
    renderReview();
    $('sheetTitle').textContent = t(editToken ? 'sheet.titleEdit' : 'sheet.title');
    $('sheetSubmitLabel').textContent = t(editToken ? 'btn.save' : 'btn.submit');
    $('reviewSheet').classList.add('show');
    document.body.classList.add('locked');
    track('apply_review_open', {});
    setTimeout(function () { var s = qs('.sheet', $('reviewSheet')); if (s) s.focus({ preventScroll: true }); }, 60);
  }
  function closeSheet() {
    $('reviewSheet').classList.remove('show');
    document.body.classList.remove('locked');
  }

  /* ---------- submit ---------- */
  function onSubmit(e) {
    e.preventDefault();
    if (!validateAll()) return;
    openSheet();
  }

  function doSubmit() {
    var btn = $('sheetSubmit');
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
        toast(t('toast.submitFail'));
      });
  }

  function showSuccess(d, token, wasEdit) {
    closeSheet();
    $('formContainer').style.display = 'none';
    qs('.ap-head').style.display = 'none';
    $('actionBar').style.display = 'none';
    setBanner('editBanner', false);
    setBanner('resumeBanner', false);
    var name = d.founderNameKr || '대표님';
    var editUrl = location.origin + pathFor(lang) + '?edit=' + encodeURIComponent(token || '');
    if (wasEdit) {
      $('successTitle').textContent = t('success.titleEdit');
      $('successLead').textContent = t('success.leadEdit');
      $('timeline').style.display = 'none';
    } else {
      $('successTitle').textContent = t('success.title');
      $('successLead').innerHTML = lang === 'ko'
        ? '확인 메일을 <b>' + esc(d.email) + '</b>로 보냈습니다.'
        : 'We sent a confirmation email to <b>' + esc(d.email) + '</b>.';
    }
    $('editLink').href = editUrl;
    $('editNote').innerHTML = token ? t('edit.note') + '<br/><code>' + esc(editUrl) + '</code>' : '';
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
    updateCounters(); updateProgress(); saveDraft(false);
  }
  function formatPhone(el) {
    var v = el.value.replace(/[^\d]/g, '');
    if (v.length >= 10 && v.indexOf('0') === 0) el.value = v.replace(/^(\d{2,3})(\d{3,4})(\d{4})$/, '$1-$2-$3');
  }


  /* ---------- language ---------- */
  function wrapField(wrapId) {
    if (wrapId === 'stageChips') return 'productStage';
    if (wrapId === 'referralChips') return 'referral';
    if (wrapId === 'industryChips') return 'industry';
    if (wrapId === 'bmChips') return 'businessModel';
    return '';
  }
  function applyLang() {
    lang = pathLang();
    document.documentElement.setAttribute('lang', lang);
    document.title = t('doc.title');
    var can = $('canonicalLink');
    if (can) can.setAttribute('href', 'https://outsome.co' + pathFor(lang));

    qsa('[data-t]').forEach(function (el) { el.textContent = t(el.dataset.t); });
    qsa('[data-tp]').forEach(function (el) { el.placeholder = t(el.dataset.tp); });
    qsa('#langSwitch button').forEach(function (b) { b.classList.toggle('on', b.dataset.lang === lang); });
    qsa('.chip').forEach(function (c) {
      var wrap = c.closest('.chips-wrap');
      if (wrap && c.dataset.val) c.textContent = chipLabel(wrapField(wrap.id), c.dataset.val);
    });

    if (editToken) {
      $('pageTitle').textContent = t('title.edit');
      $('pageSub').textContent = t('edit.sub');
      $('submitLabel').textContent = t('btn.save');
    } else {
      $('submitLabel').textContent = t('btn.submit');
    }
    renderRefs();
    updateCounters();
    renderDday();
    if ($('reviewSheet').classList.contains('show')) {
      $('sheetTitle').textContent = t(editToken ? 'sheet.titleEdit' : 'sheet.title');
      $('sheetSubmitLabel').textContent = t(editToken ? 'btn.save' : 'btn.submit');
      renderReview();
    }
    if ($('resumeBanner').classList.contains('show')) {
      var draft = loadDraft();
      if (draft) $('resumeMeta').textContent = (draft.data.companyName ? draft.data.companyName + ' · ' : '') + ago(draft.savedAt) + ' ' + t('meta.saved');
    }
  }
  /* switching language = navigating; the draft rides along so nothing is lost */
  function switchLang(next) {
    if (next === lang) return;
    track('apply_lang', { lang: next });
    saveDraft(true);
    var qs = new URLSearchParams(location.search);
    if (!editToken && Object.keys(collectRaw()).some(function (k) { return collectRaw()[k]; })) qs.set('resume', '1');
    var q = qs.toString();
    location.href = pathFor(next) + (q ? '?' + q : '');
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

    qsa('#langSwitch button').forEach(function (b) {
      b.addEventListener('click', function () { switchLang(b.dataset.lang); });
    });
    applyLang();
    renderDday(); setInterval(renderDday, 1000);

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

    $('sheetSubmit').addEventListener('click', doSubmit);
    $('sheetClose').addEventListener('click', closeSheet);
    $('sheetEdit').addEventListener('click', closeSheet);
    $('reviewSheet').addEventListener('click', function (e) { if (e.target === this) closeSheet(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && $('reviewSheet').classList.contains('show')) closeSheet();
    });
    $('reviewArea').addEventListener('click', function (e) {
      var a = e.target.closest('a[data-goto]');
      if (!a) return;
      closeSheet();
      var sec = document.getElementById(a.dataset.goto);
      if (sec) setTimeout(function () { sec.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 80);
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
    if (draft && draft.data && new URLSearchParams(location.search).get('resume') === '1') {
      applyRaw(draft.data);
      var clean = new URLSearchParams(location.search); clean.delete('resume');
      history.replaceState(null, '', location.pathname + (clean.toString() ? '?' + clean : ''));
      return;
    }
    if (draft && draft.data && Object.keys(draft.data).some(function (k) { return draft.data[k]; })) {
      $('resumeMeta').textContent = (draft.data.companyName ? draft.data.companyName + ' · ' : '') + ago(draft.savedAt) + ' ' + t('meta.saved');
      setBanner('resumeBanner', true);
    }
  });
})();
