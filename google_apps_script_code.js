/**
 * Google Apps Script untuk sinkronisasi Database Karerr.com ke Google Sheets pribadi pengguna.
 * Deploy sebagai Web App:
 * 1. Klik 'Deploy' -> 'New Deployment'
 * 2. Pilih type: Web App
 * 3. Execute as: Me
 * 4. Who has access: Anyone
 */

function doPost(e) {
  try {
    var requestData = JSON.parse(e.postData.contents);
    var sheetId = requestData.sheetId;
    var action = requestData.action;

    if (!sheetId) {
      return ContentService.createTextOutput(JSON.stringify({status: "error", message: "ID Sheet tidak ditemukan."}))
                           .setMimeType(ContentService.MimeType.JSON);
    }

    var spreadsheet = SpreadsheetApp.openById(sheetId);
    var sheet = spreadsheet.getSheets()[0]; // Ambil sheet pertama

    // Inisialisasi Header jika Sheet masih kosong
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Tanggal", "Judul Produk", "Kategori", "Harga", "Link Transaksi"]);
    }

    if (action === "add") {
      var date = new Date();
      var title = requestData.title;
      var category = requestData.category;
      var price = requestData.price;
      var checkoutUrl = requestData.checkoutUrl;

      sheet.appendRow([date, title, category, price, checkoutUrl]);

      return ContentService.createTextOutput(JSON.stringify({status: "success", message: "Produk berhasil ditambahkan ke Google Sheets."}))
                           .setMimeType(ContentService.MimeType.JSON);
    }

    return ContentService.createTextOutput(JSON.stringify({status: "error", message: "Aksi tidak dikenali."}))
                         .setMimeType(ContentService.MimeType.JSON);

  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({status: "error", message: err.toString()}))
                         .setMimeType(ContentService.MimeType.JSON);
  }
}

// Tambahkan dukungan GET jika diperlukan untuk testing endpoint
function doGet(e) {
  return ContentService.createTextOutput("Endpoint Google Sheets Karerr.com Aktif & Siap Menerima POST.");
}