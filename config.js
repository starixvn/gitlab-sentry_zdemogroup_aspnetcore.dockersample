module.exports = {
  downloadDir: "C:\\BG",
  port: 3200,
  playwright: {
    headless: true,
    browser: "chromium",
  },
  infoSite: {
    url: "https://infosite.klt2p.oneback.net",
    uploadUrl:
      "https://generalexcelupload.klt2u.oneback.net/GeneralExcelUpload/UploadServiceExcel",
    statusUrl:
      "https://generalexcelupload.klt2u.oneback.net/GeneralExcelUpload/GetServiceTask?task_status=99&task_range=10",
    username: "nexcel1",
    password: "1234aa",
  },
};
