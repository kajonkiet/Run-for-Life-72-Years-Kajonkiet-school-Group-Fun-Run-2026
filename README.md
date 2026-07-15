function doPost(e) {
  try {
    // นำ ID ที่คัดลอกไว้มาใส่ตรงนี้
    var sheetId = 'ใส่_SHEET_ID_ของคุณที่นี่'; 
    var folderId = 'ใส่_FOLDER_ID_ของคุณที่นี่'; 

    var data = JSON.parse(e.postData.contents);
    var fname = data.fname;
    var lname = data.lname;
    var phone = data.phone;
    var fileData = data.fileBase64;
    var fileName = data.fileName;
    var mimeType = data.mimeType;

    // แปลงไฟล์และบันทึกลง Google Drive
    var folder = DriveApp.getFolderById(folderId);
    var decodedFile = Utilities.base64Decode(fileData.split(',')[1]); 
    var blob = Utilities.newBlob(decodedFile, mimeType, fileName);
    var file = folder.createFile(blob);
    var fileUrl = file.getUrl();

    // บันทึกข้อมูลลง Google Sheets
    var sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    sheet.appendRow([new Date(), fname, lname, phone, fileUrl]);

    return ContentService.createTextOutput(JSON.stringify({
      "status": "success", 
      "message": "บันทึกข้อมูลสำเร็จ"
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      "status": "error", 
      "message": error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
