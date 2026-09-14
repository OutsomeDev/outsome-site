# Form → Google Sheets 연결 가이드

## 1단계: Google Sheets 만들기
1. Google Sheets에서 새 스프레드시트 생성
2. 이름: "Outsome Form Submissions"
3. Sheet1 이름을 "Contact" 으로 변경 → 헤더: Name, Email, Phone, Message, Date
4. Sheet2 추가, 이름 "Subscribers" → 헤더: Email, Date

## 2단계: Apps Script 배포
1. Sheets에서 Extensions > Apps Script 클릭
2. 아래 코드 붙여넣기
3. Deploy > New deployment > Web app > Anyone 선택 > Deploy
4. URL 복사

## Apps Script 코드:
```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.openById("1ke-AcuJK9LFV__UsMGvAwlak1YYpg-ETzWamj4jtdqY");
  var data = JSON.parse(e.postData.contents);
  
  if (data.formType === "contact") {
    var s = sheet.getSheets()[0];
    s.appendRow([
      new Date().toISOString().split("T")[0],
      data.name,
      data.email,
      data.phone,
      data.message,
      "New"
    ]);
  }
  
  if (data.formType === "subscribe") {
    var s2 = sheet.getSheetByName("시트2") || sheet.getSheets()[2];
    s2.appendRow([
      data.email,
      data.source || "Website",
      new Date().toISOString().split("T")[0]
    ]);
  }
  
  if (data.formType === "application") {
    var sa = sheet.getSheetByName("Applications") || sheet.getSheets()[1];
    sa.appendRow([
      new Date().toISOString().split("T")[0],
      data.founderNameKr || "",
      data.founderNameEn || "",
      data.phone || "",
      data.email || "",
      data.linkedin || "",
      data.companyName || "",
      data.website || "",
      data.oneLiner || "",
      data.industry || "",
      data.deckUrl || "",
      data.productStage || "",
      data.businessModel || "",
      data.targetProblem || "",
      data.targetCustomer || "",
      data.whyUS || "",
      data.referral || "",
      data.consent || ""
    ]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({result: "ok"})).setMimeType(ContentService.MimeType.JSON);
}
```

## Sheets 구조
- 시트1 (index 0): Contact — Date, Name, Email, Phone, Message, Status
- Applications (index 1): Applications — Date, Founder Name (KR/EN), Phone, Email, LinkedIn, Company, Website, One Liner, Industry, Deck URL, Product Stage, BM, Target Problem/Customer, Why US, Referral, Consent
- 시트2 (index 2): Subscribers — Email, Source, Date

## 3단계: HTML 폼 업데이트
- Contact/Subscribe: form-handler.js에서 처리
- Application: apply.html 내 인라인 스크립트에서 처리 (formType: 'application')
