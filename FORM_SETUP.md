# Form → Google Sheets 연결 가이드

스프레드시트: https://docs.google.com/spreadsheets/d/1ke-AcuJK9LFV__UsMGvAwlak1YYpg-ETzWamj4jtdqY/edit
Apps Script 프로젝트: "Webflow Contact Us Forms" (script.google.com, peter@outsome.co)
웹 앱 URL: https://script.google.com/macros/s/AKfycbwdCFqeK0OXNwu7YkeM-nzoP7TbW7gzYJUw3SN0-GUgj8-ovdEIwV9vjp4O0ULMMLZZ/exec

## Sheets 구조
- 시트1 (index 0): Contact — Date, Name, Email, Phone, Message, Status
- Applications (index 1): Date | 17 fields (Founder KR/EN, Phone, Email, LinkedIn, Company, Website, One Liner, Industry, Deck URL, Product Stage, BM, Target Problem, Target Customer, Why US, Referral, Consent) | Edit Token | Updated At | Source
- 시트2 (index 2): Subscribers — Email, Source, Date

## 프론트엔드
- Contact/Subscribe: `out/assets/js/form-handler.js` (no-cors POST)
- Application: `out/apply.html` + `out/assets/js/apply.js`
  - 파일은 하나. `/apply` = 영문, `/ko/apply` = 한글 (vercel.json rewrite로 같은 파일 서빙)
  - 언어는 URL 경로로만 결정된다 (`apply.js`의 `pathLang()`). localStorage/쿼리파라미터 사용 안 함
  - POST formType `application` → 토큰 발급 + 확인 메일(MailApp, 수정 링크 포함) → 응답 `{ok, token}`
  - GET `?token=` → 지원서 JSON (수정 모드 프리필)
  - POST formType `application_update` + token → 해당 행 덮어쓰기, Updated At 기록
  - 작성 중 임시저장: localStorage `outsome_fs8_apply_draft`
  - v3 필드 규칙: Industry = 최대 3개 콤마 구분 / Product Stage = `단계 · 상세` / Referral = 복수 콤마 구분, 알럼나이·기타는 `(상세)` 괄호

## 코드 변경 후 배포
편집기에서 저장 → 배포 > 배포 관리 > 수정 > 버전: 새 버전 > 배포. (URL은 그대로 유지됨)
MailApp 등 새 권한이 추가되면 편집기에서 `authorizeScopes` 한 번 실행해 승인.

