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
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var data = JSON.parse(e.postData.contents);
  
  if (data.formType === 'contact') {
    var s = sheet.getSheetByName('Contact');
    s.appendRow([data.name, data.email, data.phone, data.message, new Date()]);
  } else if (data.formType === 'subscribe') {
    var s = sheet.getSheetByName('Subscribers');
    s.appendRow([data.email, new Date()]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({result: 'ok'}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

## 3단계: HTML 폼 업데이트
Apps Script URL을 받으면, Aside에게 알려주세요. 
HTML 폼의 action을 그 URL로 바꿔드립니다.
