function doPost(e) {
  try {
    const sheet = SpreadsheetApp
      .openById("")
      .getSheetByName("SHEET_NAME"); // change if needed

    const data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      new Date(),                 // Timestamp
      data.email,
      data.name,
      data.college,
      data.year,
      data.events,                // "HackQuest, Flashback"
      data.food
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