## Apps Script 코드 (Code.gs)
```javascript
var SS_ID = "1ke-AcuJK9LFV__UsMGvAwlak1YYpg-ETzWamj4jtdqY";
var APP_SHEET = "Applications";
var APP_FIELDS = ["founderNameKr","founderNameEn","phone","email","linkedin","companyName","website","oneLiner","industry","deckUrl","productStage","businessModel","targetProblem","targetCustomer","whyUS","referral","consent"];
// Applications columns: A Date | B..R = APP_FIELDS (17) | S Edit Token | T Updated At | U Source
var COL_TOKEN = 19, COL_UPDATED = 20, COL_SOURCE = 21;

function fmt(v) { return (v instanceof Date) ? Utilities.formatDate(v, "Asia/Seoul", "yyyy-MM-dd HH:mm") : (v == null ? "" : String(v)); }
function json(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function now() { return Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd HH:mm"); }
function today() { return Utilities.formatDate(new Date(), "Asia/Seoul", "yyyy-MM-dd"); }
function appSheet() { var ss = SpreadsheetApp.openById(SS_ID); return ss.getSheetByName(APP_SHEET) || ss.getSheets()[1]; }

function findRowByToken(sheet, token) {
  if (!token) return -1;
  var last = sheet.getLastRow(); if (last < 2) return -1;
  var col = sheet.getRange(2, COL_TOKEN, last - 1, 1).getValues();
  for (var i = 0; i < col.length; i++) if (String(col[i][0]) === String(token)) return i + 2;
  return -1;
}

function doGet(e) {
  var token = e && e.parameter && e.parameter.token;
  if (!token) return json({ ok: true, service: "outsome-forms" });
  var s = appSheet(), row = findRowByToken(s, token);
  if (row < 0) return json({ ok: false, error: "not_found" });
  var vals = s.getRange(row, 1, 1, COL_SOURCE).getValues()[0];
  var data = {};
  APP_FIELDS.forEach(function (k, i) { data[k] = vals[i + 1] == null ? "" : String(vals[i + 1]); });
  return json({ ok: true, data: data, submittedAt: fmt(vals[0]), updatedAt: fmt(vals[COL_UPDATED - 1]) });
}

function doPost(e) {
  var ss = SpreadsheetApp.openById(SS_ID);
  var data;
  try { data = JSON.parse(e.postData.contents); } catch (err) { return json({ ok: false, error: "bad_json" }); }

  if (data.formType === "contact") {
    ss.getSheets()[0].appendRow([today(), data.name, data.email, data.phone, data.message, "New"]);
    return json({ ok: true });
  }

  if (data.formType === "subscribe") {
    var s2 = ss.getSheetByName("시트2") || ss.getSheets()[2];
    s2.appendRow([data.email, data.source || "Website", today()]);
    return json({ ok: true });
  }

  if (data.formType === "application") {
    var s = appSheet();
    var token = Utilities.getUuid().replace(/-/g, "");
    var row = [today()].concat(APP_FIELDS.map(function (k) { return data[k] || ""; }));
    row[COL_TOKEN - 1] = token; row[COL_UPDATED - 1] = ""; row[COL_SOURCE - 1] = data.source || "";
    s.appendRow(row);
    try { sendConfirmation(data, token); } catch (err) { Logger.log("mail failed: " + err); }
    return json({ ok: true, token: token });
  }

  if (data.formType === "application_update") {
    var sa = appSheet(), r = findRowByToken(sa, data.token);
    if (r < 0) return json({ ok: false, error: "not_found" });
    var vals = APP_FIELDS.map(function (k) { return data[k] || ""; });
    sa.getRange(r, 2, 1, APP_FIELDS.length).setValues([vals]);
    sa.getRange(r, COL_UPDATED).setValue(now());
    return json({ ok: true, token: data.token });
  }

  return json({ ok: false, error: "unknown_form" });
}

function sendConfirmation(d, token) {
  if (!d.email) return;
  var editUrl = "https://outsome.co/apply?edit=" + token;
  var name = String(d.founderNameEn || d.founderNameKr || "").trim();
  var greeting = name ? "Hi " + name + "," : "Hi,";
  var subject = "Your Founder Sprint application";
  // Plain, first-person, YC-style. Sent as both text and minimal HTML.
  // Full source lives in the Apps Script project (Code.gs, deployment v9).
}

function authorizeScopes() {
  // Run once from the editor to grant Sheets + Mail scopes to the web app.
  Logger.log("mail quota: " + MailApp.getRemainingDailyQuota());
  Logger.log("sheet: " + SpreadsheetApp.openById(SS_ID).getName());
}

```

## Analytics (GA4)
- 속성: Google Analytics 계정 "Outsome" / 속성 "outsome.co" (ID 553872459), 스트림 "outsome.co web", 측정 ID `G-LR0M0YV67G`. 로그인: peter@outsome.co
- 태그: 모든 HTML `<head>` 상단 (out/ 11개 + public/pages 9개). 페이지뷰/스크롤/이탈 클릭은 향상된 측정으로 자동.
- /apply 이벤트 (apply.js `track()`; PII 없음, 범주값만):
  apply_start, apply_step_view{step,step_name,via}, apply_step_complete{step,step_name}, apply_select{field,value,step},
  apply_validation_error{step,step_name}, apply_hint_open{field}, apply_ref_click{title,field},
  apply_draft_resume{step}, apply_draft_discard, apply_submit_attempt, apply_submit_success{industry,stage,business_model,referral,has_deck,has_website} (핵심 이벤트),
  apply_submit_error{message}, apply_edit_open, apply_edit_save_attempt, apply_edit_save
- 맞춤 측정기준(이벤트 범위): step_name, via, field, value, industry, stage, business_model, referral, has_deck
- 퍼널 보기: 탐색 > 유입경로 탐색 분석에서 apply_start → apply_step_view(step=2) → (3) → (4) → apply_submit_success
